import { FC } from "react";
import "./App.css";
// import { LandingSection } from "./components/LandingSection";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CreateWalletPage from "./pages/CreateWalletPage";
import WalletsPage from "./pages/WalletsPage";
import { TransactionInitiatePage } from "./pages/TransactionInitiatePage";
import { TransactionDetailsPage } from "./pages/TransactionDetailsPage";
import AboutPage from "./pages/AboutPage";
import { WalletDetailsPage } from "./pages/WalletDetailsPage";
import { WalletTransactionsPage } from "./pages/WalletTransactionsPage";
// import { WalletWrapper } from "./components/Wallet";

const App: FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* <Layout> */}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/create-wallet" element={<CreateWalletPage />} />
                <Route path="/wallets" element={<WalletsPage />} />
                <Route path="/initiate-transaction" element={<TransactionInitiatePage />} />
                <Route
                    path="/wallets/:walletId/transaction/:id"
                    element={<TransactionDetailsPage />}
                />
                <Route path="/wallets/:walletId" element={<WalletDetailsPage />} />
                <Route
                    path="/wallets/:walletId/transactions"
                    element={<WalletTransactionsPage />}
                />
                <Route path="/about" element={<AboutPage />} />
            </Routes>
        </div>
    );
};

export default App;
