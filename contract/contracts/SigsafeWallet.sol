// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./Errors.sol";
import "./SigsafeEvents.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SigsafeWallet is ReentrancyGuard {
    struct Transaction {
        uint transactionId;
        uint initiatedAt;
        uint executedAt;
        address to;
        uint256 value;
        bytes data;
        bytes metadata;
        bool executed;
        uint256 approvalCount;
        uint256 rejectionCount;
    }

    enum VoteType {
        Unvoted,
        Approved,
        Rejected
    }

    uint immutable NO_OF_REQUIRED_APPROVALS;
    uint immutable NO_OF_REQUIRED_REJECTIONS;
    mapping(uint => Transaction) transaction;
    uint transactionCount;

    address[] SIGNATORIES;
    mapping(address => bool) public isSignatory;

    mapping(uint256 => mapping(address => VoteType)) public signatoryVotes;

    modifier isValidSignatory() {
        if (!isSignatory[msg.sender]) {
            revert SigsafeError.NotASignatoryForThisWallet();
        }
        _;
    }

    modifier TransactionNotExecuted(uint _transactionId) {
        if (transaction[_transactionId].initiatedAt == 0) revert SigsafeError.TransactionDoesNotExist();
        if (transaction[_transactionId].executed == true) revert SigsafeError.TransactionAlreadyExecuted();
        _;
    }

    constructor(uint noOfRequiredApprovals, address[] memory _signatories) {
        if (noOfRequiredApprovals > _signatories.length) revert SigsafeError.RequiredApprovalsCantExceedSignatories();

        if (noOfRequiredApprovals == 0) revert SigsafeError.RequiredApprovalsCantBeZero();

        // Check for duplicate addresses
        for (uint i = 0; i < _signatories.length; i++) {
            for (uint j = i + 1; j < _signatories.length; j++) {
                if (_signatories[i] == _signatories[j]) {
                    revert SigsafeError.DuplicateSignatoryAddress();
                }
            }
        }

        if (noOfRequiredApprovals != _signatories.length) {
            NO_OF_REQUIRED_REJECTIONS = _signatories.length - noOfRequiredApprovals + 1;
        } else {
            NO_OF_REQUIRED_REJECTIONS = _signatories.length;
        }

        NO_OF_REQUIRED_APPROVALS = noOfRequiredApprovals;

        SIGNATORIES = _signatories;
        for (uint i = 0; i < _signatories.length; i++) {
            isSignatory[_signatories[i]] = true;
        }

        transactionCount = 0;
    }

    function initiateTransaction(
        address _to,
        uint256 _value,
        bytes memory _txData,
        bytes memory _metadata
    ) external isValidSignatory {
        Transaction memory newTX = Transaction({
            transactionId: transactionCount,
            initiatedAt: block.timestamp,
            executedAt: 0,
            executed: false,
            to: _to,
            value: _value,
            data: _txData,
            metadata: _metadata,
            approvalCount: 0,
            rejectionCount: 0
        });

        transaction[transactionCount] = newTX;
        transactionCount++;

        emit SigsafeEvents.TransactionInitiated(
            msg.sender,
            address(this),
            newTX.transactionId,
            _value,
            block.timestamp
        );
    }

    function voteForTransaction(
        uint _transactionId,
        bool _approve
    ) external isValidSignatory TransactionNotExecuted(_transactionId) {
        VoteType currentSignatoryVote = signatoryVotes[_transactionId][msg.sender];

        if (currentSignatoryVote == VoteType.Approved) {
            transaction[_transactionId].approvalCount--;
        } else if (currentSignatoryVote == VoteType.Rejected) {
            transaction[_transactionId].rejectionCount--;
        }

        if (_approve == true) {
            signatoryVotes[_transactionId][msg.sender] = VoteType.Approved;
            transaction[_transactionId].approvalCount++;
        } else {
            signatoryVotes[_transactionId][msg.sender] = VoteType.Rejected;
            transaction[_transactionId].rejectionCount++;
        }

        emit SigsafeEvents.SignatoryVoted(msg.sender, address(this), _transactionId, block.timestamp);
    }

    function resetVote(uint _transactionId) external isValidSignatory TransactionNotExecuted(_transactionId) {
        VoteType currentSignatoryVote = signatoryVotes[_transactionId][msg.sender];

        if (currentSignatoryVote == VoteType.Unvoted) revert SigsafeError.NoVotesToReset();

        if (currentSignatoryVote == VoteType.Approved) {
            transaction[_transactionId].approvalCount--;
        } else {
            transaction[_transactionId].rejectionCount--;
        }

        signatoryVotes[_transactionId][msg.sender] = VoteType.Unvoted;

        emit SigsafeEvents.VoteReset(msg.sender, address(this), _transactionId, block.timestamp);
    }

    function finalizeTransaction(
        uint _transactionId
    ) external nonReentrant isValidSignatory TransactionNotExecuted(_transactionId) {
        Transaction storage _transaction = transaction[_transactionId];

        if (
            _transaction.approvalCount < NO_OF_REQUIRED_APPROVALS &&
            _transaction.rejectionCount >= NO_OF_REQUIRED_REJECTIONS
        ) {
            _transaction.executed = true;
        }

        if (_transaction.approvalCount >= NO_OF_REQUIRED_APPROVALS) {
            if (_transaction.to == address(0)) {
                _transaction.executed = true;
            } else {
                (bool txSuccess, ) = _transaction.to.call{value: _transaction.value}(_transaction.data);

                if (!txSuccess) {
                    revert SigsafeError.TransactionExecutionToAddressFailed();
                }
                _transaction.executed = true;
            }
        } else {
            revert SigsafeError.MinimumApprovalsForTransactionNotMet();
        }

        _transaction.executedAt = block.timestamp;

        emit SigsafeEvents.TransactionExecuted(
            msg.sender,
            address(this),
            _transaction.to,
            _transaction.transactionId,
            _transaction.value,
            block.timestamp
        );
    }

    function getTransaction(uint _transactionId) external view returns (Transaction memory) {
        return transaction[_transactionId];
    }

    function getWallet()
        external
        view
        returns (
            address[] memory _signatories,
            uint _noOfApprovals,
            uint _noOfRejections,
            uint _transactionCount,
            address _walletAddress
        )
    {
        return (SIGNATORIES, NO_OF_REQUIRED_APPROVALS, NO_OF_REQUIRED_REJECTIONS, transactionCount, address(this));
    }

    receive() external payable {
        emit SigsafeEvents.MoneyReceived(msg.sender, address(this), msg.value, block.timestamp);
    }
}
