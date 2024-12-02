import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ethers } from "ethers";
import { CheckCircle, XCircle, CheckCheck } from "lucide-react";

interface TransactionDetailsModalProps {
    transaction: {
        approvalCount?: bigint;
        data?: string;
        executed?: boolean;
        executedAt?: bigint;
        initiatedAt?: bigint;
        metadata?: string;
        rejectionCount?: bigint;
        to?: string;
        transactionId?: bigint;
        value: string;
    };
    isOpen: boolean;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
    onFinalize: () => void;
}

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
    transaction,
    isOpen,
    onClose,
    onApprove,
    onReject,
    onFinalize,
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

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

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.9,
            y: 50,
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: 50,
        },
    };

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999] overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <motion.div
                            className="fixed inset-0 bg-light-lavender bg-opacity-50 dark:bg-opacity-70 transition-opacity"
                            variants={backdropVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            onClick={onClose}
                        />
                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>

                        <motion.div
                            className="inline-block z-[9999] align-bottom bg-white dark:bg-royal-purple rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="bg-white relative dark:bg-royal-purple px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="w-full flex absolute right-2 top-0">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onClose}
                                        className="ml-auto py-2 px-4 mt-3 inline-flex self-end uppercase justify-center rounded-full border border-gray-300 shadow-sm bg-soft-lilac text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    >
                                        x
                                    </motion.button>
                                </div>
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3
                                            className={`text-lg leading-6 font-medium ${getStatusColor()}`}
                                        >
                                            Transaction Details
                                        </h3>
                                        <div className="mt-2 space-y-3">
                                            {transaction.metadata && (
                                                <div className="mt-4 p-3 bg-soft-lilac/10 dark:bg-light-lavender/10 rounded-lg">
                                                    <p className="text-xs text-royal-purple dark:text-soft-lilac break-words">
                                                        <strong>Description:</strong>{" "}
                                                        {ethers.toUtf8String(
                                                            ethers.getBytes(transaction.metadata)
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                            <div className="bg-pale-lilac dark:bg-vivid-lavender p-3 rounded-lg">
                                                <p className="text-sm text-royal-purple dark:text-white">
                                                    <strong>Recipient:</strong>{" "}
                                                    {transaction.to?.slice(0, 6)}...
                                                    {transaction.to?.slice(-4)}
                                                </p>
                                                <p className="text-sm text-royal-purple dark:text-white">
                                                    <strong>Amount:</strong>{" "}
                                                    {Number(
                                                        ethers.formatUnits(transaction.value)
                                                    ).toFixed(5)}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-start">
                                                <div className="text-sm text-bright-purple dark:text-light-lavender">
                                                    <strong>Initiated:</strong>{" "}
                                                    {new Date(
                                                        Number(transaction.initiatedAt) * 1000
                                                    ).toLocaleString()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="text-sm text-royal-purple dark:text-soft-lilac">
                                                        Approvals:{" "}
                                                        {Number(transaction.approvalCount)}
                                                    </div>
                                                    <div className="text-sm text-royal-purple dark:text-soft-lilac">
                                                        Rejections:{" "}
                                                        {Number(transaction.rejectionCount)}
                                                    </div>
                                                </div>
                                            </div>
                                            {transaction.executed == true ? (
                                                <div className="flex justify-between items-center">
                                                    <div className="text-sm text-bright-purple dark:text-light-lavender">
                                                        <strong>Executed:</strong>{" "}
                                                        {new Date(
                                                            Number(transaction.executedAt) * 1000
                                                        ).toLocaleString()}
                                                    </div>
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {transaction.executed == false ? (
                                <>
                                    <div className="bg-gray-50 flex justify-center dark:bg-royal-purple/80 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={onApprove}
                                            className="mt-3 px-9 inline-flex justify-center rounded-md border border-transparent shadow-sm py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                            <CheckCircle className="mr-2" size={20} />
                                            Approve
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={onReject}
                                            className="mt-3 px-9 inline-flex justify-center rounded-md border border-transparent shadow-sm py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm"
                                        >
                                            <XCircle className="mr-2" size={20} />
                                            Reject
                                        </motion.button>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-royal-purple/80 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={onFinalize}
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-bright-purple text-base font-medium text-white hover:bg-bright-purple/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bright-purple sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                            <CheckCheck className="mr-2" size={20} />
                                            Finalize
                                        </motion.button>
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
};
