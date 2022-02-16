import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Space } from 'antd';
import * as React from 'react';

export interface IButtonAssignProps {
  color: string;
  Icon: any;
  title: string;
  subTitle: string;
  [index: string]: any
}

export default function ButtonAssign({ color, Icon, title, subTitle, ...props }: IButtonAssignProps) {
  return (
    <Col
      span={8}
      style={{
        padding: '10px 15px',
      }}
      {...props}
    >
      <Space
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          background: `${color}15`,
          padding: '10px 15px',
          borderRadius: '10px',
        }}
      >
        <Space size={20}>
          <Space
            align="center"
            style={{
              height: '60px',
              width: '60px',
              background: `${color}30`,
              borderRadius: '10px',
              justifyContent: 'center',
            }}
          >
            <Icon
              style={{
                fontSize: '25px',
                color: 'white',
              }}
            />
          </Space>
          <Space
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'start',
            }}
          >
            <span
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              {title}
            </span>
            <span
              style={{
                fontSize: '14px',
                color: 'gray',
              }}
            >
              {subTitle}
            </span>
          </Space>
        </Space>

        <Space
          style={{
            height: '60px',
            display: 'flex',
            alignItems: 'end',
          }}
        >
          <Space
            style={{
              width: '30px',
              height: '30px',
              background: '#07456F',
              display: 'flex',
              justifyContent: 'center',
              borderRadius: '5px',
              boxShadow: "5px 5px 10px  rgba(0,0,0,0.1)"
            }}
          >
            <PlusOutlined
              style={{
                color: 'white',
              }}
            />
          </Space>
        </Space>
      </Space>
    </Col>
  );
}
