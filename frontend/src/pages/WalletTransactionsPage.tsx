import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { FaWallet, FaPlus } from "react-icons/fa";
import dummyData from "../utils/dummy.json";
import { TransactionCard } from "../components/TransactionCard";

export const WalletTransactionsPage: React.FC = () => {
    const { walletId } = useParams<{ walletId: string }>();
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

    // Find the specific wallet
    const wallet = dummyData.wallets.find((w) => w.id === walletId);

    // Filter transactions for this wallet
    const filteredTransactions = dummyData.transactions
        .filter((t) => t.walletId === walletId)
        .filter((t) => filter === "all" || t.status.toLowerCase() === filter);

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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-royal-purple dark:text-soft-lilac">
                    Transactions
                </h1>
                <Link
                    to={`/wallets/${walletId}/initiate-transaction`}
                    className="bg-bright-purple text-white p-3 rounded-full hover:bg-royal-purple transition-colors"
                >
                    <FaPlus />
                </Link>
            </div>

            <div className="mb-6 flex justify-center space-x-4">
                {["all", "pending", "approved", "rejected"].map((status) => (
                    <button
                        key={status}
                        onClick={() =>
                            setFilter(status as "all" | "pending" | "approved" | "rejected")
                        }
                        className={`
              px-4 py-2 rounded-lg transition-colors
              ${
                  filter === status
                      ? "bg-bright-purple text-white"
                      : "bg-soft-lilac dark:bg-vivid-lavender text-royal-purple dark:text-bright-purple"
              }
            `}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                    <FaWallet className="mx-auto text-6xl text-soft-lilac mb-4" />
                    <p className="text-bright-purple dark:text-light-lavender">
                        No transactions found
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredTransactions.map((transaction) => (
                        <TransactionCard key={transaction.id} transaction={transaction} />
                    ))}
                </div>
            )}
        </motion.div>
    );
};
