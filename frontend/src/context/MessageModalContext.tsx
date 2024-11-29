import React, { createContext, useState, useContext, ReactNode } from "react";
import MessageModal from "./MessageModal";

interface MessageModalContextType {
    showMessage: (message: string, type?: "success" | "error" | "info", title?: string) => void;
}

const MessageModalContext = createContext<MessageModalContextType | undefined>(undefined);

export const MessageModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messageConfig, setMessageConfig] = useState({
        message: "",
        type: "info" as "success" | "error" | "info",
        title: "",
    });

    const showMessage = (message: string, type: "success" | "error" | "info" = "info", title?: string) => {
        setMessageConfig({ message, type, title: title || "" });
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <MessageModalContext.Provider value={{ showMessage }}>
            {children}
            <MessageModal
                isOpen={isOpen}
                onClose={handleClose}
                message={messageConfig.message}
                type={messageConfig.type}
                title={messageConfig.title}
            />
        </MessageModalContext.Provider>
    );
};

export const useMessageModal = () => {
    const context = useContext(MessageModalContext);
    if (context === undefined) {
        throw new Error("useMessageModal must be used within a MessageModalProvider");
    }
    return context;
};
