// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IMockAmmV2{
    function addLiquidity(uint256 amountA, uint256 amountB) external;
    function removeLiquidity(uint256 withdrawAmount) external returns(uint256, uint256);
    function getReserves() external view returns (uint256, uint256);
}