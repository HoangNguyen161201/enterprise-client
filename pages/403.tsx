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
        <title>403</title>
      </Head>
      <Result
        style={{
          justifyContent: 'center',
        }}
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
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
