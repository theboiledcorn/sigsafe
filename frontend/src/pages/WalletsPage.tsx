import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaWallet, FaPlus } from "react-icons/fa";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { Link } from "react-router-dom";
import { SIGSAFE_FACTORY } from "../utils/sigsafe-factory";
import { SIGSAFE_WALLET } from "../utils/sigsafe-wallet";
import { ethers } from "ethers";
import { useLoader } from "../context/LoaderContext";

const WalletsPage: React.FC = () => {
    const account = useAccount();
    const [userWalletsFromContract, setUserWalletsFromContract] = useState<any[] | null>(null);
    const [filteredResults, setFilteredResults] = useState<any[] | null>(null);
    const { startLoading, stopLoading } = useLoader();
    const [noWallets, setNoWallets] = useState<true | false | null>(null);

    useEffect(() => {
        if (account.isConnected) {
            fetchUserWallets();
        } else {
            setNoWallets(true);
        }
    }, [account.isConnected]);

    useEffect(() => {
        console.log("loaded");
        if (!account.isConnected) {
            setNoWallets(true);
        }
    }, []);

    const { data: userWallets, refetch: fetchUserWallets } = useReadContract({
        abi: SIGSAFE_FACTORY,
        address: `0x${import.meta.env.VITE_PUBLIC_SIGSAFE_FACTORY_BASE_SEPOLIA as string}`,
        functionName: "getWallets",
        account: account.address,
        args: [`0x${String(account.address).substring(2)}`],
    });

    useEffect(() => {
        if (userWallets && userWallets.length > 0) {
            setUserWalletsFromContract([...userWallets]);
        } else {
            setNoWallets(false);
        }
    }, [userWallets]);

    useEffect(() => {
        if (userWalletsFromContract != null) {
            startLoading();
            fetchWalletsResultsFromContract().then((res) => {
                console.log(res);
                stopLoading();
            });
        }
    }, [userWalletsFromContract]);

    const getWalletsFromSigsafeWallet = userWalletsFromContract?.map(
        (address) =>
            ({
                address: `0x${address.substring(2)}`,
                abi: SIGSAFE_WALLET,
            } as const)
    );

    const { data: walletsResults, refetch: fetchWalletsResultsFromContract } = useReadContracts({
        contracts: getWalletsFromSigsafeWallet?.map((contract) => ({
            ...contract,
            functionName: "getWallet",
        })),
    });

    useEffect(() => {
        if (walletsResults) {
            const fetchBalances = async () => {
                const provider = new ethers.JsonRpcProvider(
                    import.meta.env.VITE_PUBLIC_ALCHEMY_BASE_SEPOLIA as string
                );

                const filteredRes = await Promise.all(
                    walletsResults
                        .filter((res) => res.status === "success")
                        .map(async (res: any) => {
                            const balance = await provider.getBalance(res.result[4]); // Fetch balance
                            return [res.result, balance];
                        })
                );

                console.log(filteredRes);
                setFilteredResults(filteredRes);
                setNoWallets(false);
            };

            fetchBalances(); // Call the async function
        }
    }, [walletsResults]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto p-6 w-full"
        >
            <div className="flex justify-between items-center mb-6 w-full">
                <h1 className="text-3xl font-bold text-royal-purple dark:text-soft-lilac">
                    My Wallets
                </h1>
                <Link
                    to="/create-wallet"
                    className="bg-bright-purple text-white p-3 rounded-full hover:bg-royal-purple transition-colors"
                >
                    <FaPlus />
                </Link>
            </div>

            {noWallets === true && (
                <div className="container mx-auto p-6 text-center">
                    <FaWallet className="mx-auto text-6xl text-soft-lilac mb-4" />
                    <p className="text-bright-purple dark:text-light-lavender">
                        You have to Sign in to view wallets.
                    </p>
                </div>
            )}

            {filteredResults && filteredResults?.length === 0 ? (
                <div className="text-center py-12">
                    <FaWallet className="mx-auto text-6xl text-soft-lilac mb-4" />
                    <p className="text-bright-purple dark:text-light-lavender">
                        You haven't created any wallets yet
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResults?.map((wallet: any) => (
                        <motion.div
                            key={wallet[0][4]}
                            whileHover={{ scale: 1.05 }}
                            className="bg-pale-lilac dark:bg-bright-purple p-6 rounded-xl shadow-lg"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <FaWallet className="text-3xl text-royal-purple dark:text-soft-lilac" />
                                <span className="text-sm text-bright-purple dark:text-light-lavender">
                                    {String(wallet[0][4]).slice(0, 6)}...
                                    {String(wallet[0][4]).slice(-4)}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-royal-purple dark:text-soft-lilac">
                                    Balance:{" "}
                                    {`${Number(ethers.formatUnits(wallet[1], 18)).toFixed(2)}`} ETH
                                </p>
                                <p className="text-sm text-bright-purple dark:text-light-lavender">
                                    Signatories: {wallet[0][0].length}
                                </p>
                                <p className="text-sm text-bright-purple dark:text-light-lavender">
                                    Required Approvals: {Number(wallet[0][1])}
                                </p>
                            </div>
                            <Link
                                to={`/wallets/${wallet[0][4]}`}
                                className="mt-4 block text-center bg-soft-lilac text-royal-purple p-2 rounded hover:bg-light-lavender"
                            >
                                View Details
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default WalletsPage;
