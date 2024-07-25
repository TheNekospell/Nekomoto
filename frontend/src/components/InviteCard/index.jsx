import "./index.css";
import box from "@assets/box1.png";
import arrowRight from "@assets/arrow-right.png";
import arrowDown from "@assets/arrow-down.png";
import masterBox from "@assets/master-box.png";
import { Col, Row } from "antd";
import Button from "@components/Button/index";
import BoxBorder from "@components/BoxBorder/index";
import { useAppStore } from "@stores/index";

import inviteSuccess from "@assets/invitesuccess.png";
import NekoModal from "@components/Modal/index.jsx";
import { useState } from "react";
import { useAccount } from "@starknet-react/core";

export default function InviteCard({
                                       chestOpenable, chestEmpower, openedChestCount, openedMasterChestCount, openChest,
                                       buttonText = "open",
                                   }) {
    const isMobile = useAppStore().device === "mobile";
    const isMaster = chestEmpower && chestEmpower.length >= 5
    const [visible, setVisible] = useState(false);
    const {address} = useAccount()
    
    const createEmpower = () => {
        setVisible(true)
        if (navigator.clipboard) {
            navigator.clipboard.writeText("https://game.nekomoto.xyz/detail2?addr=" + address).then(() => {
                console.log('Address copied to clipboard:', address);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }
    }
    
    
    return (
        <div>
            
            <NekoModal
                open={visible}
                centered={true}
                footer={null}
                maskClosable={true}
                onCancel={() => setVisible(false)}
            >
                
                <h2
                    style={{
                        textAlign: "center",
                        color: "#01dce4",
                        fontFamily: "BIG SHOT",
                        fontWeight: "bold",
                    }}
                >
                    The sharing link has been copied, please forward it!
                </h2>
                
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Button
                        style={{
                            marginTop: "20px",
                            textAlign: "center",
                        }}
                        onClick={() => setVisible(false)}
                        text={"OK"}
                        color={"yellow"}
                        longness="long"
                    />
                </div>
            </NekoModal>
            
            <div className="invite-card">
                <BoxBorder/>
                
                <Row justify="center" gutter>
                    <Col xs={24} sm={24} lg={10} className="text-center">
                        <Row className="black-bg" align="center">
                            <Col xs={8} sm={8} lg={8} className="text-center">
                                <div style={{padding: "11px 10px"}}>
                                    <img src={box} width={56}/>
                                </div>
                            </Col>
                            <Col
                                xs={16}
                                sm={16}
                                lg={16}
                                className="text-center"
                                style={{alignSelf: "center"}}
                            >
                                <div className="card-little-title">Adept's Chest</div>
                                <div className="card-mini-desc">{openedChestCount}/10000</div>
                            </Col>
                            <div className={`${isMobile ? "" : "invite-btn-wrapper"}`}>
                                <Button disabled={!chestOpenable || isMaster} text={buttonText} color="yellow"
                                        longness="short" onClick={( !chestOpenable || isMaster ) ? null : openChest}/>
                            </div>
                        </Row>
                    </Col>
                    
                    <Col
                        xs={24}
                        sm={24}
                        lg={2}
                        className="text-center"
                        style={{alignSelf: "center", margin: "8px 0"}}
                    >
                        <img src={isMobile ? arrowDown : arrowRight} width={32}/>
                    </Col>
                    
                    <Col xs={24} sm={24} lg={10} className="text-center">
                        <Row className="black-bg" align="center">
                            <Col xs={8} sm={8} lg={8} className="text-center">
                                <img src={masterBox} width={76} className="margin-right-16"/>
                            </Col>
                            <Col
                                xs={16}
                                sm={16}
                                lg={16}
                                className="text-center"
                                style={{alignSelf: "center"}}
                            >
                                <div className="card-little-title">Master’s Box</div>
                                <div className="card-mini-desc">{openedMasterChestCount}/5000</div>
                            </Col>
                            <div className={`${isMobile ? "" : "invite-btn-wrapper"}`}>
                                <Button
                                    disabled={!chestOpenable || !isMaster}
                                    text={buttonText}
                                    color="yellow"
                                    longness="short"
                                    onClick={( !chestOpenable || !isMaster ) ? null : openChest}
                                />
                            </div>
                        </Row>
                    </Col>
                
                
                </Row>
                
                <Row justify='center'>
                    <div
                        className="card-mini-title text-center"
                        style={{marginTop: isMobile ? "12px" : "56px", marginBottom: '24px'}}
                    >
                        {"Invite 5 friends to help you get the Master‘s Box (" + chestEmpower.length + "/5)"}
                    </div>
                </Row>
                <Row justify={'center'} gutter='8'>
                    <Col xs={4} sm={4} lg={3} className="friend">
                        {chestEmpower[0] ?
                            ( <div>
                                    <div className="friend-avatar text-center">
                                        <img src={inviteSuccess} width="100%" alt=""/>
                                    </div>
                                    <div
                                        className="friend-text">{chestEmpower[0].slice(0, 4) + "..." + chestEmpower[0].slice(-2)}</div>
                                </div>
                            ) : (
                                <div>
                                    <div className="friend-avatar text-center" onClick={createEmpower}>
                                        +
                                    </div>
                                    <div className="friend-text2">Waiting</div>
                                </div>
                            )}
                    </Col>
                    <Col xs={4} sm={4} lg={3} className="friend">
                        {chestEmpower[1] ?
                            ( <div>
                                    <div className="friend-avatar text-center">
                                        <img src={inviteSuccess} width="100%" alt=""/>
                                    </div>
                                    <div
                                        className="friend-text">{chestEmpower[0].slice(0, 4) + "..." + chestEmpower[1].slice(-2)}</div>
                                </div>
                            ) : (
                                <div>
                                    <div className="friend-avatar text-center" onClick={createEmpower}>
                                        +
                                    </div>
                                    <div className="friend-text2">Waiting</div>
                                </div>
                            )}
                    </Col>
                    <Col xs={4} sm={4} lg={3} className="friend">
                        {chestEmpower[2] ?
                            ( <div>
                                    <div className="friend-avatar text-center">
                                        <img src={inviteSuccess} width="100%" alt=""/>
                                    </div>
                                    <div
                                        className="friend-text">{chestEmpower[0].slice(0, 4) + "..." + chestEmpower[2].slice(-2)}</div>
                                </div>
                            ) : (
                                <div>
                                    <div className="friend-avatar text-center" onClick={createEmpower}>
                                        +
                                    </div>
                                    <div className="friend-text2">Waiting</div>
                                </div>
                            )}
                    </Col>
                    <Col xs={4} sm={4} lg={3} className="friend">
                        {chestEmpower[3] ?
                            ( <div>
                                    <div className="friend-avatar text-center">
                                        <img src={inviteSuccess} width="100%" alt=""/>
                                    </div>
                                    <div
                                        className="friend-text">{chestEmpower[0].slice(0, 4) + "..." + chestEmpower[3].slice(-2)}</div>
                                </div>
                            ) : (
                                <div>
                                    <div className="friend-avatar text-center" onClick={createEmpower}>
                                        +
                                    </div>
                                    <div className="friend-text2">Waiting</div>
                                </div>
                            )}
                    </Col>
                    <Col xs={4} sm={4} lg={3} className="friend">
                        {chestEmpower[4] ?
                            ( <div>
                                    <div className="friend-avatar text-center">
                                        <img src={inviteSuccess} width="100%" alt=""/>
                                    </div>
                                    <div
                                        className="friend-text">{chestEmpower[0].slice(0, 4) + "..." + chestEmpower[4].slice(-2)}</div>
                                </div>
                            ) : (
                                <div>
                                    <div className="friend-avatar text-center" onClick={createEmpower}>
                                        +
                                    </div>
                                    <div className="friend-text2">Waiting</div>
                                </div>
                            )}
                    </Col>
                </Row>
            
            </div>
        </div>
    );
}
