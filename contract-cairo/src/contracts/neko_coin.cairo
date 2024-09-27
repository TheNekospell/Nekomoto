#[starknet::contract]
pub mod NekoCoin {
    use nekomoto::component::erc20::ERC20Component;
    use starknet::{ContractAddress, get_caller_address};
    // use nekomoto::interface::interface::{NekomotoTraitDispatcher, NekomotoTraitDispatcherTrait};
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
        host: ContractAddress,
        nekomoto: ContractAddress,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event
    }

    #[constructor]
    fn constructor(ref self: ContractState, fixed_supply: u256, recipient: ContractAddress) {
        self.erc20.initializer("NekoPlaytestOne", "NPO");
        self.erc20.mint(recipient, fixed_supply);
        self.host.write(recipient);
    }

    #[external(v0)]
    fn init(ref self: ContractState, address: ContractAddress) {
        assert!(self.nekomoto.read() == Zero::zero(), "NekoCoin: NekoCoin already initialized");
        // assert(
        //     get_caller_address() == self.host.read(), "NekoCoin: Only host can initialize
        //     NekoCoin"
        // );
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
            amount
        }

        fn after_update(
            ref self: ERC20Component::ComponentState<ContractState>,
            from: ContractAddress,
            recipient: ContractAddress,
            amount: u256
        ) {}
    }
}
