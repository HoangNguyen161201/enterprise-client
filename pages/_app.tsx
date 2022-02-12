import '../styles/globals.css';
import 'antd/dist/antd.variable.min.css';
import { AppPropsWithLayout } from '../models/layoutType';
import { EmptyLayout } from '../components/layouts';
import { ConfigProvider } from 'antd';
import { useEffect, useState } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { GlobalContextProvider } from '../contextApi/globalContext';

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // create layout
  const Layout = Component.getLayout || EmptyLayout;

  // Create a client
  const [queryClient] = useState(new QueryClient());
  useEffect(() => {
    ConfigProvider.config({
      theme: {
        primaryColor: '#009F9D',
      },
    });
  }, []);
  return (
    <Layout>
      <QueryClientProvider client={queryClient}>
        <GlobalContextProvider>
          <Component {...pageProps} />
        </GlobalContextProvider>
        <ReactQueryDevtools position="bottom-right" />
      </QueryClientProvider>
    </Layout>
  );
}

export default MyApp;
