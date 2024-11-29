import React from "react";
import { motion } from "framer-motion";
import { FaWallet, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import dummyData from "../utils/dummy.json";

const WalletsPage: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-royal-purple dark:text-soft-lilac">
                    My Wallets
                </h1>
                <Link
                    to="/create-wallet"
                    className="bg-bright-purple text-white p-3 rounded-full hover:bg-royal-purple transition-colors"
                >
                    <FaPlus />
                </Link>
            </div>

            {dummyData.wallets.length === 0 ? (
                <div className="text-center py-12">
                    <FaWallet className="mx-auto text-6xl text-soft-lilac mb-4" />
                    <p className="text-bright-purple dark:text-light-lavender">
                        You haven't created any wallets yet
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dummyData.wallets.map((wallet: any) => (
                        <motion.div
                            key={wallet.id}
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
                                    Balance: {wallet.balance} ETH
                                </p>
                                <p className="text-sm text-bright-purple dark:text-light-lavender">
                                    Signatories: {wallet.signatories.length}
                                </p>
                                <p className="text-sm text-bright-purple dark:text-light-lavender">
                                    Required Approvals: {wallet.requiredApprovals}
                                </p>
                            </div>
                            <Link
                                to={`/wallets/${wallet.id}`}
                                className="mt-4 block text-center bg-soft-lilac text-royal-purple p-2 rounded hover:bg-light-lavender"
                            >
                                View Details
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default WalletsPage;
