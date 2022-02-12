import { Button, message } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
import { useMutation } from 'react-query';
import { ILogout } from '../../models';
import { postData } from '../../utils/fetchData';

export default function Header() {
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
    <div>
      <Button
        loading={logoutMutation.isLoading}
        onClick={() => {
          logoutMutation.mutate();
        }}
      >
        Logout
      </Button>
    </div>
  );
}
