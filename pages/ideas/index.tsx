import { NextPageWithLayout } from 'models/layoutType';
import { ClientLayout } from 'components/layouts';
import Head from 'next/head';
import { Avatar, Breadcrumb, Button, Card, Col, Collapse, Image, Row, Space } from 'antd';

const index: NextPageWithLayout = () => {
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
        <Row>
          <Col>
            <div
              style={{
                width: 200,
                border: '1px solid red',
                position: 'relative'
              }}
            >
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
          <Col
            flex={1}
            style={{
              border: '1px solid red',
            }}
          >
            <Row>
                <Col span={12}>
                    <Row gutter={20}>
                        <Col>
                            <Avatar size={'large'} style={{
                                border: '2px solid #07456F30'
                            }} src='https://avatars.dicebear.com/api/avataaars/:seed.svg'>

                            </Avatar>
                        </Col>
                        <Col flex={1}>
                        1
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    1
                </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </>
  );
};

index.getLayout = ClientLayout;
export default index;
