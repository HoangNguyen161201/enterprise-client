import { Avatar, Breadcrumb, Card, Col, Collapse, Pagination, Row, Space, Tag, Grid } from 'antd';
import Idea from 'components/elements/common/Idea';
import { ClientLayout } from 'components/layouts';
import { NextPageWithLayout } from 'models/layoutType';
import Head from 'next/head';

const index: NextPageWithLayout = () => {
  const { useBreakpoint } = Grid;
  const { md } = useBreakpoint();
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
              <Idea
                title={'This is title'}
                time={'22/12/22'}
                userName="hoang nguyen"
                avatar={'http'}
                count={12}
                description={'this is description'}
                iconReaction={'😡'}
              />
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
