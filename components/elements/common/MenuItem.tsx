import { Menu } from 'antd';
import Link from 'next/link';
import {useEffect as UseEffect, useState as UseState} from 'react';
import { getCurrentUser } from '../../../queries';

export interface IMenuItemProps {
  key: string;
  title: string;
  href: string;
  role: string[];
  isPublic: boolean;
  [index: string]: any;
}

export const MenuItem = ({ key, title, href, role, isPublic, ...props }: IMenuItemProps) => {
  const [isShow, setIsShow] = UseState(false);

  //Get current User
  const { data: dataUser } = getCurrentUser();

  UseEffect(() => {
    if (dataUser) {
      let valueSetIsShow = false;

      //Check role
      role.forEach((role) => {
        if (dataUser.user?.role === role) {
          valueSetIsShow = true;
        }
      });

      setIsShow(valueSetIsShow);
    }
  }, [dataUser]);

  return (
    <>
      <Menu.Item
        key={key}
        {...props}
      >
        <Link href={href}>
          <a>{title}</a>
        </Link>
      </Menu.Item>
    </>
  );
}
