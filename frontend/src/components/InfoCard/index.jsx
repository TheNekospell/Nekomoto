import "./index.css";
import box from "@assets/box1.png";
import { Col, Row } from "antd";
import Button from "@components/Button/index";
import BoxBorder from "@components/BoxBorder/index";

export default function InfoCard({ title }) {
  return (
    <div className="info-card">
      <BoxBorder />

      <Row justify="center" align='center'>
        <Col xs={24} sm={12}>
          <div className="card-sub-title">Total Rewards</div>
          <div className="num-60" style={{margin:'16px 0 8px'}}>
            556,645,587.79
            <span className="card-sub-title">NKO</span>
          </div>
          <div className="grey-text">121,849.71916930338 USD</div>
        </Col>
        <Col xs={24} sm={12} style={{alignSelf:'center'}}>
          <Row gutter={[16,16]} className="text-center">
            <Col xs={12} sm={7}>
              <div className="info-item">
                <div className="card-sub-title">0.0002189</div>
                <div className="grey-text" style={{marginTop:'12px'}}>Nko Price</div>
              </div>
            </Col>
            <Col xs={12} sm={7}>
              <div className="info-item">
                <div className="card-sub-title">0.0002189</div>
                <div className="grey-text" style={{marginTop:'12px'}}>Nko Price</div>
              </div>
            </Col>
            <Col xs={24} sm={7}>
              <div className="info-item">
                <div className="card-sub-title">0.0002189</div>
                <div className="grey-text" style={{marginTop:'12px'}}>Nko Price</div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
