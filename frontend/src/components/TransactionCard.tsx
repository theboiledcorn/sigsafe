import React from "react";
import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
import { formatDate } from "../utils/utils";
import { ethers } from "ethers";

interface TransactionCardProps {
    transaction: {
        approvalCount?: bigint;
        data?: string;
        executed?: boolean;
        executedAt?: bigint;
        initiatedAt?: bigint;
        metadata?: string;
        rejectionCount?: bigint;
        to?: string;
        transactionId?: string;
        value: string;
    };
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
    // Determine status color
    const getStatusColor = () => {
        switch (transaction.executed) {
            case true:
                return "text-bright-purple";
            case false:
                return "text-red-500";
            default:
                return "text-gray-500";
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-soft-lilac dark:bg-vivid-lavender p-6 rounded-xl shadow-lg"
        >
            <div className="flex justify-between items-center mb-4">
                <span className={`font-semibold ${getStatusColor()}`}>{transaction.executed}</span>
                {/* <span className="text-sm text-bright-purple dark:text-royal-purple">
                    {transaction.type}
                </span> */}
            </div>

            <div className="mb-4">
                <p className="text-sm text-royal-purple dark:text-bright-purple">
                    <strong>Recipient:</strong> {transaction.to?.slice(0, 6)}...
                    {transaction.to?.slice(-4)}
                </p>
                <p className="text-sm text-royal-purple dark:text-bright-purple">
                    <strong>Amount:</strong>{" "}
                    {Number(ethers.formatUnits(transaction.value)).toFixed(2)}
                </p>
            </div>

            <div className="flex justify-between items-center">
                <p className="text-xs text-bright-purple dark:text-light-lavender">
                    {formatDate(new Date(Number(transaction.initiatedAt)))}
                </p>
                <div className="text-xs text-royal-purple dark:text-soft-lilac">
                    Approvals: {Number(transaction.approvalCount)}
                </div>
            </div>

            {/* <Link
                to={`/wallets/${transaction.walletId}/transaction/${transaction.id}`}
                className="mt-4 block text-center bg-pale-lilac text-bright-purple dark:bg-light-lavender dark:text-royal-purple p-2 rounded hover:bg-light-lavender dark:hover:bg-soft-lilac"
            >
                View Details
            </Link> */}
        </motion.div>
    );
};
