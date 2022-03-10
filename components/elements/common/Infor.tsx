import { LinkOutlined } from '@ant-design/icons';
import { Space, Tooltip } from 'antd';
import { GlobalContext } from 'contextApi/globalContext';
import Link from 'next/link';
import * as React from 'react';

export interface IAppProps {
  color: string;
  Icon: any;
  title: string;
  url?: string;
  titleTooltip: string;
}

export const Infor = ({ color, Icon, title, url, titleTooltip }: IAppProps) => {
  return (
    <>
      <Tooltip title={titleTooltip}>
        <Space size={20}>
          <Space
            style={{
              width: 36,
              height: 36,
              background:  `${color}15`,
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
      </Tooltip>
    </>
  );
};
