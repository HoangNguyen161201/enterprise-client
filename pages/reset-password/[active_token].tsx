import { ArrowLeftOutlined, UnlockOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, message, Space } from 'antd';
import { Input } from 'components/elements/form';
import { GlobalContext } from 'contextApi/globalContext';
import { resolveTxt } from 'dns/promises';
import { IResetPass } from 'models/formType';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { validateResetPass } from 'utils/validate';
import { authMutation } from 'mutations/auth';
import { AxiosError } from 'axios';
import { ICommon } from 'models/apiType';
import Link from 'next/link';

export default function ResetPass() {
  const { query, push } = useRouter();

  const { handleLightMode } = useContext(GlobalContext);
  const [activeToken, setActiveToken] = useState('');

  // setting form
  const formSetting = useForm<IResetPass>({
    resolver: yupResolver(validateResetPass),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });

  useEffect(() => {
    handleLightMode();
  }, []);

  useEffect(() => {
    if (query.active_token) {
      setActiveToken(query.active_token as string);
    }
  }, [query]);

  const resetPassM = authMutation.resetPass({
    options: {
      onSuccess: (data: ICommon) => {
        message.success(data.msg);
        push('/login', undefined, { shallow: true });
      },
      onError: (error: AxiosError) => {
        message.error(error.response?.data.err);
      },
    },
  });

  // submit login
  const onSubmit = (values: IResetPass) => {
    resetPassM.mutate({
      activeToken,
      password: values.password,
      passwordConfirm: values.passwordConfirm,
    });
  };

  return (
    <>
      <Head>
        <title>Reset Password Page</title>
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
        <form
          onSubmit={formSetting.handleSubmit(onSubmit)}
          style={{
            width: 400,
          }}
        >
          <Space direction="vertical" size={30}>
            <Space direction="vertical" size={15}>
              <Input
                type="password"
                name="password"
                label="Password"
                formSetting={formSetting}
                placeholder="Enter your password"
                icon={<UnlockOutlined style={{ color: 'gray' }} />}
              />
              <Input
                type="password"
                name="passwordConfirm"
                label="Confirm password"
                formSetting={formSetting}
                placeholder="Enter your password"
                icon={<UnlockOutlined style={{ color: 'gray' }} />}
              />
            </Space>
            <Button
              block
              size="large"
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
        ,
      </Space>
    </>
  );
}
