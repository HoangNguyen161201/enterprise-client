import { DeleteOutlined, EyeInvisibleOutlined, EyeOutlined, FileAddOutlined, FolderViewOutlined } from '@ant-design/icons';
import { List, Space } from 'antd';
import { IIdea } from 'models/apiType';
import * as React from 'react';

export interface IItemIdeaProps {
  item: IIdea;
  onDeleteIdea: (idea_id: string, cloudinary_id: string) => void;
}

export const ItemIdea = ({ item, onDeleteIdea }: IItemIdeaProps) => {
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
              {item.title}
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
                {
                  item.anonymously 
                  ? (<EyeInvisibleOutlined />)
                  : (<EyeOutlined />)
                }
                <span>{item.anonymously ? 'Anonymous information' : 'Public information'}</span>
              </Space>
            </Space>
          </Space>
        </Space>

        <DeleteOutlined
          style={{
            fontSize: 16,
            color: '#FF0000',
          }}
          onClick={() => {
            onDeleteIdea(item._id as string, item.cloudinary_id);
          }}
        />
      </Space>
    </List.Item>
  );
};
