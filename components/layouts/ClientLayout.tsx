import { MenuOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import { useState } from 'react';
import { NextLayout } from '../../models/layoutType';
import {HeaderComponent} from '../elements/common';
import {Drawer} from '../elements/drawer';
const { Footer, Sider, Content } = Layout;

export const ClientLayout: NextLayout = ({ children }) => {
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
          <div
            style={{
              paddingTop: '20px',
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </>
  );
};
