// const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
// const { assert, expect } = require("chai")
// const { developmentChains } = require("../../helper-hardhat-config")
import { assert } from "chai";
import { ethers, getNamedAccounts, network } from "hardhat";
import { Address } from 'hardhat-deploy/dist/types';
import { developmentChains } from "../../helper-hardhat-config";
import { FundMe } from '../../typechain-types/contracts/FundMe';
developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
        let fundMe: FundMe
        let deployer: Address
        const sendValue = ethers.utils.parseEther("0.04") // 0.04 ETH
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer
            fundMe = await ethers.getContract("FundMe", deployer)
        })

        it("allows people to fund and withdraw", async () => {
            await fundMe.fund({ value: sendValue })
            await fundMe.withdraw()
            const endingBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            assert.equal(endingBalance.toString(), "0")
        })
    })
