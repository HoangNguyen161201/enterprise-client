//Import
import { IdcardOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';
import { Alert, Avatar, Card, Col, Grid, List, message, Row, Space } from 'antd';
import { BreadCrumb, Infor, ItemIdea } from 'components/elements/common';
import { ClientLayout } from 'components/layouts';
import { GlobalContext } from 'contextApi/globalContext';
import { IDetailUser, IUser } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getCurrentUser, getDetailUser, getIdeasAcceptUser } from 'queries';
import { useContext, useEffect as UseEffect } from 'react';

export interface IDetailEmployeeProps {
  detailUser: { user: IUser; [index: string]: any };
  detailCurrentUser: IDetailUser;
}

const DetailEmployee: NextPageWithLayout = ({
  detailUser,
  detailCurrentUser,
}: IDetailEmployeeProps) => {

  const {color} = useContext(GlobalContext)

  // get id employee
  const { query } = useRouter();

  // create response
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();

  //Get id from router to get old data
  const {
    query: { id },
  } = useRouter();

  //Get access token
  const {
    data: dataUser,
    error: errorGetUser,
    refetch: dataUserRefetch,
  } = getCurrentUser(detailCurrentUser);
  UseEffect(() => {
    dataUserRefetch();
  }, []);

  //Get Idea accept user
  const { data: dataIdeasAccept, error: errDataIdeasAccept } = getIdeasAcceptUser({
    user_id: id as string,
    accessToken: dataUser?.accessToken.token,
  });

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

    if (errorDetailUser) {
      message.error({
        content: errorDetailUser.response?.data.err,
      });
    }
  }, [errorGetUser, errorDetailUser]);

  return (
    <>
      <Head>
        <title>Detail User Page</title>
      </Head>

      <BreadCrumb
        data={[
          {
            url: '/',
            label: 'Home',
          },
          {
            url: '/employees',
            label: 'All employees',
          },
        ]}
        main={{
          url: `/employees/detail/${id}`,
          label: 'Detail employee',
        }}
      />

      <Card title={<span className={`${color}`}>Detail employee</span>} className="card-b">
        <Space direction="vertical" size={20}>
          {dataUser && dataUser.user.role === 'admin' && (
            <Alert
              showIcon
              closable
              message="Admin cannot see the internal ideas of the system."
              type="warning"
            />
          )}
          <Row wrap={!lg} gutter={[30, 30]}>
            <Col flex={lg ? '400px' : undefined} span={lg ? undefined : 24}>
              <Space size={20} direction="vertical">
                <Space size={20} wrap>
                  <Avatar
                    shape="square"
                    style={{
                      width: 100,
                      height: 100,
                      border: '2px solid #009F9D',
                      borderRadius: 4,
                    }}
                    src={dataDetailUser?.user?.avatar?.url}
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
                      {dataDetailUser?.user?.name}
                    </span>
                    <span
                      style={{
                        color: 'gray',
                      }}
                    >
                      {dataDetailUser?.user?.role}
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
                  titleTooltip={'Employee ID'}
                />
                <Infor
                  color="#07456F"
                  Icon={MailOutlined}
                  title={`${dataDetailUser?.user?.email}`}
                  titleTooltip={'Employee Email'}
                />
                <Infor
                  color="#0F0A3C"
                  Icon={TeamOutlined}
                  titleTooltip={'Department'}
                  title={
                    dataDetailUser?.user?.department_id?.name
                      ? `${dataDetailUser.user.department_id.name}`
                      : 'none'
                  }
                />
              </Space>
            </Col>
            <Col flex="auto">
              <span
                style={{
                  fontSize: 14,
                  color: 'gray',
                }}
              >
                {`Ideas Accept (${(dataIdeasAccept && dataIdeasAccept.ideas.length) || 0} ideas)`}
              </span>
              <List
                itemLayout="horizontal"
                dataSource={dataIdeasAccept?.ideas}
                renderItem={(item) => <ItemIdea item={item} onDeleteIdea={() => {}} />}
              />
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
  const detailCurrentUser: IDetailUser = await fetch(`http://localhost:3000/api/auth/accesstoken`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  }).then((e) => e.json());

  //Redirect login page when error
  if (detailCurrentUser.statusCode !== 200) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const detailUser: { user: IUser; [index: string]: any } = await fetch(
    `http://localhost:3000/api/users/${context.query.id}`,
    {
      method: 'GET',
      headers: {
        cookie: context.req.headers.cookie,
        authorization: detailCurrentUser.accessToken.token,
      } as HeadersInit,
    }
  ).then((e) => e.json());

  //Redirect 404 page when not have detail detailUser
  if (detailUser.statusCode !== 200) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      detailUser,
      detailCurrentUser,
    },
  };
};
