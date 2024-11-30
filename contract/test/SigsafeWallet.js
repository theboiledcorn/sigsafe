const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const createWalletABI = require("../utils/create-wallet-fn");

describe("SigsafeWallet", function () {
    async function deployFixture() {
        const [owner, accountOne, accountTwo, accountThree, accountFour, accountFive, accountSix] =
            await ethers.getSigners();

        const SigsafeFactory = await ethers.getContractFactory("SigsafeFactory");
        const sigsafeFactory = await SigsafeFactory.deploy();

        const SigsafeWallet = await ethers.getContractFactory("SigsafeWallet");

        const signatories = [owner, accountOne, accountTwo, accountThree, accountFour, accountFive];

        const noOfApprovals = 2;

        await sigsafeFactory.createWallet(noOfApprovals, signatories);

        const walletsOfUserAfter = await sigsafeFactory.getWallets(owner);

        const sigsafeWallet = await ethers.getContractAt("SigsafeWallet", walletsOfUserAfter[0]);

        return {
            owner,
            accountOne,
            accountTwo,
            accountThree,
            accountFour,
            accountFive,
            accountSix,
            SigsafeWallet,
            sigsafeWallet,
            sigsafeFactory,
        };
    }

    it("should fail to initiate transaction for non-signatory", async function () {
        const { accountSix, SigsafeWallet, sigsafeWallet } = await loadFixture(deployFixture);

        expect(
            sigsafeWallet.connect(accountSix).initiateTransaction(ZERO_ADDRESS, 0, "0x", "0x")
        ).to.be.revertedWithCustomError(SigsafeWallet, "NotASignatoryForThisWallet");
    });

    it("should create transaction for signatory", async function () {
        const { accountSix, SigsafeWallet, sigsafeWallet, accountTwo } = await loadFixture(deployFixture);

        const wallet = await sigsafeWallet.getWallet();

        await expect(sigsafeWallet.connect(accountTwo).initiateTransaction(ZERO_ADDRESS, 0, "0x", "0x")).to.emit(
            sigsafeWallet,
            "TransactionInitiated"
        );

        const walletAfter = await sigsafeWallet.getWallet();

        expect(wallet[3] + BigInt(1)).to.equal(walletAfter[3]);

        const transaction = await sigsafeWallet.getTransaction(wallet[3]);

        expect(transaction.initiatedAt).to.not.equal(0);
        expect(transaction.value).to.equal(0);
        expect(transaction.data).to.equal("0x");
    });

    it("should fail to vote on a transaction for non-signatory", async function () {
        const { accountSix, SigsafeWallet, sigsafeWallet, accountTwo } = await loadFixture(deployFixture);

        const wallet = await sigsafeWallet.getWallet();

        expect(
            sigsafeWallet.connect(accountSix).voteForTransaction(wallet[wallet.length - 1], true)
        ).to.be.revertedWithCustomError(SigsafeWallet, "NotASignatoryForThisWallet");
    });

    it("should vote, revote & reset vote on a transaction for signatory", async function () {
        const { accountSix, SigsafeWallet, sigsafeWallet, accountTwo, accountThree } = await loadFixture(deployFixture);

        await sigsafeWallet.connect(accountTwo).initiateTransaction(ZERO_ADDRESS, 0, "0x", "0x");

        const wallet = await sigsafeWallet.getWallet();

        const txID = wallet[3] - BigInt(1);
        const transaction = await sigsafeWallet.getTransaction(txID);

        await sigsafeWallet.connect(accountTwo).voteForTransaction(txID, true);

        const transactionAfter = await sigsafeWallet.getTransaction(txID);
        expect(transaction.approvalCount + BigInt(1)).to.equal(transactionAfter.approvalCount);
        expect(await sigsafeWallet.signatoryVotes(Number(txID), accountTwo.address)).to.equal(1); //Approved

        await sigsafeWallet.connect(accountTwo).voteForTransaction(txID, false);
        const transactionAfter2ndVote = await sigsafeWallet.getTransaction(txID);
        expect(transactionAfter2ndVote.approvalCount).to.equal(0);
        expect(transactionAfter.rejectionCount).to.equal(0);
        expect(transactionAfter2ndVote.rejectionCount).to.equal(1);
        expect(await sigsafeWallet.signatoryVotes(Number(txID), accountTwo.address)).to.equal(2); //Rejected

        expect(await sigsafeWallet.signatoryVotes(Number(txID), accountThree.address)).to.equal(0); //Unvoted

        await sigsafeWallet.connect(accountTwo).resetVote(txID);
        const transactionAfterResetVote = await sigsafeWallet.getTransaction(txID);
        expect(transactionAfterResetVote.approvalCount).to.equal(0);
        expect(await sigsafeWallet.signatoryVotes(Number(txID), accountTwo.address)).to.equal(0); //Unvoted
    });

    it("should fail to finalize a transaction without minimum approvals", async function () {
        const { accountSix, SigsafeWallet, sigsafeWallet, accountTwo, accountThree } = await loadFixture(deployFixture);

        await sigsafeWallet.connect(accountTwo).initiateTransaction(ZERO_ADDRESS, 0, "0x", "0x");

        const wallet = await sigsafeWallet.getWallet();
        const txID = wallet[3] - BigInt(1);

        expect(sigsafeWallet.connect(accountTwo).finalizeTransaction(txID)).to.be.revertedWithCustomError(
            SigsafeWallet,
            "MinimumApprovalsForTransactionNotMet"
        );

        await sigsafeWallet.connect(accountTwo).voteForTransaction(txID, true);
    });

    it("should finalize a transaction, fail to vote on already finalized transaction for signatory", async function () {
        const { accountSix, SigsafeWallet, sigsafeWallet, accountTwo, accountThree, accountOne } = await loadFixture(
            deployFixture
        );

        await sigsafeWallet.connect(accountTwo).initiateTransaction(ZERO_ADDRESS, 0, "0x", "0x");

        const wallet = await sigsafeWallet.getWallet();
        const txID = wallet[3] - BigInt(1);

        await sigsafeWallet.connect(accountTwo).voteForTransaction(txID, true);
        await sigsafeWallet.connect(accountThree).voteForTransaction(txID, true);

        await sigsafeWallet.connect(accountTwo).finalizeTransaction(txID);

        const transaction = await sigsafeWallet.getTransaction(txID);

        expect(transaction.executed).to.equal(true);

        expect(sigsafeWallet.connect(accountOne).voteForTransaction(txID, true)).to.be.revertedWithCustomError(
            SigsafeWallet,
            "TransactionAlreadyExecuted"
        ); // transaction executed
    });

    it("should finalize a transaction involving ETH transfer", async function () {
        const { accountSix, sigsafeWallet, accountTwo, accountThree, accountFive } = await loadFixture(deployFixture);

        // Fund the wallet with enough ETH
        const fundingTx = await accountTwo.sendTransaction({
            to: sigsafeWallet.target,
            value: ethers.parseEther("200"),
        });
        await fundingTx.wait();

        const sigsafeBalanceBefore = await ethers.provider.getBalance(sigsafeWallet.target);

        await sigsafeWallet.connect(accountTwo).initiateTransaction(accountSix.address, ethers.parseEther("100"), "0x", "0x");

        const wallet = await sigsafeWallet.getWallet();
        const txID = wallet[3] - BigInt(1);

        const accSixBalanceBefore = await ethers.provider.getBalance(accountSix.address);

        await sigsafeWallet.connect(accountFive).voteForTransaction(txID, true);
        await sigsafeWallet.connect(accountThree).voteForTransaction(txID, true);

        await sigsafeWallet.connect(accountTwo).finalizeTransaction(txID);

        // Check balances after transaction
        const accSixBalanceAfter = await ethers.provider.getBalance(accountSix.address);

        const sigsafeBalanceAfter = await ethers.provider.getBalance(sigsafeWallet.target);

        // Assert that the balance increased
        expect(accSixBalanceAfter).to.be.gt(accSixBalanceBefore);

        // sigsafe balance reduced
        expect(sigsafeBalanceAfter).to.be.lt(sigsafeBalanceBefore);

        // Check exact transfer amount
        expect(accSixBalanceAfter - accSixBalanceBefore).to.equal(ethers.parseEther("100"));
        expect(sigsafeBalanceBefore - sigsafeBalanceAfter).to.equal(ethers.parseEther("100"));
    });

    it("should finalize a transaction that involves calling a contract function", async function () {
        const {
            SigsafeWallet,
            sigsafeWallet,
            accountTwo,
            accountSix,
            accountThree,
            accountFour,
            accountOne,
            accountFive,
            owner,
            sigsafeFactory,
        } = await loadFixture(deployFixture);

        const noOfRequiredSignatories = 4;
        const signatories = [
            accountTwo.address,
            accountSix.address,
            accountThree.address,
            accountFour.address,
            accountOne.address,
            accountFive.address,
        ];

        const functionInterface = new ethers.Interface(createWalletABI.createWalletABI);

        const encodedData = functionInterface.encodeFunctionData("createWallet", [
            noOfRequiredSignatories,
            signatories,
        ]);

        await sigsafeWallet.connect(accountTwo).initiateTransaction(sigsafeFactory.target, 0, encodedData, "0x");

        const wallet = await sigsafeWallet.getWallet();
        const txID = wallet[3] - BigInt(1);

        await sigsafeWallet.connect(accountFive).voteForTransaction(txID, true);
        await sigsafeWallet.connect(accountThree).voteForTransaction(txID, true);
        await sigsafeWallet.connect(accountFour).voteForTransaction(txID, true);
        await sigsafeWallet.connect(accountOne).voteForTransaction(txID, true);

        const walletsOfSigsafeBefore = await sigsafeFactory.getWallets(sigsafeWallet.target);

        await sigsafeWallet.connect(accountTwo).finalizeTransaction(txID);

        const walletsOfSigsafeAfter = await sigsafeFactory.getWallets(sigsafeWallet.target);

        expect(walletsOfSigsafeBefore.length + 1).to.equal(walletsOfSigsafeAfter.length);
    });
});
