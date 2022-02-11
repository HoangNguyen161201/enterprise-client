import '../styles/globals.css';
import { AppPropsWithLayout } from '../models/layoutType';
import { EmptyLayout } from '../components/layouts';
import 'antd/dist/antd.variable.min.css';
import { ConfigProvider } from 'antd';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const Layout = Component.getLayout || EmptyLayout;
  useEffect(() => {
    ConfigProvider.config({
      theme: {
        primaryColor: '#009F9D',
      },
    });
  }, []);
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
