import React from "react";
import { motion } from "framer-motion";
import { FaWallet } from "react-icons/fa";
import { Link } from "react-router-dom";

interface WalletCardProps {
    wallet: {
        id: string;
        address: string;
        balance: number;
        signatories: string[];
        requiredApprovals: number;
    };
}

export const WalletCard: React.FC<WalletCardProps> = ({ wallet }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-pale-lilac dark:bg-bright-purple p-6 rounded-xl shadow-lg"
        >
            <div className="flex justify-between items-center mb-4">
                <FaWallet className="text-3xl text-royal-purple dark:text-soft-lilac" />
                <span className="text-sm text-bright-purple dark:text-light-lavender">
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                </span>
            </div>
            <div>
                <p className="text-sm text-royal-purple dark:text-soft-lilac">
                    Balance: {wallet.balance.toFixed(5)} ETH
                </p>
                <p className="text-sm text-bright-purple dark:text-light-lavender">
                    Signatories: {wallet.signatories.length}
                </p>
                <p className="text-sm text-bright-purple dark:text-light-lavender">
                    Required Approvals: {wallet.requiredApprovals}
                </p>
            </div>
            <Link
                to={`/wallet/${wallet.id}`}
                className="mt-4 block text-center bg-soft-lilac text-royal-purple dark:bg-light-lavender dark:text-bright-purple p-2 rounded hover:bg-light-lavender dark:hover:bg-soft-lilac"
            >
                View Details
            </Link>
        </motion.div>
    );
};
