import { LinkOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import Link from 'next/link';
import * as React from 'react';

export interface IAppProps {
  color: string;
  Icon: any;
  title: string;
  url?: string;
}

export default function App({ color, Icon, title, url }: IAppProps) {
  return (
    <>
      <Space size={20}>
        <Space
          style={{
            width: 36,
            height: 36,
            background: `${color}15`,
            justifyContent: 'center',
            borderRadius: '50%',
          }}
        >
          <Icon
            style={{
              color: `${color}`,
            }}
          />
        </Space>
        <span>{title}</span>
        {url && (
          <Link href={url}>
            <a>
              <LinkOutlined />
            </a>
          </Link>
        )}
      </Space>
    </>
  );
}
