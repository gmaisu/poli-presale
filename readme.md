You need to install NodeJs tool to run scripts

[//]: #

      https://nodejs.org/en/download


      To check if it's properly installed, run command in terminal:

      npm -v

You need to install Git to clone repository

[//]: #

      https://git-scm.com/downloads


      run command in terminal:

      git clone https://github.com/gmaisu/poli-presale.git

After installation and cloning, you have to run next command in project directory

[//]: #

      npm i

Now you have to replace parameters

1. Find .env file
2. You will find next parameters:

[//]: #

      OWNER_PRIVATE_KEY=
      BNB_FUNDS_WALLET_ADDRESS=

      For example,
        Private key is 63760e0ff05d32357ad55808e63c342bcaa2479fb8dcfbc95327b3cb3bbdd3a5
        Address is 0x23bF361B060ADE9e2bFb105E0282965696e59715

     Replace them like
        OWNER_PRIVATE_KEY=63760e0ff05d32357ad55808e63c342bcaa2479fb8dcfbc95327b3cb3bbdd3a5
        BNB_FUNDS_WALLET_ADDRESS=0x23bF361B060ADE9e2bFb105E0282965696e59715

3. To deploy smart contracts, run next command

[//]: #

      Test environment: npm run migrate:test

      Production enviroment: npm run migrate:prod

4. After deployment, you will know smart contract addresses

[//]: #

      Replace PRESALE_CONTRACT_ADDRESS parameter in .env file like

      PRESALE_CONTRACT_ADDRESS=0x8DDeD894729383044c2916AFc65ebD29A4A6FcE1

# AFTER PRESALE COMPLETION

1. You have to find out how many tokens belongs to team

[//]: #

      Replace TEAM_TOTAL_TOKENS parameter in .env file

2. Run completing presale command

[//]: #

      Test environment: npm run complete:test

      Production enviroment: npm run complete:prod

3. Run reclaiming funds command to BNB_FUNDS_WALLET_ADDRESS

[//]: #

      Test environment: npm run reclaim:test

      Production enviroment: npm run reclaim:prod

4. Run distributing team tokens command. it's automated process

[//]: #

      Test environment: npm run transfer:test

      Production enviroment: npm run transfer:prod

You will see new created file named **distribution.csv** You can see here all of 100 wallet addresses with private keys and received amounts
