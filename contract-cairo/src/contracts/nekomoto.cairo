#[starknet::contract]
pub mod Nekomoto {
    use nekomoto::interface::interface::{
        ERC20BurnTraitDispatcher, ERC20BurnTraitDispatcherTrait, NekomotoTrait, Info
    };
    // use core::traits::TryInto;
    use core::array::ArrayTrait;
    use core::integer;
    use core::traits::Into;
    use core::num::traits::Zero;
    use openzeppelin::{token::{erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait},},};
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc721::ERC721Component;
    use openzeppelin::upgrades::upgradeable::UpgradeableComponent;
    use openzeppelin::upgrades::upgradeable::UpgradeableComponent::InternalTrait as upgradeableInternal;
    use starknet::{
        ContractAddress, get_caller_address, get_contract_address, ClassHash, storage::Map
    };

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
        // lucky: Map<ContractAddress, u8>,
        // BOX
        seed: Map<u256, u256>,
        with_buff: Map<u256, u8>,
        starter: Map<u256, u8>,
        open_pack: Map<ContractAddress, u8>,
        starter_pack_limit: u256,
        fade_increase: Map<u256, u256>,
        fade_consume: Map<u256, u256>,
        stake_time: Map<u256, u256>,
        stake_from: Map<u256, ContractAddress>,
        level: Map<u256, u8>,
        atk: Map<u256, u256>,
        // For summon
        coin: Map<ContractAddress, u256>,
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
        Upgrade: Upgrade,
        Summon: Summon,
    }

    #[derive(Drop, starknet::Event)]
    struct Upgrade {
        #[key]
        sender: ContractAddress,
        #[key]
        token_id: u256,
        new_level: u256,
        neko_coin_count: u256,
        prism_count: u256
    }

    #[derive(Drop, starknet::Event)]
    struct Summon {
        #[key]
        to: ContractAddress,
        #[key]
        token_id: u256
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        neko: ContractAddress,
        prism: ContractAddress,
        host: ContractAddress
    ) {
        let name = "Nekomoto";
        let symbol = "Nekomoto";
        let base_uri = "TBD";

        self.erc721.initializer(name, symbol, base_uri);

        self.host.write(host);

        self.neko.write(neko);
        self.prism.write(prism);

        self.starter_pack_limit.write(20000);
    }

    #[external(v0)]
    fn faucet(ref self: ContractState) {
        let nekocoin = self.neko.read();
        // 25000000000000000000000*10
        assert(
            IERC20Dispatcher { contract_address: nekocoin }
                .balance_of(get_contract_address()) >= 250000000000000000000000,
            'excced limit of faucet'
        );
        IERC20Dispatcher { contract_address: nekocoin }
            .transfer(get_caller_address(), 250000000000000000000000);
    }

    #[abi(embed_v0)]
    impl NekomotoTraitImpl of NekomotoTrait<ContractState> {
        fn replace_classhash(ref self: ContractState, new_class_hash: ClassHash) {
            assert(get_caller_address() == self.host.read(), 'Only the host');
            self.upgradeable.upgrade(new_class_hash);
        }

        fn check_coin(self: @ContractState, address: ContractAddress) -> u256 {
            self.coin.read(address)
        }

        fn buy_coin(ref self: ContractState, count: u256) {
            let amount = count * 25000000000000000000000;
            let nekocoin = self.neko.read();
            let recipient = get_caller_address();
            IERC20Dispatcher { contract_address: nekocoin }
                .transfer_from(recipient, self.host.read(), amount * 75 / 100);
            ERC20BurnTraitDispatcher { contract_address: nekocoin }
                .burnFrom(recipient, amount * 25 / 100);
            self.coin.write(recipient, count);
        }

        fn summon(
            ref self: ContractState, recipient: ContractAddress, count: u256, mut random: u256
        ) {
            let mut token_id = self.token_id.read();
            assert(get_caller_address() == self.host.read(), 'Only the host can summon');

            let hold_coin = self.coin.read(recipient);
            assert(hold_coin >= count, 'Not enough coin');

            let block_time = starknet::get_block_timestamp();
            let mut i = 0;
            let mut to_mint_prism = 0_u32;
            loop {
                if i == count {
                    break;
                }
                i = i + 1;

                token_id = token_id + 1;
                let input = array![block_time.into() + i, token_id, random];
                random = random + 1;
                let seed = keccak::keccak_u256s_be_inputs(input.span());

                let (rarity, _) = generate_basic_info(seed, false);
                match rarity {
                    0 => {
                        // empty
                        to_mint_prism = to_mint_prism + 5;
                        continue;
                    },
                    1 => self.atk.write(token_id, generate_random(seed, 5_00, 15_00)),
                    2 => {
                        to_mint_prism = to_mint_prism + 1;
                        self.atk.write(token_id, generate_random(seed, 11_00, 21_00));
                    },
                    3 => {
                        to_mint_prism = to_mint_prism + 1;
                        self.atk.write(token_id, generate_random(seed, 17_00, 27_00));
                    },
                    4 => {
                        to_mint_prism = to_mint_prism + 2;
                        self.atk.write(token_id, generate_random(seed, 26_00, 36_00));
                    },
                    5 => {
                        to_mint_prism = to_mint_prism + 3;
                        self.atk.write(token_id, generate_random(seed, 40_00, 50_00));
                    },
                    _ => (),
                }

                self.erc721.mint(recipient, token_id);
                self.token_id.write(token_id);
                self.seed.write(token_id, seed);

                self.emit(Summon { to: recipient, token_id });
            };

            if to_mint_prism > 0 {
                ERC20BurnTraitDispatcher { contract_address: self.prism.read() }
                    .mint(recipient, to_mint_prism.into() * 1000000000000000000);
            }
        }

        fn stake(ref self: ContractState, token_id: Array<u256>) {
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

                self.stake_time.write(id, starknet::get_block_timestamp().into());
                self.stake_from.write(id, from);

                let previous = self.erc721.update(host, id, Zero::zero());
                assert(previous == from, 'Not owner');

                i = i + 1;
            }
        }

        fn withdraw(ref self: ContractState, token_id: Array<u256>) {
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
                let to = self.stake_from.read(id);

                let previous = self.erc721.update(to, id, Zero::zero());
                assert(previous == host, 'Is not staked');

                i = i + 1;
            }
        }

        fn add_limit(ref self: ContractState, input: u256) {
            assert(self.host.read() == get_caller_address(), 'Only the host');
            self.starter_pack_limit.write(self.starter_pack_limit.read() + input);
        }

        fn starter_pack(ref self: ContractState) {
            let sender = get_caller_address();
            assert(self.open_pack.read(sender) == 0, 'Already opened');
            assert(self.starter_pack_limit.read() > 0, 'No more starter pack');
            self.open_pack.write(sender, 1);
            self.starter_pack_limit.write(self.starter_pack_limit.read() - 1);
            let token_id = self.token_id.read() + 1;
            self.erc721.mint(sender, token_id);
            self.starter.write(token_id, 1);
            self.token_id.write(token_id);
            self.emit(Summon { to: sender, token_id: token_id });
        }

        fn check_starter_pack(self: @ContractState, address: ContractAddress) -> bool {
            if self.open_pack.read(address) != 0 || self.starter_pack_limit.read() == 0 {
                false
            } else {
                true
            }
        }

        // BUFF

        fn burn(ref self: ContractState, token_id: u256) {
            self.erc721.burn(token_id);
        }

        // BOX

        fn upgrade(ref self: ContractState, token_id: u256) {
            assert(self.token_id.read() >= token_id, 'Invalid token_id');
            let host_address = self.host.read();
            assert(self.erc721.ERC721_owners.read(token_id) == host_address, 'Only staked');

            let sender = get_caller_address();
            let current_level = self.level.read(token_id) + 1;
            let is_starter = self.starter.read(token_id) == 1;
            assert(
                check_max_level(current_level, self.seed.read(token_id), is_starter),
                'Exceed max level'
            );
            let (nko_consume, prism_consume, new_atk) = upgrade_once_consume(
                self.atk.read(token_id), current_level
            );

            assert(nko_consume != 0, 'Wrong level');
            let neko_coin = self.neko.read();
            ERC20BurnTraitDispatcher { contract_address: neko_coin }
                .burnFrom(sender, nko_consume * 700000000000000000);
            IERC20Dispatcher { contract_address: neko_coin }
                .transfer_from(sender, host_address, prism_consume * 300000000000000000);
            if prism_consume > 0 {
                ERC20BurnTraitDispatcher { contract_address: self.prism.read() }
                    .burnFrom(sender, prism_consume * 1000000000000000000);
            }

            let target_level = current_level + 1;
            self.level.write(token_id, target_level);
            self.atk.write(token_id, new_atk);

            self
                .emit(
                    Upgrade {
                        sender: get_caller_address(),
                        token_id: token_id,
                        new_level: target_level.into(),
                        neko_coin_count: nko_consume,
                        prism_count: prism_consume
                    }
                )
        }

        fn generate(self: @ContractState, token_id: u256, origin: bool) -> Info {
            assert(self.token_id.read() >= token_id, 'Invalid token_id');

            let seed = self.seed.read(token_id);
            let is_starter = self.starter.read(token_id) == 1;
            let level = if origin {
                0
            } else {
                self.level.read(token_id)
            };

            let (rarity, element) = generate_basic_info(seed, is_starter);
            let ATK = self.atk.read(token_id);

            let (rarity_string, element_string) = get_rarity_and_element(rarity, element);

            Info {
                rarity: rarity_string, element: element_string, ATK: ATK, level: level.into() + 1
            }
        }
    }

    // internal impl

    fn check_max_level(level: u8, seed: u256, is_starter: bool) -> bool {
        let rarity = generate_rarity(seed, is_starter);
        match rarity {
            0 => false,
            1 => level < 3,
            2 => level < 6,
            3 => level < 9,
            4 => level < 12,
            5 => level < 15,
            _ => false,
        }
    }

    fn get_rarity_and_element(rarity: u8, element: u8) -> (felt252, felt252) {
        (
            match rarity {
                0 => '',
                1 => 'N',
                2 => 'R',
                3 => 'SR',
                4 => 'SSR',
                5 => 'UR',
                _ => '',
            },
            match element {
                0 => '',
                1 => 'Fire',
                2 => 'Water',
                3 => 'Wind',
                4 => 'Earth',
                5 => 'Thunder',
                _ => '',
            }
        )
    }

    fn generate_random(input: u256, min: u256, max: u256) -> u256 {
        if max == min {
            return min;
        }

        let output: u256 = keccak::keccak_u256s_be_inputs(array![input].span());

        let result = (u256 {
            low: integer::u128_byte_reverse(output.high),
            high: integer::u128_byte_reverse(output.low)
        }) % ((max - min).into());

        min + result
    }

    fn generate_rarity(seed: u256, is_starter: bool) -> u8 {
        if is_starter {
            return 1;
        }

        let rarity_number = generate_random(seed, 0, 10000);
        let mut empty = 450;
        let common = 5850;
        let uncommon = 8400;
        let rare = 9500;
        let epic = 9950;
        // let legendary = 10000;

        if (rarity_number < empty) {
            0
        } else if (rarity_number < common) {
            1
        } else if (rarity_number < uncommon) {
            2
        } else if (rarity_number < rare) {
            3
        } else if (rarity_number < epic) {
            4
        } else {
            5
        }
    }

    fn generate_basic_info(seed: u256, is_starter: bool) -> (u8, u8) {
        if is_starter {
            return (1, 1);
        }

        (generate_rarity(seed, is_starter), generate_element(seed))
    }


    fn generate_element(seed: u256) -> u8 {
        let element_number = generate_random(seed, 0, 5);
        if (element_number == 0) {
            1
        } else if (element_number == 1) {
            2
        } else if (element_number == 2) {
            3
        } else if (element_number == 3) {
            4
        } else {
            5
        }
    }

    fn upgrade_once_consume(current_atk: u256, current_level: u8) -> (u256, u256, u256) {
        let (atk_growth, nko_coeficcient, prism_consume) = match current_level {
            0 => (0, 0, 0),
            1 => (15, 15, 0),
            2 => (25, 20, 1),
            3 => (18, 15, 0),
            4 => (18, 15, 0),
            5 => (25, 20, 3),
            6 => (20, 18, 0),
            7 => (20, 18, 0),
            8 => (35, 20, 6),
            9 => (22, 20, 0),
            10 => (22, 20, 0),
            11 => (40, 30, 9),
            12 => (25, 22, 0),
            13 => (25, 22, 0),
            14 => (50, 35, 12),
            _ => (0, 0, 0)
        };

        let new_atk = current_atk * (100 + atk_growth) / 100;
        let nko_consume = new_atk / nko_coeficcient;

        (nko_consume, prism_consume, new_atk)
    }

    impl ERC721HooksImpl<TContractState> of ERC721Component::ERC721HooksTrait<TContractState> {
        fn before_update(
            ref self: ERC721Component::ComponentState<TContractState>,
            to: ContractAddress,
            token_id: u256,
            auth: ContractAddress
        ) {}

        fn after_update(
            ref self: ERC721Component::ComponentState<TContractState>,
            to: ContractAddress,
            token_id: u256,
            auth: ContractAddress
        ) {}
    }
}
