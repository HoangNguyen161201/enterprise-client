//Import
import {
  CloseOutlined,
  CloudUploadOutlined,
  IdcardOutlined,
  MailOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Grid,
  message,
  Row,
  Space,
  Spin,
  Table,
} from 'antd';
import { ClientLayout } from 'components/layouts';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { Infor } from 'components/elements/common';
import { IUser, IDetailSubmission, ISubmission, ICommon } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import { getCurrentUser, getDetailSubmission, getDetailUser } from 'queries';
import { ColumnsType } from 'antd/lib/table';
import column from 'utils/configTB';
import RowTable from 'components/elements/common/RowTable';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from 'utils/uploadFile';
import { v4 as uuidv4 } from 'uuid';
import { dataTypeFile } from 'utils/dataTypeFile';
import ItemFileUpload from 'components/elements/common/ItemFileUpload';
import { departmentMutation } from 'mutations/department';
import { fileMutation } from 'mutations/file';
import { AxiosError } from 'axios';

export interface IDetailSubmissionProps {
  detailSubmission: IDetailSubmission;
}

const DetailSubmission: NextPageWithLayout = ({ detailSubmission }: IDetailSubmissionProps) => {
  const { query } = useRouter();
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();

    //  Mutation call api to add file
    const mutationDeleteFiles = fileMutation.delete({
      options: {
        onSuccess: (data: ICommon) => {
          message.success({
            content: data.msg,
          });
        },
        onError: (error: AxiosError) => {
          message.error({
            content: error.response?.data.err || 'Delete files false.',
          });
        }
      },
    })

  //State file
  const [filesUpload, setFilesUpload] = useState<File[]>([]);

  //State loading submit files
  const [isLoadUpFile, setIsLoadUpFile] = useState<boolean>(false);

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
          isMatchDate: new Date(dataDetailSubmission.submission.closure_date) > new Date(),
        },
        final_closure_date: {
          value: new Date(dataDetailSubmission.submission.final_closure_date).toString(),
          isMatchDate: new Date(dataDetailSubmission.submission.final_closure_date) > new Date(),
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
    //Check size
    let isValidSize = true;
    acceptedFiles.forEach((file) => {
      if (file.size >= 10485760) {
        isValidSize = false;
      }
    });

    if (isValidSize) {
      setFilesUpload(acceptedFiles);
    } else {
      message.error({
        content: 'Each file should be less than 10MB in size.',
      });
    }
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
    setIsLoadUpFile(true);

    //Up files
    const result = await uploadFile(filesUpload, [
      detailSubmission.submission._id,
      dataUser?.user._id,
      uuidv4(),
    ]);

    console.log(result);

    //set state files upload
    setFilesUpload([]);
    setIsLoadUpFile(false);
    message.success({
      content: 'Upload files success.',
    });
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
        <Space direction="vertical" size={20}>
          <span
            style={{
              fontSize: 14,
              color: 'gray',
            }}
          >
            Information
          </span>
          <RowTable title="Name" value={dataDetailSubmission?.submission.name} />
          <RowTable title="Description" value={dataDetailSubmission?.submission.description} />
          <RowTable
            title="Closure Date"
            value={timeClosure.closure_date.value}
            isValid={timeClosure.closure_date.isMatchDate}
          />
          <RowTable
            title="Closure Date"
            value={timeClosure.final_closure_date.value}
            isValid={timeClosure.final_closure_date.isMatchDate}
          />

          <span
            style={{
              fontSize: 14,
              color: 'gray',
            }}
          >
            Upload file
          </span>
          <Spin spinning={isLoadUpFile}>
            <Space
              style={{
                width: '100%',
                border: '5px dotted #009F9D30',
                padding: '40px 40px',
                borderRadius: '20px',
                justifyContent: 'center',
              }}
              direction="vertical"
              align="center"
              size={20}
              {...getRootProps()}
            >
              <img src="/assets/uploadFiles.svg" />
              <input {...getInputProps()} />
              {isDragActive ? (
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: 'gray',
                  }}
                >
                  Drop the files here ...
                </p>
              ) : (
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: 'gray',
                  }}
                >
                  Drag your documents, photos, or videos here to start uploading
                </p>
              )}
              <Button
                type="primary"
                size="large"
                style={{
                  borderRadius: 4,
                }}
              >
                Choose Files
              </Button>
            </Space>
          </Spin>

          {filesUpload.map((file, index) => (
            <Spin spinning={isLoadUpFile}>
              <ItemFileUpload
                src={generateImgFile(file.name)}
                fileName={file.name}
                index={index}
                onRemoveFile={onRemoveFile}
              />
            </Spin>
          ))}

          {filesUpload.length !== 0 && (
            <Button
              loading={isLoadUpFile}
              style={{
                borderRadius: 5,
              }}
              onClick={onSubmit}
              type="primary"
              icon={<CloudUploadOutlined />}
            >
              Submit
            </Button>
          )}
        </Space>
        <Button type="primary" onClick={() => {
          mutationDeleteFiles.mutate({tag: "8397f58a-b662-4c07-b806-cd0771b597ec"})
        }}>
          Delete file
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
