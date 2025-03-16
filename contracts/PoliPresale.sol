// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import "./interface/TokenMintable.sol";

contract PoliPresale is Ownable {
    using SafeERC20 for IERC20;

    // current state
    bool public presaleActive = false;

    bool public transferred = false;

    // rate of BNB:$POLI
    uint256 public rate = 1000;

    uint256 public minDeposit = 0.05 ether;

    uint256 public maxDeposit = 20 ether;

    // counter sold tokens per address
    mapping(address => uint256) public soldCount;

    uint256 public totalSoldCount;

    uint256 public completionTime;

    uint256 public maxSupply = 1_000_000_000 ether;

    TokenMintable public PoliToken;

    event PresaleMint(address buyer, uint256 numberOfTokens);

    constructor(
        address initialOwner,
        address tokenAddress
    ) Ownable(initialOwner) {
        PoliToken = TokenMintable(tokenAddress);

        completionTime = block.timestamp + (48 * 3600); // 48 hours
    }

    modifier presaleConditions() {
        require(block.timestamp <= completionTime, "Presale completed");
        require(presaleActive, "Buying not allowed");
        require(msg.value >= minDeposit, "Not enough Funds");
        require(msg.value <= maxDeposit, "Exceeds max amount");
        _;
    }

    /// Pause presale (initiated state, but can be used for unexpected scenarios)
    function pausePresale() external onlyOwner {
        require(presaleActive, "Presale already paused");
        presaleActive = false;
    }

    /// Start Sale
    function startPresale() external onlyOwner {
        require(presaleActive == false, "Presale already started");
        presaleActive = true;
    }

    function setCompletionTime(uint256 newCompletionTime) external onlyOwner {
        completionTime = newCompletionTime;
    }

    function setMinDeposit(uint256 newMinDeposit) external onlyOwner {
        require(newMinDeposit < maxDeposit, "Minimum deposit is too high");
        minDeposit = newMinDeposit;
    }

    function setMaxDeposit(uint256 newMaxDeposit) external onlyOwner {
        require(newMaxDeposit > minDeposit, "Maximum deposit is too low");
        maxDeposit = newMaxDeposit;
    }

    function setMaxSupply(uint256 newMaxSupply) external onlyOwner {
        maxSupply = newMaxSupply;
    }

    function reclaimFunds(address recipient) external onlyOwner {
        require(presaleActive == false, "Reclaim not allowed");

        assert(payable(recipient).send(address(this).balance));
    }

    function transferToLiquidity(
        address[] memory recipients,
        uint256[] memory amounts
    ) external onlyOwner {
        require(transferred == false, "Already transferred");
        require(presaleActive == false, "Transfer not allowed");
        require(
            recipients.length == amounts.length,
            "Recipients and amounts length mismatch"
        );

        for (uint256 i = 0; i < recipients.length; i++) {
            PoliToken.mintTo(recipients[i], amounts[i]);
        }

        transferred = true;
    }

    /// @dev Mint while presale is active withtin numberOfTokens parameter to validate amounts
    /// @param numberOfTokens - How many tokens to mint to validate amounts within a predefined rate
    function mint(uint256 numberOfTokens) external payable presaleConditions {
        require(msg.value * rate == numberOfTokens, "Wrong number of tokens");

        _mint(_msgSender(), numberOfTokens);
    }

    /// @dev Mint while presale is active
    function mint() public payable presaleConditions {
        uint256 numberOfTokens = msg.value * rate;

        _mint(_msgSender(), numberOfTokens);
    }

    receive() external payable presaleConditions {
        uint256 numberOfTokens = msg.value * rate;

        _mint(_msgSender(), numberOfTokens);
    }

    fallback() external payable presaleConditions {
        uint256 numberOfTokens = msg.value * rate;

        _mint(_msgSender(), numberOfTokens);
    }

    function _mint(address buyer, uint256 numberOfTokens) private {
        require(
            totalSoldCount + numberOfTokens <= maxSupply,
            "Max supply reached"
        );

        soldCount[buyer] += numberOfTokens;
        totalSoldCount += numberOfTokens;

        PoliToken.mintTo(buyer, numberOfTokens);

        emit PresaleMint(buyer, numberOfTokens);
    }
}
