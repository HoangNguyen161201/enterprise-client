//Import
import { IdcardOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Grid, Image, List, message, Row, Space, Tooltip } from 'antd';
import { AxiosError } from 'axios';
import { BreadCrumb, Infor, ItemIdea } from 'components/elements/common';
import { ClientLayout } from 'components/layouts';
import { GlobalContext } from 'contextApi/globalContext';
import { IAvatar, ICommon, IDetailUser, IUser } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import { EmplMutation } from 'mutations/employee';
import { fileMutation } from 'mutations/file';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getCurrentUser, getIdeasAcceptUser } from 'queries';
import { ChangeEventHandler, useEffect, useEffect as UseEffect, useState, useContext } from 'react';
import { BsPen, BsPencilSquare } from 'react-icons/bs';
import { uploadFile } from 'utils/uploadFile';
import { v4 as uuidv4 } from 'uuid';

export interface IDetailEmployeeProps {
  detailCurrentUser: IDetailUser;
}

const DetailEmployee: NextPageWithLayout = ({ detailCurrentUser }: IDetailEmployeeProps) => {
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();

  //State
  const [avatar, setAvatar] = useState<IAvatar | null>(null);

  //Color dark mode
  const { color, desColor } = useContext(GlobalContext);

  //loading upload avtar
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //Get access token
  const {
    data: dataUser,
    error: errorGetUser,
    refetch: dataUserRefetch,
  } = getCurrentUser(detailCurrentUser);
  UseEffect(() => {
    dataUserRefetch();
  }, []);

  //Set avatar when have current user
  useEffect(() => {
    if (dataUser?.user?.avatar) {
      setAvatar(dataUser.user.avatar);
    }
  }, [dataUser]);

  //Get Idea accept user
  const { data: dataIdeasAccept, error: errDataIdeasAccept } = getIdeasAcceptUser({
    user_id: dataUser?.user._id,
    accessToken: dataUser?.accessToken.token,
  });

  //Check exist and show error
  UseEffect(() => {
    if (errorGetUser) {
      message.error({
        content: errorGetUser.response?.data.err,
      });
    }
  }, [errorGetUser]);

  //  Mutation call api to add file
  const mutationDeleteFiles = fileMutation.delete({
    options: {},
  });

  //  mutation call api to update avatar
  const mutationUpdateAvatarUser = EmplMutation.updateAvatar({
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });

        //Delete old avatar
        if (avatar && avatar?.cloudinary_id) {
          mutationDeleteFiles.mutate({ tag: avatar?.cloudinary_id });
        }

        //Refetch data user
        dataUserRefetch();
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Update avatar false.',
        });
      },
    },
    dataUserRefetch: dataUserRefetch,
    token: dataUser?.accessToken.token,
  });

  //handle change avatar
  const onChangeAvatar: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files: File[] = [e.target.files[0]];
      //set loading
      setIsLoading(true);

      //Check size
      if (files[0].size >= 10485760) {
        message.error({
          content: 'File should be less than 10MB in size.',
        });
      }

      //Set cloud dinary id files
      const cloudinary_id = uuidv4();

      //Up files
      await uploadFile(files, [cloudinary_id], true)
        .then((filesResult) => {
          //Check exist result and get data avatar result
          if (Array.isArray(filesResult) && filesResult[0]) {
            //set avatar upload
            const avatarUpload: IAvatar = {
              url: filesResult[0]?.url,
              public_id: filesResult[0]?.public_id,
              cloudinary_id: cloudinary_id,
            };

            //Update avatar database
            mutationUpdateAvatarUser.mutate({
              user: dataUser?.user as IUser,
              avatar: avatarUpload,
            });
          } else {
            message.error({
              content: 'Update Avatar wrong.',
            });
          }
        })
        .catch((err) => {
          message.error({
            content: 'Update Avatar wrong.',
          });
        });

      //set loading
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Profile Page</title>
      </Head>

      <BreadCrumb
        data={[
          {
            url: '/',
            label: 'Home',
          },
        ]}
        main={{
          url: '/profile',
          label: 'Profile',
        }}
      />

      <Card title={<span className={`${color}`}>View Profile</span>} className="card-b shadow-l">
        <Space direction="vertical" size={20}>
          <Row wrap={!lg} gutter={[30, 30]}>
            <Col flex={lg ? '400px' : undefined} span={lg ? undefined : 24}>
              <Space size={20} direction="vertical">
                <Space size={20} wrap>
                  <Space align="end">
                   
                      <Image
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: 'cover',
                          padding: 0,
                          margin: 0,
                          boxShadow: '36px 23px 46px -9px rgba(0,0,0,0.07)'
                        }}
                        src={avatar?.url}
                      />

                    <Tooltip title="Update Avatar">
                      <label
                        htmlFor="upload_avatar"
                        style={{
                          cursor: 'pointer',
                        }}
                      >
                        <BsPen />
                      </label>
                    </Tooltip>
                    <input onChange={onChangeAvatar} hidden id="upload_avatar" type={'file'} />
                  </Space>
                  <div
                    style={{
                      height: '100%',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        display: 'block',
                      }}
                      className={`${color}`}
                    >
                      {dataUser?.user?.name}
                    </span>
                    <span className={`${desColor}`}>{dataUser?.user?.role}</span>
                  </div>
                </Space>

                <span className={`${desColor}`}>Employee infor</span>
                <Infor
                  color="#009F9D"
                  Icon={IdcardOutlined}
                  title={`epl-${dataUser?.user?.employee_id}`}
                  titleTooltip={'Employee ID'}
                />
                <Infor
                  color="#07456F"
                  Icon={MailOutlined}
                  title={`${dataUser?.user?.email}`}
                  titleTooltip={'Employee Email'}
                />
                <Infor
                  color="#0F0A3C"
                  Icon={TeamOutlined}
                  titleTooltip={'Department'}
                  title={
                    dataUser?.user?.department_id?.name
                      ? `${dataUser.user.department_id.name}`
                      : 'none'
                  }
                />
              </Space>
            </Col>
            <Col flex="auto">
              <span className={`${desColor}`}>
                {`Ideas Accept (${(dataIdeasAccept && dataIdeasAccept.ideas.length) || 0} ideas)`}
              </span>
              <List
                itemLayout="horizontal"
                dataSource={dataIdeasAccept?.ideas}
                renderItem={(item) => <ItemIdea item={item} onDeleteIdea={() => {}} />}
              />
            </Col>
          </Row>
        </Space>
      </Card>
    </>
  );
};

DetailEmployee.getLayout = ClientLayout;

export default DetailEmployee;

export const getServerSideProps: GetServerSideProps = async (context) => {
  //Check login
  const detailCurrentUser: IDetailUser = await fetch(`http://localhost:3000/api/auth/accesstoken`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  }).then((e) => e.json());

  //Redirect login page when error
  if (detailCurrentUser.statusCode !== 200) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      detailCurrentUser,
    },
  };
};
