import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { Col, Dropdown, Menu, Space } from 'antd';
import React from 'react';
import { IDetailCategory } from '../../models';

interface ICategory {
  data: IDetailCategory
  openDrawer: (data: IDetailCategory) => void
  deleteCategory: (id: string)=> void
}
export default function Category({ data, deleteCategory, openDrawer }: ICategory) {
  return (
    <Col xl={8} md={12} xs={24} >
      <Space
        style={{
          boxShadow: '36px 23px 46px -9px rgba(0,0,0,0.06)',
          borderLeft: '5px solid #009F9D',
          padding: '10px 20px',
          borderRadius: 5,
          height: '100%'
        }}
        direction="vertical"
      >
        <span
          className="font-2 font-bold"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{data.name}</span>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={()=> openDrawer(data)} icon={<EditOutlined />}>Update</Menu.Item>
                <Menu.Item onClick={()=> deleteCategory(data._id)} icon={<DeleteOutlined style={{ color: 'red' }} />}>Remove</Menu.Item>
              </Menu>
            }
            placement="topRight"
            arrow
          >
            <MoreOutlined style={{ cursor: 'pointer' }} />
          </Dropdown>
        </span>
        <span style={{ color: 'gray' }}>{data.description}</span>
      </Space>
    </Col>
  );
}
