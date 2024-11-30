# Sigsafe: Multi-Sig Wallet

## Overview

Sigsafe is a decentralized multi-signature wallet built on the Base (Sepolia) blockchain, designed to provide secure, collaborative transaction management for teams, DAOs, and organizations.

## Key Features

-   **Collaborative Transaction Approval**: Transactions require multiple signatories to approve or reject
-   **Flexible Signatory Configuration**: Customizable number of required approvals
-   **Transparent Voting Mechanism**: Clear tracking of transaction votes
-   **Secure Transaction Execution**: Prevents unauthorized transactions
-   **Event Logging**: Comprehensive event tracking for all wallet activities

## How It Works

1. **Wallet Creation**: Deploy a multi-sig wallet with selected signatories
2. **Transaction Initiation**: Any signatory can propose a transaction
3. **Voting Process**:
    - Signatories can approve or reject transactions
    - Transactions require a predefined number of approvals to execute
4. **Transaction Execution**: Once approved, transactions are automatically executed

## Technical Architecture

-   **Blockchain**: Base Sepolia (Ethereum L2)
-   **Smart Contracts**:
    -   `SigsafeWallet`: Core multi-sig wallet logic
    -   `SigsafeFactory`: Wallet creation and management
-   **Solidity Version**: ^0.8.27
-   **Security Features**:
    -   ReentrancyGuard
    -   Comprehensive error handling
    -   Signatory validation

## Development Setup

### Prerequisites

-   Node.js (v18+)
-   Hardhat
-   MetaMask or Web3 Wallet

### Smart Contract Development

```bash
# Clone the repository
git clone https://github.com/peppyeben/sigsafe

# Navigate to the contract folder
cd contract

# Install dependencies
npm install

# Compile contracts
npx run compile

# Run tests
npx run test

```

### Frontend Development

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## Deployed Contracts

-   **Base Sepolia Testnet**: `0xF4a787Fdf90CC3d837a95F00eeA4d5adC4aAA61f`

## Security

-   Tested smart contracts
-   Comprehensive error handling
-   Built with best security practices

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Disclaimer

Use at your own risk. Always conduct thorough testing before using in production.
