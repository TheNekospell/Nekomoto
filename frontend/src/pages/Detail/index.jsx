import "./index.css";
import ClaimedCard from "@components/ClaimedCard/index";
import BoxCard from "@components/BoxCard/index";
import InviteCard from "@components/InviteCard/index";
import Button from "@components/Button/index";
import EmptyCard from "@components/EmptyCard/index";
import GemItem from "@components/GemItem/index";
import BoxBorder from "@components/BoxBorder/index";
import RadioButton from "@components/RadioButton/index";
import NekoModal from "@components/Modal/index";
import CardCorner from "@components/CardCorner/index";

import exclamation from "@assets/exclamation.png";
import copy from "@assets/copy.png";
import card1 from "@assets/card1.png";
import card2 from "@assets/card2.png";
import card3 from "@assets/card3.png";
import card4 from "@assets/card4.png";
import card5 from "@assets/card5.png";
import m1 from "@assets/modal-icon1.png";
import m2 from "@assets/modal-icon2.png";
import m3 from "@assets/modal-icon3.png";
import m4 from "@assets/modal-icon4.png";
import m5 from "@assets/modal-icon5.png";
import purple from "@assets/purple.png";
import blue from "@assets/blue.png";
import adept1 from "@assets/adept1.png";
import adept2 from "@assets/adept2.png";
import adept3 from "@assets/adept3.png";



import arrowLeft from "@assets/arrow-left.png";
import { useAppStore } from "@stores/index";
import { useState } from "react";

import { Col, Row, Flex } from "antd";

