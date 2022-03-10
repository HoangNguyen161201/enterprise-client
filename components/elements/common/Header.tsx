import { LogoutOutlined, MenuOutlined, ProfileOutlined, TeamOutlined } from '@ant-design/icons';
import { Avatar, Button, Divider, Dropdown, Grid, Layout, Menu, message, Space, Switch } from 'antd';
import { GlobalContext } from 'contextApi/globalContext';
import { ILogout } from 'models/apiType';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getCurrentUser } from 'queries/auth';
import { useContext, useState } from 'react';
import { useMutation } from 'react-query';
import { postData } from 'utils/fetchData';
import { Drawer } from '../drawer';
import { BsMoon, BsSun } from 'react-icons/bs';

const { Header } = Layout;

export const HeaderComponent = () => {
  const { darkMode, toggleDarkMode, bgColor, color, color2 } = useContext(GlobalContext);

  const {useBreakpoint: UseBreakpoint} = Grid
  const {md} = UseBreakpoint()

  //Setting drawer
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
  };

  //Get data current user
  const { data: dataUser } = getCurrentUser();

  const { push } = useRouter();

  //Mutation logout
  const logoutMutation = useMutation<ILogout>(
    () => {
      return postData({
        url: '/api/auth/logout',
      });
    },
    {
      onSuccess: (data) => {
        message.success({
          content: data.msg,
        });
        localStorage.removeItem('first-login');
        push('/login', undefined, { shallow: true });
      },
    }
  );

  //Handle logout
  const onLogout = () => {
    logoutMutation.mutate();
  };

  //Elemen menu
  const menu = (
    <Menu
      style={{
        padding: 20,
        borderRadius: 10,
      }}
    >
      <Space
        size={20}
        style={{
          paddingInline: 10,
        }}
      >
        <Avatar
          size="large"
          style={{
            border: '1px solid #009F9D',
            background: 'white',
          }}
          src={dataUser?.user?.avatar?.url}
        />

        <span>{dataUser?.user?.name}</span>
      </Space>
      <Divider />
      <Menu.Item icon={<ProfileOutlined />} key="1">
        <Link href={'/profile'}>
          <a>Profile</a>
        </Link>
      </Menu.Item>
      {dataUser && dataUser.user.role !== 'admin' && (
        <Menu.Item icon={<TeamOutlined />} key="2">
          <Link href={'/my-department'}>
            <a>My Department</a>
          </Link>
        </Menu.Item>
      )}
      <Menu.Item icon={<LogoutOutlined />} key="3" onClick={onLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <Header
        className={`${bgColor}`}
        style={{
          padding: md? '0px 40px': '0px 20px',
          zIndex: '1',
          borderBottom: '1px solid #efefef',
        }}
      >
        <Space
          style={{
            justifyContent: 'space-between',
            display: 'flex',
          }}
        >
          <Space size={20} align="center">
            <span
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#009F9D',
              }}
            >
              <Link href={'/'}>
                <a className={`cms ${color}`}>CMS</a>
              </Link>
            </span>

            <MenuOutlined
              className={`${color}`}
              onClick={showDrawer}
              style={{
                fontSize: '20px',
              }}
            />
          </Space>
          <Space size={15}>
            <Switch
              aria-label='darkMode'
              checked={darkMode}
              onChange={(checked) => {
                toggleDarkMode();
              }}
              checkedChildren={
                <BsSun
                  className={`${color2}`}
                  style={{
                    paddingTop: 4,
                  }}
                  size={17}
                />
              }
              unCheckedChildren={
                <BsMoon
                  className={`${color2}`}
                  style={{
                    paddingTop: 4,
                  }}
                  size={17}
                />
              }
              defaultChecked
            />
            {dataUser ? (
              <Dropdown overlay={menu} trigger={['click', 'hover']} placement="bottomRight">
                <Space
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  <Avatar
                    alt='avatar'
                    style={{
                      border: '1px solid #009F9D',
                      background: 'white',
                    }}
                    src={dataUser.user?.avatar?.url}
                  />
                </Space>
              </Dropdown>
            ) : (
              <Button
                type="primary"
                style={{
                  borderRadius: '5px',
                }}
              >
                <Link href={'/login'} passHref>
                  <a>Login</a>
                </Link>
              </Button>
            )}
          </Space>
        </Space>

        <Drawer
          visible={visible}
          title="Task selection"
          onClose={closeDrawer}
          placement="left"
          closable={true}
          key="left"
        />
      </Header>
    </>
  );
};
