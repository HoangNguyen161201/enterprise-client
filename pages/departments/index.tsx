import { Breadcrumb, Card, Space } from 'antd';
import * as React from 'react';
import { ClientLayout } from '../../components/layouts';
import { NextPageWithLayout } from '../../models/layoutType';
import {useState} from 'react'
import { GetServerSideProps } from 'next';

export interface IAddDepartmentProps {}

const AddDepartment: NextPageWithLayout = (props: IAddDepartmentProps) => {
  const [data, setData] = useState([

  ]) 
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>All Departments</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="All Departments"
        style={{ width: '100%', marginTop: '20px' }}
      >
        <Space direction="vertical" size={20}></Space>
      </Card>
    </>
  );
};

export default AddDepartment;

AddDepartment.getLayout = function getLayout({ children }) {
  return <ClientLayout>{children}</ClientLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context)=> {
  console.log(context.req.headers.cookie)
  const res = await fetch('http://localhost:3000/api/auth/accesstoken', {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  });
  console.log(res)

  return {
    props: {

    }
  }
}
