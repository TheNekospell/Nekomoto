import "./index.css";
import {Table} from "antd";
import BoxBorder from "@components/BoxBorder/index";


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
            <BoxBorder color="#0E222F"/>
            <div className="card-title" style={{marginBottom: "16px"}}>
                History
            </div>
            <Table
                rowKey='id' columns={[
                {
                    title: "TX Hash",
                    dataIndex: "Hash",
                    fixed: "left",
                    width: 400
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
                    key: item.ID,
                    Hash: item.Hash.substring(0, 15) + "..." + item.Hash.substring(item.Hash.length - 15, item.Hash.length),
                    CreatedAt: new Date(item.CreatedAt).toUTCString().toString(),
                    Object: item.Object,
                    Type: getRecordType(item.RecordType),
                }
            })} scroll={{y: 500}} pagination={false}/>

        </div>
    );
}
