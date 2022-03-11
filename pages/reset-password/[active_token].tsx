import { ArrowLeftOutlined, UnlockOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, message, Space } from 'antd';
import { AxiosError } from 'axios';
import { Input } from 'components/elements/form';
import { GlobalContext } from 'contextApi/globalContext';
import { ICommon } from 'models/apiType';
import { IResetPass } from 'models/formType';
import { authMutation } from 'mutations/auth';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter as UseRouter } from 'next/router';
import React, {
  useContext,
  useContext as UseContext,
  useEffect as UseEffect,
  useState as UseState,
} from 'react';
import ReactConfetti from 'react-confetti';
import { useForm } from 'react-hook-form';
import { validateResetPass } from 'utils/validate';

export default function ResetPass() {

  const {handleLoadPage} = useContext(GlobalContext)

  UseEffect(()=> {
    handleLoadPage(false)
  }, [])

  const {useBreakpoint: UseBreakpoint} = Grid
  const {sm} = UseBreakpoint()

  const [width, setWidth] = UseState(300);
  const [height, setHeight] = UseState(500);
  const [run, setRun] = UseState(false);

  const { query, push } = UseRouter();

  const { handleLightMode } = UseContext(GlobalContext);
  const [activeToken, setActiveToken] = UseState('');

  // setting form
  const formSetting = useForm<IResetPass>({
    resolver: yupResolver(validateResetPass),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });

  UseEffect(() => {
    handleLightMode();
  }, []);

  UseEffect(() => {
    if (query.active_token) {
      setActiveToken(query.active_token as string);
    }
  }, [query]);
  UseEffect(() => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }, [run]);

  const resetPassM = authMutation.resetPass({
    options: {
      onSuccess: (data: ICommon) => {
        setRun(true)
        message.success(data.msg);
        setTimeout(()=> {
          handleLoadPage(true)
          push('/login', undefined, { shallow: true });
        }, 1000)
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
    <div
      style={{
        overflow: 'hidden',
        padding: '25px 40px'
      }}
    >
      {
        run && (
          <ReactConfetti width={width} numberOfPieces={200}  height={height} />
        )
      }
      <Head>
        <title>Reset Password</title>
      </Head>

      <div
        style={{
          width: '100%',
          height: '95vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <span
          style={{
            fontSize: !sm ? 20: 30,
            fontWeight: 'bold',
            maxWidth: 400,
            width: '100%',
            marginBottom: 15
          }}
        >
          Reset password
        </span>
        <form
          onSubmit={formSetting.handleSubmit(onSubmit)}
          style={{
            maxWidth: 400,
            width: '100%',
          }}
        >
          <Space direction="vertical" size={30} style={{
            marginBottom: 15
          }}>
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
            <a onClick={()=> handleLoadPage(true)}>Back to login</a>
          </Link>
        </Space>
      </div>
    </div>
  );
}
