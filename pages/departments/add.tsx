import { FileTextOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Breadcrumb, Button, Card, message, Space } from 'antd';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Input } from '../../components/elements';
import { ClientLayout } from '../../components/layouts';
import { IDepartment } from '../../models';
import { NextPageWithLayout } from '../../models/layoutType';
import { postData, validateAddDepartment } from '../../utils';

export interface IAddDepartmentProps {}

const AddDepartment: NextPageWithLayout = (props: IAddDepartmentProps) => {
  //  call api to get accessToken
  const mutationAddDepartment = useMutation<any, AxiosError, IDepartment>(
    (dataForm) => {
      return postData({
        url: '/api/departments',
        body: dataForm,
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
          content: error.response?.data.err || 'Create department false.',
        });
      },
    }
  );

  // setting form
  const formSetting = useForm<{ name: string; description: string }>({
    resolver: yupResolver(validateAddDepartment),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = ({ name, description }: { name: string; description: string }) => {
    //Post add data department
    mutationAddDepartment.mutate({ name, description });
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
        <form onSubmit={formSetting.handleSubmit(onSubmit)}>
          <Space direction="vertical" size={20}>
            <Input
              name="name"
              label="Name"
              formSetting={formSetting}
              placeholder="Enter department name"
              type="text"
              icon={<FileTextOutlined />}
            />
            <Input
              name="description"
              label="Description"
              formSetting={formSetting}
              placeholder="Enter department description"
              type="text"
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              <Button loading={mutationAddDepartment.isLoading} htmlType="submit" type="primary">
                Add
              </Button>
            </div>
          </Space>
        </form>
      </Card>
    </>
  );
};

export default AddDepartment;

AddDepartment.getLayout = function getLayout({ children }) {
  return <ClientLayout>{children}</ClientLayout>;
};
