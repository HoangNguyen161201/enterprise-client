import { FileTextOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Breadcrumb, Button, Card, Col, message, Row, Space } from 'antd';
import { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Input, Select } from 'components/elements/form';
import { ClientLayout } from 'components/layouts';
import { IDepartments } from 'models/apiType';
import { IOptionSelect } from 'models/elementType';
import { IUserForm } from 'models/formType';
import { NextPageWithLayout } from 'models/layoutType';
import { getAllDepartments, getallUsers, getCurrentUser } from 'queries';
import { postData } from 'utils/fetchData';
import { validateAddUser } from 'utils/validate';
import { roleSelect } from 'utils/dataSelect';

export interface IAddEmployeeProps {
  allDepartments: IDepartments;
}

const AddEmployee: NextPageWithLayout = ({ allDepartments }: IAddEmployeeProps) => {
  //Data select department
  const [departmentSl, setDepartmentSL] = React.useState<IOptionSelect[]>([]);

  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();

  //Get all data departments
  const { error: errorAllDepartments, data: dataAllDepartments } = getAllDepartments(
    dataUser?.accessToken.token,
    allDepartments
  );

  //Get all data user
  const { refetch: dataAllUsersRefetch } = getallUsers(dataUser?.accessToken.token);

  //Set data select departmen
  React.useEffect(() => {
    if (dataAllDepartments && dataAllDepartments.departments) {
      const valueSetDepartmentSl: IOptionSelect[] = dataAllDepartments.departments.map(
        (department) => {
          return {
            value: department._id,
            label: department.name,
          };
        }
      );

      setDepartmentSL(valueSetDepartmentSl);
    }
  }, [dataAllDepartments]);

  //Check exist and show error
  React.useEffect(() => {
    if (errorGetUser) {
      message.error({
        content: errorGetUser.response?.data.err,
      });
    }
  }, [errorGetUser]);

  React.useEffect(() => {
    if (errorAllDepartments) {
      message.error({
        content: errorAllDepartments.response?.data.err,
      });
    }
  }, [errorAllDepartments]);

  //  call api to add user
  const mutationAddUser = useMutation<any, AxiosError, IUserForm>(
    (dataForm) => {
      return postData({
        url: '/api/users',
        body: dataForm,
        token: dataUser?.accessToken.token,
      });
    },
    {
      onSuccess: (data) => {
        message.success({
          content: data.msg,
        });
        dataAllUsersRefetch();
      },
      onError: (error) => {
        message.error({
          content: error.response?.data.err || 'Create user false.',
        });
      },
    }
  );

  // setting form
  const formSetting = useForm<IUserForm>({
    resolver: yupResolver(validateAddUser),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      cf_password: '',
      role: 'staff',
      department_id: '',
    },
  });

  const onSubmit = async (dataForm: IUserForm) => {
    //Refetch again let get accesstoken pass to api
    await dataUserRefetch();

    //Post add data user
    mutationAddUser.mutate(dataForm);
  };

  //Clear data update
  const onClearData = () => {
    formSetting.reset({
      name: '',
      email: '',
      password: '',
      cf_password: '',
      role: 'staff',
      department_id: '',
    });
  };

  return (
    <>
      <Head>
        <title>Add Employee Page</title>
      </Head>

      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Employees</Breadcrumb.Item>
        <Breadcrumb.Item>Add Employee</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="Add Employee"
        extra={
          <a href="#" onClick={onClearData}>
            Clear
          </a>
        }
        style={{ width: '100%', marginTop: '20px' }}
      >
        <form onSubmit={formSetting.handleSubmit(onSubmit)}>
          <Space direction="vertical" size={20}>
            <Row gutter={[20, 20]}>
              <Col xs={24} sm={24} md={12}>
                <Input
                  name="name"
                  label="Name"
                  formSetting={formSetting}
                  placeholder="Enter name"
                  type="text"
                  icon={<FileTextOutlined />}
                />
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Input
                  name="email"
                  label="Email"
                  formSetting={formSetting}
                  placeholder="Enter email"
                  type="email"
                  icon={<MailOutlined />}
                />
              </Col>
              <Col xs={24} md={12}>
                <Input
                  name="password"
                  label="Password"
                  formSetting={formSetting}
                  placeholder="Enter password"
                  type="password"
                  icon={<LockOutlined />}
                />
              </Col>
              <Col xs={24} md={12}>
                <Input
                  name="cf_password"
                  label="Confirm Password"
                  formSetting={formSetting}
                  placeholder="Confirm password"
                  type="password"
                  icon={<LockOutlined />}
                />
              </Col>
              <Col xs={24} md={12}>
                <Select
                  formSetting={formSetting}
                  name="role"
                  label="Role"
                  placeholder="Please select role"
                  data={roleSelect}
                />
              </Col>
              <Col xs={24} md={12}>
                <Select
                  formSetting={formSetting}
                  name="department_id"
                  label="Department"
                  placeholder="Please select department"
                  data={departmentSl}
                  require={false}
                />
              </Col>
            </Row>
            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              <Button loading={mutationAddUser.isLoading} htmlType="submit" type="primary">
                Add
              </Button>
            </div>
          </Space>
        </form>
      </Card>
    </>
  );
};

export default AddEmployee;

AddEmployee.getLayout = ClientLayout;

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

  //Get all department
  const allDepartments: IDepartments = await fetch(`http://localhost:3000/api/departments`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  }).then((e) => e.json());

  return {
    props: {
      allDepartments,
    },
  };
};
