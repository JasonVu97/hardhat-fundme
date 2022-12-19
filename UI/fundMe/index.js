import { ethers } from "./ethers-5.2.esm.min.js"
import { abi, contractAddress } from "./constants.js"
const connectButton = document.getElementById("btnConnect")
const fundButton = document.getElementById("btnFund")
const getBalanceButton = document.getElementById("btnBalance")
const getWithdrawButton = document.getElementById("btnWithdraw")
connectButton.onclick = connect
fundButton.onclick = fund
getBalanceButton.onclick = getBalance
getWithdrawButton.onclick = withdraw
async function connect() {
    if (typeof window.ethereum != undefined) {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "Connected"
    } else connectButton.innerHTML = "Not Connected"
}

async function fund() {
    const ethAmount = document?.getElementById("ethAmount")?.value || "1"
    console.log(`Funding with ${ethAmount}`)
    if (typeof window.ethereum != undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount)
            })
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, transactionReceipt => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

async function getBalance() {
    if (typeof window.ethereum != undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        document.getElementById(
            "balanceTxt"
        ).innerText = `Amount of Balance: ${ethers.utils.formatEther(balance)}`
    }
}

async function withdraw() {
    if (typeof window.ethereum != undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
            document.getElementById("balanceTxt").innerText =
                "Amount of Balance: 0"
        } catch (error) {
            console.log(error)
        }
    }
}
