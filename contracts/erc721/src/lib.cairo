#[starknet::contract]
mod MyNFT {
    use openzeppelin::token::erc721::erc721::ERC721Component::InternalTrait;
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc721::{ERC721Component, ERC721HooksEmptyImpl};
    use starknet::{ContractAddress, get_caller_address};

    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    // ERC721 Mixin
    #[abi(embed_v0)]
    impl ERC721MixinImpl = ERC721Component::ERC721MixinImpl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        owner: ContractAddress,
        token_id: u256,
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        let name = "NFT";
        let symbol = "NFT";
        let base_uri = "https://api.example.com/v1/";
        // let token_id = 1;

        self.token_id.write(1);
        self.owner.write(get_caller_address());

        self.erc721.initializer(name, symbol, base_uri);
    // self.erc721._mint(recipient, token_id);
    }

    #[external(v0)]
    fn summon(ref self: ContractState, recipient: ContractAddress) {
        assert(get_caller_address()== self.owner.read(), 'Only the owner can summon');
        self.erc721._mint(recipient, self.token_id.read());
        self.token_id.write(self.token_id.read() + 1);
    }

    #[external(v0)]
    fn burn(ref self: ContractState, token_id: u256) {
        self.erc721._burn(token_id);
    }
}
