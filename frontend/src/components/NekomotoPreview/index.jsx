import {Col, Flex, Row} from "antd";
import BoxBorder from "../BoxBorder";
import CardDetail from "../CardDetail";
import RadioButton from "../RadioButton";
import "./index.css";
import Button from "@components/Button/index";

export default function NekomotoPreview({
                                            addressInfo,
                                            nekoButton,
                                            setNekoButton,
                                            focus,
                                            setFocus,
                                            unstake,
                                            unStakeAll,
                                            stake,
                                            stakeAll,
                                        }) {
    const StakeButton = ({mainTitle, subTitle, func, condition}) => {
        return (
            <>
                <div
                    style={{
                        marginRight: "18px",
                        fontSize: "12px",
                        cursor: condition ? "pointer" : "default",
                        color: "black",
                        backgroundColor: "#ede6c5",
                        borderRadius: "20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "2px 16px",
                        // filter: condition ? "" : "grayscale(0.5)",
                        opacity: condition ? 1 : 0.5,
                    }}
                    className={condition ? "stake-button" : ""}
                    onClick={condition ? func : null}
                >
                    {mainTitle}
                    {subTitle && (
                        <div style={{fontSize: "8px", margin: "0"}}>{subTitle}</div>
                    )}
                </div>
            </>
        );
    };

    return (
        <>
            <div className="pool-card" style={{height: "100%"}}>
                <BoxBorder/>
                <div className="card-title">
                    {"My Neko (" +
                        addressInfo.NekoSpiritList?.filter((item) => item.IsStaked === true)
                            .length +
                        "/" +
                        addressInfo.NekoSpiritList?.length +
                        ")"}
                </div>
                <Flex
                    style={{margin: "24px 0"}}
                    justify="space-between"
                    align="center"
                >
                    <div>
                        <RadioButton
                            text="all"
                            active={nekoButton === "all"}
                            onClick={() => setNekoButton("all")}
                        />
                        <RadioButton
                            text="UR"
                            active={nekoButton === "UR"}
                            onClick={() => setNekoButton("UR")}
                        />
                        <RadioButton
                            text="SSR"
                            active={nekoButton === "SSR"}
                            onClick={() => setNekoButton("SSR")}
                        />
                        <RadioButton
                            text="SR"
                            active={nekoButton === "SR"}
                            onClick={() => setNekoButton("SR")}
                        />
                        <RadioButton
                            text="R"
                            active={nekoButton === "R"}
                            onClick={() => setNekoButton("R")}
                        />
                        <RadioButton
                            text="N"
                            active={nekoButton === "N"}
                            onClick={() => setNekoButton("N")}
                        />
                    </div>
                </Flex>

                <Flex style={{justifyContent: "end"}}>
                    <StakeButton
                        mainTitle="Stake All"
                        subTitle="Batch"
                        func={stakeAll}
                        condition={
                            addressInfo.NekoSpiritList?.filter((item) => !item.IsStaked)
                                .length > 0
                        }
                    />
                    <StakeButton
                        mainTitle="Stake All"
                        subTitle="Successive"
                        func={stakeAll}
                        condition={
                            addressInfo.NekoSpiritList?.filter((item) => !item.IsStaked)
                                .length > 0
                        }
                    />
                    <StakeButton
                        mainTitle="Unstake All"
                        subTitle="Successive"
                        func={unStakeAll}
                        condition={
                            addressInfo.NekoSpiritList?.filter((item) => item.IsStaked)
                                .length > 0
                        }
                    />
                </Flex>

                <div style={{overflow: "auto", marginTop: "20px", height: "70%"}}>
                    <Row gutter={16}>
                        {addressInfo.NekoSpiritList?.filter((item) =>
                            nekoButton === "all"
                                ? true
                                : item.Rarity?.toLowerCase() === nekoButton.toLowerCase()
                        ).map((item, index) => {

                            return (
                                <Col span={8} key={index}>
                                    <Flex className="card-item" justify="center" vertical="column" align="center">
                                        <CardDetail item={item} setFocus={setFocus}/>
                                        <Button
                                            style={{marginTop: "10px"}}
                                            onClick={
                                                item.IsStaked
                                                    ? () => {
                                                        setFocus(item);
                                                        unstake(item.TokenId);
                                                    }
                                                    : () => {
                                                        setFocus(item);
                                                        stake(item.TokenId);
                                                    }
                                            }
                                            text={item.IsStaked ? "UNSTAKE" : "STAKE"}
                                            color={item.IsStaked ? "orange" : "yellow"}
                                            longness="short"
                                        />
                                    </Flex>
                                </Col>
                            )
                                ;
                        })}
                    </Row>
                </div>
            </div>
        </>
    );
}
