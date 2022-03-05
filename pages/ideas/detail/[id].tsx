//Import
import {
  Avatar,
  Card,
  Col,
  Divider, List,
  message,
  Row,
  Space,
  Spin,
  Switch,
  Tooltip
} from 'antd';
import { AxiosError } from 'axios';
import { BreadCrumb } from 'components/elements/common';
import InputComment from 'components/elements/common/InputComment';
import ItemComment from 'components/elements/common/ItemComment';
import ItemFileUpload from 'components/elements/common/ItemFileUpload';
import { ClientLayout } from 'components/layouts';
import { GlobalContext } from 'contextApi/globalContext';
import { IallComments, ICommon, IDetailIdea, IDetailUser, Ireaction } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import { commentMutation } from 'mutations/comment';
import { IReactionMutaion } from 'mutations/reaction';
import { GetServerSideProps } from 'next';
//Dynamic import quill
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter as UseRouter } from 'next/router';
import {
  getCurrentUser,
  getDetailIdea,
  getReactionUserIdea,
  getReactType,
  getUrlDownloadZip
} from 'queries';
import { getallComments } from 'queries/comment';
import {
  useContext,
  useEffect,
  useEffect as UseEffect,
  useState,
  useState as UseState
} from 'react';
import 'react-quill/dist/quill.bubble.css';
//CSS quill
import 'react-quill/dist/quill.snow.css';
import { dataTypeFile } from 'utils/dataTypeFile';
import { postData } from 'utils/fetchData';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export interface IDetailEmployeeProps {
  detailIdea: IDetailIdea;
  allComments: IallComments;
  detailUser: IDetailUser;
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

const DetailIdea: NextPageWithLayout = ({
  detailIdea,
  allComments,
  detailUser,
}: IDetailEmployeeProps) => {
  //Get socket
  const { socket } = useContext(GlobalContext);

  //State anonymously and content comment
  const [anonymously, setAnonymously] = UseState<boolean>(false);

  //State detail and number reaction
  const [reactionCountDetail, setReactionCountDetail] = useState<Ireaction[]>([]);

  //Get id from router to get detail data
  const {
    query: { id },
  } = UseRouter();

  //Join room socket
  UseEffect(() => {
    //Join room
    if (socket && id) {
      socket.emit('join_room', id);
    }

    //Leave room
    function leaveRoom() {
      if (socket && id) {
        socket.emit('leave_room', id);
      }
    }

    return leaveRoom;
  }, [socket, id]);

  //State match final closure date
  const [isMatchFinalTime, setIsMatchFinalTime] = UseState<boolean>(false);

  //Get access token
  const {
    data: dataUser,
    error: errorGetUser,
    refetch: dataUserRefetch,
  } = getCurrentUser(detailUser);
  UseEffect(() => {
    dataUserRefetch();
  }, []);

  //Get all reaction types
  const {
    data: dataAllReaction,
    error: errorReaction,
    refetch: refetchAllReaction,
  } = getReactType();

  //Get detail data idea
  const {
    error: errorDetailIdea,
    data: dataDetailIdea,
    refetch: refetchDetailIdea,
  } = getDetailIdea(id as string, dataUser?.accessToken.token, detailIdea);

  //Get reaction of current user and current detail idea
  const { data: dataReactionUserIdea, error: errReactionUserIdea } = getReactionUserIdea(
    dataUser?.user?._id,
    dataDetailIdea?.idea?._id
  );

  //Get all comments
  const {
    error: errorComments,
    data: dataComments,
    refetch: refetchDataComments,
  } = getallComments(id as string, dataUser?.accessToken.token, allComments);

  //Get url dowload zip
  const { data: dataURLZip, refetch: refetchDataURLZip } = getUrlDownloadZip(
    dataDetailIdea?.idea.cloudinary_id as string
  );

  //Set is match final closure date
  UseEffect(() => {
    if (dataDetailIdea && dataDetailIdea.idea.submission_id.final_closure_date) {
      const valueCheckTime =
        new Date(dataDetailIdea.idea.submission_id.final_closure_date) > new Date();
      setIsMatchFinalTime(valueCheckTime);
    }

    //Refetch get url dowload zip
    refetchDataURLZip();
  }, [dataDetailIdea]);

  //Add view user
  UseEffect(() => {
    if (dataUser && dataDetailIdea) {
      postData({
        url: '/api/views',
        body: {
          user_id: dataUser.user._id,
          idea_id: dataDetailIdea.idea._id,
        },
        token: dataUser.accessToken.token,
      });
    }
  }, [dataUser, dataDetailIdea]);

  //  Mutation call api to add comment
  const mutationAddComment = commentMutation.add({
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });

        //Fetch again all comments when add new comment
        refetchDataComments();
        if (socket && id) {
          socket.emit('new_comment', id);
        }
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

  //Mutation add reaction
  const mutationAddReaction = IReactionMutaion.add({
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });

        //refetch data
        refetchDetailIdea();
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Add reaction false.',
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

    if (errorReaction) {
      message.error({
        content: errorReaction.response?.data.err,
      });
    }

    if (errReactionUserIdea) {
      message.error({
        content: errReactionUserIdea.response?.data.err,
      });
    }
  }, [errorGetUser, errorComments, errorDetailIdea, errorReaction, errReactionUserIdea]);

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

  //Handle add reaction
  const onAddReaction = (reactionType_id: string) => {
    mutationAddReaction.mutate({
      user_id: dataUser && dataUser.user._id,
      idea_id: dataDetailIdea && dataDetailIdea.idea._id,
      reactionType_id,
    });
  };

  //Set count number reaction detail of current idea
  useEffect(() => {
    if (dataAllReaction && dataDetailIdea) {
      const dataReactionCountDetail: Ireaction[] = dataAllReaction.reactionTypes.map(
        (itemReactionType) => {
          let count = 0;
          dataDetailIdea.countReactions?.map((itemReactionDetail) => {
            console.log(dataAllReaction, dataDetailIdea);
            if (itemReactionType._id == itemReactionDetail._id) {
              count = itemReactionDetail.count;
            }
          });

          return {
            ...itemReactionType,
            count,
          };
        }
      );

      setReactionCountDetail(dataReactionCountDetail);
    }
  }, [dataDetailIdea, dataAllReaction]);

  //Handle event socket
  UseEffect(() => {
    //Join room
    if (socket) {
      socket.on('new_comment', () => {
        refetchDataComments();
      });
    }
  }, [socket]);

  return (
    <>
      <Head>
        <title>Detail Idea Page</title>
      </Head>

      <BreadCrumb
        data={[
          {
            url: '/',
            label: 'Home',
          },
          {
            url: '/ideas',
            label: 'Ideas',
          },
        ]}
        main={{
          url: `/ideas/detail/${id}`,
          label: 'Detail idea',
        }}
      />

      <Card
        title="View Detail Idea"
        className="card-b"
        extra={
          detailIdea?.idea?.cloudinary_id &&
          dataURLZip?.url && <a href={dataURLZip?.url}>Dowload all files</a>
        }
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
            <span>{dataDetailIdea && `(${dataDetailIdea.idea.view}) view`}</span>
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
            <Spin spinning={mutationAddReaction.isLoading}>
              {reactionCountDetail &&
                reactionCountDetail.map((item, index) => (
                  <Space key={index} size={10}>
                    <Tooltip title={item.name}>
                      <span className="reaction" onClick={() => onAddReaction(item._id)}>
                        {item.icon}
                      </span>
                    </Tooltip>
                    <span>{item.count}</span>
                  </Space>
                ))}
            </Spin>
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
          {isMatchFinalTime && (
            <InputComment
              isLoading={mutationAddComment.isLoading}
              showInput={isMatchFinalTime}
              onAddComment={onAddComment}
            />
          )}
          <List
            dataSource={dataComments?.comments}
            renderItem={(item) => (
              <List.Item>
                <ItemComment
                  refetchDataComments={refetchDataComments}
                  idea_id={dataDetailIdea?.idea._id as string}
                  isMatchFinalTime={isMatchFinalTime}
                  dataUserRefetch={dataUserRefetch}
                  dataUser={dataUser as IDetailUser}
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

  //Check role
  if (detailUser.user.role === 'admin') {
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
        authorization: detailUser.accessToken.token,
      } as HeadersInit,
    }
  ).then((e) => e.json());

  //Redirect 404 page when not have detailIdea
  if (detailIdea.statusCode !== 200) {
    return {
      notFound: true,
    };
  }

  //Check accept and role idea
  if (!detailIdea.idea.accept && detailUser.user.role !== 'qa_manager') {
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
        authorization: detailUser.accessToken.token,
      } as HeadersInit,
    }
  ).then((e) => e.json());

  //Redirect 404 page when not have allComments
  if (allComments.statusCode !== 200) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      detailIdea,
      allComments,
      detailUser,
    },
  };
};
