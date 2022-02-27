import { UserOutlined } from '@ant-design/icons';
import { Avatar, Modal, Space } from 'antd';
import { IComment, IDetailUser } from 'models/apiType';
import Link from 'next/link';
import * as React from 'react';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';

export interface IItemReplyCommentProps {
  comment: IComment;
  dataUser: IDetailUser;
  isMatchFinalTime: Boolean;
  parent_comment_id: string;
  onDeleteComment: ({
    comment_id,
    reply_id,
  }: {
    comment_id: string;
    reply_id?: string | undefined;
  }) => void;
  onUpdateComment: ({
    comment_id,
    reply_id,
    content,
  }: {
    comment_id: string;
    reply_id?: string | undefined;
    content: string;
  }) => void;
}

export default function ItemReplyComment({
  comment,
  dataUser,
  isMatchFinalTime,
  parent_comment_id,
  onDeleteComment,
  onUpdateComment,
}: IItemReplyCommentProps) {
  //Get user reply
  const user = comment.user_id;

  //State content update
  const [content, setContent] = React.useState<string>(comment.content);

  //Setting modal
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    onUpdateComment({ comment_id: parent_comment_id, content: content, reply_id: comment._id });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setContent(comment?.content);
    setIsModalVisible(false);
  };

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
              {moment(comment.createdAt).fromNow()}
            </span>
          </Space>
          <span>{comment.content}</span>
          {isMatchFinalTime && (
            <Space wrap size={20}>
              {isMatchFinalTime && user._id === dataUser?.user?._id && (
                <span
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    onDeleteComment({ comment_id: parent_comment_id, reply_id: comment._id })
                  }
                >
                  Delete
                </span>
              )}

              {isMatchFinalTime && user._id === dataUser?.user?._id && (
                <span
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={showModal}
                >
                  Update
                </span>
              )}
            </Space>
          )}
        </Space>
      </Space>

      <Modal
        title="Update comment"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={'Update'}
      >
        <TextArea
          style={{
            minHeight: 200,
          }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </Modal>
    </Space>
  );
}
