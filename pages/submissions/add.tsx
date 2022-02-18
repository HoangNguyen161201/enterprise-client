import { FileTextOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Breadcrumb, Button, Card, message, Space, DatePicker } from 'antd';
import { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Input, TextArea } from '../../components/elements';
import { ClientLayout } from '../../components/layouts';
import { IDepartmentForm, ISubmissionForm } from '../../models';
import { NextPageWithLayout } from '../../models/layoutType';
import { getCurrentUser } from '../../queries';
import { postData, validateAddDepartment, validateAddSubmission } from '../../utils';

const { RangePicker } = DatePicker;

export interface IAddSubmissionProps {}

const AddSubmission: NextPageWithLayout = (props: IAddSubmissionProps) => {
  //Sate closure_date and final_closure_date
  const [clousureTime, setClousureTime] = React.useState<string[]>(['', '']);

  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();

  //  call api to add deartment
  const mutationAddDepartment = useMutation<any, AxiosError, ISubmissionForm>(
    (dataForm) => {
      return postData({
        url: '/api/submissions',
        body: dataForm,
        token: dataUser?.accessToken.token,
      });
    },
    {
      onSuccess: (data) => {
        message.success({
          content: data.msg,
        });
      },
      onError: (error) => {
        message.error({
          content: error.response?.data.err || 'Create Submission false.',
        });
      },
    }
  );

  //Check exist and show error
  React.useEffect(() => {
    if (errorGetUser) {
      message.error({
        content: errorGetUser.response?.data.err,
      });
    }
  }, [errorGetUser]);

  //Handle change time clousure
  const onChangeClousureTime = (date: any, dateString: [string, string]) => {
    setClousureTime(dateString);
  };

  // setting form
  const formSetting = useForm<{ name: string; description: string }>({
    resolver: yupResolver(validateAddSubmission),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async ({ name, description }: { name: string; description: string }) => {
    //   ame, description, closure_date, final_closure_date
    //Refetch again let get accesstoken pass to api
    await dataUserRefetch();

    //Post add data department
    mutationAddDepartment.mutate({
      name,
      description,
      closure_date: clousureTime[0],
      final_closure_date: clousureTime[1],
    });
  };

  //Clear data update
  const onClearData = () => {
    formSetting.reset({
      name: '',
      description: '',
    });
  };

  return (
    <>
      <Head>
        <title>Add Submission Page</title>
      </Head>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Submission</Breadcrumb.Item>
        <Breadcrumb.Item>Add Submission</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="Add Submission"
        extra={
          <a href="#" onClick={onClearData}>
            Clear
          </a>
        }
        style={{ width: '100%', marginTop: '20px' }}
      >
        <form onSubmit={formSetting.handleSubmit(onSubmit)}>
          <Space direction="vertical" size={20}>
            <Input
              name="name"
              label="Name"
              formSetting={formSetting}
              placeholder="Enter department name"
              type="text"
              icon={<FileTextOutlined />}
            />

            <RangePicker
              placeholder={['Select closure date', 'Select final date']}
              onChange={onChangeClousureTime}
              renderExtraFooter={() => 'extra footer'}
              showTime
            />

            <TextArea name="description" label="Description" formSetting={formSetting} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              <Button loading={mutationAddDepartment.isLoading} htmlType="submit" type="primary">
                Add
              </Button>
            </div>
          </Space>
        </form>
      </Card>
    </>
  );
};

export default AddSubmission;

AddSubmission.getLayout = ClientLayout;

export const getServerSideProps: GetServerSideProps = async (context) => {
  //Check login
  const res = await fetch('http://localhost:3000/api/auth/accesstoken', {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  });

  const data = await res.json();

  //Redirect login page when error
  if (res.status !== 200) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  //Check role
  if (data.user.role !== 'admin') {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};
