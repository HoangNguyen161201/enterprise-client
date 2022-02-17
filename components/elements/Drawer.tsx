import {
  AppstoreAddOutlined,
  FolderViewOutlined,
  HomeOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Drawer, Menu } from 'antd';
import { resolveSrv } from 'dns/promises';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../../queries';

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

export default function DrawerComponent({ onClose, ...props }: IProps) {
  //State Show Menu Item
  const [isShowByRole, setIsShowByRole] = useState<IsShowMenuItem>({
    staff: false,
    qa_coordinator: false,
    admin: false,
    qa_manager: false,
    department_manager: false,
  });

  //Get data current user
  const { data: dataUser } = getCurrentUser();

  //Set show menu item by role
  useEffect(() => {
    if (dataUser && dataUser.user) {
      let valueSetIsShowItem: IsShowMenuItem = isShowByRole;
      console.log(dataUser.user.role);

      switch (dataUser.user.role) {
        case 'staff':
          valueSetIsShowItem = {
            ...valueSetIsShowItem,
            staff: true,
          };
          break;
        case 'admin':
          valueSetIsShowItem = {
            ...valueSetIsShowItem,
            admin: true,
          };
          break;
        case 'qa_manager':
          valueSetIsShowItem = {
            ...valueSetIsShowItem,
            qa_manager: true,
          };
          break;
        case 'qa_coordinator':
          valueSetIsShowItem = {
            ...valueSetIsShowItem,
            qa_coordinator: true,
          };
          break;
        case 'department_manager':
          valueSetIsShowItem = {
            ...valueSetIsShowItem,
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
      <Drawer
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
          <SubMenu
            key="sub1"
            icon={<TeamOutlined />}
            title="Departments"
            style={{
              display: isShowByRole.admin ? 'block' : 'none',
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
        </Menu>
      </Drawer>
    </>
  );
}
