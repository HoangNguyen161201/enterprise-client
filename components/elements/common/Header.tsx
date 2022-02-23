import { LogoutOutlined, MoreOutlined, ProfileOutlined } from '@ant-design/icons';
import { Button, message, Layout, Space, Typography, Avatar, Menu, Dropdown, Divider } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useMutation } from 'react-query';
import { ILogout } from '../../../models';
import { getCurrentUser } from '../../../queries';
import { postData } from '../../../utils/fetchData';

const { Header } = Layout;

export const HeaderComponent = ()=> {
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
        padding: 20,
        borderRadius: 10,
      }}
    >
      <Space
        size={20}
        style={{
          paddingInline: 10,
        }}
      >
        <Avatar
          size="large"
          style={{
            border: '1px solid #009F9D',
            background: 'white',
          }}
          src={dataUser?.user?.avatar?.url}
        />

        <span>{dataUser?.user?.name}</span>
      </Space>
      <Divider />
      <Menu.Item icon={<ProfileOutlined />} key="1">Profile</Menu.Item>
      <Menu.Item icon={<LogoutOutlined />} key="2" onClick={onLogout}>
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
            <Dropdown overlay={menu} trigger={["click", "hover"]} placement="bottomRight">
              <Space style={{
                cursor: "pointer"
              }}>
                <Avatar
                  style={{
                    border: '1px solid #009F9D',
                    background: 'white',
                  }}
                  src={dataUser.user?.avatar?.url}
                />
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