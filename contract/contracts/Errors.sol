// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

library SigsafeError {
    error RequiredApprovalsCantExceedSignatories();
    error RequiredApprovalsCantBeZero();
    error NotASignatoryForThisWallet();
    error TransactionDoesNotExist();
    error TransactionAlreadyExecuted();
    error TransactionExecutionToAddressFailed();
    error MinimumApprovalsForTransactionNotMet();
    error DuplicateSignatoryAddress();
    error NoVotesToReset();
}
