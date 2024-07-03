import { connect, disconnect, useStarknetkitConnectModal } from "starknetkit"
import { useConnect } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Col, Flex, Row } from "antd";

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

export default function Wallet() {
    
    const navigate = useNavigate();
    
    // const {connect, connectors} = useConnect();
    // const {starknetkitConnectModal} = useStarknetkitConnectModal({connectors: connectors})
    
    const [wallet, setWallet] = useState(null);
    const [nekocoin, setNekocoin] = useState(0);
    
    
    const establishConnection = async () => {
        const connection = await connect()
        setWallet(connection.wallet)
    }
    
    const closeConnection = async () => {
        await disconnect()
        setWallet(null)
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
                <Col>
                    {(wallet && wallet.isConnected) ?
                        (
                            <div className="header-btn2" onClick={closeConnection}>
                                {wallet.selectedAddress.slice(0, 6) + "..." + wallet.selectedAddress.slice(-4)}
                            </div>
                        )
                        :
                        (
                            <div className="header-btn" onClick={establishConnection}>
                                Connect Wallet
                            </div>
                        )
                    }
                </Col>
            </Row>
        </div>
    )
}
