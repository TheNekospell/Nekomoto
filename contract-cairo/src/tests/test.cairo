#[cfg(test)]
mod test {
    use core::result::ResultTrait;
    use core::option::OptionTrait;
    use core::traits::TryInto;
    use openzeppelin::{
        utils::serde::SerializedAppend,
        token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait},
        account::interface::{AccountABIDispatcherTrait, AccountABIDispatcher}, tests::utils,
    };
    use starknet::{
        ContractAddress, ClassHash, contract_address_const, get_contract_address,
        testing::{
            set_contract_address, set_caller_address, set_signature, set_transaction_hash,
            set_version
        },
        account::Call,
    };

    const ERC20_TEST_CLASS_HASH: felt252 =
        0xfa15f33d9a964602972ee0635ba5e641646f0944d7dc279360e7ec943dce6a;
    const ACCOUNT_TEST_CLASS_HASH: felt252 =
        0xd5ad229820cc3391b5d3888c6ce1e08f010ce0d5be429e8030dfc603c60dc8;
    const amount: u256 = 100_000_000_000_000_000_000;

    #[test]
    fn test() {
        let host = deploy_account(0);
        let bob = deploy_account(1);
        let alice = deploy_account(2);

        let nekocoin_address = deploy_nekocoin(host.contract_address.into());
        let prism_address = deploy_prism(host.contract_address.into());
        let temporal_shard_address = deploy_shard(host.contract_address.into());
        let nekomoto_address = deploy_nekomoto(
            nekocoin_address.into(),
            prism_address.into(),
            temporal_shard_address.into(),
            host.contract_address.into()
        );
    }

    fn deploy_nekomoto(
        nekocoin: felt252, prism: felt252, temporal_shard: felt252, host: felt252
    ) -> ContractAddress {
        let mut calldata = array![];
        calldata.append_serde(nekocoin);
        calldata.append_serde(prism);
        calldata.append_serde(temporal_shard);
        calldata.append_serde(host);
        deploy(nekomoto::contracts::nekomoto::Nekomoto::TEST_CLASS_HASH, calldata)
    }

    fn deploy_nekocoin(recipient: felt252) -> ContractAddress {
        let mut calldata = array![];
        calldata.append_serde(amount);
        calldata.append_serde(recipient);

        deploy(nekomoto::contracts::neko_coin::NekoCoin::TEST_CLASS_HASH, calldata)
    }

    fn deploy_prism(host: felt252) -> ContractAddress {
        let mut calldata = array![];
        calldata.append_serde(host);
        deploy(nekomoto::contracts::prism::Prism::TEST_CLASS_HASH, calldata)
    }

    fn deploy_shard(host: felt252) -> ContractAddress {
        let mut calldata = array![];
        calldata.append_serde(host);
        deploy(nekomoto::contracts::temporal_shard::TemporalShard::TEST_CLASS_HASH, calldata)
    }

    fn deploy_account(salt: felt252) -> AccountABIDispatcher {
        set_version(1);

        let mut calldata = array![];
        set_signature(
            array![
                0x6bc22689efcaeacb9459577138aff9f0af5b77ee7894cdc8efabaf760f6cf6e,
                0x295989881583b9325436851934334faa9d639a2094cd1e2f8691c8a71cd4cdf
            ]
                .span()
        );
        set_transaction_hash(0x601d3d2e265c10ff645e1554c435e72ce6721f0ba5fc96f0c650bfc6231191a);
        calldata.append(0x26da8d11938b76025862be14fdb8b28438827f73e75e86f7bfa38b196951fa7);

        let address = deploy_with_salt(ACCOUNT_TEST_CLASS_HASH, calldata, salt);
        AccountABIDispatcher { contract_address: address }
    }

    fn deploy_with_salt(
        classhash: felt252, calldata: Array<felt252>, salt: felt252
    ) -> ContractAddress {
        let (address, _) = starknet::syscalls::deploy_syscall(
            classhash.try_into().unwrap(), salt, calldata.span(), false
        )
            .expect('deploy failed');
        address
    }

    fn deploy(classhash: felt252, calldata: Array<felt252>) -> ContractAddress {
        let (address, _) = starknet::syscalls::deploy_syscall(
            classhash.try_into().unwrap(), 0, calldata.span(), false
        )
            .expect('deploy failed');
        address
    }
}

