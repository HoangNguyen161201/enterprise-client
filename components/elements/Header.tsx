import { Button, message, Layout, Space, Typography } from 'antd';
import Link from 'next/link';
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
          zIndex: '1',
          borderBottom: '1px solid #efefef'
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
          <Button type="primary">
            <Link href={'/login'} passHref>
              <a>Login</a>
            </Link>
          </Button>
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
