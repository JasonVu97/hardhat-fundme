import { ethers, getNamedAccounts, network } from "hardhat"

async function main() {
    const { deployer } = await getNamedAccounts()
    const simpleStorage = await ethers.getContract("NFT", deployer)

    console.log(`Contract Address: ${simpleStorage.address}`)
    const currentValue = await simpleStorage.retrieve()
    console.log(`Currrent Value is: ${currentValue}`)

    const transactionResponse = await simpleStorage.store(450)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated Value is: ${updatedValue}`)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
