import "./index.css";
import Button from "@components/Button/index";
import BoxBorder from "@components/BoxBorder/index";
import inputCardLogo from "@assets/input-card-logo.png";
import { Col, Row, Flex } from "antd";
import { useAppStore } from "@stores/index";



export default function InputCard() {
  const { device } = useAppStore();
  return (
    <div className="input-card  ">
        <BoxBorder />
      <Row gutter={32}>
        <Col className="input-card-logo text-center" xs={24} sm={6}>
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
        </Col>
      </Row>
    </div>
  );
}
