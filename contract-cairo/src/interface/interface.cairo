use starknet::{ContractAddress, ClassHash};

#[starknet::interface]
pub trait ERC20BurnTrait<ContractState> {
    fn burn(ref self: ContractState, amount: u256);
    fn burnFrom(ref self: ContractState, account: ContractAddress, amount: u256);
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
    pub name: felt252,
    pub SPI: u256,
    pub ATK: u256,
    pub DEF: u256,
    pub SPD: u256,
    pub fade: u256,
    pub mana: u256,
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
    fn lucky(self: @ContractState, input: ContractAddress) -> bool;
    fn time_freeze(self: @ContractState, input: ContractAddress) -> bool;
    fn start_time_freeze(ref self: ContractState, token_id: u256);
    fn time_freeze_end(self: @ContractState, input: ContractAddress) -> u256;
    fn ascend(self: @ContractState, input: ContractAddress) -> (u8, u8);
    fn upgrade_acend(ref self: ContractState);
    fn increase_fade(
        ref self: ContractState, token_id: Span<u256>, amount: Span<u256>, burn: Span<u256>
    );
    fn upgrade(ref self: ContractState, token_id: u256);
    fn generate(self: @ContractState, token_id: u256, origin: bool) -> Info;
    fn get_level_count(self: @ContractState, address: ContractAddress) -> u256;
}
