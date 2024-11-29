import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/utils";

interface TransactionCardProps {
    transaction: {
        id: string;
        walletId: string;
        type?: string;
        to?: string;
        recipient?: string;
        value: string;
        status?: string;
        amount?: string;
        initiatedAt: number;
        approvalCount: number;
        rejectionCount: number;
        requiredApprovals?: number;
    };
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
    // Determine status color
    const getStatusColor = () => {
        switch (transaction.status) {
            case "Pending":
                return "text-yellow-500";
            case "Approved":
                return "text-green-500";
            case "Rejected":
                return "text-red-500";
            case "Finalized":
                return "text-bright-purple";
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
                <span className={`font-semibold ${getStatusColor()}`}>{transaction.status}</span>
                <span className="text-sm text-bright-purple dark:text-royal-purple">
                    {transaction.type}
                </span>
            </div>

            <div className="mb-4">
                <p className="text-sm text-royal-purple dark:text-bright-purple">
                    <strong>Recipient:</strong> {transaction.recipient?.slice(0, 6)}...
                    {transaction.recipient?.slice(-4)}
                </p>
                <p className="text-sm text-royal-purple dark:text-bright-purple">
                    <strong>Amount:</strong> {transaction.amount}
                </p>
            </div>

            <div className="flex justify-between items-center">
                <p className="text-xs text-bright-purple dark:text-light-lavender">
                    {formatDate(new Date(transaction.initiatedAt))}
                </p>
                <div className="text-xs text-royal-purple dark:text-soft-lilac">
                    Approvals: {transaction.approvalCount}/{transaction.requiredApprovals}
                </div>
            </div>

            <Link
                to={`/wallets/${transaction.walletId}/transaction/${transaction.id}`}
                className="mt-4 block text-center bg-pale-lilac text-bright-purple dark:bg-light-lavender dark:text-royal-purple p-2 rounded hover:bg-light-lavender dark:hover:bg-soft-lilac"
            >
                View Details
            </Link>
        </motion.div>
    );
};
