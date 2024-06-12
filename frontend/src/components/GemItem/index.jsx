import "./index.css";
import purpleGem from "@assets/purple-gem.png";
import blueGem from "@assets/blue-gem.png";
import greenGem from "@assets/green-gem.png";

import { Col, Row, Flex } from "antd";

const gemMap = {
  purple: purpleGem,
  blue: blueGem,
  green: greenGem,
};

export default function GemItem({ color, title, descLeft, descRight }) {
  return (
    <Flex className="gem-item">
      <img src={gemMap[color]} width={48} alt="" style={{alignSelf:'self-start'}} />
      <div style={{marginLeft:'16px'}}>
        <div className="gem-title">{title}</div>
        <div>
          <span className="gem-desc-left">{descLeft}</span>
          {descRight && <span className="gem-desc-right">/{descRight}</span>}
        </div>
      </div>
    </Flex>
  );
}
