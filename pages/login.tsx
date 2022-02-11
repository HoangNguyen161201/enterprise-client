import { NextPageWithLayout } from '../models';
import { Button } from 'antd';
import Head from 'next/head';

const login: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title> Login </title>
      </Head>
      <div>
        <Button>nguyen</Button>
      </div>
    </>
  );
};

export default login;
