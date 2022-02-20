import { EditOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Drawer,
  Image,
  message,
  Pagination,
  Row,
  Space,
} from 'antd';
import axios, { AxiosError } from 'axios';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect, useEffect as UseEffect, useState as UseState } from 'react';
import { useForm as UseForm } from 'react-hook-form';
import { useMutation as UseMutation } from 'react-query';
import { DateInput, Input, TextArea } from '../../components/elements';
import Skeletons from '../../components/elements/Skeletons';
import { ClientLayout } from '../../components/layouts';
import { ICommon, ISubmission, ISubmissions, ISumission, NextPageWithLayout } from '../../models';
import { getallSubmissions, getCurrentUser } from '../../queries';
import { postData, validateSubmission } from '../../utils';

interface submisionPage {
  result: ISubmissions;
}
const index: NextPageWithLayout = ({ result }: submisionPage) => {
  const [isOpen, setIsopen] = UseState(false);
  const [isOpenSlImg, setIsOpenSlImg] = UseState(false);
  const [imgs, setImgs] = UseState<string[] | null>(null);
  const [page, setPage] = UseState<number>(1);
  const [imgSubmission, setImgSubmission] = UseState(
    'https://res.cloudinary.com/hoang161201/image/upload/v1645274633/Group_92_grzovc.svg'
  );

  useEffect(()=> {
    console.log(page)
    RefetchSubmisssion()
  }, [page])
  UseEffect(() => {
    if (!imgs && isOpenSlImg) {
      axios.get('/api/image/submissions').then((result) => {
        setImgs(result.data.imgs);
      });
    }
  }, [isOpenSlImg]);

  

  // setting form
  const formSetting = UseForm<ISumission>({
    resolver: yupResolver(validateSubmission),
    defaultValues: {
      name: '',
      description: '',
      closure_date: moment(),
      final_closure_date: moment(),
    },
  });

  const onSubmit = (value: ISumission) => {
    addSubmission.mutate({
      ...value,
      background: imgSubmission,
    });
  };

  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();

  // get all submission
  const {
    error: errorSubmission,
    data: dataSubmissions,
    refetch: RefetchSubmisssion,
  } = getallSubmissions(dataUser?.accessToken.token, result, {
    _page: page,
  });

  console.log(dataSubmissions)

  const addSubmission = UseMutation<any, AxiosError, ISumission>(
    (value) => {
      return postData({
        url: '/api/submissions',
        body: value,
        token: dataUser?.accessToken.token,
      });
    },
    {
      onSuccess: (data: ICommon) => {
        message.success(data.msg);
        setIsopen(false);
        formSetting.reset({
          name: '',
          description: '',
          closure_date: moment(),
          final_closure_date: moment(),
        });
        setImgSubmission(
          'https://res.cloudinary.com/hoang161201/image/upload/v1645274633/Group_92_grzovc.svg'
        );
      },
      onError: (result) => {
        message.error(result.response?.data.err);
        setIsopen(false);
      },
    }
  );

  return (
    <>
      <Head>
        <title>Add Submission Page</title>
      </Head>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Submission</Breadcrumb.Item>
        <Breadcrumb.Item>Add Submission</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="Add Submission"
        extra={[
          <Button key={'add_sumission'} onClick={() => setIsopen(true)} type="link">
            Add new
          </Button>,
        ]}
        style={{ width: '100%', marginTop: '20px' }}
      >
        <Drawer
          title="Add new Submission"
          closable
          onClose={() => setIsopen(false)}
          visible={isOpen}
        >
          <Space size={20} direction="vertical">
            <Image
              alt={'img_submission'}
              onClick={() => setIsOpenSlImg(true)}
              preview={false}
              src={imgSubmission}
              style={{
                cursor: 'pointer',
              }}
            />
            <form onSubmit={formSetting.handleSubmit(onSubmit)}>
              <Space direction="vertical" size={20}>
                <Input
                  icon={<EditOutlined style={{ marginRight: 10, color: 'gray' }} />}
                  label="Name"
                  name="name"
                  formSetting={formSetting}
                  placeholder="Enter submission name"
                />
                <DateInput label="Closure date" name="closure_date" formSetting={formSetting} />
                <DateInput
                  label="Final closure date"
                  name="final_closure_date"
                  formSetting={formSetting}
                />
                <TextArea label="Description" name="description" formSetting={formSetting} />
                <Button loading={addSubmission.isLoading} htmlType="submit" type="primary">
                  Save
                </Button>
              </Space>
            </form>
          </Space>
        </Drawer>

        <Drawer title="Images" closable onClose={() => setIsOpenSlImg(false)} visible={isOpenSlImg}>
          <Space direction="vertical">
            {imgs ? (
              imgs.map((item, key) => (
                <Image
                  alt={`img_${key}`}
                  style={{
                    cursor: 'pointer',
                  }}
                  preview={false}
                  onClick={() => {
                    setImgSubmission(item);
                    setIsOpenSlImg(false);
                  }}
                  loading="lazy"
                  src={item}
                  key={key}
                />
              ))
            ) : (
              <Skeletons />
            )}
          </Space>
        </Drawer>
        <Space direction="vertical" size={'large'}>
          <Row gutter={[30, 30]}>
            {dataSubmissions?.submissions &&
              dataSubmissions?.submissions.map((item: ISubmission, key: number) => (
                <Col xl={8} lg={12} md={24} key={key}>
                  <Space direction="vertical" size={15}>
                    <Image
                      alt={`submission_${item._id}`}
                      width={'100%'}
                      style={{
                        background: 'white',
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                      preview={false}
                      src={item.background}
                    />
                    <div>
                      <span
                        className="font-3"
                        style={{
                          fontWeight: 'bold',
                          display: 'block',
                        }}
                      >
                        {item.name}
                      </span>
                      <span style={{ color: 'gray' }}>{item.description}</span>
                    </div>
                  </Space>
                </Col>
              ))}
          </Row>
          {
            dataSubmissions?.page_Index && <Pagination onChange={ (pageSl)=> {
              setPage(pageSl)
            }} defaultCurrent={1} pageSize={1} total={dataSubmissions.page_Index} />
          }
        </Space>
      </Card>
    </>
  );
};

index.getLayout = ClientLayout;

export default index;

export const getServerSideProps: GetServerSideProps = async (context) => {
  //Check login
  const res = await fetch('http://localhost:3000/api/auth/accesstoken', {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  });

  const data = await res.json();

  //Redirect login page when error
  if (res.status !== 200) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  //Check role
  if (data.user.role !== 'admin') {
    return {
      notFound: true,
    };
  }

  //Get all data users
  const result: ISubmissions = await fetch(`http://localhost:3000/api/submissions?_page=1`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  }).then((e) => e.json());

  return {
    props: {
      result,
    },
  };
};
