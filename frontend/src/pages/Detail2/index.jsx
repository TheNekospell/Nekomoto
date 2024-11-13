import "./index.css";
import NekoModal from "@components/Modal/index";

import {useEffect, useState} from "react";

import {Col, Row} from "antd";
import {useNavigate} from "react-router-dom";
import {useAccount} from "@starknet-react/core";
import {addCommaInNumber, NEKOCOIN_ADDRESS, NEKOMOTO_ADDRESS, PRISM_ADDRESS,} from "@/interface.js";
import {cairo, CallData} from "starknet";
import UnlockRate from "../../components/UnlockRate";
import PowerCard from "../../components/PowerCard";
import StakePoolCard from "../../components/StakePoolCard";
import NekomotoPreview from "../../components/NekomotoPreview";
import {useServer} from "../../components/Server";
import WaitCard from "../../components/WaitCard";
import NekoDetail from "../../components/NekoDetail";
import {useContractData} from "@components/Contract/index.jsx";

export default function Detail() {
    const navigate = useNavigate();

    const [earningInfo, setEarningInfo] = useState(false);

    const {account, address, status, chainId, isConnected} = useAccount();
    const [hhh, setHhh] = useState("");
    const [waiting, setWaiting] = useState(false);
    const [success, setSuccess] = useState("");

    const [copySuccess1, setCopySuccess1] = useState(false);
    const [nekoButton, setNekoButton] = useState("all");
    const [focus, setFocus] = useState({});
    const [chestDetail, setChestDetail] = useState({});

    const {serverData: addressInfo, refreshServerData} = useServer();
    const {prism, nekocoin, prismAllowance, nekocoinAllowance, refreshContractData} = useContractData();

    useEffect(() => {
        refreshServerData();
        refreshContractData();
    }, [hhh]);

    const message = (result) => {
        return (
            (result.success ? "Success: " : "Something went wrong: ") +
            (result.message === "" ? result.data : result.message)
        );
    };

    const stake = async (input) => {
        setWaiting(true);
        const mCall = await account.execute([
            {
                contractAddress: NEKOMOTO_ADDRESS,
                entrypoint: "stake",
                calldata: CallData.compile({token_id: [cairo.uint256(input)]}),
            },
        ]);

        setHhh(mCall.transaction_hash);
        const result = await account.waitForTransaction(mCall.transaction_hash);
        console.log("result: ", result);
        // setSuccess("Success: " + mCall.transaction_hash);
        if (result.execution_status === "SUCCEEDED") {
            setWaiting(false);
        }
    };

    const unstake = async (input) => {
        setWaiting(true);
        const mCall = await account.execute([
            {
                contractAddress: NEKOMOTO_ADDRESS,
                entrypoint: "withdraw",
                calldata: CallData.compile({token_id: [cairo.uint256(input)]}),
            },
        ]);

        setHhh(mCall.transaction_hash);
        const result = await account.waitForTransaction(mCall.transaction_hash);
        console.log("result: ", result);
        // setSuccess("Success: " + mCall.transaction_hash);
        if (result.execution_status === "SUCCEEDED") {
            setWaiting(false);
        }
    };

    const stakeAll = async () => {
        setWaiting(true);
        const mCall = await account.execute([
            {
                contractAddress: NEKOMOTO_ADDRESS,
                entrypoint: "stake",
                calldata: CallData.compile({
                    token_id: addressInfo.NekoSpiritList?.filter((x) => !x.IsStaked).map(
                        (x) => cairo.uint256(x.TokenId)
                    ),
                }),
            },
        ]);

        setHhh(mCall.transaction_hash);
        const result = await account.waitForTransaction(mCall.transaction_hash);
        console.log("result: ", result);
        setSuccess("Success: " + mCall.transaction_hash);
    };

    const unStakeAll = async () => {
        setWaiting(true);
        const mCall = await account.execute([
            {
                contractAddress: NEKOMOTO_ADDRESS,
                entrypoint: "withdraw",
                calldata: CallData.compile({
                    token_id: addressInfo.NekoSpiritList?.filter((x) => x.IsStaked).map(
                        (x) => cairo.uint256(x.TokenId)
                    ),
                }),
            },
        ]);

        setHhh(mCall.transaction_hash);
        const result = await account.waitForTransaction(mCall.transaction_hash);
        console.log("result: ", result);
        setSuccess("Success: " + mCall.transaction_hash);
    };

    const upgradeCal = [
        {level: "Lv2", SPI: 2, ATK: 1, DEF: 1, SPD: 0, Neko: 100},
        {level: "Lv3", SPI: 2, ATK: 1, DEF: 1, SPD: 0, Neko: 120},
        {level: "Lv4", SPI: 2, ATK: 1, DEF: 1, SPD: 0, Neko: 130},
        {level: "Lv5", SPI: 2, ATK: 1, DEF: 1, SPD: 1, Neko: 140},
        {level: "Lv6", SPI: 2, ATK: 1, DEF: 1, SPD: 1, Neko: 155},
        {level: "Lv7", SPI: 2, ATK: 1, DEF: 1, SPD: 1, Neko: 165},
        {level: "Lv8", SPI: 4, ATK: 3, DEF: 2, SPD: 1, Neko: 200, Prism: 1},
        {level: "Lv9", SPI: 4, ATK: 3, DEF: 2, SPD: 1, Neko: 245},
        {level: "Lv10", SPI: 4, ATK: 3, DEF: 3, SPD: 1, Neko: 300},
        {level: "Lv11", SPI: 6, ATK: 5, DEF: 3, SPD: 1, Neko: 370},
        {level: "Lv12", SPI: 6, ATK: 7, DEF: 3, SPD: 2, Neko: 455},
        {level: "Lv13", SPI: 12, ATK: 9, DEF: 5, SPD: 3, Neko: 1000, Prism: 2},
        {level: "Lv", SPI: 0, ATK: 0, DEF: 0, SPD: 0},
    ];

    const upgrade = async (tokenId) => {
        setWaiting(true);

        let arr = [];
        if (
            upgradeCal[focus.Level - 1].Prism &&
            prismAllowance < upgradeCal[focus.Level - 1].Prism
        ) {
            arr.push({
                contractAddress: PRISM_ADDRESS,
                entrypoint: "approve",
                calldata: CallData.compile({
                    spender: NEKOMOTO_ADDRESS,
                    amount: cairo.uint256(
                        BigInt(upgradeCal[focus.Level - 1].Prism) * 10n ** 18n
                    ),
                }),
            });
        }
        if (
            upgradeCal[focus.Level - 1].Neko &&
            nekocoinAllowance < upgradeCal[focus.Level - 1].Neko
        ) {
            arr.push({
                contractAddress: NEKOCOIN_ADDRESS,
                entrypoint: "approve",
                calldata: CallData.compile({
                    spender: NEKOMOTO_ADDRESS,
                    amount: cairo.uint256(
                        BigInt(upgradeCal[focus.Level - 1].Neko) * 10n ** 18n
                    ),
                }),
            });
        }
        arr.push({
            contractAddress: NEKOMOTO_ADDRESS,
            entrypoint: "upgrade",
            calldata: CallData.compile({token_id: cairo.uint256(tokenId)}),
        });
        const mCall = await account.execute(arr);

        const result = await account.waitForTransaction(mCall.transaction_hash);
        setHhh(mCall.transaction_hash);
        console.log("result ", result);
        // setSuccess("Success: " + mCall.transaction_hash);
        if (result.execution_status === "SUCCEEDED") {
            setWaiting(false);
            // setFocus(addressInfo.NekoSpiritList.find((x) => x.TokenId === tokenId));
        }
    };

    const calRate = (power) => {
        if (power < 200000) {
            return (power / 200000).toFixed(2) * 10 + 50;
        } else if (power < 300000) {
            return ((power - 200000) / 100000).toFixed(2) * 10 + 60;
        } else if (power < 400000) {
            return ((power - 300000) / 100000).toFixed(2) * 10 + 70;
        } else if (power < 500000) {
            return ((power - 400000) / 100000).toFixed(2) * 10 + 80;
        } else if (power < 600000) {
            return ((power - 500000) / 100000).toFixed(2) * 10 + 90;
        } else {
            return 100;
        }
    };

    return (
        <div>
            <WaitCard
                waiting={waiting}
                setWaiting={setWaiting}
                success={success}
                setSuccess={setSuccess}
            />

            <div
                className="detail"
                style={{width: "100%", height: "100%"}}
            >
                <Row gutter={16} style={{height: "100%"}}>
                    <Col
                        style={{width: "55%", height: "100%"}}
                        className="margin-top-16"
                        gutter={16}
                    >
                        <UnlockRate
                            style={{height: "50%"}}
                            rate={calRate(addressInfo?.StaticTotalPower)}
                        />
                        <div style={{marginBottom: "16px"}}/>
                        <PowerCard
                            style={{height: "50%"}}
                            staticTotalPower={addressInfo?.StaticTotalPower}
                            myPower={addressInfo?.MyPower}
                        />
                    </Col>
                    <Col
                        style={{width: "45%", height: "100%"}}
                        className="margin-top-16"
                    >
                        <StakePoolCard
                            setWaiting={setWaiting}
                            setSuccess={setSuccess}
                            staticStakePool={addCommaInNumber(addressInfo?.StaticStakePool)}
                            estStakePoolReward={addCommaInNumber(addressInfo?.EstStakePoolReward)}
                            stakePoolToClaim={addCommaInNumber(addressInfo?.StakePoolToClaim)}
                            staticEpoch={addressInfo?.StaticEpoch}
                        />
                    </Col>
                </Row>

                <Row gutter={16}
                    style={{height: "600px"}}
                >
                    <Col
                        style={{width: "55%", height: "100%"}}
                        className="margin-top-16"
                        gutter={16}
                    >
                        <NekomotoPreview
                            addressInfo={addressInfo}
                            nekoButton={nekoButton}
                            setNekoButton={setNekoButton}
                            focus={focus}
                            setFocus={setFocus}
                            unstake={unstake}
                            stake={stake}
                            stakeAll={stakeAll}
                            unStakeAll={unStakeAll}
                        />
                    </Col>
                    <Col
                        style={{width: "45%", height: "100%"}}
                        className="margin-top-16"
                        gutter={16}
                    >
                        <NekoDetail focus={focus} prism={prism} nekocoin={nekocoin}/>
                    </Col>
                </Row>
            </div>

            <NekoModal
                open={earningInfo}
                centered={true}
                footer={null}
                maskClosable={true}
                onCancel={() => setEarningInfo(false)}
                title={"Earning"}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        color: "#90A6AF",
                        fontFamily: "BIG SHOT",
                        fontSize: "14px",
                        lineHeight: "18px",
                        fontWeight: "400",
                    }}
                >
                    <div style={{marginRight: "10px"}}>&#8226;</div>
                    <div>{"Include 10% tax "}</div>
                </div>
            </NekoModal>
        </div>
    );
}
