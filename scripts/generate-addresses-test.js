const Web3 = require("web3");
const Wallet = require("ethereumjs-wallet").default;
const csvWriter = require("csv-writer").createObjectCsvWriter;

function generateAddress() {
    const wallet = Wallet.generate();
    const address = wallet.getAddressString();
    const privateKey = wallet.getPrivateKeyString();

    return { address, privateKey };
}

async function generateAndExportAddresses() {
    const records = [];

    // Generate 100 addresses
    for (let i = 0; i < 100; i++) {
        const { address, privateKey } = generateAddress();
        records.push({ id: i + 1, address, privateKey });
    }

    // Configure CSV writer
    const csv = csvWriter({
        path: "addresses.csv",
        header: [
            { id: "id", title: "ID" },
            { id: "address", title: "Address" },
            { id: "privateKey", title: "Private Key" },
        ],
    });

    // Write records to CSV
    await csv.writeRecords(records);
    console.log("CSV file has been written successfully.");
}

// Run the script
generateAndExportAddresses().catch((err) => console.error(err));
