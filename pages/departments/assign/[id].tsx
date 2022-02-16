//Import
import { EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Breadcrumb, Button, Card, Col, message, Row, Space } from 'antd';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Select, TextArea } from '../../../components/elements';
import { ClientLayout } from '../../../components/layouts';
import { IOptionSelect, NextPageWithLayout } from '../../../models';
import { getCurrentUser, getDetailDepartment, getUsersRoleDepartment } from '../../../queries';
import { validateAddDepartment } from '../../../utils';

export interface IAssignDepartmentProps {}

const AssignDepartment: NextPageWithLayout = (props: IAssignDepartmentProps) => {
  //State
  const [listQACoordinators, setListQACoordinators] = useState<IOptionSelect[]>([]);
  const [listDepartmentManagers, setListDepartmentManagers] = useState<IOptionSelect[]>([]);

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

  //Get staff not have department
  const { error: errorStaffs, data: dataStaffs } = getUsersRoleDepartment(
    'staff',
    'no',
    dataUser?.accessToken.token
  );

  //Get qa coordinator not have department
  const { error: errorQACoordinators, data: dataQACoordinators } = getUsersRoleDepartment(
    'qa_coordinator',
    'no',
    dataUser?.accessToken.token
  );

  //Get qa manager not have department
  const { error: errorDepartmentManagers, data: dataDepartmentManagers } = getUsersRoleDepartment(
    'department_manager',
    'no',
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
    if (errorDepartment) {
      message.error({
        content: errorDepartment.response?.data.err,
      });
    }
  }, [errorDepartment]);

  useEffect(() => {
    if (errorStaffs) {
      message.error({
        content: errorStaffs.response?.data.err,
      });
    }
  }, [errorStaffs]);

  useEffect(() => {
    if (errorQACoordinators) {
      message.error({
        content: errorQACoordinators.response?.data.err,
      });
    }
  }, [errorQACoordinators]);

  useEffect(() => {
    if (errorDepartmentManagers) {
      message.error({
        content: errorDepartmentManagers.response?.data.err,
      });
    }
  }, [errorDepartmentManagers]);

  console.log();
  

  //Set list qa coordinator
//   useEffect(() => {
//     if (dataDepartment && dataDepartment.department && dataDepartment.department.qa_coordinator) {
//       let newListQACorrdinators: IOptionSelect[] = [];
//       if (
//         dataQACoordinators &&
//         dataQACoordinators.users &&
//         dataQACoordinators.users?.length !== 0
//       ) {
//         dataQACoordinators.users.map((user) => {
//           if (user) {
//             newListQACorrdinators.push({
//               value: user._id,
//               label: user.email,
//             });
//           }
//         });
//       }

//       setListQACoordinators([
//         {
//           value: dataDepartment.department.qa_coordinator._id,
//           label: dataDepartment.department.qa_coordinator.email,
//         },
//         ...newListQACorrdinators,
//       ]);
//     }
//   }, [dataDepartment, dataQACoordinators]);

  //Set list department manager
//   useEffect(() => {
//     if (
//       dataDepartment &&
//       dataDepartment.department &&
//       dataDepartment.department.department_manager
//     ) {
//       let newListDepartmentManager: IOptionSelect[] = [];
//       if (
//         dataDepartmentManagers &&
//         dataDepartmentManagers.users &&
//         dataDepartmentManagers.users?.length !== 0
//       ) {
//         dataDepartmentManagers.users.map((user) => {
//           if (user) {
//             newListDepartmentManager.push({
//               value: user._id,
//               label: user.email,
//             });
//           }
//         });
//       }

//       setListDepartmentManagers([
//         {
//           value: dataDepartment.department.department_manager._id,
//           label: dataDepartment.department.department_manager.email,
//         },
//         ...newListDepartmentManager,
//       ]);
//     }
//   }, [dataDepartment, dataDepartmentManagers]);


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
