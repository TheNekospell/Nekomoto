import BoxBorder from "@components/BoxBorder/index";
import exclamation from "@assets/exclamation.png";
import "./index.css";

import blue from "@assets/blue.png";
import lineV from "@assets/line-ver.png";
import lineH from "@assets/line-hor.png";
import Button from "@components/Button/index";
import {useAccount} from "@starknet-react/core";
import {useEffect, useState} from "react";

export default function StakePoolCard({
                                          setWaiting,
                                          setSuccess,
                                          staticStakePool,
                                          estStakePoolReward,
                                          stakePoolToClaim,
                                          staticEpoch,
                                      }) {
    const {address} = useAccount();

    const [timer, setTimer] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(calTimeLeft());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const calTimeLeft = () => {
        const now = new Date();
        let daysToWeekend = 6 - now.getDay();
        let hoursToWeekend = (daysToWeekend * 24) - now.getHours();
        let minutesToWeekend = 60 - now.getMinutes();
        let secondsToWeekend = 60 - now.getSeconds();

        if (secondsToWeekend === 60) {
            secondsToWeekend = 0;
            minutesToWeekend += 1;
        }

        if (minutesToWeekend === 60) {
            minutesToWeekend = 0;
            hoursToWeekend += 1;
        }

        if (hoursToWeekend === 24) {
            hoursToWeekend = 0;
            daysToWeekend += 1;
        }

        return {
            days: daysToWeekend.toString().padStart(2, "0"),
            hours: hoursToWeekend.toString().padStart(2, "0"),
            minutes: minutesToWeekend.toString().padStart(2, "0"),
            seconds: secondsToWeekend.toString().padStart(2, "0"),
        };
    };

    const claim = async () => {
        setWaiting(true);
        const {typedMessage, signature} = await BACKEND.sign(account);
        const result = await BACKEND.claimRewardOfMint(
            address,
            typedMessage,
            signature
        );
        console.log("result: ", result);
        if (result.execution_status === "SUCCEEDED") {
            setSuccess("success:" + result.transaction_hash);
        } else {
            setSuccess("failed");
        }
    };

    return (
        <>
            <div className="pool-card">
                <BoxBorder/>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>
                            <div style={{fontSize: "35px"}}>STAKING</div>
                            <div style={{fontSize: "25px"}}>REWARD POOL</div>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <div
                                    className="grey-text"
                                    style={{fontSize: "11px", marginRight: "6px"}}
                                >
                                    {"70% [Emission + Revenue]"}
                                </div>
                                <img src={exclamation} style={{height: "16px"}} alt=""/>
                            </div>
                        </div>
                        <div>
                            <div className="grey-text" style={{fontSize: "15px"}}>
                                {"Epoch #" + staticEpoch}
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                        }}
                    >
                        <div className="grey-text" style={{fontSize: "20px"}}>
                            {"Current Pool"}
                        </div>
                        <div style={{display: "flex", alignItems: "center", marginBottom: "5px"}}>
                            <div style={{fontSize: "40px"}}>{staticStakePool}</div>
                            <img src={blue} style={{height: "30px", marginLeft: "10px"}}/>
                        </div>
                        <div
                            className="grey-text"
                            style={{
                                borderRadius: "4px",
                                padding: "10px",
                                backgroundColor: "rgba(14, 39, 54, 1)",
                                alignContent: "start",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    flexDirection: "row",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "start",
                                    }}
                                >
                                    <div style={{fontSize: "12px"}}>Current Emission</div>
                                    <div
                                        style={{
                                            color: "rgba(144, 166, 175, 0.5)",
                                            fontSize: "9px",
                                        }}
                                    >
                                        staking reward
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div style={{fontSize: "15px"}}>{staticStakePool}</div>
                                        <img
                                            src={blue}
                                            style={{height: "20px", marginLeft: "15px"}}
                                        />
                                    </div>
                                </div>
                                <img
                                    src={lineV}
                                    style={{margin: "0px 10px", height: "25px"}}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "start",
                                    }}
                                >
                                    <div style={{fontSize: "12px"}}>Total Remain</div>
                                    <div
                                        style={{
                                            color: "rgba(144, 166, 175, 0.5)",
                                            fontSize: "9px",
                                        }}
                                    >
                                        staking reward
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div style={{fontSize: "15px"}}>{staticStakePool}</div>
                                        <img
                                            src={blue}
                                            style={{height: "20px", marginLeft: "15px"}}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <img src={lineH} style={{width: "100%", height: "1px"}}/>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: "5px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <div style={{fontSize: "25px"}}>{"My Est. Prize"}</div>
                                <img src={exclamation} style={{height: "12px"}} alt=""/>
                            </div>
                            <div
                                className="grey-text"
                                style={{fontSize: "11px", marginRight: "6px"}}
                            >
                                {"in current epoch"}
                            </div>
                        </div>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <img src={blue} style={{height: "30px", marginRight: "10px"}}/>
                            <div style={{fontSize: "35px"}}>{estStakePoolReward}</div>
                        </div>
                        <div>
                            <div className="grey-text" style={{fontSize: "15px"}}>
                                {"Ends in " + timer.days + ":" + timer.hours + ":" + timer.minutes + ":" + timer.seconds}
                            </div>
                        </div>
                    </div>
                    <div
                        className="grey-text"
                        style={{
                            borderRadius: "4px",
                            padding: "10px",
                            backgroundColor: "rgba(14, 39, 54, 1)",
                            alignContent: "center",
                            alignItems: "center",
                            display: "flex",
                            flexDirection: "column",
                            width: "45%",
                        }}
                    >
                        <div style={{fontSize: "15px"}}>{"Unclaimed Reward"}</div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: "5px",
                            }}
                        >
                            <div style={{fontSize: "20px", color: "#E9D78E"}}>
                                {stakePoolToClaim}
                            </div>
                            <img src={blue} style={{height: "20px", marginLeft: "10px"}}/>
                        </div>
                        <Button
                            text={
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        textAlign: "center",
                                        width: "100%",
                                        height: "100%",
                                        fontSize: "12px",
                                    }}
                                    onClick={claim}
                                >
                                    {"Claim"}
                                </div>
                            }
                            color={"yellow"}
                            longness={"long"}
                            style={{width: "100%", marginTop: "5px", height: "25px"}}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
