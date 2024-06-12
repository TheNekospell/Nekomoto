// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract TemporalShard is ERC721Burnable {
    uint256 private _tokenId = 0;
    address private _host;

    constructor() ERC721("TemporalShard", "TemporalShard") {
        _host = msg.sender;
    }

    function mint(address to) public {
        require(msg.sender == _host, "Only owner");
        _safeMint(to, ++_tokenId);
    }

    function burnFrom(address from, uint256 tokenId) public {
        _checkAuthorized(from, msg.sender, tokenId);
        address previousOwner = _update(address(0), tokenId, _msgSender());
        if (previousOwner != from) {
            revert ERC721IncorrectOwner(from, tokenId, previousOwner);
        }
    }
}
