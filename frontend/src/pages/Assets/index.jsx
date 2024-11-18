import "./index.css";
import InputCard from "../../components/InputCard/index";
import Table from "../../components/Table/index";

import {Col, Flex, Row} from "antd";
import {useEffect, useState} from "react";
import NekoModal from "../../components/Modal/index.jsx";
import CardCorner from "../../components/CardCorner/index.jsx";
import Button from "../../components/Button/index.jsx";
import {useNavigate} from "react-router-dom";
import CardDetail from "../../components/CardDetail/index.jsx";
import LuckCard from "../../components/LuckCard";
import CheckCard from "../../components/CheckCard";
import MintPoolCard from "../../components/MintPoolCard";
import {useServer} from "../../components/Server";
import WaitCard from "../../components/WaitCard/index.jsx";

export default function Assets() {
    const [info, setInfo] = useState({});
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const navigate = useNavigate();
    const [hhh, setHhh] = useState("");
    const {serverData: addressInfo, refreshServerData} = useServer();

    const [waiting, setWaiting] = useState(false);
    const [success, setSuccess] = useState("");

    useEffect(() => {
        refreshServerData();
    }, [hhh]);

    return (
        <div>
            <WaitCard
                waiting={waiting}
                setWaiting={setWaiting}
                success={success}
                setSuccess={setSuccess}
            />
            <NekoModal
                title="Starter Pack"
                open={isModalOpen1}
                onCancel={() => setIsModalOpen1(false)}
            >
                <Flex justify="center" vertical="column">
                    <div className="modal-card">
                        <div className="modal-card-inner">
                            <CardCorner/>
                            <CardDetail
                                item={{
                                    Level: 1,
                                    SPI: 5,
                                    ATK: 3,
                                    DEF: 3,
                                    SPD: 1,
                                    Fade: 125,
                                    Mana: 0.234,
                                    Rarity: "Common",
                                }}
                            />
                        </div>
                    </div>
                    <Button
                        text="GO CHECK"
                        color="yellow"
                        longness="short"
                        style={{marginTop: "48px"}}
                        onClick={() => navigate("/detail2")}
                    />
                </Flex>
            </NekoModal>

            <div className="assets padding-top-80 padding-bottom-80">
                <Row
                    gutter={16}
                    style={{paddingTop: "16px", height: "320px", display: "flex"}}
                >
                    <Col style={{width: "55%", height: "100%"}}>
                        <InputCard/>
                    </Col>
                    <Col style={{width: "45%", height: "100%"}}>
                        <MintPoolCard
                            epoch={addressInfo?.StaticEpoch}
                            staticMintPool={addressInfo?.StaticMintPool}
                            staticTotalLuck={addressInfo?.StaticTotalLuck}
                            estMintPoolReward={addressInfo?.EstMintPoolReward}
                            mintPoolToClaim={addressInfo?.MintPoolToClaim}
                            setWaiting={setWaiting}
                            setSuccess={setSuccess}
                        />
                    </Col>
                </Row>
                <Row style={{marginTop: "16px", marginBottom: "16px", height: "150px"}} gutter={16}>
                    <Col style={{width: "55%", height: "100%"}}>
                        <LuckCard
                            myLuck={addressInfo?.MyLuck}
                            mySSR={addressInfo?.MySSR}
                            myUR={addressInfo?.MyUR}
                        />
                    </Col>
                    <Col style={{width: "45%", height: "100%"}}>
                        <CheckCard setWaiting={setWaiting} setSuccess={setSuccess}/>
                    </Col>
                </Row>

                <Row>
                    <Table records={info.treasuryRevenue}/>
                </Row>
            </div>
        </div>
    );
}
