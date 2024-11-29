import React from "react";
import { motion } from "framer-motion";
import { FaWallet, FaShieldAlt, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const LandingSection: React.FC = () => {
    const navigate = useNavigate();
    const features = [
        {
            icon: <FaWallet className="text-4xl text-bright-purple" />,
            title: "Multi-Signature Wallets",
            description: "Create secure wallets requiring multiple signatures for transactions.",
        },
        {
            icon: <FaShieldAlt className="text-4xl text-bright-purple" />,
            title: "Enhanced Security",
            description: "Protect your assets with collaborative transaction approval.",
        },
        {
            icon: <FaUsers className="text-4xl text-bright-purple" />,
            title: "Team Collaboration",
            description: "Manage shared funds with transparent, democratic control.",
        },
    ];

    const handleCreateWallet = () => {
        navigate("/create-wallet");
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center space-y-12 p-6">
            <div className="text-center">
                <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-6xl font-bold text-royal-purple dark:text-soft-lilac mb-4"
                >
                    SigsafeWallet
                </motion.h1>
                <p className="text-xl text-bright-purple dark:text-light-lavender max-w-2xl mx-auto">
                    Secure, collaborative multi-signature wallet management for teams and
                    individuals
                </p>
            </div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="bg-pale-lilac dark:bg-bright-purple p-6 rounded-xl shadow-lg text-center"
                    >
                        <div className="flex justify-center mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-semibold text-royal-purple dark:text-soft-lilac mb-2">
                            {feature.title}
                        </h3>
                        <p className="text-bright-purple dark:text-light-lavender">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </motion.div>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <button
                    onClick={handleCreateWallet}
                    className="bg-bright-purple text-white px-8 py-3 rounded-full 
          hover:bg-royal-purple transition-colors duration-300 
          flex items-center space-x-2 shadow-lg"
                >
                    <FaWallet />
                    <span>Create Wallet</span>
                </button>
            </motion.div>
        </div>
    );
};
