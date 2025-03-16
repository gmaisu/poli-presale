// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

import "./interface/TokenMintable.sol";

contract PoliToken is
    ERC20,
    ERC20Pausable,
    Ownable,
    AccessControl,
    TokenMintable
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(
        address initialOwner
    ) ERC20("Poli", "$POLI") Ownable(initialOwner) {
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mintTo(
        address account,
        uint256 value
    ) external override onlyRole(MINTER_ROLE) {
        _update(address(0), account, value);
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }
}
