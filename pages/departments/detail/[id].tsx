import { EyeOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Col, message, Row, Space } from 'antd';
import { useRouter } from 'next/router';
import * as React from 'react';
import { ClientLayout } from '../../../components/layouts';
import { NextPageWithLayout } from '../../../models';
import { getCurrentUser, getDetailDepartment } from '../../../queries';

export interface IDetailDepartmentProps {}

const DetailDepartment: NextPageWithLayout = (props: IDetailDepartmentProps) => {
  //Get id from router to get old data
  const {
    query: { id },
  } = useRouter();

  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();
  React.useEffect(() => {
    dataUserRefetch();
  }, []);

  //Get detail data department
  const { error: errorDepartment, data: dataDepartment } = getDetailDepartment(
    id as string,
    dataUser?.accessToken.token
  );

  //Check exist and show error
  React.useEffect(() => {
    if (errorGetUser) {
      message.error({
        content: errorGetUser.response?.data.err,
      });
    }
  }, [errorGetUser]);

  React.useEffect(() => {
    if (errorDepartment) {
      message.error({
        content: errorDepartment.response?.data.err,
      });
    }
  }, [errorDepartment]);

  console.log(dataDepartment);

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Departments</Breadcrumb.Item>
        <Breadcrumb.Item>All Departments</Breadcrumb.Item>
        <Breadcrumb.Item>View Detail Department</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="View Detail Department" style={{ width: '100%', marginTop: '20px' }}>
        <Row gutter={20}>
          <Col
            xs={24}
            xl={12}
            style={{
              marginTop: '10px',
            }}
          >
            <p>ID Department</p>
            <Space
              style={{
                borderRadius: '4px',
                background: '#07456F10',
                width: '100%',
                padding: '10px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{dataDepartment ? dataDepartment.department._id : ''}</span>
            </Space>
          </Col>
          <Col
            xs={24}
            xl={12}
            style={{
              marginTop: '10px',
            }}
          >
            <p>Department Manager</p>
            <Space
              style={{
                borderRadius: '4px',
                background: '#07456F10',
                width: '100%',
                padding: '10px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>
                {dataDepartment
                  ? dataDepartment.department_manager
                    ? dataDepartment.department_manager.email
                    : 'None'
                  : ''}
              </span>

              {dataDepartment && dataDepartment.department_manager && (
                <EyeOutlined
                  style={{
                    fontSize: '15px',
                    color: '#009F90',
                  }}
                />
              )}
            </Space>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col
            xs={24}
            xl={12}
            style={{
              marginTop: '10px',
            }}
          >
            <p>QA Coordinator</p>
            <Space
              style={{
                borderRadius: '4px',
                background: '#07456F10',
                width: '100%',
                padding: '10px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>
                {dataDepartment
                  ? dataDepartment.qa_coordinator
                    ? dataDepartment.qa_coordinator.email
                    : 'None'
                  : ''}
              </span>

              {dataDepartment && dataDepartment.qa_coordinator && (
                <EyeOutlined
                  style={{
                    fontSize: '15px',
                    color: '#009F90',
                  }}
                />
              )}
            </Space>
          </Col>
          <Col
            xs={24}
            xl={12}
            style={{
              marginTop: '10px',
            }}
          >
            <p>QA Manager</p>
            <Space
              style={{
                borderRadius: '4px',
                background: '#07456F10',
                width: '100%',
                padding: '10px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>
                {dataDepartment
                  ? dataDepartment.qa_manager
                    ? dataDepartment.qa_manager.email
                    : 'None'
                  : ''}
              </span>
              {dataDepartment && dataDepartment.qa_coordinator && (
                <EyeOutlined
                  style={{
                    fontSize: '15px',
                    color: '#009F90',
                  }}
                />
              )}
            </Space>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col
            xs={24}
            style={{
              marginTop: '10px',
            }}
          >
            <p>Description</p>
            <Space
              style={{
                borderRadius: '4px',
                background: '#07456F10',
                width: '100%',
                padding: '10px 20px',
              }}
            >
              <span>{dataDepartment ? dataDepartment.department.description : ''}</span>

              {dataDepartment && dataDepartment.qa_coordinator && (
                <EyeOutlined
                  style={{
                    fontSize: '15px',
                    color: '#009F90',
                  }}
                />
              )}
            </Space>
          </Col>
        </Row>
      </Card>
    </>
  );
};

DetailDepartment.getLayout = ClientLayout;

export default DetailDepartment;
