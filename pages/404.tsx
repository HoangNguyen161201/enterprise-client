import { Button, Result } from 'antd';
import { GlobalContext } from 'contextApi/globalContext';
import Head from 'next/head';
import Link from 'next/link';
import { useContext as UseContext, useEffect as UseEffect } from 'react';

export default function notFound() {
  const { handleLightMode, handleLoadPage } = UseContext(GlobalContext);

  UseEffect(() => {
    handleLightMode();
    handleLoadPage(false)
  }, []);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        minHeight: 500,
        overflow: 'hidden',
      }}
    >
      <Head>
        <title>404</title>
      </Head>
      <Result
        style={{
          justifyContent: 'center',
        }}
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link href={'/'} passHref>
            <Button
              type="primary"
              style={{
                borderRadius: 5,
              }}
            >
              Back Home
            </Button>
          </Link>
        }
      />
    </div>
  );
}
