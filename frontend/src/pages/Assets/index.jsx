import "./index.css";
import InputCard from "@components/InputCard/index";
import BoxCard from "@components/BoxCard/index";
import InfoCard from "@components/InfoCard/index";
import Table from "@components/Table/index";

import PCHeader from "@components/PCHeader/index";
import logoText from "@assets/text-logo.png";
import play from "@assets/play.png";
import { Col, Row } from "antd";
const style = { background: "#0092ff", padding: "8px 0" };

export default function Assets() {
  return (
    <div className="assets padding-top-80 padding-bottom-80">
      <Row >
        <Col className="gutter-row" xs={{ flex: "100%" }} sm={{ flex: "75%" }}>
          <InputCard />
        </Col>
        <Col className="gutter-row" xs={{ flex: "100%" }} sm={{ flex: "25%" }}>
          <BoxCard title="Starter Pack"  />
        </Col>
      </Row>
      <Row  style={{marginTop:'16px', marginBottom:'16px'}}>
        <Col xs={24}>
          <InfoCard />
        </Col>
      </Row>

      <Row>
        <Table/>
      </Row>
    </div>
  );
}
