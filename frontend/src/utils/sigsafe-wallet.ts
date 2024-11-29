export const SIGSAFE_WALLET = [
    {
        inputs: [
            {
                internalType: "uint256",
                name: "noOfRequiredApprovals",
                type: "uint256",
            },
            {
                internalType: "address[]",
                name: "_signatories",
                type: "address[]",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "DuplicateSignatoryAddress",
        type: "error",
    },
    {
        inputs: [],
        name: "MinimumApprovalsForTransactionNotMet",
        type: "error",
    },
    {
        inputs: [],
        name: "NoVotesToReset",
        type: "error",
    },
    {
        inputs: [],
        name: "NotASignatoryForThisWallet",
        type: "error",
    },
    {
        inputs: [],
        name: "ReentrancyGuardReentrantCall",
        type: "error",
    },
    {
        inputs: [],
        name: "RequiredApprovalsCantBeZero",
        type: "error",
    },
    {
        inputs: [],
        name: "RequiredApprovalsCantExceedSignatories",
        type: "error",
    },
    {
        inputs: [],
        name: "TransactionAlreadyExecuted",
        type: "error",
    },
    {
        inputs: [],
        name: "TransactionDoesNotExist",
        type: "error",
    },
    {
        inputs: [],
        name: "TransactionExecutionToAddressFailed",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "by",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "toWallet",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "when",
                type: "uint256",
            },
        ],
        name: "MoneyReceived",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "by",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "toWallet",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "txID",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "when",
                type: "uint256",
            },
        ],
        name: "SignatoryVoted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "by",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "toWallet",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "toAddress",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "txID",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "when",
                type: "uint256",
            },
        ],
        name: "TransactionExecuted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "by",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "toWallet",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "txID",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "when",
                type: "uint256",
            },
        ],
        name: "TransactionInitiated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "by",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "txID",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "when",
                type: "uint256",
            },
        ],
        name: "VoteReset",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_transactionId",
                type: "uint256",
            },
        ],
        name: "finalizeTransaction",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_transactionId",
                type: "uint256",
            },
        ],
        name: "getTransaction",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "transactionId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "initiatedAt",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "executedAt",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "to",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "value",
                        type: "uint256",
                    },
                    {
                        internalType: "bytes",
                        name: "data",
                        type: "bytes",
                    },
                    {
                        internalType: "bytes",
                        name: "metadata",
                        type: "bytes",
                    },
                    {
                        internalType: "bool",
                        name: "executed",
                        type: "bool",
                    },
                    {
                        internalType: "uint256",
                        name: "approvalCount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "rejectionCount",
                        type: "uint256",
                    },
                ],
                internalType: "struct SigsafeWallet.Transaction",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getWallet",
        outputs: [
            {
                internalType: "address[]",
                name: "_signatories",
                type: "address[]",
            },
            {
                internalType: "uint256",
                name: "_noOfApprovals",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_noOfRejections",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_transactionCount",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "_walletAddress",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_value",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "_txData",
                type: "bytes",
            },
            {
                internalType: "bytes",
                name: "_metadata",
                type: "bytes",
            },
        ],
        name: "initiateTransaction",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "isSignatory",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_transactionId",
                type: "uint256",
            },
        ],
        name: "resetVote",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "signatoryVotes",
        outputs: [
            {
                internalType: "enum SigsafeWallet.VoteType",
                name: "",
                type: "uint8",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_transactionId",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "_approve",
                type: "bool",
            },
        ],
        name: "voteForTransaction",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        stateMutability: "payable",
        type: "receive",
    },
] as const;
