import { FileTextOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Breadcrumb, Button, Card, message, Space } from 'antd';
import { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter as UseRouter } from 'next/router';
import { useEffect as UseEffect } from 'react';
import { useForm as UseForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Input, TextArea } from '../../../components/elements';
import { ClientLayout } from '../../../components/layouts';
import { IDepartmentForm, NextPageWithLayout } from '../../../models';
import { getCurrentUser } from '../../../queries';
import { getDetailDepartment } from '../../../queries/department';
import { putData, validateAddDepartment } from '../../../utils';

export interface IUpdateDepartmetnProps {}

const UpdateDepartmetn: NextPageWithLayout = (props: IUpdateDepartmetnProps) => {
  //Get id from router to get old data
  const {
    query: { id },
  } = UseRouter();

  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();

  //Get old data department
  const { error: errorDepartment, data: dataDepartment } = getDetailDepartment(
    id as string,
    dataUser?.accessToken.token
  );

  //Check exist and show error get data department
  UseEffect(() => {
    if (errorDepartment) {
      message.error({
        content: errorDepartment.response?.data.err,
      });
    }

    if (errorGetUser) {
      message.error({
        content: errorGetUser.response?.data.err,
      });
    }
  }, [errorDepartment]);

  //Check exist and show error get data user - access token
  UseEffect(() => {
    if (errorGetUser) {
      message.error({
        content: errorGetUser.response?.data.err,
      });
    }
  }, [errorGetUser]);

  // setting form
  const formSetting = UseForm<{ id: string; name: string; description: string }>({
    resolver: yupResolver(validateAddDepartment),
    defaultValues: {
      id: id as string,
      name: '',
      description: '',
    },
  });

  //reset Initial value update data from when have old data department
  UseEffect(() => {
    if (dataDepartment) {
      formSetting.reset({
        id: id as string,
        name: dataDepartment.department.name,
        description: dataDepartment.department.description,
      });
    }
  }, [dataDepartment]);

  //  call api to add deartment
  const mutationUpdateDepartment = useMutation<any, AxiosError, IDepartmentForm>(
    (dataForm) => {
      return putData({
        url: `/api/departments/${dataForm.id}`,
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

  const onSubmit = async ({
    id,
    name,
    description,
  }: {
    id: string;
    name: string;
    description: string;
  }) => {
    //Refetch again data user let get accesstoken
    await dataUserRefetch();

    //Put data update department
    mutationUpdateDepartment.mutate({ id, name, description });
  };

  //Clear data update
  const onClearData = () => {
    formSetting.reset({
      id: id as string,
      name: '',
      description: '',
    });
  };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Departments</Breadcrumb.Item>
        <Breadcrumb.Item>All Departments</Breadcrumb.Item>
        <Breadcrumb.Item>Update Department</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="Update Department"
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
              name="id"
              label="Id"
              formSetting={formSetting}
              placeholder="Enter department id"
              type="text"
              disable={true}
              icon={<FileTextOutlined />}
            />
            <Input
              name="name"
              label="Name"
              formSetting={formSetting}
              placeholder="Enter department name"
              type="text"
              icon={<FileTextOutlined style={{color: 'gray'}}/>}
            />
            <TextArea name="description" label="Description" formSetting={formSetting} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              <Button loading={mutationUpdateDepartment.isLoading} htmlType="submit" type="primary">
                Save
              </Button>
            </div>
          </Space>
        </form>
      </Card>
    </>
  );
};

UpdateDepartmetn.getLayout = ClientLayout;

export default UpdateDepartmetn;

export const getServerSideProps: GetServerSideProps = async (context) => {
  //Check login
  const res = await fetch('http://localhost:3000/api/auth/accesstoken', {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  });

  const data = await res.json();

  console.log(res, data);
  
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
