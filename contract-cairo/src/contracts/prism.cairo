#[starknet::contract]
pub mod Prism {
    use openzeppelin::token::erc20::{ERC20Component, ERC20HooksEmptyImpl};
    use starknet::{ContractAddress, get_caller_address, storage::Map, get_block_timestamp};

    component!(path: ERC20Component, storage: erc20, event: ERC20Event);

    #[abi(embed_v0)]
    impl ERC20MixinImpl = ERC20Component::ERC20MixinImpl<ContractState>;
    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
        host: ContractAddress,
        nekomoto: ContractAddress,
        init: bool,
        record: Map<(ContractAddress, u64), u8>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event
    }

    #[constructor]
    fn constructor(ref self: ContractState, host: ContractAddress) {
        self.erc20.initializer("Prism", "Prism");
        self.host.write(host);
    }

    #[external(v0)]
    fn init(ref self: ContractState, nekomoto: ContractAddress) {
        // assert(get_caller_address() == self.host.read(), 'Only the host can init');
        assert(!self.init.read(), 'Already init');
        self.init.write(true);
        self.nekomoto.write(nekomoto);
    }

    #[external(v0)]
    fn mint(ref self: ContractState, recipient: ContractAddress, amount: u256) {
        let caller = get_caller_address();
        assert(
            caller == self.host.read() || caller == self.nekomoto.read(), 'Only the host can mint'
        );
        self.erc20.mint(recipient, amount);
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

    const POW_1: u8 = 0x2; // 2^1
    const POW_2: u8 = 0x4; // 2^2
    const POW_3: u8 = 0x8; // 2^3
    const POW_4: u8 = 0x10; // 2^4
    const POW_5: u8 = 0x20; // 2^5
    const POW_6: u8 = 0x40; // 2^6
    const POW_7: u8 = 0x80; // 2^7

    #[external(v0)]
    fn check_in(ref self: ContractState, address: ContractAddress) -> bool {
        assert(get_caller_address() == self.nekomoto.read(), 'Only the nekomoto');

        let current = get_block_timestamp();
        let current_week = current / 604800;
        let record = self.record.read((address, current_week));

        let current_day = (current % 604800) / 86400;
        let new_record = match current_day {
            0 => record | POW_7,
            1 => record | POW_6,
            2 => record | POW_5,
            3 => record | POW_4,
            4 => record | POW_3,
            5 => record | POW_2,
            6 => record | POW_1,
            _ => record,
        };

        if new_record != record {
            self.record.write((address, current_week), new_record);
            if new_record | POW_7 == new_record {
                self.erc20.mint(address, 2000000000000000000);
            } else {
                self.erc20.mint(address, 1000000000000000000);
            }
            true
        } else {
            false
        }
    }

    #[external(v0)]
    fn read_check_in(self: @ContractState, address: ContractAddress) -> u8 {
        let current = get_block_timestamp();
        let current_week = current / 604800;
        self.record.read((address, current_week))
    }
}
