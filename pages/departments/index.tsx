import { Breadcrumb, Card, Space, Table, Tag } from 'antd';
import * as React from 'react';
import { ClientLayout } from '../../components/layouts';
import { NextPageWithLayout } from '../../models/layoutType';
import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { ColumnsType } from 'antd/lib/table';
import { DeleteOutlined, EditOutlined, ProfileOutlined, UsergroupAddOutlined } from '@ant-design/icons';

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
      assign: 'dfs'
    },
    {
      key: 2,
      name: 'nguyen quang hoang',
      root: false,
      staff: 24,
      detail: 'dfd',
      update: 'dfdf',
      remove: 'dfdfd',
      assign: 'dfs'
    }
  ]
  
  const columns:ColumnsType = [
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'root',
      dataIndex: 'root',
      key: 'root',
      render: (value: boolean)=> (
        <>
          {
            value == true ? <Tag color="green">true</Tag>: <Tag color="red">false</Tag>
          }
        </>
      )
    },
    {
      title: 'staff',
      dataIndex: 'staff',
      key: 'staff',
    },
    {
      title: 'detail',
      dataIndex: 'detail',
      key: 'detail',
      render: (value)=> (
        <ProfileOutlined style={{color: '#07456F'}}/>
      )
    },
    {
      title: 'Assign',
      dataIndex: 'assign',
      key: 'assign',
      render: (value)=> (
        <UsergroupAddOutlined style={{color: '#07456F'}}/>
      )
    },
    {
      title: 'Update',
      dataIndex: 'update',
      key: 'update',
      render: (value)=> (
        <EditOutlined style={{color: '#1890ff'}} />
      )
    },
    {
      title: 'Delete',
      dataIndex: 'remove',
      key: 'remove',
      render: (value)=> (
        <DeleteOutlined style={{color: 'red'}} />
      )
    },
  ]

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>All Departments</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="All Departments" style={{ width: '100%', marginTop: '20px' }}>
        <Space direction="vertical" size={20}></Space>
        <Table style={{overflowX: 'auto', }} dataSource={dataSource} columns={columns}/>
      </Card>
    </>
  );
};

export default AddDepartment;

AddDepartment.getLayout = ClientLayout

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
    props: {}
  }
};
