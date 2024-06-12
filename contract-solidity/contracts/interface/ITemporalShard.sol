// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface ITemporalShard is IERC721 {
    function mint(address to) external;
    function burnFrom(address from, uint256 tokenId) external;
}
