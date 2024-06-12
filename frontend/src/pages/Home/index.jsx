import "./index.css";
import Button from "@components/Button/index";
import PCHeader from "@components/PCHeader/index";
import logoText from "@assets/text-logo.png";
import play from "@assets/play.png";
import { useNavigate } from "react-router-dom";


export default function Home() {
    const navigate = useNavigate();
  return (
    <div className="home">
      <div className="home-content flex  flex-column justify-center align-center">
        <img src={logoText} width='64%' alt="" />
        <div className="home-text">
        A fully onchain card game combining RPG elements with <br /> collection, nurturing, and strategy mechanics.
        </div>
        <div className="home-btn" onClick={()=>navigate('/wallet')}>
           <img width={12} src={play} alt="" style={{marginRight:'16px'}} /> Paly
        </div>
      </div>
    </div>
  );
}
