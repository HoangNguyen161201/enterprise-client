import { AlertOutlined, AuditOutlined, UserOutlined } from '@ant-design/icons';
import { Col, DatePicker, Grid, InputNumber, Row, Select, Space, Tag } from 'antd';
import {
  ArcElement, BarElement, CategoryScale, Chart as ChartJS,
  Legend, LinearScale, LineElement, PointElement, Title, Tooltip
} from 'chart.js';
import { DoughnutChart, LineChart } from 'components/elements/chart';
import { CardStatic, Clip, List } from 'components/elements/common';
import { ClientLayout } from 'components/layouts';
import { GlobalContext } from 'contextApi/globalContext';
import { IDetailUser } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getCurrentUser } from 'queries/auth';
import { getAllDepartments } from 'queries/department';
import {
  accept,
  anonymously,
  getAllCount,
  ideaByDate,
  ideaByYear,
  manyIdeas,
  numberOPC,
  statusIdeas,
  submissions,
  topView
} from 'queries/statics';
import { useContext as UseContext, useEffect as UseEffect, useState as UseState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);
const dashBoard: NextPageWithLayout = () => {
  const { useBreakpoint:  UseBreakpoint} = Grid;
  const { lg, md } = UseBreakpoint();

  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();
  const [_date, setDate] = UseState<string | null>(null);
  const [_limit, setLimit] = UseState<number>(5);
  const [limitManyIdea, setLimitManyIdea] = UseState<number>(5);
  const [limitTopView, setLimitTopview] = UseState<number>(5);
  const [_year, setYear] = UseState<number>(new Date().getFullYear());
  const [department_id, setDepartmentId] = UseState<string | null>(null);

  UseEffect(() => {
    dataUserRefetch();
  }, []);

  const {
    data: dataDepartment,
    error: errorDepartment,
    refetch: refetchDepartment,
  } = getAllDepartments(dataUser?.accessToken.token);

  UseEffect(() => {
    if (dataDepartment?.departments[0]) setDepartmentId(dataDepartment.departments[0]._id);
  }, [dataDepartment]);

  const {
    data: dataStatus,
    error: errorStatus,
    refetch: refetchStatus,
  } = statusIdeas({
    accessToken: dataUser?.accessToken.token,
    department_id,
  });

  const {
    data: allCount,
    error: errorAllCount,
    refetch: refetchAllCount,
  } = getAllCount(dataUser?.accessToken.token);

  const {
    data: dataManyIdeas,
    error: errorManyIdeas,
    refetch: refetchManyIdeas,
  } = manyIdeas({
    accessToken: dataUser?.accessToken.token,
    options: {
      department_id,
      _limit: limitManyIdea,
    },
  });

  const {
    data: dataTopview,
    error: errorTopview,
    refetch: refetchTopView,
  } = topView({
    accessToken: dataUser?.accessToken.token,
    options: {
      department_id,
      _limit: limitTopView,
    },
  });

  const {
    data: dataIdeaBY,
    error: errorDataIdeaBY,
    refetch: refetchDataIdeaBY,
  } = ideaByYear({
    accessToken: dataUser?.accessToken.token,
    options: {
      department_id,
      _year,
    },
  });

  const {
    data: dataNumberOPC,
    error: errorNumberOPC,
    refetch: refetchNumberOPC,
  } = numberOPC({
    accessToken: dataUser?.accessToken.token,
    department_id,
  });

  const {
    data: dataIdeaByDate,
    error,
    refetch: refetchDataIdeaByDate,
  } = ideaByDate({
    accessToken: dataUser?.accessToken.token,
    option: {
      _limit,
      _date,
    },
  });

  const {
    data: acceptStatic,
    error: errorAccept,
    refetch: refetchAccept,
  } = accept(dataUser?.accessToken.token);

  const {
    data: anonymouslyStatic,
    error: errorAnonymously,
    refetch: refetchAnonymously,
  } = anonymously(dataUser?.accessToken.token);

  const {
    data: topSubmission,
    error: errorTopSub,
    refetch: refetchTopSub,
  } = submissions({ accessToken: dataUser?.accessToken.token });

  const { color, desColor, bgColor, darkMode } = UseContext(GlobalContext);

  return (
    <>
    <Head>
      <title>Dashboard</title>
    </Head>
      <p
        className={`font-3 ${color}`}
        style={{
          fontWeight: 'bold',
        }}
      >
        Dashboard
      </p>
      <Row gutter={[40, 30]} wrap={lg ? false : true}>
        <Col
          span={lg ? undefined : 24}
          style={{
            width: 280,
            minWidth: 280,
          }}
        >
          <Row gutter={[30, 15]}>
            {acceptStatic?.data && (
              <DoughnutChart
                title="Accept"
                labels={['Accepted', 'Not yet accepted']}
                data={acceptStatic.data}
                backgrounds={['#07456F', '#07456F50']}
                size={10}
              />
            )}

            {anonymouslyStatic?.data && (
              <DoughnutChart
                title="Anonymously"
                labels={['Public', 'Private']}
                data={anonymouslyStatic.data}
                backgrounds={['#009F9D', '#009F9D50']}
                size={10}
              />
            )}
            <Col span={24}>
              <Space direction="vertical">
                <span className={`${desColor}`}>Top submissions (idea)</span>
                <List
                  center={lg ? false : true}
                  data={topSubmission?.data as any}
                  url="/submissions/detail/"
                />
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={24} lg={20} flex={'auto'}>
          <Row gutter={[0, 30]}>
            <Col span={24}>
              <Row
                className={darkMode ? 'shadow-l' : 'shadow-d'}
                style={{
                  background: md ? '#07456F' : 'white',
                  borderRadius: 10,
                  paddingBlock: 40,
                  paddingInline: 20,
                  border: '3px solid #07456F50',
                  width: '100%',
                  position: 'relative',
                  display: 'flex',
                }}
              >
                {md && (
                  <>
                    <Clip color={bgColor} left={40} top={-15} />
                    <Clip color={bgColor} right={40} top={-15} />
                  </>
                )}

                {allCount && (
                  <>
                    <CardStatic
                      icon={
                        <AuditOutlined
                          style={{ color: md ? '#FFFFFF' : '#07456F', fontSize: 20 }}
                        />
                      }
                      count={allCount.count_department}
                      title="Departments"
                      description="total number of departments in the system"
                    />
                    <CardStatic
                      icon={
                        <UserOutlined style={{ color: md ? '#FFFFFF' : '#07456F', fontSize: 20 }} />
                      }
                      count={allCount.count_user}
                      title="Users"
                      description="total number of users in the system"
                    />
                    <CardStatic
                      borderR={false}
                      icon={
                        <AlertOutlined
                          style={{ color: md ? '#FFFFFF' : '#07456F', fontSize: 20 }}
                        />
                      }
                      count={allCount.count_idea}
                      title="Ideas"
                      description="total number of ideas that users have posted"
                    />
                  </>
                )}
              </Row>
            </Col>

            <Col span={24}>
              <Space direction="vertical" size={'middle'}>
                <div
                  style={{
                    display: md ? 'flex' : 'block',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span className={`font-2 ${color}`} style={{ fontWeight: 'bold' }}>
                    Number idea by department, date
                  </span>
                  <Space
                    style={{
                      marginTop: md ? 0 : 10,
                    }}
                    size={15}
                  >
                    <InputNumber
                      style={{
                        borderRadius: 5,
                      }}
                      min={1}
                      value={_limit}
                      max={10}
                      onChange={(value) => {
                        setLimit(value);
                      }}
                    />
                    <DatePicker
                      style={{
                        borderRadius: 5,
                      }}
                      showTime
                      showNow
                      onChange={(value) => {
                        const time = moment(value).toISOString();
                        setDate(time);
                      }}
                    />
                  </Space>
                </div>
                <div
                  className={darkMode ? 'shadow-l' : 'shadow-d'}
                  style={{
                    border: '3px solid #07456F50',
                    height: md ? 300 : 200,
                    borderRadius: 10,
                    padding: 20,
                    background: '#FFFFFF',
                  }}
                >
                  
                  <Bar
                    options={{
                      maintainAspectRatio: false,
                      aspectRatio: 3,
                      scales: {
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                        y: {
                          grid: {
                            display: false,
                          },
                        },
                      },
                    }}
                    data={{
                      labels: dataIdeaByDate?.data.names,
                      datasets: [
                        {
                          label: 'Ideas of department by date',
                          data: dataIdeaByDate?.data.count,
                          backgroundColor: '#009F9D',
                          maxBarThickness: 80,
                          borderRadius: 10,
                        },
                      ],
                    }}
                  />
                </div>
              </Space>
            </Col>

            <Col span={24}>
              <Space direction="vertical" size={20}>
                <div
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    display: md ? 'flex' : 'block',
                  }}
                >
                  <span
                    className={`font-2 ${color}`}
                    style={{ fontWeight: 'bold', display: 'block' }}
                  >
                    Infor by department
                  </span>
                  <Space
                    style={{
                      marginTop: md ? 0 : 10,
                    }}
                    size={15}
                  >
                    {department_id && (
                      <Select
                        value={department_id}
                        onChange={(value) => {
                          setDepartmentId(value);
                        }}
                        style={{
                          minWidth: 200,
                        }}
                      >
                        {dataDepartment?.departments &&
                          dataDepartment?.departments.map((department) => (
                            <Select.Option key={department._id} value={department._id}>
                              {' '}
                              {department.name}
                            </Select.Option>
                          ))}
                      </Select>
                    )}
                  </Space>
                </div>
                <Space direction={!lg ? 'vertical' : 'horizontal'} size={15}>
                  {dataNumberOPC && <span className="color-3">{dataNumberOPC.msg}</span>}
                  {dataStatus && (
                    <Space>
                      <Tag color={'blue'}>{`All ideas: ${dataStatus.all}`}</Tag>
                      <Tag color={'green'}> {`Accepted: ${dataStatus.accept}`}</Tag>
                      <Tag color={'red'}>{`Not yet accepted: ${dataStatus.not_accept}`}</Tag>
                    </Space>
                  )}
                </Space>

                <Row wrap={lg ? false : true} gutter={[30, 30]}>
                  <Col
                    span={24}
                    lg={8}
                    style={{
                      minWidth: 300,
                    }}
                  >
                    <Space direction="vertical" size={'middle'}>
                      <Space direction="vertical" size={'middle'}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span className={`${desColor}`}>Top user has many ideas</span>
                          <InputNumber
                            style={{
                              borderRadius: 5,
                            }}
                            min={1}
                            value={limitManyIdea}
                            max={10}
                            onChange={(value) => {
                              setLimitManyIdea(value);
                            }}
                          />
                        </div>
                        <List data={dataManyIdeas?.data as any} url="/employees/detail/" />
                      </Space>

                      <Space direction="vertical" size={'middle'}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span className={`${desColor}`}>Top user has top view ideas</span>
                          <InputNumber
                            style={{
                              borderRadius: 5,
                            }}
                            min={1}
                            value={limitTopView}
                            max={10}
                            onChange={(value) => {
                              setLimitTopview(value);
                            }}
                          />
                        </div>
                        <List data={dataTopview?.data as any} url="/employees/detail/" />
                      </Space>
                    </Space>
                  </Col>
                  <Col flex={'auto'} span={24} lg={16}>
                    <Space size={'middle'} direction="vertical">
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span className={`${desColor}`}>Count idea by year</span>
                        <DatePicker
                          value={moment(new Date(`${_year}-1-1`))}
                          onChange={(value) => {
                            setYear(moment(value).year());
                          }}
                          picker="year"
                        />
                      </div>

                      <div
                        className={darkMode ? 'shadow-l' : 'shadow-d'}
                        style={{
                          boxShadow: '25px 23px 42px -3px rgba(0,0,0,0.1)',
                          border: '3px solid #07456F50',
                          height: md ? 300 : 200,
                          borderRadius: 10,
                          padding: '20px ',
                          background: '#FFFFFF',
                        }}
                      >
                        <LineChart
                          data={dataIdeaBY?.data as number[]}
                          labels={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                        />
                      </div>
                    </Space>
                  </Col>
                </Row>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

dashBoard.getLayout = ClientLayout;

export default dashBoard;


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
  if (detailUser.user.role !== 'qa_manager') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      
    },
  };
};
