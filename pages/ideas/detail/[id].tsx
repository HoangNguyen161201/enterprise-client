//Import
import { IdcardOutlined, MailOutlined, SendOutlined, TeamOutlined } from '@ant-design/icons';
import {
  Avatar,
  Breadcrumb,
  Card,
  Col,
  Divider,
  Grid,
  Input,
  List,
  message,
  Row,
  Space,
  Spin,
  Switch,
} from 'antd';
import { ClientLayout } from 'components/layouts';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChangeEventHandler, useEffect, useEffect as UseEffect, useState } from 'react';
import { Infor } from 'components/elements/common';
import { IallComments, ICommon, IDetailIdea, IUser } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import { getCurrentUser, getDetailIdea, getDetailUser, getUrlDownloadZip } from 'queries';
import { convert } from 'html-to-text';

//CSS quill
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

//Dynamic import quill
import dynamic from 'next/dynamic';
import { dataTypeFile } from 'utils/dataTypeFile';
import ItemFileUpload from 'components/elements/common/ItemFileUpload';
import { commentMutation } from 'mutations/comment';
import { AxiosError } from 'axios';
import { getallComments } from 'queries/comment';
import ItemComment from 'components/elements/common/ItemComment';
import InputComment from 'components/elements/common/InputComment';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export interface IDetailEmployeeProps {
  detailIdea: IDetailIdea;
  allComments: IallComments;
}

//element
const ItemDetailIdea = ({ title, content }: { title: string; content: string }) => {
  return (
    <Row wrap={false}>
      <Col flex={'110px'}>
        <span
          style={{
            fontWeight: 'bold',
            color: '#009F9D',
          }}
        >
          {title}:
        </span>
      </Col>
      <Col flex={'auto'}>
        <span>{content}</span>
      </Col>
    </Row>
  );
};

