import { MenuOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import { useState } from 'react';
import { NextLayout } from '../../models/layoutType';
import {HeaderComponent} from '../elements/common';
import {Drawer} from '../elements/drawer';
const { Footer, Sider, Content } = Layout;

export const ClientLayout: NextLayout = ({ children }) => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
  };

  return (
    <>
      <Layout
        style={{
          maxWidth: 1600,
          marginInline: 'auto',
        }}
        className='layout'
      >
        <HeaderComponent />
        <Content
          style={{
            padding: '20px 40px',
            background: 'white',
          }}
        >
          <MenuOutlined
            onClick={showDrawer}
            style={{
              fontSize: '24px',
            }}
          />
          <div
            style={{
              paddingTop: '20px',
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
      <Drawer
        visible={visible}
        title="Task selection"
        onClose={closeDrawer}
        placement="left"
        closable={true}
        key="left"
      />
    </>
  );
};
