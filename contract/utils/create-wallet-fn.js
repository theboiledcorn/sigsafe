const createWalletABI = [
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
];

module.exports = { createWalletABI };
