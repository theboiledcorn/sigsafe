// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./SigsafeWallet.sol";
import "./SigsafeEvents.sol";

contract SigsafeFactory {
    mapping(address => address[]) private wallets;

    function createWallet(uint noOfRequiredSignatories, address[] memory _signatories) external {
        SigsafeWallet wallet = new SigsafeWallet(noOfRequiredSignatories, _signatories);

        wallets[msg.sender].push(address(wallet));

        emit SigsafeEvents.WalletCreated(msg.sender, block.timestamp);
    }

    function getWallets(address _initiatorAddress) external view returns (address[] memory) {
        return wallets[_initiatorAddress];
    }
}
