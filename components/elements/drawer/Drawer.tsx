import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  CloseOutlined,
  CloudUploadOutlined,
  FolderViewOutlined,
  HomeOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Drawer as AntDrawer, Grid, Menu } from 'antd';
import { GlobalContext } from 'contextApi/globalContext';
import { getCurrentUser } from 'queries/auth';
import { useContext, useEffect as UseEffect, useState as UseState } from 'react';
import { LinkSpin } from '../common';

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
  const { useBreakpoint: UseBreakpoint } = Grid;
  const { sm } = UseBreakpoint();

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

  const { darkMode } = useContext(GlobalContext);

  return (
    <>
      <AntDrawer
        width={sm ? undefined : '100%'}
        closeIcon={
          <CloseOutlined
            style={{
              color: darkMode ? 'white' : '#001529',
            }}
          />
        }
        headerStyle={{
          background: darkMode ? '#001529' : 'white',
        }}
        onClose={onClose}
        {...props}
        title={
          <span
            style={{
              color: darkMode ? 'white' : '#001529',
            }}
          >
            {props.title}
          </span>
        }
        bodyStyle={{
          padding: '0px',
        }}
      >
        <Menu
          theme={darkMode ? 'dark' : 'light'}
          style={{ width: '100%', height: '100%' }}
          mode="inline"
        >
          <Menu.Item key="1" icon={<HomeOutlined />} onClick={onClose}>
            <LinkSpin url={'/'} name="Home" />
          </Menu.Item>

          <Menu.Item
            key="2"
            icon={<TeamOutlined />}
            onClick={onClose}
            style={{
              display: isShowByRole.qa_manager ? 'block' : 'none',
            }}
          >
            <LinkSpin url={'/dashboard'} name="Dashboard" />
          </Menu.Item>

          <SubMenu
            key="sub1"
            icon={<TeamOutlined />}
            title="Departments"
            style={{
              display: isShowByRole.admin || isShowByRole.qa_manager ? 'block' : 'none',
            }}
          >
            <Menu.Item key="sub1-1" icon={<FolderViewOutlined />} onClick={onClose}>
              <LinkSpin url={'/departments'} name="All Departments" />
            </Menu.Item>
            <Menu.Item key="sub1-2" icon={<AppstoreAddOutlined />} onClick={onClose}>
              <LinkSpin url={'/departments/add'} name="Add Department" />
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
              <LinkSpin url={'/employees'} name="All Employees" />
            </Menu.Item>
            <Menu.Item key="sub2-2" icon={<AppstoreAddOutlined />} onClick={onClose}>
              <LinkSpin url={'/employees/add'} name="Add Employees" />
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="4" icon={<UploadOutlined />} onClick={onClose}>
            <LinkSpin url={'/submissions'} name="Submissions" />
          </Menu.Item>

          <Menu.Item
            key="5"
            icon={<AppstoreOutlined />}
            onClick={onClose}
            style={{
              display: isShowByRole.admin || isShowByRole.qa_manager ? 'block' : 'none',
            }}
          >
            <LinkSpin url={'/categories'} name="Categories" />
          </Menu.Item>

          <Menu.Item
            key="6"
            icon={<CloudUploadOutlined />}
            onClick={onClose}
            style={{
              display: isShowByRole.qa_manager ? 'block' : 'none',
            }}
          >
            <LinkSpin url={'/management-idea'} name="Manage Ideas" />
          </Menu.Item>

          <Menu.Item
            key="7"
            icon={<CloudUploadOutlined />}
            onClick={onClose}
            style={{
              display: !isShowByRole.admin ? 'block' : 'none',
            }}
          >
            <LinkSpin url={'/ideas'} name="Ideas" />
          </Menu.Item>
        </Menu>
      </AntDrawer>
    </>
  );
};
