// set_caller_address does not work sometimes

#[cfg(test)]
mod test {
    use core::serde::Serde;
    use core::array::ArrayTrait;
    use core::result::ResultTrait;
    use core::option::OptionTrait;
    use core::traits::TryInto;
    use core::num::traits::Zero;

    use super::super::account::Account;
    use nekomoto::interface::interface::{
        ERC721BurnTraitDispatcher, ERC721BurnTraitDispatcherTrait, ERC20BurnTraitDispatcher,
        ERC20BurnTraitDispatcherTrait, NekomotoTraitDispatcher, NekomotoTraitDispatcherTrait, Info
    };
    use openzeppelin::{
        utils::serde::SerializedAppend,
        token::{
            erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait},
            erc721::interface::{IERC721Dispatcher, IERC721DispatcherTrait},
        },
        account::interface::{AccountABIDispatcherTrait, AccountABIDispatcher}, tests::utils,
    };
    use starknet::{
        ContractAddress, ClassHash, contract_address_const, get_contract_address,
        get_block_timestamp,
        testing::{
            set_contract_address, set_caller_address, set_signature, set_transaction_hash,
            set_version, set_block_timestamp, set_block_number
        },
        account::Call,
    };
    use super::{InitTraitDispatcher, InitTraitDispatcherTrait};

    const amount: u256 = 2_000_000_000_000_000_000_000_000_000;

    fn init() -> (
        AccountABIDispatcher,
        AccountABIDispatcher,
        AccountABIDispatcher,
        ContractAddress,
        ContractAddress,
        ContractAddress,
        ContractAddress
    ) {
        let host = deploy_account(0);
        let bob = deploy_account(1);
        let alice = deploy_account(2);
        println!("deploy host:{:?}", host.contract_address);
        println!("deploy bob:{:?}", bob.contract_address);
        println!("deploy alice:{:?}", alice.contract_address);

        let nekocoin_address = deploy_nekocoin(host.contract_address.into());
        let prism_address = deploy_prism(host.contract_address.into());
        let temporal_shard_address = deploy_shard(host.contract_address.into());
        let nekomoto_address = deploy_nekomoto(
            nekocoin_address.into(),
            prism_address.into(),
            temporal_shard_address.into(),
            host.contract_address.into()
        );
        InitTraitDispatcher { contract_address: nekocoin_address }.init(nekomoto_address);
        println!("deploy nekocoin at: {:?}", nekocoin_address);
        println!("deploy prism at: {:?}", prism_address);
        println!("deploy shard at: {:?}", temporal_shard_address);
        println!("deploy nekomoto at: {:?}", nekomoto_address);
        (
            host,
            bob,
            alice,
            nekocoin_address,
            prism_address,
            temporal_shard_address,
            nekomoto_address
        )
    }

    #[test]
    #[ignore]
    fn temp() {
        let mut temp: felt252 = true.into();
        println!("true:{}", temp);
        temp = false.into();
        println!("false:{}", temp);

        let felt: felt252 = 'felt';
        println!("felt:{}", felt);
    }

    #[test]
    fn test_main_process() {
        let (
            host,
            bob,
            alice,
            nekocoin_address,
            prism_address,
            temporal_shard_address,
            nekomoto_address
        ) =
            init();

        println!("spread assets");
        spread_assets(
            host, bob.contract_address, nekocoin_address, prism_address, temporal_shard_address
        );
        spread_assets(
            host, alice.contract_address, nekocoin_address, prism_address, temporal_shard_address
        );

        assert_eq!(
            IERC20Dispatcher { contract_address: nekocoin_address }
                .balance_of(bob.contract_address),
            (25000000000000000000000_u256)
        );
        assert_eq!(
            IERC20Dispatcher { contract_address: prism_address }.balance_of(bob.contract_address),
            (25000000000000000000000_u256)
        );
        assert_eq!(
            IERC721Dispatcher { contract_address: temporal_shard_address }
                .balance_of(bob.contract_address),
            (100)
        );

        println!("approve assets");
        approve_assets(
            bob, nekomoto_address, nekocoin_address, prism_address, temporal_shard_address
        );
        approve_assets(
            alice, nekomoto_address, nekocoin_address, prism_address, temporal_shard_address
        );

        assert_eq!(
            IERC20Dispatcher { contract_address: nekocoin_address }
                .allowance(bob.contract_address, nekomoto_address),
            (25000000000000000000000_u256)
        );
        assert_eq!(
            IERC20Dispatcher { contract_address: prism_address }
                .allowance(bob.contract_address, nekomoto_address),
            (25000000000000000000000_u256)
        );
        assert_eq!(
            IERC721Dispatcher { contract_address: temporal_shard_address }
                .is_approved_for_all(bob.contract_address, nekomoto_address),
            (true)
        );

        println!(
            "level count: {:?}",
            NekomotoTraitDispatcher { contract_address: nekomoto_address }
                .get_level_count(bob.contract_address)
        );

        println!("starter pack");
        bob
            .__execute__(
                array![
                    Call {
                        to: nekomoto_address,
                        selector: selector!("starter_pack"),
                        calldata: array![].span()
                    }
                ]
            );
        assert!(
            IERC721Dispatcher { contract_address: nekomoto_address }
                .balance_of(bob.contract_address) == 1
        );
        println!(
            "starter pack open : {:?}",
            IERC721Dispatcher { contract_address: nekomoto_address }
                .balance_of(bob.contract_address)
        );

        println!("summon");
        host
            .__execute__(
                array![
                    Call {
                        to: nekomoto_address,
                        selector: selector!("summon"),
                        calldata: array![]
                            .join(bob.contract_address)
                            .join(1_u256)
                            .join(6_u256)
                            .span()
                    }
                ]
            );
        assert!(
            IERC721Dispatcher { contract_address: nekomoto_address }
                .balance_of(bob.contract_address) >= 1
        );
        println!(
            "starter pack and summon : {:?}",
            IERC721Dispatcher { contract_address: nekomoto_address }
                .balance_of(bob.contract_address)
        );

        set_block_timestamp(1_000_000_000_000);
        println!("stake");
        bob
            .__execute__(
                array![
                    Call {
                        to: nekomoto_address,
                        selector: selector!("stake"),
                        calldata: array![].join(array![ // 1_u256,
                        2_u256, // 3_u256,
                        // 4_u256,
                        // 5_u256,
                        // 6_u256,
                        // 7_u256,
                        // 8_u256,
                        // 9_u256,
                        // 10_u256
                        ]).span()
                    }
                ]
            );
        // // upgrade nekomoto
    // let mut multicall = array![];
    // let mut calldata = array![];
    // calldata.append_serde(2_u256);
    // let mut i = 12;
    // loop {
    //     if i == 0 {
    //         break;
    //     }

        //     multicall
    //         .append(
    //             Call {
    //                 to: nekomoto_address,
    //                 selector: selector!("upgrade"),
    //                 calldata: calldata.span()
    //             }
    //         );
    //     // println!("upgrade level to: {}", 14 - i);

        //     i = i - 1;
    // };
    // bob.__execute__(multicall);

        // // hard to deserialize
    // // bob
    // //     .__execute__(
    // //         array![
    // //             Call {
    // //                 to: nekomoto_address,
    // //                 selector: selector!("generate"),
    // //                 calldata: calldata.join(2_u256).join(false).span()
    // //             }
    // //         ]
    // //     );
    // let result = NekomotoTraitDispatcher { contract_address: nekomoto_address }
    //     .generate(2_u256, false);
    // // result.print();
    // PTrait::<Info>::print(result);
    // assert_eq!(result.level, 13);

        // // assert_eq!(
    // //     NekomotoTraitDispatcher { contract_address: nekomoto_address }
    // //         .lucky(bob.contract_address),
    // //     true
    // // );

        // set_block_timestamp(1_000_000_003_600);
    // assert_eq!(
    //     NekomotoTraitDispatcher { contract_address: nekomoto_address }
    //         .generate(2_u256, false)
    //         .fade,
    //     result.fade - 100
    // );

        // bob
    //     .__execute__(
    //         array![
    //             Call {
    //                 to: nekomoto_address,
    //                 selector: selector!("withdraw"),
    //                 calldata: array![].join(array![1_u256, // 2_u256,
    //                 // 3_u256,
    //                 // 4_u256,
    //                 // 5_u256,
    //                 // 6_u256,
    //                 // 7_u256,
    //                 // 8_u256,
    //                 // 9_u256,
    //                 // 10_u256
    //                 ]).span()
    //             }
    //         ]
    //     );

        // // assert_eq!(
    // //     NekomotoTraitDispatcher { contract_address: nekomoto_address }
    // //         .lucky(bob.contract_address),
    // //     false
    // // );

        // // buff part

        // println!("block timestamp:{}", get_block_timestamp());

        // assert_eq!(
    //     NekomotoTraitDispatcher { contract_address: nekomoto_address }
    //         .time_freeze_end(bob.contract_address),
    //     0
    // );

        // bob
    //     .__execute__(
    //         array![
    //             Call {
    //                 to: nekomoto_address,
    //                 selector: selector!("start_time_freeze"),
    //                 calldata: array![].join(1_u256).span()
    //             }
    //         ]
    //     );
    // assert_eq!(
    //     NekomotoTraitDispatcher { contract_address: nekomoto_address }
    //         .time_freeze(bob.contract_address),
    //     true
    // );

        // bob
    //     .__execute__(
    //         {
    //             let mut i = 9;
    //             let mut multicall = array![];
    //             loop {
    //                 if i == 0 {
    //                     break;
    //                 }
    //                 multicall
    //                     .append(
    //                         Call {
    //                             to: nekomoto_address,
    //                             selector: selector!("upgrade_acend"),
    //                             calldata: array![].span()
    //                         }
    //                     );
    //                 i = i - 1;
    //             };
    //             multicall
    //         }
    //     );
    // assert_eq!(
    //     NekomotoTraitDispatcher { contract_address: nekomoto_address }
    //         .ascend(bob.contract_address),
    //     (9, 51)
    // );

        // // transfer
    // bob
    //     .__execute__(
    //         array![
    //             Call {
    //                 to: nekomoto_address,
    //                 selector: selector!("transfer_from"),
    //                 calldata: array![]
    //                     .join(bob.contract_address)
    //                     .join(alice.contract_address)
    //                     .join(2_u256)
    //                     .span()
    //             }
    //         ]
    //     );

        // assert_eq!(
    //     IERC721Dispatcher { contract_address: nekomoto_address }.owner_of(2_u256),
    //     alice.contract_address
    // );

        // assert_eq!(
    //     NekomotoTraitDispatcher { contract_address: nekomoto_address }
    //         .generate(2_u256, false)
    //         .level,
    //     1
    // );

        // // time freeze and fade consume
    // set_block_timestamp(2_000_000_000_000);

        // alice
    //     .__execute__(
    //         array![
    //             Call {
    //                 to: nekomoto_address,
    //                 selector: selector!("stake"),
    //                 calldata: array![].join(array![2_u256]).span()
    //             }
    //         ]
    //     );

        // let result = NekomotoTraitDispatcher { contract_address: nekomoto_address }
    //     .generate(2_u256, false);
    // PTrait::<Info>::print(result);

        // set_block_timestamp(2_000_000_003_600);

        // alice
    //     .__execute__(
    //         array![
    //             Call {
    //                 to: nekomoto_address,
    //                 selector: selector!("start_time_freeze"),
    //                 calldata: array![].join(101_u256).span()
    //             }
    //         ]
    //     );
    // assert_eq!(
    //     NekomotoTraitDispatcher { contract_address: nekomoto_address }
    //         .time_freeze(alice.contract_address),
    //     true
    // );

        // set_block_timestamp(2_000_000_007_200);

        // assert_eq!(
    //     NekomotoTraitDispatcher { contract_address: nekomoto_address }
    //         .generate(2_u256, false)
    //         .fade,
    //     result.fade - 100
    // );
    }

    // for fun
    #[generate_trait]
    impl JoinTraitImpl<T, +Serde<T>, +Drop<T>> of JoinTrait<T> {
        fn join(mut self: Array<felt252>, value: T) -> Array<felt252> {
            value.serialize(ref self);
            self
        }
    }

    #[generate_trait]
    impl PImpl<T> of PTrait<T> {
        fn print(self: Info) -> Info {
            println!("rarity:{}", self.rarity);
            println!("element:{}", self.element);
            println!("name:{}", self.name);
            println!("SPI:{}", self.SPI);
            println!("ATK:{}", self.ATK);
            println!("DEF:{}", self.DEF);
            println!("SPD:{}", self.SPD);
            println!("fade:{}", self.fade);
            println!("mana:{}", self.mana);
            println!("level:{}", self.level);
            self
        }
    }

    // let arr = ArrayTrait::<T>::new();
    // <T, +Drop<T>, +SerializedAppend<T>>
    fn invoke<T, +Drop<T>, +SerializedAppend<T>>(
        account: AccountABIDispatcher,
        contract: ContractAddress,
        selector: felt252,
        ref rawdata: Array<T>
    ) {
        let mut calldata = array![];
        loop {
            match rawdata.pop_front() {
                Option::Some(v) => calldata.append_serde(v),
                Option::None => { break; }
            }
        }
    }

    fn approve_assets(
        account: AccountABIDispatcher,
        reciever: ContractAddress,
        nekocoin_address: ContractAddress,
        prism_address: ContractAddress,
        temporal_shard_address: ContractAddress
    ) {
        let amount_to_use = 25000000000000000000000_u256;

        account
            .__execute__(
                array![
                    // neko coin
                    Call {
                        to: nekocoin_address,
                        selector: selector!("approve"),
                        calldata: array![].join(reciever).join(amount_to_use).span()
                    },
                    // prism
                    Call {
                        to: prism_address,
                        selector: selector!("approve"),
                        calldata: array![].join(reciever).join(amount_to_use).span()
                    },
                    // shard
                    Call {
                        to: temporal_shard_address,
                        selector: selector!("set_approval_for_all"),
                        calldata: array![].join(reciever).join(true).span()
                    },
                ]
            );
    }

    fn spread_assets(
        host: AccountABIDispatcher,
        reciever: ContractAddress,
        nekocoin_address: ContractAddress,
        prism_address: ContractAddress,
        temporal_shard_address: ContractAddress
    ) {
        let mut multicall = array![];
        let amount_to_use = 25000000000000000000000_u256;

        // neko coin
        let mut calldata = array![];
        calldata.append_serde(reciever);
        calldata.append_serde(amount_to_use);
        let call = Call {
            to: nekocoin_address, selector: selector!("transfer"), calldata: calldata.span()
        };
        multicall.append(call);

        // prism
        let mut calldata = array![];
        calldata.append_serde(reciever);
        calldata.append_serde(amount_to_use);
        let call = Call {
            to: prism_address, selector: selector!("mint"), calldata: calldata.span()
        };
        multicall.append(call);

        // shard
        let mut calldata = array![];
        calldata.append_serde(reciever);
        calldata.append_serde(100_u256);
        let call = Call {
            to: temporal_shard_address, selector: selector!("mint"), calldata: calldata.span()
        };
        multicall.append(call);

        host.__execute__(multicall);
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

        let address = deploy_with_salt(Account::TEST_CLASS_HASH, calldata, salt);
        AccountABIDispatcher { contract_address: address }
    }

    fn deploy_with_salt(
        classhash: felt252, calldata: Array<felt252>, salt: felt252
    ) -> ContractAddress {
        let result = starknet::syscalls::deploy_syscall(
            classhash.try_into().unwrap(), salt, calldata.span(), false
        );
        if result.is_err() {
            let err = result.unwrap_err();
            println!("deploy error: {:?}", err);
            return Zero::zero();
        }
        let (address, _) = result.unwrap();
        address
    }

    fn deploy(classhash: felt252, calldata: Array<felt252>) -> ContractAddress {
        deploy_with_salt(classhash, calldata, 0)
    }
}

use starknet::{ContractAddress};

#[starknet::interface]
pub trait InitTrait<ContractState> {
    fn init(ref self: ContractState, nekomoto: ContractAddress);
}
