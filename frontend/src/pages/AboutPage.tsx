// import React from "react";
import { BookOpenIcon, ShieldCheckIcon, UsersIcon, ClockIcon, LockIcon } from "lucide-react";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";

export default function AboutPage() {
    const featuresList = [
        {
            icon: <ShieldCheckIcon className="w-10 h-10 text-bright-purple" />,
            title: "Enhanced Security",
            description:
                "Multi-signature wallets require multiple approvals for transactions, significantly reducing the risk of unauthorized transfers.",
        },
        {
            icon: <UsersIcon className="w-10 h-10 text-bright-purple" />,
            title: "Collaborative Control",
            description:
                "Share wallet management with team members or family, ensuring no single person has complete control over funds.",
        },
        {
            icon: <ClockIcon className="w-10 h-10 text-bright-purple" />,
            title: "Flexible Approval Thresholds",
            description:
                "Customize the number of signatures required for different transaction types and amounts.",
        },
        {
            icon: <LockIcon className="w-10 h-10 text-bright-purple" />,
            title: "Secure Key Management",
            description:
                "Advanced encryption and key storage techniques to protect your digital assets.",
        },
    ];

    const howItWorksSteps = [
        "Create a multi-signature wallet with selected co-signers",
        "Set approval thresholds for transactions",
        "Initiate a transaction",
        "Co-signers review and approve/reject the transaction",
        "Transaction is executed only when required signatures are obtained",
    ];

    return (
        <div className="bg-pale-lilac dark:bg-royal-purple min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-4 text-bright-purple dark:text-soft-lilac">
                        Multi-Signature Wallet
                    </h1>
                    <p className="text-xl text-vivid-lavender">
                        Secure, Collaborative Blockchain Asset Management
                    </p>
                </div>

                <section className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 text-bright-purple dark:text-soft-lilac">
                        Key Features
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {featuresList.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-light-lavender p-6 rounded-lg shadow-md"
                            >
                                <div className="flex items-center mb-4">
                                    {feature.icon}
                                    <h3 className="text-xl font-bold ml-4 text-bright-purple">
                                        {feature.title}
                                    </h3>
                                </div>
                                <p className="text-light-lavender dark:text-bright-purple">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 text-bright-purple dark:text-soft-lilac">
                        How It Works
                    </h2>
                    <div className="bg-white dark:bg-light-lavender p-8 rounded-lg shadow-md">
                        <ol className="list-decimal list-inside space-y-4">
                            {howItWorksSteps.map((step, index) => (
                                <li key={index} className="text-light-lavender">
                                    <span className="font-semibold text-bright-purple">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                <section className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 text-bright-purple dark:text-soft-lilac">
                        Why Choose Our Multi-Signature Wallet?
                    </h2>
                    <div className="bg-white dark:bg-light-lavender p-8 rounded-lg shadow-md">
                        <ul className="space-y-4">
                            {/* <li className="flex items-start">
                                <BookOpenIcon className="w-6 h-6 text-bright-purple mr-4 mt-1" />
                                <span className="text-light-lavender dark:text-bright-purple">
                                    Industry-leading security practices and regular audits
                                </span>
                            </li> */}
                            <li className="flex items-start">
                                <BookOpenIcon className="w-6 h-6 text-bright-purple mr-4 mt-1" />
                                <span className="text-light-lavender dark:text-bright-purple">
                                    User-friendly interface for easy management of complex
                                    transactions
                                </span>
                            </li>
                            <li className="flex items-start">
                                <BookOpenIcon className="w-6 h-6 text-bright-purple mr-4 mt-1" />
                                <span className="text-light-lavender dark:text-bright-purple">
                                    Built on Base
                                </span>
                            </li>
                            {/* <li className="flex items-start">
                                <BookOpenIcon className="w-6 h-6 text-bright-purple mr-4 mt-1" />
                                <span className="text-light-lavender dark:text-bright-purple">
                                    24/7 customer support and comprehensive documentation
                                </span>
                            </li> */}
                        </ul>
                    </div>
                </section>

                <div className="text-center">
                    <Link to={"/create-wallet"}>
                        <Button className=" bg-bright-purple hover:bg-vivid-lavender text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300">
                            Get Started Now
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
