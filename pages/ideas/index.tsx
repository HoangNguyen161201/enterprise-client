import {
  Breadcrumb,
  Card,
  Col,
  Collapse,
  Empty,
  Grid,
  InputNumber,
  Pagination,
  Row,
  Space,
  Spin,
} from 'antd';
import { CtSlideItem, Reaction } from 'components/elements/common';
import Idea from 'components/elements/common/Idea';
import { ClientLayout } from 'components/layouts';
import { IDetailUser } from 'models/apiType';
import { IFilter } from 'models/elementType';
import { NextPageWithLayout } from 'models/layoutType';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getCurrentUser, getallCategories } from 'queries';
import { getAllIdeas } from 'queries/idea';
import { getReactType } from 'queries/reaction';
import { useEffect, useState } from 'react';

var timeOutLimit: NodeJS.Timeout;

const index: NextPageWithLayout = ({ detailUser }) => {
  const { useBreakpoint } = Grid;
  const { md } = useBreakpoint();
  const [_page, setPage] = useState(1);
  const [_limit, setLimit] = useState(6);
  const [_nameById, setNameById] = useState<string | null>(null);
  const [_valueById, setValueById] = useState<string | null>(null);
  const [_reaction, setReaction] = useState<string | null>(null);
  const [icon, setIcon] = useState('👁');

  const {
    data: dataUser,
    error: errorGetUser,
    refetch: dataUserRefetch,
  } = getCurrentUser(detailUser);

  const { data: DataCt, error: errorCt, refetch: refetchCt } = getallCategories(detailUser);

  const {
    data: AllIdeas,
    error: errorIdeas,
    refetch: refetchIdeas,
    isLoading: isLoadingIdeas,
  } = getAllIdeas(
    {
      _limit,
      _page,
      _sort: -1,
      _sortBy: 'view',
      _reaction,
      _nameById,
      _valueById,
    },
    dataUser?.accessToken.token
  );

  console.log(AllIdeas);

  useEffect(() => {
    console.log(errorIdeas?.response?.data);
  }, [errorIdeas]);

  const handleCReaction = ({
    isView = false,
    id,
    icon,
    _nameById,
    _valueById,
  }: Partial<IFilter>) => {
    if (isView) {
      setReaction(null);
    } else {
      setReaction(id as string);
    }
    if (_nameById && _valueById) {
      setNameById(_nameById);
      setValueById(_valueById);
    } else {
      setNameById(null);
      setValueById(null);
    }
    if (icon) return setIcon(icon);
    setPage(1);
    setLimit(6);
  };

  const { data: allReaction, error: errorReaction, refetch: refetchReaction } = getReactType();
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
                    onClick={() => {
                      handleCReaction({
                        isView: true,
                        icon: '👁',
                        id: null,
                      });
                    }}
                    style={{
                      fontWeight: 500,
                      height: 40,
                      // background: 'black',
                      color: '#07456f',
                      lineHeight: '40px',
                      paddingLeft: 22,
                      borderRadius: 5,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      paddingRight: '15px',
                      cursor: 'pointer',
                    }}
                  >
                    View
                  </div>
                </Collapse.Panel>
                {allReaction?.reactionTypes && (
                  <Collapse.Panel header="Reaction" key="2">
                    <Space direction='vertical' size={'small'}>
                      {allReaction.reactionTypes.map((reaction) => (
                        <Reaction
                          handleCReaction={handleCReaction}
                          id={reaction._id}
                          key={reaction._id}
                          name={reaction.name}
                          icon={reaction.icon}
                        />
                      ))}
                    </Space>
                  </Collapse.Panel>
                )}

                <Collapse.Panel header="Category" key="3">
                  <Space direction='vertical' size={'small'}>
                    {DataCt?.categories &&
                      DataCt.categories.map((ct) => (
                        <CtSlideItem handleCReaction={handleCReaction} ct={ct} key={ct._id} />
                      ))}
                  </Space>
                </Collapse.Panel>
              </Collapse>
            </div>
          </Col>
          {isLoadingIdeas ? (
            <Space
              style={{
                height: 300,
                display: 'flex',
                justifyContent: 'center',
              }}
              direction="vertical"
              align="center"
            >
              <Spin spinning={true} />
            </Space>
          ) : errorIdeas || AllIdeas?.ideas.length == 0 ? (
            <Space
              style={{
                height: 300,
                display: 'flex',
                justifyContent: 'center',
              }}
              direction="vertical"
              align="center"
            >
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </Space>
          ) : (
            <Col span={md ? undefined : 24} flex="auto">
              <Row gutter={[0, 30]}>
                {AllIdeas?.ideas &&
                  AllIdeas.ideas.map((idea, key: number) => (
                    <Idea
                      key={key}
                      title={idea.title}
                      time={idea.u}
                      userName={idea.user_id.name}
                      avatar={idea.user_id.avatar.url}
                      count={idea.count}
                      description={idea.description}
                      iconReaction={icon}
                    />
                  ))}
              </Row>
              {Number(AllIdeas?.page_Index) <= 1 ? (
                ''
              ) : (
                <div
                  style={{
                    marginTop: 30,
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <InputNumber
                    style={{
                      marginRight: 10,
                    }}
                    min={1}
                    value={_limit}
                    onChange={(vl) => {
                      clearTimeout(timeOutLimit);
                      timeOutLimit = setTimeout(() => {
                        setLimit(vl);
                      }, 500);
                    }}
                  />
                  <Pagination
                    current={_page}
                    onChange={(pg) => {
                      setPage(pg);
                    }}
                    defaultPageSize={1}
                    total={AllIdeas?.page_Index}
                  />
                </div>
              )}
            </Col>
          )}
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
      detailUser,
    },
  };
};
