import { Col, Row } from 'antd';
import * as React from 'react';

export interface IRowTableProps {
    title: string,
    value: any,
    color?: string
}

export default function RowTable({title, value, color}: IRowTableProps) {
  return (
    <Row>
      <Col xs={24} md={6}>
        <div
          style={{
            background: '#009F9D50',
            padding: 10,
            border: '1px solid white',
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          {title}
        </div>
      </Col>
      <Col xs={24} md={18}>
        <div
          style={{
            padding: 10,
            border: '1px solid white',
            fontSize: 16,
            background: color ? color : '#CDFFEB',
          }}
        >
          {value}
        </div>
      </Col>
    </Row>
  );
}
