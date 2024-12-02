import React, { useState } from "react";
import { motion } from "framer-motion";
import { formatDate } from "../utils/utils";
import { ethers } from "ethers";
// import { TransactionDetailsModal } from "./transactionDetailsModal";
import { useAccount, useWriteContract } from "wagmi";
import { SIGSAFE_WALLET } from "../utils/sigsafe-wallet";
import { useLoader } from "../context/LoaderContext";
import { useMessageModal } from "../context/MessageModalContext";
import { parseContractError } from "../utils/errors";
import { TransactionDetailsModal } from "./TransactionDetailsModal";

interface TransactionCardProps {
    transaction: {
        approvalCount?: bigint;
        data?: string;
        executed?: boolean;
        executedAt?: bigint;
        initiatedAt?: bigint;
        metadata: string;
        rejectionCount?: bigint;
        to?: string;
        transactionId?: bigint;
        value: string;
    };
    walletId?: string;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, walletId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { writeContractAsync } = useWriteContract();
    const { startLoading, stopLoading } = useLoader();
    const { showMessage } = useMessageModal();
    const account = useAccount();

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

    const handleApprove = async () => {
        if (!account.isConnected) {
            showMessage("Please sign in your wallet first", "error", "Connection Required");
            return;
        }
        startLoading();
        try {
            console.log(transaction);
            console.log(walletId);
            if (transaction.transactionId === undefined || transaction.transactionId < 0n) {
                throw new Error("Cannot find transcation");
            }

            const result = await writeContractAsync({
                abi: SIGSAFE_WALLET,
                address: `0x${String(walletId).substring(2)}`,
                account: account.address,
                functionName: "voteForTransaction",
                args: [transaction.transactionId, true],
            });

            if (result) {
                console.log("Transaction approved");
                // setIsModalOpen(false);
                showMessage("Approved", "success", "Success");

                stopLoading();
            }
        } catch (error: any) {
            console.log(error);
            showMessage(parseContractError(error), "error", "Error");
            stopLoading();
        }
    };

    const handleReject = async () => {
        if (!account.isConnected) {
            showMessage("Please sign in your wallet first", "error", "Connection Required");
            return;
        }
        startLoading();
        try {
            console.log(transaction);
            console.log(walletId);
            if (transaction.transactionId === undefined || transaction.transactionId < 0n) {
                throw new Error("Cannot find transcation");
            }

            const result = await writeContractAsync({
                abi: SIGSAFE_WALLET,
                address: `0x${String(walletId).substring(2)}`,
                account: account.address,
                functionName: "voteForTransaction",
                args: [transaction.transactionId, false],
            });

            if (result) {
                console.log("Transaction Rejected");
                // setIsModalOpen(false);
                showMessage("Rejected", "success", "Success");

                stopLoading();
            }
        } catch (error: any) {
            console.log(error);
            showMessage(parseContractError(error), "error", "Error");
            stopLoading();
        }
    };

    const handleFinalize = async () => {
        if (!account.isConnected) {
            showMessage("Please sign in your wallet first", "error", "Connection Required");
            return;
        }
        startLoading();
        try {
            console.log(transaction);
            console.log(walletId);
            if (transaction.transactionId === undefined || transaction.transactionId < 0n) {
                throw new Error("Cannot find transcation");
            }

            const result = await writeContractAsync({
                abi: SIGSAFE_WALLET,
                address: `0x${String(walletId).substring(2)}`,
                account: account.address,
                functionName: "finalizeTransaction",
                args: [transaction.transactionId],
            });

            if (result) {
                console.log("Transaction Finalized");
                // setIsModalOpen(false);
                showMessage("Finalized", "success", "Success");

                stopLoading();
            }
        } catch (error: any) {
            console.log(error);
            showMessage(parseContractError(error), "error", "Error");
            stopLoading();
        }
    };

    return (
        <>
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-soft-lilac dark:bg-vivid-lavender p-6 rounded-xl shadow-lg cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                <div className="flex justify-between items-center mb-4">
                    <span className={`font-semibold ${getStatusColor()}`}>
                        {transaction.executed ? "Executed" : "Pending"}
                    </span>
                </div>

                <div className="mb-4">
                    <p className="text-base font-semibold text-royal-purple dark:text-bright-purple">
                        {ethers.toUtf8String(ethers.getBytes(transaction.metadata))}
                    </p>
                </div>
                <div className="mb-4">
                    <p className="text-sm text-royal-purple dark:text-bright-purple">
                        <strong>Recipient:</strong> {transaction.to?.slice(0, 6)}...
                        {transaction.to?.slice(-4)}
                    </p>
                    <p className="text-sm text-royal-purple dark:text-bright-purple">
                        <strong>Amount:</strong>{" "}
                        {Number(ethers.formatUnits(transaction.value)).toFixed(5)}
                    </p>
                </div>

                <div className="flex justify-between items-center">
                    <p className="text-xs text-bright-purple dark:text-light-lavender">
                        {formatDate(new Date(Number(transaction.initiatedAt) * 1000))}
                    </p>
                    <div className="text-xs text-royal-purple dark:text-soft-lilac">
                        Approvals: {Number(transaction.approvalCount)}
                    </div>
                </div>
            </motion.div>

            <TransactionDetailsModal
                transaction={transaction}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onApprove={handleApprove}
                onReject={handleReject}
                onFinalize={handleFinalize}
            />
        </>
    );
};
