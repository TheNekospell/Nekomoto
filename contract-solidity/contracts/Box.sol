// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "./Buff.sol";

contract Box is Buff, ERC721Burnable {
    uint256 public _tokenId = 0;

    mapping(uint256 => uint256) internal _seed;
    mapping(uint256 => uint8) internal _withBuff;
    mapping(uint256 => uint8) internal _starter;
    mapping(address => uint8) public _openPack;
    uint256 public starterPackLimit = 20000;
    // info
    mapping(uint256 => uint256) internal _fadeIncrease;
    mapping(uint256 => uint256) internal _fadeConsume;
    mapping(uint256 => uint256) internal _stakeTime;
    mapping(uint256 => address) internal _stakeFrom;
    mapping(uint256 => uint8) internal _level;

    constructor() ERC721("Nekomoto", "Nekomoto") {
        // _owner = msg.sender;
    }

    struct Info {
        string rarity;
        string element;
        string name;
        uint256 SPI;
        uint256 ATK;
        uint256 DEF;
        uint256 SPD;
        uint256 Fade;
        uint256 Mana;
        uint256 level;
    }

    event Summon(address indexed to, uint256 indexed tokenId);

    event Reset(uint256 indexed tokenId);

    event Upgrade(
        address indexed sender,
        uint256 indexed tokenId,
        uint256 newLevel,
        uint256 nekoCount,
        uint256 prismCount
    );

    function stake(uint256[] calldata tokenId) public {
        require(tokenId.length > 0);
        address from = msg.sender;
        for (uint256 i = 0; i < tokenId.length; i++) {
            require(tokenId[i] <= _tokenId);
            uint256 seed = _seed[tokenId[i]];
            uint256 withBuff = _withBuff[tokenId[i]];
            uint8 rarity = _generateRarity(
                seed,
                withBuff,
                _starter[tokenId[i]] == 1
            );
            if (rarity == 4 || rarity == 5) {
                _addLucky(from);
            }
            _stakeTime[tokenId[i]] = block.timestamp;
            _stakeFrom[tokenId[i]] = from;
            address previousOwner = _update(_host, tokenId[i], address(0));
            if (previousOwner != from) {
                revert ERC721IncorrectOwner(from, tokenId[i], previousOwner);
            }
        }
    }

    function withdraw(uint256[] calldata tokenId) public {
        require(tokenId.length > 0);
        for (uint256 i = 0; i < tokenId.length; i++) {
            require(tokenId[i] <= _tokenId);
            uint256 seed = _seed[tokenId[i]];
            uint256 withBuff = _withBuff[tokenId[i]];
            bool isStarter = _starter[tokenId[i]] == 1;
            uint8 rarity = _generateRarity(seed, withBuff, isStarter);
            address to = _stakeFrom[tokenId[i]];
            if (rarity == 4 || rarity == 5) {
                _subtractLucky(to);
            }
            uint256 Fade = _generateFade(
                rarity,
                seed,
                tokenId[i],
                false,
                isStarter
            );
            require(Fade == 0);
            _fadeConsume[tokenId[i]] += _stakeConsume(tokenId[i]);
            address previousOwner = _update(to, tokenId[i], address(0));
            if (previousOwner != _host) {
                revert ERC721IncorrectOwner(_host, tokenId[i], previousOwner);
            }
        }
    }

    // function transferFrom(
    //     address from,
    //     address to,
    //     uint256[] calldata tokenId
    // ) public {
    //     require(tokenId.length > 0);
    //     for (uint256 i = 0; i < tokenId.length; i++) {
    //         transferFrom(from, to, tokenId[i]);
    //     }
    // }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        require(tokenId <= _tokenId);
        _level[tokenId] = 0;
        _fadeConsume[tokenId] = 0;
        _fadeIncrease[tokenId] = 0;
        _stakeTime[tokenId] = 0;

        if (to == address(0)) {
            revert ERC721InvalidReceiver(address(0));
        }
        // Setting an "auth" arguments enables the `_isAuthorized` check which verifies that the token exists
        // (from != 0). Therefore, it is not needed to verify that the return value is not 0 here.
        address previousOwner = _update(to, tokenId, _msgSender());
        if (previousOwner != from) {
            revert ERC721IncorrectOwner(from, tokenId, previousOwner);
        }

        emit Reset(tokenId);
    }

    function addLimit(uint256 input) public {
        require(msg.sender == _host);
        starterPackLimit += input;
    }

    function starterPack() public {
        address sender = msg.sender;
        require(_openPack[sender] == 0 && starterPackLimit > 0);
        _openPack[sender] = 1;
        starterPackLimit--;
        uint256 tokenId = ++_tokenId;
        _safeMint(sender, tokenId);
        emit Summon(sender, tokenId);
    }

    function summon(address to, uint256 count, uint256 input) public {
        require(msg.sender == _host);

        // 25000*10**18
        uint256 value = count * 25000000000000000000000;
        _neko.transferFrom(to, _host, (value * 75) / 100);
        _neko.burnFrom(to, (value * 25) / 100);

        for (uint256 i = 0; i < count; i++) {
            uint256 seed = uint256(
                keccak256(abi.encodePacked(blockhash(block.number), input++))
            );

            bool isLucky = lucky(to);

            // summon
            uint256 rarityNumber = _random(seed, 0, 10000);
            if (rarityNumber < 5 || (!isLucky && rarityNumber < 450)) {
                // empty box
                continue;
            }

            uint256 tokenId = ++_tokenId;
            _safeMint(to, tokenId);
            _seed[tokenId] = seed;
            if (isLucky) {
                _withBuff[tokenId] = 1;
            }
            emit Summon(to, tokenId);
        }
    }

    function increaseFade(
        uint256[] calldata tokenId,
        uint256[] calldata amount,
        uint256[] calldata burn
    ) public {
        require(msg.sender == Buff._host);
        for (uint256 i = 0; i < tokenId.length; i++) {
            _fadeIncrease[tokenId[i]] += amount[i];
            burn;
        }
    }

    function _upgradeLevelConsume(
        uint8 targetLevel
    ) internal pure returns (uint256, uint256) {
        if (targetLevel == 1) {
            return (100, 0);
        } else if (targetLevel == 2) {
            return (120, 0);
        } else if (targetLevel == 3) {
            return (130, 0);
        } else if (targetLevel == 4) {
            return (140, 0);
        } else if (targetLevel == 5) {
            return (155, 0);
        } else if (targetLevel == 6) {
            return (165, 0);
        } else if (targetLevel == 7) {
            return (200, 1);
        } else if (targetLevel == 8) {
            return (245, 0);
        } else if (targetLevel == 9) {
            return (300, 0);
        } else if (targetLevel == 10) {
            return (370, 0);
        } else if (targetLevel == 11) {
            return (455, 0);
        } else if (targetLevel == 12) {
            return (1000, 2);
        }
        return (0, 0);
    }

    function upgrade(uint256 tokenId) public {
        require(tokenId <= _tokenId && _ownerOf(tokenId) == _host);

        uint8 targetLevel = _level[tokenId] + 1;
        (uint256 nekoCount, uint256 prism) = _upgradeLevelConsume(targetLevel);

        require(nekoCount > 0);

        Buff._neko.burnFrom(msg.sender, nekoCount * 1000000000000000000);
        if (prism > 0) {
            Buff._prism.burnFrom(msg.sender, prism * 1000000000000000000);
        }
        _level[tokenId] = targetLevel;
        emit Upgrade(msg.sender, tokenId, targetLevel + 1, nekoCount, prism);
    }

    function generate(
        uint256 tokenId,
        bool origin
    ) public view returns (Info memory) {
        require(tokenId <= _tokenId);

        uint256 seed = _seed[tokenId];
        bool isStarter = _starter[tokenId] == 1;

        uint8 level = 0;
        if (!origin) {
            level = _level[tokenId];
        }

        (uint8 rarity, uint8 element, string memory name) = _generateBasicInfo(
            seed,
            _withBuff[tokenId],
            isStarter
        );
        Info memory info = _getDetail(rarity, seed, level, isStarter);

        info.Fade = _generateFade(rarity, seed, tokenId, origin, isStarter);

        uint256 Mana = 0;
        if (info.Fade != 0) {
            // Mana=0.065*（0.4*SPI+0.3*ATK+0.2*DEF+0.1*SPD
            Mana =
                ((4 * info.SPI + 3 * info.ATK + 2 * info.DEF + 1 * info.SPD) *
                    65) /
                1000;
        }

        (string memory rarity_, string memory element_) = _getRairtyAndElement(
            rarity,
            element
        );

        info.rarity = rarity_;
        info.element = element_;
        info.name = name;
        info.Mana = Mana;
        info.level = level + 1;

        return info;
    }

    function _getDetail(
        uint8 rarity,
        uint256 seed,
        uint8 level,
        bool isStarter
    ) internal pure returns (Info memory) {
        return
            Info(
                "",
                "",
                "",
                _generateSPI(rarity, seed, level, isStarter),
                _generateATK(rarity, seed, level, isStarter),
                _generateDEF(rarity, seed, level, isStarter),
                _generateSPD(rarity, seed, level, isStarter),
                0,
                0,
                0
            );
    }

    function _getRairtyAndElement(
        uint8 rarity,
        uint8 element
    ) internal pure returns (string memory, string memory) {
        string memory rarity_ = "";
        if (rarity == 1) {
            rarity_ = "Common";
        } else if (rarity == 2) {
            rarity_ = "Uncommon";
        } else if (rarity == 3) {
            rarity_ = "Rare";
        } else if (rarity == 4) {
            rarity_ = "Epic";
        } else if (rarity == 5) {
            rarity_ = "Legendary";
        }

        string memory element_ = "";
        if (element == 1) {
            element_ = "Fire";
        } else if (element == 2) {
            element_ = "Water";
        } else if (element == 3) {
            element_ = "Wind";
        } else if (element == 4) {
            element_ = "Earth";
        } else if (element == 5) {
            element_ = "Thunder";
        }

        return (rarity_, element_);
    }

    function _generateFade(
        uint8 rarity,
        uint256 seed,
        uint256 tokenId,
        bool origin,
        bool isStarter
    ) internal view returns (uint256 Fade) {
        if (isStarter) {
            Fade = 12500;
        } else if (rarity == 0) {
            return 0;
        } else if (rarity == 1) {
            Fade = _random(seed, 1000_00, 1200_00);
        } else if (rarity == 2) {
            Fade = _random(seed, 1050_00, 1300_00);
        } else if (rarity == 3) {
            Fade = _random(seed, 1100_00, 1400_00);
        } else if (rarity == 4) {
            Fade = _random(seed, 1200_00, 1450_00);
        } else if (rarity == 5) {
            Fade = _random(seed, 1350_00, 1600_00);
        }
        if (origin) {
            return Fade;
        }
        Fade = Fade + _fadeIncrease[tokenId] - _fadeConsume[tokenId];
        uint256 stakeConsume = _stakeConsume(tokenId);
        if (Fade > stakeConsume) {
            return Fade - stakeConsume;
        } else {
            return 0;
        }
    }

    function _stakeConsume(uint256 tokenId) internal view returns (uint256) {
        if (_ownerOf(tokenId) == Buff._host) {
            uint256 end = _timeFreezeEnd(_stakeFrom[tokenId]);
            if (end != 0 && block.timestamp > end) {
                return (block.timestamp - end) / 36;
            } else if (end == 0) {
                return (block.timestamp - _stakeTime[tokenId]) / 36;
            }
        }
        return 0;
    }

    function _generateSPI(
        uint8 rarity,
        uint256 seed,
        uint8 level,
        bool isStarter
    ) internal pure returns (uint256 SPI) {
        if (isStarter) {
            SPI = 500;
        } else if (rarity == 0) {
            return 0;
        } else if (rarity == 1) {
            SPI = _random(seed, 5_00, 12_00);
        } else if (rarity == 2) {
            SPI = _random(seed, 12_00, 30_00);
        } else if (rarity == 3) {
            SPI = _random(seed, 30_00, 55_00);
        } else if (rarity == 4) {
            SPI = _random(seed, 80_00, 100_00);
        } else if (rarity == 5) {
            SPI = _random(seed, 180_00, 288_00);
        }
        if (level == 0) {
            return SPI;
        } else if (level == 1) {
            SPI += 200;
        } else if (level == 2) {
            SPI += 400;
        } else if (level == 3) {
            SPI += 600;
        } else if (level == 4) {
            SPI += 800;
        } else if (level == 5) {
            SPI += 1000;
        } else if (level == 6) {
            SPI += 1200;
        } else if (level == 7) {
            SPI += 1600;
        } else if (level == 8) {
            SPI += 2000;
        } else if (level == 9) {
            SPI += 2400;
        } else if (level == 10) {
            SPI += 3000;
        } else if (level == 11) {
            SPI += 3600;
        } else if (level == 12) {
            SPI += 4800;
        }
        return SPI;
    }

    function _generateATK(
        uint8 rarity,
        uint256 seed,
        uint8 level,
        bool isStarter
    ) internal pure returns (uint256 ATK) {
        if (isStarter) {
            ATK = 300;
        } else if (rarity == 0) {
            return 0;
        } else if (rarity == 1) {
            ATK = _random(seed, 3_00, 11_00);
        } else if (rarity == 2) {
            ATK = _random(seed, 10_00, 27_00);
        } else if (rarity == 3) {
            ATK = _random(seed, 25_00, 35_00);
        } else if (rarity == 4) {
            ATK = _random(seed, 45_00, 60_00);
        } else if (rarity == 5) {
            ATK = _random(seed, 100_00, 149_00);
        }
        if (level == 0) {
            return ATK;
        } else if (level == 1) {
            ATK += 100;
        } else if (level == 2) {
            ATK += 200;
        } else if (level == 3) {
            ATK += 300;
        } else if (level == 4) {
            ATK += 400;
        } else if (level == 5) {
            ATK += 500;
        } else if (level == 6) {
            ATK += 600;
        } else if (level == 7) {
            ATK += 900;
        } else if (level == 8) {
            ATK += 1200;
        } else if (level == 9) {
            ATK += 1500;
        } else if (level == 10) {
            ATK += 2000;
        } else if (level == 11) {
            ATK += 2700;
        } else if (level == 12) {
            ATK += 3600;
        }
        return ATK;
    }

    function _generateDEF(
        uint8 rarity,
        uint256 seed,
        uint8 level,
        bool isStarter
    ) internal pure returns (uint256 DEF) {
        if (isStarter) {
            DEF = 300;
        } else if (rarity == 0) {
            return 0;
        } else if (rarity == 1) {
            DEF = _random(seed, 3_00, 10_00);
        } else if (rarity == 2) {
            DEF = _random(seed, 10_00, 20_00);
        } else if (rarity == 3) {
            DEF = _random(seed, 20_00, 30_00);
        } else if (rarity == 4) {
            DEF = _random(seed, 30_00, 55_00);
        } else if (rarity == 5) {
            DEF = _random(seed, 100_00, 129_00);
        }
        if (level == 0) {
            return DEF;
        } else if (level == 1) {
            DEF += 100;
        } else if (level == 2) {
            DEF += 200;
        } else if (level == 3) {
            DEF += 300;
        } else if (level == 4) {
            DEF += 400;
        } else if (level == 5) {
            DEF += 500;
        } else if (level == 6) {
            DEF += 600;
        } else if (level == 7) {
            DEF += 800;
        } else if (level == 8) {
            DEF += 1000;
        } else if (level == 9) {
            DEF += 1300;
        } else if (level == 10) {
            DEF += 1600;
        } else if (level == 11) {
            DEF += 1900;
        } else if (level == 12) {
            DEF += 2400;
        }
        return DEF;
    }

    function _generateSPD(
        uint8 rarity,
        uint256 seed,
        uint8 level,
        bool isStarter
    ) internal pure returns (uint256 SPD) {
        if (isStarter) {
            SPD = 100;
        } else if (rarity == 0) {
            return 0;
        } else if (rarity == 1) {
            SPD = _random(seed, 1_00, 9_00);
        } else if (rarity == 2) {
            SPD = _random(seed, 10_00, 18_00);
        } else if (rarity == 3) {
            SPD = _random(seed, 12_00, 20_00);
        } else if (rarity == 4) {
            SPD = _random(seed, 12_00, 22_00);
        } else if (rarity == 5) {
            SPD = _random(seed, 15_00, 24_00);
        }
        if (level == 0) {
            return SPD;
        } else if (level == 4) {
            SPD += 100;
        } else if (level == 5) {
            SPD += 200;
        } else if (level == 6) {
            SPD += 300;
        } else if (level == 7) {
            SPD += 400;
        } else if (level == 8) {
            SPD += 500;
        } else if (level == 9) {
            SPD += 600;
        } else if (level == 10) {
            SPD += 700;
        } else if (level == 11) {
            SPD += 900;
        } else if (level == 12) {
            SPD += 1200;
        }
        return SPD;
    }

    function _generateRarity(
        uint256 seed,
        uint256 withBuff,
        bool isStarter
    ) internal pure returns (uint8 rarity) {
        if (isStarter) {
            return 1;
        }

        uint256 rarityNumber = _random(seed, 0, 10000);
        uint256 empty = 450;
        uint256 common = 5850;
        uint256 uncommon = 8400;
        uint256 rare = 9500;
        uint256 epic = 9950;
        // uint256 legendary = 10000;

        if (withBuff == 1) {
            empty = 5;
        }

        if (rarityNumber < empty) {
            rarity = 0;
        } else if (rarityNumber < common) {
            rarity = 1;
        } else if (rarityNumber < uncommon) {
            rarity = 2;
        } else if (rarityNumber < rare) {
            rarity = 3;
        } else if (rarityNumber < epic) {
            rarity = 4;
        } else {
            rarity = 5;
        }

        return rarity;
    }

    function _generateBasicInfo(
        uint256 seed,
        uint256 withBuff,
        bool isStarter
    ) internal pure returns (uint8 rarity, uint8 element, string memory name) {
        if (isStarter) {
            return (1, 1, "Mikan");
        }

        uint256 rarityNumber = _random(seed, 0, 10000);
        uint256 elementNumber = _random(seed, 0, 5);

        uint256 empty = 450;
        uint256 common = 5850;
        uint256 uncommon = 8400;
        uint256 rare = 9500;
        uint256 epic = 9950;
        // uint256 legendary = 10000;

        if (withBuff == 1) {
            empty = 5;
        }

        if (rarityNumber < empty) {
            rarity = 0;
            element = 0;
            name = "";
        } else if (rarityNumber < common) {
            rarity = 1;
            if (elementNumber == 0) {
                element = 1;
                name = "Mikan";
            } else if (elementNumber == 1) {
                element = 2;
                name = "Sumi";
            } else if (elementNumber == 2) {
                element = 3;
                name = "Yuki";
            } else if (elementNumber == 3) {
                element = 4;
                name = "Sakura";
            } else {
                element = 5;
                name = "Tsuki";
            }
        } else if (rarityNumber < uncommon) {
            rarity = 2;
            if (elementNumber == 0) {
                element = 1;
                name = "Kinu";
            } else if (elementNumber == 1) {
                element = 2;
                name = "Ginka";
            } else if (elementNumber == 2) {
                element = 3;
                name = "Akane";
            } else if (elementNumber == 3) {
                element = 4;
                name = "Midori";
            } else {
                element = 5;
                name = "Aoi";
            }
        } else if (rarityNumber < rare) {
            rarity = 3;
            if (elementNumber == 0) {
                element = 1;
                name = "Sora";
            } else if (elementNumber == 1) {
                element = 2;
                name = "Shinpu";
            } else if (elementNumber == 2) {
                element = 3;
                name = "Umi";
            } else if (elementNumber == 3) {
                element = 4;
                name = "Hoshiko";
            } else {
                element = 5;
                name = "Yama";
            }
        } else if (rarityNumber < epic) {
            rarity = 4;
            if (elementNumber == 0) {
                element = 1;
                name = "Kaen";
            } else if (elementNumber == 1) {
                element = 2;
                name = "Mikazuki";
            } else if (elementNumber == 2) {
                element = 3;
                name = "Taiyo";
            } else if (elementNumber == 3) {
                element = 4;
                name = "Yukime";
            } else {
                element = 5;
                name = "Kawara";
            }
        } else {
            rarity = 5;
            if (elementNumber == 0) {
                element = 1;
                name = "Ryujin";
            } else if (elementNumber == 1) {
                element = 2;
                name = "Onibi";
            } else if (elementNumber == 2) {
                element = 3;
                name = "Tengoku";
            } else if (elementNumber == 3) {
                element = 4;
                name = "Fujin";
            } else {
                element = 5;
                name = "Raiden";
            }
        }

        return (rarity, element, name);
    }

    function _random(
        uint256 input,
        uint256 min,
        uint256 max
    ) internal pure returns (uint256) {
        uint256 output = (uint256(keccak256(abi.encodePacked(input))) %
            (max - min)) + min;
        return output;
    }
}
