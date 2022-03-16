import { Card } from 'antd';
import { BreadCrumb, FilterIdeas } from 'components/elements/common';
import { ClientLayout } from 'components/layouts';
import { IDetailUser } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getCurrentUser } from 'queries';

const index: NextPageWithLayout = ({ detailUser }) => {
  const {
    data: dataUser,
    error: errorGetUser,
    refetch: dataUserRefetch,
  } = getCurrentUser(detailUser);

  return (
    <>
      <Head>
        <title>All Ideas</title>
      </Head>

      <BreadCrumb
        data={[
          {
            url: '/',
            label: 'Home',
          },
        ]}
        main={{
          url: '/ideas',
          label: '/All ideas',
        }}
      />

      <Card
        title="View All Ideas"
        className="card-b shadow-l"
        style={{
          background: 'white',
        }}
      >
        {dataUser && (
          <FilterIdeas
            accept
            detailUser={dataUser}
            page={1}
            limit={6}
            nameById={null}
            valueById={null}
            reaction={null}
            interactive={null}
            searchFirst=""
            search=""
            icon="👁"
            isFilterBySub
          />
        )}
      </Card>
    </>
  );
};

index.getLayout = ClientLayout;
export default index;

export const getServerSideProps: GetServerSideProps = async (context) => {
  //Check login
  const detailUser: IDetailUser = await fetch(`${process.env.CLIENT_URL}/api/auth/accesstoken`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  }).then((e) => e.json());

  //Redirect login page when error
  if (detailUser.statusCode !== 200) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  //Check role
  if (detailUser.user.role === 'admin') {
    return {
      redirect: {
        destination: '/403',
        permanent: false,
      },
    };
  }

  return {
    props: {
      detailUser,
    },
  };
};
