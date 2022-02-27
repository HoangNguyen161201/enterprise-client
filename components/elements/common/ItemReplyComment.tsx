import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
import { IComment } from 'models/apiType';
import Link from 'next/link';
import * as React from 'react';

export interface IItemReplyCommentProps {
  comment: IComment;
}

export default function ItemReplyComment({ comment }: IItemReplyCommentProps) {
  //Get user reply
  const user = comment.user_id;
  return (
    <Space
      direction="vertical"
      size={20}
      style={{
        width: '100%',
      }}
    >
      <Space
        size={20}
        style={{
          width: '100%',
          marginTop: 20,
        }}
      >
        {comment.anonymously ? (
          <Avatar icon={<UserOutlined />} />
        ) : (
          <Avatar src={user.avatar.url} />
        )}
        <Space direction="vertical" size={10}>
          <Space wrap size={20}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 'bold',
              }}
            >
              {comment.anonymously ? (
                '--------------------'
              ) : (
                <Link href={`/employees/detail/${user._id}`}>
                  <a>{user.name}</a>
                </Link>
              )}
            </span>
            <span
              style={{
                fontSize: 12,
              }}
            >
              {comment.createdAt}
            </span>
          </Space>
          <span>{comment.content}</span>
        </Space>
      </Space>
    </Space>
  );
}
