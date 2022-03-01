import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FileAddOutlined,
  FolderViewOutlined,
  MoreOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, List, Menu, Space } from 'antd';
import { IIdea } from 'models/apiType';
import Link from 'next/link';
import * as React from 'react';

export interface IItemIdeaProps {
  item: IIdea;
  onDeleteIdea: (idea_id: string, cloudinary_id: string) => void;
  closure_date: {
    value: string;
    isMatchDate: boolean;
  };
}

export const ItemIdea = ({ item, onDeleteIdea, closure_date }: IItemIdeaProps) => {
  const menu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          onDeleteIdea(item._id as string, item.cloudinary_id);
        }}
      >
        <Space>
          <DeleteOutlined
            style={{
              fontSize: 16,
              color: '#009F9D',
            }}
          />
          <span>Delete Idea</span>
        </Space>
      </Menu.Item>
      <Menu.Item>
        <Link href={`/ideas/update/${item._id}`} passHref>
          <Space>
            <UploadOutlined
              style={{
                fontSize: 16,
                color: '#009F9D',
              }}
            />
            <span>Update Idea</span>
          </Space>
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <List.Item>
      <Space
        style={{
          width: '100%',
          justifyContent: 'space-between',
        }}
        align="start"
      >
        <Space size={20} align="start">
          <span>👉</span>

          <Space direction="vertical" size={20}>
            <span
              style={{
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              {item.accept ? (
                <Link href={`/ideas/detail/${item._id}`}>
                  <a>{item.title}</a>
                </Link>
              ) : (
                item.title
              )}
            </span>
            <Space size={20}>
              <Space
                style={{
                  borderRadius: 10,
                  padding: 4,
                  fontSize: 12,
                  background: item.accept ? '#CDFFEB' : '#FF000020',
                }}
              >
                {item.accept ? 'Accepted' : 'Not accepted yet'}
              </Space>
              <Space
                style={{
                  borderRadius: 10,
                  padding: 4,
                  fontSize: 12,
                  background: '#CDFFEB',
                }}
              >
                {item.category_id ? item.category_id : 'Not have category'}
              </Space>
            </Space>

            <Space size={20}>
              <Space>
                <FileAddOutlined />
                <span>{item.files.length} file</span>
              </Space>

              <Space>
                <FolderViewOutlined />
                <span>{item.view} view</span>
              </Space>

              <Space>
                {item.anonymously ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                <span>{item.anonymously ? 'Anonymous information' : 'Public information'}</span>
              </Space>
            </Space>
          </Space>
        </Space>

        {closure_date.isMatchDate && (
          <Dropdown arrow overlay={menu} trigger={['click', 'hover']} placement="topRight">
            <MoreOutlined
              style={{
                fontSize: 16,
                cursor: 'pointer',
              }}
            />
          </Dropdown>
        )}
      </Space>
    </List.Item>
  );
};
