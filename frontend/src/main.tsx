import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Providers } from "./providers.tsx";
import "@coinbase/onchainkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Navbar } from "./components/Navbar.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { TopNavbar } from "./components/TopNavbar.tsx";
import { MessageModalProvider } from "./context/MessageModalContext.tsx";

const root = document.getElementById("root");
if (!root) throw new Error("No root element found");

createRoot(root).render(
    <Router>
        <div className="min-h-screen bg-pale-lilac dark:bg-royal-purple text-bright-purple dark:text-soft-lilac">
            <div className="container mx-auto px-4 pb-20 pt-6 max-w-7xl">
                <StrictMode>
                    <Providers>
                        <MessageModalProvider>
                            <div className="flex flex-col min-h-screen pt-6">
                                <App />
                                <TopNavbar />
                                {/* <Navbar /> */}
                            </div>
                        </MessageModalProvider>
                    </Providers>
                </StrictMode>
            </div>
        </div>
    </Router>
);
