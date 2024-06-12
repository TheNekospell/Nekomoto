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
      <Row  gutter={16}>
        <Col style={{marginTop:'16px'}} className="gutter-row"  xs={24}  sm={24}  lg={18}>
          <InputCard />
        </Col>
        <Col style={{marginTop:'16px'}} className="gutter-row" xs={24}  sm={24}  lg={6}>
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
