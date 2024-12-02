import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { FaWallet, FaCoins } from "react-icons/fa";
// import { FaWallet, FaPlus, FaCoins } from "react-icons/fa";
// import { TransactionCard } from "../components/TransactionCard";
import { useReadContract } from "wagmi";
import { ethers } from "ethers";
import { SIGSAFE_WALLET } from "../utils/sigsafe-wallet";
import { useLoader } from "../context/LoaderContext";
import TransactionModal from "../components/TransactionModal";

export const WalletDetailsPage: React.FC = () => {
    const { walletId } = useParams<{ walletId: string }>();
    const [isValidURL, setValidURL] = useState(false);
    const [walletResults, setWalletResults] = useState<any[] | null>(null);
    const { startLoading, stopLoading } = useLoader();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (walletId) {
            if (!ethers.isAddress(walletId)) {
                setValidURL(false);
            } else {
                setValidURL(true);
                startLoading();
                refetchWalletData().then((res) => {
                    console.log(res);
                    stopLoading();
                });
            }

            console.log(walletId);
        }
    }, [walletId]);

    const { data: walletData, refetch: refetchWalletData } = useReadContract({
        address: `0x${String(walletId).substring(2)}`,
        abi: SIGSAFE_WALLET,
        functionName: "getWallet",
    });

    useEffect(() => {
        if (walletData) {
            const fetchBalances = async () => {
                const provider = new ethers.JsonRpcProvider(
                    import.meta.env.VITE_PUBLIC_ALCHEMY_BASE_SEPOLIA as string
                );
                const balance = await provider.getBalance(walletData[4]);

                setWalletResults([walletData, balance]);
                console.log(walletResults);
            };

            fetchBalances();
        }
    }, [walletData]);

    if (isValidURL == false) {
        return (
            <div className="container mx-auto p-6 text-center">
                <FaWallet className="mx-auto text-6xl text-soft-lilac mb-4" />
                <p className="text-bright-purple dark:text-light-lavender">
                    This page doesn't exist yet.
                </p>
            </div>
        );
    }

    const handleTransactionSubmit = async (transactionData: any) => {
        try {
            // Here you would typically call your smart contract method to initiate the transaction
            // This is where you'd use the transactionData to prepare the transaction
            console.log("Transaction Data:", transactionData);

            // Example of preparing transaction data based on type
            switch (transactionData.type) {
                case "METADATA_ONLY":
                    // Prepare metadata-only transaction
                    break;
                case "ETH_TRANSFER":
                    // Prepare ETH transfer transaction
                    break;
                case "CONTRACT_CALL":
                    // Prepare contract call transaction
                    break;
            }

            // You might want to show a success toast or update UI here
        } catch (error) {
            console.error("Transaction initiation failed", error);
            // Handle error (show error message, etc.)
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto p-6"
        >
            {walletResults && walletResults[0].length > 0 ? (
                <>
                    <div className="bg-pale-lilac dark:bg-bright-purple rounded-xl shadow-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <FaWallet className="text-4xl text-royal-purple dark:text-soft-lilac" />
                            <div className="text-right">
                                <p className="text-sm text-bright-purple dark:text-light-lavender">
                                    Wallet Address
                                </p>
                                <Link
                                    to={`https://sepolia.basescan.org/address/${walletResults[0][4]}`}
                                    className="font-mono text-royal-purple dark:text-soft-lilac"
                                >
                                    {`${String(walletResults[0][4]).slice(0, 5)}...${String(
                                        walletResults[0][4]
                                    ).slice(-5)}`}
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <p className="text-sm text-left text-bright-purple dark:text-light-lavender">
                                    Balance
                                </p>
                                <div className="flex items-center">
                                    <FaCoins className="mr-2 text-royal-purple dark:text-soft-lilac" />
                                    <span className="font-bold text-royal-purple dark:text-soft-lilac">
                                        {`${Number(
                                            ethers.formatUnits(walletResults[1], 18)
                                        ).toFixed(5)}`}{" "}
                                        ETH
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-bright-purple dark:text-light-lavender">
                                    Signatories
                                </p>
                                <p className="font-bold text-royal-purple dark:text-soft-lilac">
                                    {Number(walletResults[0][0].length)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-bright-purple dark:text-light-lavender">
                                Required Approvals
                            </p>
                            <p className="font-bold text-royal-purple dark:text-soft-lilac">
                                {Number(walletResults[0][1])}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-royal-purple dark:text-soft-lilac">
                            Recent Transactions
                        </h2>
                        <Link
                            to={`/wallets/${walletId}/transactions`}
                            className="bg-soft-lilac text-bright-purple dark:bg-vivid-lavender dark:text-royal-purple p-2 rounded hover:bg-light-lavender"
                        >
                            View All Transactions
                        </Link>
                    </div>

                    {/* {dummyData.transactions
                        .filter((t) => t.walletId === walletId)
                        .slice(0, 3)
                        .map((transaction) => (
                            <div key={transaction.id} className="mb-4">
                                <TransactionCard transaction={transaction} />
                            </div>
                        ))} */}

                    <div className="mt-6 flex space-x-4">
                        <Link
                            to={`/wallets/${walletId}/transactions`}
                            className="flex-1 text-center bg-bright-purple text-white p-3 rounded hover:bg-royal-purple transition-colors"
                        >
                            View Transactions
                        </Link>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 text-center bg-vivid-lavender text-white p-3 rounded hover:bg-soft-lilac transition-colors"
                        >
                            Initiate Transaction
                        </button>
                    </div>

                    {/* Transaction Modal */}
                    <TransactionModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        walletAddress={walletResults[0][4]}
                        onSubmit={handleTransactionSubmit}
                    />
                </>
            ) : (
                <>
                    <p>Nothing to see here</p>
                </>
            )}
        </motion.div>
    );
};
