// require("@nomicfoundation/hardhat-toolbox")
// require("dotenv").config()
// require("@nomiclabs/hardhat-etherscan")
// require("@nomiclabs/hardhat-waffle")
// require("hardhat-gas-reporter")
// require("solidity-coverage")
// require("hardhat-deploy")
import "@nomicfoundation/hardhat-toolbox"
import "dotenv/config"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-waffle"
import "hardhat-gas-reporter"
import "solidity-coverage"
import "hardhat-deploy"
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const INFURA_API_KEY = process.env.INFURA_API_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337
        },
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
            blockConfirmations: 6
        },
        palm_testnet: {
            url: `https://palm-testnet.infura.io/v3/${INFURA_API_KEY}`,
            accounts: [PRIVATE_KEY],
            chainId: 11297108099
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
        customChains: [
            {
                network: "palm_testnet",
                chainId: 11297108099,
                urls: {
                    apiURL: "https://explorer.palm-uat.xyz/api",
                    browserURL: "https://explorer.palm-uat.xyz/"
                }
            }
        ]
    },
    gasReporter: {
        enabled: true,
        currency: "USD"
    },
    namedAccounts: {
        deployer: {
            default: 0
        },
        user: {
            default: 1
        }
    },
    solidity: {
        compilers: [{ version: "0.8.7" }, { version: "0.6.6" }]
    }
}
