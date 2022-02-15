import {
  DeleteOutlined,
  EditOutlined,
  ProfileOutlined,
  SearchOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { Breadcrumb, Card, Input, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { GetServerSideProps } from 'next';
import * as React from 'react';
import { ClientLayout } from '../../components/layouts';
import { NextPageWithLayout } from '../../models/layoutType';
import { getDetailDepartment } from '../../queries';

export interface IAddDepartmentProps {}

const AddDepartment: NextPageWithLayout = (props: IAddDepartmentProps) => {
  const dataSource = [
    {
      key: 1,
      name: 'nguyen quang hoang',
      root: true,
      staff: 24,
      detail: 'dfd',
      update: 'dfdf',
      remove: 'dfdfd',
      assign: 'dfs',
    },
    {
      key: 2,
      name: 'nguyen quang huy',
      root: false,
      staff: 40,
      detail: 'dfd',
      update: 'dfdf',
      remove: 'dfdfd',
      assign: 'dfs',
    },
    {
      key: 3,
      name: 'nguyen quang huy 111',
      root: false,
      staff: 40,
      detail: 'dfd',
      update: 'dfdf',
      remove: 'dfdfd',
      assign: 'dfs',
    },
  ];

  const columns: ColumnsType<any> = [
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
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
      filterIcon: <SearchOutlined />
    },
    {
      title: 'root',
      dataIndex: 'root',
      key: 'root',
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
      title: 'staffs (count)',
      dataIndex: 'staff',
      key: 'staff',
      sorter: (a, b) => {
        return a.staff - b.staff;
      },
    },
    {
      title: 'detail',
      dataIndex: 'detail',
      key: 'detail',
      render: (value) => <ProfileOutlined style={{ color: '#07456F' }} />,
    },
    {
      title: 'Assign',
      dataIndex: 'assign',
      key: 'assign',
      render: (value) => <UsergroupAddOutlined style={{ color: '#07456F' }} />,
    },
    {
      title: 'Update',
      dataIndex: 'update',
      key: 'update',
      render: (value) => <EditOutlined style={{ color: '#1890ff' }} />,
    },
    {
      title: 'Delete',
      dataIndex: 'remove',
      key: 'remove',
      render: (value) => <DeleteOutlined style={{ color: 'red' }} />,
    },
  ];

  const { data, error } = getDetailDepartment('fddf');
  React.useEffect(() => {
    console.log(data, error);
  }, [data, error]);

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>All Departments</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="All Departments" style={{ width: '100%', marginTop: '20px' }}>
        <Space direction="vertical" size={20}></Space>
        <Table style={{ overflowX: 'auto' }} dataSource={dataSource} columns={columns} />
      </Card>
    </>
  );
};

export default AddDepartment;

AddDepartment.getLayout = ClientLayout;

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log(context.req.headers.cookie);
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
