import "./index.css";
import Button from "@components/Button/index";
import GemItem from "@components/GemItem/index";
import BoxBorder from "@components/BoxBorder/index";
import icon1 from "@assets/icon1.png";
import icon2 from "@assets/icon2.png";
import icon3 from "@assets/icon3.png";
import { Col, Row, Flex } from "antd";
import { useAppStore } from "@stores/index";

export default function ClaimedCard() {
  const { device } = useAppStore(); 
  return (
    <div className="input-card">
      <BoxBorder />

      <Row gutter={32}>
        <Col xs={24} sm={12}>
          <div className="card-title">Total Claimed</div>
          <div className="num-44-white" style={{ margin: "12px 0 " }}>
            1,587.7
            <span className="card-sub-title">NKO</span>
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div className="card-title">Mana</div>
          <div className="num-44-orange" style={{ margin: "12px 0" }}>
            18,484,819
          </div>
        </Col>

        {/* <Col className="input-card-logo text-center" xs={24} sm={6}>
          <img src={inputCardLogo} width={144} />
        </Col>
        <Col xs={24} sm={18}>
          <Flex gap={16} vertical>
            <Col className={`card-title ${device}-center`}>Summon</Col>
            <Col>
              <Row gutter={16} justify={{ xs: "center", sm: "start" }}>
                <Col xs={24} sm={16}>
                  <div
                    className="flex justify-between"
                    style={{ marginBottom: "12px" }}
                  >
                    <div className="input-card-text1 font-14px">Amount</div>
                    <div className="input-card-text2 font-14px">
                      <span>x5</span>
                      <span style={{ margin: "0 16px" }}>x10</span>
                      <span>x20</span>
                    </div>
                  </div>
                  <input
                    className="input-card-input"
                    placeholder="Enter Amount"
                    type="text"
                  />
                </Col>
                <Col
                  xs={24}
                  sm={6}
                  className="text-center"
                  style={{ marginTop: "32px" }}
                >
                  <Button text="Mint" color="yellow" longness="short" />
                </Col>
              </Row>
            </Col>

            <Col className={`input-card-text3 font-14px ${device}-center`}>
              500,000 Neko
            </Col>
          </Flex>
        </Col> */}
      </Row>
      <Row align="center" justify="space-between" style={{marginTop:'24px'}}>
        <Col xs={24} sm={5} style={{alignSelf:'center', margin:'16px 0'}}>
          <img src={icon1} width={40} alt="" />
          <img src={icon2} width={40} alt="" style={{margin:'0 16px'}}  />
          <img src={icon3} width={40} alt="" />
        </Col>
        <Col xs={24} sm={19}>
          <Row align="center" className="padding-wrapper">
            <Col xs={24} sm={6}>
              <GemItem color="purple" title="Prism" descLeft="x1245" />
            </Col>
            <Col xs={24} sm={10}>
              <GemItem color="green" title="Temporal Shard" descLeft="x24" />
            </Col>
            <Col xs={24} sm={8} style={{alignSelf:'center'}} className="text-center">
              <Button text="Time freeze" color="yellow" longness="long" />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
