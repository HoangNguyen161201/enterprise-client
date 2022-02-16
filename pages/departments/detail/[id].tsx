//Import
import { Breadcrumb, Card, message, Row } from 'antd';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect as UseEffect } from 'react';
import FieldCard from '../../../components/elements/FieldCard';
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
  UseEffect(() => {
    dataUserRefetch();
  }, []);

  //Get detail data department
  const { error: errorDepartment, data: dataDepartment } = getDetailDepartment(
    id as string,
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
        <h2>Information:</h2>
        <Row gutter={[30, 20]}>
          <FieldCard
            label="ID Department"
            content={dataDepartment ? dataDepartment.department._id : ''}
          />
          <FieldCard
            view={dataDepartment?.department_manager ? true : false}
            label="Department Manager"
            content={
              dataDepartment?.department_manager?.email
                ? dataDepartment.department_manager.email
                : ''
            }
          />
          <FieldCard
            view={dataDepartment?.qa_coordinator ? true : false}
            label="QA Coordinator"
            content={
              dataDepartment?.qa_coordinator?.email ? dataDepartment?.qa_coordinator?.email : ''
            }
          />
          <FieldCard
            view={dataDepartment?.qa_manager ? true : false}
            label="QA Manager"
            content={dataDepartment?.qa_manager?.email ? dataDepartment?.qa_manager?.email : ''}
          />

          <FieldCard xs={24} xl={24}
            view={dataDepartment?.qa_coordinator ? true : false}
            label="Description"
            content={dataDepartment ? dataDepartment.department.description : ''}
          />
        </Row>
        <h2>Staffs</h2>
      </Card>
    </>
  );
};

DetailDepartment.getLayout = ClientLayout;

export default DetailDepartment;

export const getServerSideProps: GetServerSideProps = async (context) => {
  //Check login
  const res = await fetch('http://localhost:3000/api/auth/accesstoken', {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  });

  const data = await res.json();

  console.log(res, data);

  //Redirect login page when error
  if (res.status !== 200) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  //Check role
  if (data.user.role !== 'admin') {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};
