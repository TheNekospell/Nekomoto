import luckLogo from "@assets/luck-logo.png";
import BoxBorder from "../BoxBorder";
import luck from "@assets/luck.png";
import exclamation from "@assets/exclamation.png";
import {useAccount} from "@starknet-react/core";
import LockBlanket from "@components/LockBlanket/index.jsx";

export default function LuckCard({myLuck, mySSR, myUR}) {

    const {address} = useAccount();

    return (
        <>
            {address ? (
                <div
                    style={{
                        backgroundColor: "#1d3344",
                        position: "relative",
                        padding: "10px 20px",
                        height: "100%",
                        fontFamily: "BIG SHOT",
                    }}
                >
                    <BoxBorder/>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            height: "100%",
                            alignContent: "center",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <div
                            className="grey-text"
                            style={{
                                borderRadius: "4px",
                                padding: "10px",
                                backgroundColor: "rgba(14, 39, 54, 1)",
                                display: "flex",
                                flexDirection: "column",
                                alignContent: "center",
                                alignItems: "center",
                                height: "100%",
                                width: "30%",
                            }}
                        >
                            <div style={{fontSize: "25px"}}>{"SSR"}</div>
                            <div style={{height: "100%"}}>
                                <img
                                    src={luckLogo}
                                    style={{
                                        transform: "translateY(-5%)",
                                        scale: "130%",
                                        height: "70px",
                                    }}
                                />
                            </div>
                            <div style={{display: "flex", flexDirection: "row"}}>
                                <img src={luck} style={{height: "10px"}}/>
                                <div>{"1 x ("}</div>
                                <div style={{color: "white"}}>{mySSR}</div>
                                <div>{" )"}</div>
                            </div>
                        </div>

                        <div className="grey-text" style={{margin: "0 10px"}}>
                            {"+"}
                        </div>

                        <div
                            className="grey-text"
                            style={{
                                borderRadius: "4px",
                                padding: "10px",
                                backgroundColor: "rgba(14, 39, 54, 1)",
                                display: "flex",
                                flexDirection: "column",
                                alignContent: "center",
                                alignItems: "center",
                                height: "100%",
                                width: "30%",
                            }}
                        >
                            <div style={{fontSize: "25px"}}>{"UR"}</div>
                            <div style={{height: "100%"}}>
                                <img
                                    src={luckLogo}
                                    style={{
                                        transform: "translateY(-5%)",
                                        scale: "130%",
                                        height: "70px",
                                    }}
                                />
                            </div>
                            <div style={{display: "flex", flexDirection: "row"}}>
                                <img src={luck} style={{height: "10px"}}/>
                                <div>{"3 x ("}</div>
                                <div style={{color: "white"}}>{myUR}</div>
                                <div>{" )"}</div>
                            </div>
                        </div>

                        <div className="grey-text" style={{margin: "0 10px"}}>
                            {"="}
                        </div>

                        <div
                            style={{
                                width: "30%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                // flex:"0 auto"
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    height: "20%",
                                }}
                            >
                                <div style={{color: "white"}}>{"MY LUCK"}</div>
                                <img
                                    src={exclamation}
                                    style={{height: "16px", marginLeft: "10px"}}
                                />
                            </div>
                            <div className="grey-text" style={{height: "20%"}}>
                                {"in current epoch"}
                            </div>
                            <div
                                className="grey-text"
                                style={{
                                    borderRadius: "4px",
                                    padding: "10px",
                                    backgroundColor: "rgba(14, 39, 54, 1)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignContent: "center",
                                    alignItems: "center",
                                    height: "60%",
                                    width: "100%",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <img src={luck} style={{height: "30px"}}/>
                                    <div
                                        style={{
                                            fontSize: "30px",
                                            color: "white",
                                            marginLeft: "10px",
                                        }}
                                    >
                                        {myLuck}
                                    </div>
                                </div>
                                <div>{"Reset in Every Epoch"}</div>
                            </div>
                        </div>
                    </div>

                </div>
            ) : (
                <LockBlanket/>
            )}
        </>
    );
}
