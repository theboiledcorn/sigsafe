const { expect } = require("chai");
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("SigsafeFactory", function () {
    it("should deploy sigsafe factory successfully", async function () {
        const SigsafeFactory = await ethers.getContractFactory("SigsafeFactory");
        const sigsafeFactory = await SigsafeFactory.deploy();

        expect(sigsafeFactory.address).to.not.equal(ZERO_ADDRESS);
    });

    it("should create a wallet successfully", async function () {
        const [owner, accountOne, accountTwo, accountThree, accountFour, accountFive] =
            await ethers.getSigners();

        const SigsafeFactory = await ethers.getContractFactory("SigsafeFactory");
        const SigsafeWallet = await ethers.getContractFactory("SigsafeWallet");
        const sigsafeFactory = await SigsafeFactory.deploy();

        const walletsOfUserBefore = await sigsafeFactory.getWallets(owner);

        const signatories = [owner, accountOne, accountTwo, accountThree, accountFour, accountFive];
        const duplicateSignatories = [
            owner,
            accountOne,
            accountOne,
            accountTwo,
            accountThree,
            accountFour,
            accountFive,
        ];

        const noOfApprovals = 2;

        await expect(sigsafeFactory.createWallet(noOfApprovals, signatories)).to.emit(
            sigsafeFactory,
            "WalletCreated"
        );

        expect(sigsafeFactory.createWallet(7, signatories)).to.be.revertedWithCustomError(
            SigsafeWallet,
            "RequiredApprovalsCantExceedSignatories"
        );

        expect(sigsafeFactory.createWallet(0, signatories)).to.be.revertedWithCustomError(
            SigsafeWallet,
            "RequiredApprovalsCantBeZero"
        );

        expect(sigsafeFactory.createWallet(3, duplicateSignatories)).to.be.revertedWithCustomError(
            SigsafeWallet,
            "DuplicateSignatoryAddress"
        );

        const walletsOfUserAfter = await sigsafeFactory.getWallets(owner);
        expect(walletsOfUserBefore.length + 1).to.equal(walletsOfUserAfter.length);

        const sigsafeWallet = await ethers.getContractAt("SigsafeWallet", walletsOfUserAfter[0]);

        const wallet = await sigsafeWallet.getWallet();

        expect(wallet[1]).to.equal(noOfApprovals);
        expect(wallet[2]).to.equal(signatories.length - noOfApprovals + 1);
        expect(wallet[3]).to.equal(0);
    });
});
