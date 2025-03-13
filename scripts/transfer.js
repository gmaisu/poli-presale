import {
    CONTRACT_ADDRESS,
    OWNER_PRIVATE_KEY,
    OWNER_ADDRESS,
    CONTRACT,
    TEAM_ADDRESSES_COUNT,
    TEAM_TOTAL_TOKENS,
    web3,
} from "./const.js";

import Wallet from "ethereumjs-wallet";
import { createObjectCsvWriter as csvWriter } from "csv-writer";

// Function to generate a single Ethereum address and private key
function generateAddress() {
    const wallet = Wallet["default"].generate();
    const address = wallet.getAddressString();
    const privateKey = wallet.getPrivateKeyString();

    return { address, privateKey };
}

// Function to distribute tokens randomly
function distributeTokens(totalAmount, n) {
    // Create an array of n-1 random partition points
    const points = [];
    for (let i = 0; i < n - 1; i++) {
        points.push(Math.random() * totalAmount);
    }

    // Sort the partition points and add 0 and totalAmount as boundaries
    points.push(0);
    points.push(totalAmount);
    points.sort((a, b) => a - b);

    // Calculate the differences between consecutive partition points
    const distribution = [];
    for (let i = 1; i < points.length; i++) {
        distribution.push(points[i] - points[i - 1]);
    }

    return distribution;
}

async function transferToLiquidity(recipients, amounts) {
    const convertedAmounts = amounts.map((a) =>
        web3.utils.toWei(a.toString(), "ether")
    );

    // Create the transaction
    const tx = CONTRACT.methods.transferToLiquidity(
        recipients,
        convertedAmounts
    );

    const gas = await tx.estimateGas({ from: OWNER_ADDRESS });
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(OWNER_ADDRESS);

    const signedTx = await web3.eth.accounts.signTransaction(
        {
            to: CONTRACT_ADDRESS,
            data: tx.encodeABI(),
            gas,
            gasPrice,
            nonce,
        },
        OWNER_PRIVATE_KEY
    );

    // Send the transaction
    const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
    );
    console.log("Transaction receipt:", receipt);
}

// Function to generate addresses, distribute tokens, and export to CSV
async function main() {
    const records = [];
    const recipients = [];

    const amounts = distributeTokens(TEAM_TOTAL_TOKENS, TEAM_ADDRESSES_COUNT);

    // Generate addresses and prepare data
    for (let i = 0; i < TEAM_ADDRESSES_COUNT; i++) {
        const { address, privateKey } = generateAddress();
        recipients.push(address);
        records.push({
            id: i + 1,
            address,
            privateKey,
            amount: amounts[i],
        });
    }

    // Export data to CSV
    const csv = csvWriter({
        path: "distribution.csv",
        header: [
            { id: "id", title: "ID" },
            { id: "address", title: "Public Address" },
            { id: "privateKey", title: "Private Key" },
            { id: "amount", title: "Received Amount" },
        ],
    });

    await csv.writeRecords(records);
    console.log("CSV file has been written successfully.");

    // Call the contract method to distribute tokens
    console.log("Distributing tokens...");
    await transferToLiquidity(recipients, amounts);
    console.log("Tokens distributed successfully.");
}

// Run the script
main().catch((err) => console.error(err));