export default function Detail() {
  const isMobile = useAppStore().device === "mobile";
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="detail padding-top-80 padding-bottom-80">
      <Flex className="back-btn" align="center">
        <img
          src={arrowLeft}
          width={16}
          alt=""
          style={{ marginRight: "12px" }}
        />
        My Assets
      </Flex>
      <Row gutter={{ xs: 0, sm: 16 }}>
        <Col xs={24} sm={12}>
          <InviteCard />
        </Col>
        <Col xs={24} sm={12}>
          <ClaimedCard />
        </Col>
      </Row>
      <Row gutter={{ xs: 0, sm: 16 }}>
        <Col xs={24} sm={6} className="margin-top-16">
          <BoxCard
            onButtonClick={() => setIsModalOpen(true)}
            title="Adept’s Chest"
            buttonText="Open"
            desc="Stake at least one Level 13 Neko NFT to obtain an Adept's Chest."
          />
        </Col>
        <Col xs={24} sm={18} className="margin-top-16">
          <ClaimedCard />
        </Col>
      </Row>
      <Row gutter={{ xs: 0, sm: 16 }}>
        <Col xs={24} sm={6} className="margin-top-16">
          <BoxCard
            type="gem"
            title="58694 NKO"
            subTitle="Earnings"
            buttonText="Claim"
          />
        </Col>
        <Col xs={24} sm={9} className="margin-top-16">
          <EmptyCard>
            <Row>
              <Col xs={24}>
                <Flex justify="space-between">
                  <div>
                    <Flex align="center" className="card-little-title">
                      Ascend
                      <img
                        width={14}
                        style={{ marginLeft: "8px" }}
                        src={exclamation}
                        alt=""
                      />
                    </Flex>
                  </div>
                  <div className="card-little-title">0%</div>
                </Flex>
              </Col>
              <Col xs={24} style={{ marginTop: "8px" }}>
                <div className="grey-text-little">Global mana bonus</div>
              </Col>
            </Row>
            <Row style={{ flex: 1 }}>
              <Col xs={12} style={{ marginTop: "24px" }}>
                <GemItem
                  color="purple"
                  title="Prism"
                  descLeft="x1245"
                  descRight="9"
                />
              </Col>
              <Col xs={12} style={{ marginTop: "24px" }}>
                <GemItem
                  color="blue"
                  title="Neko"
                  descLeft="x1245"
                  descRight="9"
                />
              </Col>
              <Col
                xs={24}
                className="text-center"
                style={{ alignSelf: "flex-end", marginTop: "24px" }}
              >
                <Button text="UP TO 2%" color="yellow" longness="short" />
              </Col>
            </Row>
          </EmptyCard>
        </Col>
        <Col xs={24} sm={9} className="margin-top-16">
          <EmptyCard>
            <Row>
              <Col xs={24}>
                <div className="card-little-title">Referral Rewards (0)</div>
              </Col>

              <Col xs={24} style={{ margin: "8px 0 18px" }}>
                <Flex align="center" className="blue-text">
                  neko-89765432q
                  <img
                    width={14}
                    style={{ marginLeft: "8px" }}
                    src={copy}
                    alt=""
                  />
                </Flex>
              </Col>
            </Row>
            <Flex justify="space-between" className="card-mini-title">
              <div>Claimed</div>
              <div>0</div>
            </Flex>
            <Flex justify="space-between" className="card-mini-title">
              <div>Available</div>
              <div>0</div>
            </Flex>
            <Flex justify="space-between" className="card-mini-title">
              <div>Locked</div>
              <div>0</div>
            </Flex>
            <Row style={{ flex: 1 }}>
              <Col
                xs={24}
                className="text-center"
                style={{ alignSelf: "flex-end", marginTop: "24px" }}
              >
                <Button text="Claim" color="yellow" longness="short" />
              </Col>
            </Row>
          </EmptyCard>
        </Col>
      </Row>
      <div className="cards-wrapper margin-top-16">
        <BoxBorder color="#0E222F" />
        <div className="card-title">My Neko (4/32)</div>
        <Flex
          style={{ margin: "24px 0" }}
          justify="space-between"
          align="center"
        >
          {isMobile ? (
            ""
          ) : (
            <div>
              <RadioButton text="all" active />
              <RadioButton text="LEGENDARY" />
              <RadioButton text="EPIC" />
              <RadioButton text="RARE" />
              <RadioButton text="UNCOMMON" />
              <RadioButton text="COMMON" />
            </div>
          )}

          <Flex>
            <div className="card-desc-title" style={{ marginRight: "24px" }}>
              Stake All
            </div>
            <div className="card-desc-title">UnStake All</div>
          </Flex>
        </Flex>

        <Row gutter={16}>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card1} alt="" />
              <Button text="Staking" color="yellow" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card2} alt="" />
              <Button text="Staking" color="yellow" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card3} alt="" />
              <Button text="LV UP" color="orange" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card4} alt="" />
              <Button text="Staking" color="yellow" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card5} alt="" />
              <Button text="UNSTAKE" color="blue" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card1} alt="" />
              <Button text="Staking" color="yellow" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card2} alt="" />
              <Button text="Staking" color="yellow" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card3} alt="" />
              <Button text="LV UP" color="orange" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card4} alt="" />
              <Button text="Staking" color="yellow" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card5} alt="" />
              <Button text="UNSTAKE" color="blue" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card1} alt="" />
              <Button text="Staking" color="yellow" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card2} alt="" />
              <Button text="Staking" color="yellow" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card3} alt="" />
              <Button text="LV UP" color="orange" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card4} alt="" />
              <Button text="Staking" color="yellow" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card5} alt="" />
              <Button text="UNSTAKE" color="blue" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card1} alt="" />
              <Button text="Staking" color="yellow" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card2} alt="" />
              <Button text="Staking" color="yellow" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card3} alt="" />
              <Button text="LV UP" color="orange" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card4} alt="" />
              <Button text="Staking" color="yellow" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card5} alt="" />
              <Button text="UNSTAKE" color="blue" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card1} alt="" />
              <Button text="Staking" color="yellow" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card2} alt="" />
              <Button text="Staking" color="yellow" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card3} alt="" />
              <Button text="LV UP" color="orange" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card4} alt="" />
              <Button text="Staking" color="yellow" longness="short" />
            </Flex>
          </Col>
          <Col xs={12} sm={4}>
            <Flex className="card-item" justify="center" vertical="column">
              <img src={card5} alt="" />
              <Button text="UNSTAKE" color="blue" longness="short" />
            </Flex>
          </Col>
        </Row>
      </div>

      <NekoModal
        title="Starter Pack"
        // isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Flex justify="center" vertical="column">
          <div className="modal-card">
            <div className="modal-card-inner">
              <CardCorner />
              <img src={card3} width={192} alt="" />
            </div>
          </div>
          <Button
            text="GO CHECK"
            color="yellow"
            longness="short"
            style={{ marginTop: "48px" }}
          />
        </Flex>
      </NekoModal>

      <NekoModal
        title="Details"
        // isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Flex justify="center" vertical="column">
          <Row>
            <Col xs={24} sm={12} className="modal-card">
              <div className="modal-card-inner">
                <CardCorner />
                <img src={card3} width={192} alt="" />
              </div>
            </Col>
            <Col
              xs={24}
              sm={12}
              style={{
                flex: 1,
                padding: "15px 15px 21px ",
                marginLeft: "32px",
              }}
            >
              <Flex className="modal-detail" vertical="column">
                <div className="modal-text1 margin-top-16">#9871</div>
                <Flex justify="space-between" className="margin-bottom-16">
                  <div className="modal-text2">Earning</div>
                  <div className="modal-text3">/</div>
                </Flex>
                <Flex justify="space-between" className="margin-bottom-16">
                  <div className="modal-text2">Claimed</div>
                  <div className="modal-text3">/</div>
                </Flex>
                <Flex justify="space-between" className="margin-bottom-16">
                  <div className="modal-text2">APR</div>
                  <div className="modal-text3">/</div>
                </Flex>
                <Flex justify="space-between" className="margin-bottom-16">
                  <div className="modal-text2">Status</div>
                  <div className="modal-text3">Available</div>
                </Flex>
                <Flex justify="space-between" className="margin-bottom-16">
                  <div className="modal-text2">LV</div>
                  <div className="modal-text3">1</div>
                </Flex>
              </Flex>
            </Col>
          </Row>

          <Button
            text="Staking"
            color="yellow"
            longness="short"
            style={{ marginTop: "48px" }}
          />
        </Flex>
      </NekoModal>

      <NekoModal
        title="Details - LV UP"
        // isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Flex justify="center" vertical="column">
          <Row>
            <Col xs={24} sm={12} className="modal-card">
              <div className="modal-card-inner">
                <CardCorner />
                <img src={card3} width={192} alt="" />
              </div>
            </Col>
            <Col
              xs={24}
              sm={12}
              style={{
                flex: 1,
                padding: "15px 15px 21px ",
                marginLeft: "32px",
              }}
            >
              <Flex className="modal-detail" vertical="column">
                <div className="modal-text1 margin-top-16">#9871</div>
                <Flex justify="space-between" className="margin-bottom-16">
                  <div className="modal-text2">Earning</div>
                  <div className="modal-text3">/</div>
                </Flex>
                <Flex justify="space-between" className="margin-bottom-16">
                  <div className="modal-text2">Claimed</div>
                  <div className="modal-text3">/</div>
                </Flex>
                <Flex justify="space-between" className="margin-bottom-16">
                  <div className="modal-text2">APR</div>
                  <div className="modal-text3">/</div>
                </Flex>
                <Flex justify="space-between" className="margin-bottom-16">
                  <div className="modal-text2">Status</div>
                  <div className="modal-text3">Available</div>
                </Flex>
                <Flex justify="space-between" className="margin-bottom-16">
                  <div className="modal-text2">LV</div>
                  <div className="modal-text3">1</div>
                </Flex>
              </Flex>
            </Col>
          </Row>
          <Row justify="center">
            <Col xs={24} sm={18}>
              <Flex justify="center">
                <div className="modal-text1">LV 7 →</div>
                <div className="modal-text4">&nbsp;LV 8</div>
              </Flex>
              <Flex justify="space-between">
                <Flex align="center" className="modal-text5">
                  {" "}
                  <img
                    src={m1}
                    width={14}
                    alt=""
                    style={{ marginRight: "10px" }}
                  />
                  SPI
                </Flex>
                <Flex>
                  <div className="modal-text6">12</div>
                  <div className="modal-text8">&nbsp;{">"}&nbsp;</div>
                  <div className="modal-text7">14</div>
                </Flex>
              </Flex>
              <Flex justify="space-between">
                <Flex align="center" className="modal-text5">
                  {" "}
                  <img
                    src={m2}
                    width={14}
                    alt=""
                    style={{ marginRight: "10px" }}
                  />
                  STK
                </Flex>
                <Flex>
                  <div className="modal-text6">1764</div>
                  <div className="modal-text8">&nbsp;{">"}&nbsp;</div>
                  <div className="modal-text7">1764</div>
                </Flex>
              </Flex>
              <Flex justify="space-between">
                <Flex align="center" className="modal-text5">
                  {" "}
                  <img
                    src={m3}
                    width={14}
                    alt=""
                    style={{ marginRight: "10px" }}
                  />
                  DEF
                </Flex>
                <Flex>
                  <div className="modal-text6">12</div>
                  <div className="modal-text8">&nbsp;{">"}&nbsp;</div>
                  <div className="modal-text7">14</div>
                </Flex>
              </Flex>
              <Flex justify="space-between">
                <Flex align="center" className="modal-text5">
                  {" "}
                  <img
                    src={m4}
                    width={14}
                    alt=""
                    style={{ marginRight: "10px" }}
                  />
                  SPD
                </Flex>
                <Flex>
                  <div className="modal-text6">365</div>
                  <div className="modal-text8">&nbsp;{">"}&nbsp;</div>
                  <div className="modal-text7">400</div>
                </Flex>
              </Flex>
              <Flex justify="space-between">
                <Flex align="center" className="modal-text5">
                  {" "}
                  <img
                    src={m5}
                    width={14}
                    alt=""
                    style={{ marginRight: "10px" }}
                  />
                  MANA
                </Flex>
                <Flex>
                  <div className="modal-text6">4680</div>
                  <div className="modal-text8">&nbsp;{">"}&nbsp;</div>
                  <div className="modal-text7">4690</div>
                </Flex>
              </Flex>
              <Flex
                className="black-bg2"
                justify="space-between"
                align="center"
                style={{marginTop:'16px'}}
              >
                <Flex align="center">
                  <img src={purple} width={24} style={{marginRight:'10px'}} alt="" />
                  <div className="modal-text3">Prism</div>
                </Flex>
                <Flex>
                  <div className="modal-text3">342</div>
                  <div className="modal-text9">/9</div>
                </Flex>
              </Flex>
              <Flex
                className="black-bg3"
                justify="space-between"
                align="center"
              >
                <Flex align="center">
                  <img src={blue} width={24} style={{marginRight:'10px'}} alt="" />
                  <div className="modal-text3">Neko</div>
                </Flex>
                <Flex>
                  <div className="modal-text3">546436</div>
                  <div className="modal-text9">/50000</div>
                </Flex>
              </Flex>
            </Col>
          </Row>
          <Button
            text="LV UP"
            color="orange"
            longness="short"
            style={{ marginTop: "48px" }}
          />
        </Flex>
      </NekoModal>


      <NekoModal
        title=""
        // isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="modal-title text-center margin-bottom-16">
          Open Adept's Chest
        </div>
        <Row justify="center" gutter={16}>
          <Col>
          <div className="adept-bg">
            
              <img src={adept1} width={80} alt="" />
              <div className="modal-text1">Prism</div>
              <div className="modal-text10">x25</div>

          </div>
          </Col>

          <Col>
          <div className="adept-bg">
            
              <img src={adept2} width={80} alt="" />
              <div className="modal-text1">Neko</div>
              <div className="modal-text10">4500</div>

          </div>
          </Col>
          

        </Row>
        <Flex justify="center">
        <Button
            text="Get"
            color="yellow"
            longness="short"
            style={{ marginTop: "48px" }}
          />
        </Flex>

      </NekoModal>

      <NekoModal
        title=""
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="modal-title text-center margin-bottom-16">
         Choose Wallet
        </div>
        <Flex
                className="black-bg3"
                justify="center"
                align="center"
              >
                <div className="modal-text1 text-center">Metamask</div>
                
                </Flex>
                <Flex
                className="black-bg3"
                justify="center"
                align="center"
              >
                <div className="modal-text1 text-center">OKX</div>
                
                </Flex>
                <input
                    className="input-card-input"
                    placeholder="Enter Amount"
                    type="text"
                  />
        <Flex justify="center">
        <Button
            text="Connect"
            color="yellow"
            longness="long"
            style={{ marginTop: "48px" }}
          />
        </Flex>

      </NekoModal>
    </div>
  );
}
