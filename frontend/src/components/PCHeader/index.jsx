import "./index.css";
import logo from "@assets/logo.png";
import logoText from "@assets/text-logo.png";
import x from "@assets/x.png";

export default function PCHeader({ text, type, size }) {
  return (
    <div className="pcHeader flex justify-between align-center">
      <div className="flex justify-between align-center">
        <img src={logo} width={48} alt="" />
        <img src={logoText} width={116} alt="" style={{ marginLeft: "12px" }} />
      </div>
      <div>
        <img src={x} width={48} alt="" />
      </div>
    </div>
  );
}
