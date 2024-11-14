import "./index.css";
import NekoModal from "@components/Modal/index";

import {useEffect, useState} from "react";

import {Col, Row} from "antd";
import {useNavigate} from "react-router-dom";
import {useAccount} from "@starknet-react/core";
import {addCommaInNumber, NEKOMOTO_ADDRESS,} from "@/interface.js";
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

    const [nekoButton, setNekoButton] = useState("all");
    const [focus, setFocus] = useState({});

    const {serverData: addressInfo, refreshServerData} = useServer();
    const {prism, nekocoin, prismAllowance, nekocoinAllowance, refreshContractData} = useContractData();

    useEffect(() => {
        if (focus || !address || !addressInfo) return;
        setFocus(addressInfo.NekoSpiritList?.at(0) || {});
    }, [addressInfo]);

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
            setSuccess("success:" + result.transaction_hash);
        } else {
            setSuccess("failed");
        }
        refreshServerData();
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
            setSuccess("success:" + result.transaction_hash);
        } else {
            setSuccess("failed");
        }
        refreshServerData();
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
        if (result.execution_status === "SUCCEEDED") {
            setSuccess("success:" + result.transaction_hash);
        } else {
            setSuccess("failed");
        }
        refreshServerData();
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
        if (result.execution_status === "SUCCEEDED") {
            setSuccess("success:" + result.transaction_hash);
        } else {
            setSuccess("failed");
        }
        refreshServerData();
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
                        <NekoDetail focus={focus} waiting={waiting}
                                    setWaiting={setWaiting} success={success} setSuccess={setSuccess}/>
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
