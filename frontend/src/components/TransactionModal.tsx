import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaEthereum,
    FaCode,
    FaClipboard,
    FaTimes,
    FaCheckCircle,
    FaExclamationTriangle,
    FaPlus,
    FaTrash,
} from "react-icons/fa";
import { ethers } from "ethers";
import { useAccount, useWriteContract } from "wagmi";
import { useMessageModal } from "../context/MessageModalContext";
import { SIGSAFE_WALLET } from "../utils/sigsafe-wallet";
import { useLoader } from "../context/LoaderContext";
import { parseContractError } from "../utils/errors";

// Enum for transaction types
enum TransactionType {
    METADATA_ONLY = "METADATA_ONLY",
    ETH_TRANSFER = "ETH_TRANSFER",
    CONTRACT_CALL = "CONTRACT_CALL",
}

const SOLIDITY_TYPES = [
    "uint256",
    "uint128",
    "uint64",
    "uint32",
    "uint16",
    "uint8",
    "int256",
    "int128",
    "int64",
    "int32",
    "int16",
    "int8",
    "address",
    "bool",
    "string",
    "bytes",
    "bytes32",
    "bytes16",
    "bytes8",
    "bytes4",
    "address[]",
    "uint256[]",
    "string[]",
    "bool[]",
];

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (transaction: {
        type: TransactionType;
        metadata: string;
        recipient?: string;
        amount?: string;
        contractAddress?: string;
        contractFunction?: string;
        contractArgs?: string[];
        functionParams?: string[];
    }) => void;
    walletAddress: string;
}

