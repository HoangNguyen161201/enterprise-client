import { FileTextOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Col, message, Row, Space } from 'antd';
import { AxiosError } from 'axios';
import { BreadCrumb } from 'components/elements/common';
import { Input, Select } from 'components/elements/form';
import { ClientLayout } from 'components/layouts';
import { GlobalContext } from 'contextApi/globalContext';
import { ICommon, IDepartments, IDetailUser } from 'models/apiType';
import { IOptionSelect } from 'models/elementType';
import { IUserForm } from 'models/formType';
import { NextPageWithLayout } from 'models/layoutType';
import { EmplMutation } from 'mutations/employee';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getAllDepartments, getallUsers, getCurrentUser, getUsersNotDepartment } from 'queries';
import { useContext as UseContext, useEffect as UseEffect,  useState as   UseState } from 'react';
import { useForm } from 'react-hook-form';
import { roleSelect } from 'utils/dataSelect';
import { validateAddUser } from 'utils/validate';

export interface IAddEmployeeProps {
  allDepartments: IDepartments;
  detailUser: IDetailUser;
}

const AddEmployee: NextPageWithLayout = ({ allDepartments, detailUser }: IAddEmployeeProps) => {
  const { color, color2, handleLoadPage } = UseContext(GlobalContext);

  UseEffect(() => {
    handleLoadPage(false);
  }, []);

  //Data select department
  const [departmentSl, setDepartmentSL] = UseState<IOptionSelect[]>([]);

  //Get access token
  const {
    data: dataUser,
    error: errorGetUser,
    refetch: dataUserRefetch,
  } = getCurrentUser(detailUser);

  //Get all data departments
  const { error: errorAllDepartments, data: dataAllDepartments } = getAllDepartments(
    dataUser?.accessToken.token,
    allDepartments
  );

  //Get all data user
  const { refetch: dataAllUsersRefetch } = getallUsers(dataUser?.accessToken.token);

  //Get list users not have department
  const { refetch: dataUsersnotDPMRefetch } = getUsersNotDepartment(dataUser?.accessToken.token);

  //Set data select departmen
  UseEffect(() => {
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
  UseEffect(() => {
    if (errorGetUser) {
      message.error({
        content: errorGetUser.response?.data.err,
      });
    }
  }, [errorGetUser]);

  UseEffect(() => {
    if (errorAllDepartments) {
      message.error({
        content: errorAllDepartments.response?.data.err,
      });
    }
  }, [errorAllDepartments]);

  //  call api to add user
  const mutationAddUser = EmplMutation.add({
    token: dataUser?.accessToken.token,
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });
        dataUsersnotDPMRefetch();
        dataAllUsersRefetch();
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Create user false.',
        });
      },
    },
    dataUserRefetch: dataUserRefetch,
  });

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
        <title>Add Employee</title>
      </Head>

      <BreadCrumb
        data={[
          {
            url: '/',
            label: 'Home',
          },
          {
            url: '/employees',
            label: 'All employees',
          },
        ]}
        main={{
          url: `/employees/add`,
          label: 'Add new employees',
        }}
      />

      <Card
        title={<span className={`${color}`}>Add Employee</span>}
        extra={
          <a href="#" onClick={onClearData}>
            Clear
          </a>
        }
        className="card-b shadow-l"
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
              <Button
                loading={mutationAddUser.isLoading}
                htmlType="submit"
                type="primary"
                style={{ borderRadius: 5 }}
                className={`${color2}`}
              >
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

  //Get all department
  const allDepartments: IDepartments = await fetch(`${process.env.CLIENT_URL}/api/departments`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
      authorization: detailUser.accessToken.token,
    } as HeadersInit,
  }).then((e) => e.json());

  //Redirect 404 page when not have detail allDepartments
  if (allDepartments.statusCode !== 200) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      allDepartments,
      detailUser,
    },
  };
};
