import { MoreOutlined } from '@ant-design/icons';
import { Button, message, Layout, Space, Typography, Avatar, Menu, Dropdown } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useMutation } from 'react-query';
import { ILogout } from '../../models';
import { getCurrentUser } from '../../queries';
import { postData } from '../../utils/fetchData';

const { Header } = Layout;

export default function HeaderComponent() {
  //Get data current user
  const { data: dataUser } = getCurrentUser();

  const { push } = useRouter();

  //Mutation logout
  const logoutMutation = useMutation<ILogout>(
    () => {
      return postData({
        url: '/api/auth/logout',
      });
    },
    {
      onSuccess: (data) => {
        message.success({
          content: data.msg,
        });
        localStorage.removeItem('first-login');
        push('/login', undefined, { shallow: true });
      },
    }
  );

  //Handle logout
  const onLogout = () => {
    logoutMutation.mutate();
  };

  //Elemen menu
  const menu = (
    <Menu
      style={{
        padding: '10px 20px',
      }}
    >
      <Menu.Item key="1">Profile</Menu.Item>
      <Menu.Item key="2" onClick={onLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <Header
        style={{
          padding: '0px 40px',
          backgroundColor: 'white',
          zIndex: '1',
          borderBottom: '1px solid #efefef',
        }}
      >
        <Space
          style={{
            justifyContent: 'space-between',
            display: 'flex',
          }}
        >
          <span
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            CMS
          </span>
          {dataUser ? (
            <Dropdown overlay={menu} placement="bottomRight">
              <Space>
                <Space
                  size={20}
                  style={{
                    height: '42px',
                    paddingLeft: 7,
                    paddingRight: 10,
                    borderRadius: '40px',
                    background: '#009F9D15',
                    cursor: 'pointer',
                  }}
                >
                  <Avatar
                    style={{
                      border: '1px solid #009F9D',
                      background: 'white',
                    }}
                    src={dataUser.user?.avatar?.url}
                  />
                  <span>{dataUser.user?.name}</span>
                </Space>
              </Space>
            </Dropdown>
          ) : (
            <Button
              type="primary"
              style={{
                borderRadius: '5px',
              }}
            >
              <Link href={'/login'} passHref>
                <a>Login</a>
              </Link>
            </Button>
          )}
        </Space>
      </Header>
    </>
  );
}
