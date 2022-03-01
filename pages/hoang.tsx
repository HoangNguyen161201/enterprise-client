import { ProfileOutlined, SearchOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Input, Table, Space, Image, Button, Tag, DatePicker } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ClientLayout } from 'components/layouts';
import { IAllIdeas, IDetailUser, ISubmission, IUser } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getCurrentUser } from 'queries/auth';
import { getAllIdeas } from 'queries/idea';
import { useEffect, useMemo, useState } from 'react';
import column from 'utils/configTB';

const hoang: NextPageWithLayout = ({
  detailUser,
  data,
}: {
  detailUser: IDetailUser;
  data: IAllIdeas;
}) => {
  const {push}= useRouter()
  const [dataSource, setDataSource] = useState<
    | {
        key: string;
        name_avatar: {
          name: string;
          avatar: string;
        };
        title: string;
        view: number;
        time: string;
        submission: ISubmission;
        accept: boolean;
        [index: string]: any;
      }[]
    | undefined
  >([]);
  //Get access token
  const {
    data: dataUser,
    error: errorGetUser,
    refetch: dataUserRefetch,
  } = getCurrentUser(detailUser);

  const {
    data: AllIdeas,
    error: errorIdeas,
    refetch: refetchIdeas,
    isLoading: isLoadingIdeas,
  } = getAllIdeas(
    {
      _sort: -1,
      _sortBy: 'view',
      
    },
    dataUser?.accessToken.token,
    data
  );

  useEffect(() => {
    if (AllIdeas?.ideas.length !== 0) {
      const result = AllIdeas?.ideas.map((idea) => {
        return {
          key: idea._id,
          name_avatar: {
            name: idea.user_id.name,
            avatar: idea.user_id.avatar.url,
          },
          title: idea.title,
          view: idea.view,
          time: moment(idea.createdAt).format('YYYY-MM-DD'),
          submission: idea.submission_id,
          accept: idea.accept,
          detail: '',
        };
      });
      setDataSource(result);
    }
  }, [AllIdeas]);

  const columns = useMemo<ColumnsType<any>>(
    () => [
      {
        ...column({
          title: 'Name',
          dataIndex: 'name_avatar',
          key: 'name_avatar',
        }),
        render: (value, record) => (
          <Space size={20}>
            <Image
              width={40}
              alt={record.key}
              height={40}
              style={{ objectFit: 'cover' }}
              src={value.avatar}
            />
            <span>{value.name}</span>
          </Space>
        ),
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <Input
            placeholder="Search"
            value={selectedKeys[0]}
            onPressEnter={() => confirm()}
            onChange={(e) => {
              return setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
          />
        ),
        onFilter: (value, record) => record.name_avatar.name.includes(value),
        filterIcon: <SearchOutlined />,
      },

      {
        ...column({ title: 'title' }),
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <Input
            placeholder="Search"
            value={selectedKeys[0]}
            onPressEnter={() => confirm()}
            onChange={(e) => {
              return setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
          />
        ),
        onFilter: (value, record) => record.name.includes(value),
        filterIcon: <SearchOutlined />,
      },

      {
        ...column({ title: 'view' }),
      },

      {
        ...column({ title: 'time' }),
        render: (value) => {
          return <span style={{ whiteSpace: 'nowrap' }}>{value}</span>;
        },
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <DatePicker
            onChange={(time) => {
              setSelectedKeys(time ? [moment(time).format('YYYY-MM-DD')] : []);
              confirm();
            }}
          />
        ),
        onFilter: (value, record) => {
          console.log(new Date('2022-2-2'));
          return new Date(value as string) <= new Date(record.time);
        },
        filterIcon: <SearchOutlined />,
      },
      {
        ...column({ title: 'accept' }),
        filters: [
          {
            text: 'Accepted',
            value: true,
          },
          {
            text: 'Not Accepted',
            value: false,
          },
        ],
        onFilter: (value, record) => {
          return value == record.accept;
        },
        render: (value) => {
          return <Tag color={value ? 'green' : 'red'}>{value ? 'Accepted' : 'Accept'}</Tag>;
        },
      },
      {
        ...column({ title: 'detail' }),
        render: (_, record) => (
          <ProfileOutlined
            onClick={() => push(`/ideas/detail/${record.key}`, undefined, { shallow: true })}
            style={{ color: '#07456F' }}
          />
        ),
      },

      // {
      //   ...column({ title: 'remove' }),
      //   render: (_, record) => {
      //     if (!record.root)
      //       return (
      //         <Popconfirm
      //           icon={
      //             <QuestionCircleOutlined
      //               style={{
      //                 color: '#07456F',
      //               }}
      //             />
      //           }
      //           title="Are you sure?"
      //           okButtonProps={{
      //             onClick: async () => {
      //               setIsLoadingDl((state) => ({
      //                 ...state,
      //                 isLoading: true,
      //               }));
      //               handleDl.mutate(record.key);
      //             },
      //             loading: isLoadingDl.isLoading,
      //           }}
      //           okText="Yes"
      //           cancelText="No"
      //         >
      //           <DeleteOutlined
      //             onClick={() => setIsLoadingDl({ key: record.key, isLoading: false })}
      //             style={{ color: 'red' }}
      //           />
      //         </Popconfirm>
      //       );
      //     return '';
      //   },
      // },
    ],
    []
  );

  return (
    <>
      <Head>
        <title>Submissions Page</title>
      </Head>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Submissions</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="Submissions" style={{ width: '100%', marginTop: '20px' }}>
        <Table columns={columns} dataSource={dataSource} />
      </Card>
    </>
  );
};

hoang.getLayout = ClientLayout;

export default hoang;

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

  //Get all data users
  const data: IAllIdeas = await fetch(
    `http://localhost:3000/api/ideas?_sort=-1&_sortBy=view`,
    {
      method: 'GET',
      headers: {
        cookie: context.req.headers.cookie,
        authorization: detailUser.accessToken.token,
      } as HeadersInit,
    }
  ).then((e) => e.json());

  console.log(data)
  return {
    props: {
      data,
      detailUser,
    },
  };
};
