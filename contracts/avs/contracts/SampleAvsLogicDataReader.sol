// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.20;

/*______     __      __                              __      __ 
 /      \   /  |    /  |                            /  |    /  |
/$$$$$$  | _$$ |_   $$ |____    ______   _______   _$$ |_   $$/   _______ 
$$ |  $$ |/ $$   |  $$      \  /      \ /       \ / $$   |  /  | /       |
$$ |  $$ |$$$$$$/   $$$$$$$  |/$$$$$$  |$$$$$$$  |$$$$$$/   $$ |/$$$$$$$/ 
$$ |  $$ |  $$ | __ $$ |  $$ |$$    $$ |$$ |  $$ |  $$ | __ $$ |$$ |
$$ \__$$ |  $$ |/  |$$ |  $$ |$$$$$$$$/ $$ |  $$ |  $$ |/  |$$ |$$ \_____ 
$$    $$/   $$  $$/ $$ |  $$ |$$       |$$ |  $$ |  $$  $$/ $$ |$$       |
 $$$$$$/     $$$$/  $$/   $$/  $$$$$$$/ $$/   $$/    $$$$/  $$/  $$$$$$$/
*/

import './IAvsLogic.sol';

contract SampleAvsLogicCounter is IAvsLogic {
    uint256 public counter;
    IAttestationCenter.TaskInfo public lastTaskInfo;
    address public attestationCenter;

    constructor (address _attestationCenter) {
        attestationCenter = _attestationCenter;
    }

    function afterTaskSubmission(IAttestationCenter.TaskInfo calldata _taskInfo, bool /* _isApproved */, bytes calldata /* _tpSignature */, uint256[2] calldata /* _taSignature */, uint256[] calldata /* _operatorIds */) external {
        require(msg.sender == attestationCenter, "Not allowed");

        lastTaskInfo = _taskInfo;
        counter++;
    }

    function beforeTaskSubmission(IAttestationCenter.TaskInfo calldata _taskInfo, bool _isApproved, bytes calldata _tpSignature, uint256[2] calldata _taSignature, uint256[] calldata _operatorIds) external {
        // No implementation
    }
}