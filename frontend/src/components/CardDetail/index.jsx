import ATK from "@assets/ATK.png";
import DEF from "@assets/DEF.png";
import Earth from "@assets/Earth.png";
import Fire from "@assets/Fire.png";
import SPD from "@assets/SPD.png";
import SPI from "@assets/SPI.png";
import Water from "@assets/Water.png";
import Wind from "@assets/Wind.png";
import Thunder from "@assets/Thunder.png";
import { addCommaInNumber } from "@/interface.js";

export default function CardDetail({item}) {
    
    const element = (item) => {
        if (item?.Element === "Wind") {
            return Wind
        } else if (item?.Element === "Water") {
            return Water
        } else if (item?.Element === "Earth") {
            return Earth
        } else if (item?.Element === "Fire") {
            return Fire
        } else {
            return Thunder
        }
    }
    
    return (
        <div
            style={{
                backgroundImage: `url(${element(item)})`,
                backgroundSize: "cover",
                backgroundPosition: 'center',
                width: "185px",
                height: "230px",
                position: "relative",
            }}
        >
            <div style={{
                textShadow: "2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black, 1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black",
                position: 'absolute',
                top: '17px',
                left: '19px',
                fontFamily: 'BIG SHOT',
                color: "yellow",
                fontSize: "9px",
            }}>
                {"Lv " + item?.Level}
            </div>
            <div style={{
                textShadow: "2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black, 1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black",
                position: 'absolute',
                top: '17px',
                right: '19px',
                fontFamily: 'BIG SHOT',
                color: "white",
                fontSize: "9px",
            }}>
                {"Fade=" + item?.Fade}
            </div>
            <div style={{
                textShadow: "2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black, 1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black",
                position: 'absolute',
                top: '152px',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontFamily: 'BIG SHOT',
                color: "white",
                fontSize: "10px",
            }}>
                {item?.Mana}
            </div>
            <div style={{
                textShadow: "2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black, 1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black",
                position: 'absolute',
                top: '170px',
                left: '21px',
                fontFamily: 'BIG SHOT',
                color: "white",
                fontSize: "10px",
            }}>
                <div style={{flexDirection: "row", display: "flex", alignItems: "center"}}>
                    <img src={SPI} width={18} style={{marginRight: "4px"}} alt={""}/>
                    <span>{item?.SPI}< /span>
                </div>
            </div>
            <div style={{
                textShadow: "2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black, 1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black",
                position: 'absolute',
                top: '190px',
                left: '21px',
                fontFamily: 'BIG SHOT',
                color: "white",
                fontSize: "10px",
            }}>
                <div style={{flexDirection: "row", display: "flex", alignItems: "center"}}>
                    <img src={DEF} width={18} style={{marginRight: "4px"}} alt={""}/>
                    <span>{item?.DEF}< /span>
                </div>
            </div>
            <div style={{
                textShadow: "2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black, 1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black",
                position: 'absolute',
                top: '170px',
                left: '100px',
                fontFamily: 'BIG SHOT',
                color: "white",
                fontSize: "10px",
            }}>
                <div style={{flexDirection: "row", display: "flex", alignItems: "center"}}>
                    <img src={ATK} width={18} style={{marginRight: "4px"}} alt={""}/>
                    <span>{item?.ATK}< /span>
                </div>
            </div>
            <div style={{
                textShadow: "2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black, 1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black",
                position: 'absolute',
                top: '190px',
                left: '100px',
                fontFamily: 'BIG SHOT',
                color: "white",
                fontSize: "10px",
            }}>
                <div style={{flexDirection: "row", display: "flex", alignItems: "center"}}>
                    <img src={SPD} width={18} style={{marginRight: "4px"}} alt={""}/>
                    <span>{item?.SPD}< /span>
                </div>
            </div>
            }}
        </div>
    );
}

