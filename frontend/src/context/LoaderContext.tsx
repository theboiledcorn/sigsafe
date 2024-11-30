import React, { createContext, useState, useContext, ReactNode } from "react";
import { motion } from "framer-motion";

// Loader Context Interface
interface LoaderContextType {
    isLoading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
}

// Create Context
const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

// Loader Component
const Loader: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-light-lavender bg-opacity-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                }}
                className="w-48 h-48 bg-pale-lilac dark:bg-royal-purple rounded-2xl shadow-2xl 
                            flex items-center justify-center"
            >
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="w-24 h-24 bg-bright-purple rounded-full flex items-center justify-center"
                >
                    <motion.div
                        animate={{
                            scale: [1, 0.8, 1],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="w-16 h-16 bg-soft-lilac rounded-full"
                    />
                </motion.div>
            </motion.div>
        </div>
    );
};

// Provider Component
export const LoaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const startLoading = () => setIsLoading(true);
    const stopLoading = () => setIsLoading(false);

    return (
        <LoaderContext.Provider value={{ isLoading, startLoading, stopLoading }}>
            {children}
            <Loader isOpen={isLoading} />
        </LoaderContext.Provider>
    );
};

// Custom Hook
export const useLoader = () => {
    const context = useContext(LoaderContext);
    if (context === undefined) {
        throw new Error("useLoader must be used within a LoaderProvider");
    }
    return context;
};
