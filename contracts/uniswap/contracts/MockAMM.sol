// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/* Mock AMM Pool with Swapping + Liquidity Deposit/Withdrawal Feature to simulate Uniswap Liquidity Pool */
contract MockAMM {
    address public immutable tokenA;
    address public immutable tokenB;
    uint256 public reserveA;
    uint256 public reserveB;
    
    mapping(address => uint256) public liquidity;

    event Swap(address indexed user, address indexed inputToken, uint256 inputAmount, uint256 outputAmount);
    event LiquidityAdded(address indexed user, uint256 amountA, uint256 amountB);
    event LiquidityRemoved(address indexed user, uint256 amountA, uint256 amountB, uint256 feesCollected);

    constructor(address _tokenA, address _tokenB) {
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    function _safeTransfer(address token, address to, uint256 amount) private {
        require(IERC20(token).transfer(to, amount), "Transfer failed");
    }

    function getReserves() public view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external {
        require(amountA > 0 && amountB > 0, "Amounts must be greater than 0");
        
        IERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountB);
        
        reserveA += amountA;
        reserveB += amountB;
        liquidity[msg.sender] += amountA + amountB;
        
        emit LiquidityAdded(msg.sender, amountA, amountB);
    }

    function removeLiquidity() external {
        uint256 userLiquidity = liquidity[msg.sender];
        require(userLiquidity > 0, "No liquidity to remove");

        // Calculate the user's share of reserves
        uint256 amountA = (reserveA * userLiquidity) / (reserveA + reserveB);
        uint256 amountB = (reserveB * userLiquidity) / (reserveA + reserveB);

        // Mock fee collection by withdrawing extra 0-1% of the user's total liquidity
        uint256 feePercent = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 100; // 0-99 -> 0-1%
        uint256 extraFeeA = (amountA * feePercent) / 10000; // Convert to percentage
        uint256 extraFeeB = (amountB * feePercent) / 10000;

        reserveA -= (amountA + extraFeeA);
        reserveB -= (amountB + extraFeeB);
        liquidity[msg.sender] = 0;

        _safeTransfer(tokenA, msg.sender, amountA);
        _safeTransfer(tokenB, msg.sender, amountB);

        emit LiquidityRemoved(msg.sender, amountA, amountB, extraFeeA + extraFeeB);
    }

    function swap(address inputToken, uint256 inputAmount) external {
        require(inputToken == tokenA || inputToken == tokenB, "Invalid token");
        require(inputAmount > 0, "Amount must be greater than 0");
        
        (uint256 reserveIn, uint256 reserveOut, address outputToken) = inputToken == tokenA
            ? (reserveA, reserveB, tokenB)
            : (reserveB, reserveA, tokenA);

        require(reserveIn > 0 && reserveOut > 0, "Insufficient liquidity");
        
        uint256 outputAmount = (inputAmount * reserveOut) / (reserveIn + inputAmount);
        
        require(outputAmount > 0, "Invalid output amount");

        IERC20(inputToken).transferFrom(msg.sender, address(this), inputAmount);
        _safeTransfer(outputToken, msg.sender, outputAmount);
        
        if (inputToken == tokenA) {
            reserveA += inputAmount;
            reserveB -= outputAmount;
        } else {
            reserveB += inputAmount;
            reserveA -= outputAmount;
        }
        
        emit Swap(msg.sender, inputToken, inputAmount, outputAmount);
    }
}
