import "./index.css";
import logo from "@assets/logo.png";
import logoText from "@assets/text-logo.png";
import x from "@assets/x.png";
import t1 from "@assets/ti1.png";
import t2 from "@assets/ti2.png";
import t3 from "@assets/ti3.png";
import t4 from "@assets/ti4.png";
import t5 from "@assets/ti5.png";
import t6 from "@assets/ti6.png";
import t7 from "@assets/ti7.png";

import blue from "@assets/blue.png";
import user from "@assets/user.png";
import { Row, Col, Flex, Dropdown } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppStore } from "@stores/index";
export default function PCHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const homePage = pathname === "/";
  const assetsPage = pathname === "/assets";
  const detailPage = pathname.includes("detail");
  const isMobile = useAppStore().device === "mobile";
  const items = [
    {
      key: "1",
      label: (
        <Flex align="center" justify="space-between" className="menu-text">
          <img src={t5} width={24} style={{ marginRight: "6px" }} alt="" />
          <span>MY ASSETS</span>
        </Flex>
      ),
    },
    {
      key: "2",
      label: (
        <Flex align="center" justify="space-between" className="menu-text">
          <Flex align="center">
            <img src={blue} width={24} style={{ marginRight: "6px" }} alt="" />
            <span>485</span>
          </Flex>
          <img src={t6} width={20} style={{ marginLeft: "24px" }} alt="" />
        </Flex>
      ),
    },
    {
      key: "3",
      label: (
        <Flex align="center" justify="flex-start" style={{ width: "100%", textAlign:'left' }}>
          <img src={user} width={16} height={20} alt="" />
        </Flex>
      ),
    },
  ];

  return (
    <div className="pcHeader flex justify-between align-center">
      <div
        className="flex justify-between align-center"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        <img src={logo} width={48} alt="" />
        <img src={logoText} width={116} alt="" style={{ marginLeft: "12px" }} />
      </div>
      {homePage && (
        <div>
          <img src={x} width={48} alt="" />
        </div>
      )}
      {isMobile ? (
        <Dropdown menu={{ items }} placement="bottomRight">
          <img src={t7} width={18} alt="" />
        </Dropdown>
      ) : (
        !homePage && (
          <>
            <div>
              <img src={t1} width={24} alt="" onClick={()=>navigate("/assets")} />
              <img style={{ margin: "0 40px" }} src={t2} width={24} alt="" onClick={()=>navigate("/detail")}  />
              <img
                style={{ margin: "0 40px 0 0" }}
                src={t3}
                width={24}
                alt=""
                onClick={()=>navigate("/detail2")}
              />
              <img src={t4} width={24} alt="" />
            </div>
            {detailPage && (
              <Row gutter={16}>
                <Col className="header-btn2">
                  <Flex align="center" justify="space-between">
                    <img
                      src={t5}
                      width={24}
                      style={{ marginRight: "6px" }}
                      alt=""
                    />
                    <span>MY ASSETS</span>
                  </Flex>
                </Col>
                <Col className="header-btn2" style={{ margin: "0 12px" }}>
                  <Flex align="center" justify="space-between">
                    <Flex align="center">
                      <img
                        src={blue}
                        width={24}
                        style={{ marginRight: "6px" }}
                        alt=""
                      />
                      <span>485</span>
                    </Flex>
                    <img
                      src={t6}
                      width={20}
                      style={{ marginLeft: "24px" }}
                      alt=""
                    />
                  </Flex>
                </Col>
                <Col className="header-btn2">
                  <Flex
                    align="center"
                    justify="center"
                    style={{ width: "56px" }}
                  >
                    <img src={user} width={16} height={20} alt="" />
                  </Flex>
                </Col>
              </Row>
            )}
            {assetsPage && (
              <div>
                <div className="header-btn" onClick={() => navigate("/detail")}>
                  Connect Wallet
                </div>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}
