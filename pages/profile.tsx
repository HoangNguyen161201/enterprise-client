//Import
import { CameraOutlined, IdcardOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Grid,
  Image,
  Input,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Tag,
  Tooltip,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { AxiosError } from 'axios';
import { BreadCrumb, Infor, StaticUser } from 'components/elements/common';
import ItemInfor from 'components/elements/common/ItemInfor';
import { ClientLayout } from 'components/layouts';
import { GlobalContext } from 'contextApi/globalContext';
import { IAvatar, ICommon, IDetailUser, IUser } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import { EmplMutation } from 'mutations/employee';
import { fileMutation } from 'mutations/file';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getCurrentUser, getIdeasAcceptUser, getStaticUser } from 'queries';
import {
  ChangeEventHandler,
  useContext as UseContext,
  useEffect as UseEffect,
  useState as UseState,
} from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { SocialIcon } from 'react-social-icons';
import { uploadFile } from 'utils/uploadFile';
import { v4 as uuidv4 } from 'uuid';

export interface IDetailEmployeeProps {
  detailCurrentUser: IDetailUser;
}

const DetailEmployee: NextPageWithLayout = ({ detailCurrentUser }: IDetailEmployeeProps) => {
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();

  const { handleLoadPage } = UseContext(GlobalContext);

  UseEffect(() => {
    handleLoadPage(false);
  }, []);

  //State info contact
  const [socialNetworks, setSocialNetworks] = UseState<string[]>([]);
  const [contentSocialNetwork, setContentSocialNetwork] = UseState<string>('');
  const [infoContact, setInfoContact] = UseState({
    country: '',
    city: '',
    street: '',
    phone: '',
  });

  //State
  const [avatar, setAvatar] = UseState<IAvatar | null>(null);

  //loading upload avtar
  const [isLoading, setIsLoading] = UseState<boolean>(false);

  //Get access token
  const {
    data: dataUser,
    error: errorGetUser,
    refetch: dataUserRefetch,
  } = getCurrentUser(detailCurrentUser);
  UseEffect(() => {
    dataUserRefetch();
  }, []);

  //Set avatar and infor contact when have current user
  UseEffect(() => {
    if (dataUser?.user) {
      setAvatar(dataUser.user.avatar);
      setInfoContact({
        phone: dataUser.user.phone ? dataUser.user.phone : '',
        country: dataUser.user.country ? dataUser.user.country : '',
        city: dataUser.user.city ? dataUser.user.city : '',
        street: dataUser.user.street ? dataUser.user.street : '',
      });
      setSocialNetworks(dataUser.user.social_networks ? dataUser.user.social_networks : []);
    }
  }, [dataUser]);

  // get static user
  const {
    data: staticUser,
    error: errStaticUser,
    refetch: refetchStaticUser,
  } = getStaticUser(dataUser?.user._id);

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
    setContentSocialNetwork('');
  };

  //Handle remove social network
  const onRemoveNetwork = (index: number) => {
    const newSocialNetWorks = socialNetworks;
    newSocialNetWorks.splice(index, 1);

    setSocialNetworks([...newSocialNetWorks]);
    console.log(socialNetworks);
  };

  //  mutation call api to update contact info
  const mutationUpdateContact = EmplMutation.updateInforContact({
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });

        dataUserRefetch();
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Update User contact info failed.',
        });
      },
    },
    dataUserRefetch: dataUserRefetch,
    token: dataUser?.accessToken.token,
  });

  //Setting modal
  const [isModalVisible, setIsModalVisible] = UseState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    mutationUpdateContact.mutate({
      user_id: dataUser?.user._id,
      social_networks: socialNetworks,
      phone: infoContact.phone,
      country: infoContact.country,
      city: infoContact.city,
      street: infoContact.street,
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Head>
        <title>Profile</title>
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

      <Card
        title={<span>View Profile</span>}
        className="card-b shadow-l"
        style={{
          background: 'white',
        }}
        extra={
          <Button className="color-3" type="link" onClick={showModal}>
            Edit Info Contact
          </Button>
        }
      >
        <Space direction="vertical" size={20}>
          <Row wrap={!lg} gutter={[30, 30]}>
            <Col flex={lg ? '400px' : undefined} span={lg ? undefined : 24}>
              <Space size={20} direction="vertical">
                <Space size={20} wrap>
                  <Space align="end" size={20}>
                    <Image
                      alt="avatar_user"
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
                          <CameraOutlined />
                          <span
                            style={{
                              marginLeft: 10,
                            }}
                          >
                            Edit Avatar
                          </span>
                        </label>
                        <input
                          onChange={onChangeAvatar}
                          hidden
                          id="upload_avatar"
                          type={'file'}
                          accept="image/x-png,image/gif,image/jpeg"
                        />
                      </Tooltip>
                    </Space>
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
                  >
                    {dataUser?.user?.name}
                  </span>
                  <span>{dataUser?.user?.role}</span>
                </div>

                <span>Employee info</span>
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

                <span>Basic contact info</span>
                <ItemInfor
                  title="Phone"
                  content={dataUser?.user.phone ? `+${dataUser.user.phone}` : undefined}
                />
                <ItemInfor
                  title="Address"
                  content={`${dataUser?.user?.country} - ${dataUser?.user?.city} - ${dataUser?.user?.street}`}
                />

                <span>Social network</span>
                <Space size={20}>
                  {dataUser?.user.social_networks &&
                    dataUser?.user.social_networks.map((socialUrl) => (
                      <SocialIcon
                        key={socialUrl}
                        url={socialUrl}
                        style={{
                          width: 30,
                          height: 30,
                        }}
                      />
                    ))}
                </Space>
              </Space>
            </Col>
            <Col flex={'auto'}>
              {dataUser?.user.role != 'admin' && !staticUser?.data ? (
                <Spin>
                  <Space
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  ></Space>
                </Spin>
              ) : (
                <Row gutter={[20, 20]}>
                  {staticUser?.data.map((item, key: number) => (
                    <StaticUser label={item.label} count={item.count} icon={item.icon} key={key} />
                  ))}
                </Row>
              )}
            </Col>
          </Row>
        </Space>
      </Card>

      <Modal
        title="Update info contact"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Space direction="vertical" size={20}>
          <Space direction="vertical">
            <label>Phone Number:</label>
            <PhoneInput
              country={'us'}
              value={infoContact.phone}
              onChange={(phone: string) =>
                setInfoContact({
                  ...infoContact,
                  phone: phone,
                })
              }
              inputStyle={{
                width: '100%',
              }}
            />
          </Space>
          <Space direction="vertical">
            <label>Country:</label>
            <Input
              value={infoContact.country}
              onChange={(e) =>
                setInfoContact({
                  ...infoContact,
                  country: e.target.value,
                })
              }
              placeholder="Enter your country"
            />
          </Space>
          <Space direction="vertical">
            <label>City:</label>
            <Input
              value={infoContact.city}
              onChange={(e) =>
                setInfoContact({
                  ...infoContact,
                  city: e.target.value,
                })
              }
              placeholder="Enter your city"
            />
          </Space>
          <Space direction="vertical">
            <label>Street:</label>
            <TextArea
              value={infoContact.street}
              onChange={(e) =>
                setInfoContact({
                  ...infoContact,
                  street: e.target.value,
                })
              }
              placeholder="Enter your street"
            />
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
  const detailCurrentUser: IDetailUser = await fetch(
    `${process.env.CLIENT_URL}/api/auth/accesstoken`,
    {
      method: 'GET',
      headers: {
        cookie: context.req.headers.cookie,
      } as HeadersInit,
    }
  ).then((e) => e.json());

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
