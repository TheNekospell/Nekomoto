// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract Prism is ERC20Burnable {

    address private _owner;

    constructor() ERC20("Prism", "PRISM") {
        _owner = msg.sender;
    }

    function mint(address to, uint256 amount) public {
        require(msg.sender == _owner, "Only owner");
        _mint(to, amount);
    }

}
