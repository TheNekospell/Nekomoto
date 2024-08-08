#[starknet::contract]
pub mod NekoCoin {
    use nekomoto::component::erc20::ERC20Component;
    use starknet::{ContractAddress, get_caller_address};
    use nekomoto::interface::interface::{NekomotoTraitDispatcher, NekomotoTraitDispatcherTrait};
    use core::num::traits::Zero;

    component!(path: ERC20Component, storage: erc20, event: ERC20Event);

    // ERC20 Mixin
    #[abi(embed_v0)]
    impl ERC20MixinImpl = ERC20Component::ERC20MixinImpl<ContractState>;
    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
        nekomoto: ContractAddress
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event
    }

    #[constructor]
    fn constructor(ref self: ContractState, fixed_supply: u256, recipient: ContractAddress) {
        self.erc20.initializer("NekoCoin", "NKO");
        self.erc20.mint(recipient, fixed_supply);
    }

    #[external(v0)]
    fn init(ref self: ContractState, address: ContractAddress) {
        assert_eq!(self.nekomoto.read(), Zero::zero(), "NekoCoin: NekoCoin already initialized");
        self.nekomoto.write(address);
    }

    #[external(v0)]
    fn burn(ref self: ContractState, amount: u256) {
        self.erc20.burn(get_caller_address(), amount);
    }

    #[external(v0)]
    fn burnFrom(ref self: ContractState, account: ContractAddress, amount: u256) {
        self.erc20._spend_allowance(account, get_caller_address(), amount);
        self.erc20.burn(account, amount);
    }

    impl ERC20HooksImpl<ContractState> of ERC20Component::ERC20HooksTrait<ContractState> {
        fn before_update(
            ref self: ERC20Component::ComponentState<ContractState>,
            from: ContractAddress,
            recipient: ContractAddress,
            amount: u256
        ) -> u256 {
            let zero_address = Zero::zero();
            if from == zero_address || recipient == zero_address {
                return amount;
            }

            // [0,10]	25000
            // [11,20]	50000
            // [21,40]	125000
            // [41,80]	250000
            // [81,100]	550000
            // [101,150]    1200000
            // [151,200]	1600000
            // [201,+∞]	2000000

            let state = nekomoto::contracts::neko_coin::NekoCoin::unsafe_new_contract_state();
            let balance = self.ERC20_balances.read(recipient);
            let level_count = NekomotoTraitDispatcher { contract_address: state.nekomoto.read() }
                .get_level_count(recipient);

            let max = if level_count <= 10 {
                25000000000000000000000
            } else if level_count <= 20 {
                50000000000000000000000
            } else if level_count <= 40 {
                125000000000000000000000
            } else if level_count <= 80 {
                250000000000000000000000
            } else if level_count <= 100 {
                550000000000000000000000
            } else if level_count <= 150 {
                1200000000000000000000000
            } else if level_count <= 200 {
                1600000000000000000000000
            } else {
                2000000000000000000000000
            };

            if balance >= max {
                0
            } else {
                let diff = max - balance;
                if diff > amount {
                    amount
                } else {
                    diff
                }
            }
        }

        fn after_update(
            ref self: ERC20Component::ComponentState<ContractState>,
            from: ContractAddress,
            recipient: ContractAddress,
            amount: u256
        ) {}
    }
}
