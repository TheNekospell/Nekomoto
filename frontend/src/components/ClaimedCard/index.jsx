import "./index.css";
import Button from "@components/Button/index";
import GemItem from "@components/GemItem/index";
import BoxBorder from "@components/BoxBorder/index";
import icon1 from "@assets/icon1.png";
import icon2 from "@assets/icon2.png";
import icon3 from "@assets/icon3.png";
import { Col, Row, Flex } from "antd";
import { useAppStore } from "@stores/index";
import { useEffect } from "react";
import freeze from "@assets/freeze.png";
import luckyLogo from "@assets/lucky.png";
import bounty from "@assets/bounty.png";

export default function ClaimedCard({
                                        type,
                                        totalClaimed,
                                        totalMana,
                                        shard,
                                        boost,
                                        lucky,
                                        startTime,
                                        bountyWave,
                                        startTimeFreeze
                                    }) {
    const {device} = useAppStore();
    
    // console.log("time: ", (new Date().getTime() - new Date(startTime).getTime()))
    // console.log("time :", 72 * 60 * 60 * 1000)
    
    return (
        <div className="input-card">
            <BoxBorder/>
            
            <Row gutter={32}>
                <Col xs={24} sm={12}>
                    <div className="card-title">Total Claimed</div>
                    <div className="num-44-white" style={{margin: "12px 0 "}}>
                        {totalClaimed}
                        <span className="card-sub-title">NKO</span>
                    </div>
                </Col>
                <Col xs={24} sm={12}>
                    <div className="card-title">Mana</div>
                    <div className="num-44-orange" style={{margin: "12px 0"}}>
                        {totalMana?.slice(0,9)}
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
            <Row align="center" justify="space-between" style={{marginTop: '0px'}}>
                <Col xs={24} sm={type === 'short' ? 24 : 5} style={{alignSelf: 'center', margin: '16px 0'}}>
                    <img src={freeze} width={40} alt="Time Freeze" title="Time Freeze"
                         style={(new Date().getTime()
                             - new Date(startTime).getTime()) > 72 * 60 * 60 * 1000 ? {filter: "grayscale(1)"} : {}}/>
                    <img src={luckyLogo} width={40} alt="Lucky" title="Lucky"
                         style={lucky ? {margin: '0 16px'} : {margin: '0 16px', filter: "grayscale(1)"}}/>
                    <img src={bounty} width={40} alt="Bounty Wave" title="Bounty Wave"
                         style={bountyWave ? {} : {filter: "grayscale(1)"}}/>
                </Col>
                <Col xs={24} sm={type === 'short' ? 24 : 19}>
                    <Row align="center" className="padding-wrapper"
                         style={{display: 'flex', justifyContent: 'space-between'}}>
                        {/*<Col xs={24} sm={6}>*/}
                        {/*    <GemItem color="purple" title="Prism" descLeft={"x"}/>*/}
                        {/*</Col>*/}
                        <Col xs={24} sm={10}>
                            <GemItem color="green" title="Temporal Shard" descLeft={"x" + shard}/>
                        </Col>
                        <Col xs={24} sm={8} style={{alignSelf: 'center'}} className="text-center">
                            <Button text="Time freeze" color="yellow" longness="long"
                                    onClick={shard > 0 ? startTimeFreeze : null}/>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}
