import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { FaWallet, FaPlus } from "react-icons/fa";
import { TransactionCard } from "../components/TransactionCard";
import { ethers } from "ethers";
import { SIGSAFE_WALLET } from "../utils/sigsafe-wallet";
import { useReadContract, useReadContracts } from "wagmi";
import { useLoader } from "../context/LoaderContext";

interface Transaction {
    approvalCount?: bigint;
    data?: string;
    executed?: boolean;
    executedAt?: bigint;
    initiatedAt?: bigint;
    metadata: string;
    rejectionCount: bigint;
    to?: string;
    transactionId?: bigint;
    value: string;
}

export const WalletTransactionsPage: React.FC = () => {
    const { walletId } = useParams<{ walletId: string }>();
    const [filter, setFilter] = useState<"all" | "pending" | "executed" | "rejected">("all");
    const [isValidURL, setValidURL] = useState(false);
    const [walletTXCountArray, setWalletTXCountArray] = useState<number[]>([]);
    const { startLoading, stopLoading } = useLoader();
    const [finalWalletTXs, setFinalWalletTXs] = useState<Transaction[] | null>(null);
    const [finalWalletTXsToDisplay, setFinalWalletTXsToDisplay] = useState<Transaction[] | null>(
        null
    );

    const createArray = (num: number) => Array.from({ length: num }, (_, index) => index);

    useEffect(() => {
        if (finalWalletTXs && finalWalletTXs.length > 0) {
            if (filter == "executed") {
                setFinalWalletTXsToDisplay(finalWalletTXs?.filter((txs) => txs.executed == true));
            } else if (filter == "all") {
                setFinalWalletTXsToDisplay(finalWalletTXs);
            } else if (filter == "pending") {
                setFinalWalletTXsToDisplay(finalWalletTXs.filter((txs) => txs.executed == false));
            } else if (filter == "rejected") {
                refetchWalletDetails().then((res) => {
                    if (res.isSuccess) {
                        setFinalWalletTXsToDisplay(
                            finalWalletTXs.filter(
                                (txs) => txs.executed == true && txs.rejectionCount >= res.data[2]
                            )
                        );
                    } else {
                        setFinalWalletTXsToDisplay(null);
                    }
                });
            }
        }
    }, [filter]);

    useEffect(() => {
        if (walletId) {
            if (!ethers.isAddress(walletId)) {
                setValidURL(false);
            } else {
                setValidURL(true);
                startLoading();
                refetchWalletTransactionCount().then(() => {
                    stopLoading();
                });
            }
        }
    }, [walletId]);

    const { refetch: refetchWalletDetails } = useReadContract({
        address: `0x${String(walletId).substring(2)}`,
        abi: SIGSAFE_WALLET,
        functionName: "getWallet",
    });

    const { data: walletTransactionCount, refetch: refetchWalletTransactionCount } =
        useReadContract({
            address: `0x${String(walletId).substring(2)}`,
            abi: SIGSAFE_WALLET,
            functionName: "transactionCount",
        });

    useEffect(() => {
        if (walletTransactionCount && Number(walletTransactionCount) > 0) {
            setWalletTXCountArray(createArray(Number(walletTransactionCount)));
        }
    }, [walletTransactionCount]);

    useEffect(() => {
        if (walletTXCountArray && walletTXCountArray.length > 0) {
            refetchWalletTransactions().then((res) => {
                console.log(res);
            });
        }
    }, [walletTXCountArray]);

    const getTXCountFromWallet = walletTXCountArray.map(
        (count) =>
            ({
                address: `0x${String(walletId).substring(2)}`,
                args: [count],
                abi: SIGSAFE_WALLET,
            } as const)
    );

    const { data: walletTransactions, refetch: refetchWalletTransactions } = useReadContracts({
        contracts: getTXCountFromWallet.map((address) => ({
            ...address,
            address: address.address,
            abi: address.abi,
            functionName: "getTransaction",
        })),
    });

    useEffect(() => {
        if (walletTransactions) {
            const finalResults: Transaction[] = [];

            const txArray = walletTransactions.filter((i) => i.status == "success");

            txArray.map((result: any) => {
                finalResults.push(result.result);
            });

            setFinalWalletTXs(finalResults);
            setFinalWalletTXsToDisplay(finalResults);
        }
    }, [walletTransactions]);

    if (isValidURL == false) {
        return (
            <div className="container mx-auto p-6 text-center">
                <FaWallet className="mx-auto text-6xl text-soft-lilac mb-4" />
                <p className="text-bright-purple dark:text-light-lavender">
                    This page doesn't exist yet.
                </p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-royal-purple dark:text-soft-lilac">
                    Transactions
                </h1>
                <Link
                    to={`/wallets/${walletId}`}
                    className="bg-bright-purple text-white p-3 rounded-full hover:bg-royal-purple transition-colors"
                >
                    <FaPlus />
                </Link>
            </div>

            <div className="mb-6 flex justify-center space-x-4">
                {["all", "pending", "executed", "rejected"].map((status) => (
                    <button
                        key={status}
                        onClick={() =>
                            setFilter(status as "all" | "pending" | "executed" | "rejected")
                        }
                        className={`
              px-4 py-2 rounded-lg transition-colors
              ${
                  filter === status
                      ? "bg-bright-purple text-white"
                      : "bg-soft-lilac dark:bg-vivid-lavender text-royal-purple dark:text-bright-purple"
              }
            `}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {finalWalletTXsToDisplay && finalWalletTXsToDisplay.length == 0 ? (
                <div className="text-center py-12">
                    <FaWallet className="mx-auto text-6xl text-soft-lilac mb-4" />
                    <p className="text-bright-purple dark:text-light-lavender">
                        No transactions found
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {finalWalletTXsToDisplay?.map((transaction: Transaction, index: number) => (
                        <TransactionCard
                            key={index}
                            transaction={transaction}
                            walletId={walletId}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
};
