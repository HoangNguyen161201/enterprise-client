import {
  DeleteOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { Button, Card, Image, Input, message, Popconfirm, Row, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { AxiosError } from 'axios';
import { BreadCrumb, ButtonAssign } from 'components/elements/common';
import { ClientLayout } from 'components/layouts';
import { ICommon, IDetailDepartment, IDetailUser, IUser } from 'models/apiType';
import { IUsersNotDepartment } from 'models/elementType';
import { IAssignUsers } from 'models/formType';
import { NextPageWithLayout } from 'models/layoutType';
import { departmentMutation } from 'mutations/department';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter as UseRouter } from 'next/router';
import { getCurrentUser } from 'queries/auth';
import { getAllDepartments, getDetailDepartment, getUsersNotDepartment } from 'queries/department';
import {
  useContext,
  useEffect as UseEffect,
  useMemo as UseMemo,
  useState as UseState,
} from 'react';
import column from 'utils/configTB';
import { GlobalContext } from 'contextApi/globalContext';

export interface IAssignDepartmentProps {
  detailDepartment: IDetailDepartment;
  detailUser: IDetailUser;
}

const AssignDepartment: NextPageWithLayout = ({
  detailDepartment,
  detailUser,
}: IAssignDepartmentProps) => {
  const { color, desColor, handleLoadPage } = useContext(GlobalContext);

  UseEffect(() => {
    handleLoadPage(false);
  }, []);

  //Get id from router to get old data
  const {
    query: { id },
    push,
  } = UseRouter();

  //State
  const [userNotDepartment, setUserNotDepartment] = UseState<IUsersNotDepartment>({
    staffs: [],
    QACoordinators: [],
    DepartmentManagers: [],
  });

  // set isloading delete all
  const [isLoadingDlAll, setIsLoadingDlAll] = UseState(false);

  // departments select
  const [staffsSl, setStaffsSl] = UseState<any>(null);

  const [staffs, setStaffs] = UseState<Partial<IUser>[]>([]);

  // set loading when delete department, delete all departments
  const [isLoadingDl, setIsLoadingDl] = UseState({
    key: '',
    isLoading: false,
  });

  //Get access token
  const {
    data: dataUser,
    error: errorGetUser,
    refetch: dataUserRefetch,
  } = getCurrentUser(detailUser);
  UseEffect(() => {
    dataUserRefetch();
  }, []);

  //Queries get data all departments => refetch when have assign users
  const { refetch: dataAllDepartmentsRefetch } = getAllDepartments(dataUser?.accessToken.token);

  //Get detail data department
  const {
    error: errorDepartment,
    data: dataDepartment,
    refetch: dataDepartmentRefetch,
  } = getDetailDepartment(id as string, dataUser?.accessToken.token, detailDepartment);
  UseEffect(() => {
    if (dataUser) {
      dataDepartmentRefetch();
    }
  }, []);

  //Get list users not have department
  const {
    error: errorUsersNotDPM,
    data: dataUsersnotDPM,
    refetch: dataUsersnotDPMRefetch,
  } = getUsersNotDepartment(dataUser?.accessToken.token);

  // remove all employees in department
  const handleDlAll = departmentMutation.removeAllStaffs({
    dataUserRefetch: dataUserRefetch,
    options: {
      onSuccess: (data: ICommon) => {
        message.success(data.msg);
        setIsLoadingDlAll(false);
        setStaffsSl(null);
        dataDepartmentRefetch();
        dataUsersnotDPMRefetch()
      },
      onError: (error: AxiosError) => {
        const data = error.response?.data;
        message.error(data.err);
        setIsLoadingDlAll(false);
        setStaffsSl(null);
      },
    },
    token: dataUser?.accessToken.token,
  });

  // remove employee in department
  const handleDl = departmentMutation.removeStaff({
    dataUserRefetch: dataUserRefetch,
    options: {
      onSuccess: (data: ICommon) => {
        message.success(data.msg);
        setIsLoadingDl({ key: '', isLoading: false });
        dataDepartmentRefetch();
        dataUsersnotDPMRefetch()
      },
      onError: (error: AxiosError) => {
        const data = error.response?.data;
        message.error(data.err);
        setIsLoadingDl({ key: '', isLoading: false });
      },
    },
    token: dataUser?.accessToken.token,
  });

  //Check exist and show error
  UseEffect(() => {
    if (errorGetUser) {
      message.error({
        content: errorGetUser.response?.data.err,
      });
    }
  }, [errorGetUser]);

  UseEffect(() => {
    if (errorUsersNotDPM) {
      message.error({
        content: errorUsersNotDPM.response?.data.err,
      });
    }
  }, [errorUsersNotDPM]);

  UseEffect(() => {
    if (errorDepartment) {
      message.error({
        content: errorDepartment.response?.data.err,
      });
    }
  }, [errorDepartment]);

  //Set list user not department
  UseEffect(() => {
    if (dataUsersnotDPM) {
      const { departmentManagers, QACoordinators, staffs } = dataUsersnotDPM;
      const optionStaffs = staffs?.map((staff) => {
        return {
          label: staff.email,
          value: staff._id,
        };
      });

      const optionQACoordinator = QACoordinators?.map((QACoordinator) => {
        return {
          label: QACoordinator.email,
          value: QACoordinator._id,
        };
      });

      const optionDepartmentManagers = departmentManagers?.map((departmentManager) => {
        return {
          label: departmentManager.email,
          value: departmentManager._id,
        };
      });

      setUserNotDepartment({
        staffs: optionStaffs,
        QACoordinators: optionQACoordinator,
        DepartmentManagers: optionDepartmentManagers,
      });
    }
  }, [dataUsersnotDPM]);

  // set data source to table
  UseEffect(() => {
    if (dataDepartment?.department?.employees) {
      console.log(dataDepartment?.department)
      const avoidNull = dataDepartment.department.employees.filter(item => {
        return item != null && item != undefined
      })
      const getStaffs: Partial<IUser>[] | [] = avoidNull.map((employee: IUser)=> {
        return {
          key: employee._id,
          employee_id: employee.employee_id,
          name_avatar: { name: employee.name, avatar: employee.avatar.url },
          root: employee.root,
          role: employee.role,
          email: employee.email,
          view: '',
          remove: '',
        }
      })
      setStaffs(getStaffs);
    }
  }, [dataDepartment]);

  const columns = UseMemo<ColumnsType<any>>(
    () => [
      {
        ...column({ title: 'Id', dataIndex: 'employee_id', key: 'employee_id' }),
        render: (value) => <>{`epl-${value}`}</>,
      },
      {
        ...column({ title: 'name', dataIndex: 'name_avatar', key: 'name_avatar' }),
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <Input
            placeholder="Search"
            value={selectedKeys[0]}
            onPressEnter={() => confirm()}
            onChange={(e) => {
              return setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
          />
        ),
        onFilter: (value, record) =>
          String(record.name_avatar.name).toLowerCase().includes(String(value).toLowerCase()),
        filterIcon: <SearchOutlined />,
        render: (value) => (
          <Space size={20}>
            <Image
              alt="Avatar"
              width={40}
              height={40}
              style={{ objectFit: 'cover' }}
              src={value.avatar}
            />
            <span>{value.name}</span>
          </Space>
        ),
      },
      {
        ...column({ title: 'root' }),
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
        ...column({ title: 'role' }),
      },
      {
        ...column({ title: 'email' }),
      },
      {
        ...column({ title: 'view' }),
        render: (_, record) => (
          <ProfileOutlined
            onClick={() => push(`/departments/detail/${record.key}`, undefined, { shallow: true })}
            style={{ color: '#07456F' }}
          />
        ),
      },
      {
        ...column({ title: 'remove' }),
        render: (_, record) => (
          <Popconfirm
            icon={
              <QuestionCircleOutlined
                style={{
                  color: '#07456F',
                }}
              />
            }
            title="Are you sure?"
            okButtonProps={{
              onClick: async () => {
                await dataUserRefetch;
                setIsLoadingDl((state) => ({
                  ...state,
                  isLoading: true,
                }));
                handleDl.mutate(record.key);
              },
              loading: isLoadingDl.isLoading,
            }}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined
              onClick={() => setIsLoadingDl({ key: record.key, isLoading: false })}
              style={{ color: 'red' }}
            />
          </Popconfirm>
        ),
      },
    ],
    []
  );

  //Mutation assign
  //Mutation Assign one user
  const mutationAssignOneUser = departmentMutation.AssignOneUser({
    dataUserRefetch: dataUserRefetch,
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });

        //Refetch get data
        dataDepartmentRefetch();
        dataUsersnotDPMRefetch();
        dataAllDepartmentsRefetch();
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Assign user false.',
        });
      },
    },
    token: dataUser?.accessToken.token,
  });

  //Mutation Assign one user
  const mutationAssignManyUsers = departmentMutation.AssignManyUser({
    dataUserRefetch: dataUserRefetch,
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });

        //Refetch get data
        dataDepartmentRefetch();
        dataUsersnotDPMRefetch();
        dataAllDepartmentsRefetch();
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Assign users false.',
        });
      },
    },
    token: dataUser?.accessToken.token,
  });

  //Function on assign one user
  const onAssignOneUser = ({ userId, departmentId }: IAssignUsers) => {
    //Call mutation active with api to assign one user
    mutationAssignOneUser.mutate({ userId, departmentId });
  };

  //Function on assign many users
  const onAssignManyUsers = ({ users, departmentId }: IAssignUsers) => {
    //Call mutation active with api to assign many users
    mutationAssignManyUsers.mutate({ users, departmentId });
  };

  return (
    <>
      <Head>
        <title>Assign Department</title>
      </Head>
      <BreadCrumb
        data={[
          { url: '/', label: 'Home' },
          { url: '/departments', label: 'All departments' },
        ]}
        main={{
          url: `/departments/assign/${id}`,
          label: 'Assign department',
        }}
      />

      <Card
        extra={[
          <Popconfirm
            key={'delete'}
            disabled={staffsSl == null}
            icon={
              <QuestionCircleOutlined
                style={{
                  color: '#07456F',
                }}
              />
            }
            title="Are you sure?"
            okButtonProps={{
              onClick: async () => {
                await dataUserRefetch();
                setIsLoadingDlAll(true);
                handleDlAll.mutate(staffsSl);
              },
              loading: isLoadingDlAll,
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button disabled={staffsSl == null} type="link">
              Remove all
            </Button>
          </Popconfirm>,
        ]}
        title={<span className={`${color}`}>Assign Department</span>}
        className="card-b shadow-l"
      >
        <Space direction="vertical">
          <span className={`font-2 ${desColor}`}>Information</span>
          <Row>
            <ButtonAssign
              title="Staff"
              subTitle={`${
                dataDepartment?.department?.staffs ? dataDepartment?.department?.staffs.length : 0
              } People`}
              color="#009F9D"
              Icon={UsergroupAddOutlined}
              role="Staff"
              dataUsers={userNotDepartment.staffs}
              assignType="many"
              handleOk={onAssignManyUsers}
              departmentId={dataDepartment?.department?._id as string}
              xs={24}
              lg={12}
              xl={8}
            />
            <ButtonAssign
              title="QA Coordinator"
              subTitle={`${dataDepartment?.department?.qa_coordinator ? 1 : 0} People`}
              color="#07456F"
              Icon={UserSwitchOutlined}
              role="QA Coordinator"
              dataUsers={userNotDepartment.QACoordinators}
              assignType="one"
              handleOk={onAssignOneUser}
              departmentId={dataDepartment?.department?._id as string}
              xs={24}
              lg={12}
              xl={8}
            />
            <ButtonAssign
              title="Manager"
              subTitle={`${dataDepartment?.department?.department_manager ? 1 : 0} People`}
              color="#0F0A3C"
              role="Department Manager"
              Icon={UserAddOutlined}
              dataUsers={userNotDepartment.DepartmentManagers}
              assignType="one"
              handleOk={onAssignOneUser}
              departmentId={dataDepartment?.department?._id as string}
              xs={24}
              lg={12}
              xl={8}
            />
          </Row>
          <Space
            direction="vertical"
            style={{
              margin: '10px 0px 0px',
            }}
          >
            <span className={`font-2 ${desColor}`}>Member</span>
            <Table
              scroll={{ x: true }}
              rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys) => {
                  if (selectedRowKeys.length == 0) return setStaffsSl(null);
                  return setStaffsSl(selectedRowKeys);
                },
              }}
              style={{ overflowX: 'auto' }}
              dataSource={staffs}
              columns={columns}
            />
          </Space>
        </Space>
      </Card>
    </>
  );
};

AssignDepartment.getLayout = ClientLayout;

export default AssignDepartment;

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
      redirect: {
        destination: '/403',
        permanent: false,
      },
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
