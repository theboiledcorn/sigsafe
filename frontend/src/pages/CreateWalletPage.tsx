import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useAccount, useWriteContract } from "wagmi";
import { useMessageModal } from "../context/MessageModalContext";

const CreateWalletPage: React.FC = () => {
    const [signatories, setSignatories] = useState<string[]>([""]);
    const [requiredApprovals, setRequiredApprovals] = useState(1);
    const account = useAccount();
    const { writeContractAsync } = useWriteContract();
    const { showMessage } = useMessageModal();

    const addSignatory = () => {
        setSignatories([...signatories, ""]);
    };

    const removeSignatory = (index: number) => {
        const newSignatories = [...signatories];
        newSignatories.splice(index, 1);
        setSignatories(newSignatories);
    };

    const updateSignatory = (index: number, value: string) => {
        const newSignatories = [...signatories];
        newSignatories[index] = value;
        setSignatories(newSignatories);
    };

    const handleCreateWallet = async () => {
        // Validate inputs
        const invalidAddresses = signatories.filter((address) => !isValidAddress(address));

        if (invalidAddresses.length > 0) {
            showMessage("Some wallet addresses are invalid", "error", "Validation Error");
            return;
        }

        if (!account.isConnected) {
            showMessage("Please connect your wallet first", "error", "Connection Required");
            return;
        }

        try {
            // Implement actual wallet creation logic here
            // For example:
            // const result = await writeContractAsync(...);

            showMessage("Multi-signature wallet created successfully!", "success", "Wallet Created");
        } catch (error) {
            showMessage("Failed to create wallet. Please try again.", "error", "Creation Error");
        }
    };

    // Simple address validation (you might want to use a more robust method)
    const isValidAddress = (address: string): boolean => {
        return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto max-w-xl p-6">
            <h1 className="text-3xl font-bold text-royal-purple dark:text-soft-lilac mb-6">
                Create Multi-Signature Wallet
            </h1>

            <div className="bg-pale-lilac dark:bg-bright-purple p-6 rounded-xl shadow-lg">
                <div className="mb-4">
                    <label className="block text-bright-purple dark:text-light-lavender mb-2">Required Approvals</label>
                    <input
                        type="number"
                        value={requiredApprovals}
                        onChange={(e) => setRequiredApprovals(Number(e.target.value))}
                        min={1}
                        max={signatories.length}
                        className="w-full p-2 rounded border border-soft-lilac text-bright-purple"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-bright-purple dark:text-light-lavender mb-2">Signatories</label>
                    {signatories.map((signatory, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                            <input
                                type="text"
                                placeholder="Wallet Address"
                                value={signatory}
                                onChange={(e) => updateSignatory(index, e.target.value)}
                                className="flex-grow p-2 rounded border border-soft-lilac text-bright-purple"
                            />
                            {signatories.length > 1 && (
                                <button
                                    onClick={() => removeSignatory(index)}
                                    className="text-red-500 hover:bg-red-100 p-2 rounded"
                                >
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={addSignatory}
                        className="flex items-center space-x-2 outline-none border-none appearance-none text-bright-purple hover:bg-soft-lilac p-2 rounded dark:bg-white dark:text-bright-purple"
                    >
                        <FaPlus /> <span>Add Signatory</span>
                    </button>
                </div>

                <button
                    onClick={handleCreateWallet}
                    className="w-full bg-bright-purple text-white p-3 rounded-full hover:bg-royal-purple transition-colors duration-300 dark:bg-white dark:text-bright-purple"
                >
                    Create Wallet
                </button>
            </div>
        </motion.div>
    );
};

export default CreateWalletPage;
