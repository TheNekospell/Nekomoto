import {Col, Flex, Row} from "antd";
import CardCorner from "../CardCorner";
import CardDetail from "../CardDetail";
import {
    addCommaInNumber,
    NEKOCOIN_ADDRESS,
    NEKOMOTO_ADDRESS,
    nekomotoContract,
    PRISM_ADDRESS,
    waitTx
} from "@/interface.js";
import m2 from "@assets/modal-icon2.png";
import Button from "../Button";
import BoxBorder from "../BoxBorder";
import {useEffect, useMemo, useState} from "react";

import blue from "@assets/blue.png";
import purple from "@assets/purple.png";
import {useContractData} from "@components/Contract/index.jsx";
import {cairo, CallData} from "starknet";
import {useAccount} from "@starknet-react/core";
import {useServer} from "@components/Server/index.jsx";
import NekoModal from "@components/Modal/index.jsx";
import exclamation from "@assets/exclamation.png";

export default function NekoDetail({focus, waiting, setWaiting, success, setSuccess}) {

    const [upgradeCostOnce, setUpgradeCostOnce] = useState({
        tokenId: 0,
        nkoConsume: 0,
        prismConsume: 0,
        newATK: 0,
    });
    const [upgradeCostMax, setUpgradeCostMax] = useState({
        tokenId: 0,
        nkoConsume: 0,
        prismConsume: 0,
        newATK: 0,
    });

    const {account} = useAccount();
    const {nekocoin, prism, nekocoinAllowance, prismAllowance} = useContractData();
    const {serverData: addressInfo, refreshServerData} = useServer();
    // const addressInfoRef = useRef(addressInfo);

    const [upgradeToMaxModal, setUpgradeToMaxModal] = useState(false);

    // useEffect(() => {
    //     addressInfoRef.current = addressInfo
    // }, [addressInfo])

    useEffect(() => {
        if (!focus || !focus.TokenId) return
        nekomotoContract.upgrade_consume(focus.TokenId, false).then((res) => {
            setUpgradeCostOnce({
                nkoConsume: Number(res[0]),
                prismConsume: Number(res[1]),
                newATK: Number(res[2]),
                tokenId: focus.TokenId
            })
        }).catch((err) => {
            if (err.toString().includes("Exceed max level")) {
                setUpgradeCostOnce({
                    nkoConsume: 0,
                    prismConsume: 0,
                    newATK: 0,
                    tokenId: focus.TokenId
                })
            }
        });
        nekomotoContract.upgrade_consume(focus.TokenId, true).then((res) => {
            setUpgradeCostMax({
                nkoConsume: Number(res[0]),
                prismConsume: Number(res[1]),
                newATK: Number(res[2]),
                tokenId: focus.TokenId
            })
        }).catch((err) => {
            if (err.toString().includes("Exceed max level")) {
                setUpgradeCostMax({
                    nkoConsume: 0,
                    prismConsume: 0,
                    newATK: 0,
                    tokenId: focus.TokenId
                })
            }
        });
    }, [focus])

    const Detail = ({title, value}) => {
        return (
            <>
                <Flex justify="space-between" className="margin-bottom-16">
                    <div className="modal-text2">{title}</div>
                    <div className="modal-text3">{value}</div>
                </Flex>
            </>
        );
    };

    const calMaxLevel = (rarity) => {
        let maxLevel;
        switch (rarity) {
            case "N":
                maxLevel = 3;
                break;
            case "R":
                maxLevel = 6;
                break;
            case "SR":
                maxLevel = 9;
                break;
            case "SSR":
                maxLevel = 12;
                break;
            case "UR":
                maxLevel = 15;
                break;
            default:
                maxLevel = 0;
        }
        return maxLevel;
    };

    const maxLevel = useMemo(() => calMaxLevel(focus.Rarity), [focus.Rarity]);

    const upgradeOnce = async () => {

        if (upgradeCostOnce.tokenId !== focus?.TokenId) {
            return;
        }

        setWaiting(true);

        if (upgradeCostOnce.prismConsume > prism || upgradeCostOnce.nkoConsume > nekocoin) {
            setSuccess("Insufficient balance");
            return;
        }

        let arr = [];
        if (upgradeCostOnce.nkoConsume > nekocoinAllowance) {
            arr.push({
                contractAddress: NEKOCOIN_ADDRESS,
                entrypoint: "approve",
                calldata: CallData.compile({
                    spender: NEKOMOTO_ADDRESS,
                    amount: cairo.uint256(BigInt(upgradeCostOnce.nkoConsume) * 10n ** 18n)
                }),
            })
        }
        if (upgradeCostOnce.prismConsume > prismAllowance) {
            arr.push({
                contractAddress: PRISM_ADDRESS,
                entrypoint: "approve",
                calldata: CallData.compile({
                    spender: NEKOMOTO_ADDRESS,
                    amount: cairo.uint256(BigInt(upgradeCostOnce.prismConsume) * 10n ** 18n)
                }),
            })
        }
        arr.push({
            contractAddress: NEKOMOTO_ADDRESS,
            entrypoint: "upgrade",
            calldata: CallData.compile({tokenId: cairo.uint256(focus.TokenId)}),
        });

        try {
            const mCall = await account.execute(arr);

            const result = await waitTx(mCall.transaction_hash);
            console.log("result: ", result);
            // setSuccess("Success: " + mCall.transaction_hash);
            if (result.execution_status === "SUCCEEDED") {
                setSuccess("success:" + result.transaction_hash);
            } else {
                setSuccess("failed");
            }

            const i = setInterval(() => {
                if (addressInfo.NekoSpiritList.filter(item => item.TokenId === focus.TokenId).at(0).Level === focus.Level) {
                    refreshServerData();
                } else {
                    clearInterval(i);
                }
            }, 2000);
            setTimeout(() => clearInterval(i), 30000)
        } catch (e) {
            setWaiting(false);
            console.log(e)
        }

    }

    const upgradeToMax = async () => {

        if (upgradeCostMax.tokenId !== focus?.TokenId) {
            return;
        }

        setWaiting(true);

        if (upgradeCostMax.prismConsume > prism || upgradeCostMax.nkoConsume > nekocoin) {
            setSuccess("Insufficient balance");
            return;
        }

        let arr = [];
        if (upgradeCostMax.nkoConsume > nekocoinAllowance) {
            arr.push({
                contractAddress: NEKOCOIN_ADDRESS,
                entrypoint: "approve",
                calldata: CallData.compile({
                    spender: NEKOMOTO_ADDRESS,
                    amount: cairo.uint256(BigInt(upgradeCostMax.nkoConsume) * 10n ** 18n)
                }),
            })
        }
        if (upgradeCostMax.prismConsume > prismAllowance) {
            arr.push({
                contractAddress: PRISM_ADDRESS,
                entrypoint: "approve",
                calldata: CallData.compile({
                    spender: NEKOMOTO_ADDRESS,
                    amount: cairo.uint256(BigInt(upgradeCostMax.prismConsume) * 10n ** 18n)
                }),
            })
        }
        arr.push({
            contractAddress: NEKOMOTO_ADDRESS,
            entrypoint: "upgrade_to_max",
            calldata: CallData.compile({tokenId: cairo.uint256(focus.TokenId)}),
        });

        try {
            const mCall = await account.execute(arr);
            const result = await waitTx(mCall.transaction_hash);
            console.log("result: ", result);
            // setSuccess("Success: " + mCall.transaction_hash);
            if (result.execution_status === "SUCCEEDED") {
                setSuccess("success:" + result.transaction_hash);
            } else {
                setSuccess("failed");
            }

            const i = setInterval(() => {
                if (addressInfo.NekoSpiritList.filter(item => item.TokenId === focus.TokenId).at(0).Level === focus.Level) {
                    refreshServerData();
                } else {
                    clearInterval(i);
                }
            }, 2000);
            setTimeout(() => clearInterval(i), 30000)
        } catch (e) {
            setWaiting(false);
            console.log(e)
        }

        refreshServerData();

    }

    return (
        <>
            <NekoModal
                open={upgradeToMaxModal}
                centered={true}
                footer={null}
                maskClosable={true}
                onCancel={() => {
                    setUpgradeToMaxModal(false);
                    refreshServerData();
                }}
            >
                <div
                    style={{
                        marginTop: "20px",
                        marginBottom: "20px",
                        alignItems: "center",
                        justifyContent: "center",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#172937",
                            width: '110%',
                            padding: '10px 0',
                        }}>
                        <h2
                            style={{
                                textAlign: "center",
                                fontFamily: "BIG SHOT",
                                color: "white",
                                fontWeight: "bold",
                                wordWrap: "break-word",
                                wordBreak: "break-all",
                            }}>
                            Confirm
                        </h2>
                    </div>

                    <h3
                        style={{
                            textAlign: "center",
                            fontFamily: "BIG SHOT",
                            color: "white",
                            fontWeight: "bold",
                            wordWrap: "break-word",
                            wordBreak: "break-all",
                            marginTop: "20px",
                        }}
                    >
                        <span style={{color: "white"}}>Spend </span>
                        <span style={{color: "#B6EAFF"}}>{addCommaInNumber(upgradeCostMax.nkoConsume)} $NKO </span>
                        {upgradeCostMax.prismConsume > 0 && <span style={{color: "white"}}>and </span>}
                        {upgradeCostMax.prismConsume > 0 &&
                            <span
                                style={{color: "#B6EAFF"}}>{addCommaInNumber(upgradeCostMax.prismConsume)} Prism </span>}
                        to purchase
                        <div></div>
                        upgrade to <span style={{color: "#E9D78E"}}> LV.{maxLevel}</span> ?
                    </h3>

                    <div style={{
                        textAlign: "center",
                        fontFamily: "BIG SHOT",
                        marginTop: "20px",
                        backgroundColor: "#172937",
                        padding: '10px 10px',
                        color: "#90A6AF",
                        borderRadius: "30px"
                    }}>
                               <span><img src={exclamation} style={{
                                   height: "10px",
                                   marginRight: "5px"
                               }}/></span> own: {addCommaInNumber(nekocoin)} $NKO | {addCommaInNumber(prism)} Prism
                    </div>

                    <div style={{display: "flex", flexDirection: "row", marginTop: "20px"}}>
                        <Button
                            text={"CONFIRM"}
                            color={"yellow"}
                            longness="long"
                            onClick={() => {
                                setUpgradeToMaxModal(false);
                                upgradeToMax();
                            }}/>
                    </div>
                </div>
            </NekoModal>


            <div className="pool-card" style={{height: "100%"}}>
                <BoxBorder/>
                <Flex justify="center" vertical="column">
                    <Row>
                        <Col xs={24} sm={24} lg={12} className="modal-card">
                            <div className="modal-card-inner">
                                <CardCorner/>
                                {/*<img src={card3} width={192} alt=""/>*/}
                                <CardDetail click={false} item={focus}/>
                            </div>
                        </Col>
                        <Col
                            xs={24}
                            sm={24}
                            lg={12}
                            style={{
                                flex: 1,
                                padding: "15px 15px 21px ",
                                marginLeft: "32px",
                            }}
                        >
                            <Flex className="modal-detail" vertical="column">
                                <div
                                    className="modal-text1 margin-top-16"
                                    style={{
                                        justifyContent: "start",
                                        display: "flex",
                                        marginBottom: "16px",
                                    }}
                                >
                                    {"# " + focus?.TokenId}
                                </div>

                                <Detail title="Rarity" value={focus?.Rarity}/>
                                <Detail title="LV" value={focus?.Level}/>
                                <Detail
                                    title="Earning"
                                    value={addCommaInNumber(Number(focus?.Rewards) / (10 ** 18) + Number(focus?.MintRewards) / (10 ** 18))}
                                />
                                <Detail
                                    title="Claimed"
                                    value={addCommaInNumber(
                                        Number(focus?.ClaimedRewards) / (10 ** 18) + Number(focus?.ClaimedMintRewards) / (10 ** 18)
                                    )}
                                />
                                <Detail
                                    title="Status"
                                    value={
                                        <div style={{color: "#c1e8fd"}}>
                                            {focus?.IsStaked ? "Staked" : "Available"}
                                        </div>
                                    }
                                />
                            </Flex>
                        </Col>
                    </Row>
                    <Row justify="center">
                        <Col xs={24} sm={24} lg={18}>
                            <Flex justify="center" style={{marginBottom: "10px"}}>
                                <div className="modal-text1">{"LV" + focus?.Level}</div>
                                {maxLevel > focus?.Level && (
                                    <div className="modal-text1">{" → "}</div>
                                )}
                                {maxLevel > focus?.Level && (
                                    <div className="modal-text4">
                                        &nbsp;
                                        {"LV" + (Number(focus?.Level) + 1)}
                                    </div>
                                )}
                            </Flex>

                            <Flex justify="space-between">
                                <Flex align="center" className="modal-text5">
                                    {" "}
                                    <img
                                        src={m2}
                                        width={20}
                                        alt=""
                                        style={{marginRight: "10px"}}
                                    />
                                    ATK
                                </Flex>
                                <Flex>
                                    <div className="modal-text6">
                                        {addCommaInNumber(focus?.ATK)}
                                    </div>
                                    {maxLevel > focus?.Level && (
                                        <div className="modal-text8">&nbsp;{">"}&nbsp;</div>
                                    )}
                                    {maxLevel > focus?.Level && (
                                        <div
                                            className={
                                                upgradeCostOnce.newATK > 0
                                                    ? "modal-text7"
                                                    : "modal-text6"
                                            }
                                        >
                                            {addCommaInNumber(upgradeCostOnce.newATK)}
                                        </div>
                                    )}
                                </Flex>
                            </Flex>

                            {upgradeCostOnce.prismConsume > 0 && (
                                <Flex
                                    className="black-bg2"
                                    justify="space-between"
                                    align="center"
                                    style={{marginTop: "16px"}}
                                >
                                    <Flex align="center">
                                        <img
                                            src={purple}
                                            width={24}
                                            style={{marginRight: "10px"}}
                                            alt=""
                                        />
                                        <div className="modal-text3">Prism</div>
                                    </Flex>
                                    <Flex>
                                        <div className="modal-text3">{addCommaInNumber(prism)}</div>
                                        <div className="modal-text9">
                                            {"/" + addCommaInNumber(upgradeCostOnce.prismConsume)}
                                        </div>
                                    </Flex>
                                </Flex>
                            )}
                            {upgradeCostOnce.nkoConsume > 0 && (
                                <Flex
                                    className="black-bg3"
                                    justify="space-between"
                                    align="center"
                                    style={{marginTop: "16px"}}
                                >
                                    <Flex align="center">
                                        <img
                                            src={blue}
                                            width={24}
                                            style={{marginRight: "10px"}}
                                            alt=""
                                        />
                                        <div className="modal-text3">NPO</div>
                                    </Flex>
                                    <Flex>
                                        <div className="modal-text3">
                                            {addCommaInNumber(nekocoin)}
                                        </div>
                                        <div className="modal-text9">
                                            {"/" + addCommaInNumber(upgradeCostOnce.nkoConsume)}
                                        </div>
                                    </Flex>
                                </Flex>
                            )}
                        </Col>
                    </Row>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "12px 80px",
                        }}
                    >
                        <Button
                            text={focus?.Level === maxLevel ? "LV MAX" : "UPGRADE"}
                            color="orange"
                            longness="short"
                            style={
                                focus?.Level === maxLevel
                                    ? {filter: "grayscale(1)", marginTop: "60px"}
                                    : {marginTop: "12px"}
                            }
                            onClick={
                                focus?.Level === maxLevel ? null : () => upgradeOnce()
                            }
                        />

                        {focus?.Level !== maxLevel && (
                            <Button
                                text={"UPGRADE TO MAX"}
                                color={"orange"}
                                longness={"short"}
                                style={{marginTop: "12px"}}
                                onClick={focus?.Level === maxLevel && focus?.TokenId === upgradeCostMax.tokenId ? null : () => setUpgradeToMaxModal(true)}
                            />
                        )}
                    </div>
                </Flex>
            </div>
        </>
    );
}
