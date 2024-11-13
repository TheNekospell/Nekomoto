import {Col, Flex, Row} from "antd";
import CardCorner from "../CardCorner";
import CardDetail from "../CardDetail";
import {addCommaInNumber} from "@/interface.js";
import m2 from "@assets/modal-icon2.png";
import Button from "../Button";
import BoxBorder from "../BoxBorder";
import {useMemo} from "react";

import blue from "@assets/blue.png";
import purple from "@assets/purple.png";

export default function NekoDetail({focus, prism, nekocoin}) {




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

    const calUpgrade = (currentATK, currentLevel) => {
        let atkGrowth;
        let nkoCoefficient;
        let prismConsume;
        switch (currentLevel) {
            case 0:
                atkGrowth = 0;
                nkoCoefficient = 0;
                prismConsume = 0;
                break;
            case 1:
                atkGrowth = 0.15;
                nkoCoefficient = 0.15;
                prismConsume = 0;
                break;
            case 2:
                atkGrowth = 0.25;
                nkoCoefficient = 0.2;
                prismConsume = 1;
                break;
            case 3:
                atkGrowth = 0.18;
                nkoCoefficient = 0.15;
                prismConsume = 0;
                break;
            case 4:
                atkGrowth = 0.18;
                nkoCoefficient = 0.15;
                prismConsume = 0;
                break;
            case 5:
                atkGrowth = 0.25;
                nkoCoefficient = 0.2;
                prismConsume = 3;
                break;
            case 6:
                atkGrowth = 0.2;
                nkoCoefficient = 0.18;
                prismConsume = 0;
                break;
            case 7:
                atkGrowth = 0.2;
                nkoCoefficient = 0.18;
                prismConsume = 0;
                break;
            case 8:
                atkGrowth = 0.35;
                nkoCoefficient = 0.2;
                prismConsume = 6;
                break;
            case 9:
                atkGrowth = 0.22;
                nkoCoefficient = 0.2;
                prismConsume = 0;
                break;
            case 10:
                atkGrowth = 0.22;
                nkoCoefficient = 0.2;
                prismConsume = 0;
                break;
            case 11:
                atkGrowth = 0.4;
                nkoCoefficient = 0.3;
                prismConsume = 9;
                break;
            case 12:
                atkGrowth = 0.25;
                nkoCoefficient = 0.22;
                prismConsume = 0;
                break;
            case 13:
                atkGrowth = 0.25;
                nkoCoefficient = 0.22;
                prismConsume = 0;
                break;
            case 14:
                atkGrowth = 0.5;
                nkoCoefficient = 0.35;
                prismConsume = 12;
                break;
            default:
                atkGrowth = 0;
                nkoCoefficient = 0;
                prismConsume = 0;
        }

        const newATK = currentATK * (1 + atkGrowth);
        const nkoConsume = newATK / nkoCoefficient;

        return {
            nkoConsume: nkoConsume,
            prismConsume: prismConsume,
            newATK: newATK,
        };
    };

    const upgradeConsume = useMemo(
        () => calUpgrade(focus.ATK, focus.Level),
        [focus.ATK, focus.Level]
    );

    const calMaxLevel = (rarity) => {
        let maxLevel;
        switch (rarity) {
            case "N":
                maxLevel = 3;
            case "R":
                maxLevel = 6;
            case "SR":
                maxLevel = 9;
            case "SSR":
                maxLevel = 12;
            case "UR":
                maxLevel = 15;
        }
        return maxLevel;
    };

    const maxLevel = useMemo(() => calMaxLevel(focus.Rarity), [focus.Rarity]);

    return (
        <>
            <div className="pool-card" style={{height: "100%"}}>
                <BoxBorder/>
                <Flex justify="center" vertical="column">
                    <Row>
                        <Col xs={24} sm={24} lg={12} className="modal-card">
                            <div className="modal-card-inner">
                                <CardCorner/>
                                {/*<img src={card3} width={192} alt=""/>*/}
                                <CardDetail item={focus}/>
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
                                    value={addCommaInNumber(Number(focus?.Rewards) + Number(focus?.MintRewards))}
                                />
                                <Detail
                                    title="Claimed"
                                    value={addCommaInNumber(
                                        Number(focus?.ClaimedRewards) + Number(focus?.ClaimedMintRewards)
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
                                {/*<Flex justify="space-between" className="margin-bottom-16">*/}
                                {/*    <div className="modal-text2">APR</div>*/}
                                {/*    <div className="modal-text3">/</div>*/}
                                {/*</Flex>*/}
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
                                                upgradeConsume.newATK > 0
                                                    ? "modal-text7"
                                                    : "modal-text6"
                                            }
                                        >
                                            {addCommaInNumber(upgradeConsume.newATK)}
                                        </div>
                                    )}
                                </Flex>
                            </Flex>

                            {upgradeConsume.prismConsume > 0 && (
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
                                            {"/" + addCommaInNumber(upgradeConsume.prismConsume)}
                                        </div>
                                    </Flex>
                                </Flex>
                            )}
                            {upgradeConsume.nkoConsume > 0 && (
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
                                            {"/" + addCommaInNumber(upgradeConsume.nkoConsume)}
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
                            padding: "24px 80px",
                        }}
                    >
                        <Button
                            text={focus?.Level == maxLevel ? "LV MAX" : "UPGRADE"}
                            color="orange"
                            longness="short"
                            style={
                                focus?.Level == maxLevel
                                    ? {filter: "grayscale(1)", marginTop: "24px"}
                                    : {marginTop: "24px"}
                            }
                            onClick={
                                focus?.Level == maxLevel ? null : () => upgrade(focus?.TokenId)
                            }
                        />

                        <Button
                            text={"UPGRADE TO MAX"}
                            color={"orange"}
                            longness={"short"}
                            style={{marginTop: "24px"}}
                            onClick={() => unstake(focus?.TokenId)}
                        />
                    </div>
                </Flex>
            </div>
        </>
    );
}
