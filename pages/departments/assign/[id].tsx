import {
  EyeOutlined,
  FileTextOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Breadcrumb, Button, Card, Col, message, Row, Space } from 'antd';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Select, TextArea } from '../../../components/elements';
import { ClientLayout } from '../../../components/layouts';
import { IOptionSelect, IUsersNotDepartment, NextPageWithLayout } from '../../../models';
import {
  getCurrentUser,
  getDetailDepartment,
  getUsersNotDepartment,
  getUsersRoleDepartment,
} from '../../../queries';
import { validateAddDepartment } from '../../../utils';

export interface IAssignDepartmentProps {}

const AssignDepartment: NextPageWithLayout = (props: IAssignDepartmentProps) => {
  //State
  const [userNotDepartment, setUserNotDepartment] = useState<IUsersNotDepartment>({
    staffs: [],
    QACoordinators: [],
    DepartmentManagers: [],
  });

  //Get id from router to get old data
  const {
    query: { id },
  } = useRouter();

  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();
  useEffect(() => {
    dataUserRefetch();
  }, []);

  //Get detail data department
  const { error: errorDepartment, data: dataDepartment } = getDetailDepartment(
    id as string,
    dataUser?.accessToken.token
  );

  //Get list users not have department
  const { error: errorUsersNotDPM, data: dataUsersnotDPM } = getUsersNotDepartment(
    dataUser?.accessToken.token
  );

  //Check exist and show error
  useEffect(() => {
    if (errorGetUser) {
      message.error({
        content: errorGetUser.response?.data.err,
      });
    }
  }, [errorGetUser]);

  useEffect(() => {
    if (errorUsersNotDPM) {
      message.error({
        content: errorUsersNotDPM.response?.data.err,
      });
    }
  }, [errorUsersNotDPM]);

  useEffect(() => {
    if (errorDepartment) {
      message.error({
        content: errorDepartment.response?.data.err,
      });
    }
  }, [errorDepartment]);

  //Set list user not department
  useEffect(() => {
    if (dataUsersnotDPM) {
      const { departmentManagers, QACoordinators, staffs } = dataUsersnotDPM;
      const optionStaffs = staffs?.map((staff) => {
        return {
          label: staff.email,
          value: staff._id,
        };
      });

      const optionQACoordinator = QACoordinators?.map((QACoordinator) => {
        return {
          label: QACoordinator.email,
          value: QACoordinator._id,
        };
      });

      const optionDepartmentManagers = departmentManagers?.map((departmentManager) => {
        return {
          label: departmentManager.email,
          value: departmentManager._id,
        };
      });

      setUserNotDepartment({
        staffs: optionStaffs,
        QACoordinators: optionQACoordinator,
        DepartmentManagers: optionDepartmentManagers,
      });
    }
  }, [dataUsersnotDPM]);

  console.log(userNotDepartment);

  // setting form
  const formSetting = useForm<{ name: string; description: string }>({
    resolver: yupResolver(validateAddDepartment),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async ({ name, description }: { name: string; description: string }) => {
    //Refetch again let get accesstoken pass to api
    await dataUserRefetch();
  };

  console.log(dataUsersnotDPM);

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Departments</Breadcrumb.Item>
        <Breadcrumb.Item>All Departments</Breadcrumb.Item>
        <Breadcrumb.Item>Assign Department</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="Assign Department"
        style={{ width: '100%', marginTop: '20px' }}
        actions={[<UserAddOutlined />, <UserSwitchOutlined />, <UsergroupAddOutlined />]}
      >
        <form onSubmit={formSetting.handleSubmit(onSubmit)}>
          <Space direction="vertical" size={20}>
            <Row gutter={[20, 20]}>
              <Col xs={24} xl={12}>
                <Input
                  name="name"
                  label="Name"
                  formSetting={formSetting}
                  placeholder="Enter department name"
                  type="text"
                  icon={<FileTextOutlined />}
                />
              </Col>

              <Col xs={24} xl={12}>
                <Input
                  name="name"
                  label="Name"
                  formSetting={formSetting}
                  placeholder="Enter department name"
                  type="text"
                  icon={<FileTextOutlined />}
                />
              </Col>
            </Row>

            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              <Button htmlType="submit" type="primary">
                Save
              </Button>
            </div>
          </Space>
        </form>
      </Card>
    </>
  );
};

AssignDepartment.getLayout = ClientLayout;

export default AssignDepartment;
