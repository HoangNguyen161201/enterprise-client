import { FileTextOutlined } from '@ant-design/icons';
import { Button, Drawer, Space } from 'antd';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input, TextArea } from '.';

interface IDrawerCt {
  setIsopen: (isOpen: boolean) => void;
  isOpen: boolean;
  formSetting: UseFormReturn<any, object>;
  onSubmit: any;
  statusForm: 'create' | 'update';
  isLoading: boolean;
  title: string;
}

export default function DrawerCt({
  setIsopen,
  title,
  isOpen,
  statusForm,
  formSetting,
  isLoading,
  onSubmit,
}: IDrawerCt) {
  return (
    <Drawer
      title={title}
      onClose={() => {
        setIsopen(false);
      }}
      visible={isOpen}
      closable={true}
    >
      <form onSubmit={formSetting.handleSubmit(onSubmit)}>
        <Space direction="vertical" size={20}>
          {statusForm == 'update' && (
            <Input
              disable={true}
              name="_id"
              label="Id"
              formSetting={formSetting}
              placeholder="Enter department name"
              type="text"
              icon={<FileTextOutlined style={{ marginRight: 5, color: 'gray' }} />}
            />
          )}
          <Input
            name="name"
            label="Name"
            formSetting={formSetting}
            placeholder="Enter department name"
            type="text"
            icon={<FileTextOutlined style={{ marginRight: 5, color: 'gray' }} />}
          />
          <TextArea
            require={false}
            name="description"
            label="Description"
            formSetting={formSetting}
          />
          <Button loading={isLoading} htmlType="submit" type="primary">
            Save
          </Button>
        </Space>
      </form>
    </Drawer>
  );
}
