import { Layout, Grid, Spin } from 'antd';
import { NextLayout } from 'models/layoutType';
import { BreadCrumb, HeaderComponent } from 'components/elements/common';
import { useContext } from 'react';
import { GlobalContext } from 'contextApi/globalContext';
const { Content } = Layout;
export const ClientLayout: NextLayout = ({ children }) => {
  const { bgColor } = useContext(GlobalContext);
  const { useBreakpoint } = Grid;
  const { md } = useBreakpoint();
  const {loadPage} = useContext(GlobalContext)

  return (
    <Spin spinning={loadPage}>
      <div
        className={`${bgColor}`}
        style={{
          minHeight: '100vh',
        }}
      >
        <Layout
          style={{
            maxWidth: 1600,
            marginInline: 'auto',
          }}
          className="layout"
        >
          <HeaderComponent />
          <Content
            className={`${bgColor}`}
            style={{
              padding: md ? '20px 40px' : '20px',
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
      </div>
    </Spin>
  );
};
