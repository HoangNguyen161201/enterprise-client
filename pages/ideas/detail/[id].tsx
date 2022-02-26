//Import
import { IdcardOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Card, Col, Grid, message, Row, Space } from 'antd';
import { ClientLayout } from 'components/layouts';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect as UseEffect } from 'react';
import { Infor } from 'components/elements/common';
import { IDetailIdea, IUser } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import { getCurrentUser, getDetailIdea, getDetailUser } from 'queries';

export interface IDetailEmployeeProps {
    detailIdea: IDetailIdea
}

const DetailIdea: NextPageWithLayout = ({ detailIdea }: IDetailEmployeeProps) => {
    console.log(detailIdea);
    
    
  const { query } = useRouter();
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();

  //Get id from router to get detail data
  const {
    query: { id },
  } = useRouter();

  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();
  UseEffect(() => {
    dataUserRefetch();
  }, []);

  //Get detail data user
  const { error: errorDetailIdea, data: dataDetailIdea } = getDetailIdea(
    id as string,
    dataUser?.accessToken.token,
    detailIdea
  );

  //Check exist and show error
  UseEffect(() => {
    if (errorGetUser) {
      message.error({
        content: errorGetUser.response?.data.err,
      });
    }
  }, [errorGetUser]);

  UseEffect(() => {
    if (errorDetailIdea) {
      message.error({
        content: errorDetailIdea.response?.data.err,
      });
    }
  }, [errorDetailIdea]);

  return (
    <>
      <Head>
        <title>Detail Idea Page</title>
      </Head>

      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Ideas</Breadcrumb.Item>
        <Breadcrumb.Item>View Detail Idea</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="View Detail Employee" style={{ width: '100%', marginTop: '20px' }}>
        <Space direction="vertical" size={20}>
          huy
        </Space>
      </Card>
    </>
  );
};

DetailIdea.getLayout = ClientLayout;

export default DetailIdea;

export const getServerSideProps: GetServerSideProps = async (context) => {
  //Check login
  const res: any = await fetch(`http://localhost:3000/api/auth/accesstoken`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  });
  const dataAccess = await res.json();

  //Redirect login page when error
  if (dataAccess.statusCode !== 200) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  //Check role
  if (dataAccess.user.role === 'admin') {
    return {
      notFound: true,
    };
  }

  const detailIdea: IDetailIdea = await fetch(
    `http://localhost:3000/api/ideas/${context.query.id}`,
    {
      method: 'GET',
      headers: {
        cookie: context.req.headers.cookie,
        authorization: dataAccess.accessToken.token,
      } as HeadersInit,
    }
  ).then((e) => e.json());

  console.log(detailIdea);
  

  //Redirect 404 page when not have detailIdea
  if (detailIdea.statusCode !== '200') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      detailIdea,
    },
  };
};
