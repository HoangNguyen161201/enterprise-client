//Import
import { ArrowDownOutlined } from '@ant-design/icons';
import { Button, Card, message, Row, Space } from 'antd';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useEffect as UseEffect, useState } from 'react';
import { BreadCrumb, FieldCard, User } from 'components/elements/common';
import { ClientLayout } from 'components/layouts';
import { NextPageWithLayout } from 'models/layoutType';
import { IDetailDepartment } from 'models/apiType';
import { IUser } from 'models/apiType';
import { getCurrentUser, getDepartmentByUser } from 'queries';
import { GlobalContext } from 'contextApi/globalContext';

export interface IDetailDepartmentProps {
  detailMyDepartment: IDetailDepartment;
}

const DetailDepartment: NextPageWithLayout = ({ detailMyDepartment }: IDetailDepartmentProps) => {
  const { color, desColor } = useContext(GlobalContext);

  //Is show button load more
  const [isShow, setIsShow] = useState(false);

  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();
  UseEffect(() => {
    dataUserRefetch();
  }, []);

  //Get detail data department
  const {
    error: errorDepartment,
    data: dataDepartment,
    refetch: refetchDepartment,
  } = getDepartmentByUser(dataUser?.user._id, dataUser?.accessToken.token, detailMyDepartment);
  useEffect(() => {
    if (dataUser) {
      refetchDepartment();
    }
  }, [dataUser, refetchDepartment]);

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

  return (
    <>
      <Head>
        <title> My Department</title>
      </Head>

      <BreadCrumb
        data={[
          {
            url: '/',
            label: 'Home',
          },
        ]}
        main={{
          url: '/my-department',
          label: 'My department',
        }}
      />

      <Card title={<span className={`${color}`}>View My Department</span>} className="card-b shadow-l">
        <Space direction='vertical' size={20}>
          <Space direction="vertical" size={15}>
            <Row gutter={[30, 20]}>
              <FieldCard
                lg={12}
                label="ID Department"
                content={dataDepartment ? dataDepartment.department?._id : ''}
              />
              <FieldCard
                lg={12}
                view={dataDepartment?.department.department_manager ? true : false}
                user_id={
                  dataDepartment?.department.department_manager
                    ? dataDepartment?.department.department_manager._id
                    : undefined
                }
                label="Department Manager"
                content={
                  dataDepartment
                    ? (dataDepartment.department?.department_manager?.email as string)
                    : ''
                }
              />
              <FieldCard
                lg={12}
                view={dataDepartment?.department.qa_coordinator ? true : false}
                user_id={
                  dataDepartment?.department.qa_coordinator
                    ? dataDepartment?.department.qa_coordinator._id
                    : undefined
                }
                label="QA Coordinator"
                content={
                  dataDepartment ? (dataDepartment.department?.qa_coordinator?.email as string) : ''
                }
              />
              <FieldCard
                lg={12}
                view={dataDepartment?.department.qa_manager ? true : false}
                user_id={
                  dataDepartment?.department.qa_manager
                    ? dataDepartment?.department.qa_manager._id
                    : undefined
                }
                label="QA Manager"
                content={
                  dataDepartment ? (dataDepartment.department?.qa_manager?.email as string) : ''
                }
              />

              <FieldCard
                xs={24}
                xl={24}
                view={false}
                label="Description"
                content={dataDepartment ? dataDepartment.department?.description : ''}
              />
            </Row>
          </Space>

          <Space direction="vertical" size={15}>
            <Space
              align="center"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span className={`font-2 ${desColor}`}>Staff</span>
            </Space>
            <Space direction="vertical" size={30}>
              <Row gutter={[30, 30]}>
                {dataDepartment?.department?.staffs &&
                  dataDepartment?.department?.staffs.map((item: IUser, key: number) => {
                    if (!isShow && key <= 7)
                      return (
                        <User
                          id={item._id}
                          key={key}
                          xs={24}
                          sm={12}
                          lg={8}
                          xl={6}
                          image={item.avatar.url}
                          name={item.name}
                          role={item.role}
                        />
                      );
                    if (isShow)
                      return (
                        <User
                          id={item._id}
                          key={key}
                          xs={24}
                          sm={12}
                          lg={8}
                          xl={6}
                          image={item.avatar.url}
                          name={item.name}
                          role={item.role}
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
          </Space>
        </Space>
      </Card>
    </>
  );
};

DetailDepartment.getLayout = ClientLayout;

export default DetailDepartment;

export const getServerSideProps: GetServerSideProps = async (context) => {
  //Check login
  const res = await fetch(`${process.env.CLIENT_URL}/api/auth/accesstoken`, {
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
  if (data?.user?.role === 'admin') {
    return {
      notFound: true,
    };
  }

  //Check user assigned department
  if (!data.user.department_id) {
    return {
      props: {
        detailMyDepartment: null,
      },
    };
  }

  //Get department by current user
  const detailMyDepartment: IDetailDepartment = await fetch(
    `${process.env.CLIENT_URL}/api/departments/user/${data.user._id}`,
    {
      method: 'GET',
      headers: {
        cookie: context.req.headers.cookie,
      } as HeadersInit,
    }
  ).then((e) => e.json());

  return {
    props: {
      detailMyDepartment,
    },
  };
};
