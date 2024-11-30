// Mapping error signatures and messages to readable strings
const errorMessages: Record<string, string> = {
    // Custom Errors
    RequiredApprovalsCantExceedSignatories:
        "The required approvals cannot exceed the total number of signatories.",
    RequiredApprovalsCantBeZero: "The required approvals cannot be zero.",
    NotASignatoryForThisWallet: "You are not a signatory for this wallet.",
    TransactionDoesNotExist: "The specified transaction does not exist.",
    TransactionAlreadyExecuted: "This transaction has already been executed.",
    TransactionExecutionToAddressFailed:
        "Failed to execute the transaction to the specified address.",
    MinimumApprovalsForTransactionNotMet:
        "The minimum number of approvals for this transaction has not been met.",
    DuplicateSignatoryAddress: "A signatory address is duplicated.",
    NoVotesToReset: "There are no votes available to reset.",

    // MetaMask and RPC Errors
    UserRejected: "The transaction request was rejected by the user. Please try again.",
    InsufficientFunds:
        "The total cost of executing this transaction exceeds the balance of the account. Please ensure you have enough ETH to cover the transaction cost.",
    MetaMaskError: "MetaMask Tx Signature: User denied transaction signature.",

    // Adding error signatures for better handling
    "0x12345678": "Custom error description for signature 0x12345678.",
    "0x9abcdef0": "Another error mapped to this signature.",
};

export const parseContractError = (error: any): string => {
    const errorString = error.message || error.toString();

    // Specific string matches for common issues
    if (errorString.includes("insufficient funds for gas * price + value")) {
        return errorMessages.InsufficientFunds;
    }

    if (errorString.includes("User denied transaction signature")) {
        return errorMessages.UserRejected;
    }

    if (errorString.includes("MetaMask Tx Signature")) {
        return errorMessages.MetaMaskError;
    }

    // Match custom error names (e.g., `error RequiredApprovalsCantExceedSignatories()`)
    const matchedError = errorString.match(/\b[A-Za-z]+\(\)/);
    if (matchedError) {
        const errorName = matchedError[0].replace("()", "");
        if (errorMessages[errorName]) {
            return errorMessages[errorName];
        }
    }

    // Match error signatures (e.g., `0x12345678`)
    const signatureMatch = errorString.match(/0x[0-9a-fA-F]{8}/);
    if (signatureMatch && errorMessages[signatureMatch[0]]) {
        return errorMessages[signatureMatch[0]];
    }

    // Fallback for unknown errors
    return "An unknown error occurred. Please try again.";
};
