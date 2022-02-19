//Import
import { ArrowDownOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, message, Row, Space } from 'antd';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect as UseEffect, useState } from 'react';
import FieldCard from '../../../components/elements/FieldCard';
import User from '../../../components/elements/User';
import { ClientLayout } from '../../../components/layouts';
import { IDetailDepartment, IUser, NextPageWithLayout } from '../../../models';
import { getCurrentUser, getDetailDepartment, getDetailUser } from '../../../queries';

export interface IDetailDepartmentProps {
  detailUser: IUser;
}

const DetailEmployee: NextPageWithLayout = ({ detailUser }: IDetailDepartmentProps) => {
  const { query } = useRouter();

  const [isShow, setIsShow] = useState(false);
  //Get id from router to get old data
  const {
    query: { id },
  } = useRouter();

  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();
  UseEffect(() => {
    dataUserRefetch();
  }, []);

  //Get detail data user
  const { error: errorUser, data: dataDepartment } = getDetailUser(
    id as string,
    dataUser?.accessToken.token,
    detailUser
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
    if (errorUser) {
      message.error({
        content: errorUser.response?.data.err,
      });
    }
  }, [errorUser]);

  return (
    <>
      <Head>
        <title>Detail User Page</title>
      </Head>

      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Employees</Breadcrumb.Item>
        <Breadcrumb.Item>All Employees</Breadcrumb.Item>
        <Breadcrumb.Item>View Detail Employee</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="View Detail Employee" style={{ width: '100%', marginTop: '20px' }}>
        <h2 className="font-3">Information:</h2>
        <Row gutter={[30, 20]}>
          <FieldCard
            lg={12}
            label="ID Department"
            content={dataDepartment ? dataDepartment.department._id : ''}
          />
          <FieldCard
            lg={12}
            view={dataDepartment?.department_manager ? true : false}
            label="Department Manager"
            content={
              dataDepartment?.department_manager?.email
                ? dataDepartment.department_manager.email
                : ''
            }
          />
          <FieldCard
            lg={12}
            view={dataDepartment?.qa_coordinator ? true : false}
            label="QA Coordinator"
            content={
              dataDepartment?.qa_coordinator?.email ? dataDepartment?.qa_coordinator?.email : ''
            }
          />
          <FieldCard
            lg={12}
            view={dataDepartment?.qa_manager ? true : false}
            label="QA Manager"
            content={dataDepartment?.qa_manager?.email ? dataDepartment?.qa_manager?.email : ''}
          />

          <FieldCard
            xs={24}
            xl={24}
            view={dataDepartment?.qa_coordinator ? true : false}
            label="Description"
            content={dataDepartment ? dataDepartment.department.description : ''}
          />
        </Row>
        <Space
          align="center"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2
            className="font-3"
            style={{
              margin: '30px 0px 20px',
            }}
          >
            Staffs
          </h2>
          <Link href={`/departments/assign/${query.id}`}>
            <a>Manager</a>
          </Link>
        </Space>
        <Space direction="vertical" size={30}>
          <Row gutter={[30, 30]}>
            {dataDepartment?.department?.staffs &&
              dataDepartment?.department?.staffs.map((item: IUser, key: number) => {
                if (!isShow && key <= 7)
                  return (
                    <User
                      key={key}
                      xs={24}
                      sm={12}
                      lg={8}
                      xl={6}
                      image={item.avatar.url}
                      name={item.name}
                      role={item.role}
                      employee_id={item.employee_id}
                    />
                  );
                if (isShow)
                  return (
                    <User
                      key={key}
                      xs={24}
                      sm={12}
                      lg={8}
                      xl={6}
                      image={item.avatar.url}
                      name={item.name}
                      role={item.role}
                      employee_id={item.employee_id}
                    />
                  );
              })}
          </Row>
          {dataDepartment?.department?.staffs?.length > 8 && !isShow && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                icon={<ArrowDownOutlined />}
                type="default"
                size="large"
                style={{ borderRadius: 5 }}
                onClick={() => setIsShow(true)}
              >
                Show more
              </Button>
            </div>
          )}
        </Space>
      </Card>
    </>
  );
};

DetailEmployee.getLayout = ClientLayout;

export default DetailEmployee;

export const getServerSideProps: GetServerSideProps = async (context) => {
  //Check login
  const res = await fetch(`http://localhost:3000/api/auth/accesstoken`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  });

  const data = await res.json();

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
    console.log('asdfasdfas');

    return {
      notFound: true,
    };
  }

  const detailUser: IUser = await fetch(`http://localhost:3000/api/users/${context.query.id}`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  }).then((e) => e.json());

  return {
    props: {
      detailUser,
    },
  };
};
