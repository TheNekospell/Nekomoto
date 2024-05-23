#[starknet::contract]
mod Prism {
    use openzeppelin::token::erc20::erc20::ERC20Component::InternalTrait;
    use openzeppelin::token::erc20::{ERC20Component, ERC20HooksEmptyImpl};
    use starknet::{ContractAddress, get_caller_address};


    component!(path: ERC20Component, storage: erc20, event: ERC20Event);

    #[abi(embed_v0)]
    impl ERC20MixinImpl = ERC20Component::ERC20MixinImpl<ContractState>;
    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
        owner: ContractAddress
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event
    }

    #[constructor]
    fn constructor(ref self: ContractState, fixed_supply: u256) {
        self.erc20.initializer("Prism", "Prism");
        self.owner.write(get_caller_address());
    }

    #[external(v0)]
    fn mint(ref self: ContractState, recipient: ContractAddress, amount: u256) {
        self.erc20._mint(recipient, amount);
    }

    #[external(v0)]
    fn burn(ref self: ContractState, amount: u256) {
        self.erc20._burn(get_caller_address(), amount);
    }

    #[external(v0)]
    fn burnFrom(ref self: ContractState, account: ContractAddress, amount: u256) {
        self.erc20._spend_allowance(account, get_caller_address(), amount);
        self.erc20._burn(account, amount);
    }
}
