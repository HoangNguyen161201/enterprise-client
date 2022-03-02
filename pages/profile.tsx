//Import
import { IdcardOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Card, Col, Grid, List, message, Row, Space } from 'antd';
import { Infor, ItemIdea } from 'components/elements/common';
import { ClientLayout } from 'components/layouts';
import { IDetailUser } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getCurrentUser, getIdeasAcceptUser } from 'queries';
import { useEffect as UseEffect } from 'react';

export interface IDetailEmployeeProps {
  detailCurrentUser: IDetailUser;
}

const DetailEmployee: NextPageWithLayout = ({ detailCurrentUser }: IDetailEmployeeProps) => {
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();

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
    user_id: dataUser?.user._id,
    accessToken: dataUser?.accessToken.token,
  });

  console.log(dataIdeasAccept);

  //Check exist and show error
  UseEffect(() => {
    if (errorGetUser) {
      message.error({
        content: errorGetUser.response?.data.err,
      });
    }
  }, [errorGetUser]);

  return (
    <>
      <Head>
        <title>Profile Page</title>
      </Head>

      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Profile</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="View Profile" style={{ width: '100%', marginTop: '20px' }}>
        <Space direction="vertical" size={20}>
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
                    src={dataUser?.user?.avatar?.url}
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
                      {dataUser?.user?.name}
                    </span>
                    <span
                      style={{
                        color: 'gray',
                      }}
                    >
                      {dataUser?.user?.role}
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
                  title={`epl-${dataUser?.user?.employee_id}`}
                  titleTooltip={'Employee ID'}
                />
                <Infor
                  color="#07456F"
                  Icon={MailOutlined}
                  title={`${dataUser?.user?.email}`}
                  titleTooltip={'Employee Email'}
                />
                <Infor
                  color="#0F0A3C"
                  Icon={TeamOutlined}
                  titleTooltip={'Department'}
                  title={
                    dataUser?.user?.department_id?.name
                      ? `${dataUser.user.department_id.name}`
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

  return {
    props: {
      detailCurrentUser,
    },
  };
};
