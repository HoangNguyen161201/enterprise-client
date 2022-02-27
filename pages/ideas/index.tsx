import {
  Avatar,
  Breadcrumb, Card,
  Col,
  Collapse, Pagination, Row,
  Space, Tag
} from 'antd';
import { ClientLayout } from 'components/layouts';
import { NextPageWithLayout } from 'models/layoutType';
import Head from 'next/head';

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
        <Row wrap={false} gutter={[30, 0]}>
          <Col style={{
              minWidth: 300
          }}>
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
          <Col flex="auto">
            <Row gutter={[0, 30]}>
              <Col span={24}>
                <Space size={20} align="start">
                  <Avatar
                    size={'large'}
                    style={{
                      border: '2px solid #07456F30',
                    }}
                    src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"
                  >
                    nguyen
                  </Avatar>
                  <Space direction="vertical" size={'middle'}>
                    <Space direction="vertical">
                      <Space size={'middle'}>
                        <span>Nguyen quang hoang</span>
                        <span
                          style={{
                            color: 'gray',
                          }}
                        >
                          20/12/2022
                        </span>
                      </Space>
                      <span
                        className="font-3"
                        style={{
                          fontWeight: 'bold',
                          color: '#07456F',
                        }}
                      >
                        This is title
                      </span>
                      <span
                        style={{
                          color: 'gray',
                        }}
                      >
                        This is title This is title This is titleThis is title This is title This is
                        title This is title This is title s is title This is title{' '}
                      </span>
                    </Space>

                    <Tag
                      color="processing"
                      icon={
                        <span
                          style={{
                            marginRight: 8,
                          }}
                        >
                          🤣
                        </span>
                      }
                    >
                      3 View
                    </Tag>
                  </Space>
                </Space>
              </Col>

              <Col span={24}>
                <Space size={20} align="start">
                  <Avatar
                    size={'large'}
                    style={{
                      border: '2px solid #07456F30',
                    }}
                    src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"
                  >
                    nguyen
                  </Avatar>
                  <Space direction="vertical" size={'middle'}>
                    <Space direction="vertical">
                      <Space size={'middle'}>
                        <span>Nguyen quang hoang</span>
                        <span
                          style={{
                            color: 'gray',
                          }}
                        >
                          20/12/2022
                        </span>
                      </Space>
                      <span
                        className="font-3"
                        style={{
                          fontWeight: 'bold',
                          color: '#07456F',
                        }}
                      >
                        This is title
                      </span>
                      <span
                        style={{
                          color: 'gray',
                        }}
                      >
                        This is title This is title This is titleThis is title This is title This is
                        title This is title This is title s is title This is title{' '}
                      </span>
                    </Space>

                    <Tag
                      color="processing"
                      icon={
                        <span
                          style={{
                            marginRight: 8,
                          }}
                        >
                          🤣
                        </span>
                      }
                    >
                      3 View
                    </Tag>
                  </Space>
                </Space>
              </Col>

              <Col span={24}>
                <Space size={20} align="start">
                  <Avatar
                    size={'large'}
                    style={{
                      border: '2px solid #07456F30',
                    }}
                    src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"
                  >
                    nguyen
                  </Avatar>
                  <Space direction="vertical" size={'middle'}>
                    <Space direction="vertical">
                      <Space size={'middle'}>
                        <span>Nguyen quang hoang</span>
                        <span
                          style={{
                            color: 'gray',
                          }}
                        >
                          20/12/2022
                        </span>
                      </Space>
                      <span
                        className="font-3"
                        style={{
                          fontWeight: 'bold',
                          color: '#07456F',
                        }}
                      >
                        This is title
                      </span>
                      <span
                        style={{
                          color: 'gray',
                        }}
                      >
                        This is title This is title This is titleThis is title This is title This is
                        title This is title This is title s is title This is title{' '}
                      </span>
                    </Space>

                    <Tag
                      color="processing"
                      icon={
                        <span
                          style={{
                            marginRight: 8,
                          }}
                        >
                          🤣
                        </span>
                      }
                    >
                      3 View
                    </Tag>
                  </Space>
                </Space>
              </Col>

              <Col span={24}>
                <Space size={20} align="start">
                  <Avatar
                    size={'large'}
                    style={{
                      border: '2px solid #07456F30',
                    }}
                    src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"
                  >
                    nguyen
                  </Avatar>
                  <Space direction="vertical" size={'middle'}>
                    <Space direction="vertical">
                      <Space size={'middle'}>
                        <span>Nguyen quang hoang</span>
                        <span
                          style={{
                            color: 'gray',
                          }}
                        >
                          20/12/2022
                        </span>
                      </Space>
                      <span
                        className="font-3"
                        style={{
                          fontWeight: 'bold',
                          color: '#07456F',
                        }}
                      >
                        This is title
                      </span>
                      <span
                        style={{
                          color: 'gray',
                        }}
                      >
                        This is title This is title This is titleThis is title This is title This is
                        title This is title This is title s is title This is title{' '}
                      </span>
                    </Space>

                    <Tag
                      color="processing"
                      icon={
                        <span
                          style={{
                            marginRight: 8,
                          }}
                        >
                          🤣
                        </span>
                      }
                    >
                      3 View
                    </Tag>
                  </Space>
                </Space>
              </Col>

              <Col span={24}>
                <Space size={20} align="start">
                  <Avatar
                    size={'large'}
                    style={{
                      border: '2px solid #07456F30',
                    }}
                    src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"
                  >
                    nguyen
                  </Avatar>
                  <Space direction="vertical" size={'middle'}>
                    <Space direction="vertical">
                      <Space size={'middle'}>
                        <span>Nguyen quang hoang</span>
                        <span
                          style={{
                            color: 'gray',
                          }}
                        >
                          20/12/2022
                        </span>
                      </Space>
                      <span
                        className="font-3"
                        style={{
                          fontWeight: 'bold',
                          color: '#07456F',
                        }}
                      >
                        This is title
                      </span>
                      <span
                        style={{
                          color: 'gray',
                        }}
                      >
                        This is title This is title This is titleThis is title This is title This is
                        title This is title This is title s is title This is title{' '}
                      </span>
                    </Space>

                    <Tag
                      color="processing"
                      icon={
                        <span
                          style={{
                            marginRight: 8,
                          }}
                        >
                          🤣
                        </span>
                      }
                    >
                      3 View
                    </Tag>
                  </Space>
                </Space>
              </Col>

              <Col span={24}>
                <Space size={20} align="start">
                  <Avatar
                    size={'large'}
                    style={{
                      border: '2px solid #07456F30',
                    }}
                    src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"
                  >
                    nguyen
                  </Avatar>
                  <Space direction="vertical" size={'middle'}>
                    <Space direction="vertical">
                      <Space size={'middle'}>
                        <span>Nguyen quang hoang</span>
                        <span
                          style={{
                            color: 'gray',
                          }}
                        >
                          20/12/2022
                        </span>
                      </Space>
                      <span
                        className="font-3"
                        style={{
                          fontWeight: 'bold',
                          color: '#07456F',
                        }}
                      >
                        This is title
                      </span>
                      <span
                        style={{
                          color: 'gray',
                        }}
                      >
                        This is title This is title This is titleThis is title This is title This is
                        title This is title This is title s is title This is title{' '}
                      </span>
                    </Space>

                    <Tag
                      color="processing"
                      icon={
                        <span
                          style={{
                            marginRight: 8,
                          }}
                        >
                          🤣
                        </span>
                      }
                    >
                      3 View
                    </Tag>
                  </Space>
                </Space>
              </Col>

              <Col span={24}>
                <Space size={20} align="start">
                  <Avatar
                    size={'large'}
                    style={{
                      border: '2px solid #07456F30',
                    }}
                    src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"
                  >
                    nguyen
                  </Avatar>
                  <Space direction="vertical" size={'middle'}>
                    <Space direction="vertical">
                      <Space size={'middle'}>
                        <span>Nguyen quang hoang</span>
                        <span
                          style={{
                            color: 'gray',
                          }}
                        >
                          20/12/2022
                        </span>
                      </Space>
                      <span
                        className="font-3"
                        style={{
                          fontWeight: 'bold',
                          color: '#07456F',
                        }}
                      >
                        This is title
                      </span>
                      <span
                        style={{
                          color: 'gray',
                        }}
                      >
                        This is title This is title This is titleThis is title This is title This is
                        title This is title This is title s is title This is title{' '}
                      </span>
                    </Space>

                    <Tag
                      color="processing"
                      icon={
                        <span
                          style={{
                            marginRight: 8,
                          }}
                        >
                          🤣
                        </span>
                      }
                    >
                      3 View
                    </Tag>
                  </Space>
                </Space>
              </Col>

              <Col span={24}>
                <Space size={20} align="start">
                  <Avatar
                    size={'large'}
                    style={{
                      border: '2px solid #07456F30',
                    }}
                    src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"
                  >
                    nguyen
                  </Avatar>
                  <Space direction="vertical" size={'middle'}>
                    <Space direction="vertical">
                      <Space size={'middle'}>
                        <span>Nguyen quang hoang</span>
                        <span
                          style={{
                            color: 'gray',
                          }}
                        >
                          20/12/2022
                        </span>
                      </Space>
                      <span
                        className="font-3"
                        style={{
                          fontWeight: 'bold',
                          color: '#07456F',
                        }}
                      >
                        This is title
                      </span>
                      <span
                        style={{
                          color: 'gray',
                        }}
                      >
                        This is title This is title This is titleThis is title This is title This is
                        title This is title This is title s is title This is title{' '}
                      </span>
                    </Space>

                    <Tag
                      color="processing"
                      icon={
                        <span
                          style={{
                            marginRight: 8,
                          }}
                        >
                          🤣
                        </span>
                      }
                    >
                      3 View
                    </Tag>
                  </Space>
                </Space>
              </Col>

              <Col span={24}>
                <Space size={20} align="start">
                  <Avatar
                    size={'large'}
                    style={{
                      border: '2px solid #07456F30',
                    }}
                    src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"
                  >
                    nguyen
                  </Avatar>
                  <Space direction="vertical" size={'middle'}>
                    <Space direction="vertical">
                      <Space size={'middle'}>
                        <span>Nguyen quang hoang</span>
                        <span
                          style={{
                            color: 'gray',
                          }}
                        >
                          20/12/2022
                        </span>
                      </Space>
                      <span
                        className="font-3"
                        style={{
                          fontWeight: 'bold',
                          color: '#07456F',
                        }}
                      >
                        This is title
                      </span>
                      <span
                        style={{
                          color: 'gray',
                        }}
                      >
                        This is title This is title This is titleThis is title This is title This is
                        title This is title This is title s is title This is title{' '}
                      </span>
                    </Space>

                    <Tag
                      color="processing"
                      icon={
                        <span
                          style={{
                            marginRight: 8,
                          }}
                        >
                          🤣
                        </span>
                      }
                    >
                      3 View
                    </Tag>
                  </Space>
                </Space>
              </Col>
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
