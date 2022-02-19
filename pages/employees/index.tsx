import {
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Table,
  Button,
  Card,
  message,
  Space,
  Tag,
  Image,
  Menu,
  Dropdown,
  Input,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import * as React from 'react';
import { useMutation } from 'react-query';
import { ClientLayout } from '../../components/layouts';
import { IAllUsers, IUser, IUserForm } from '../../models';
import { NextPageWithLayout } from '../../models/layoutType';
import { getallUsers, getCurrentUser } from '../../queries';
import { column, deleteData, postData, putData } from '../../utils';

export interface IEmployeesProps {
  allUsers: IAllUsers;
}

const Employees: NextPageWithLayout = ({ allUsers }: IEmployeesProps) => {
  //Data source table users
  const [dataSourceUsers, setDataSourceUsers] = React.useState<Partial<IUser>[]>([]);

  //Data user select
  const [usersSl, setUsersSl] = React.useState<null | string[]>(null);

  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();

  //Get all data user
  const {
    error: errorAllUsers,
    data: dataAllUsers,
    refetch: dataAllUsersRefetch,
  } = getallUsers(dataUser?.accessToken.token, allUsers);

  //Set data source for table users
  React.useEffect(() => {
    let newDataSourceUsers: Partial<IUser>[] = [];
    if (dataAllUsers) {
      newDataSourceUsers = dataAllUsers.users.map((user) => {
        return {
          key: user._id,
          name_avatar: { name: user.name, avatar: user.avatar.url },
          root: user.root,
          role: user.role,
          email: user.email,
          active: '',
        };
      });
    }
    setDataSourceUsers(newDataSourceUsers);
  }, [dataAllUsers]);
  console.log(usersSl);

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

  //  mutation call api to delete User
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
        dataAllUsersRefetch();
      },
      onError: (error) => {
        message.error({
          content: error.response?.data.err || 'Delete User false.',
        });
      },
    }
  );

  //  mutation call api to delete many Users
  const mutationDeleteManyUser = useMutation<any, AxiosError, { users: string[] }>(
    ({ users }) => {
      return postData({
        url: `/api/users/delete-many`,
        body: {
          users
        },
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
          content: error.response?.data.err || 'Delete Users false.',
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

  //Function handle delete user
  const deleteUser = async (id: string) => {
    //Refetch again let get accesstoken pass to api
    await dataUserRefetch();

    //Delete user
    mutationDeleteUser.mutate({
      id,
    });
  };

  //Function handle delete many users
  const deleteManyUser = async (users: string[]) => {
    //Refetch again let get accesstoken pass to api
    await dataUserRefetch();

    //Delete users
    mutationDeleteManyUser.mutate({
      users,
    });
  };

  //Seting column table users
  const columns: ColumnsType<any> = [
    {
      ...column({
        title: 'Name',
        dataIndex: 'name_avatar',
        key: 'name_avatar',
      }),
      render: (value) => (
        <Space size={20}>
          <Image width={40} height={40} style={{ objectFit: 'cover' }} src={value.avatar} />
          <span>{value.name}</span>
        </Space>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <Input
          placeholder="Search"
          value={selectedKeys[0]}
          onChange={(e) => {
            return setSelectedKeys(e.target.value ? [e.target.value] : []);
          }}
          onPressEnter={() => confirm()}
        />
      ),
      filterIcon: <SearchOutlined />,
      onFilter: (value, record) =>
        record.name_avatar.name.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      ...column({
        title: 'email',
      }),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <Input
          placeholder="Search"
          value={selectedKeys[0]}
          onChange={(e) => {
            return setSelectedKeys(e.target.value ? [e.target.value] : []);
          }}
          onPressEnter={() => confirm()}
        />
      ),
      filterIcon: <SearchOutlined />,
      onFilter: (value, record) =>
        record.email.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      ...column({
        title: 'root',
      }),
      render: (value: boolean) => (
        <>{value == true ? <Tag color="green">true</Tag> : <Tag color="red">false</Tag>}</>
      ),
      filters: [
        {
          text: 'Root',
          value: true,
        },
        {
          text: 'Not Root',
          value: false,
        },
      ],
      onFilter: (value, record) => {
        return value == record.root;
      },
    },
    {
      ...column({
        title: 'role',
      }),
      filters: [
        {
          text: 'Admin',
          value: 'admin',
        },
        {
          text: 'QA Manager',
          value: 'qa_manager',
        },
        {
          text: 'QA Coordinator',
          value: 'qa_coordinator',
        },
        {
          text: 'Department Manager',
          value: 'department_manager',
        },
        {
          text: 'Staff',
          value: 'staff',
        },
      ],
      onFilter: (value, record) => {
        return value == record.role;
      },
    },
    {
      ...column({
        title: 'active',
      }),
      render: (value: boolean, record) => (
        <>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  icon={
                    <UploadOutlined
                      style={{
                        color: '#009F9D',
                      }}
                    />
                  }
                >
                  Update
                </Menu.Item>
                <Menu.Item
                  onClick={() => deleteUser(record.key)}
                  icon={
                    <DeleteOutlined
                      style={{
                        color: '#009F9D',
                      }}
                    />
                  }
                >
                  Remove
                </Menu.Item>
                <Menu.Item
                  icon={
                    <EyeOutlined
                      style={{
                        color: '#009F9D',
                      }}
                    />
                  }
                >
                  Detail
                </Menu.Item>
              </Menu>
            }
            arrow
            trigger={['click', 'hover']}
            placement="topRight"
          >
            <Space
              style={{
                cursor: 'pointer',
              }}
            >
              <MoreOutlined />
            </Space>
          </Dropdown>
        </>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>All Employees Page</title>
      </Head>

      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>All Employees</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        extra={
          <a
            onClick={() => deleteManyUser(usersSl as string[])}
            style={{
              display: usersSl ? 'block' : 'none',
            }}
          >
            Remove All
          </a>
        }
        title="All Employees"
        style={{ width: '100%', marginTop: '20px' }}
      >
        <Space direction="vertical" size={20}>
          <Table
            rowSelection={{
              type: 'checkbox',
              getCheckboxProps: (record) => ({
                disabled: record.root,
              }),
              onChange: (selectedRowKeys) => {
                if (selectedRowKeys.length !== 0) {
                  setUsersSl(selectedRowKeys as string[]);
                } else {
                  setUsersSl(null);
                }
              },
            }}
            style={{ overflowX: 'auto', fontSize: '16px' }}
            dataSource={dataSourceUsers}
            columns={columns}
          />
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
