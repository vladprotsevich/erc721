import { expect } from "chai";
import { ethers } from "hardhat";

import { MyNFT } from "../typechain-types";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("My NFT", async function () {
    let myNft: MyNFT
    let owner: SignerWithAddress;
    let collector: SignerWithAddress;
    let initialMintCount: number;

    beforeEach(async function() {
        [owner, collector] = await ethers.getSigners();

        const MyNFT = await ethers.getContractFactory("MyNFT", owner);
        myNft = await MyNFT.deploy();
        await myNft.deployed();

        initialMintCount = 3;
        for (let i = 1; i <= initialMintCount; i++) { 
            await myNft.mintNFT(owner.address, "");
        }        
    })

    it("should create a token with a name", async () => {
        expect(await myNft.name()).to.exist;
    })

    it("should create a token with a symbol", async () => {
        expect(await myNft.name()).to.exist;
    })    

    it('should check owner of minted tokens', async () => {
        for (let i = 1; i < 4; i++) {
            expect(await myNft.ownerOf(i)).to.equal(owner.address);
        }
    });   
    
    it('should check if minted tokens amount to be equal to initial minted count', async () => {
        expect(await myNft.balanceOf(owner.address)).to.equal(initialMintCount);
    });    

    it('should be able to mint a new NFT to the collector collection', async () => {
        let tokenId = initialMintCount + 1;
        await myNft.mintNFT(collector.address, String(tokenId));
        expect(await myNft.ownerOf(tokenId)).to.eq(collector.address);
    })

    it('should emit a transfer event for newly minted NFTs', async function () {
        let tokenId = initialMintCount + 1;
        await expect(myNft.mintNFT(owner.address, String(tokenId)))
        .to.emit(myNft, "Transfer")
        .withArgs("0x0000000000000000000000000000000000000000", owner.address, tokenId);
      });    

    it("should be able to transfer NFT to another wallet", async () => {
        let tokenId = initialMintCount + 1;
        await myNft.mintNFT(owner.address, String(tokenId));

        expect(await myNft.ownerOf(tokenId)).to.eq(owner.address);
        expect(await myNft.ownerOf(tokenId)).to.not.eq(collector.address);

        await myNft.functions.safeTransferFrom(owner.address, collector.address, tokenId, "0x");

        expect(await myNft.ownerOf(tokenId)).to.not.eq(owner.address);
        expect(await myNft.ownerOf(tokenId)).to.eq(collector.address);
    })

    it("should emit a transfer event when transferring NFT", async () => {
        let tokenId = initialMintCount + 1;
        await myNft.mintNFT(owner.address, String(tokenId));

        expect(myNft.functions.safeTransferFrom(owner.address, collector.address, tokenId, "0x"))
            .to.emit(myNft, "Transfer").withArgs(owner.address, collector.address, tokenId, "0x");
    })

    it('should approve an operator to spend all of an owner\'s NFTs', async () => {
        await myNft.setApprovalForAll(collector.address, true);
        expect(await myNft.isApprovedForAll(owner.address, collector.address)).to.equal(true);
    });    

    it('should emit an ApprovalForAll event when an operator is approved to spend all NFTs', async () => {
        let isApproved = true
        await expect(myNft.setApprovalForAll(collector.address, isApproved))
        .to.emit(myNft, "ApprovalForAll")
        .withArgs(owner.address, collector.address, isApproved);
    });    

    it('should remove an operator from spending all of owner\'s NFTs', async () => {
        // Approve all NFTs first
        await myNft.setApprovalForAll(collector.address, true);
        // Remove approval privileges
        await myNft.setApprovalForAll(collector.address, false);
        expect(await myNft.isApprovedForAll(owner.address, collector.address)).to.equal(false);
    });      
})