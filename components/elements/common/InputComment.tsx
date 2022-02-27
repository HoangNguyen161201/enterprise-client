import { SendOutlined } from '@ant-design/icons';
import { Col, Row, Space, Spin, Switch } from 'antd';
import { ChangeEventHandler, useState } from 'react';

export interface IInputCommentProps {
  showInput?: boolean;
  isLoading: boolean;
  onAddComment: (contentComment: string) => void;
}

export default function InputComment({ showInput, isLoading, onAddComment }: IInputCommentProps) {
  const [contentComment, setContentComment] = useState<string>('');

  //Handle change comment
  const onChangeComment: ChangeEventHandler<HTMLInputElement> = (e) => {
    setContentComment(e.target.value);
  };

  return (
    <Space direction="vertical">
      {showInput && (
        <Spin spinning={isLoading}>
          <Row
            wrap={false}
            style={{
              border: '1px solid #07456F15',
              width: '100%',
              padding: '10px 15px',
              borderRadius: 50,
            }}
          >
            <Col
              flex={'auto'}
              style={{
                paddingRight: 10,
              }}
            >
              <input
                value={contentComment}
                placeholder="Enter your comment"
                onChange={onChangeComment}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                }}
              />
            </Col>
            <Col>
              <SendOutlined
                onClick={() => {
                  onAddComment(contentComment);
                  setContentComment("");
                }}
                style={{
                  fontSize: 20,
                  color: '#009F9D85',
                  cursor: 'pointer',
                }}
              />
            </Col>
          </Row>
        </Spin>
      )}
    </Space>
  );
}
