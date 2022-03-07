import { EyeOutlined } from '@ant-design/icons';
import { Col, Space } from 'antd';
import React, { useContext } from 'react';
import { IFieldCard } from 'models/elementType';
import Link from 'next/link';
import { GlobalContext } from 'contextApi/globalContext';

export const FieldCard = ({ label, content, view, xs = 24, xl = 12, lg, user_id }: IFieldCard) => {
  const {desColor, darkMode} = useContext(GlobalContext)
  return (
    <Col xs={xs} xl={xl} lg={lg}>
      <p className={`font-2 ${desColor}`}>{label}</p>
      <Space
        style={{
          borderRadius: '4px',
          background: darkMode ? '#FFFFFF' : content ? '#07456F10' : '#ffdbdb85',
          width: '100%',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 16,
        }}
      >
        <span
          style={{
            color: content ? '' : '#ff6060',
          }}
        >
          {content ? content : 'None'}
        </span>
        {view && user_id && (
          <Link href={`/employees/detail/${user_id}`} passHref>
            <a>
              <EyeOutlined
                style={{
                  fontSize: '15px',
                  color: '#009F90',
                }}
              />
            </a>
          </Link>
        )}
      </Space>
    </Col>
  );
};
