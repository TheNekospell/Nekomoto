// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract Neko is ERC20Burnable {

    constructor(address to) ERC20("NekoCoin", "NKO") {
        _mint(to, 2_000_000_000 * 10 ** 18);
    }

}
