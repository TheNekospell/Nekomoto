import BoxBorder from "@components/BoxBorder/index.jsx";
import i from "@assets/lock-blanket.png";

export default function LockBlanket({}) {

    return (
        <>
            <BoxBorder/>
            <div style={{
                backgroundColor: "#313131",
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                // paddingBottom: "20px"
            }}>
                <img src={i} style={{scale: "40%"}}/>
                <div style={{
                    fontFamily: "BIG SHOT",
                    fontSize: "20px",
                    color: "#E9D78E",
                    marginBottom: "20px",
                    // position: "relative"
                }}>CONNECT
                    WALLET TO UNLOCK
                </div>
            </div>

        </>
    )

}