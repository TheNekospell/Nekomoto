import ATK from "@assets/ATK.png";

import Uncommon from "@assets/Uncommon.png";
import Common from "@assets/Common.png";
import Rare from "@assets/Rare.png";
import Epic from "@assets/Epic.png";
import Legendary from "@assets/Legendary.png";

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
                height: "230px",
                position: "relative",
                cursor: click ? "pointer" : "default",
            }}
        >
            <div
                style={{
                    textShadow:
                        "2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black, 1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black",
                    position: "absolute",
                    top: "17px",
                    left: "19px",
                    fontFamily: "BIG SHOT",
                    color: "yellow",
                    fontSize: "9px",
                }}
            >
                {"Lv " + item?.Level}
            </div>
            {/* <div
				style={{
					textShadow:
						"2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black, 1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black",
					position: "absolute",
					top: "17px",
					right: "19px",
					fontFamily: "BIG SHOT",
					color: "white",
					fontSize: "9px",
				}}
			>
				{"Fade=" + item?.Fade}
			</div> */}
            {/* <div
				style={{
					textShadow:
						"2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black, 1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black",
					position: "absolute",
					top: "152px",
					left: "50%",
					transform: "translate(-50%, -50%)",
					fontFamily: "BIG SHOT",
					color: "white",
					fontSize: "10px",
				}}
			>
				{item?.Mana}
			</div> */}
            {/* <div
				style={{
					textShadow:
						"2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black, 1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black",
					position: "absolute",
					top: "170px",
					left: "21px",
					fontFamily: "BIG SHOT",
					color: "white",
					fontSize: "10px",
				}}
			>
				<div
					style={{
						flexDirection: "row",
						display: "flex",
						alignItems: "center",
					}}
				>
					<img src={SPI} width={18} style={{ marginRight: "4px" }} alt={""} />
					<span>{item?.SPI}</span>
				</div>
			</div>
			<div
				style={{
					textShadow:
						"2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black, 1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black",
					position: "absolute",
					top: "190px",
					left: "21px",
					fontFamily: "BIG SHOT",
					color: "white",
					fontSize: "10px",
				}}
			>
				<div
					style={{
						flexDirection: "row",
						display: "flex",
						alignItems: "center",
					}}
				>
					<img src={DEF} width={18} style={{ marginRight: "4px" }} alt={""} />
					<span>{item?.DEF}</span>
				</div>
			</div> */}
            <div
                style={{
                    textShadow:
                        "2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black, 1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black",
                    position: "absolute",
                    top: "170px",
                    left: "30px",
                    fontFamily: "BIG SHOT",
                    color: "white",
                    fontSize: "10px",
                }}
            >
                <div
                    style={{
                        flexDirection: "row",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <img src={ATK} width={30} style={{marginRight: "4px"}} alt={""}/>
                    <span>{item?.ATK}</span>
                </div>
            </div>
            {/* <div
				style={{
					textShadow:
						"2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black, 1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black",
					position: "absolute",
					top: "190px",
					left: "100px",
					fontFamily: "BIG SHOT",
					color: "white",
					fontSize: "10px",
				}}
			>
				<div
					style={{
						flexDirection: "row",
						display: "flex",
						alignItems: "center",
					}}
				>
					<img src={SPD} width={18} style={{ marginRight: "4px" }} alt={""} />
					<span>{item?.SPD}</span>
				</div>
			</div> */}
        </div>
    );
}
