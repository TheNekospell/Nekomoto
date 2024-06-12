import topLeft from "@assets/top-left.png";
import topRight from "@assets/top-right.png";
import bottomLeft from "@assets/bottom-left.png";
import bottomRight from "@assets/bottom-right.png";
import "./index.css";

export default function CardCorner() {
  return (
    <>
      <img className="coner-top-left" width={24} src={topLeft} alt="" />
      <img className="coner-top-right" width={24} src={topRight} alt="" />
      <img className="coner-bottom-left" width={24} src={bottomLeft} alt="" />
      <img className="coner-bottom-right" width={24} src={bottomRight} alt="" />
    </>
  );
}
