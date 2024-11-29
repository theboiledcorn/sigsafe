import React from "react";
import { WalletWrapper } from "./Wallet";

export const Navbar: React.FC = () => {
    return (
        <nav className="fixed w-full bottom-0 left-0 right-0 bg-pale-lilac dark:bg-royal-purple p-4 shadow-lg z-50">
            <div className="max-w-7xl mx-auto flex justify-center items-center">
                <WalletWrapper
                    text="Sign In"
                    className="bg-bright-purple text-white px-6 py-2 rounded-full 
                        flex items-center space-x-2 hover:bg-royal-purple transition-colors"
                    withWalletAggregator={true}
                ></WalletWrapper>
            </div>
        </nav>
    );
};
