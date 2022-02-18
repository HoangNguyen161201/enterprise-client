import { Breadcrumb, Button, Card, message, Space } from 'antd';
import { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import * as React from 'react';
import { useMutation } from 'react-query';
import { ClientLayout } from '../../components/layouts';
import { IAllUsers, IUserForm } from '../../models';
import { NextPageWithLayout } from '../../models/layoutType';
import { getallUsers, getCurrentUser } from '../../queries';
import { deleteData, putData } from '../../utils';

export interface IEmployeesProps {
  allUsers: IAllUsers;
}

const Employees: NextPageWithLayout = ({ allUsers }: IEmployeesProps) => {
  //Data all users
  console.log(allUsers);

  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();

  //Get all data user
  const { error: errorAllUsers, data: dataAllUsers } = getallUsers(
    dataUser?.accessToken.token,
    allUsers
  );

  //Check exist and show error
  React.useEffect(() => {
    if (errorAllUsers) {
      message.error({
        content: errorAllUsers.response?.data.err,
      });
    }
  }, [errorAllUsers]);

  //    mutation call api to update User
  const mutationUpdateUser = useMutation<any, AxiosError, Partial<IUserForm>>(
    ({ id, name, email, role, department_id }) => {
      return putData({
        url: `/api/users/${id}`,
        body: {
          name,
          role,
          email,
          department_id,
        },
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
          content: error.response?.data.err || 'Update User false.',
        });
      },
    }
  );

  //  mutation call api to delete Users
  const mutationDeleteUser = useMutation<any, AxiosError, Partial<IUserForm>>(
    ({ id }) => {
      return deleteData({
        url: `/api/users/${id}`,
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
          content: error.response?.data.err || 'Delete User false.',
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

  //Function handle update user
  const updateUser = async () => {
    //Refetch again let get accesstoken pass to api
    await dataUserRefetch();

    //Put data update user
    mutationUpdateUser.mutate({
      id: '620dfa643ed7da2a45b46ed9',
      name: 'Nguyen huy',
      email: 'huy1212@gmail.com',
      role: 'admin',
      department_id: '6208aab5491e8da35ed5d5f1',
    });
  };

  //Function handle delete users
  const deleteUser = async () => {
    //Refetch again let get accesstoken pass to api
    await dataUserRefetch();

    //Delete user
    mutationDeleteUser.mutate({
      id: '620dfa6a3ed7da2a45b46edd',
    });
  };

  return (
    <>
      <Head>
        <title>All Employees Page</title>
      </Head>

      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>All Employees</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="All Employees" style={{ width: '100%', marginTop: '20px' }}>
        <Space direction="vertical" size={20}>
          <Button type="primary" onClick={deleteUser}>
            Delete User
          </Button>

          <Button type="primary" onClick={updateUser}>
            Update User
          </Button>
        </Space>
      </Card>
    </>
  );
};

export default Employees;

Employees.getLayout = ClientLayout;

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

  //Get all data users
  const allUsers: IAllUsers = await fetch(`http://localhost:3000/api/users`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  }).then((e) => e.json());

  return {
    props: {
      allUsers,
    },
  };
};
