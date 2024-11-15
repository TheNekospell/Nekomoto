import BoxBorder from "@components/BoxBorder/index";
import exclamation from "@assets/exclamation.png";
import "./index.css";

import blue from "@assets/blue.png";
import luck from "@assets/luck.png";
import lineV from "@assets/line-ver.png";
import lineH from "@assets/line-hor.png";
import Button from "@components/Button/index";
import {addCommaInNumber, BACKEND, sign} from "@/interface.js";
import {useAccount} from "@starknet-react/core";
import {useEffect, useState} from "react";

export default function MintPoolCard({
                                         epoch,
                                         staticMintPool,
                                         staticTotalLuck,
                                         estMintPoolReward,
                                         mintPoolToClaim,
                                         setWaiting,
                                         setSuccess,
                                     }) {
    const {address, account} = useAccount();

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
        const {typedMessage, signature} = await sign(account);
        const result = await BACKEND.claimReward(address, typedMessage, signature);
        console.log("result: ", result);
        if (result.execution_status === "SUCCEEDED") {
            setSuccess("success:" + result.transaction_hash);
        } else {
            setSuccess("failed");
        }
    };

    return (
        <>
            <div className="pool-card" style={{height: "100%"}}>
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
                            <div style={{fontSize: "35px"}}>MINTING</div>
                            <div style={{fontSize: "25px"}}>PRIZE POOL</div>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <div
                                    className="grey-text"
                                    style={{fontSize: "11px", marginRight: "6px"}}
                                >
                                    {"30% [Emission + Revenue]"}
                                </div>
                                <img src={exclamation} style={{height: "16px"}} alt=""/>
                            </div>
                        </div>
                        <div>
                            <div className="grey-text" style={{fontSize: "15px"}}>
                                {"Epoch #" + epoch}
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
                        <div style={{display: "flex", alignItems: "center"}}>
                            <div style={{fontSize: "40px"}}>{addCommaInNumber(staticMintPool)}</div>
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
                            <div style={{display: "flex", alignItems: "center"}}>
                                <div style={{fontSize: "15px"}}>{"Overall Luck"}</div>
                                <img
                                    src={exclamation}
                                    style={{height: "16px", marginLeft: "10px"}}
                                />
                            </div>
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
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <img src={luck} style={{height: "30px"}}/>
                                    <div style={{fontSize: "20px", color: "white"}}>
                                        {addCommaInNumber(staticTotalLuck)}
                                    </div>
                                </div>
                                <img
                                    src={lineV}
                                    style={{margin: "0px 10px", height: "25px"}}
                                />
                                <div
                                    className="grey-text"
                                    style={{display: "flex", flexDirection: "column"}}
                                >
                                    <div style={{fontSize: "15px"}}>
                                        {addCommaInNumber(Number(staticMintPool) / Number(staticTotalLuck))}
                                    </div>
                                    <div style={{fontSize: "10px"}}>{"NKO per Luck"}</div>
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
                            <div style={{fontSize: "35px"}}>{addCommaInNumber(estMintPoolReward)}</div>
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
                        <div style={{fontSize: "15px"}}>{"Unclaimed Prize"}</div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: "5px",
                            }}
                        >
                            <div style={{fontSize: "20px", color: "#E9D78E"}}>
                                {addCommaInNumber(mintPoolToClaim)}
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
