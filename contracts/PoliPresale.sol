// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import "./interface/TokenMintable.sol";

contract PoliPresale is Ownable {
    using SafeERC20 for IERC20;

    // current state
    bool public presaleActive;

    // rate of BNB:$POLI
    uint256 public rate = 2;

    // counter sold tokens per address
    mapping(address => uint256) public soldCount;

    uint256 public totalSoldCount;

    uint256 public completionTime; // TODO modifier and add

    TokenMintable public PoliToken;

    event PresaleMint(address buyer, uint256 numberOfTokens);

    constructor(
        address initialOwner,
        address tokenAddress
    ) Ownable(initialOwner) {
        PoliToken = TokenMintable(tokenAddress);

        completionTime = block.timestamp + (48 * 3600); // 48 hours
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

    function setCompletionTime(uint256 newTime) external onlyOwner {
        completionTime = newTime;
    }

    function setRate(uint) external onlyOwner {
        require(presaleActive, "Presale already paused");
        presaleActive = false;
    }

    function reclaimFunds(address recipient) external onlyOwner {
        // TODO it's important to refund BNB
        require(presaleActive == false, "Reclaim not allowed");

        assert(payable(recipient).send(address(this).balance));
    }

    function tranferToLiquidity(
        address[] memory recipients,
        uint256[] memory amounts
    ) external onlyOwner {
        require(presaleActive == false, "Transfer not allowed");
        require(
            recipients.length == amounts.length,
            "Recipients and amounts length mismatch"
        );

        for (uint256 i = 0; i < recipients.length; i++) {
            PoliToken.transferFromForMinter(
                address(1),
                recipients[i],
                amounts[i]
            );
        }
    }

    /// @dev Mint while state is Sale
    /// @param numberOfTokens - How many tokens to mint to validate amounts within a predefined rate
    function mint(uint256 numberOfTokens) external payable {
        require(block.timestamp <= completionTime, "Presale completed");
        require(presaleActive, "Buying not allowed");
        require(msg.value > 0, "Not enough Funds");

        uint256 value = msg.value;
        require(value * rate == numberOfTokens, "Wrong number of tokens");

        _mint(_msgSender(), numberOfTokens);
    }

    /// @dev Mint while state is Sale
    function mint() external payable {
        require(block.timestamp <= completionTime, "Presale completed");
        require(presaleActive, "Buying not allowed");
        require(msg.value > 0, "Not enough Funds");

        uint256 value = msg.value;
        uint256 numberOfTokens = value * rate;

        _mint(_msgSender(), numberOfTokens);
    }

    function _mint(address buyer, uint256 numberOfTokens) private {
        soldCount[buyer] += numberOfTokens;
        totalSoldCount += numberOfTokens;

        uint256 liquidityFee = (numberOfTokens * 15) / 100;

        PoliToken.mintTo(_msgSender(), numberOfTokens);
        PoliToken.mintTo(address(1), liquidityFee);

        emit PresaleMint(buyer, numberOfTokens);
    }
}
