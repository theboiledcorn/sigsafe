export const SIGSAFE_FACTORY = [
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
                indexed: false,
                internalType: "uint256",
                name: "when",
                type: "uint256",
            },
        ],
        name: "WalletCreated",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "noOfRequiredSignatories",
                type: "uint256",
            },
            {
                internalType: "address[]",
                name: "_signatories",
                type: "address[]",
            },
        ],
        name: "createWallet",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_initiatorAddress",
                type: "address",
            },
        ],
        name: "getWallets",
        outputs: [
            {
                internalType: "address[]",
                name: "",
                type: "address[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
] as const;
