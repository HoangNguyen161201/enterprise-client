import { UnlockOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Space } from 'antd';
import { Input } from 'components/elements/form';
import { GlobalContext } from 'contextApi/globalContext';
import { IResetPass } from 'models/formType';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { validateResetPass } from 'utils/validate';

export default function ResetPass() {
  const {handleLightMode} = useContext(GlobalContext)

  // setting form
  const formSetting = useForm<IResetPass>({
    resolver: yupResolver(validateResetPass),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });

  // submit login
  const onSubmit = (values: any) => {
      console.log(values)
  };

  useEffect(()=> {
    handleLightMode()
  }, [])

  const { query } = useRouter();
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
      </Space>
    </>
  );
}
