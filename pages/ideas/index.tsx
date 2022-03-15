import {
  Card,
  Col,
  Collapse,
  Empty,
  Grid,
  Input,
  InputNumber,
  Pagination,
  Row,
  Space,
  Spin,
} from 'antd';
import { BreadCrumb, CtSlideItem, Reaction } from 'components/elements/common';
import Idea from 'components/elements/common/Idea';
import { ClientLayout } from 'components/layouts';
import { GlobalContext } from 'contextApi/globalContext';
import { motion } from 'framer-motion';
import { IDetailUser } from 'models/apiType';
import { IFilter } from 'models/elementType';
import { NextPageWithLayout } from 'models/layoutType';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getallCategories, getAllSubId, getCurrentUser } from 'queries';
import { getAllIdeas } from 'queries/idea';
import { getReactType } from 'queries/reaction';
import { useContext as UseContext, useEffect as UseEffect, useState as UseState } from 'react';

var timeOutLimit: NodeJS.Timeout;

const index: NextPageWithLayout = ({ detailUser }) => {
  const { useBreakpoint: UseBreakpoint } = Grid;
  const { md } = UseBreakpoint();
  const [_page, setPage] = UseState(1);
  const [_limit, setLimit] = UseState(6);
  const [_nameById, setNameById] = UseState<string | null>(null);
  const [_valueById, setValueById] = UseState<string | null>(null);
  const [_reaction, setReaction] = UseState<string | null>(null);
  const [_interactive, setInteractive] = UseState<number | null>(null);
  const [searchFirst, setSearchFirst] = UseState('');
  const [_search, setSearch] = UseState('');
  const [icon, setIcon] = UseState('👁');

  const {handleLoadPage} = UseContext(GlobalContext)

  UseEffect(()=> {
    handleLoadPage(false)
  }, [])

  const {
    data: dataUser,
    error: errorGetUser,
    refetch: dataUserRefetch,
  } = getCurrentUser(detailUser);

  const { data: DataCt, error: errorCt, refetch: refetchCt } = getallCategories(detailUser);

  const {data: DataSubId, error: errorSubId, refetch} = getAllSubId()

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
      _nameById,
      _valueById,
      _interactive,
      _reaction,
      _search,
      _accept: 1,
    },
    dataUser?.accessToken.token
  );

  const handleCReaction = ({
    isView = false,
    icon,
    _nameById,
    _valueById,
    _interactive,
    _reaction,
  }: Partial<IFilter>) => {
    setSearch('');
    setSearchFirst('');
    if (isView) {
      setInteractive(null);
    }
    if (_reaction) {
      setReaction(_reaction);
    } else {
      setReaction(null);
    }
    if (_nameById && _valueById) {
      setNameById(_nameById);
      setValueById(_valueById);
    } else {
      setNameById(null);
      setValueById(null);
    }

    if (_interactive) {
      setInteractive(_interactive);
    } else {
      setInteractive(null);
    }

    if (icon) setIcon(icon);
    setPage(1);
    setLimit(6);
  };

  const { data: allReaction, error: errorReaction, refetch: refetchReaction } = getReactType();
  return (
    <>
      <Head>
        <title>All Ideas</title>
      </Head>

      <BreadCrumb data={[{
          url: '/',
          label: 'Home'
        }]} main={{
          url: '/ideas',
          label: '/All ideas'
        }} />

      <Card title="View All Ideas" className='card-b shadow-l' style={{
        background: 'white',
      }}>
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
                  <Space direction="vertical" size={'small'}>
                    <Input.Search
                      value={searchFirst}
                      onChange={(event) => {
                        setSearchFirst(event.target.value);
                      }}
                      onSearch={(value) => {
                        handleCReaction({
                         isView: true,
                         icon: '👁',
                         id: null,
                       });
                        setSearch(value);
                       
                      }}
                      allowClear
                      placeholder="Enter title"
                      style={{
                        borderRadius: 5,
                      }}
                    />
                    <motion.div
                      whileTap={{
                        backgroundColor: '#009F9D',
                        scale: 0.9,
                      }}
                      whileHover={{
                        backgroundColor: '#009F9D80',
                        scale: 1.1,
                      }}
                      onClick={() => {
                        handleCReaction({
                          isView: true,
                          icon: '👁',
                          id: null,
                        });
                      }}
                      style={{
                        fontWeight: 500,
                        height: 35,
                        color: '#07456f',
                        lineHeight: '35px',
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
                    </motion.div>
                  </Space>
                </Collapse.Panel>
                {allReaction?.reactionTypes && (
                  <Collapse.Panel header="Reaction" key="2">
                    <Space direction="vertical" size={'small'}>
                      <Reaction
                        handleCReaction={handleCReaction}
                        name={'High interaction'}
                        icon={'👍'}
                      />
                      {allReaction &&
                        allReaction.reactionTypes.map((reaction) => (
                          <Reaction
                            key={reaction._id}
                            id={reaction._id}
                            handleCReaction={handleCReaction}
                            name={reaction.name}
                            icon={reaction.icon}
                          />
                        ))}
                    </Space>
                  </Collapse.Panel>
                )}

                <Collapse.Panel header="Category" key="3">
                  <Space direction="vertical" size={'small'}>
                    {DataCt?.categories &&
                      DataCt.categories.map((ct) => (
                        <CtSlideItem nameById='category_id' handleCReaction={handleCReaction} ct={ct} key={ct._id} />
                      ))}
                  </Space>
                </Collapse.Panel>
                <Collapse.Panel header="Submission" key="4">
                  <Space direction="vertical" size={'small'}>
                    {DataSubId?.submissions &&
                      DataSubId.submissions.map((subm) => (
                        <CtSlideItem nameById='submission_id' handleCReaction={handleCReaction} ct={subm} key={subm._id} />
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
            <Col
              style={{
                minHeight: 500,
                display: 'flex',
                 flexDirection: 'column',
                 justifyContent: 'space-between'
              }}
              span={md ? undefined : 24}
              flex="auto"
            >
              <Row gutter={[0, 30]}>
                {AllIdeas?.ideas &&
                  AllIdeas.ideas.map((idea) => (
                    <Idea
                      id={idea._id}
                      key={idea._id}
                      title={idea.title}
                      time={moment(new Date(idea.createdAt)).fromNow()}
                      userName={idea.user_id.name}
                      avatar={idea.user_id.avatar.url}
                      count={idea.count}
                      description={idea.description}
                      iconReaction={icon}
                      anonymously={idea.anonymously}
                    />
                  ))}
              </Row>

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

  //Check role
  if (detailUser.user.role === 'admin') {
    return {
      redirect: {
        destination: '/403',
        permanent: false,
      },
    };
  }

  return {
    props: {
      detailUser,
    },
  };
};
