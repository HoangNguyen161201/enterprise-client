import { FileTextOutlined } from '@ant-design/icons';
import { Button, Drawer, Grid, Space } from 'antd';
import { GlobalContext } from 'contextApi/globalContext';
import React, { useContext } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input, TextArea } from '../form';

interface IDrawerCt {
  setIsopen: (isOpen: boolean) => void;
  isOpen: boolean;
  formSetting: UseFormReturn<any, object>;
  onSubmit: any;
  statusForm: 'create' | 'update';
  isLoading: boolean;
  title: string;
}

export const DrawerCt = ({
  setIsopen,
  title,
  isOpen,
  statusForm,
  formSetting,
  isLoading,
  onSubmit,
}: IDrawerCt) => {

  const {useBreakpoint: UseBreakpoint} = Grid
  const {sm} = UseBreakpoint()

  const {color2} = useContext(GlobalContext)
  return (
    <Drawer
      title={title}
      onClose={() => {
        setIsopen(false);
      }}
      visible={isOpen}
      closable={true}
      width={sm ? undefined: '100%'}
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
          <Button loading={isLoading} style={{borderRadius: 5}} className={`${color2}`} htmlType="submit" type="primary">
            Save
          </Button>
        </Space>
      </form>
    </Drawer>
  );
}
