// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interface/INeko.sol";
import "./interface/ITemporalShard.sol";
import "./interface/IPrism.sol";

contract Buff {
    address internal _host;
    INeko internal _neko;
    IPrism internal _prism;
    ITemporalShard internal _temporalShard;

    mapping(address => uint8) internal _lucky;
    mapping(address => uint256) internal _timeFreeze;
    // uint256 internal _bountyWaveStart;
    mapping(address => uint8) internal _ascend;

    constructor() {
        _host = msg.sender;
        // _bountyWaveStart = block.timestamp;
    }

    function init(address neko, address prisma, address shard) public {
        require(msg.sender == _host);
        _neko = INeko(neko);
        _prism = IPrism(prisma);
        _temporalShard = ITemporalShard(shard);
    }

    function lucky(address input) public view returns (bool) {
        return _lucky[input] >= 1;
    }

    function _addLucky(address input) internal {
        _lucky[input] += 1;
    }

    function _subtractLucky(address input) internal {
        _lucky[input] -= 1;
    }

    function timeFreeze(address input) public view returns (bool) {
        uint256 timeFreezeStart = _timeFreeze[input];
        if (
            timeFreezeStart <= block.timestamp &&
            (block.timestamp - timeFreezeStart < 259200)
        ) {
            return true;
        }
        return false;
    }

    event TimeFreeze(address indexed sender, uint256 tokenId, uint256 time);

    function startTimeFreeze(uint256 tokenId) public {
        address input = msg.sender;
        require(_timeFreezeEnd(input) <= block.timestamp, "Already frozen");
        _temporalShard.burnFrom(input, tokenId);
        _timeFreeze[input] = block.timestamp;
        emit TimeFreeze(input, tokenId, _timeFreeze[input]);
    }

    function _timeFreezeEnd(address input) internal view returns (uint256) {
        if (_timeFreeze[input] == 0) {
            return 0;
        }
        return _timeFreeze[input] + 259200;
    }

    function ascend(address input) public view returns (uint256, uint256) {
        uint256 level = _ascend[input];
        uint256 bonus = 0;
        if (level == 1) {
            bonus = 2;
        } else if (level == 2) {
            bonus = 5;
        } else if (level == 3) {
            bonus = 10;
        } else if (level == 4) {
            bonus = 15;
        } else if (level == 5) {
            bonus = 20;
        } else if (level == 6) {
            bonus = 28;
        } else if (level == 7) {
            bonus = 35;
        } else if (level == 8) {
            bonus = 43;
        } else if (level == 9) {
            bonus = 51;
        }
        return (level, bonus);
    }

    event UpgradeAscend(
        address indexed sender,
        uint256 newLevel,
        uint256 nekoCount,
        uint256 prism
    );

    function upgradeAscend() public {
        uint8 ascendOf = _ascend[msg.sender];
        (uint256 nekoCount, uint256 prism) = _upgradeAscendConsume(ascendOf + 1);

        require(nekoCount > 0, "Exceed max level");

        _neko.burnFrom(msg.sender, nekoCount * 1000000000000000000);
        if (prism > 0) {
            _prism.burnFrom(msg.sender, prism * 1000000000000000000);
        }
        _ascend[msg.sender] = ascendOf + 1;
        emit UpgradeAscend(msg.sender, ascendOf + 1, nekoCount, prism);
    }

    function _upgradeAscendConsume(
        uint8 targetLevel
    ) internal pure returns (uint256, uint256) {
        if (targetLevel == 1) {
            return (100, 9);
        } else if (targetLevel == 2) {
            return (437, 16);
        } else if (targetLevel == 3) {
            return (1910, 27);
        } else if (targetLevel == 4) {
            return (8345, 47);
        } else if (targetLevel == 5) {
            return (36469, 82);
        } else if (targetLevel == 6) {
            return (159370, 142);
        } else if (targetLevel == 7) {
            return (696448, 247);
        } else if (targetLevel == 8) {
            return (3043477, 429);
        } else if (targetLevel == 9) {
            return (13299996, 746);
        }
        return (0, 0);
    }
}
