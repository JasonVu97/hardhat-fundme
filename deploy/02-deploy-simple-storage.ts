import { network } from "hardhat";
import { Address, DeploymentsExtension } from "hardhat-deploy/dist/types";
const { verify } = require("../utils/verify")
module.exports = async ({ getNamedAccounts, deployments }: {
    getNamedAccounts: () => Promise<{
        [name: string]: Address;
    }>, deployments: DeploymentsExtension
}) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const simpleStorage = await deploy("SimpleStorage", {
        from: deployer,
        args: [],
        log: true,
    })

    if (
        network.config.chainId === 11297108099
    )
        await verify(simpleStorage.address, [])
}
module.exports.tags = ["all", "simplestorage"]
