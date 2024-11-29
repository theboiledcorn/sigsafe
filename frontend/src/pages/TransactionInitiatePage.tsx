import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export const TransactionInitiatePage: React.FC = () => {
    const { walletId } = useParams<{ walletId: string }>();
    const navigate = useNavigate();

    // State for transaction parameters
    const [transactionType, setTransactionType] = useState<"simple" | "contract">("simple");
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [contractFunction, setContractFunction] = useState("");
    const [contractParams, setContractParams] = useState("");

    const handleInitiateTransaction = () => {
        // Mock transaction initiation logic
        try {
            if (transactionType === "simple") {
                // Simple transaction logic
                console.log("Initiating simple transaction", {
                    walletId,
                    recipient,
                    amount,
                });
            } else {
                // Contract transaction logic
                console.log("Initiating contract transaction", {
                    walletId,
                    contractFunction,
                    contractParams,
                });
            }

            // Redirect to transaction details or wallets page
            navigate(`/wallets/${walletId}/transactions`);
        } catch (error) {
            console.error("Transaction initiation failed", error);
        }
    };

    return (
        <div className="bg-pale-lilac dark:bg-royal-purple p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-bright-purple dark:text-soft-lilac">
                Initiate Transaction for Wallet {walletId}
            </h1>

            <div className="mb-4">
                <label className="block mb-2">Transaction Type</label>
                <div className="flex space-x-4">
                    <Button
                        onClick={() => setTransactionType("simple")}
                        className={`${
                            transactionType === "simple"
                                ? "bg-bright-purple text-white"
                                : "bg-soft-lilac text-bright-purple"
                        }`}
                    >
                        Simple Transaction
                    </Button>
                    <Button
                        onClick={() => setTransactionType("contract")}
                        className={`${
                            transactionType === "contract"
                                ? "bg-bright-purple text-white"
                                : "bg-soft-lilac text-bright-purple"
                        }`}
                    >
                        Contract Transaction
                    </Button>
                </div>
            </div>

            {transactionType === "simple" && (
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2">Recipient Address</label>
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full p-2 border rounded bg-white dark:bg-royal-purple dark:border-vivid-lavender"
                            placeholder="Enter recipient address"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 border rounded bg-white dark:bg-royal-purple dark:border-vivid-lavender"
                            placeholder="Enter amount"
                        />
                    </div>
                </div>
            )}

            {transactionType === "contract" && (
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2">Contract Function</label>
                        <input
                            type="text"
                            value={contractFunction}
                            onChange={(e) => setContractFunction(e.target.value)}
                            className="w-full p-2 border rounded bg-white dark:bg-royal-purple dark:border-vivid-lavender"
                            placeholder="Enter contract function name"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Contract Parameters</label>
                        <textarea
                            value={contractParams}
                            onChange={(e) => setContractParams(e.target.value)}
                            className="w-full p-2 border rounded bg-white dark:bg-royal-purple dark:border-vivid-lavender"
                            placeholder="Enter contract parameters (JSON format)"
                            rows={4}
                        />
                    </div>
                </div>
            )}

            <div className="mt-6">
                <Button
                    onClick={handleInitiateTransaction}
                    className="w-full bg-bright-purple text-white hover:bg-vivid-lavender"
                >
                    Initiate Transaction
                </Button>
            </div>
        </div>
    );
};
