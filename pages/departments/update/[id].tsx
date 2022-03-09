import { FileTextOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, message, Space } from 'antd';
import { AxiosError } from 'axios';
import { BreadCrumb } from 'components/elements/common';
import { Input, TextArea } from 'components/elements/form';
import { ClientLayout } from 'components/layouts';
import { GlobalContext } from 'contextApi/globalContext';
import { ICommon, IDetailDepartment, IDetailUser } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import { departmentMutation } from 'mutations/department';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter as UseRouter } from 'next/router';
import { getCurrentUser } from 'queries';
import { getDetailDepartment } from 'queries/department';
import { useContext, useEffect as UseEffect } from 'react';
import { useForm as UseForm } from 'react-hook-form';
import { validateAddDepartment } from 'utils/validate';

export interface IUpdateDepartmetnProps {
  detailDepartment: IDetailDepartment;
  detailUser: IDetailUser;
}

const UpdateDepartmetn: NextPageWithLayout = ({ detailDepartment, detailUser }: IUpdateDepartmetnProps) => {
  
  const { color,color2 } = useContext(GlobalContext);
  
  //Get id from router to get old data
  const {
    query: { id },
  } = UseRouter();

  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser(detailUser);

  //Get old data department
  const { error: errorDepartment, data: dataDepartment } = getDetailDepartment(
    id as string,
    dataUser?.accessToken.token,
    detailDepartment
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

  //  call api to update deartment
  const mutationUpdateDepartment = departmentMutation.update({
    dataUserRefetch: dataUserRefetch,
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Update department false.',
        });
      },
    },
    token: dataUser?.accessToken.token,
  });

  const onSubmit = async ({
    id,
    name,
    description,
  }: {
    id: string;
    name: string;
    description: string;
  }) => {
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
      <Head>
        <title>Update Department Page</title>
      </Head>

      <BreadCrumb data={[
        {
          url: '/',
          label: 'Home'
        },
        {
          url: '/departments',
          label: 'All departments'
        }
      ]} main={{
        url: `/departments/update/${id}`,
        label: 'Update departments'
      }}/>

      <Card
        title={<span className={`${color}`}>Update Department</span>}
        extra={
          <a href="#" onClick={onClearData}>
            Clear
          </a>
        }
        className='card-b shadow-l'
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
              icon={<FileTextOutlined style={{ color: 'gray' }} />}
            />
            <TextArea name="description" label="Description" formSetting={formSetting} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              <Button style={{borderRadius: 5}} className={`${color2}`} loading={mutationUpdateDepartment.isLoading} htmlType="submit" type="primary">
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
  const detailUser: IDetailUser = await fetch(`${process.env.CLIENT_URL}/api/auth/accesstoken`, {
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

  const detailDepartment: IDetailDepartment = await fetch(
    `${process.env.CLIENT_URL}/api/departments/${context.query.id}`,
    {
      method: 'GET',
      headers: {
        cookie: context.req.headers.cookie,
        authorization: detailUser.accessToken.token,
      } as HeadersInit,
    }
  ).then((e) => e.json());

  //Redirect 404 page when not have detail department
  if (detailDepartment.statusCode !== 200) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      detailDepartment,
      detailUser,
    },
  };
};
