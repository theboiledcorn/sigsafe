// import { useReadContract, useReadContracts } from "wagmi";
// import { SIGSAFE_WALLET } from "./sigsafe-wallet";

// export function useWalletData(userWalletsFromContract: `0x${string}`[]) {
//     const {
//         data,
//         isError,
//         isLoading,
//         refetch: refetchWallets,
//     } = useReadContracts({
//         contracts: userWalletsFromContract.map((address) => ({
//             address,
//             abi: SIGSAFE_WALLET,
//             functionName: "getWallet",
//         })),
//     });

//     return {
//         userWallets: data,
//         isError,
//         isLoading,
//         refetchWallets,
//     };
// }

// export function getWalletData(address: `0x${string}`) {
//     const {
//         data,
//         isError,
//         isLoading,
//         refetch: refetchWalletData,
//     } = useReadContract({
//         address,
//         abi: SIGSAFE_WALLET,
//         functionName: "getWallet",
//     });

//     return {
//         walletData: data,
//         isError,
//         isLoading,
//         refetchWalletData,
//     };
// }
