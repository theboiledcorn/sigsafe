import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { formatDate } from "../utils/utils";

export const TransactionDetailsPage: React.FC = () => {
    const { walletId, transactionId } = useParams<{ walletId: string; transactionId: string }>();

    const [transaction, setTransaction] = useState({
        id: transactionId,
        type: "Simple Transfer",
        recipient: "0x1234567890123456789012345678901234567890",
        amount: "0.5 ETH",
        status: "Pending",
        initiatedAt: new Date(),
        approvals: 1,
        rejections: 0,
        requiredApprovals: 2,
        initiator: "0x0987654321098765432109876543210987654321",
    });

    const [userVote, setUserVote] = useState<"none" | "approve" | "reject">("none");

    const handleVote = (vote: "approve" | "reject") => {
        setUserVote(vote);
        setTransaction((prev) => ({
            ...prev,
            approvals: vote === "approve" ? prev.approvals + 1 : prev.approvals,
            rejections: vote === "reject" ? prev.rejections + 1 : prev.rejections,
            status: prev.approvals + 1 >= prev.requiredApprovals ? "Approved" : "Pending",
        }));
    };

    const handleResetVote = () => {
        setUserVote("none");
        setTransaction((prev) => ({
            ...prev,
            approvals: Math.max(0, prev.approvals - 1),
            rejections: Math.max(0, prev.rejections - 1),
        }));
    };

    const handleFinalizeTransaction = () => {
        setTransaction((prev) => ({
            ...prev,
            status: "Finalized",
        }));
    };

    return (
        <div className="bg-pale-lilac dark:bg-royal-purple text-bright-purple dark:text-soft-lilac p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-bright-purple dark:text-light-lavender">
                Transaction Details
            </h1>

            <div className="space-y-4 mb-6">
                <div className="bg-soft-lilac dark:bg-vivid-lavender p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2 text-bright-purple dark:text-light-lavender">
                        Transaction Information
                    </h2>
                    <p>
                        <strong>Transaction ID:</strong> {transaction.id}
                    </p>
                    <p>
                        <strong>Type:</strong> {transaction.type}
                    </p>
                    <p>
                        <strong>Recipient:</strong> {transaction.recipient}
                    </p>
                    <p>
                        <strong>Amount:</strong> {transaction.amount}
                    </p>
                    <p>
                        <strong>Status:</strong> {transaction.status}
                    </p>
                    <p>
                        <strong>Initiated At:</strong> {formatDate(transaction.initiatedAt)}
                    </p>
                    <p>
                        <strong>Initiator:</strong> {transaction.initiator}
                    </p>
                </div>

                <div className="bg-soft-lilac dark:bg-vivid-lavender p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2 text-bright-purple dark:text-light-lavender">
                        Approval Status
                    </h2>
                    <div className="flex justify-between items-center">
                        <div>
                            <p>
                                Approvals: {transaction.approvals}/{transaction.requiredApprovals}
                            </p>
                            <p>Rejections: {transaction.rejections}</p>
                        </div>
                        {transaction.status !== "Finalized" && (
                            <div className="flex space-x-2">
                                <Button
                                    onClick={() => handleVote("approve")}
                                    disabled={userVote === "approve"}
                                    className={`
                    ${
                        userVote === "approve"
                            ? "bg-bright-purple"
                            : "bg-soft-lilac dark:bg-light-lavender"
                    }
                    text-white px-4 py-2 rounded shadow
                  `}
                                >
                                    Approve
                                </Button>
                                <Button
                                    onClick={() => handleVote("reject")}
                                    disabled={userVote === "reject"}
                                    className={`
                    ${
                        userVote === "reject"
                            ? "bg-royal-purple"
                            : "bg-soft-lilac dark:bg-light-lavender"
                    }
                    text-white px-4 py-2 rounded shadow
                  `}
                                >
                                    Reject
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {userVote !== "none" && (
                <Button
                    onClick={handleResetVote}
                    className="w-full bg-vivid-lavender dark:bg-bright-purple text-white mb-4 shadow"
                >
                    Reset Vote
                </Button>
            )}

            {transaction.status === "Approved" && (
                <Button
                    onClick={handleFinalizeTransaction}
                    className="w-full bg-bright-purple dark:bg-vivid-lavender text-white shadow"
                >
                    Finalize Transaction
                </Button>
            )}
        </div>
    );
};
