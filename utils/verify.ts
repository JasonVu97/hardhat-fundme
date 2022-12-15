// const { run } = require("hardhat")
import { run } from "hardhat"
export const verify = async (contractAddress: string, args: unknown[]) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args
        })
    } catch (error: any) {
        console.log(
            error.message.toLowerCase().includes("already verified")
                ? "Already Verified!"
                : error
        )
    }
}

