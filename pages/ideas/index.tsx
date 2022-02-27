import { Avatar, Breadcrumb, Card, Col, Collapse, Pagination, Row, Space, Tag, Grid } from 'antd';
import Idea from 'components/elements/common/Idea';
import { ClientLayout } from 'components/layouts';
import { IDetailUser } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getCurrentUser } from 'queries/auth';
import { getAllIdeas } from 'queries/idea';
import { useState } from 'react';

const index: NextPageWithLayout = ({detailUser}) => {
  const { useBreakpoint } = Grid;
  const { md } = useBreakpoint();
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(6)
  const [reaction, setReaction] = useState(null)

  const {
    data: dataUser,
    error: errorGetUser,
    refetch: dataUserRefetch,
  } = getCurrentUser(detailUser);

  const {data: AllIdeas, error: errorIdeas, refetch: refetchIdeas} = getAllIdeas({
    _limit: limit,
    _page: page,
    _sort: -1,
    _sortBy: 'view',
    _reaction: reaction
  }, dataUser?.accessToken.token)
  return (
    <>
      <Head>
        <title> Ideals</title>
      </Head>

      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Ideas</Breadcrumb.Item>
        <Breadcrumb.Item>View Detail Idea</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="View Detail Employee" style={{ width: '100%', marginTop: '20px' }}>
        <Row wrap={md ? false : true} gutter={[30, 30]}>
          <Col
            span={md ? undefined : 24}
            style={{
              minWidth: 300,
            }}
          >
            <div>
              <Collapse bordered={false} ghost defaultActiveKey={['1', '2']}>
                <Collapse.Panel header={'All'} key="1">
                  <div
                    style={{
                      fontWeight: 500,
                      height: 40,
                      background: 'black',
                      color: 'white',
                      lineHeight: '40px',
                      paddingLeft: 22,
                      borderRadius: 5,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      paddingRight: '15px',
                    }}
                  >
                    Category 1 fg fdg df dfg dfg df
                  </div>
                </Collapse.Panel>
                <Collapse.Panel header="Reaction" key="2">
                  <div
                    style={{
                      paddingLeft: '22px',
                      height: '40px',
                    }}
                  >
                    <span
                      className="font-4"
                      style={{
                        marginRight: 10,
                      }}
                    >
                      🤣
                    </span>
                    <span className="font-2">Fun</span>
                  </div>

                  <div
                    style={{
                      paddingLeft: '22px',
                      height: '40px',
                    }}
                  >
                    <span
                      className="font-4"
                      style={{
                        marginRight: 10,
                      }}
                    >
                      😭
                    </span>
                    <span className="font-2">Sad</span>
                  </div>

                  <div
                    style={{
                      paddingLeft: '22px',
                      height: '40px',
                    }}
                  >
                    <span
                      className="font-4"
                      style={{
                        marginRight: 10,
                      }}
                    >
                      😡
                    </span>
                    <span className="font-2">Angry</span>
                  </div>
                </Collapse.Panel>
                <Collapse.Panel header="Category" key="3">
                  <div
                    style={{
                      fontWeight: 500,
                      height: 40,
                      background: 'black',
                      color: 'white',
                      lineHeight: '40px',
                      paddingLeft: 22,
                      borderRadius: 5,
                    }}
                  >
                    Category 1
                  </div>
                </Collapse.Panel>
              </Collapse>
            </div>
          </Col>
          <Col span={md ? undefined : 24} flex="auto">
            <Row gutter={[0, 30]}>
              {
                AllIdeas?.ideas && AllIdeas.ideas.map((idea)=> (
                    <Idea
                      title={idea.title}
                      time={'22/12/22'}
                      userName={idea.user_id.name}
                      avatar={idea.user_id.avatar.url}
                      count={idea.view}
                      description={idea.description}
                      iconReaction={'😡'}
                    />
                ))
              }
            </Row>
            <div
              style={{
                marginTop: 30,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Pagination defaultCurrent={1} defaultPageSize={1} total={5} />
            </div>
          </Col>
        </Row>
      </Card>
    </>
  );
};

index.getLayout = ClientLayout;
export default index;


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
  if (detailUser.user.role === 'admin') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      detailUser
    },
  };
};
