// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IMockAmmV2.sol";

/**
 * @dev Interface for the authorized caller that handles deposit & withdraw to yield protocols
 */
interface ICaller {
    function depositLiquidity(
        bytes calldata data,
        address tokenA,
        address tokenB,
        uint256 tokenAAmount,
        uint256 tokenBAmount
    ) external;

    function withdrawLiquidity(
        bytes calldata data,
        address tokenA,
        address tokenB,
        uint256 tokenAAmount,
        uint256 tokenBAmount
    ) external returns (uint256 withdrawnTokenA, uint256 withdrawnTokenB);
}

/**
 * @title Treasury Contract
 * @dev Stores user deposits in "units" that are priced by an index. 
 *      The index price increases as yield is realized from an external strategy.
 * 
 * Fix bug from V1 when calling anohter liquidity pool
 */
contract TreasuryV2 {    
    // Information of a Token (Price of a Liquidity Position Unit, Total Token Units & Liquidity in the treasury)
    struct TokenInfo {
        uint256 indexPrice;      // Liquidity / Units
        uint256 totalUnits;      // Suppply of Units  
        uint256 totalLiquidity;  // Supply of Tokens
    }
    struct StrategyInfo{
        IMockAmmV2 pool;
        address tokenA;
        address tokenB;
    }
    address public owner;            
    address public authorizedCaller;
    uint256 public DEFAULT_INDEX_PRICE = 1e6; 

   
    // Information of each token in the Treasury Pool
    mapping(address => TokenInfo) public tokenInfo;
    // User's Position stored in Units for each token
    mapping(address => mapping(address => uint256)) public userUnits;
    // Track the amount of used liquidity from the Pool
    mapping(address => uint256) public strategyDeposits;
    // Configurations of authorized pool execution
    mapping(uint8 => StrategyInfo) public allowedStrategies;
    
    event AuthorizedCallerSet(address indexed newAuthorizedCaller);
    event Deposited(address indexed user, address indexed token, uint256 amount, uint256 units);
    event Withdrawn(address indexed user, address indexed token, uint256 units, uint256 amount);
    event StrategyOpened(
        address indexed caller,
        address pool,
        address tokenA,
        address tokenB,
        uint256 tokenAAmount,
        uint256 tokenBAmount
    );
    event StrategyClosed(
        address indexed caller,
        address tokenA,
        address tokenB,
        uint256 receivedA,
        uint256 receivedB
    );
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyAuthorizedCaller() {
        require(msg.sender == address(authorizedCaller), "Not authorized caller");
        _;
    }
    
    /**
     * @param _authorizedCaller The initial contract that can deposit/withdraw to yield strategy
     * @param _owner The owner (admin) address
     */
    constructor(address _authorizedCaller, address _owner) {
        authorizedCaller = _authorizedCaller;
        owner = _owner == address(0) ? msg.sender : _owner;
    }

    /**
     * @dev Change the authorized contract that can use the treasury funds for yield strategies
     */
    function setAuthorizedCaller(address _authorizedCaller) external onlyOwner {
        authorizedCaller = _authorizedCaller;
        emit AuthorizedCallerSet(address(_authorizedCaller));
    }

    /**
     * @dev Initialize a new Strategy Pool for the user
     */
    function setStrategyPool(uint8 id, IMockAmmV2 pool, address _tokenA, address _tokenB) external onlyOwner {
        // Remove Old Pool if it exists
        if(allowedStrategies[id].tokenA!= address(0) || allowedStrategies[id].tokenB != address(0)){
            _approveAllowance(allowedStrategies[id].tokenA, address(allowedStrategies[id].tokenA), 0);
            _approveAllowance(allowedStrategies[id].tokenA, address(allowedStrategies[id].tokenB), 0);
        }
        // Add New Pool
        allowedStrategies[id] = StrategyInfo(pool, _tokenA, _tokenB);
        _approveAllowance(_tokenA, address(pool), type(uint256).max);
        _approveAllowance(_tokenB, address(pool), type(uint256).max);
    }

    /**
     * @dev Approved the fund allowance for the authorized contract to use the Treasury Fund
     */
    function _approveAllowance(address token, address _contract, uint256 _amount) internal onlyOwner {
        IERC20(token).approve(_contract, _amount);
    }

    /**
     * @dev Function for users to deposit an ERC-20 token to the Treasury. 
     */
    function deposit(address token, uint256 amount) external {
        require(amount > 0, "Amount must be > 0");

        // Set Token's Index Price if it hasn't been initialized.
        if (tokenInfo[token].indexPrice == 0) {
            tokenInfo[token].indexPrice = DEFAULT_INDEX_PRICE; 
        }
        TokenInfo storage info = tokenInfo[token];

        // Calculate user's received units
        uint256 units = amount / info.indexPrice;
        require(units > 0, "Deposit too small for 1 unit");
        
        // Add Balance Information to Treasury
        info.totalUnits += units;
        info.totalLiquidity += amount;
        userUnits[msg.sender][token] += units;

        // Transfer tokens from User to Treasury
        bool success = IERC20(token).transferFrom(msg.sender, address(this), amount);
        require(success, "Token transfer failed");

        emit Deposited(msg.sender, token, amount, units);
    }

    /**
     * @dev Withdraw a token based on the desired unitAmount.
     *      The amount of token returned = unitAmount * indexPrice.
     */
    function withdraw(address token, uint256 unitAmount) external {
        require(unitAmount > 0, "Units must be > 0");
        require(userUnits[msg.sender][token] >= unitAmount, "Insufficient units");

        // Calculate token amount the user gets
        TokenInfo storage info = tokenInfo[token];
        uint256 tokenAmount = unitAmount * info.indexPrice;
        require(tokenAmount <= info.totalLiquidity, "Not enough liquidity in pool");

        // Reduce Balance Information from Treasury
        userUnits[msg.sender][token] -= unitAmount;
        info.totalUnits -= unitAmount;
        info.totalLiquidity -= tokenAmount;

        // Transfer tokens from Treasury to User
        bool success = IERC20(token).transfer(msg.sender, tokenAmount);
        require(success, "Token transfer failed");

        emit Withdrawn(msg.sender, token, unitAmount, tokenAmount);
    }

    /**
     * @dev Return the owned units of a user for a specific token.
     */
    function getUnitAmount(address token, address user) external view returns (uint256){
        return userUnits[user][token];
    }

    /**
     * @dev Get the total (monetary) liquidity for a user in the pool for a given token.
     *      userLiquidity = userUnits * indexPrice
     */
    function getBalance(address token, address user) external view returns (uint256){
        TokenInfo storage info = tokenInfo[token];
        return userUnits[user][token] * info.indexPrice;
    }
    
    /**
     * @dev Execute a yield strategy by depositing liquidity to the authorizedCaller.
     *      This typically involves transferring tokenA/tokenB to the authorized caller,
     *      then calling depositLiquidity().
     */
    function executeApprovedTask( bytes calldata) external onlyAuthorizedCaller {

    }
}
