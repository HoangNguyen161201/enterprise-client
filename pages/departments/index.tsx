import {
  DeleteOutlined,
  EditOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Button, Card, Input, message, Popconfirm, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { AxiosError } from 'axios';
import { BreadCrumb } from 'components/elements/common';
import { ClientLayout } from 'components/layouts';
import { GlobalContext } from 'contextApi/globalContext';
import { ICommon, IDetailUser } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import { departmentMutation } from 'mutations/department';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getAllDepartments, getCurrentUser } from 'queries';
import {
  useContext as UseContext,
  useEffect as UseEffect,
  useMemo as UseMemo,
  useState as UseState,
} from 'react';
import column from 'utils/configTB';

export interface IAddDepartmentProps {
  detailUser: IDetailUser;
}

const AddDepartment: NextPageWithLayout = ({ detailUser }: IAddDepartmentProps) => {
  const { color, handleLoadPage } = UseContext(GlobalContext);

  UseEffect(()=> {
    handleLoadPage(false)
  }, [])

  // get all departments
  const [departments, setDepartments] = UseState<any>([]);

  // departments select
  const [departmentsSl, setDepartmentsSl] = UseState<any>(null);

  // set loading when delete department, delete all departments
  const [isLoadingDl, setIsLoadingDl] = UseState({
    key: '',
    isLoading: false,
  });
  const [isLoadingDlAll, setIsLoadingDlAll] = UseState(false);
  //Get access token
  const {
    data: dataUser,
    error: errorGetUser,
    refetch: dataUserRefetch,
  } = getCurrentUser(detailUser);

  //Get data all departments
  const {
    error: errorDepartments,
    data,
    refetch: dataDepartmentRefetch,
  } = getAllDepartments(dataUser?.accessToken.token);
  UseEffect(() => {
    if (dataUser) {
      dataDepartmentRefetch();
    }
  }, []);

  // delete department
  const handleDl = departmentMutation.delete({
    dataUserRefetch: dataUserRefetch,
    options: {
      onSuccess: (data: ICommon) => {
        message.success(data.msg);
        setIsLoadingDl({ key: '', isLoading: false });
        dataDepartmentRefetch();
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data?.err,
        });
        setIsLoadingDl({ key: '', isLoading: false });
      },
    },
    token: dataUser?.accessToken.token,
  });

  // delete department
  const handleDlAll = departmentMutation.deleteAll({
    dataUserRefetch: dataUserRefetch,
    token: dataUser?.accessToken.token,
    options: {
      onSuccess: (data: ICommon) => {
        message.success(data.msg);
        setIsLoadingDlAll(false);
        setDepartmentsSl(null);
        dataDepartmentRefetch();
      },
      onError: (error: AxiosError) => {
        const data = error.response?.data;
        message.error(data.err);
        setIsLoadingDlAll(false);
        setDepartmentsSl(null);
      },
    },
  });

  UseEffect(() => {
    dataUserRefetch();
  }, []);

  UseEffect(() => {
    if (data) {
      const newDepartments = data.departments.map((department) => {
        const { _id, name, count_users, root } = department;
        return {
          key: _id,
          name,
          root,
          count_users,
          detail: '',
          update: '',
          remove: '',
          assign: '',
        };
      });
      setDepartments(newDepartments);
    }
  }, [data]);

  //Check exist and show error  get data departments
  UseEffect(() => {
    if (errorDepartments) {
      message.error({
        content: errorDepartments.response?.data.err,
      });
    }
  }, [errorDepartments]);

  //Check exist and show error  get data user - accesstoken
  UseEffect(() => {
    if (errorGetUser) {
      message.error({
        content: errorGetUser.response?.data.err,
      });
    }
  }, [errorGetUser]);

  const { push } = useRouter();

  const columns = UseMemo<ColumnsType<any>>(
    () => [
      {
        ...column({ title: 'name' }),
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
        onFilter: (value, record) => record.name.includes(value),
        filterIcon: <SearchOutlined />,
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
        ...column({ title: 'staffs (count)', dataIndex: 'count_users', key: 'count_users ' }),
        sorter: (a, b) => {
          return a.staff - b.staff;
        },
      },
      {
        ...column({ title: 'detail' }),
        render: (_, record) => (
          <ProfileOutlined
            onClick={() => push(`/departments/detail/${record.key}`, undefined, { shallow: true })}
            style={{ color: '#07456F' }}
          />
        ),
      },
      {
        ...column({ title: 'assign' }),
        render: (_, record) => (
          <UsergroupAddOutlined
            onClick={() => push(`/departments/assign/${record.key}`, undefined, { shallow: true })}
            style={{ color: '#07456F' }}
          />
        ),
      },
      {
        ...column({ title: 'update' }),
        render: (_, record) => {
          return (
            !record.root && (
              <EditOutlined
                onClick={() =>
                  push(`/departments/update/${record.key}`, undefined, { shallow: true })
                }
                style={{ color: '#1890ff' }}
              />
            )
          );
        },
      },
      {
        ...column({ title: 'remove' }),
        render: (_, record) => {
          if (!record.root)
            return (
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
            );
          return '';
        },
      },
    ],
    []
  );

  return (
    <>
      <Head>
        <title>All Departments</title>
      </Head>

      <BreadCrumb
        data={[
          {
            url: '/',
            label: 'Home',
          },
        ]}
        main={{
          url: '/departments',
          label: 'All departments',
        }}
      />

      <Card
        extra={[
          <Popconfirm
            key={'delete'}
            disabled={departmentsSl == null}
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
                setIsLoadingDlAll(true);
                handleDlAll.mutate(departmentsSl);
              },
              loading: isLoadingDlAll,
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button disabled={departmentsSl == null} type="link">
              Remove all
            </Button>
          </Popconfirm>,
        ]}
        title={<span className={`${color}`}>All Departments</span>}
        className="card-b shadow-l"
      >
        <Space direction="vertical" size={20}></Space>
        <Table
          scroll={{ x: true }}
          rowSelection={{
            type: 'checkbox',
            getCheckboxProps: (record) => ({
              disabled: record.root,
            }),
            onChange: (selectedRowKeys) => {
              if (selectedRowKeys.length == 0) return setDepartmentsSl(null);
              return setDepartmentsSl(selectedRowKeys);
            },
          }}
          style={{ overflowX: 'auto', fontSize: '16px' }}
          dataSource={departments}
          columns={columns}
        />
      </Card>
    </>
  );
};

export default AddDepartment;

AddDepartment.getLayout = ClientLayout;

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
  return {
    props: {
      detailUser,
    },
  };
};
