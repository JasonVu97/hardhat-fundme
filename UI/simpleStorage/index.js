import { ethers } from "./ethers-5.2.esm.min.js"
import { abi, contractAddress } from "./constants.js"
const connectButton = document.getElementById("btnConnect")
const storeButton = document.getElementById("btnStore")
const retrieveButton = document.getElementById("btnRetrieve")
connectButton.onclick = connect
storeButton.onclick = store
retrieveButton.onclick = retrieve
async function connect() {
    if (typeof window.ethereum != undefined) {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "Connected"
    } else connectButton.innerHTML = "Not Connected"
}

async function store() {
    const number = document?.getElementById("favorNumber")?.value || 0
    retrieveButton.setAttribute("disabled", "disabled")
    if (typeof window.ethereum != undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.store(number)
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
            retrieveButton.removeAttribute("disabled")
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

async function retrieve() {
    if (typeof window.ethereum != undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.retrieve()
            document.getElementById(
                "value"
            ).innerText = `Current Numbers: ${transactionResponse.toString()}`
        } catch (error) {
            console.log(error)
        }
    }
}
