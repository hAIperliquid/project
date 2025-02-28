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

contract SampleAvsLogicDataReader is IAvsLogic {
    struct TaskData {
        uint8 activity;
        uint8 category;  
        uint256 amountA;
        uint256 amountB;
    }
    
    uint256 public counter;
    IAttestationCenter.TaskInfo public lastTaskInfo;
    address public attestationCenter;
    TaskData public lastTaskData;

    constructor (address _attestationCenter) {
        attestationCenter = _attestationCenter;
    }

    function afterTaskSubmission(IAttestationCenter.TaskInfo calldata _taskInfo, bool _isApproved, bytes calldata /* _tpSignature */, uint256[2] calldata /* _taSignature */, uint256[] calldata /* _operatorIds */) external {
        require(msg.sender == attestationCenter, "Not allowed");

        lastTaskInfo = _taskInfo;

        if(_isApproved){
            // Old Stuff here
            lastTaskInfo = _taskInfo;
            counter++;

            // Read the TaskInfoData;
            (uint8 activity, uint8 category, uint256 amountA, uint256 amountB) = abi.decode(_taskInfo.data, (uint8, uint8, uint256, uint256));
            TaskData memory task = TaskData(activity, category, amountA, amountB);
            lastTaskData = task;
        }
    }

    function beforeTaskSubmission(IAttestationCenter.TaskInfo calldata _taskInfo, bool _isApproved, bytes calldata _tpSignature, uint256[2] calldata _taSignature, uint256[] calldata _operatorIds) external {
        // No implementation
    }
}
