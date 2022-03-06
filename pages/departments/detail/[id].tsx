//Import
import { ArrowDownOutlined } from '@ant-design/icons';
import { Button, Card, message, Row, Space } from 'antd';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect as UseEffect, useState } from 'react';
import { BreadCrumb, FieldCard, User } from 'components/elements/common';
import { ClientLayout } from 'components/layouts';
import { IDetailDepartment, IDetailUser, IUser } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import { getCurrentUser } from 'queries/auth';
import { getDetailDepartment } from 'queries/department';
import { GlobalContext } from 'contextApi/globalContext';

export interface IDetailDepartmentProps {
  detailDepartment: IDetailDepartment;
  detailUser: IDetailUser;
}

const DetailDepartment: NextPageWithLayout = ({
  detailDepartment,
  detailUser,
}: IDetailDepartmentProps) => {
  const { query } = useRouter();

  const { color, desColor, color2} = useContext(GlobalContext);

  const [isShow, setIsShow] = useState(false);
  //Get id from router to get old data
  const {
    query: { id },
  } = useRouter();

  //Get access token
  const {
    data: dataUser,
    error: errorGetUser,
    refetch: dataUserRefetch,
  } = getCurrentUser(detailUser);
  UseEffect(() => {
    dataUserRefetch();
  }, []);

  //Get detail data department
  const { error: errorDepartment, data: dataDepartment } = getDetailDepartment(
    id as string,
    dataUser?.accessToken.token,
    detailDepartment
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

  return (
    <>
      <Head>
        <title>Detail Department Page</title>
      </Head>

      <BreadCrumb
        data={[
          {
            url: '/',
            label: 'Home',
          },
          {
            url: '/departments',
            label: 'All Departments',
          },
        ]}
        main={{
          url: `/departments/detail/${query.id}`,
          label: 'Detail department',
        }}
      />

      <Card title={<span className={`${color}`}>View Detail Department</span>} className="card-b">
        <Space direction="vertical" size={30}>
          <Space direction="vertical" size={10}>
            <span className={`font-2 ${desColor}`}>Information</span>
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
          <Space direction='vertical' size={10}>

          <Space
            align="center"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className={`font-2 ${desColor}`}>Staff</span>
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
                        id={item._id}
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
                        id={item._id}
                        image={item.avatar.url}
                        name={item.name}
                        role={item.role}
                        employee_id={item.employee_id}
                      />
                    );
                })}
            </Row>
            {dataDepartment?.department?.staffs &&
              dataDepartment.department.staffs.length > 8 &&
              !isShow && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    icon={<ArrowDownOutlined />}
                    type="default"
                    size="large"
                    style={{ borderRadius: 5 }}
                    className={`${color2}`}
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
  const detailUser: IDetailUser = await fetch(`http://localhost:3000/api/auth/accesstoken`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  }).then((e) => e.json());

  //Redirect login page when error
  if (detailUser.statusCode !== 200) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  //Check role
  if (detailUser.user.role !== 'admin' && detailUser.user.role !== 'qa_manager') {
    return {
      notFound: true,
    };
  }

  const detailDepartment: IDetailDepartment = await fetch(
    `http://localhost:3000/api/departments/${context.query.id}`,
    {
      method: 'GET',
      headers: {
        cookie: context.req.headers.cookie,
        authorization: detailUser.accessToken.token,
      } as HeadersInit,
    }
  ).then((e) => e.json());

  //Redirect 404 page when not have detail department
  if (detailDepartment.statusCode !== 200) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      detailDepartment,
      detailUser,
    },
  };
};
