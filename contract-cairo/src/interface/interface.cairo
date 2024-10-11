use starknet::{ContractAddress, ClassHash};

#[starknet::interface]
pub trait ERC20BurnTrait<ContractState> {
    fn burn(ref self: ContractState, amount: u256);
    fn burnFrom(ref self: ContractState, account: ContractAddress, amount: u256);
    fn mint(ref self: ContractState, recipient: ContractAddress, amount: u256);
    fn check_in(ref self: ContractState, address: ContractAddress) -> bool;
}

#[starknet::interface]
pub trait ERC721BurnTrait<ContractState> {
    fn burn(ref self: ContractState, token_id: u256);
    fn summon(ref self: ContractState, recipient: ContractAddress);
}

#[derive(Copy, Drop, Serde)]
pub struct Info {
    pub rarity: felt252,
    pub element: felt252,
    pub ATK: u256,
    pub level: u8
}

#[starknet::interface]
pub trait NekomotoTrait<ContractState> {
    fn replace_classhash(ref self: ContractState, new_class_hash: ClassHash);
    fn summon(ref self: ContractState, recipient: ContractAddress, count: u256, random: u256);
    fn stake(ref self: ContractState, token_id: Array<u256>);
    fn withdraw(ref self: ContractState, token_id: Array<u256>);
    fn add_limit(ref self: ContractState, input: u256);
    fn starter_pack(ref self: ContractState);
    fn check_starter_pack(self: @ContractState, address: ContractAddress) -> bool;
    fn burn(ref self: ContractState, token_id: u256);
    fn upgrade(ref self: ContractState, token_id: u256);
    fn upgrade_to_max(ref self: ContractState, token_id: u256);
    fn generate(self: @ContractState, token_id: u256, origin: bool) -> Info;
    fn buy_coin(ref self: ContractState, count: u256);
    fn check_coin(self: @ContractState, address: ContractAddress) -> u256;
    fn check_in(ref self: ContractState) -> bool;
}
