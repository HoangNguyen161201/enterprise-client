import { KeyOutlined } from '@ant-design/icons';
import { Col, Row, Space, Grid } from 'antd';
import * as React from 'react';

export interface IRowTableProps {
  title: string;
  value: any;
  isValid?: boolean;
}

export default function RowTable({ title, value, isValid = true }: IRowTableProps) {
  const { useBreakpoint } = Grid;
  const { md } = useBreakpoint();

  return (
    <Row>
      <Col
        xs={24}
        md={8}
        style={{
          borderRight: md ? '1px solid gray' : undefined,
          borderBottom: md ? undefined : '1px solid gray',
          paddingBottom: md ? undefined : 20
        }}
      >
        <Space size={20}>
          <Space
            align="center"
            style={{
              width: 50,
              height: 50,
              background: isValid ? '#009F9D' : '#FF7070',
              borderRadius: 10,
              justifyContent: 'center',
            }}
          >
            <KeyOutlined
              style={{
                fontSize: 20,
                color: 'white',
              }}
            />
          </Space>
          <span
            style={{
              fontSize: 16,
              color: isValid ? '#009F9D' : '#FF7070',
            }}
          >
            {title}
          </span>
        </Space>
      </Col>
      <Col xs={24} md={16}>
        <Space
          style={{
            padding: 10,
            fontSize: 16,
            background: isValid ? 'white' : '#FF000012',
            width: '100%',
            minHeight: "100%"
          }}
        >
          {value}
        </Space>
      </Col>
    </Row>
  );
}
