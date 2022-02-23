//Import
import { IdcardOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Card, Col, Grid, message, Row, Space, Table } from 'antd';
import { ClientLayout } from 'components/layouts';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Infor } from 'components/elements/common';
import { IUser, IDetailSubmission, ISubmission } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import { getCurrentUser, getDetailSubmission, getDetailUser } from 'queries';
import { ColumnsType } from 'antd/lib/table';
import column from 'utils/configTB';
import RowTable from 'components/elements/common/RowTable';

export interface IDetailSubmissionProps {
  detailSubmission: IDetailSubmission;
}

const DetailSubmission: NextPageWithLayout = ({ detailSubmission }: IDetailSubmissionProps) => {
  const { query } = useRouter();
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();

  //State date
  const [timeClosure, setTimeClosure] = useState({
    closure_date: {
      value: '',
      isMatchDate: false,
    },
    final_closure_date: {
      value: '',
      isMatchDate: false,
    },
  });

  //Get id from router to get old data
  const {
    query: { id },
  } = useRouter();

  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();
  useEffect(() => {
    dataUserRefetch();
  }, []);

  //Get detail data submission
  const { error: errorSubmission, data: dataDetailSubmission } = getDetailSubmission(
    id as string,
    dataUser?.accessToken.token,
    detailSubmission
  );

  //Set closure date when have data detail submission
  useEffect(() => {
    if (dataDetailSubmission) {
      setTimeClosure({
        closure_date: {
          value: new Date(dataDetailSubmission.submission.closure_date).toString(),
          isMatchDate: new Date(dataDetailSubmission.submission.closure_date) < new Date(),
        },
        final_closure_date: {
          value: new Date(dataDetailSubmission.submission.final_closure_date).toString(),
          isMatchDate: new Date(dataDetailSubmission.submission.final_closure_date) < new Date(),
        },
      });
    }
  }, [dataDetailSubmission]);

  //Check exist and show error
  useEffect(() => {
    if (errorGetUser) {
      message.error({
        content: errorGetUser.response?.data.err,
      });
    }
  }, [errorGetUser]);

  useEffect(() => {
    if (errorSubmission) {
      message.error({
        content: errorSubmission.response?.data.err,
      });
    }
  }, [errorSubmission]);

  return (
    <>
      <Head>
        <title>Detail Submission Page</title>
      </Head>

      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Submission</Breadcrumb.Item>
        <Breadcrumb.Item>All Submission</Breadcrumb.Item>
        <Breadcrumb.Item>View Detail Submission</Breadcrumb.Item>
      </Breadcrumb>

      <Card title="View Detail Employee" style={{ width: '100%', marginTop: '20px' }}>
        <Space direction="vertical" size={0}>
          <RowTable title="Name" value={dataDetailSubmission?.submission.name} />
          <RowTable title="Description" value={dataDetailSubmission?.submission.description} />
          <RowTable
            title="Closure Date"
            value={timeClosure.closure_date.value}
            color={timeClosure.closure_date.isMatchDate ? 'tomato' : undefined}
          />
          <RowTable
            title="Closure Date"
            value={timeClosure.final_closure_date.value}
            color={timeClosure.final_closure_date.isMatchDate ? 'tomato' : undefined}
          />
        </Space>
      </Card>
    </>
  );
};

DetailSubmission.getLayout = ClientLayout;

export default DetailSubmission;

export const getServerSideProps: GetServerSideProps = async (context) => {
  //Check login
  const res = await fetch(`http://localhost:3000/api/auth/accesstoken`, {
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

  const detailSubmission: IDetailSubmission = await fetch(
    `http://localhost:3000/api/submissions/${context.query.id}`,
    {
      method: 'GET',
      headers: {
        cookie: context.req.headers.cookie,
        authorization: data.accessToken.token,
      } as HeadersInit,
    }
  ).then((e) => e.json());

  return {
    props: {
      detailSubmission,
    },
  };
};
