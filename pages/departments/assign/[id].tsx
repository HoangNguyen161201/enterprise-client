import {
  UserAddOutlined,
  UsergroupAddOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Breadcrumb, Card, message, Row, Space } from 'antd';
import { useRouter } from 'next/router';
import { useEffect as UseEffect, useState as UseState } from 'react';
import { useForm } from 'react-hook-form';
import ButtonAssign from '../../../components/elements/ButtonAssign';
import { ClientLayout } from '../../../components/layouts';
import { IUsersNotDepartment, NextPageWithLayout } from '../../../models';
import { getCurrentUser, getDetailDepartment, getUsersNotDepartment } from '../../../queries';
import { validateAddDepartment } from '../../../utils';

export interface IAssignDepartmentProps {}

const AssignDepartment: NextPageWithLayout = (props: IAssignDepartmentProps) => {
  //State
  const [userNotDepartment, setUserNotDepartment] = UseState<IUsersNotDepartment>({
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
  UseEffect(() => {
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
  UseEffect(() => {
    if (errorGetUser) {
      message.error({
        content: errorGetUser.response?.data.err,
      });
    }
  }, [errorGetUser]);

  UseEffect(() => {
    if (errorUsersNotDPM) {
      message.error({
        content: errorUsersNotDPM.response?.data.err,
      });
    }
  }, [errorUsersNotDPM]);

  UseEffect(() => {
    if (errorDepartment) {
      message.error({
        content: errorDepartment.response?.data.err,
      });
    }
  }, [errorDepartment]);

  //Set list user not department
  UseEffect(() => {
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

      <Card title="Assign Department" style={{ width: '100%', marginTop: '20px' }}>
        <form onSubmit={formSetting.handleSubmit(onSubmit)}>
          <Space direction="vertical" size={20}>
            <Row>
              <ButtonAssign
                title="Staff"
                subTitle={`${
                  dataDepartment?.department?.staffs ? dataDepartment?.department?.staffs.length : 0
                } People`}
                color="#009F9D"
                Icon={UsergroupAddOutlined}
                xs={24}
                lg={12}
                xl={8}
              />
              <ButtonAssign
                title="QA Coordinator"
                subTitle={`${dataDepartment?.department?.qa_coordinator ? 1 : 0} People`}
                color="#07456F"
                Icon={UserSwitchOutlined}
                xs={24} 
                lg={12}
                xl={8}
              />
              <ButtonAssign
                title="Manager"
                subTitle={`${dataDepartment?.department?.department_manager ? 1 : 0} People`}
                color="#0F0A3C"
                Icon={UserAddOutlined}
                xs={24}
                lg={12}
                xl={8}
              />
            </Row>
          </Space>
        </form>
      </Card>
    </>
  );
};

AssignDepartment.getLayout = ClientLayout;

export default AssignDepartment;
