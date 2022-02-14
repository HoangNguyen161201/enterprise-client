import { Button, message, Layout, Space, Typography } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
import { useMutation } from 'react-query';
import { ILogout } from '../../models';
import { postData } from '../../utils/fetchData';

const { Header } = Layout;

export default function HeaderComponent() {
  const { push } = useRouter();
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

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  return (
    <>
      <Header
        style={{
          padding: '0px 40px',
          backgroundColor: 'white',
          boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
          zIndex: '1',
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
          <Button type="primary">Login</Button>
        </Space>
      </Header>
      {/* <Button
        loading={logoutMutation.isLoading}
        onClick={() => {
          logoutMutation.mutate();
        }}
      >
        Logout
      </Button> */}
    </>
  );
}
