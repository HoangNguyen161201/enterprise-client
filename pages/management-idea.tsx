import {
  DeleteOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Card,
  DatePicker,
  Image,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import axios, { AxiosError } from 'axios';
import { ClientLayout } from 'components/layouts';
import { IAllIdeas, ICommon, IDetailUser, IIdea, ISubmission } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import moment from 'moment';
import { IdeaMutaion } from 'mutations/idea';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getCurrentUser } from 'queries/auth';
import { getAllIdeas } from 'queries/idea';
import { getallSubmissions } from 'queries/submission';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import column from 'utils/configTB';

const managementIdea: NextPageWithLayout = ({
  detailUser,
  data,
}: {
  detailUser: IDetailUser;
  data: IAllIdeas;
}) => {
  const { push } = useRouter();
  const [_nameById, setNameById] = useState<string | null>(null);
  const [_valueById, setValueById] = useState<string | null>(null);
  const [isLoadingDl, setIsLoadingDl] = useState<{
    key: string;
    isLoading: boolean;
    cloudinary_id: null | string;
  }>({
    key: '',
    isLoading: false,
    cloudinary_id: null,
  });
  const [dataExcel, setDataExcel] = useState<any>(null);
  const [dataSource, setDataSource] = useState<
    | {
        key: string;
        email_avatar: {
          email: string;
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

  const getExcel = async (ideas: IIdea[]) => {
    let data: any = [];
    await Promise.all(
      ideas.map(async (item) => {
        return new Promise(async (resolve) => {
          let file = null;
          if (item.cloudinary_id) {
            const result = await axios.post('/api/image/download', {
              tag: item.cloudinary_id,
            });

            file = result.data.url;
          }
          const result = {
            id_idea: item._id,
            user_name: item.user_id.name,
            email: item.user_id.email,
            title: item.title,
            description: item.description,
            time: item.time,
            view: item.view,
            submission: item.submission_id,
            category: item.category_id,
            accept: item.accept,
            file,
          };
          data.push(result);
          resolve(result);
        });
      })
    );
    setDataExcel(data)
    
  };

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
      _nameById,
      _valueById,
    },
    dataUser?.accessToken.token,
    data
  );

  const {
    data: AllSubm,
    error: errorSubm,
    refetch: refreshSubm,
    isLoading: isLoadingSbm,
  } = getallSubmissions(dataUser?.accessToken.token);

  useEffect(() => {
    if (AllIdeas && AllIdeas?.ideas.length !== 0) {
      getExcel(AllIdeas?.ideas)
      const result = AllIdeas?.ideas.map((idea) => {
        return {
          key: idea._id,
          email_avatar: {
            email: idea.user_id.email,
            avatar: idea.user_id.avatar.url,
          },
          title: idea.title,
          view: idea.view,
          time: moment(idea.createdAt).format('YYYY-MM-DD'),
          submission: idea.submission_id,
          accept: idea.accept,
          detail: '',
          remove: '',
          cloudinary_id: idea.cloudinary_id,
        };
      });
      return setDataSource(result);
    } else {
      console.log('dfsfd')
      setDataExcel(null)
    }
    return setDataSource([]);
  }, [AllIdeas]);

  const handleDelete = IdeaMutaion.delete({
    dataUserRefetch: dataUserRefetch,
    token: dataUser?.accessToken?.token,
    options: {
      onSuccess: (data: ICommon) => {
        message.success(data.msg);
        setIsLoadingDl({ key: '', isLoading: false, cloudinary_id: null });
        refetchIdeas();
      },
      onError: (error: AxiosError) => {
        message.error(error.response?.data.err || 'Delete Idea false.');
        refetchIdeas();
      },
    },
  });

  const setAccept = IdeaMutaion.setAccept({
    dataUserRefetch: dataUserRefetch,
    token: dataUser?.accessToken.token,
    options: {
      onSuccess: (data: ICommon) => {
        message.success(data.msg);
        refetchIdeas();
      },
      onError: (error: AxiosError) => {
        message.error(error.response?.data.err);
        refetchIdeas();
      },
    },
  });

  const columns = useMemo<ColumnsType<any>>(
    () => [
      {
        ...column({
          title: 'email',
          dataIndex: 'email_avatar',
          key: 'email_avatar',
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
            <span>{value.email}</span>
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
        onFilter: (value, record) => record.email_avatar.email.includes(value),
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
        render: (value, record) => {
          if (value) return <Tag color="green">Accepted</Tag>;
          return (
            <Button
            size='small'
              onClick={() => {
                setAccept.mutate({ id_idea: record.key });
              }}
            >
              Accept
            </Button>
          );
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

      {
        ...column({ title: 'remove' }),
        render: (_, record) => {
          if (!record.root)
            return (
              <Popconfirm
                icon={
                  <QuestionCircleOutlined
                    style={{
                      color: '#07456F',
                    }}
                  />
                }
                title="Are you sure?"
                okButtonProps={{
                  onClick: async () => {
                    setDataExcel(null);
                    setIsLoadingDl((state) => ({
                      ...state,
                      isLoading: true,
                    }));
                    if (record.cloudinary_id) {
                      await axios.post('/api/image/delete', {
                        tag: record.cloudinary_id,
                      });
                    }
                    handleDelete.mutate({ idea_id: record.key });
                  },
                  loading: isLoadingDl.isLoading,
                }}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined
                  onClick={() =>
                    setIsLoadingDl({
                      key: record.key,
                      isLoading: false,
                      cloudinary_id: record.cloudinary_id,
                    })
                  }
                  style={{ color: 'red' }}
                />
              </Popconfirm>
            );
          return '';
        },
      },
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

      <Card
        extra={[
          <Select
            defaultValue=""
            key={'submission'}
            onChange={(value) => {
              if (!value) {
                setNameById(null);
                setValueById(null);
              } else {
                setNameById('submission_id');
                setValueById(value);
              }
             
            }}
            style={{
              width: 200,
            }}
          >
            <Select.Option value={''}>Select All</Select.Option>
            {AllSubm &&
              AllSubm.submissions.map((sub) => (
                <Select.Option key={sub._id} value={sub._id}>
                  {sub.name}
                </Select.Option>
              ))}
          </Select>,
          <Button key="excel" type="link" disabled={!dataExcel}>
            <CSVLink data={dataExcel || []}>Export excel</CSVLink>
          </Button>,
        ]}
        title="Submissions"
        style={{ width: '100%', marginTop: '20px' }}
      >
        <Table
          style={{
            overflow: 'auto',
          }}
          columns={columns}
          dataSource={dataSource}
        />
      </Card>
    </>
  );
};

managementIdea.getLayout = ClientLayout;

export default managementIdea;

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
  const data: IAllIdeas = await fetch(`http://localhost:3000/api/ideas?_sort=-1&_sortBy=view`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
      authorization: detailUser.accessToken.token,
    } as HeadersInit,
  }).then((e) => e.json());

  return {
    props: {
      data,
      detailUser,
    },
  };
};
