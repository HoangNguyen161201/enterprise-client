import { UserOutlined } from '@ant-design/icons';
import { Avatar, Input, List, message, Modal, Space } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { AxiosError } from 'axios';
import { ICommentResponse, ICommon, IDetailUser } from 'models/apiType';
import moment from 'moment';
import { commentMutation } from 'mutations/comment';
import Link from 'next/link';
import { useState } from 'react';
import InputComment from './InputComment';
import ItemReplyComment from './ItemReplyComment';

export interface IItemCommentProps {
  comment: ICommentResponse;
  dataUserRefetch: any;
  dataUser: IDetailUser;
  isMatchFinalTime: boolean;
  idea_id: string;
  anonymously: boolean;
  refetchDataComments: any;
}

export default function ItemComment({
  comment,
  dataUserRefetch,
  dataUser,
  isMatchFinalTime,
  idea_id,
  anonymously,
  refetchDataComments,
}: IItemCommentProps) {
  //State show input reply
  const [isShowInput, setIsShowInput] = useState<boolean>(false);
  //State show replies
  const [isShowReplies, setisShowReplies] = useState<boolean>(false);

  //State content comment
  const [content, setContent] = useState<string>(comment.content);

  //Get user comment
  const user = comment.user_id;

  //  Mutation call api to add comment
  const mutationAddComment = commentMutation.add({
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });

        //Fetch again comment
        refetchDataComments();
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Add comment false.',
        });
      },
    },
    dataUserRefetch: dataUserRefetch,
    token: dataUser?.accessToken.token,
  });

  //  Mutation call api to delete comment
  const mutationDeleteComment = commentMutation.delete({
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });

        //Fetch again comment
        refetchDataComments();
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Delete comment false.',
        });
      },
    },
    dataUserRefetch: dataUserRefetch,
    token: dataUser?.accessToken.token,
  });

  //  Mutation call api to update comment
  const mutationUpdateComment = commentMutation.update({
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });

        //Fetch again comment
        refetchDataComments();
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Update comment false.',
        });
      },
    },
    dataUserRefetch: dataUserRefetch,
    token: dataUser?.accessToken.token,
  });

  //Handle add comment
  const onAddComment = (contentComment: string) => {
    if (!contentComment) {
      message.error({
        content: 'Pleas enter your comment.',
      });
    } else {
      mutationAddComment.mutate({
        content: contentComment,
        idea_id,
        user_id: dataUser?.user._id,
        anonymously,
        comment_id: comment._id,
      });
    }
  };

  //Handle delete comment
  const onDeleteComment = ({ comment_id, reply_id }: { comment_id: string; reply_id?: string }) => {
    mutationDeleteComment.mutate({ comment_id, reply_id });
  };

  //Handle update comment
  const onUpdateComment = ({
    comment_id,
    reply_id,
    content,
  }: {
    comment_id: string;
    reply_id?: string;
    content: string;
  }) => {
    mutationUpdateComment.mutate({ comment_id, reply_id, content });
  };

  //Setting modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    onUpdateComment({ comment_id: comment._id, content: content });
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
        align="start"
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
              <span
                style={{
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setIsShowInput(!isShowInput);
                }}
              >
                {isShowInput ? 'Hide Reply' : 'Rely'}
              </span>

              <span
                style={{
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setisShowReplies(!isShowReplies);
                }}
              >
                {isShowReplies
                  ? `Hide replies (${comment.replies.length})`
                  : `Show replies (${comment.replies.length})`}
              </span>

              {isMatchFinalTime && user._id === dataUser?.user?._id && (
                <span
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => onDeleteComment({ comment_id: comment._id })}
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

      {isMatchFinalTime && (
        <Space
          direction="vertical"
          style={{
            paddingLeft: 50,
            display: isShowInput ? undefined : 'none',
          }}
        >
          <InputComment
            isLoading={mutationAddComment.isLoading}
            showInput={isMatchFinalTime}
            onAddComment={onAddComment}
          />
        </Space>
      )}

      <List
        style={{
          paddingLeft: 50,
          display: isShowReplies ? undefined : 'none',
        }}
        dataSource={comment.replies}
        renderItem={(item) => (
          <List.Item>
            <ItemReplyComment
              onUpdateComment={onUpdateComment}
              parent_comment_id={comment._id}
              onDeleteComment={onDeleteComment}
              dataUser={dataUser}
              comment={item}
              isMatchFinalTime={isMatchFinalTime}
            />
          </List.Item>
        )}
      />

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
