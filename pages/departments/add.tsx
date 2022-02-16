import { FileTextOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Breadcrumb, Button, Card, message, Space } from 'antd';
import { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Input, TextArea } from '../../components/elements';
import { ClientLayout } from '../../components/layouts';
import { IDepartment } from '../../models';
import { NextPageWithLayout } from '../../models/layoutType';
import { getCurrentUser } from '../../queries';
import { postData, validateAddDepartment } from '../../utils';

export interface IAddDepartmentProps {}

const AddDepartment: NextPageWithLayout = (props: IAddDepartmentProps) => {
  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();

  //  call api to add deartment
  const mutationAddDepartment = useMutation<any, AxiosError, IDepartment>(
    (dataForm) => {
      return postData({
        url: '/api/departments',
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
          content: error.response?.data.err || 'Create department false.',
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

  // setting form
  const formSetting = useForm<{ name: string; description: string }>({
    resolver: yupResolver(validateAddDepartment),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async ({ name, description }: { name: string; description: string }) => {
    //Refetch again let get accesstoken pass to api
    await dataUserRefetch();

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
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Departments</Breadcrumb.Item>
        <Breadcrumb.Item>Add Department</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="Add Department"
        extra={<a href="#" onClick={onClearData}>Clear</a>}
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
