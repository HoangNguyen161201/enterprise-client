import { FileTextOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Drawer, Row, Space, Alert, Grid } from 'antd';
import { UseFormReturn } from 'react-hook-form';
import { IUser } from 'models/apiType';
import { IOptionSelect } from 'models/elementType';
import { roleSelect } from 'utils/dataSelect';
import { Select, Input } from '../form';
import { useContext } from 'react';
import { GlobalContext } from 'contextApi/globalContext';

export interface IDrawerUpdateUserProps {
  onClose: () => void;
  visible: boolean;
  oldUpdateUser: Partial<IUser>;
  formSetting: UseFormReturn<any, object>;
  departmentSl: IOptionSelect[];
  onSubmit: (dataForm: IUser) => void;
}

export const DrawerUpdateUser = ({
  onClose,
  visible,
  oldUpdateUser,
  formSetting,
  departmentSl,
  onSubmit,
}: IDrawerUpdateUserProps)=> {

  const {useBreakpoint: UseBreakpoint} = Grid
  const {sm} = UseBreakpoint()

  const {color2} = useContext(GlobalContext)

  return (
    <>
      <Drawer width={sm ? undefined: '100%'} placement="right" onClose={onClose} visible={visible}>
        <Space
          direction="vertical"
          size={20}
          style={{
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <Alert
            showIcon
            closable
            message="If you choose the QA Manager or QA Coordinator role, it will be removed from the department and need to be assigned at the department assign page."
            type="warning"
          />
          <Space
            align="center"
            direction="vertical"
            style={{
              border: '10px solid #F0F9F9',
              justifyContent: 'center',
              background: '#009F9D30',
              borderRadius: '10px',
              padding: '30px',
            }}
          >
            <Avatar
              style={{
                width: 150,
                height: 150,
                border: '5px solid #009F9D',
                background: 'white',
              }}
              src={oldUpdateUser.name_avatar?.avatar}
            />
            <p
              style={{
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              ID: {`epl-${oldUpdateUser.employee_id}`}
            </p>
          </Space>

          <form onSubmit={formSetting.handleSubmit(onSubmit)}>
            <Space direction="vertical" size={20}>
              <Row gutter={[20, 20]}>
                <Col span={24}>
                  <Input
                    name="id"
                    label="ID"
                    formSetting={formSetting}
                    type="text"
                    disable={true}
                    icon={<FileTextOutlined />}
                  />
                </Col>
                <Col span={24}>
                  <Input
                    name="name"
                    label="Name"
                    formSetting={formSetting}
                    placeholder="Enter name"
                    type="text"
                    icon={<FileTextOutlined />}
                  />
                </Col>
                <Col span={24}>
                  <Input
                    name="email"
                    label="Email"
                    formSetting={formSetting}
                    placeholder="Enter name"
                    type="text"
                    icon={<FileTextOutlined />}
                  />
                </Col>
                <Col span={24}>
                  <Select
                    formSetting={formSetting}
                    name="role"
                    label="Role"
                    placeholder="Please select role"
                    data={roleSelect}
                  />
                </Col>
                <Col span={24}>
                  <Select
                    formSetting={formSetting}
                    name="department_id"
                    label="Department"
                    placeholder="Please select department"
                    data={departmentSl}
                  />
                </Col>
              </Row>
              <Button
                onClick={onClose}
                type="primary"
                htmlType="submit"
                style={{
                  borderRadius: 5,
                }}
                className={`${color2}`}
              >
                Update
              </Button>
            </Space>
          </form>
        </Space>
      </Drawer>
    </>
  );
}
