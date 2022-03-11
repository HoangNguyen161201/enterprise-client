import { MoreOutlined } from '@ant-design/icons';
import { Button, Col, Image, Space } from 'antd';
import React, { useContext } from 'react';
import { ISubmissionForm } from 'models/formType';
import { IDetailUser } from 'models/apiType';
import Link from 'next/link';
import { GlobalContext } from 'contextApi/globalContext';
import { LinkSpin } from './LinkSpin';

interface ICard {
  item: ISubmissionForm;
  more?: (item: ISubmissionForm) => void;
  current_user: IDetailUser;
  [index: string]: any;
}
export const Card = ({ item, more, current_user, xl = 8, lg = 12, md = 24 }: ICard) => {
  const { desColor, color } = useContext(GlobalContext);
  return (
    <Col xl={xl} lg={lg} md={md}>
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
            {current_user && current_user.user?.role !== 'admin' ? (
              <LinkSpin url={`/submissions/detail/${item._id}`} name={item.name} />
            ) : (
              <span className={`${color}`}>{item.name}</span>
            )}
          </span>
          <span className={`${desColor}`}>{item.description}</span>
        </div>

        {(more && current_user && current_user.user?.role === 'admin') ||
          (more && current_user && current_user.user?.role === 'qa_manager' && (
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
          ))}
      </Space>
    </Col>
  );
};
