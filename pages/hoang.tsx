import { SearchOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Input, Table, Space, Image, Button, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ClientLayout } from 'components/layouts';
import { IAllIdeas, IDetailUser, ISubmission, IUser } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
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
  const [dataSource, setDataSource] = useState<{
    key: string,
    name_avatar: {
      name: string
      avatar: string
    },
    title: string
    description:string
    time: string
    submission: ISubmission
    accept: boolean
  }[] | undefined>([]);
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
    if(AllIdeas?.ideas.length !== 0) {
      const result = AllIdeas?.ideas.map(idea=> {
        return {
          key: idea._id,
          name_avatar: {
            name: idea.user_id.name,
            avatar: idea.user_id.avatar.url
          },
          title: idea.title,
          description: idea.description,
          time: idea.createdAt,
          submission: idea.submission_id,
          accept: idea.accept
        }
      })
      setDataSource(result)
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
        ...column({ title: 'description' }),
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
        ...column({ title: 'time' }),
        render: (value)=> {
          const time = moment(value)
          return `${time.year()}-${time.month()}-${time.date()}`
        }
      },
      {   
        ...column({ title: 'accept' }),
        render: (value)=> {
          if(value) 
            return <Tag color={'green'}>Accepted</Tag>
          return <Button >Accept</Button>
        }
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
        <Table columns={columns} dataSource={dataSource}/>
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
    `http://localhost:3000/api/ideas?_sort=-1&_sortBy=view&_page=1&_limit=1`,
    {
      method: 'GET',
      headers: {
        cookie: context.req.headers.cookie,
        authorization: detailUser.accessToken.token,
      } as HeadersInit,
    }
  ).then((e) => e.json());

  return {
    props: {
      data,
      detailUser,
    },
  };
};
