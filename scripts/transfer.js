const { Web3 } = require("web3");
const Wallet = require("ethereumjs-wallet").default;
const csvWriter = require("csv-writer").createObjectCsvWriter;

// Configuration
const BSC_RPC_URL = "https://data-seed-prebsc-1-s1.binance.org:8545"; // BSC mainnet RPC URL
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
];

const CONTRACT_ADDRESS = "0x8DDeD894729383044c2916AFc65ebD29A4A6FcE1"; // Replace with contract address
const OWNER_PRIVATE_KEY = "0xYourPrivateKey"; // Replace with the owner's private key -- note 0x is needed before private key, for example your private key is bcd65235a, result is 0xbcd65235a
const TOTAL_TOKENS = 37.5; // Total tokens to distribute
const NUM_ADDRESSES = 100; // Number of addresses to generate

// Initialize Web3 and contract
const web3 = new Web3(BSC_RPC_URL);
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

const ownerAddress =
    web3.eth.accounts.privateKeyToAccount(OWNER_PRIVATE_KEY).address;

// Function to generate a single Ethereum address and private key
function generateAddress() {
    const wallet = Wallet.generate();
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

async function pausePresale() {
    const tx = contract.methods.pausePresale();

    const gas = await tx.estimateGas({ from: ownerAddress });
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(ownerAddress);

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

// Function to call the contract's `transferToLiquidity` method
async function transferToLiquidity(recipients, amounts) {
    const convertedAmounts = amounts.map((a) =>
        web3.utils.toWei(a.toString(), "ether")
    );

    // Create the transaction
    const tx = contract.methods.tranferToLiquidity(
        recipients,
        convertedAmounts
    );

    const gas = await tx.estimateGas({ from: ownerAddress });
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(ownerAddress);

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

    console.log(
        `gas: ${gas}, gasPrice: ${gasPrice}, nonce: ${nonce}, signedTX: ${signedTx}`
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

    const amounts = distributeTokens(TOTAL_TOKENS, NUM_ADDRESSES);

    // Generate addresses and prepare data
    for (let i = 0; i < NUM_ADDRESSES; i++) {
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

    // Call the contract method to pause presale
    console.log("Completing presale...");
    await pausePresale();
    console.log("Presale completed successfully.");

    // Call the contract method to distribute tokens
    console.log("Distributing tokens...");
    await transferToLiquidity(recipients, amounts);
    console.log("Tokens distributed successfully.");
}

// Run the script
main().catch((err) => console.error(err));
