import { UnlockOutlined, UserOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Divider, message, Space, Grid} from 'antd';
import { AxiosError } from 'axios';
import { CopyAcc } from 'components/elements/common';
import { Input, Select } from 'components/elements/form';
import { GlobalContext } from 'contextApi/globalContext';
import Accounts from 'DataAccount.json';
import { IAccessToken, IDetailUser } from 'models/apiType';
import { IOptionSelect } from 'models/elementType';
import { ILogin } from 'models/formType';
import { NextPageWithLayout } from 'models/layoutType';
import { authMutation } from 'mutations/auth';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter as UseRouter } from 'next/router';
import { getCurrentUser } from 'queries/auth';
import { useContext as UseContext, useEffect as UseEffect, useMemo as UseMemo } from 'react';
import { useForm as UseForm } from 'react-hook-form';
import { validateLogin } from 'utils/validate';

const login: NextPageWithLayout = () => {
  const {useBreakpoint: UseBreakpoint} = Grid
  const {sm} = UseBreakpoint()
  const { handleLightMode, handleLoadPage} = UseContext(GlobalContext)

  const { refetch } = getCurrentUser();
  const { push } = UseRouter();
  const options = UseMemo<IOptionSelect[]>(
    () => [
      {
        value: 'admin',
        label: 'Admin',
      },
      {
        value: 'staff',
        label: 'Staff',
      },
      {
        value: 'qa_manager',
        label: 'QA_Manager',
      },
      {
        value: 'qa_coordinator',
        label: 'QA_Coordinator',
      },
      {
        value: 'department_manager',
        label: 'Department_manager',
      },
    ],
    []
  );

  UseEffect(()=> {
    handleLightMode()
    handleLoadPage(false)
  },[])

  //  call api to get accessToken
  const mutationLogin = authMutation.login({
    options: {
      onSuccess: (data: IAccessToken) => {
        if (data.status == 'success') {
          message.success({
            content: data.msg,
          });

          // get accessToken and user information
          refetch();
          localStorage.setItem('first-login', 'true');
          handleLoadPage(true)
          push('/', undefined, { shallow: true });
        }
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Login failed',
        });
      },
    }
  })

  // setting form
  const formSetting = UseForm<ILogin>({
    resolver: yupResolver(validateLogin),
    defaultValues: {
      email: '',
      password: '',

    },
  });

  // submit login
  const onSubmit = (values: ILogin) => {
    mutationLogin.mutate(values);
  };

  const handleSetAcc = ({ email, password }: ILogin) => {
    formSetting.reset({
      email,
      password,
    });
    message.success({
      content: 'Copy account success',
    });
  };

  

  return (
    <>
      <Head>
        <title> Login</title>
      </Head>

      <div style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 25px'
      }} className="screen-full bg-awesome" >
        <form
          onSubmit={formSetting.handleSubmit(onSubmit)}
          style={{
            width: !sm ? '100%' : 350,
            padding: 20,
            border: '2px solid #009F9D',
            borderRadius: 10,
            background: 'white'
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
                type="email"
                icon={<UserOutlined style={{ color: 'gray' }} />}
              />
              <Input
                label="Password"
                placeholder="Enter your password"
                formSetting={formSetting}
                name={'password'}
                type="password"
                icon={<UnlockOutlined style={{ color: 'gray' }} />}
              />
            </Space>
            <Space
              size={10}
              direction="horizontal"
              style={{
                alignItems: 'space-between',
                justifyContent: 'space-between',
                display: 'flex',
              }}
            >
              <Button
                size="large"
                loading={mutationLogin.isLoading}
                style={{
                  borderRadius: 5,
                  fontSize: 16,
                }}
                htmlType="submit"
                type="primary"
              >
                Login
              </Button>
              <Link href={'/recover-password'}>
                <a onClick={()=> handleLoadPage(true)} className="font-1 color-3">Forget password?</a>
              </Link>
            </Space>
          </Space>
          <Divider />
          <Space
            direction="vertical"
            style={{
              width: '100%',
              position: 'relative',
            }}
          >
            {Accounts.map((acc) => (
              <CopyAcc key={acc.email} acc={acc} handleSetAcc={handleSetAcc} />
            ))}
          </Space>
        </form>
      </div>
    </>
  );
};

export default login;


export const getServerSideProps: GetServerSideProps = async (context) => {
  //Check login
  const detailUser: IDetailUser = await fetch(`${process.env.CLIENT_URL}/api/auth/accesstoken`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  }).then((e) => e.json());

  //Redirect login page when error
  if (detailUser.statusCode === 200) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      detailUser,
    },
  };
};

