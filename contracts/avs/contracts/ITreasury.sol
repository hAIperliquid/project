// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface ITreasury{
    function executeApprovedTask(bytes calldata data) external;
}