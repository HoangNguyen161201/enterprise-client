//Import
import { IdcardOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Grid,
  Image,
  Input,
  List,
  message,
  Modal,
  Row,
  Space,
  Tag,
  Tooltip,
} from 'antd';
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
import { SocialIcon } from 'react-social-icons';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import TextArea from 'antd/lib/input/TextArea';

export interface IDetailEmployeeProps {
  detailCurrentUser: IDetailUser;
}

const DetailEmployee: NextPageWithLayout = ({ detailCurrentUser }: IDetailEmployeeProps) => {
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();

  //State infor contact
  const [socialNetworks, setSocialNetworks] = useState<string[]>([]);
  const [contentSocialNetwork, setContentSocialNetwork] = useState<string>('');

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

  //Setting modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //Handle add new social network
  const onAddNetwork = () => {
    //Check content input social network
    if (!contentSocialNetwork) {
      message.warning({
        content: 'Please enter field social network and press enter.',
      });
    }

    //Add new social network to list
    setSocialNetworks([...socialNetworks, contentSocialNetwork]);
  };

  //Handle remove social network
  const onRemoveNetwork = (index: number) => {
    const newSocialNetWorks = socialNetworks;
    newSocialNetWorks.splice(index, 1);

    setSocialNetworks([...newSocialNetWorks]);
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
                  <Space size={20}>
                    <Image
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        padding: 0,
                        margin: 0,
                        boxShadow: '36px 23px 46px -9px rgba(0,0,0,0.07)',
                      }}
                      src={avatar?.url}
                    />

                    <Space direction="vertical" size={20}>
                      <Tooltip title="Update Avatar">
                        <label
                          htmlFor="upload_avatar"
                          style={{
                            cursor: 'pointer',
                          }}
                        >
                          <BsPen />
                          <span
                            style={{
                              marginLeft: 10,
                            }}
                          >
                            Edit Avatar
                          </span>
                        </label>
                        <input onChange={onChangeAvatar} hidden id="upload_avatar" type={'file'} />
                      </Tooltip>
                      <Button onClick={showModal}>Edit Infor Contact</Button>
                    </Space>
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

                <span className={`${desColor}`}>Basic contact infor</span>
                <Space direction="vertical">
                  <label>Phone</label>
                  <Space
                    style={{
                      border: '1px solid #009F9D',
                      width: '100%',
                      padding: '5px 10px',
                      borderRadius: 5,
                      background: 'white',
                    }}
                  >
                    0833876372
                  </Space>
                </Space>
                <Space direction="vertical">
                  <label>Phone</label>
                  <Space
                    style={{
                      border: '1px solid #009F9D',
                      width: '100%',
                      padding: '5px 10px',
                      borderRadius: 5,
                      color: 'tomato',
                      background: 'white',
                    }}
                  >
                    None
                  </Space>
                </Space>

                <span className={`${desColor}`}>Social network</span>
                <Space size={20}>
                  <SocialIcon
                    url="https://www.facebook.com/profile.php?id=100014461876748"
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  />
                  <SocialIcon
                    url="https://www.facebook.com/profile.php?id=100014461876748"
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  />
                  <SocialIcon
                    url="https://www.youtube.com/"
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  />
                  <SocialIcon
                    url="https://www.youtube.com/"
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  />
                  <SocialIcon
                    url="https://www.youtube.com/"
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  />
                  <SocialIcon
                    url="https://www.youtube.com/"
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  />
                  <SocialIcon
                    url="https://www.youtube.com/"
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  />
                </Space>
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

      <Modal
        title="Update infor contact"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Space direction="vertical" size={20}>
          <Space direction="vertical">
            <label>Phone Number:</label>
            <PhoneInput
              country={'us'}
              value={'+84833876372'}
              onChange={(phone) => console.log(phone)}
              inputStyle={{
                width: '100%',
              }}
            />
          </Space>
          <Space direction="vertical">
            <label>Country:</label>
            <Input placeholder="Enter your country" />
          </Space>
          <Space direction="vertical">
            <label>City:</label>
            <Input placeholder="Enter your city" />
          </Space>
          <Space direction="vertical">
            <label>Street:</label>
            <TextArea placeholder="Enter your street" />
          </Space>
          <Space direction="vertical">
            <label>Social networks:</label>
            <Space wrap size={10}>
              {socialNetworks &&
                socialNetworks.map((socialNetwork, index) => (
                  <Tag key={socialNetwork} closable onClose={() => onRemoveNetwork(index)}>
                    <div className="tag_URL">{socialNetwork}</div>
                  </Tag>
                ))}
            </Space>
            <Input
              placeholder="https://www.example.com/"
              value={contentSocialNetwork}
              onChange={(e) => setContentSocialNetwork(e.target.value)}
              onPressEnter={onAddNetwork}
            />
          </Space>
        </Space>
      </Modal>
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
