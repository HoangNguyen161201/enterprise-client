import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FileAddOutlined,
  FolderViewOutlined,
  MoreOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Dropdown, Grid, List, Menu, Space } from 'antd';
import { GlobalContext } from 'contextApi/globalContext';
import { IIdea } from 'models/apiType';
import Link from 'next/link';
import * as React from 'react';

export interface IItemIdeaProps {
  item: IIdea;
  onDeleteIdea: (idea_id: string, cloudinary_id: string) => void;
  closure_date?: {
    value: string;
    isMatchDate: boolean;
  };
}

export const ItemIdea = ({ item, onDeleteIdea, closure_date }: IItemIdeaProps) => {
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();
  const { desColor, handleLoadPage } = React.useContext(GlobalContext);

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
              color: 'red',
            }}
          />
          <span>Delete Idea</span>
        </Space>
      </Menu.Item>
      <Menu.Item>
        <Link href={`/ideas/update/${item._id}`} passHref>
          <Space onClick={() => handleLoadPage(true)}>
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
          {lg && <span>👉</span>}

          <Space direction="vertical" size={20}>
            <span
              style={{
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              <Link href={`/ideas/detail/${item._id}`}>
                <a className='color-1'>{item.title}</a>
              </Link>
            </span>
            <Space size={20}>
              <Space
                style={{
                  borderRadius: 5,
                  padding: '2px 10px',
                  fontSize: 12,
                  background: item.accept ? '#CDFFEB' : '#FF000020',
                }}
              >
                {item.accept ? 'Accepted' : 'Not accepted yet'}
              </Space>
              <Space
                style={{
                  borderRadius: 5,
                  padding: '2px 10px',
                  fontSize: 12,
                  background: '#CDFFEB',
                }}
              >
                {item.category_id ? item.category_id.name : 'Not have category'}
              </Space>
            </Space>

            <Space wrap size={20}>
              <Space>
                <FileAddOutlined className={`${desColor}`} />
                <span className={`${desColor}`}>{item.files.length} file</span>
              </Space>

              <Space>
                <FolderViewOutlined className={`${desColor}`} />
                <span className={`${desColor}`}>{item.view} view</span>
              </Space>

              <Space>
                {item.anonymously ? (
                  <EyeInvisibleOutlined className={`${desColor}`} />
                ) : (
                  <EyeOutlined className={`${desColor}`} />
                )}
                <span className={`${desColor}`}>
                  {item.anonymously ? 'Anonymous information' : 'Public information'}
                </span>
              </Space>
            </Space>
          </Space>
        </Space>

        {closure_date && closure_date.isMatchDate && (
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
