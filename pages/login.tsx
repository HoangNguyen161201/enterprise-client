import { yupResolver } from '@hookform/resolvers/yup';
import { Button, message, Space } from 'antd';
import { AxiosError } from 'axios';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Input, Select } from '../components/elements';
import CopyAcc from '../components/elements/CopyAcc';
import Accounts from '../DataAccount.json';
import { ILogin, NextPageWithLayout } from '../models';
import { getAccessToken } from '../queries';
import { postData } from '../utils/fetchData';
import { validateLogin } from '../utils/validate';

const login: NextPageWithLayout = () => {

  const {data, refetch} = getAccessToken()

  //  call api to get accessToken
  const mutationLogin = useMutation<{accessToken: string}, AxiosError, ILogin>((dataForm) => {
    return postData({
      url: '/api/auth/login',
      body: dataForm,
    }); 
  }, {
    onSuccess: (data)=> {
      console.log(data)
      refetch()
    },
    onError: (error)=> {
      console.log(error.response?.data)
    }
  });

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
    mutationLogin.mutate(values);
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
            <Button loading={mutationLogin.isLoading}
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
                <CopyAcc key={acc.role} acc={acc} handleSetAcc={handleSetAcc} />
              ))}
            </Space>
          </Space>
        </form>
      </Space>
    </>
  );
};

export default login;
