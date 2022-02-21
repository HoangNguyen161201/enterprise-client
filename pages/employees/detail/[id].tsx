//Import
import { IdcardOutlined, MailOutlined, SearchOutlined, TeamOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Card, Col, Grid, message, Row, Space } from 'antd';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect as UseEffect, useState } from 'react';
import { ClientLayout } from '../../../components/layouts';
import { IUser, NextPageWithLayout } from '../../../models';
import { getCurrentUser, getDetailUser } from '../../../queries';
import Infor from '../../../components/elements/Infor';

export interface IDetailDepartmentProps {
  detailUser: { user: IUser; [index: string]: any };
}

const DetailEmployee: NextPageWithLayout = ({ detailUser }: IDetailDepartmentProps) => {
  const { query } = useRouter();
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();

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
  const { error: errorDetailUser, data: dataDetailUser } = getDetailUser(
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
    if (errorDetailUser) {
      message.error({
        content: errorDetailUser.response?.data.err,
      });
    }
  }, [errorDetailUser]);

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
        <Space direction="vertical" size={20}>
          <Row gutter={[20, 20]}>
            <Col flex={lg ? '400px' : undefined} span={lg ? undefined : 24}>
              <Space size={20} direction="vertical">
                <Space size={20}>
                  <Avatar
                    shape="square"
                    style={{
                      width: 100,
                      height: 100,
                      border: '2px solid #009F9D',
                      borderRadius: 4,
                    }}
                    src="https://joeschmoe.io/api/v1/random"
                  />
                  <div
                    style={{
                      height: '100%',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        display: 'block',
                      }}
                    >
                      Nguyen Quang Hoang
                    </span>
                    <span
                      style={{
                        color: 'gray',
                      }}
                    >
                      Staff
                    </span>
                  </div>
                </Space>

                <span
                  style={{
                    color: 'gray',
                    fontSize: 14,
                  }}
                >
                  Employee infor
                </span>
                <Infor
                  color="#009F9D"
                  Icon={IdcardOutlined}
                  title={`epl-${dataDetailUser?.user?.employee_id}`}
                />
                <Infor
                  color="#07456F"
                  Icon={MailOutlined}
                  title={`${dataDetailUser?.user?.email}`}
                />
                <Infor
                  color="#0F0A3C"
                  Icon={TeamOutlined}
                  title={dataDetailUser?.user?.department_id?.name ? `${dataDetailUser.user.department_id.name}` : "none"}
                  url={dataDetailUser?.user?.department_id?._id && `/departments/detail/${dataDetailUser?.user?.department_id?._id}`}
                />
              </Space>
            </Col>
            <Col
              flex="auto"
              style={{
                border: '1px solid red',
              }}
            >
              <Row gutter={[20, 20]}>
                <Col
                  xs={24}
                  xl={12}
                  style={{
                    border: '1px solid red',
                  }}
                >
                  Ideal 1
                </Col>
                <Col
                  xs={24}
                  xl={12}
                  style={{
                    border: '1px solid red',
                  }}
                >
                  Ideal 2
                </Col>
              </Row>
            </Col>
          </Row>
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
    return {
      notFound: true,
    };
  }

  const detailUser: { user: IUser; [index: string]: any } = await fetch(
    `http://localhost:3000/api/users/${context.query.id}`,
    {
      method: 'GET',
      headers: {
        cookie: context.req.headers.cookie,
        authorization: data.accessToken.token,
      } as HeadersInit,
    }
  ).then((e) => e.json());

  return {
    props: {
      detailUser,
    },
  };
};
