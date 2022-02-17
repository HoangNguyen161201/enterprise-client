import { UserAddOutlined, UsergroupAddOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, message, Row, Space } from 'antd';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useEffect as UseEffect, useState, useState as UseState } from 'react';
import { useMutation } from 'react-query';
import ButtonAssign from '../../../components/elements/ButtonAssign';
import { ClientLayout } from '../../../components/layouts';
import {
  IAssignUsers,
  IDepartmentForm,
  IUsersNotDepartment,
  NextPageWithLayout,
} from '../../../models';
import { getCurrentUser, getDetailDepartment, getUsersNotDepartment } from '../../../queries';
import { postData } from '../../../utils';

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
  const {
    error: errorDepartment,
    data: dataDepartment,
    refetch: dataDepartmentRefetch,
  } = getDetailDepartment(id as string, dataUser?.accessToken.token);

  //Get list users not have department
  const {
    error: errorUsersNotDPM,
    data: dataUsersnotDPM,
    refetch: dataUsersnotDPMRefetch,
  } = getUsersNotDepartment(dataUser?.accessToken.token);

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

  //Mutation assign
  //Mutation Assign one user
  const mutationAssignOneUser = useMutation<any, AxiosError, IAssignUsers>(
    ({ userId, departmentId }) => {
      return postData({
        url: `/api/users/assign`,
        body: {
          userId,
          departmentId,
        },
        token: dataUser?.accessToken.token,
      });
    },
    {
      onSuccess: (data) => {
        message.success({
          content: data.msg,
        });

        //Refetch get data
        dataDepartmentRefetch();
        dataUsersnotDPMRefetch();
      },
      onError: (error) => {
        message.error({
          content: error.response?.data.err || 'Assign user false.',
        });
      },
    }
  );

  //Mutation Assign one user
  const mutationAssignManyUsers = useMutation<any, AxiosError, IAssignUsers>(
    ({ users, departmentId }) => {
      return postData({
        url: `/api/users/assign-many`,
        body: {
          users,
          departmentId,
        },
        token: dataUser?.accessToken.token,
      });
    },
    {
      onSuccess: (data) => {
        message.success({
          content: data.msg,
        });
        
        //Refetch get data
        dataDepartmentRefetch();
        dataUsersnotDPMRefetch();
      },
      onError: (error) => {
        message.error({
          content: error.response?.data.err || 'Assign users false.',
        });
      },
    }
  );

  //Function on assign one user
  const onAssignOneUser = ({ userId, departmentId }: IAssignUsers) => {
    //Get data user again to get access token
    dataUserRefetch();

    //Call mutation active with api to assign one user
    mutationAssignOneUser.mutate({ userId, departmentId });
  };

  //Function on assign many users
  const onAssignManyUsers = ({ users, departmentId }: IAssignUsers) => {
    //Get data user again to get access token
    dataUserRefetch();

    //Call mutation active with api to assign many users
    mutationAssignManyUsers.mutate({ users, departmentId });
  };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Departments</Breadcrumb.Item>
        <Breadcrumb.Item>All Departments</Breadcrumb.Item>
        <Breadcrumb.Item>Assign Department</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="Assign Department" style={{ width: '100%', marginTop: '20px' }}>
        <Space direction="vertical" size={20}>
          <Row>
            <ButtonAssign
              title="Staff"
              subTitle={`${
                dataDepartment?.department?.staffs ? dataDepartment?.department?.staffs.length : 0
              } People`}
              color="#009F9D"
              Icon={UsergroupAddOutlined}
              role="Staff"
              dataUsers={userNotDepartment.staffs}
              assignType="many"
              handleOk={onAssignManyUsers}
              departmentId={dataDepartment?.department?._id}
              xs={24}
              lg={12}
              xl={8}
            />
            <ButtonAssign
              title="QA Coordinator"
              subTitle={`${dataDepartment?.department?.qa_coordinator ? 1 : 0} People`}
              color="#07456F"
              Icon={UserSwitchOutlined}
              role="QA Coordinator"
              dataUsers={userNotDepartment.QACoordinators}
              assignType="one"
              handleOk={onAssignOneUser}
              departmentId={dataDepartment?.department?._id}
              xs={24}
              lg={12}
              xl={8}
            />
            <ButtonAssign
              title="Manager"
              subTitle={`${dataDepartment?.department?.department_manager ? 1 : 0} People`}
              color="#0F0A3C"
              role="Department Manager"
              Icon={UserAddOutlined}
              dataUsers={userNotDepartment.DepartmentManagers}
              assignType="one"
              handleOk={onAssignOneUser}
              departmentId={dataDepartment?.department?._id}
              xs={24}
              lg={12}
              xl={8}
            />
          </Row>
        </Space>
      </Card>
    </>
  );
};

AssignDepartment.getLayout = ClientLayout;

export default AssignDepartment;
