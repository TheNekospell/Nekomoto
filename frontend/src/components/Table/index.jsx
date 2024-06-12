import "./index.css";
import { Col, Row } from "antd";
import BoxBorder from "@components/BoxBorder/index";
import { Table } from 'antd';
import {TableColumns, TableData} from './data'



export default function NekoTable({ title }) {
  return (
    <div className="table">
      <BoxBorder color="#0E222F" />
      <div className="card-title" style={{ marginBottom: "16px" }}>
        Treasury Revenue
      </div>
      <Table rowKey='id' columns={TableColumns} dataSource={TableData} scroll={{ x: 1200 }} pagination={false} />

      {/* <Row justify="center" className="table-header">
        {TableHeader.map((title, index) => (
          <Col xs={4} key={index} className="table-header-title">
            {title}
          </Col>
        ))}
      </Row>
      {TableData.map((row, rowIndex) => {
        return <Row justify="center" key={rowIndex} className="table-row">
          {RowKeys.map((rowKey, colIndex) => (
            <Col xs={4} key={colIndex} className="table-text">
              {row[rowKey]}
            </Col>
          ))}
        </Row>;
      })} */}
    </div>
  );
}
