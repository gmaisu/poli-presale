const PoliTokenContract = artifacts.require("PoliToken.sol");
const PoliPresaleContract = artifacts.require("PoliPresale.sol");

module.exports = async function (deployer, network, accounts) {
    const owner = accounts[0];

    console.log(`Owner address is ${owner}`);

    await deployer.deploy(PoliTokenContract, owner);

    const POLI_TOKEN = await PoliTokenContract.deployed();

    await deployer.deploy(PoliPresaleContract, owner, POLI_TOKEN.address);

    const PRESALE = await PoliPresaleContract.deployed();

    /// grant MINTER role to Presale contract
    const MINTER_ROLE = await POLI_TOKEN.MINTER_ROLE();
    await POLI_TOKEN.grantRole(MINTER_ROLE, PRESALE.address);

    /// start presale
    await PRESALE.startPresale();
};
