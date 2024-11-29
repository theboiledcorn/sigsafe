// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface SigsafeEvents {
    event WalletCreated(address indexed by, uint when);

    event TransactionInitiated(
        address indexed by,
        address indexed toWallet,
        uint txID,
        uint value,
        uint when
    );

    event SignatoryVoted(address indexed by, address indexed toWallet, uint txID, uint when);
    event VoteReset(address indexed by, address indexed to, uint txID, uint when);

    event TransactionExecuted(
        address indexed by,
        address indexed toWallet,
        address indexed toAddress,
        uint txID,
        uint value,
        uint when
    );

    event MoneyReceived(address indexed by, address indexed toWallet, uint value, uint when);
}
