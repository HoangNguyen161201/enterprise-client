import { Breadcrumb, Card, Space } from 'antd';
import { GetServerSideProps } from 'next';
import * as React from 'react';
import { ClientLayout } from '../../components/layouts';
import { NextPageWithLayout } from '../../models/layoutType';

export interface IAddDepartmentProps {}

const AddDepartment: NextPageWithLayout = (props: IAddDepartmentProps) => {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>All Departments</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="Add Department"
        extra={<a href="#">Clear</a>}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  //Check login
  const res = await fetch('http://localhost:3000/api/auth/accesstoken', {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  });

  const data = await res.json();

  console.log(res, data);

  //Check role
  if (data.user.role !== 'admin') {
    return {
      notFound: true,
    };
  }

  //Redirect login page when error
  if (res.status !== 200) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
