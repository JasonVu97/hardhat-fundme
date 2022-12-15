// const { network } = require("hardhat")
// const {
//     developmentChains,
//     INITIAL_ANSWER,
//     DECIMALS
// } = require("../helper-hardhat-config")
import { network } from "hardhat"
import { Address, DeploymentsExtension } from "hardhat-deploy/dist/types";
import { developmentChains, INITIAL_ANSWER, DECIMALS } from "../helper-hardhat-config"
module.exports = async ({ getNamedAccounts, deployments }: {
    getNamedAccounts: () => Promise<{
        [name: string]: Address;
    }>, deployments: DeploymentsExtension
}) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    log(deployer)
    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            args: [DECIMALS, INITIAL_ANSWER],
            log: true
        })
        log("Mocks deployed!")
    }
}
module.exports.tags = ["all", "mocks"]
