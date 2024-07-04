// import { connect, disconnect, useStarknetkitConnectModal } from "starknetkit"
import { useEffect, useState } from "react";
import { Col, Flex, Row, Modal, Input } from "antd";

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
import { useNavigate } from "react-router-dom";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";

export default function Wallet() {
    
    const navigate = useNavigate();
    
    const {connect, connectors} = useConnect();
    const {disconnect} = useDisconnect();
    const {account, address, status, isConnected} = useAccount();
    
    const [inputValue, setInputValue] = useState("");
    const [visible, setVisible] = useState(false);
    const [nekoCoin, setNekoCoin] = useState(0);
    
    
    const establishConnection = async (connector) => {
        await connect({connector})
        setVisible(false)
    }
    
    const closeConnection = async () => {
        setVisible(false)
        await disconnect()
    }
    
    return (
        <div>
            <Row>
                <Col className="header-btn2" onClick={() => navigate('/detail2')}>
                    <Flex align="center" justify="space-between">
                        <img
                            src={t5}
                            width={15}
                            style={{marginRight: "6px"}}
                            alt=""
                        />
                        <span>My Assets</span>
                    </Flex>
                </Col>
                <Col className="header-btn2" style={{margin: "0px 12px"}}>
                    {/*<Flex align="center" justify="space-between">*/}
                    <Flex align="center">
                        {/*<img*/}
                        {/*    src={blue}*/}
                        {/*    width={20}*/}
                        {/*    style={{marginRight: "6px"}}*/}
                        {/*    alt=""*/}
                        {/*/>*/}
                        <img
                            src={t6}
                            width={15}
                            style={{marginRight: "6px"}}
                            alt=""
                        />
                        <span>Buy NEKO</span>
                    </Flex>
                </Col>
                <Col style={{width: "170px", textAlign: "center"}}>
                    {(address && isConnected) ?
                        (
                            <div className="header-btn2" onClick={() => setVisible(true)}>
                                {address.slice(0, 6) + "..." + address.slice(-4)}
                            </div>
                        )
                        :
                        (
                            <div className="header-btn" onClick={() => {
                                setVisible(true)
                            }}>
                                Connect Wallet
                            </div>
                        )
                    }
                </Col>
            </Row>
            
            {visible && (
                
                <Modal open={visible} centered={true} footer={null} maskClosable={true}
                       onCancel={() => setVisible(false)}>
                    
                    {/*<div style={{*/}
                    {/*    position: 'fixed',*/}
                    {/*    top: 0,*/}
                    {/*    left: 0,*/}
                    {/*    right: 0,*/}
                    {/*    bottom: 0,*/}
                    {/*    backgroundColor: 'rgba(0, 0, 0, 0.5)',*/}
                    {/*    zIndex: 9999*/}
                    {/*}}>*/}
                    {/*    <div style={{*/}
                    {/*        position: 'absolute',*/}
                    {/*        top: '50%',*/}
                    {/*        left: '50%',*/}
                    {/*        transform: 'translate(-50%, -50%)',*/}
                    {/*        backgroundColor: 'white',*/}
                    {/*        padding: '20px'*/}
                    {/*    }}>*/}
                    
                    <div>
                        <h2 style={{
                            textAlign: "center",
                            color: "#01dce4",
                            fontFamily: "BIG SHOT",
                            fontWeight: "bold",
                        }}>{address && isConnected ? "" : "Connect Wallet"}</h2>
                    </div>
                    
                    <div style={{marginBottom: "15px", marginTop: "20px", textAlign: "center"}}>
                        {(address && isConnected) ?
                            (
                                <div>
                                    <div style={{
                                        fontSize: "16px",
                                        textAlign: "center",
                                        marginLeft: "10px",
                                        fontFamily: "BIG SHOT",
                                        color: "#01dce4",
                                        fontWeight: "bold"
                                    }}>{address.slice(0, 6) + "..." + address.slice(-4)}</div>
                                    
                                    <div style={{
                                        fontSize: "20px",
                                        fontFamily: "BIG SHOT",
                                        color: "#01dce4",
                                        marginTop: "18px",
                                        textAlign: "center",
                                    }}>{"My Invitor"}
                                    </div>
                                    
                                    <div style={{
                                        fontSize: "14px",
                                        fontFamily: "BIG SHOT",
                                        color: "#01dce4",
                                        marginTop: "18px",
                                        textAlign: "center",
                                    }}>{"Neko-xxxxxxx"}
                                    </div>
                                    
                                    <button className={"header-btn"} style={{marginTop: "20px", textAlign: "center"}}
                                            onClick={closeConnection}>{"Disconnect"}</button>
                                </div>
                            )
                            :
                            (
                                <div>
                                    <ul>
                                        {connectors.map((connector) => (
                                            <div key={connector.id}
                                                 style={{
                                                     display: "flex",
                                                     justifyContent: "center",
                                                     marginTop: "20px",
                                                     flexDirection: "row",
                                                 }}>
                                                <button style={{
                                                    fontSize: "15px",
                                                    flexDirection: "row",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    width: "200px",
                                                }} className={"header-btn"}
                                                        onClick={() => establishConnection(connector)}>
                                                    {connector.icon && (
                                                        <div style={{
                                                            marginRight: "20px",
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center"
                                                        }}>
                                                            <img src={connector.icon.dark} width={30} alt=""/>
                                                        </div>)}
                                                    {connector.name}
                                                </button>
                                            </div>
                                        ))}
                                    </ul>
                                    <div>
                                        <Input
                                            placeholder="Enter Invite Code"
                                            // type="number"
                                            size="large"
                                            style={{marginTop: "30px", width: "200px"}}
                                            // value={inputValue}
                                            onChange={(e) => {
                                                const v = e.target.value
                                                if (v) {
                                                    setInputValue(v)
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    {/*    </div>*/}
                    {/*</div>*/}
                
                </Modal>
            
            )}
        </div>
    )
}
