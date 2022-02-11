import '../styles/globals.css';
import { AppPropsWithLayout } from '../models/layoutType';
import { EmptyLayout } from '../components/layouts';
import 'antd/dist/antd.min.css'

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const Layout = Component.getLayout || EmptyLayout;
  return (
    <Layout>
      <Component {...pageProps}/>
    </Layout>
  );
}

export default MyApp;
