import { Col, Image, Menu, Row, Space } from 'antd';
import { GlobalContext } from 'contextApi/globalContext';
import { IDetailUser } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useContext as UseContext } from 'react';
import { BsArrowDown, BsArrowRight } from 'react-icons/bs';
import { ClientLayout } from '../components/layouts';

const index: NextPageWithLayout = () => {
  const { darkMode, color, desColor } = UseContext(GlobalContext);
  return (
    <div style={{
      overflow: 'hidden'
    }}>
      <Head>
        <title>Home</title>
      </Head>
      <Row
        gutter={[0, 0]}
        style={{
          height: '40vh',
          maxHeight: '100%',
          minHeight: 300,
        }}
      >
        <Col
          style={{
            height: '100%',
            position: 'relative',
            paddingRight: 20,
            paddingBottom: 20,
          }}
          span={16}
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
          span={8}
          style={{
            borderLeft: darkMode ? '2px solid white' : '2px solid #001529',
          }}
        >
          <div
            style={{
              width: '100%',
              borderBottom: darkMode ? '2px solid white' : '2px solid #001529',
              paddingBlock: 10,
              paddingInline: 20,
              position: 'relative',
            }}
          >
            <span
              className="font-4 color-3"
              style={{
                fontWeight: 'bold',
              }}
            >
              CMS
            </span>

            <BsArrowRight
              className={`${color}`}
              style={{
                bottom: -15,
                position: 'absolute',
                fontSize: 28,
                right: -2,
              }}
            />
          </div>
          <div
            className={`font-2 ${desColor}`}
            style={{
              padding: 20,
            }}
          >
            With this CMS web system, you can create, manage, modify and publish your content and
            ideas easily with a friendly interface. Help collect employees contributions to be able
            to solve a specific problem by creating submission
          </div>
        </Col>
      </Row>
      <Row
        gutter={[0, 0]}
        style={{
          height: '40vh',
          minHeight: 300,
          borderTop: darkMode ? '2px solid white' : '2px solid #001529',
        }}
      >
        <Col
          style={{
            height: '100%',
            position: 'relative',
            paddingRight: 20,
            paddingTop: 20,
          }}
          span={16}
        >
          <Row
            gutter={[20, 0]}
            style={{
              height: '100%',
              position: 'relative',
            }}
          >
            <Col
              span={12}
              style={{
                height: '100%',
                position: 'relative',
              }}
            >
              <Image
                alt="submission1"
                height={'100%'}
                width={'100%'}
                preview={false}
                src="/assets/submission1.svg"
                style={{
                  objectFit: 'cover',
                  background: 'white',
                  borderRadius: 10,
                }}
              />
              <span
                className={`font-2 ${color}`}
                style={{
                  fontWeight: 'bold',
                }}
              >
                Please suggest a theme for this summer
              </span>
            </Col>
            <Col
              span={12}
              style={{
                height: '100%',
                position: 'relative',
              }}
            >
              <Image
                alt="submission2"
                height={'100%'}
                width={'100%'}
                preview={false}
                src="/assets/submission2.svg"
                style={{
                  objectFit: 'cover',
                  background: 'white',
                  borderRadius: 10,
                }}
              />
              <span
                className={`font-2 ${color}`}
                style={{
                  fontWeight: 'bold',
                }}
              >
                Dev with me
              </span>
            </Col>
          </Row>
        </Col>
        <Col
          span={8}
          style={{
            borderLeft: darkMode ? '2px solid white' : '2px solid #001529',
          }}
        >
          <div
            style={{
              width: '100%',
              borderBottom: darkMode ? '2px solid white' : '2px solid #001529',
              paddingBlock: 10,
              paddingInline: 20,
              position: 'relative',
            }}
          >
            <div
              className="font-4 color-3"
              style={{
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>Main feature</span>
            </div>
            <BsArrowRight
              className={`${color}`}
              style={{
                bottom: -15,
                position: 'absolute',
                fontSize: 28,
                right: -2,
              }}
            />
          </div>

          {/* link */}
          <Space
            style={{
              padding: 20,
            }}
            direction="vertical"
          >
            <span className={`font-2 ${desColor}`}>Main features of the website system:</span>
            {/* <Space direction='vertical' style={{
              marginLeft: 20
            }}>
              <Link href={'/'}>
                <a>Home</a>
              </Link>
              <Link href={'/dashboard'}>
                <a>DashBoard</a>
              </Link>
              <Link href={'/departments'}>
                <a>Departments</a>
              </Link>
              <Link href={'/submissions'}>
                <a>Submissions</a>
              </Link>
              <Link href={'/employees'}>
                <a>Employees</a>
              </Link>
              <Link href={'/ideas'}>
                <a>Ideas</a>
              </Link>
            </Space> */}
          </Space>

          <BsArrowDown
            className={`${color}`}
            style={{
              left: -15,
              position: 'absolute',
              fontSize: 28,
              bottom: -2,
            }}
          />
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

  return {
    props: {},
  };
};
