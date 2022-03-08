import { ArrowLeftOutlined, KeyOutlined, UserOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, message, Result, Space } from 'antd';
import { AxiosError } from 'axios';
import { Input } from 'components/elements/form';
import { GlobalContext } from 'contextApi/globalContext';
import { ICommon } from 'models/apiType';
import { authMutation } from 'mutations/auth';
import Head from 'next/head';
import Link from 'next/link';
import { useContext as UseContext, useEffect as UseEffect, useState as UseState } from 'react';
import { useForm as UseForm } from 'react-hook-form';
import { validateRecoverPass } from 'utils/validate';

export default function recover_password() {
  const {handleLightMode} = UseContext(GlobalContext)

  const [isSMTP, setIsSMTP] = UseState(false);
  // call api to reset password by email
  const recoverPass = authMutation.recoverPass({
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: 'send mail success',
        });
        setIsSMTP(true);
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err,
        });
      },
    },
  });

  UseEffect(()=> {
    handleLightMode()
  },[])

  // setting form
  const formSetting = UseForm<{ email: string }>({
    resolver: yupResolver(validateRecoverPass),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = ({ email }: { email: string }) => {
    recoverPass.mutate(email);
  };

  return (
    <>
      <Head>
        <title>Recover Password Page</title>
      </Head>

      <Space
        size={30}
        direction="vertical"
        align="center"
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {isSMTP ? (
          <Result
            status="success"
            title="Check your email to reset password"
            subTitle="Thanks. If there's an account associated with this email address, we'll send the password reset instructions."
            extra={[
              <Space key={'/login'} size={15}>
                <ArrowLeftOutlined
                  style={{
                    color: '#009F9D',
                  }}
                />
                <Link href={'/login'}>
                  <a>Back to login</a>
                </Link>
              </Space>,
            ]}
          />
        ) : (
          <>
            <div
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: '#B0DEDD',
                boxShadow: '8px 10px 19px -2px rgba(0,0,0,0.15)',
              }}
            >
              <KeyOutlined
                style={{
                  transform: 'scale(2)',
                  color: '#009F9D',
                }}
              />
            </div>
            <Space align="center" direction="vertical">
              <span
                style={{
                  fontSize: 30,
                  fontWeight: 'bold',
                }}
              >
                Forgot your password?
              </span>
              <span
                style={{
                  color: 'gray',
                }}
              >
                Don&apos;t worry, we will email you to recover your password.
              </span>
            </Space>
            <form
              onSubmit={formSetting.handleSubmit(onSubmit)}
              style={{
                width: 350,
              }}
            >
              <Space direction="vertical" size={20}>
                <Space direction="vertical" size={15}>
                  <Input
                    label="Email"
                    placeholder="Enter your password"
                    formSetting={formSetting}
                    name={'email'}
                    type="email"
                    icon={<UserOutlined style={{ color: 'gray' }} />}
                  />
                </Space>
                <Button
                  loading={recoverPass.isLoading}
                  size="large"
                  block
                  style={{
                    borderRadius: 5,
                    fontSize: 16,
                  }}
                  htmlType="submit"
                  type="primary"
                >
                  Reset password
                </Button>
              </Space>
            </form>
            <Space size={15}>
              <ArrowLeftOutlined
                style={{
                  color: '#009F9D',
                }}
              />
              <Link href={'/login'}>
                <a>Back to login</a>
              </Link>
            </Space>
          </>
        )}
      </Space>
    </>
  );
}
