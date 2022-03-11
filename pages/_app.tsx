import { ConfigProvider } from 'antd';
import 'antd/dist/antd.variable.min.css';
import { EmptyLayout } from 'components/layouts';
import { GlobalContext, GlobalContextProvider } from 'contextApi/globalContext';
import { AppPropsWithLayout } from 'models/layoutType';
import { useContext, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import '../styles/globals.css';

function MyApp({ Component, pageProps, router }: AppPropsWithLayout) {
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
    <QueryClientProvider client={queryClient}>
      <GlobalContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GlobalContextProvider>
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  );
}

export default MyApp;
