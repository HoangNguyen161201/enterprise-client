import {
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  TableOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Card,
  Dropdown,
  Image,
  Input,
  Menu,
  message,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { AxiosError } from 'axios';
import { BreadCrumb } from 'components/elements/common';
import ImportCSV from 'components/elements/common/ImportCSV';
import { DrawerUpdateUser } from 'components/elements/drawer';
import { ClientLayout } from 'components/layouts';
import { GlobalContext } from 'contextApi/globalContext';
import { IAllUsers, ICommon, IDepartments, IDetailUser, IUser } from 'models/apiType';
import { IOptionSelect } from 'models/elementType';
import { IUserForm } from 'models/formType';
import { NextPageWithLayout } from 'models/layoutType';
import { EmplMutation } from 'mutations/employee';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getAllDepartments, getallUsers, getCurrentUser, getUsersNotDepartment } from 'queries';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import column from '../../utils/configTB';
import { validateUpdateUser } from '../../utils/validate';

export interface IEmployeesProps {
  allUsers: IAllUsers;
  allDepartments: IDepartments;
  detailUser: IDetailUser;
}

const Employees: NextPageWithLayout = ({
  allUsers,
  allDepartments,
  detailUser,
}: IEmployeesProps) => {
  const { color, handleLoadPage } = React.useContext(GlobalContext);

  React.useEffect(() => {
    handleLoadPage(false);
  }, []);

  //Visibble drawer udpate employee
  const [visible, setVisible] = React.useState(false);

  //Old data of employee update
  const [oldUpdateUser, setoldUpdateUser] = React.useState<Partial<IUser>>({
    _id: '',
    employee_id: undefined,
    name: '',
    role: '',
    email: '',
    avatar: {
      public_id: '',
      url: '',
    },
  });

  //Show and close drawer
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  //Data select department
  const [departmentSl, setDepartmentSL] = React.useState<IOptionSelect[]>([]);

  //Data source table users
  const [dataSourceUsers, setDataSourceUsers] = React.useState<Partial<IUser>[]>([]);

  //Data user select
  const [usersSl, setUsersSl] = React.useState<null | string[]>(null);

  //Get access token
  const {
    data: dataUser,
    error: errorGetUser,
    refetch: dataUserRefetch,
  } = getCurrentUser(detailUser);

  //Get all data user
  const {
    error: errorAllUsers,
    data: dataAllUsers,
    refetch: dataAllUsersRefetch,
  } = getallUsers(dataUser?.accessToken.token, allUsers);

  //Get all data departments
  const { error: errorAllDepartments, data: dataAllDepartments } = getAllDepartments(
    dataUser?.accessToken.token,
    allDepartments
  );

  //Get list users not have department
  const { refetch: dataUsersnotDPMRefetch } = getUsersNotDepartment(dataUser?.accessToken.token);

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

  //Set data source for table users
  React.useEffect(() => {
    let newDataSourceUsers: Partial<IUser>[] = [];
    if (dataAllUsers) {
      newDataSourceUsers = dataAllUsers?.users?.map((user: IUser) => {
        return {
          key: user._id,
          employee_id: user.employee_id,
          name_avatar: { name: user.name, avatar: user.avatar.url },
          root: user.root,
          role: user.role,
          email: user.email,
          active: '',
          department_id: user.department_id,
        };
      });
    }
    setDataSourceUsers(newDataSourceUsers);
  }, [dataAllUsers]);

  //Check exist and show error
  React.useEffect(() => {
    if (errorAllUsers) {
      message.error({
        content: errorAllUsers.response?.data.err,
      });
    }
  }, [errorAllUsers]);

  //  mutation call api to delete User
  const mutationAddManyUsers = EmplMutation.addMany({
    dataUserRefetch: dataUserRefetch,
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
          content: error.response?.data.err || 'Add many employees by import CSV false.',
        });
      },
    },
    token: dataUser?.accessToken.token,
  });

  //  mutation call api to delete User
  const mutationDeleteUser = EmplMutation.delete({
    dataUserRefetch: dataUserRefetch,
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
          content: error.response?.data.err || 'Delete User false.',
        });
      },
    },
    token: dataUser?.accessToken.token,
  });

  //  mutation call api to delete many Users
  const mutationDeleteManyUser = EmplMutation.deleteMany({
    dataUserRefetch: dataUserRefetch,
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });
        dataUsersnotDPMRefetch();
        dataAllUsersRefetch();
        setUsersSl(null);
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Delete Users false.',
        });
      },
    },
    token: dataUser?.accessToken.token,
  });

  //  mutation call api to update User
  const mutationUpdateUser = EmplMutation.update({
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });
        dataUsersnotDPMRefetch();
        dataAllUsersRefetch();
        setUsersSl(null);
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Update User false.',
        });
      },
    },
    dataUserRefetch: dataUserRefetch,
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

  //Function handle delete user
  const deleteUser = async (id: string) => {
    //Delete user
    mutationDeleteUser.mutate({
      id,
    });
  };

  //Function handle delete many users
  const deleteManyUser = async (users: string[]) => {
    //Delete users
    mutationDeleteManyUser.mutate({
      users,
    });
  };

  //Function handle add many users
  const addManyUsers = async (users: Partial<IUser>[]) => {
    //Add users
    mutationAddManyUsers.mutate({
      users,
    });
  };

  //Seting column table users
  const columns: ColumnsType<any> = [
    {
      ...column({
        title: 'Id',
        dataIndex: 'employee_id',
        key: 'employee_id',
      }),
      render: (value) => <>{`epl-${value}`}</>,
    },
    {
      ...column({
        title: 'Name',
        dataIndex: 'name_avatar',
        key: 'name_avatar',
      }),
      render: (value, record) => (
        <Space size={20}>
          <Image
            width={40}
            alt={record.key}
            height={40}
            style={{ objectFit: 'cover' }}
            src={value.avatar}
          />
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
      render: (value: boolean, record: Partial<IUser>) => {
        return (
          !record.root && (
            <>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      disabled={record.root}
                      onClick={() => {
                        //Reset data form update user
                        formSetting.reset({
                          id: record.key,
                          name: record.name_avatar?.name,
                          email: record.email,
                          role: record.role,
                          department_id: record.department_id,
                        });

                        //Set state and show drawer
                        setoldUpdateUser(record);
                        showDrawer();
                      }}
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
                      disabled={record.root}
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
                      <Link href={`${process.env.CLIENT_URL}/employees/detail/${record.key}`}>
                        <a>Detail</a>
                      </Link>
                    </Menu.Item>
                  </Menu>
                }
                arrow
                trigger={['click', 'hover']}
                placement="bottomRight"
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
          )
        );
      },
    },
  ];

  // setting form update user
  const formSetting = useForm<IUserForm>({
    resolver: yupResolver(validateUpdateUser),
    defaultValues: {
      id: '',
      name: '',
      email: '',
      role: '',
      department_id: '',
    },
  });

  const onSubmit = async (dataForm: IUser) => {
    //Refetch again let get accesstoken pass to api
    await dataUserRefetch();

    //Post add data user
    mutationUpdateUser.mutate({ user: dataForm });
  };

  return (
    <>
      <Head>
        <title>All Employees</title>
      </Head>

      <BreadCrumb
        data={[
          {
            url: '/',
            label: 'Home',
          },
        ]}
        main={{
          url: '/employees',
          label: 'All employees',
        }}
      />

      <Spin spinning={mutationAddManyUsers.isLoading}>
        <Card
          extra={[
            <ImportCSV
              key={'cSv_import'}
              fieldsValid={['name', 'email', 'role', 'password']}
              onSubmit={addManyUsers}
            />,
            <Popconfirm
              key={'delete'}
              disabled={usersSl == null}
              icon={<QuestionCircleOutlined />}
              title="Are you sure?"
              okButtonProps={{
                onClick: async () => deleteManyUser(usersSl as string[]),
                loading: mutationDeleteManyUser.isLoading,
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button disabled={usersSl == null} type="link">
                Remove All
              </Button>
            </Popconfirm>,
          ]}
          title={<span className={`${color}`}>All Employees</span>}
          className="card-b shadow-l"
        >
          <Space direction="vertical" size={20}>
            <Table
              scroll={{ x: true }}
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
      </Spin>

      <DrawerUpdateUser
        onClose={onClose}
        visible={visible}
        oldUpdateUser={oldUpdateUser}
        formSetting={formSetting}
        departmentSl={departmentSl}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default Employees;

Employees.getLayout = ClientLayout;

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

  //Get all data users
  const allUsers: IAllUsers = await fetch(`${process.env.CLIENT_URL}/api/users`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
      authorization: detailUser.accessToken.token,
    } as HeadersInit,
  }).then((e) => e.json());

  //Redirect 404 page when not have allUsers
  if (allUsers.statusCode !== 200) {
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

  //Redirect 404 page when not have allDepartments
  if (allDepartments.statusCode !== 200) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      allUsers,
      allDepartments,
      detailUser,
    },
  };
};
