import { Button, Card, Form, Breadcrumb, Space } from 'antd';
import * as React from 'react';
import { NextPageWithLayout } from '../../models/layoutType';
import { ClientLayout } from '../../components/layouts';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validateAddDepartment } from '../../utils';
import { Input } from '../../components/elements';

export interface IAddDepartmentProps {}

const AddDepartment: NextPageWithLayout = (props: IAddDepartmentProps) => {
  // setting form
  const formSetting = useForm<{ name: string; description: string }>({
    resolver: yupResolver(validateAddDepartment),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = ({ email }: { email: string }) => {
    console.log(email);
  };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Departments</Breadcrumb.Item>
        <Breadcrumb.Item>Add Department</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="Add Department"
        extra={<a href="#">Clear</a>}
        style={{ width: '100%', marginTop: '20px' }}
      >
        <Space direction="vertical" size={20}>
          <Input
            name="name"
            label="Name"
            formSetting={formSetting}
            placeholder="Enter department name"
            type="text"
          />
          <Input
            name="name"
            label="Name"
            formSetting={formSetting}
            placeholder="Enter department name"
            type="text"
          />
        </Space>
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <Button type="primary">Add</Button>
        </div>
      </Card>
    </>
  );
};

export default AddDepartment;

AddDepartment.getLayout = function getLayout({ children }) {
  return <ClientLayout>{children}</ClientLayout>;
};
