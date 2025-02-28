// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/**
 *  Mock AMM Pool with Swapping + Liquidity Deposit/Withdrawal Feature to simulate Uniswap Liquidity Pool 
 * 
 *  V1 Example: https://amoy.polygonscan.com/address/0xAdc2743E7C1ef414f08FbC595D991c437B5FEaD7
 * 
 *  Upgrades from Mock V1 Version:
 *  - Include Dynamic Liquidity Withdrawal (user can withdraw their liqudiity position partially)
 *  - Change Withdrawal Logic (to simulate withdrawal proecesses)
 *  - Functionality might not follow the best practices for demo purposes
 */
contract MockAmmV2 {
    address public immutable tokenA;
    address public immutable tokenB;
    uint256 public reserveA;
    uint256 public reserveB;
    
    mapping(address => uint256) public liquidity;

    event Swap(address indexed user, address indexed inputToken, uint256 inputAmount, uint256 outputAmount);
    event LiquidityAdded(address indexed user, uint256 amountA, uint256 amountB);
    event LiquidityRemoved(address indexed user, uint256 amountA, uint256 amountB);

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

    function removeLiquidity(uint256 amountA, uint256 amountB) external  returns(uint256, uint256){
        require(amountA > 0 && amountB > 0, "Withdraw amount must be greater than 0");
        require(liquidity[msg.sender] >= amountA+amountB, "Insufficient liquidity");

        // Mock fee collection by withdrawing extra 0-1% of the user's withdrawal amount
        uint256 feePercent = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 100; // 0-99 -> 0-1%
        uint256 extraFeeA = (amountA * feePercent) / 10000; // Convert to percentage
        uint256 extraFeeB = (amountB * feePercent) / 10000;

        uint256 withdrawedA = amountA + extraFeeA;
        uint256 withdrawedB = amountB + extraFeeB;

        IERC20(tokenA).transferFrom(msg.sender, address(this), withdrawedA);
        IERC20(tokenB).transferFrom(msg.sender, address(this), withdrawedB);

        reserveA -= withdrawedA;
        reserveB -= withdrawedB;
        liquidity[msg.sender] -= (amountA+amountB);

        emit LiquidityRemoved(msg.sender, withdrawedA, withdrawedB);

        return(amountA, amountB);
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
