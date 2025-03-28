import { Web3 } from "web3";
import "dotenv/config";

const CONTRACT_ABI = [
    {
        inputs: [
            {
                internalType: "address[]",
                name: "recipients",
                type: "address[]",
            },
            {
                internalType: "uint256[]",
                name: "amounts",
                type: "uint256[]",
            },
        ],
        name: "transferToLiquidity",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "pausePresale",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "recipient",
                type: "address",
            },
        ],
        name: "reclaimFunds",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "totalSoldCount",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];

// Configuration
export const CONTRACT_ADDRESS = process.env.PRESALE_CONTRACT_ADDRESS;
export const OWNER_PRIVATE_KEY = `0x${process.env.OWNER_PRIVATE_KEY}`;

// Initialize Web3 and contract
export const web3 = new Web3(process.env.BSC_RCP_URL);
export const CONTRACT = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

export const OWNER_ADDRESS =
    web3.eth.accounts.privateKeyToAccount(OWNER_PRIVATE_KEY).address;

export const RECLAIM_FUNDS_WALLET_ADDRESS =
    process.env.BNB_FUNDS_WALLET_ADDRESS;

export const TEAM_ADDRESSES_COUNT = 100; // Number of addresses to generate
