import { Col, Grid, Image, Menu, Row, Space, Timeline } from 'antd';
import { Card, LinkSpin } from 'components/elements/common';
import { GlobalContext } from 'contextApi/globalContext';
import { IDetailUser, ISubmission, ISubmissions } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getCurrentUser } from 'queries/auth';
import { getallSubmissions } from 'queries/submission';
import { useContext as UseContext, useEffect as UseEffect } from 'react';
import { BsArrowDown, BsArrowRight } from 'react-icons/bs';
import { ClientLayout } from '../components/layouts';

interface IHome {
  result: ISubmissions;
  detailUser: IDetailUser;
}

const index: NextPageWithLayout = ({ result, detailUser }: IHome) => {
  const { darkMode, color, desColor, handleLoadPage } = UseContext(GlobalContext);

  UseEffect(() => {
    handleLoadPage(false);
  }, []);

  const { useBreakpoint: UseBreakpoint } = Grid;
  const { md } = UseBreakpoint();

  //Get access token
  const {
    data: dataUser,
    error: errorGetUser,
    refetch: dataUserRefetch,
  } = getCurrentUser(detailUser);

  // get all submission
  const {
    error: errorSubmission,
    data: dataSubmissions,
    refetch: RefetchSubmisssion,
  } = getallSubmissions(dataUser?.accessToken.token, result, {
    _page: 1,
  });

  return (
    <div
      style={{
        overflow: 'hidden',
        paddingBottom: 20,
      }}
    >
      <Head>
        <title>Home</title>
      </Head>
      <Row
        gutter={md ? [0, 0] : [0, 15]}
        style={{
          height: md ? '40vh' : 'auto',
          maxHeight: '100%',
          minHeight: 300,
          marginBottom: md ? 0 : 15,
        }}
      >
        <Col
          style={{
            height: '100%',
            position: 'relative',
            paddingRight: md ? 20 : 0,
            paddingBottom: md ? 20 : 0,
          }}
          span={md ? 16 : 24}
        >
          <Image
            alt="greenwich"
            height={'100%'}
            width={'100%'}
            preview={false}
            src="/assets/greenwich.jpg"
            style={{
              objectFit: 'cover',
            }}
          />
        </Col>
        <Col
          span={md ? 8 : 24}
          style={{
            borderLeft: md ? (darkMode ? '2px solid white' : '2px solid #001529') : 'none',
          }}
        >
          <div
            style={{
              width: '100%',
              borderBottom: md ? (darkMode ? '2px solid white' : '2px solid #001529') : 'none',
              paddingBlock: md ? 10 : 0,
              paddingInline: md ? 20 : 0,
              position: 'relative',
            }}
          >
            <span
              className={`${md ? 'font-4' : 'font-3'} color-3`}
              style={{
                fontWeight: 'bold',
              }}
            >
              CMS
            </span>
            {md && (
              <BsArrowRight
                className={`${color}`}
                style={{
                  bottom: -15,
                  position: 'absolute',
                  fontSize: 28,
                  right: -2,
                }}
              />
            )}
          </div>
          <div
            className={`font-2 ${desColor}`}
            style={{
              padding: md ? 20 : 0,
            }}
          >
            With this CMS web system, you can create, manage, modify and publish your content and
            ideas easily with a friendly interface. Help collect employees contributions to be able
            to solve a specific problem by creating submission
          </div>
        </Col>
      </Row>
      <Row
        gutter={md ? [0, 0] : [0, 15]}
        style={{
          height: md ? 450 : 'auto',
          borderTop: md ? (darkMode ? '2px solid white' : '2px solid #001529') : 'none',
        }}
      >
        <Col
          style={{
            height: '100%',
            position: 'relative',
          }}
          span={md ? 16 : 24}
        >
          <div
            style={{
              width: '100%',
              borderBottom: md ? (darkMode ? '2px solid white' : '2px solid #001529') : 'none',
              paddingBlock: md ? 10 : 0,
              paddingInline: md ? 20 : 0,
              position: 'relative',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              className={`${md ? 'font-4' : 'font-3'} color-3`}
              style={{
                fontWeight: 'bold',
              }}
            >
              Submissions
            </span>
            <LinkSpin url={'/submissions'} name="More submissions" />
          </div>
          <Row
            gutter={md ? [30, 30] : [0, 15]}
            style={{
              height: md ? 400 : 'auto',
              overflow: 'auto',
              paddingTop: 20,
              marginRight: 0,
            }}
          >
            {dataSubmissions?.submissions &&
              dataSubmissions?.submissions.map((item: ISubmission) => (
                <Card
                  xl={8}
                  lg={12}
                  md={24}
                  item={item}
                  key={item._id}
                  current_user={dataUser as IDetailUser}
                />
              ))}
          </Row>
        </Col>
        <Col
          span={md ? 8 : 24}
          style={{
            borderLeft: md ? (darkMode ? '2px solid white' : '2px solid #001529') : 'none',
          }}
        >
          <div
            style={{
              width: '100%',
              borderBottom: md ? (darkMode ? '2px solid white' : '2px solid #001529') : 'none',
              paddingBlock: md ? 10 : 0,
              paddingInline: md ? 20 : 0,
              position: 'relative',
            }}
          >
            <div
              className={`${md ? 'font-4' : 'font-3'} color-3`}
              style={{
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>Main feature</span>
            </div>
            {md && (
              <BsArrowRight
                className={`${color}`}
                style={{
                  bottom: -15,
                  position: 'absolute',
                  fontSize: 28,
                  right: -2,
                }}
              />
            )}
          </div>

          {/* link */}
          <Space
            style={{
              padding: md ? 20 : 0,
            }}
            direction="vertical"
            size={'large'}
          >
            <span className={`font-2 ${desColor}`}>Main features of the website system:</span>
            <Timeline>
              <Timeline.Item>
                <LinkSpin url={'/'} name="Home" />
              </Timeline.Item>

              <Timeline.Item color={dataUser?.user.role == 'qa_manager' ? undefined : 'red'}>
                {dataUser?.user.role == 'qa_manager' ? (
                  <LinkSpin url={'/dashboard'} name="DashBoard" />
                ) : (
                  <span className={`${color}`}>Dashboard</span>
                )}
              </Timeline.Item>

              <Timeline.Item
                color={
                  dataUser?.user.role == 'admin' || dataUser?.user.role == 'qa_manager'
                    ? undefined
                    : 'red'
                }
              >
                {dataUser?.user.role == 'admin' || dataUser?.user.role == 'qa_manager' ? (
                  <LinkSpin url={'/departments'} name="Departments" />
                ) : (
                  <span className={`${color}`}>Departments</span>
                )}
              </Timeline.Item>

              <Timeline.Item
                color={
                  dataUser?.user.role == 'admin' || dataUser?.user.role == 'qa_manager'
                    ? undefined
                    : 'red'
                }
              >
                {dataUser?.user.role == 'admin' || dataUser?.user.role == 'qa_manager' ? (
                  <LinkSpin url={'/categories'} name="Categories" />
                ) : (
                  <span className={`${color}`}>Categories</span>
                )}
              </Timeline.Item>

              <Timeline.Item>
                <LinkSpin url={'/submissions'} name="Submissions" />
              </Timeline.Item>
              <Timeline.Item
                color={
                  dataUser?.user.role == 'admin' || dataUser?.user.role == 'qa_manager'
                    ? undefined
                    : 'red'
                }
              >
                {dataUser?.user.role == 'admin' || dataUser?.user.role == 'qa_manager' ? (
                  <LinkSpin url={'/employees'} name="Employees" />
                ) : (
                  <span className={`${color}`}>Employees</span>
                )}
              </Timeline.Item>
              <Timeline.Item color={dataUser?.user.role == 'admin' ? 'red' : undefined}>
                {dataUser?.user.role == 'admin' ? (
                  <span className={`${color}`}>Ideas</span>
                ) : (
                  <LinkSpin url={'/ideas'} name="Ideas" />
                )}
              </Timeline.Item>
            </Timeline>
          </Space>
          {md && (
            <BsArrowDown
              className={`${color}`}
              style={{
                left: -15,
                position: 'absolute',
                fontSize: 28,
                bottom: -2,
              }}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

index.getLayout = ClientLayout;

export default index;

export const getServerSideProps: GetServerSideProps = async (context) => {
  //Check login
  const detailUser: IDetailUser = await fetch(`${process.env.CLIENT_URL}/api/auth/accesstoken`, {
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

  //Get all data users
  const result: ISubmissions = await fetch(`${process.env.CLIENT_URL}/api/submissions?_page=1`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
      authorization: detailUser.accessToken.token,
    } as HeadersInit,
  }).then((e) => e.json());

  return {
    props: {
      result,
      detailUser,
    },
  };
};
