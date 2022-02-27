import { Avatar, Col, Space, Tag } from 'antd';
import Link from 'next/link';
import React from 'react';

interface IIideaItem {
  avatar?: String;
  userName?: String;
  time: String;
  title: String;
  description: String;
  iconReaction: String;
  count: Number;
  id: String;
}

export default function Idea({
  avatar,
  userName,
  time,
  title,
  description,
  iconReaction,
  count,
  id,
}: IIideaItem) {
  return (
    <Link href={`/ideas/detail/${id}`} passHref={true}>
      <Col style={{
        cursor: 'pointer'
      }} span={24}>
        <Space size={20} align="start">
          <Avatar
            size={'large'}
            style={{
              border: '2px solid #07456F30',
            }}
            src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"
          >
            nguyen
          </Avatar>
          <Space direction="vertical" size={'middle'}>
            <Space direction="vertical">
              <Space size={'middle'}>
                <span>{userName}</span>
                <span
                  style={{
                    color: 'gray',
                  }}
                >
                  {time}
                </span>
              </Space>
              <span
                className="font-3"
                style={{
                  fontWeight: 'bold',
                  color: '#07456F',
                }}
              >
                {title}
              </span>
              <span
                style={{
                  color: 'gray',
                }}
              >
                {description}
              </span>
            </Space>

            <Tag
              color="processing"
              icon={
                <span
                  style={{
                    marginRight: 8,
                  }}
                >
                  {iconReaction}
                </span>
              }
            >
              {count}
            </Tag>
          </Space>
        </Space>
      </Col>
    </Link>
  );
}