const DetailIdea: NextPageWithLayout = ({ detailIdea, allComments }: IDetailEmployeeProps) => {
  const { query } = useRouter();
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();

  //State anonymously and content comment
  const [anonymously, setAnonymously] = useState<boolean>(false);

  //Get id from router to get detail data
  const {
    query: { id },
  } = useRouter();

  //State match final closure date
  const [isMatchFinalTime, setIsMatchFinalTime] = useState<boolean>(false);

  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();
  UseEffect(() => {
    dataUserRefetch();
  }, []);

  //Get detail data idea
  const { error: errorDetailIdea, data: dataDetailIdea } = getDetailIdea(
    id as string,
    dataUser?.accessToken.token,
    detailIdea
  );

  //Get all comments
  const { error: errorComments, data: dataComments } = getallComments(
    id as string,
    dataUser?.accessToken.token,
    allComments
  );

  //Get url dowload zip
  const { data: dataURLZip, refetch: refetchDataURLZip } = getUrlDownloadZip(
    dataDetailIdea?.idea.cloudinary_id as string
  );

  //Set is match final closure date
  useEffect(() => {
    if (dataDetailIdea && dataDetailIdea.idea.submission_id.final_closure_date) {
      const valueCheckTime =
        new Date(dataDetailIdea.idea.submission_id.final_closure_date) > new Date();
      setIsMatchFinalTime(valueCheckTime);
    }

    //Refetch get url dowload zip
    refetchDataURLZip();
  }, [dataDetailIdea]);

  //  Mutation call api to add comment
  const mutationAddComment = commentMutation.add({
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Add comment false.',
        });
      },
    },
    dataUserRefetch: dataUserRefetch,
    token: dataUser?.accessToken.token,
  });

  //Check exist and show error
  UseEffect(() => {
    if (errorGetUser) {
      message.error({
        content: errorGetUser.response?.data.err,
      });
    }

    if (errorComments) {
      message.error({
        content: errorComments.response?.data.err,
      });
    }

    if (errorDetailIdea) {
      message.error({
        content: errorDetailIdea.response?.data.err,
      });
    }
  }, [errorGetUser, errorComments, errorDetailIdea]);

  //Generate img type file
  const generateImgFile = (nameFile: string) => {
    let typeFile = nameFile.split('.')[1];
    if (!dataTypeFile.includes(typeFile)) {
      typeFile = 'other';
    }

    return `/assets/files/${typeFile}.svg`;
  };

  //Handle add comment
  const onAddComment = (contentComment: string) => {
    if (!contentComment) {
      message.error({
        content: 'Pleas enter your comment.',
      });
    } else {
      mutationAddComment.mutate({
        content: contentComment,
        idea_id: dataDetailIdea?.idea._id as string,
        user_id: dataUser?.user._id,
        anonymously,
      });
    }
  };

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

      <Card
        title="View Detail Employee"
        style={{ width: '100%', marginTop: '20px' }}
        extra={dataURLZip?.url && <a href={dataURLZip?.url}>Dowload all files</a>}
      >
        <Space direction="vertical" size={20}>
          <span
            className="font-5"
            style={{
              fontWeight: 'bold',
              color: '#07456F',
            }}
          >
            {dataDetailIdea && dataDetailIdea.idea.title}
          </span>
          <Space wrap size={20}>
            <Avatar src={dataDetailIdea && dataDetailIdea.idea.user_id.avatar.url} />
            <span>{dataDetailIdea && dataDetailIdea.idea.user_id.name.toUpperCase()}</span>
            <span>
              {dataDetailIdea && new Date(dataDetailIdea.idea.createdAt).toLocaleString()}
            </span>
          </Space>
          <Divider
            style={{
              margin: 0,
            }}
          />
          <ItemDetailIdea
            title="Submission"
            content={(dataDetailIdea && dataDetailIdea.idea.submission_id.name) as string}
          />
          <ItemDetailIdea
            title="Category"
            content={
              dataDetailIdea && dataDetailIdea.idea.category_id?.name
                ? dataDetailIdea.idea.category_id.name
                : 'None'
            }
          />
          <ItemDetailIdea
            title="Description"
            content={(dataDetailIdea && dataDetailIdea.idea.description) as string}
          />
          <Divider
            style={{
              margin: 0,
            }}
          />

          <ReactQuill
            theme="bubble"
            style={{
              minHeight: 200,
            }}
            value={dataDetailIdea && dataDetailIdea.idea.content}
            readOnly
          />
          <Divider
            style={{
              margin: 0,
            }}
          />
          {dataDetailIdea &&
            dataDetailIdea.idea.files.map((file, index) => (
              <ItemFileUpload
                key={index}
                src={generateImgFile(file.name)}
                fileName={file.name}
                index={index}
                url_file={file.url}
              />
            ))}
          <Divider
            style={{
              margin: 0,
            }}
          />
          <Space
            wrap
            size={20}
            style={{
              justifyContent: 'end',
              width: '100%',
            }}
          >
            <Space size={10}>
              <span className="reaction">👍</span>
              <span>10</span>
            </Space>
            <Space size={10}>
              <span className="reaction">👎</span>
              <span>10</span>
            </Space>
            <Space size={10}>
              <span className="reaction">🤣</span>
              <span>10</span>
            </Space>
            <Space size={10}>
              <span className="reaction">😭</span>
              <span>10</span>
            </Space>
            <Space size={10}>
              <span className="reaction">😍</span>
              <span>10</span>
            </Space>
            <Space size={10}>
              <span className="reaction">😡</span>
              <span>10</span>
            </Space>
          </Space>
          <Divider
            style={{
              margin: 0,
            }}
          />
          <Space
            wrap
            size={20}
            style={{
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                color: 'gray',
              }}
            >
              Comments
            </span>
            {isMatchFinalTime && (
              <Space size={20}>
                <span
                  style={{
                    fontSize: 14,
                    color: 'gray',
                  }}
                >
                  Anonymously infor
                </span>
                <Switch checked={anonymously} onChange={(value) => setAnonymously(value)} />
              </Space>
            )}
          </Space>

          {/* Input comment */}
          <InputComment
            isLoading={mutationAddComment.isLoading}
            showInput={isMatchFinalTime}
            onAddComment={onAddComment}
          />
          <List
            dataSource={dataComments?.comments}
            renderItem={(item) => (
              <List.Item>
                <ItemComment
                  idea_id={dataDetailIdea?.idea._id as string}
                  isMatchFinalTime={isMatchFinalTime}
                  dataUserRefetch={dataUserRefetch}
                  dataUser={dataUser}
                  comment={item}
                  anonymously={anonymously}
                />
              </List.Item>
            )}
          />
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

  //Redirect 404 page when not have detailIdea
  if (detailIdea.statusCode !== 200) {
    return {
      notFound: true,
    };
  }

  let allComments: IallComments = await fetch(
    `http://localhost:3000/api/comments/idea/${context.query.id}`,
    {
      method: 'GET',
      headers: {
        cookie: context.req.headers.cookie,
        authorization: dataAccess.accessToken.token,
      } as HeadersInit,
    }
  ).then((e) => e.json());
  //Check error get all comment
  if (allComments.statusCode !== 200) {
    allComments.comments = [];
  }

  return {
    props: {
      detailIdea,
      allComments,
    },
  };
};
