import {
  AppstoreAddOutlined,
  AppstoreOutlined,
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

  return (
    <>
      <AntDrawer
        onClose={onClose}
        {...props}
        bodyStyle={{
          padding: '0px',
        }}
      >
        <Menu style={{ width: '100%', height: '100%' }} mode="inline">
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
              display:
                isShowByRole.staff ||
                isShowByRole.qa_coordinator ||
                isShowByRole.department_manager ||
                isShowByRole.qa_manager
                  ? 'block'
                  : 'none',
            }}
          >
            <Link href={'/my-department'}>
              <a>My Department</a>
            </Link>
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

          <Menu.Item
            key="3"
            icon={<UploadOutlined />}
            onClick={onClose}
            style={{
              display: isShowByRole.admin || isShowByRole.qa_manager ? 'block' : 'none',
            }}
          >
            <Link href={'/submissions'}>
              <a>Submissions</a>
            </Link>
          </Menu.Item>
          <Menu.Item
            key="4"
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
        </Menu>
      </AntDrawer>
    </>
  );
};
