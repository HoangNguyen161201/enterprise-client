import { ConfigProvider } from 'antd';
import 'antd/dist/antd.variable.min.css';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { EmptyLayout } from 'components/layouts';
import { GlobalContextProvider } from 'contextApi/globalContext';
import { AppPropsWithLayout } from 'models/layoutType';
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
      
      <Layout>
        <GlobalContextProvider>
              <Component {...pageProps}/>
        </GlobalContextProvider>
      </Layout>
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  );
}

export default MyApp;
