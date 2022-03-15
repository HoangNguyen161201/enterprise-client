import { EditOutlined, UserOutlined } from '@ant-design/icons';
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
  anonymously: boolean;
  [index: string]: any;
}

export default function Idea({
  avatar,
  userName,
  time,
  title,
  description,
  iconReaction,
  count,
  anonymously,
  id,
  accept,
  showAccept,
  showUpdate,
}: IIideaItem) {
  return (
    <Link href={`/ideas/detail/${id}`} passHref={true}>
      <Col
        style={{
          cursor: 'pointer',
        }}
        span={24}
      >
        <Space size={20} align="start">
          {anonymously ? (
            <Avatar alt={'avatar'} size="large" icon={<UserOutlined />} />
          ) : (
            <Avatar
              size={'large'}
              alt={'avatar'}
              style={{
                border: '2px solid #07456F30',
              }}
              src={avatar}
            >
              nguyen
            </Avatar>
          )}

          <Space direction="vertical" size={'middle'}>
            <Space direction="vertical">
              <Space size={'middle'}>
                <span>{anonymously ? '--------------------' : userName}</span>
                <span
                  style={{
                    color: 'gray',
                  }}
                >
                  {time}
                </span>
                {showUpdate && (
                  <Link passHref href={`/ideas/update/${id}`}>
                    <EditOutlined className="color-3" />
                  </Link>
                )}
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
            <Space>
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
              {showAccept && (
                <Tag color={accept ? 'green' : 'red'}>
                  {accept ? 'Accepted' : 'Not yet accepted'}
                </Tag>
              )}
            </Space>
          </Space>
        </Space>
      </Col>
    </Link>
  );
}
