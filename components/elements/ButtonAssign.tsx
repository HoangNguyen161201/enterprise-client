import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Modal, Select, Space } from 'antd';
import * as React from 'react';
import { IAssignUsers, IOptionSelect } from '../../models';

export interface IButtonAssignProps {
  color: string;
  Icon: any;
  title: string;
  subTitle: string;
  [index: string]: any;
  role: string;
  dataUsers: IOptionSelect[] | undefined;
  handleOk: ({}: IAssignUsers) => void;
  assignType: 'one' | 'many';
  departmentId: string;
}

const { Option } = Select;

export default function ButtonAssign({
  color,
  Icon,
  title,
  subTitle,
  role,
  dataUsers,
  assignType,
  handleOk,
  departmentId,
  ...props
}: IButtonAssignProps) {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [dataSelect, setDataSelect] = React.useState<string | string[]>(
    assignType === 'one' ? '' : []
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Col
      span={8}
      style={{
        padding: '10px 15px',
      }}
      {...props}
    >
      <Space
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          background: `${color}15`,
          padding: '10px 15px',
          borderRadius: '10px',
        }}
      >
        <Space size={20}>
          <Space
            align="center"
            style={{
              height: '60px',
              width: '60px',
              background: `${color}30`,
              borderRadius: '10px',
              justifyContent: 'center',
            }}
          >
            <Icon
              style={{
                fontSize: '25px',
                color: 'white',
              }}
            />
          </Space>
          <Space
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'start',
            }}
          >
            <span
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              {title}
            </span>
            <span
              style={{
                fontSize: '14px',
                color: 'gray',
              }}
            >
              {subTitle}
            </span>
          </Space>
        </Space>

        <Space
          style={{
            height: '60px',
            display: 'flex',
            alignItems: 'end',
          }}
        >
          <Space
            onClick={showModal}
            style={{
              width: '30px',
              height: '30px',
              background: '#07456F',
              display: 'flex',
              justifyContent: 'center',
              borderRadius: '5px',
              boxShadow: '5px 5px 10px  rgba(0,0,0,0.1)',
              cursor: 'pointer',
            }}
          >
            <PlusOutlined
              style={{
                color: 'white',
              }}
            />
          </Space>
        </Space>
      </Space>

      <Modal
        style={{
          borderRadius: '10px',
        }}
        title={title}
        visible={isModalVisible}
        onOk={() => {
          handleOk(
            assignType === 'one'
              ? {
                  userId: dataSelect,
                  departmentId: departmentId,
                }
              : {
                  users: dataSelect,
                  departmentId: departmentId,
                }
          );

          setIsModalVisible(false);

          setDataSelect(assignType === 'one' ? '' : []);
        }}
        onCancel={handleCancel}
        okText={'Assign'}
        okButtonProps={{ disabled: dataUsers?.length !== 0 ? false : true }}
      >
        <Select
          value={dataSelect}
          mode={assignType === 'many' ? 'multiple' : undefined}
          showSearch
          style={{ width: '100%' }}
          placeholder="Search to Select"
          optionFilterProp="children"
          onChange={(e) => setDataSelect(e)}
        >
          {dataUsers &&
            dataUsers.map((user) => (
              <Option key={user.value} value={user.value}>
                {user.label}
              </Option>
            ))}
        </Select>
      </Modal>
    </Col>
  );
}
