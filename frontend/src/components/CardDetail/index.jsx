
import Uncommon from "@assets/Uncommon_new.png";
import Common from "@assets/Common_new.png";
import Rare from "@assets/Rare_new.png";
import Epic from "@assets/Epic_new.png";
import Legendary from "@assets/Legendary_new.png";

export default function CardDetail({item, setFocus, click = true}) {
    const rarity = (item) => {
        if (item?.Rarity === "R") {
            return Uncommon;
        } else if (item?.Rarity === "SR") {
            return Rare;
        } else if (item?.Rarity === "SSR") {
            return Epic;
        } else if (item?.Rarity === "UR") {
            return Legendary;
        } else {
            return Common;
        }
    };

    return (
        <div
            onClick={click ? () => setFocus(item) : null}
            style={{
                backgroundImage: `url(${rarity(item)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "185px",
                height: "210px",
                position: "relative",
                cursor: click ? "pointer" : "default",
            }}
        >
            <div
                style={{
                    textShadow:
                        "2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black, 1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black",
                    position: "absolute",
                    top: "10px",
                    left: "16px",
                    fontFamily: "BIG SHOT",
                    // color: "yellow",
                    fontSize: "13px",
                }}
            >
                {"Lv " + item?.Level}
            </div>

            <div
                style={{
                    textShadow:
                        "2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black, 1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black",
                    position: "absolute",
                    bottom: "10px",
                    left: "50px",
                    fontFamily: "BIG SHOT",
                    color: "white",
                    fontSize: "20px",
                }}
            >
                <div
                    style={{
                        flexDirection: "row",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <span>{item?.ATK}</span>
                </div>
            </div>

        </div>
    );
}
