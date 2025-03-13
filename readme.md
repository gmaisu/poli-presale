You need install NodeJs tool to run scripts. Without it, you cannot run anything

[//]: #

      https://nodejs.org/en/download

      To check if it's installed, run command in terminal: npm -v

After installation, you have to run next command in project directory

[//]: #

      npm i

Now you have to change some parameters in code

1. Find .env file
2. You will find next parameters:

[//]: #

      OWNER_PRIVATE_KEY=
      BNB_FUNDS_WALLET_ADDRESS=

      For example,
        Private key is 63760e0ff05d32357ad55808e63c342bcaa2479fb8dcfbc95327b3cb3bbdd3a5
        Address is 0x23bF361B060ADE9e2bFb105E0282965696e59715

     Replace .env parameters like
        OWNER_PRIVATE_KEY=63760e0ff05d32357ad55808e63c342bcaa2479fb8dcfbc95327b3cb3bbdd3a5
        BNB_FUNDS_WALLET_ADDRESS=0x23bF361B060ADE9e2bFb105E0282965696e59715

3. To deploy smart contracts, run next command

[//]: #

      npx truffle migrate --network bsc_mainnet

4. After deployment, you will know smart contract addresses

[//]: #

      Replace PRESALE_CONTRACT_ADDRESS parameter in .env file like

      PRESALE_CONTRACT_ADDRESS=0x8DDeD894729383044c2916AFc65ebD29A4A6FcE1

# AFTER PRESALE COMPLETION

1. You have to find out how many tokens belongs to team

[//]: #

      Replace TEAM_TOTAL_TOKENS parameter in .env file

2. Run reclaiming funds, tokens distribution script in terminal in project directory. it's automated process

[//]: #

      node .\scripts\transfer.js

You will see new created file named **distribution.csv** You can see here all of 100 wallet addresses with private keys and received amounts
