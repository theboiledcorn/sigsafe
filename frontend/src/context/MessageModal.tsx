import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface MessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    type?: "success" | "error" | "info";
    title?: string;
    message: string;
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, type = "info", title, message }) => {
    // Color and icon mapping based on type
    const typeStyles = {
        success: {
            bg: "bg-pale-lilac",
            text: "text-bright-purple",
            border: "border-soft-lilac",
            icon: "✓",
        },
        error: {
            bg: "bg-red-50",
            text: "text-red-700",
            border: "border-red-200",
            icon: "!",
        },
        info: {
            bg: "bg-pale-lilac",
            text: "text-bright-purple",
            border: "border-soft-lilac",
            icon: "i",
        },
    };

    const currentStyle = typeStyles[type];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-light-lavender bg-opacity-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`
                            relative 
                            w-full 
                            max-w-md 
                            mx-auto 
                            p-6 
                            rounded-xl 
                            shadow-2xl 
                            ${currentStyle.bg} 
                            ${currentStyle.text} 
                            ${currentStyle.border} 
                            border
                            transform 
                            transition-all 
                            duration-300
                        `}
                    >
                        <button
                            onClick={onClose}
                            className="
                                absolute 
                                top-4 
                                right-4 
                                hover:bg-soft-lilac 
                                p-2 
                                rounded-full 
                                transition-colors 
                                focus:outline-none 
                                focus:ring-2 
                                focus:ring-bright-purple
                            "
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center space-x-4 mb-4">
                            <div
                                className={`
                                    w-10 
                                    h-10 
                                    flex 
                                    items-center 
                                    justify-center 
                                    rounded-full 
                                    ${currentStyle.bg} 
                                    border 
                                    ${currentStyle.border}
                                `}
                            >
                                <span className="font-bold">{currentStyle.icon}</span>
                            </div>
                            {title && (
                                <h2
                                    className="
                                    text-xl 
                                    font-bold 
                                    break-words 
                                    max-w-[calc(100%-3rem)]
                                "
                                >
                                    {title}
                                </h2>
                            )}
                        </div>

                        <p
                            className="
                            text-md 
                            break-words 
                            w-full
                        "
                        >
                            {message}
                        </p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MessageModal;
