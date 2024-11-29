import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaWallet, FaPlus, FaInfoCircle, FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { WalletWrapper } from "./Wallet";
// import Logo from '../assets/logo.svg'; // Adjust the import path as needed

export const TopNavbar: React.FC = () => {
    const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains("dark"));
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        {
            icon: <FaHome />,
            label: "Home",
            path: "/",
        },
        {
            icon: <FaWallet />,
            label: "Wallets",
            path: "/wallets",
        },
        {
            icon: <FaPlus />,
            label: "Create Wallet",
            path: "/create-wallet",
        },
        {
            icon: <FaInfoCircle />,
            label: "About",
            path: "/about",
        },
    ];

    const toggleDarkMode = () => {
        const html = document.documentElement;
        if (darkMode) {
            html.classList.remove("dark");
        } else {
            html.classList.add("dark");
        }
        setDarkMode(!darkMode);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const mobileMenuVariants = {
        hidden: { 
            opacity: 0, 
            x: "100%",
            transition: {
                duration: 0.3
            }
        },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: {
                duration: 0.3
            }
        }
    };

    return (
        <nav className="fixed w-full top-0 left-0 right-0 bg-pale-lilac dark:bg-royal-purple p-4 shadow-md z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    {/* <img 
                        src={Logo} 
                        alt="Multi-Sig Wallet Logo" 
                        className="h-8 w-8 rounded-full"
                    /> */}
                    {/* <span className="text-bright-purple dark:text-soft-lilac font-bold text-xl hidden md:inline"> */}
                    <span className="text-bright-purple dark:text-soft-lilac font-bold text-xl md:inline">
                        SigSafe
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex space-x-6 items-center">
                    {navItems.map((item) => (
                        <motion.div key={item.path} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Link
                                to={item.path}
                                className="flex flex-col items-center text-bright-purple dark:text-soft-lilac"
                            >
                                {item.icon}
                                <span className="text-sm mt-1">{item.label}</span>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center space-x-4">
                    <WalletWrapper
                        text="Sign In"
                        className="bg-bright-purple text-white px-6 py-2 rounded-full 
                            flex items-center space-x-2 hover:bg-royal-purple transition-colors"
                        withWalletAggregator={true}
                    />
                    {/* <motion.button
                        onClick={toggleDarkMode}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-white dark:bg-bright-purple text-bright-purple dark:text-soft-lilac 
                            p-3 rounded-full shadow-lg hover:bg-bright-purple dark:hover:bg-royal-purple 
                            hover:text-white dark:hover:text-light-lavender transition-colors"
                    >
                        {darkMode ? <FaSun /> : <FaMoon />}
                    </motion.button> */}
                </div>

                {/* Mobile Hamburger */}
                <div className="md:hidden flex items-center space-x-4">
                    <motion.button
                        onClick={toggleDarkMode}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-white dark:bg-bright-purple text-bright-purple dark:text-soft-lilac 
                            p-3 rounded-full shadow-lg hover:bg-bright-purple dark:hover:bg-royal-purple 
                            hover:text-white dark:hover:text-light-lavender transition-colors"
                    >
                        {darkMode ? <FaSun /> : <FaMoon />}
                    </motion.button>
                    <motion.button
                        onClick={toggleMobileMenu}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-bright-purple dark:text-soft-lilac"
                    >
                        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </motion.button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={mobileMenuVariants}
                            className="fixed top-16 right-0 w-64 bg-pale-lilac dark:bg-royal-purple 
                                shadow-2xl rounded-xl p-6 md:hidden z-50"
                        >
                            <div className="flex flex-col space-y-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={toggleMobileMenu}
                                        className="flex items-center space-x-3 text-bright-purple dark:text-soft-lilac"
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                                <WalletWrapper
                                    text="Sign In"
                                    className="bg-bright-purple text-white px-6 py-2 rounded-full 
                                        flex items-center justify-center space-x-2 hover:bg-royal-purple transition-colors"
                                    withWalletAggregator={true}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};