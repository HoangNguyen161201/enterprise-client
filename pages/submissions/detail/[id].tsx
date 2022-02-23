//Import
import { IdcardOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Card, Col, Grid, message, Row, Space, Table } from 'antd';
import { ClientLayout } from 'components/layouts';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { Infor } from 'components/elements/common';
import { IUser, IDetailSubmission, ISubmission } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import { getCurrentUser, getDetailSubmission, getDetailUser } from 'queries';
import { ColumnsType } from 'antd/lib/table';
import column from 'utils/configTB';
import RowTable from 'components/elements/common/RowTable';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from 'utils/uploadFile';
import { v4 as uuidv4 } from 'uuid';
import { dataTypeFile } from 'utils/dataTypeFile';

export interface IDetailSubmissionProps {
  detailSubmission: IDetailSubmission;
}

const DetailSubmission: NextPageWithLayout = ({ detailSubmission }: IDetailSubmissionProps) => {
  const { query } = useRouter();
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();

  //State file
  const [filesUpload, setFilesUpload] = useState<File[]>([]);

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
    dataUser?.accessToken.token as string,
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

  //Setting data file submit
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFilesUpload(acceptedFiles);
  }, []);

  //Setting files uploads
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  //Remove file upload
  const onRemoveFile = (index: number) => {
    console.log(index);

    const newFilesUpload = filesUpload.filter((file, indexFile) => {
      if (indexFile !== index) {
        return file;
      }
    });
    setFilesUpload(newFilesUpload);
  };

  //Handle submit file
  const onSubmit = async () => {
    const result = await uploadFile(filesUpload, [
      detailSubmission.submission._id,
      dataUser?.user._id,
      uuidv4(),
    ]);
    console.log(result);
  };

  //Generate img type file
  const generateImgFile = (nameFile: string) => {
    let typeFile = nameFile.split('.')[1];
    if (!dataTypeFile.includes(typeFile)) {
      typeFile = 'other';
    }

    return `/assets/files/${typeFile}.svg`;
  };

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

        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
        {filesUpload.map((file, index) => (
          <div key={index}>
            <img src={generateImgFile(file.name)} /> 
            <div>
              {file.name} <span onClick={() => onRemoveFile(index)}>Delete</span>
            </div>
          </div>
        ))}
        <Button onClick={onSubmit} type="primary">
          Submit
        </Button>
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
