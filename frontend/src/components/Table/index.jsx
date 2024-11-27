import "./index.css";
import {Table} from "antd";
import BoxBorder from "@components/BoxBorder/index";
import logo from "@assets/logo.png";

export default function NekoTable({records}) {

    const getRecordType = (type) => {
        switch (type) {
            case 0:
                return "Unknown";
            case 1:
                return "Buy Scroll";
            case 2:
                return "Summon";
            case 3:
                return "Stake";
            case 4:
                return "Withdraw";
            case 5:
                return "Upgrade";
        }
    }

    const getColor = (text) => {
        if (text.startsWith("UR")) {
            return {color: "#ac8988"};
        } else if (text.startsWith("SSR")) {
            return {color: "#ebcd93"};
        } else if (text.startsWith("SR")) {
            return {color: "#91769f"};
        } else if (text.startsWith("R")) {
            return {color: "#839eb9"};
        } else if (text.startsWith("N")) {
            return {color: "#90b2a1"};
        } else {
            return {};
        }
    };

    return (
        <div className="table">
            <BoxBorder/>
            <div className="card-title" style={{marginBottom: "16px"}}>
                History
            </div>

            {records && records.length > 0 ? (

                <Table
                    rowKey='id' columns={[
                    {
                        title: "TX Hash",
                        dataIndex: "Hash",
                        fixed: "left",
                        width: 400,
                        render: (text) => {
                            return <a href={"https://sepolia.voyager.online/tx/" + text}
                                      style={{textDecoration: "none", color: "inherit"}}
                                      target="_blank">{text.substring(0, 15) + "......" + text.substring(text.length - 15, text.length)}</a>
                        }
                    },
                    {
                        title: "Type",
                        dataIndex: "Type",
                        width: 150,
                        filtered: true,
                        align: "right",
                        filters: [
                            {
                                text: "Buy Scroll",
                                value: "Buy Scroll",
                            },
                            {
                                text: "Summon",
                                value: "Summon",
                            },
                            {
                                text: "Stake",
                                value: "Stake",
                            },
                            {
                                text: "Withdraw",
                                value: "Withdraw",
                            },
                            {
                                text: "Upgrade",
                                value: "Upgrade",
                            },
                        ],
                        onFilter: (value, record) => record.Type === value.toString(),
                    },
                    {
                        title: "Object",
                        dataIndex: "Object",
                        width: 200,
                        align: "right",
                        render: (text) => {
                            return <div style={getColor(text)}>
                                {text}
                            </div>
                        }
                    },
                    {
                        title: "Timestamp",
                        dataIndex: "CreatedAt",
                        width: 300,
                        align: "right",
                    },
                ]} dataSource={records?.map((item) => {
                    return {
                        id: item.ID,
                        key: item.ID,
                        Hash: item.Hash,
                        CreatedAt: new Date(item.CreatedAt).toUTCString().toString(),
                        Object: item.Object,
                        Type: getRecordType(item.RecordType),
                    }
                })} scroll={{y: 500}} pagination={false}/>

            ) : (

                <>
                    <div style={{display: "flex", flexDirection: "column", height: "200px"}}>
                        <img src={logo}
                             style={{height: "50%", margin: "auto", filter: "grayscale(100%)", opacity: "0.2"}}/>
                        <h2 style={{
                            color: "#495c6a",
                            margin: "auto",
                            marginTop: "20px",
                            textAlign: "center",
                            fontFamily: "BIG SHOT",
                            fontWeight: "bold"
                        }}>
                            {"Build the Army and Fight for Glory!"}
                            <div style={{marginTop: "10px"}}/>
                            {"Earn Your $NPO Now (ﾉ>ω<)ﾉ"}
                        </h2>
                    </div>
                </>

            )}

        </div>
    );
}
