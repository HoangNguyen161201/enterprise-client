import { ILogin, NextPageWithLayout } from '../models';
import { Button, Space, message } from 'antd';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validateLogin } from '../utils/validate';
import { Input, Select } from '../components/elements';
import Accounts from '../DataAccount.json';
import CopyAcc from '../components/elements/CopyAcc';

const login: NextPageWithLayout = () => {

  // setting form 
  const formSetting = useForm<ILogin>({
    resolver: yupResolver(validateLogin),
    defaultValues: {
      email: '',
      password: '',
      role: 'staff',
    },
  });

  const onSubmit = (values: ILogin) => {
    console.log(values);
  };

  const handleSetAcc = ({ email, role, password }: ILogin) => {
    formSetting.reset({
      email,
      password,
      role,
    });
    message.success({
      content: 'Copy account success',
    });
  };

  return (
    <>
      <Head>
        <title> Login </title>
      </Head>
      <Space className="screen-full justify-center" align="center">
        <form
          onSubmit={formSetting.handleSubmit(onSubmit)}
          style={{
            width: 340,
            padding: 20,
            border: '2px solid #009F9D',
            borderRadius: 10,
          }}
        >
          <p
            className="font-4"
            style={{
              fontWeight: 700,
              marginBottom: 15,
            }}
          >
            Login
          </p>
          <Space direction="vertical" size={30}>
            <Space direction="vertical" size={15}>
              <Input
                label="Email"
                placeholder="Enter your email"
                formSetting={formSetting}
                name={'email'}
                type="text"
              />
              <Input
                label="Password"
                placeholder="Enter your password"
                formSetting={formSetting}
                name={'password'}
                type="password"
              />
              <Select
                label="Role"
                placeholder="Enter your role"
                formSetting={formSetting}
                name={'role'}
              />
            </Space>
            <Button
              style={{
                borderRadius: 5,
              }}
              htmlType="submit"
              type="primary"
            >
              Login
            </Button>
            <Space
              direction="vertical"
              style={{
                width: '100%',
                position: 'relative',
              }}
            >
              {Accounts.map((acc) => (
                <CopyAcc acc={acc} handleSetAcc={handleSetAcc} />
              ))}
            </Space>
          </Space>
        </form>
      </Space>
    </>
  );
};

export default login;
