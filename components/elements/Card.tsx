import { MoreOutlined } from '@ant-design/icons';
import { Button, Col, Image, Space } from 'antd';
import React from 'react';
import { ISubmissionForm } from '../../models';

interface ICard {
    item: ISubmissionForm
    more: (item: ISubmissionForm)=> void
    [index: string]: any
}
export default function Card({item, more}: ICard) {
  return (
    <Col xl={8} lg={12} md={24}>
      <Space direction="vertical" size={15}>
        <Image
          alt={`submission_${item._id}`}
          width={'100%'}
          style={{
            background: 'white',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          preview={false}
          src={item.background}
        />
        <div>
          <span
            className="font-3"
            style={{
              fontWeight: 'bold',
              display: 'block',
            }}
          >
            {item.name}
          </span>
          <span style={{ color: 'gray' }}>{item.description}</span>
        </div>
        <Button
          onClick={() => more(item)}
          size="large"
          type="ghost"
          style={{
            position: 'absolute',
            background: 'white',
            top: 25,
            right: 40,
          }}
          shape="circle"
        >
          <MoreOutlined />
        </Button>
      </Space>
    </Col>
  );
}
