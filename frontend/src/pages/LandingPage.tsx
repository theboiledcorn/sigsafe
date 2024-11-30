import React from "react";
import { motion } from "framer-motion";
import { FaWallet, FaShieldAlt, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
    const features = [
        {
            icon: <FaWallet className="text-5xl text-bright-purple dark:text-soft-lilac" />,
            title: "Multi-Signature Wallets",
            description: "Create secure wallets requiring multiple signatures for transactions.",
        },
        {
            icon: <FaShieldAlt className="text-5xl text-bright-purple dark:text-soft-lilac" />,
            title: "Enhanced Security",
            description: "Protect your assets with collaborative transaction approval.",
        },
        {
            icon: <FaUsers className="text-5xl text-bright-purple dark:text-soft-lilac" />,
            title: "Team Collaboration",
            description: "Manage shared funds with transparent, democratic control.",
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col justify-between bg-pale-lilac dark:bg-royal-purple transition-colors duration-300"
        >
            {/* Hero Section */}
            <div className="flex flex-col items-center text-center p-8">
                <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl sm:text-5xl font-extrabold text-royal-purple dark:text-soft-lilac mb-6"
                >
                    Sigsafe
                </motion.h1>
                <p className="text-lg sm:text-xl text-bright-purple dark:text-light-lavender max-w-3xl">
                    Secure, collaborative multi-signature wallet management for teams and
                    individuals
                </p>
            </div>

            {/* Features Section */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto p-6"
            >
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-bright-purple p-8 rounded-xl shadow-lg flex flex-col items-center space-y-4 transition-transform duration-200 hover:scale-105"
                    >
                        <div className="flex justify-center items-center">{feature.icon}</div>
                        <h3 className="text-lg font-semibold text-royal-purple dark:text-soft-lilac">
                            {feature.title}
                        </h3>
                        <p className="text-sm text-bright-purple dark:text-light-lavender">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </motion.div>

            {/* Call to Action */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center items-center py-8"
            >
                <Link
                    to="/create-wallet"
                    className="bg-bright-purple dark:bg-soft-lilac text-white dark:text-royal-purple 
                    px-8 py-4 rounded-full shadow-lg hover:bg-royal-purple dark:hover:bg-light-lavender 
                    transition-colors duration-300 flex items-center space-x-2 text-lg font-medium"
                >
                    <FaWallet />
                    <span>Create Wallet</span>
                </Link>
            </motion.div>
        </motion.div>
    );
};

export default LandingPage;
