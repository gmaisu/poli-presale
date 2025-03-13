import {
    CONTRACT_ADDRESS,
    OWNER_PRIVATE_KEY,
    OWNER_ADDRESS,
    CONTRACT,
    RECLAIM_FUNDS_WALLET_ADDRESS,
    web3,
} from "./const.js";

async function reclaimFunds() {
    const tx = CONTRACT.methods.reclaimFunds(RECLAIM_FUNDS_WALLET_ADDRESS);

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

// Call the contract method to reclaim funds
async function main() {
    console.log("Reclaiming funds...");
    await reclaimFunds();
    console.log("Funds reclaimed successfully.");
}

// Run the script
main().catch((err) => console.error(err));
