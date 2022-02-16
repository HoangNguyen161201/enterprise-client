import { NextLayout } from '../../models/layoutType';
import { Layout, Menu, Typography, Space, Button } from 'antd';
const { Footer, Sider, Content } = Layout;
import Header from '../elements/Header';
import { useState } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import Drawer from '../elements/Drawer';

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
      <Layout style={{
        maxWidth: 1600,
        marginInline: 'auto'
      }}>
        <Header />
        <Content
          style={{
            padding: '20px 40px',
            background: 'white',
          }}
        >
          <MenuOutlined onClick={showDrawer} style={{
            fontSize: "24px"
          }}/>
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
