// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

interface TokenMintable {

    function mintTo(address to, uint256 amount) external;

    function transferFromForMinter(address from, address to, uint256 amount) external;

}
