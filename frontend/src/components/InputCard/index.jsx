import "./index.css";
import Button from "@components/Button/index";
import {Col, Row} from "antd";
import {useState} from "react";
import {useAccount} from "@starknet-react/core";
import {
    addCommaInNumber,
    BACKEND,
    NEKOCOIN_ADDRESS,
    nekocoinContract,
    NEKOMOTO_ADDRESS,
    sign,
    waitTx,
} from "@/interface.js";
import {cairo, CallData} from "starknet";
import NekoModal from "@components/Modal/index.jsx";
import {useNavigate} from "react-router-dom";
import BigNumber from "bignumber.js";

import mintPagePic from "@assets/mint-page.png";
import mintPagePic2 from "@assets/mint-page2.png";
import exclamation from "@assets/exclamation.png";
import {useContractData} from "@components/Contract/index.jsx";
import BoxBorder from "@components/BoxBorder/index.jsx";

export default function InputCard() {
    const {account, address, status, chainId, isConnected} = useAccount();
    // const [inputValue, setInputValue] = useState("Enter your amount");
    const [visible, setVisible] = useState(false);
    const [buyScroll, setBuyScroll] = useState(false);
    const [buyScrollCount, setBuyScrollCount] = useState(0);
    const [text, setText] = useState("");
    const navigate = useNavigate();

    const {scroll, nekocoin, prism, refreshContractData} = useContractData();

    const buyCoin = async (count) => {

        const balance = await nekocoinContract.balance_of(address);
        // console.log("balance: ", balance);

        const allowance = await nekocoinContract.allowance(
            account.address,
            NEKOMOTO_ADDRESS
        );
        // console.log("allowance: ", allowance);

        if (new BigNumber(balance).lt(new BigNumber(count * 25000 * 10 ** 18))) {
            setText("Insufficient balance");
            return;
        }

        setText("Please sign the transactions and wait for seconds...");

        if (new BigNumber(allowance).lt(new BigNumber(count * 25000 * 10 ** 18))) {
            const approve = await account.execute([
                {
                    contractAddress: NEKOCOIN_ADDRESS,
                    entrypoint: "approve",
                    calldata: CallData.compile({
                        spender: NEKOMOTO_ADDRESS,
                        amount: cairo.uint256(BigInt(count) * 25000n * 10n ** 18n),
                    }),
                },
            ]);
            console.log("approve: ", approve);
            const result = await waitTx(approve.transaction_hash);
            console.log("approveResult: ", result);
            if (result.execution_status !== "SUCCEEDED") {
                setText("failed");
            }
            refreshContractData();
        }

        const buyScroll = await account.execute([
            {
                contractAddress: NEKOMOTO_ADDRESS,
                entrypoint: "buy_coin",
                calldata: CallData.compile({
                    amount: cairo.uint256(BigInt(count)),
                }),
            }
        ]);
        console.log("buyScroll: ", buyScroll);
        const result = await waitTx(buyScroll.transaction_hash);
        console.log("buyScrollResult: ", result);
        if (result.execution_status === "SUCCEEDED") {
            setText("");
            setBuyScroll(true);
        } else {
            setText("failed");
        }
        refreshContractData();
    }


    const mint = async (count) => {
        // console.log("count: ", count);
        if (!address) {
            return;
        }

        // console.log("scroll: ", scroll, "count: ", count);
        if (Number(scroll) < count) {
            setBuyScrollCount(count - Number(scroll));
            return;
        }

        setVisible(true);

        const {typedMessage, signature} = await sign(account);
        // console.log("typedMessage: ", typedMessage);
        // console.log("signature: ", signature);
        // return

        const result = await BACKEND.summonBox(
            address,
            count,
            typedMessage,
            signature
        );
        console.log("result: ", result);
        setText("Waiting for transaction: " + result.data);
        if (result.success) {
            const summonResult = await waitTx(result.data);
            console.log("summonResult: ", summonResult);
            setText("Success: " + result.data);
        } else {
            setText("Something went wrong: " + result.message);
        }
        refreshContractData();
    };

    const MintButton = ({count}) => {
        return (
            <>
                <Button
                    onClick={() => mint(count)}
                    text={
                        <div
                            style={{
                                display: "flex",
                                alignContent: "center",
                                textAlign: "center",
                                flexDirection: "column",
                                width: "100%",
                                height: "15px",
                                // marginTop: "5px",
                            }}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    height: "70%",
                                    fontSize: "13px",
                                    marginTop: "-2px",
                                    marginBottom: "3px",
                                }}
                            >
                                {"SUMMON X " + count}
                            </div>
                            <div style={{height: "30%", color: "#636363", fontSize: "9px"}}>
                                {"MINT"}
                            </div>
                        </div>
                    }
                    color="yellow"
                    longness="long"
                    style={{width: "100%", height: "100%", marginTop: "10px"}}
                />
            </>
        )
    }

    return (
        <div style={{height: "100%"}}>
            <NekoModal
                open={visible}
                centered={true}
                footer={null}
                maskClosable={true}
                onCancel={() => {
                    setVisible(false);
                    setText("");
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
                    <h2
                        style={{
                            textAlign: "center",
                            color: "#01dce4",
                            fontFamily: "BIG SHOT",
                            fontWeight: "bold",
                            wordWrap: "break-word",
                            wordBreak: "break-all",
                        }}
                    >
                        {text !== "" ? text : "Please sign in your wallet and wait..."}
                    </h2>

                    {text && text !== "Insufficient balance" && (
                        <Button
                            style={{
                                marginTop: "20px",
                                fontSize: "15px",
                                flexDirection: "row",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            text={"Go Check"}
                            color={"yellow"}
                            longness="long"
                            onClick={() => navigate("/detail2")}
                        />
                    )}
                </div>
            </NekoModal>

            <NekoModal
                open={buyScrollCount > 0}
                centered={true}
                footer={null}
                maskClosable={true}
                onCancel={() => {
                    setBuyScroll(false);
                    setBuyScrollCount(0);
                    setText("");
                    refreshContractData();
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
                    {buyScroll === false && text === "" && (
                        <>
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
                                    Not Enough <span style={{color: "#E9D78E"}}> [Summon Scroll]</span>
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
                                <span style={{color: "white"}}>Spent </span>
                                <span style={{color: "#B6EAFF"}}><u>{addCommaInNumber(buyScrollCount * 25000)}</u> $NKO </span>
                                to purchase
                                <div></div>
                                <span style={{color: "#E9D78E"}}> <u>{buyScrollCount}</u> x [Summon Scroll]</span> ?
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
                               }}/></span> own: {addCommaInNumber(nekocoin)} $NKO | {scroll} Scroll
                            </div>

                            <div style={{display: "flex", flexDirection: "row", marginTop: "20px"}}>
                                <Button
                                    text={"CANCEL"}
                                    color={"blue"}
                                    longness="long"
                                    style={{filter: "greyscale(100%)"}}
                                    onClick={() => {
                                        setBuyScroll(false);
                                        setBuyScrollCount(0);
                                    }}/>
                                <Button
                                    style={{marginLeft: "30px"}}
                                    text={"CONFIRM"}
                                    color={"yellow"}
                                    longness="long"
                                    onClick={() =>
                                        buyCoin(buyScrollCount)
                                    }/>
                            </div>
                        </>
                    )}

                    {buyScroll === false && text !== "" && (
                        <>
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
                                <h2
                                    style={{
                                        textAlign: "center",
                                        color: "#01dce4",
                                        fontFamily: "BIG SHOT",
                                        fontWeight: "bold",
                                        wordWrap: "break-word",
                                        wordBreak: "break-all",
                                    }}
                                >
                                    {text !== "" ? text : "Please sign in your wallet and wait..."}
                                </h2>
                            </div>
                        </>
                    )}

                    {buyScroll === true && (
                        <>
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
                                    Purchase Success!
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
                                Receive
                                <span style={{color: "#E9D78E"}}> <u>{buyScrollCount}</u> x [Summon Scroll]</span> !
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
                              }}/></span> own: {addCommaInNumber(nekocoin)} $NKO
                                | {scroll} Scroll
                            </div>

                            <div style={{display: "flex", flexDirection: "row", marginTop: "20px"}}>
                                <Button
                                    text={"CONFIRM"}
                                    color={"yellow"}
                                    longness="long"
                                    onClick={() => {
                                        setBuyScroll(false);
                                        setBuyScrollCount(0);
                                        setText("");
                                        refreshContractData();
                                    }}/>
                            </div>
                        </>
                    )}
                </div>
            </NekoModal>

            <div className="input-card">
                <BoxBorder/>
                <Row gutter={32} style={{justifyContent: "space-between"}}>
                    <Col className="text-center" style={{width: "50%"}}>
                        <Row>
                            <div
                                style={{
                                    fontFamily: "BIG SHOT",
                                    color: "white",
                                    fontSize: "20px",
                                    marginLeft: "25px",
                                    marginBottom: "10px",
                                }}
                            >
                                {"Summon"}
                            </div>
                            <span>
								<img
                                    src={exclamation}
                                    style={{height: "20px", marginLeft: "10px"}}
                                />
							</span>
                        </Row>
                        <img src={mintPagePic} width={"100%"}/>
                    </Col>
                    <Col style={{width: "50%", paddingRight: "16px", justifyItems: "flex-end"}}>
                        <Col style={{justifyContent: "flex-end", display: "flex"}}>
                            <img src={mintPagePic2} width={"70%"}/>
                        </Col>
                        <Col
                            className="text-center"
                            style={{
                                justifyContent: "flex-end",
                                display: "flex",
                                flexDirection: "column",
                                marginTop: "16px",
                                width: "80%"
                            }}
                        >
                            <MintButton count={1}/>
                            <MintButton count={10}/>
                            <MintButton count={20}/>
                        </Col>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
