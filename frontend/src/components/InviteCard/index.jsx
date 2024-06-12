import "./index.css";
import box from "@assets/box1.png";
import arrowRight from "@assets/arrow-right.png";
import arrowDown from "@assets/arrow-down.png";
import masterBox from "@assets/master-box.png";
import avatar from "@assets/avatar.png";
import { Col, Row } from "antd";
import Button from "@components/Button/index";
import BoxBorder from "@components/BoxBorder/index";
import { useAppStore } from "@stores/index";

export default function InviteCard({
  type,
  title,
  desc,
  subTitle,
  buttonText = "open",
}) {
  const isMobile = useAppStore().device === "mobile";


  return (
    <div className="invite-card">
      <BoxBorder />

      <Row justify="center" gutter>
        <Col xs={24} sm={10} className="text-center">
          <Row className="black-bg" align="center">
            <Col xs={8} sm={8} className="text-center">
              <div style={{ padding: "11px 10px" }}>
                <img src={box} width={56} />
              </div>
            </Col>
            <Col
              xs={16}
              sm={16}
              className="text-center"
              style={{ alignSelf: "center" }}
            >
              <div className="card-little-title">Adept's Chest</div>
              <div className="card-mini-desc">2946/10000</div>
            </Col>
            <div className={`${isMobile ? "" : "invite-btn-wrapper"}`}>
              <Button text={buttonText} color="yellow" longness="short" />
            </div>
          </Row>
        </Col>

        <Col
          xs={24}
          sm={2}
          className="text-center"
          style={{ alignSelf: "center", margin: "8px 0" }}
        >
          <img src={isMobile ? arrowDown : arrowRight} width={32} />
        </Col>

        <Col xs={24} sm={10} className="text-center">
          <Row className="black-bg" align="center">
            <Col xs={8} sm={8} className="text-center">
              <img src={masterBox} width={76} className="margin-right-16" />
            </Col>
            <Col
              xs={16}
              sm={16}
              className="text-center"
              style={{ alignSelf: "center" }}
            >
              <div className="card-little-title">Master’s Box</div>
              <div className="card-mini-desc">2946/10000</div>
            </Col>
            <div className={`${isMobile ? "" : "invite-btn-wrapper"}`}>
              <Button
                disabled
                text={buttonText}
                color="yellow"
                longness="short"
              />
            </div>
          </Row>
        </Col>


      </Row>

      <Row justify='center'>
          <div
            className="card-mini-title text-center"
            style={{ marginTop: isMobile ? "12px" : "48px", marginBottom:'16px' }}
          >
            Invite 5 friends to help you get the Master‘s Box (1/5)
          </div>
        </Row>
        <Row justify={'center'} gutter='8'>
            <Col xs={4} sm={3} className="friend">
              <div className="friend-avatar text-center">
                <img src={avatar} width="100%" alt="" />
              </div>
              <div className="friend-text">0x12...34</div>
            </Col>
            <Col xs={4} sm={3} className="friend">
              <div className="friend-avatar text-center">
                +
              </div>
              <div className="friend-text2">Waiting</div>
            </Col>
            <Col xs={4} sm={3} className="friend">
              <div className="friend-avatar text-center">
                +
              </div>
              <div className="friend-text2">Waiting</div>
            </Col>
            <Col xs={4} sm={3} className="friend">
              <div className="friend-avatar text-center">
                +
              </div>
              <div className="friend-text2">Waiting</div>
            </Col>
            <Col xs={4} sm={3} className="friend">
              <div className="friend-avatar text-center">
                +
              </div>
              <div className="friend-text2">Waiting</div>
            </Col>
        </Row>

    </div>
  );
}
