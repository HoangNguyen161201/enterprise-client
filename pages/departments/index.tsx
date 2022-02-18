import {
  DeleteOutlined,
  EditOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { Breadcrumb, Button, Card, Input, message, Popconfirm, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect as UseEffect, useMemo, useState as UseState } from 'react';
import { useMutation } from 'react-query';
import { ClientLayout } from '../../components/layouts';
import { NextPageWithLayout } from '../../models/layoutType';
import { getAllDepartments, getCurrentUser } from '../../queries';
import { deleteData, postData } from '../../utils';
import { column } from '../../utils/configTB';

export interface IAddDepartmentProps {}

const AddDepartment: NextPageWithLayout = (props: IAddDepartmentProps) => {
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
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();

  //Get data all departments
  const { error: errorDepartments, data, refetch } = getAllDepartments(dataUser?.accessToken.token);

  // delete department
  const handleDl = useMutation<any, AxiosError, any>(
    (id: string) => {
      return deleteData({ url: `/api/departments/${id}`, token: dataUser?.accessToken.token });
    },
    {
      onSuccess: (data) => {
        message.success(data.msg);
        setIsLoadingDl({ key: '', isLoading: false });
        refetch();
      },
      onError: (error) => {
        const data = error.response?.data;
        message.error(data.err);
        setIsLoadingDl({ key: '', isLoading: false });
      },
    }
  );

  // delete department
  const handleDlAll = useMutation<any, AxiosError, any>(
    (Ids) => {
      return postData({
        url: `/api/departments/delete-many`,
        token: dataUser?.accessToken.token,
        body: { departments: Ids },
      });
    },
    {
      onSuccess: (data) => {
        message.success(data.msg);
        setIsLoadingDlAll(false);
        setDepartmentsSl(null);
        refetch();
      },
      onError: (error) => {
        const data = error.response?.data;
        message.error(data.err);
        setIsLoadingDlAll(false);
        setDepartmentsSl(null);
      },
    }
  );

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

  const columns = useMemo<ColumnsType<any>>(
    () => [
      {
        ...column({ title: 'name' }),
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <Input
            placeholder="Search"
            value={selectedKeys[0]}
            onPressEnter={() => confirm()}
            onChange={(e) => {
              console.log([e.target.value]);
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
        render: (_, record) => (
          <EditOutlined
            onClick={() => push(`/departments/update/${record.key}`, undefined, { shallow: true })}
            style={{ color: '#1890ff' }}
          />
        ),
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
                    await dataUserRefetch();
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
        <title>All Departments Page</title>
      </Head>

      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>All Departments</Breadcrumb.Item>
      </Breadcrumb>

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
                await dataUserRefetch();
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
        title="All Departments"
        style={{ width: '100%', marginTop: '20px' }}
      >
        <Space direction="vertical" size={20}></Space>
        <Table
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
  const res = await fetch('http://localhost:3000/api/auth/accesstoken', {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  });

  const result = await res.json();
  if (result.statusCode == 401)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  return {
    props: {},
  };
};
