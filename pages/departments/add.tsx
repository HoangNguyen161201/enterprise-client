import { FileTextOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Breadcrumb, Button, Card, message, Space } from 'antd';
import { AxiosError } from 'axios';
import { Input, TextArea } from 'components/elements/form';
import { ClientLayout } from 'components/layouts';
import { ICommon, IDetailUser } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import { departmentMutation } from 'mutations/department';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getCurrentUser } from 'queries/auth';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { validateAddDepartment } from 'utils/validate';

export interface IAddDepartmentProps {
  detailUser: IDetailUser
}

const AddDepartment: NextPageWithLayout = ({detailUser}: IAddDepartmentProps) => {
  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser(detailUser);

  //  call api to add deartment
  const mutationAddDepartment = departmentMutation.add({
    dataUserRefetch: dataUserRefetch,
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Create department false.',
        });
      },
    },
    token: dataUser?.accessToken.token,
  });

  //Check exist and show error
  React.useEffect(() => {
    if (errorGetUser) {
      message.error({
        content: errorGetUser.response?.data.err,
      });
    }
  }, [errorGetUser]);

  // setting form
  const formSetting = useForm<{ name: string; description: string }>({
    resolver: yupResolver(validateAddDepartment),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async ({ name, description }: { name: string; description: string }) => {
    //Post add data department
    mutationAddDepartment.mutate({ name, description });
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
        <title>Add Department Page</title>
      </Head>

      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Departments</Breadcrumb.Item>
        <Breadcrumb.Item>Add Department</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="Add Department"
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

export default AddDepartment;

AddDepartment.getLayout = ClientLayout;

export const getServerSideProps: GetServerSideProps = async (context) => {
  //Check login
  const detailUser: IDetailUser = await fetch(`http://localhost:3000/api/auth/accesstoken`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  }).then((e) => e.json());

  //Redirect login page when error
  if (detailUser.statusCode !== 200) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  //Check role
  if (detailUser.user.role !== 'admin' && detailUser.user.role !== 'qa_manager') {
    return {
      notFound: true,
    };
  }

  return {
    props: {detailUser},
  };
};
