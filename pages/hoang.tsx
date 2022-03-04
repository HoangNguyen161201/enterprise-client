import { AlertOutlined, AuditOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Grid, DatePicker, InputNumber, Row, Space, Select, Avatar, Tag } from 'antd';
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { DoughnutChart } from 'components/elements/chart';
import { CardStatic, Clip, List } from 'components/elements/common';
import { ClientLayout } from 'components/layouts';
import { NextPageWithLayout } from 'models/layoutType';
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
  topView,
} from 'queries/statics';
import { useEffect, useState } from 'react';
import moment from 'moment';
import Link from 'next/link';

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
const hoang: NextPageWithLayout = () => {
  const { useBreakpoint } = Grid;
  const { lg, md } = useBreakpoint();

  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();
  const [_date, setDate] = useState<string | null>(null);
  const [_limit, setLimit] = useState<number>(5);
  const [limitManyIdea, setLimitManyIdea] = useState<number>(5);
  const [limitTopView, setLimitTopview] = useState<number>(5);
  const [_year, setYear] = useState<number>(new Date().getFullYear());
  const [department_id, setDepartmentId] = useState<string | null>(null);

  useEffect(() => {
    dataUserRefetch();
  }, []);

  const {
    data: dataDepartment,
    error: errorDepartment,
    refetch: refetchDepartment,
  } = getAllDepartments(dataUser?.accessToken.token);

  useEffect(() => {
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
  } = submissions({accessToken: dataUser?.accessToken.token});

  

  return (
    <>
      <p
        className="font-3"
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
              <Space direction='vertical'>
                <span style={{color: 'gray'}}>Top submissions (idea)</span>
                <List center={lg ? false: true} data={topSubmission?.data as any} url='/submissions/detail/'/>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={24} lg={20} flex={'auto'}>
          <Row gutter={[0, 30]}>
            <Col span={24}>
              <Row
                style={{
                  background: md ? '#07456F' : 'transparent',
                  borderRadius: 10,
                  paddingBlock: md ? 40 : 0,
                  paddingInline: md ? 20 : 0,
                  width: '100%',
                  position: 'relative',
                  display: 'flex',
                  boxShadow: md ? '27px 28px 52px -3px rgba(0,0,0,0.1)' : '',
                }}
              >
                {md && (
                  <>
                    <Clip color="white" left={40} top={-15} />
                    <Clip color="white" right={40} top={-15} />
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
              <Space direction="vertical" size={'small'}>
                <div
                  style={{
                    display: md ? 'flex' : 'block',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span className="font-2" style={{ fontWeight: 'bold' }}>
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
                        console.log(time);
                        setDate(time);
                      }}
                    />
                  </Space>
                </div>
                <div  style={{ height: md ?300: 200 }}>
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
                  <span className="font-2" style={{ fontWeight: 'bold', display: 'block' }}>
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
                  {dataNumberOPC && <span className="color-2">{dataNumberOPC.msg}</span>}
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
                      <Space direction="vertical">
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span style={{ color: 'gray' }}>Top user has many ideas</span>
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
                        <List data={dataManyIdeas?.data as any} url='/employees/detail/'/>
                      </Space>

                      <Space direction="vertical">
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span style={{ color: 'gray' }}>Top user has many ideas</span>
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
                        <List data={dataTopview?.data as any} url='/employees/detail/'/>
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
                        <span style={{ color: 'gray' }}>Count idea by year</span>
                        <DatePicker
                          value={moment(new Date(`${_year}-1-1`))}
                          onChange={(value) => {
                            setYear(moment(value).year());
                          }}
                          picker="year"
                        />
                      </div>

                      <div style={{ height: md ?300: 200 }}>
                        <Line
                          options={{
                            maintainAspectRatio: false,
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
                            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                            datasets: [
                              {
                                label: 'Idea',
                                data: dataIdeaBY?.data || [],
                                backgroundColor: '#07456F',
                                borderColor: '#07456F50',
                                cubicInterpolationMode: 'monotone',
                              },
                            ],
                          }}
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

hoang.getLayout = ClientLayout;

export default hoang;
