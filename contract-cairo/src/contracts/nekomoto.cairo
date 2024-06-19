#[starknet::contract]
pub(crate) mod Nekomoto {
    use nekomoto::interface::interface::{
        ERC20BurnTraitDispatcher, ERC20BurnTraitDispatcherTrait, ERC721BurnTraitDispatcher,
        ERC721BurnTraitDispatcherTrait
    };
    use core::traits::TryInto;
    use core::array::ArrayTrait;
    use core::integer;
    use core::traits::Into;
    use core::num::traits::Zero;
    use openzeppelin::token::erc721::erc721::ERC721Component::InternalTrait;
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc721::ERC721Component;
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp, ClassHash};

    use components::upgradeable::upgradeable::UpgradeableComponent;
    use components::upgradeable::upgradeable::UpgradeableComponent::InternalTrait as upgradeableInternal;

    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    #[abi(embed_v0)]
    impl ERC721MixinImpl = ERC721Component::ERC721MixinImpl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        host: ContractAddress,
        token_id: u256,
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
        // BUFF
        neko: ContractAddress,
        prism: ContractAddress,
        temporal_shard: ContractAddress,
        lucky: LegacyMap<ContractAddress, u8>,
        time_freeze: LegacyMap<ContractAddress, u256>,
        ascend: LegacyMap<ContractAddress, u256>,
        // BOX
        seed: LegacyMap<u256, u256>,
        with_buff: LegacyMap<u256, u8>,
        starter: LegacyMap<u256, u8>,
        open_pack: LegacyMap<ContractAddress, u8>,
        starter_pack_limit: u256,
        fade_increase: LegacyMap<u256, u256>,
        fade_consume: LegacyMap<u256, u256>,
        stake_time: LegacyMap<u256, u256>,
        stake_from: LegacyMap<u256, ContractAddress>,
        level: LegacyMap<u256, u8>,
    }

    #[derive(Copy, Drop, Serde)]
    struct Info {
        rarity: u8,
        element: u8,
        name: felt252,
        SPI: u256,
        ATK: u256,
        DEF: u256,
        SPD: u256,
        fade: u256,
        mana: u256,
        level: u256
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
        UpgradeAscend: UpgradeAscend,
        TimeFreeze: TimeFreeze,
        Upgrade: Upgrade,
        Summon: Summon,
        Reset: Reset,
    }

    #[derive(Drop, starknet::Event)]
    struct UpgradeAscend {
        #[key]
        sender: ContractAddress,
        new_level: u256,
        neko_count: u256,
        prism: u256
    }

    #[derive(Drop, starknet::Event)]
    struct TimeFreeze {
        #[key]
        sender: ContractAddress,
        token_id: u256,
        time: u256
    }

    #[derive(Drop, starknet::Event)]
    struct Upgrade {
        #[key]
        sender: ContractAddress,
        #[key]
        token_id: u256,
        new_level: u256,
        neko_count: u256,
        prism: u256
    }

    #[derive(Drop, starknet::Event)]
    struct Summon {
        #[key]
        to: ContractAddress,
        #[key]
        token_id: u256
    }

    #[derive(Drop, starknet::Event)]
    struct Reset {
        #[key]
        token_id: u256
    }

    #[constructor]
    pub(crate) fn constructor(
        ref self: ContractState,
        neko: ContractAddress,
        prism: ContractAddress,
        temporal_shard: ContractAddress
    ) {
        let name = "Nekomoto";
        let symbol = "Nekomoto";
        let base_uri = "TBD";

        self.token_id.write(1);
        self.erc721.initializer(name, symbol, base_uri);

        self.host.write(get_caller_address());

        self.neko.write(neko);
        self.prism.write(prism);
        self.temporal_shard.write(temporal_shard);
    }

    #[abi(embed_v0)]
    pub(crate) fn replace_classhash(ref self: ContractState, new_class_hash: ClassHash) {
        assert(get_caller_address() == self.host.read(), 'Only the host');
        self.upgradeable._upgrade(new_class_hash);
    }

    #[abi(embed_v0)]
    pub(crate) fn summon(ref self: ContractState, recipient: ContractAddress, count: u256) {
        let token_id = self.token_id.read() + 1;
        let sender = get_caller_address();
        assert(sender == self.host.read(), 'Only the host can mint');

        let block_time = starknet::get_block_timestamp();
        let mut i = 0;
        loop {
            if i == count {
                break;
            }

            let input = array![block_time.into() + i, token_id];
            let seed = keccak::keccak_u256s_be_inputs(input.span());

            let is_lucky = lucky(@self, sender);
            let rarity_number = random(seed, 0, 10000);
            if rarity_number < 5 || (is_lucky && rarity_number < 450) {
                // empty box
                continue;
            }

            self.erc721.mint(recipient, token_id);
            self.token_id.write(token_id);
            self.seed.write(token_id, seed);
            if is_lucky {
                self.with_buff.write(token_id, 1);
            }
            self.emit(Summon { to: recipient, token_id });

            i = i + 1;
        }
    }

    #[abi(embed_v0)]
    pub(crate) fn stake(ref self: ContractState, token_id: Array<u256>) {
        let len = token_id.len();
        let from = get_caller_address();
        let token_count = self.token_id.read();
        let host = self.host.read();

        let mut i = 0;
        loop {
            if i == len {
                break;
            }

            let id = *token_id[i];
            assert(id <= token_count, 'Not mint yet');
            let seed = self.seed.read(id);
            let with_buff = self.with_buff.read(id);
            let is_starter = self.starter.read(id) == 1;
            let (rarity, _, _) = generate_basic_info(seed, with_buff, is_starter);
            if rarity == 4 || rarity == 5 {
                add_lucky(ref self, from);
            }
            self.stake_time.write(id, starknet::get_block_timestamp().into());
            self.stake_from.write(id, from);

            let previous = self.erc721.update(host, id, Zero::zero());
            assert(previous == from, 'Not owner');

            i = i + 1;
        }
    }

    #[abi(embed_v0)]
    pub(crate) fn withdraw(ref self: ContractState, token_id: Array<u256>) {
        let len = token_id.len();
        let token_count = self.token_id.read();
        let host = self.host.read();

        let mut i = 0;
        loop {
            if i == len {
                break;
            }

            let id = *token_id[i];
            assert(id <= token_count, 'Not mint yet');
            let seed = self.seed.read(id);
            let with_buff = self.with_buff.read(id);
            let is_starter = self.starter.read(id) == 1;
            let (rarity, _, _) = generate_basic_info(seed, with_buff, is_starter);
            let to = self.stake_from.read(id);
            if rarity == 4 || rarity == 5 {
                substract_lucky(ref self, to);
            }

            // no limit for now
            // let fade = generate_fade(@self, rarity, seed, id, is_starter);
            // assert(fade == 0, 'Still has fade');
            self.fade_consume.write(id, self.fade_consume.read(id) + stake_consume(@self, id));

            let previous = self.erc721.update(to, id, Zero::zero());
            assert(previous == host, 'Is not staked');

            i = i + 1;
        }
    }

    #[abi(embed_v0)]
    pub(crate) fn add_limit(ref self: ContractState, input: u256) {
        assert(self.host.read() == get_caller_address(), 'Only the host');
        self.starter_pack_limit.write(self.starter_pack_limit.read() + input);
    }

    #[abi(embed_v0)]
    pub(crate) fn stater_pack(ref self: ContractState) {
        let sender = get_caller_address();
        assert(self.open_pack.read(sender) == 0, 'Already opened');
        assert(self.starter_pack_limit.read() > 0, 'No more starter pack');
        self.open_pack.write(sender, 1);
        self.starter_pack_limit.write(self.starter_pack_limit.read() - 1);
        let token_id = self.token_id.read() + 1;
        self.token_id.write(token_id);
        self.emit(Summon { to: sender, token_id: token_id });
    }

    // BUFF

    #[abi(embed_v0)]
    pub(crate) fn burn(ref self: ContractState, token_id: u256) {
        self.erc721.burn(token_id);
    }

    #[abi(embed_v0)]
    pub(crate) fn lucky(self: @ContractState, input: ContractAddress) -> bool {
        self.lucky.read(input) >= 1
    }

    pub(crate) fn add_lucky(ref self: ContractState, input: ContractAddress) {
        let lucky = self.lucky.read(input);
        self.lucky.write(input, lucky + 1);
    }

    pub(crate) fn substract_lucky(ref self: ContractState, input: ContractAddress) {
        let lucky = self.lucky.read(input);
        self.lucky.write(input, lucky - 1);
    }

    #[abi(embed_v0)]
    pub(crate) fn time_freeze(self: @ContractState, input: ContractAddress) -> bool {
        let time_freeze_start = self.time_freeze.read(input);
        if time_freeze_start == 0 {
            return false;
        }
        let block_time = get_block_timestamp();
        if time_freeze_start <= block_time.into() && block_time.into()
            - time_freeze_start < 259200 {
            return true;
        }
        false
    }

    #[abi(embed_v0)]
    pub(crate) fn start_time_freeze(ref self: ContractState, token_id: u256) {
        let block_time = get_block_timestamp();
        let sender = get_caller_address();
        assert(time_freeze_end(@self, sender) < block_time.into(), 'Already frozen');
        ERC721BurnTraitDispatcher { contract_address: self.temporal_shard.read() }.burn(token_id);
        self.time_freeze.write(sender, block_time.into());
        self.emit(TimeFreeze { sender: sender, token_id, time: block_time.into() });
    }

    pub(crate) fn time_freeze_end(self: @ContractState, input: ContractAddress) -> u256 {
        let time_freeze = self.time_freeze.read(input);
        if time_freeze == 0 {
            return 0;
        }
        time_freeze + 259200
    }

    #[abi(embed_v0)]
    pub(crate) fn ascend(self: @ContractState, input: ContractAddress) -> (u256, u256) {
        let level = self.ascend.read(input);
        let mut bonus = 0;
        if level == 1 {
            bonus = 2;
        } else if level == 2 {
            bonus = 5;
        } else if level == 3 {
            bonus = 10;
        } else if level == 4 {
            bonus = 15;
        } else if level == 5 {
            bonus = 20;
        } else if level == 6 {
            bonus = 28;
        } else if level == 7 {
            bonus = 35;
        } else if level == 8 {
            bonus = 43;
        } else if level == 9 {
            bonus = 51;
        }
        (level, bonus)
    }

    #[abi(embed_v0)]
    pub(crate) fn upgrade_acend(ref self: ContractState) {
        let ascend = self.ascend.read(get_caller_address());
        let (neko_count, prism) = upgrade_ascend_consume(ascend + 1);

        assert(neko_count != 0, 'Exceed max level');

        ERC20BurnTraitDispatcher { contract_address: self.neko.read() }.burn(neko_count);
        if prism > 0 {
            ERC20BurnTraitDispatcher { contract_address: self.prism.read() }.burn(prism);
        }

        self.ascend.write(get_caller_address(), ascend + 1);
        self
            .emit(
                UpgradeAscend {
                    sender: get_caller_address(),
                    new_level: ascend + 1,
                    neko_count: neko_count,
                    prism: prism
                }
            );
    }

    pub(crate) fn upgrade_ascend_consume(target_level: u256) -> (u256, u256) {
        if (target_level == 1) {
            return (100000000000000000000, 9000000000000000000);
        } else if (target_level == 2) {
            return (437000000000000000000, 16000000000000000000);
        } else if (target_level == 3) {
            return (1910000000000000000000, 27000000000000000000);
        } else if (target_level == 4) {
            return (8345000000000000000000, 47000000000000000000);
        } else if (target_level == 5) {
            return (36469000000000000000000, 82000000000000000000);
        } else if (target_level == 6) {
            return (159370000000000000000000, 142000000000000000000);
        } else if (target_level == 7) {
            return (696448000000000000000000, 247000000000000000000);
        } else if (target_level == 8) {
            return (3043477000000000000000000, 429000000000000000000);
        } else if (target_level == 9) {
            return (13299996000000000000000000, 746000000000000000000);
        }
        (0, 0)
    }

    // BOX

    #[abi(embed_v0)]
    pub(crate) fn increase_fade(
        ref self: ContractState, token_id: Span<u256>, amount: Span<u256>, burn: Span<u256>
    ) {
        let sender = get_caller_address();
        assert(self.host.read() == sender, 'Only the host');

        let mut j = 0;
        loop {
            if j == token_id.len() {
                break;
            }

            let origin = self.fade_increase.read(*token_id[j]);
            self.fade_increase.write(*token_id[j], origin + *amount[j]);

            j = j + 1;
        }
    }

    pub(crate) fn upgrade_level_consume(target_level: u8) -> (u256, u256) {
        if (target_level == 1) {
            return (100000000000000000000, 0);
        } else if (target_level == 2) {
            return (120000000000000000000, 0);
        } else if (target_level == 3) {
            return (130000000000000000000, 0);
        } else if (target_level == 4) {
            return (140000000000000000000, 0);
        } else if (target_level == 5) {
            return (155000000000000000000, 0);
        } else if (target_level == 6) {
            return (165000000000000000000, 0);
        } else if (target_level == 7) {
            return (200000000000000000000, 1000000000000000000);
        } else if (target_level == 8) {
            return (245000000000000000000, 0);
        } else if (target_level == 9) {
            return (300000000000000000000, 0);
        } else if (target_level == 10) {
            return (370000000000000000000, 0);
        } else if (target_level == 11) {
            return (455000000000000000000, 0);
        } else if (target_level == 12) {
            return (1000000000000000000000, 2000000000000000000);
        }
        (0, 0)
    }

    #[abi(embed_v0)]
    pub(crate) fn upgrade(ref self: ContractState, token_id: u256) {
        assert(self.token_id.read() > token_id, 'Invalid token_id');

        let target_level = self.level.read(token_id) + 1;
        let (neko_count, prism) = upgrade_level_consume(target_level);

        assert(neko_count != 0, 'Exceed max level');
        ERC20BurnTraitDispatcher { contract_address: self.neko.read() }.burn(neko_count);
        if prism > 0 {
            ERC20BurnTraitDispatcher { contract_address: self.prism.read() }.burn(prism);
        }

        self.level.write(token_id, target_level);
        self
            .emit(
                Upgrade {
                    sender: get_caller_address(),
                    token_id: token_id,
                    new_level: target_level.into(),
                    neko_count: neko_count,
                    prism: prism
                }
            )
    }

    #[abi(embed_v0)]
    pub(crate) fn generate(self: @ContractState, token_id: u256, origin: bool) -> Info {
        assert(self.token_id.read() > token_id, 'Invalid token_id');

        let seed = self.seed.read(token_id);
        let with_buff = self.with_buff.read(token_id);
        let is_starter = self.starter.read(token_id) == 1;
        let mut level = self.level.read(token_id);
        if origin {
            level = 0;
        }

        let (rarity, element, name) = generate_basic_info(seed, with_buff, is_starter);
        let SPI = generate_SPI(rarity, seed, level, is_starter);
        let ATK = generate_ATK(rarity, seed, level, is_starter);
        let DEF = generate_DEF(rarity, seed, level, is_starter);
        let SPD = generate_SPD(rarity, seed, level, is_starter);

        let fade = generate_fade(self, rarity, seed, token_id, is_starter);

        let mut mana = 0;
        if fade != 0 {
            mana = ((4 * SPI + 3 * ATK + 2 * DEF + 1 * SPD) * 65) / 1000;
        }

        Info {
            rarity: rarity,
            element: element,
            name: name,
            SPI: SPI,
            ATK: ATK,
            DEF: DEF,
            SPD: SPD,
            fade: fade,
            mana: mana,
            level: level.into()
        }
    }


    pub(crate) fn random(input: u256, min: u256, max: u256) -> u256 {
        if max == min {
            return min;
        }

        let output: u256 = keccak::keccak_u256s_be_inputs(array![input].span());

        let result = (u256 {
            low: integer::u128_byte_reverse(output.high), // just comment here to
            high: integer::u128_byte_reverse(output.low) // avoid stupid format
        }) % ((max - min).into());

        min + result
    }

    pub(crate) fn stake_consume(self: @ContractState, token_id: u256) -> u256 {
        if self.erc721._owner_of(token_id) == self.host.read() {
            let end = time_freeze_end(self, self.stake_from.read(token_id));
            let block_time = get_block_timestamp().into();
            if end != 0 && block_time > end {
                return (block_time - end) / 36;
            } else if end == 0 {
                return (block_time - self.stake_time.read(token_id)) / 36;
            }
        }
        0
    }

    pub(crate) fn generate_fade(
        self: @ContractState, rarity: u8, seed: u256, token_id: u256, is_starter: bool
    ) -> u256 {
        let mut fade = 0;
        if is_starter {
            fade = 12500;
        } else if (rarity == 0) {
            return 0;
        } else if (rarity == 1) {
            fade = random(seed, 1000_00, 1200_00);
        } else if (rarity == 2) {
            fade = random(seed, 1050_00, 1300_00);
        } else if (rarity == 3) {
            fade = random(seed, 1100_00, 1400_00);
        } else if (rarity == 4) {
            fade = random(seed, 1200_00, 1450_00);
        } else if (rarity == 5) {
            fade = random(seed, 1350_00, 1600_00);
        }
        fade = fade + self.fade_increase.read(token_id) - self.fade_consume.read(token_id);
        let stake_consume = stake_consume(self, token_id);
        if fade > stake_consume {
            return fade - stake_consume;
        } else {
            return 0;
        }
    }

    pub(crate) fn generate_SPI(rarity: u8, seed: u256, level: u8, is_starter: bool) -> u256 {
        let mut SPI = 0;
        if is_starter {
            SPI = 500;
        } else if (rarity == 0) {
            return 0;
        } else if (rarity == 1) {
            SPI = random(seed, 5_00, 12_00);
        } else if (rarity == 2) {
            SPI = random(seed, 12_00, 30_00);
        } else if (rarity == 3) {
            SPI = random(seed, 30_00, 55_00);
        } else if (rarity == 4) {
            SPI = random(seed, 80_00, 100_00);
        } else if (rarity == 5) {
            SPI = random(seed, 180_00, 288_00);
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

    pub(crate) fn generate_ATK(rarity: u8, seed: u256, level: u8, is_starter: bool) -> u256 {
        let mut ATK = 0;
        if is_starter {
            ATK = 300;
        } else if (rarity == 0) {
            return 0;
        } else if (rarity == 1) {
            ATK = random(seed, 3_00, 11_00);
        } else if (rarity == 2) {
            ATK = random(seed, 10_00, 27_00);
        } else if (rarity == 3) {
            ATK = random(seed, 25_00, 35_00);
        } else if (rarity == 4) {
            ATK = random(seed, 45_00, 60_00);
        } else if (rarity == 5) {
            ATK = random(seed, 100_00, 149_00);
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

    pub(crate) fn generate_DEF(rarity: u8, seed: u256, level: u8, is_starter: bool) -> u256 {
        let mut DEF = 0;
        if is_starter {
            DEF = 300;
        } else if (rarity == 0) {
            return 0;
        } else if (rarity == 1) {
            DEF = random(seed, 3_00, 10_00);
        } else if (rarity == 2) {
            DEF = random(seed, 10_00, 20_00);
        } else if (rarity == 3) {
            DEF = random(seed, 20_00, 30_00);
        } else if (rarity == 4) {
            DEF = random(seed, 30_00, 55_00);
        } else if (rarity == 5) {
            DEF = random(seed, 100_00, 129_00);
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

    pub(crate) fn generate_SPD(rarity: u8, seed: u256, level: u8, is_starter: bool) -> u256 {
        let mut SPD = 0;
        if is_starter {
            SPD = 100;
        } else if (rarity == 0) {
            return 0;
        } else if (rarity == 1) {
            SPD = random(seed, 1_00, 9_00);
        } else if (rarity == 2) {
            SPD = random(seed, 10_00, 18_00);
        } else if (rarity == 3) {
            SPD = random(seed, 12_00, 20_00);
        } else if (rarity == 4) {
            SPD = random(seed, 12_00, 22_00);
        } else if (rarity == 5) {
            SPD = random(seed, 15_00, 24_00);
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

    pub(crate) fn generate_rarity(seed: u256, with_buff: u8, is_starter: bool) -> u256 {
        if is_starter {
            return 0;
        }

        let mut rarity = 0;

        let rarity_number = random(seed, 0, 10000);
        let mut empty = 450;
        let common = 5850;
        let uncommon = 8400;
        let rare = 9500;
        let epic = 9950;
        // let legendary = 10000;

        if with_buff == 1 {
            empty = 5;
        }

        if (rarity_number < empty) {
            rarity = 0;
        } else if (rarity_number < common) {
            rarity = 1;
        } else if (rarity_number < uncommon) {
            rarity = 2;
        } else if (rarity_number < rare) {
            rarity = 3;
        } else if (rarity_number < epic) {
            rarity = 4;
        } else {
            rarity = 5;
        }

        return rarity;
    }

    pub(crate) fn generate_basic_info(
        seed: u256, with_buff: u8, is_starter: bool
    ) -> (u8, u8, felt252) {
        if is_starter {
            return (1, 1, 'Mikan');
        }

        let mut rarity = 0;
        let mut element = 0;
        let mut name = '';

        let rarity_number = random(seed, 0, 10000);
        let element_number = random(seed, 0, 5);

        let mut empty = 450;
        let common = 5850;
        let uncommon = 8400;
        let rare = 9500;
        let epic = 9950;
        // let legendary = 10000;

        if with_buff == 1 {
            empty = 5;
        }

        if (rarity_number < empty) {
            rarity = 0;
            element = 0;
            name = '';
        } else if (rarity_number < common) {
            rarity = 1;
            if (element_number == 0) {
                element = 1;
                name = 'Mikan';
            } else if (element_number == 1) {
                element = 2;
                name = 'Sumi';
            } else if (element_number == 2) {
                element = 3;
                name = 'Yuki';
            } else if (element_number == 3) {
                element = 4;
                name = 'Sakura';
            } else {
                element = 5;
                name = 'Tsuki';
            }
        } else if (rarity_number < uncommon) {
            rarity = 2;
            if (element_number == 0) {
                element = 1;
                name = 'Kinu';
            } else if (element_number == 1) {
                element = 2;
                name = 'Ginka';
            } else if (element_number == 2) {
                element = 3;
                name = 'Akane';
            } else if (element_number == 3) {
                element = 4;
                name = 'Midori';
            } else {
                element = 5;
                name = 'Aoi';
            }
        } else if (rarity_number < rare) {
            rarity = 3;
            if (element_number == 0) {
                element = 1;
                name = 'Sora';
            } else if (element_number == 1) {
                element = 2;
                name = 'Shinpu';
            } else if (element_number == 2) {
                element = 3;
                name = 'Umi';
            } else if (element_number == 3) {
                element = 4;
                name = 'Hoshiko';
            } else {
                element = 5;
                name = 'Yama';
            }
        } else if (rarity_number < epic) {
            rarity = 4;
            if (element_number == 0) {
                element = 1;
                name = 'Kaen';
            } else if (element_number == 1) {
                element = 2;
                name = 'Mikazuki';
            } else if (element_number == 2) {
                element = 3;
                name = 'Taiyo';
            } else if (element_number == 3) {
                element = 4;
                name = 'Yukime';
            } else {
                element = 5;
                name = 'Kawara';
            }
        } else {
            rarity = 5;
            if (element_number == 0) {
                element = 1;
                name = 'Ryujin';
            } else if (element_number == 1) {
                element = 2;
                name = 'Onibi';
            } else if (element_number == 2) {
                element = 3;
                name = 'Tengoku';
            } else if (element_number == 3) {
                element = 4;
                name = 'Fujin';
            } else {
                element = 5;
                name = 'Raiden';
            }
        }

        (rarity, element, name)
    }

    impl ERC721HooksImpl<TContractState> of ERC721Component::ERC721HooksTrait<TContractState> {
        fn before_update(
            ref self: ERC721Component::ComponentState<TContractState>,
            to: ContractAddress,
            token_id: u256,
            auth: ContractAddress
        ) {
            let mut state = nekomoto::contracts::nekomoto::Nekomoto::unsafe_new_contract_state();
            assert(token_id <= state.token_id.read(), 'Not mint yet');
            state.level.write(token_id, 0);
            // state.fade_consume.write(token_id,0);
            // state.fade_increase.write(token_id,0);
            state.stake_time.write(token_id, 0);
        }

        fn after_update(
            ref self: ERC721Component::ComponentState<TContractState>,
            to: ContractAddress,
            token_id: u256,
            auth: ContractAddress
        ) {
            let mut state = nekomoto::contracts::nekomoto::Nekomoto::unsafe_new_contract_state();
            state.emit(Reset { token_id });
        }
    }
}
