import { Space } from 'antd';
import * as React from 'react';

export interface IItemInforProps {
  title: string;
  content?: string;
}

export default function ItemInfor({ title, content }: IItemInforProps) {
  return (
    <Space direction="vertical">
      <label>{title}</label>
      <Space
        style={{
          border: '1px solid #009F9D',
          width: '100%',
          padding: '5px 10px',
          borderRadius: 5,
          background: 'white',
          color: content ? undefined : 'tomato',
        }}
      >
        {content ? content : 'None'}
      </Space>
    </Space>
  );
}
