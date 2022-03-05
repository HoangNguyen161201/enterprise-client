import { EditOutlined } from '@ant-design/icons';
import { Button, Drawer, Image, Space } from 'antd';
import { GlobalContext } from 'contextApi/globalContext';
import React, { useContext } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DateInput, Input, TextArea } from '../form';

interface IDrawerSubm {
  close: () => void;
  deleteSubm: () => void;
  isOpen: boolean;
  formSetting: UseFormReturn<any, object>;
  onSubmit: any;
  statusForm: 'create' | 'update';
  isLoading: boolean;
  isDelete: boolean;
  imgSubmission: string;
  openDrawerImg: () => void;
}

export const DrawerSubm = ({
  formSetting,
  statusForm,
  openDrawerImg,
  isLoading,
  isDelete,
  imgSubmission,
  onSubmit,
  isOpen,
  deleteSubm,
  close,
}: IDrawerSubm) => {
  const {color2} = useContext(GlobalContext)
  return (
    <Drawer
      title={statusForm == 'create' ? 'Add new Submission' : 'Update submission'}
      closable
      onClose={close}
      visible={isOpen}
      extra={
        <>
          {statusForm == 'update' && (
            <Button loading={isDelete} onClick={deleteSubm} type="link" danger>
              Delete
            </Button>
          )}
        </>
      }
    >
      <Space size={20} direction="vertical">
        <Image
          alt={'img_submission'}
          onClick={openDrawerImg}
          preview={false}
          src={imgSubmission}
          style={{
            cursor: 'pointer',
          }}
        />
        <form onSubmit={formSetting.handleSubmit(onSubmit)}>
          <Space direction="vertical" size={20}>
            {statusForm == 'update' && (
              <Input
                icon={<EditOutlined style={{ marginRight: 10, color: 'gray' }} />}
                label="Id"
                name="_id"
                formSetting={formSetting}
                placeholder="Enter submission Id"
                disable
              />
            )}
            <Input
              icon={<EditOutlined style={{ marginRight: 10, color: 'gray' }} />}
              label="Name"
              name="name"
              formSetting={formSetting}
              placeholder="Enter submission name"
            />
            <DateInput label="Closure date" name="closure_date" formSetting={formSetting} />
            <DateInput
              label="Final closure date"
              name="final_closure_date"
              formSetting={formSetting}
            />
            <TextArea label="Description" name="description" formSetting={formSetting} />
            <Button loading={isLoading} className={color2} htmlType="submit" type="primary">
              Save
            </Button>
          </Space>
        </form>
      </Space>
    </Drawer>
  );
};
