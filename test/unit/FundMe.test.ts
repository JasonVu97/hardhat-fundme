import { MockV3Aggregator } from './../../typechain-types/@chainlink/contracts/src/v0.6/tests/MockV3Aggregator';
// const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
// const { assert, expect } = require("chai")
// const { developmentChains } = require("../../helper-hardhat-config")
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { assert, expect } from "chai"
import { developmentChains } from "../../helper-hardhat-config"
import { Address } from 'hardhat-deploy/dist/types';
import { FundMe } from '../../typechain-types/contracts/FundMe';
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
        let fundMe: FundMe
        let deployer: Address
        let mockV3Aggregator: MockV3Aggregator
        const sendValue = ethers.utils.parseEther("1") // 1 ETH
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["all"])
            fundMe = await ethers.getContract("FundMe", deployer)
            mockV3Aggregator = await ethers.getContract(
                "MockV3Aggregator",
                deployer
            )
        })
        describe("constructor", async () => {
            it("set the aggregator addresses correctly", async () => {
                const response = await fundMe.getPriceFeed()
                assert.equal(response, mockV3Aggregator.address)
            })
        })

        describe("fund", async () => {
            it("Fails if you don't send enough ETH", async () => {
                await expect(fundMe.fund()).to.be.revertedWith(
                    "Didn't send enough!"
                )
            })
            it("updated the amount funded data structure", async () => {
                await fundMe.fund({ value: sendValue })
                const response = await fundMe.getAmountOfFunder(deployer)
                assert.equal(response.toString(), sendValue.toString())
            })
            it("Address funder to array of funders", async () => {
                await fundMe.fund({ value: sendValue })
                const funder = await fundMe.getFunder(0)
                assert.equal(funder, deployer)
            })
        })
        describe("withdraw", async () => {
            beforeEach(async () => {
                await fundMe.fund({ value: sendValue })
            })

            it("withdraw ETH from a single founder", async () => {
                // Arrange
                const startingFundMeBalance = await fundMe.provider.getBalance(
                    fundMe.address
                )
                const startingDeployerBalance = await fundMe.provider.getBalance(
                    deployer
                )

                // Act
                const transactionResponse = await fundMe.withdraw()
                const transactionReceipt = await transactionResponse.wait(1)
                const { gasUsed, effectiveGasPrice } = transactionReceipt
                const gasCost = gasUsed.mul(effectiveGasPrice)

                const endingFundMeBalance = await fundMe.provider.getBalance(
                    fundMe.address
                )
                const endingDeployerBalance = await fundMe.provider.getBalance(
                    deployer
                )

                // Assert
                assert.equal(endingFundMeBalance.toString(), '0')
                assert.equal(
                    startingFundMeBalance
                        .add(startingDeployerBalance)
                        .toString(),
                    endingDeployerBalance.add(gasCost).toString()
                )
            })

            it("allows us to withdraw with multiple funders", async () => {
                // Arrange
                const accounts = await ethers.getSigners()
                for (let i = 1; i < 6; i++) {
                    const fundMeConnectedContract = await fundMe.connect(
                        accounts[i]
                    )
                    await fundMeConnectedContract.fund({ value: sendValue })
                }

                const startingFundMeBalance = await fundMe.provider.getBalance(
                    fundMe.address
                )
                const startingDeployerBalance = await fundMe.provider.getBalance(
                    deployer
                )

                // Act
                const transactionResponse = await fundMe.withdraw()
                const transactionReceipt = await transactionResponse.wait(1)
                const { gasUsed, effectiveGasPrice } = transactionReceipt
                const gasCost = gasUsed.mul(effectiveGasPrice)

                const endingFundMeBalance = await fundMe.provider.getBalance(
                    fundMe.address
                )
                const endingDeployerBalance = await fundMe.provider.getBalance(
                    deployer
                )

                // Assert
                assert.equal(endingFundMeBalance.toString(), '0')
                assert.equal(
                    startingFundMeBalance
                        .add(startingDeployerBalance)
                        .toString(),
                    endingDeployerBalance.add(gasCost).toString()
                )

                await expect(fundMe.getFunder(0)).to.be.reverted
                for (let i = 1; i < 6; i++) {
                    assert.equal(
                        await (await fundMe.getAmountOfFunder(accounts[i].address)).toString(),
                        '0'
                    )
                }
            })

            it("Only allows the owner to withdraw", async () => {
                const accounts = await ethers.getSigners()
                const attacker = accounts[1]
                const attackerConnectedContract = await fundMe.connect(
                    attacker
                )
                await expect(attackerConnectedContract.withdraw()).to.be
                    .reverted
            })

            it("cheaper withdraw...", async () => {
                // Arrange
                const accounts = await ethers.getSigners()
                for (let i = 1; i < 6; i++) {
                    const fundMeConnectedContract = await fundMe.connect(
                        accounts[i]
                    )
                    await fundMeConnectedContract.fund({ value: sendValue })
                }

                const startingFundMeBalance = await fundMe.provider.getBalance(
                    fundMe.address
                )
                const startingDeployerBalance = await fundMe.provider.getBalance(
                    deployer
                )

                // Act
                const transactionResponse = await fundMe.cheaperWithdraw()
                const transactionReceipt = await transactionResponse.wait(1)
                const { gasUsed, effectiveGasPrice } = transactionReceipt
                const gasCost = gasUsed.mul(effectiveGasPrice)

                const endingFundMeBalance = await fundMe.provider.getBalance(
                    fundMe.address
                )
                const endingDeployerBalance = await fundMe.provider.getBalance(
                    deployer
                )

                // Assert
                assert.equal(endingFundMeBalance.toString(), '0')
                assert.equal(
                    startingFundMeBalance
                        .add(startingDeployerBalance)
                        .toString(),
                    endingDeployerBalance.add(gasCost).toString()
                )

                await expect(fundMe.getFunder(0)).to.be.reverted
                for (let i = 1; i < 6; i++) {
                    assert.equal(
                        await (await fundMe.getAmountOfFunder(accounts[i].address)).toString(),
                        '0'
                    )
                }
            })
        })
    })
