use starknet::ContractAddress;

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
