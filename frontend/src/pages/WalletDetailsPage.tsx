import React from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { FaWallet, FaPlus, FaCoins } from "react-icons/fa";
import dummyData from "../utils/dummy.json";
import { TransactionCard } from "../components/TransactionCard";

export const WalletDetailsPage: React.FC = () => {
    const { walletId } = useParams<{ walletId: string }>();

    // Find the specific wallet
    const wallet = dummyData.wallets.find((w) => w.id === walletId);

    if (!wallet) {
        return (
            <div className="container mx-auto p-6 text-center">
                <FaWallet className="mx-auto text-6xl text-soft-lilac mb-4" />
                <p className="text-bright-purple dark:text-light-lavender">Wallet not found</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto p-6"
        >
            <div className="bg-pale-lilac dark:bg-bright-purple rounded-xl shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <FaWallet className="text-4xl text-royal-purple dark:text-soft-lilac" />
                    <div className="text-right">
                        <p className="text-sm text-bright-purple dark:text-light-lavender">
                            Wallet Address
                        </p>
                        <p className="font-mono text-royal-purple dark:text-soft-lilac">
                            {wallet.address}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <p className="text-sm text-bright-purple dark:text-light-lavender">
                            Balance
                        </p>
                        <div className="flex items-center">
                            <FaCoins className="mr-2 text-royal-purple dark:text-soft-lilac" />
                            <span className="font-bold text-royal-purple dark:text-soft-lilac">
                                {wallet.balance} ETH
                            </span>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-bright-purple dark:text-light-lavender">
                            Signatories
                        </p>
                        <p className="font-bold text-royal-purple dark:text-soft-lilac">
                            {wallet.signatories.length}
                        </p>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-sm text-bright-purple dark:text-light-lavender">
                        Required Approvals
                    </p>
                    <p className="font-bold text-royal-purple dark:text-soft-lilac">
                        {wallet.requiredApprovals}
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

            {dummyData.transactions
                .filter((t) => t.walletId === walletId)
                .slice(0, 3)
                .map((transaction) => (
                    <div key={transaction.id} className="mb-4">
                        <TransactionCard transaction={transaction} />
                    </div>
                ))}

            <div className="mt-6 flex space-x-4">
                <Link
                    to={`/wallets/${walletId}/transactions`}
                    className="flex-1 text-center bg-bright-purple text-white p-3 rounded hover:bg-royal-purple transition-colors"
                >
                    View Transactions
                </Link>
                <Link
                    to={`/wallets/${walletId}/initiate-transaction`}
                    className="flex-1 text-center bg-vivid-lavender text-white p-3 rounded hover:bg-soft-lilac transition-colors"
                >
                    Initiate Transaction
                </Link>
            </div>
        </motion.div>
    );
};
