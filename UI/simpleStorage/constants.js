export const contractAddress = "0x6AF53a128de31776b0f113c7c9D5B248004B4eDA"
export const abi = [
    {
        inputs: [
            {
                internalType: "string",
                name: "_name",
                type: "string"
            },
            {
                internalType: "uint256",
                name: "_favorNumbers",
                type: "uint256"
            }
        ],
        name: "addPerson",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "",
                type: "string"
            }
        ],
        name: "nameToFavorNumbers",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        name: "people",
        outputs: [
            {
                internalType: "uint256",
                name: "favorNumbers",
                type: "uint256"
            },
            {
                internalType: "string",
                name: "name",
                type: "string"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "retrieve",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_favorNumbers",
                type: "uint256"
            }
        ],
        name: "store",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    }
]
