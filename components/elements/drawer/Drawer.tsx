import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  CloseOutlined,
  CloudUploadOutlined,
  FolderViewOutlined,
  HomeOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Drawer as AntDrawer, Menu } from 'antd';
import Link from 'next/link';
import { useEffect as UseEffect, useState as UseState } from 'react';
import { getCurrentUser } from 'queries/auth';
import { useContext } from 'react';
import { GlobalContext } from 'contextApi/globalContext';

const { SubMenu } = Menu;

interface IsShowMenuItem {
  staff: boolean;
  qa_coordinator: boolean;
  admin: boolean;
  qa_manager: boolean;
  department_manager: boolean;
}

interface IProps {
  onClose: () => void;
  [index: string]: any;
}

export const Drawer = ({ onClose, ...props }: IProps) => {
  //State Show Menu Item
  const [isShowByRole, setIsShowByRole] = UseState<IsShowMenuItem>({
    staff: false,
    qa_coordinator: false,
    admin: false,
    qa_manager: false,
    department_manager: false,
  });

  //Get data current user
  const { data: dataUser } = getCurrentUser();

  //Set show menu item by role
  UseEffect(() => {
    if (dataUser && dataUser.user) {
      let valueSetIsShowItem: IsShowMenuItem = isShowByRole;

      switch (dataUser.user.role) {
        case 'staff':
          valueSetIsShowItem = {
            staff: true,
            qa_coordinator: false,
            admin: false,
            qa_manager: false,
            department_manager: false,
          };
          break;
        case 'admin':
          valueSetIsShowItem = {
            staff: false,
            qa_coordinator: false,
            admin: true,
            qa_manager: false,
            department_manager: false,
          };
          break;
        case 'qa_manager':
          valueSetIsShowItem = {
            staff: false,
            qa_coordinator: false,
            admin: false,
            qa_manager: true,
            department_manager: false,
          };
          break;
        case 'qa_coordinator':
          valueSetIsShowItem = {
            staff: false,
            qa_coordinator: true,
            admin: false,
            qa_manager: false,
            department_manager: false,
          };
          break;
        case 'department_manager':
          valueSetIsShowItem = {
            staff: false,
            qa_coordinator: false,
            admin: false,
            qa_manager: false,
            department_manager: true,
          };
          break;
        default:
          break;
      }

      setIsShowByRole(valueSetIsShowItem);
    }
  }, [dataUser]);

  const {darkMode} = useContext(GlobalContext)

  return (
    <>
      <AntDrawer
        closeIcon={<CloseOutlined style={{
          color: darkMode ? 'white': '#001529'
        }} />}
        headerStyle={{
          background: darkMode ? '#001529': 'white',
        }}
        onClose={onClose}
        {...props}
        title={<span style={{
          color: darkMode ? 'white': '#001529'
        }}>{props.title}</span>}
        bodyStyle={{
          padding: '0px',
        }}
      >
        <Menu theme={darkMode ? 'dark': 'light'} style={{ width: '100%', height: '100%' }} mode="inline">
          <Menu.Item key="1" icon={<HomeOutlined />} onClick={onClose}>
            <Link href={'/'}>
              <a>Home</a>
            </Link>
          </Menu.Item>

          <Menu.Item
            key="2"
            icon={<TeamOutlined />}
            onClick={onClose}
            style={{
              display: isShowByRole.qa_manager ? 'block' : 'none',
            }}
          >
            <Link href={'/dashboard'}>
              <a>Dashboard</a>
            </Link>
          </Menu.Item>

          {/* <Menu.Item
            key="3"
            icon={<TeamOutlined />}
            onClick={onClose}
            style={{
              display: isShowByRole.admin ? 'none' : 'block',
            }}
          >
            <Link href={'/my-department'}>
              <a>My Department</a>
            </Link>
          </Menu.Item> */}

          <SubMenu
            key="sub1"
            icon={<TeamOutlined />}
            title="Departments"
            style={{
              display: isShowByRole.admin || isShowByRole.qa_manager ? 'block' : 'none',
            }}
          >
            <Menu.Item key="sub1-1" icon={<FolderViewOutlined />} onClick={onClose}>
              <Link href={'/departments'}>
                <a>All Departments</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="sub1-2" icon={<AppstoreAddOutlined />} onClick={onClose}>
              <Link href={'/departments/add'}>
                <a>Add Department</a>
              </Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="sub2"
            icon={<UserOutlined />}
            title="Employees"
            style={{
              display: isShowByRole.admin || isShowByRole.qa_manager ? 'block' : 'none',
            }}
          >
            <Menu.Item key="sub2-1" icon={<FolderViewOutlined />} onClick={onClose}>
              <Link href={'/employees'}>
                <a>All Employees</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="sub2-2" icon={<AppstoreAddOutlined />} onClick={onClose}>
              <Link href={'/employees/add'}>
                <a>Add Employees</a>
              </Link>
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="4" icon={<UploadOutlined />} onClick={onClose}>
            <Link href={'/submissions'}>
              <a>Submissions</a>
            </Link>
          </Menu.Item>

          <Menu.Item
            key="5"
            icon={<AppstoreOutlined />}
            onClick={onClose}
            style={{
              display: isShowByRole.admin || isShowByRole.qa_manager ? 'block' : 'none',
            }}
          >
            <Link href={'/categories'}>
              <a>Categories</a>
            </Link>
          </Menu.Item>

          <Menu.Item
            key="6"
            icon={<CloudUploadOutlined />}
            onClick={onClose}
            style={{
              display: isShowByRole.qa_manager ? 'block' : 'none',
            }}
          >
            <Link href={'/management-idea'}>
              <a>Manage Ideas</a>
            </Link>
          </Menu.Item>

          <Menu.Item
            key="7"
            icon={<CloudUploadOutlined />}
            onClick={onClose}
            style={{
              display: isShowByRole.qa_manager ? 'block' : 'none',
            }}
          >
            <Link href={'/ideas'}>
              <a>Ideas</a>
            </Link>
          </Menu.Item>
        </Menu>
      </AntDrawer>
    </>
  );
};