interface FunctionParam {
    type: string;
    value: string;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
    isOpen,
    onClose,
    // onSubmit,
    walletAddress,
}) => {
    const [transactionType, setTransactionType] = useState<TransactionType>(
        TransactionType.METADATA_ONLY
    );
    const { startLoading, stopLoading } = useLoader();
    const [metadata, setMetadata] = useState("");
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [contractAddress, setContractAddress] = useState("");
    const [contractFunction, setContractFunction] = useState("");
    const [contractArgs] = useState("");
    const { showMessage } = useMessageModal();
    const { writeContractAsync } = useWriteContract();
    const [functionParams, setFunctionParams] = useState<FunctionParam[]>([]);
    const [generatedABI, setGeneratedABI] = useState("");
    // const [errors, setErrors] = useState({});

    const account = useAccount();

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        // Metadata validation (always required)
        if (!metadata.trim()) {
            newErrors.metadata = "Transaction description is required";
        }

        // Type-specific validations
        switch (transactionType) {
            case TransactionType.ETH_TRANSFER:
                // Validate recipient address
                if (!recipient.trim()) {
                    newErrors.recipient = "Recipient address is required";
                } else if (!ethers.isAddress(recipient)) {
                    newErrors.recipient = "Invalid Ethereum address";
                }

                // Validate amount
                if (!amount.trim()) {
                    newErrors.amount = "Amount is required";
                } else {
                    try {
                        const parsedAmount = parseFloat(amount);
                        if (isNaN(parsedAmount) || parsedAmount <= 0) {
                            newErrors.amount = "Amount must be a positive number";
                        }
                    } catch {
                        newErrors.amount = "Invalid amount";
                    }
                }
                break;

            case TransactionType.CONTRACT_CALL:
                // Validate contract address
                if (!contractAddress.trim()) {
                    newErrors.contractAddress = "Contract address is required";
                } else if (!ethers.isAddress(contractAddress)) {
                    newErrors.contractAddress = "Invalid contract address";
                }

                // Validate contract function
                if (!contractFunction.trim()) {
                    newErrors.contractFunction = "Contract function is required";
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        try {
            // Validate form first
            if (!validateForm()) {
                return;
            }

            // Validate wallet connection
            if (!account.isConnected) {
                showMessage("Please sign in your wallet first", "error", "Connection Required");
                return;
            }

            // Start loading immediately
            startLoading();

            const metadataBytes = ethers.hexlify(ethers.toUtf8Bytes(metadata));

            const transaction = {
                type: transactionType,
                metadata: metadataBytes,
                ...(transactionType === TransactionType.ETH_TRANSFER && {
                    recipient,
                    amount,
                }),
                ...(transactionType === TransactionType.CONTRACT_CALL && {
                    contractAddress,
                    contractFunction,
                    contractArgs: contractArgs
                        ? contractArgs.split(",").map((arg) => arg.trim())
                        : [],
                    functionParams: functionParams ? functionParams.map((arg) => arg.value) : [],
                    generatedABI: JSON.parse(generatedABI)[0],
                }),
            };

            let result;

            console.log(transaction);

            switch (transaction.type) {
                case TransactionType.METADATA_ONLY:
                    result = await writeContractAsync({
                        abi: SIGSAFE_WALLET,
                        address: `0x${String(walletAddress).substring(2)}`,
                        account: account.address,
                        functionName: "initiateTransaction",
                        args: [
                            `0x${String(ethers.ZeroAddress).substring(2)}`,
                            BigInt(0),
                            `0x`,
                            `0x${String(transaction.metadata).substring(2)}`,
                        ],
                    });
                    break;

                case TransactionType.ETH_TRANSFER:
                    if (
                        transaction.amount &&
                        transaction.recipient &&
                        ethers.isAddress(transaction.recipient)
                    ) {
                        result = await writeContractAsync({
                            abi: SIGSAFE_WALLET,
                            address: `0x${String(walletAddress).substring(2)}`,
                            account: account.address,
                            functionName: "initiateTransaction",
                            args: [
                                `0x${String(transaction.recipient).substring(2)}`,
                                ethers.parseEther(transaction.amount),
                                `0x`,
                                `0x${String(transaction.metadata).substring(2)}`,
                            ],
                        });
                    }
                    break;

                case TransactionType.CONTRACT_CALL:
                    if (
                        transaction.contractAddress &&
                        ethers.isAddress(transaction.contractAddress)
                    ) {
                        const abiBytes = ethers.hexlify(
                            ethers.toUtf8Bytes(transaction.generatedABI)
                        );

                        result = await writeContractAsync({
                            abi: SIGSAFE_WALLET,
                            address: `0x${String(walletAddress).substring(2)}`,
                            account: account.address,
                            functionName: "initiateTransaction",
                            args: [
                                `0x${String(transaction.contractAddress).substring(2)}`,
                                BigInt(0),
                                `0x${String(abiBytes).substring(2)}`,
                                `0x${String(transaction.metadata).substring(2)}`,
                            ],
                        });
                    }
                    break;
            }

            // Success handling

            if (result) {
                showMessage(
                    "Transaction initiated successfully",
                    "success",
                    "Transaction Complete"
                );
                onClose();
            }
        } catch (error: any) {
            // Error handling

            showMessage(parseContractError(error), "error");
        } finally {
            // Ensure loading is stopped regardless of success or failure
            stopLoading();
        }
    };

    const addParameter = () => {
        setFunctionParams([...functionParams, { type: "uint256", value: "" }]);
    };

    const removeParameter = (index: any) => {
        const newParams = functionParams.filter((_, i) => i !== index);
        setFunctionParams(newParams);
    };

    const updateParameter = (index: number, field: keyof FunctionParam, value: string) => {
        const newParams = [...functionParams];
        newParams[index][field] = value;
        setFunctionParams(newParams);
    };

    const generateABI = () => {
        // Validate inputs
        const newErrors: { [key: string]: string } = {};

        if (!contractFunction.trim()) {
            newErrors.contractFunction = "Function name is required";
        }

        // Validate parameters
        const paramTypes = functionParams.map((param) => {
            if (!param.type) {
                newErrors[`param_${functionParams.indexOf(param)}`] = "Type is required";
            }
            return param.type;
        });

        setErrors(newErrors);

        // If there are errors, stop
        if (Object.keys(newErrors).length > 0) return;

        // Generate ABI string
        const abiSignature =
            functionParams.length > 0
                ? `function ${contractFunction}(${paramTypes.join(", ")})`
                : `function ${contractFunction}()`;

        setGeneratedABI(JSON.stringify([abiSignature], null, 2));
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[999] flex items-center justify-center bg-light-lavender bg-opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="bg-pale-lilac dark:bg-bright-purple rounded-xl shadow-2xl w-full max-w-[80vw] p-6 max-h-[90vh] overflow-y-auto scrollbar-hidden relative lg:max-w-md"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-royal-purple dark:text-soft-lilac hover:text-bright-purple"
                    >
                        <FaTimes className="text-2xl" />
                    </button>

                    <h2 className="text-2xl font-bold mb-6 text-royal-purple dark:text-soft-lilac">
                        Initiate Transaction
                    </h2>

                    {/* Transaction Type Selector */}
                    <div className="mb-4">
                        <label className="block text-royal-purple dark:text-light-lavender mb-2">
                            Transaction Type
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.values(TransactionType).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setTransactionType(type)}
                                    className={`
                    p-2 rounded flex items-center justify-center 
                    ${
                        transactionType === type
                            ? "bg-vivid-lavender text-white"
                            : "bg-light-lavender text-royal-purple"
                    }
                  `}
                                >
                                    {type === TransactionType.METADATA_ONLY && (
                                        <FaClipboard className="mr-2" />
                                    )}
                                    {type === TransactionType.ETH_TRANSFER && (
                                        <FaEthereum className="mr-2" />
                                    )}
                                    {type === TransactionType.CONTRACT_CALL && (
                                        <FaCode className="mr-2" />
                                    )}
                                    {type
                                        .split("_")
                                        .map((word) => word[0] + word.slice(1).toLowerCase())
                                        .join(" ")}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Metadata Input (Always Required) */}
                    <div className="mb-4">
                        <label className="block text-royal-purple dark:text-light-lavender mb-2">
                            Transaction Description
                        </label>
                        <textarea
                            value={metadata}
                            onChange={(e) => setMetadata(e.target.value)}
                            className="w-full p-2 rounded bg-white dark:bg-royal-purple text-royal-purple dark:text-white"
                            placeholder="Provide a brief description of the transaction, 80 characters max"
                            rows={3}
                            maxLength={80}
                        />
                        {errors.metadata && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                                <FaExclamationTriangle className="mr-2" />
                                {errors.metadata}
                            </p>
                        )}
                    </div>

                    {/* Conditional Inputs Based on Transaction Type */}
                    {transactionType === TransactionType.ETH_TRANSFER && (
                        <>
                            <div className="mb-4">
                                <label className="block text-royal-purple dark:text-light-lavender mb-2">
                                    Recipient Address
                                </label>
                                <input
                                    type="text"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    className="w-full p-2 rounded bg-white dark:bg-royal-purple text-royal-purple dark:text-white"
                                    placeholder="0x..."
                                />
                                {errors.recipient && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <FaExclamationTriangle className="mr-2" />
                                        {errors.recipient}
                                    </p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-royal-purple dark:text-light-lavender mb-2">
                                    Amount (ETH)
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full p-2 rounded bg-white dark:bg-royal-purple text-royal-purple dark:text-white"
                                    placeholder="0.1"
                                    step="0.01"
                                />
                                {errors.amount && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <FaExclamationTriangle className="mr-2" />
                                        {errors.amount}
                                    </p>
                                )}
                            </div>
                        </>
                    )}

                    {transactionType === "CONTRACT_CALL" && (
                        <>
                            <div className="mb-4">
                                <label className="block text-royal-purple dark:text-light-lavender mb-2">
                                    Contract Address
                                </label>
                                <input
                                    type="text"
                                    value={contractAddress}
                                    onChange={(e) => setContractAddress(e.target.value)}
                                    className="w-full p-2 rounded bg-white dark:bg-royal-purple text-royal-purple dark:text-white border border-vivid-lavender"
                                    placeholder="0x..."
                                />
                                {errors.contractAddress && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <FaExclamationTriangle className="mr-2" />
                                        {errors.contractAddress}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-royal-purple dark:text-light-lavender mb-2">
                                    Contract Function Name
                                </label>
                                <input
                                    type="text"
                                    value={contractFunction}
                                    onChange={(e) => setContractFunction(e.target.value)}
                                    className="w-full p-2 rounded bg-white dark:bg-royal-purple text-royal-purple dark:text-white border border-vivid-lavender"
                                    placeholder="functionName"
                                />
                                {errors.contractFunction && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <FaExclamationTriangle className="mr-2" />
                                        {errors.contractFunction}
                                    </p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-royal-purple dark:text-light-lavender mb-2">
                                    Function Parameters
                                </label>
                                {functionParams.length > 0 && (
                                    <button
                                        onClick={() => setFunctionParams([])}
                                        className="text-red-500 hover:text-red-600 flex items-center"
                                    >
                                        <FaTrash className="mr-1" /> Remove All
                                    </button>
                                )}
                                {functionParams.map((param, index) => (
                                    <div key={index} className="flex items-center mb-2 space-x-2">
                                        <select
                                            value={param.type}
                                            onChange={(e) =>
                                                updateParameter(index, "type", e.target.value)
                                            }
                                            className="w-1/3 p-2 rounded bg-white dark:bg-royal-purple text-royal-purple dark:text-white border border-vivid-lavender"
                                        >
                                            {SOLIDITY_TYPES.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            value={param.value}
                                            onChange={(e) =>
                                                updateParameter(index, "value", e.target.value)
                                            }
                                            className="flex-grow p-2 rounded bg-white dark:bg-royal-purple text-royal-purple dark:text-white border border-vivid-lavender"
                                            placeholder="Parameter value"
                                        />
                                        {index > 0 && (
                                            <button
                                                onClick={() => removeParameter(index)}
                                                className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={addParameter}
                                    className="mt-2 p-2 bg-bright-purple text-white rounded hover:bg-vivid-lavender transition flex items-center"
                                >
                                    <FaPlus className="mr-2" /> Add Parameter
                                </button>
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={generateABI}
                                    className="w-full p-3 bg-bright-purple text-white rounded hover:bg-vivid-lavender transition"
                                >
                                    Generate ABI
                                </button>
                            </div>

                            {generatedABI && (
                                <div className="mt-6">
                                    <label className="block text-royal-purple dark:text-light-lavender mb-2">
                                        Generated ABI
                                    </label>
                                    <pre className="bg-white dark:bg-royal-purple p-4 rounded border border-vivid-lavender overflow-x-auto">
                                        {generatedABI}
                                    </pre>
                                </div>
                            )}
                        </>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-vivid-lavender text-white p-3 rounded hover:bg-royal-purple transition-colors flex items-center justify-center"
                    >
                        <FaCheckCircle className="mr-2" />
                        Initiate Transaction
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TransactionModal;
