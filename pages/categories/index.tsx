import { Breadcrumb, Button, Card, message, Row, Space } from 'antd';
import { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import * as React from 'react';
import { useMutation } from 'react-query';
import Category from '../../components/elements/Category';
import { ClientLayout } from '../../components/layouts';
import { IallCategories, ICategoryForm, IDetailCategory } from '../../models';
import { NextPageWithLayout } from '../../models/layoutType';
import { getCurrentUser } from '../../queries';
import { getallCategories } from '../../queries/category';
import { deleteData, postData, putData } from '../../utils';

export interface ICategoriesProps {
  allCategories: IallCategories;
}

const Categories: NextPageWithLayout = ({ allCategories }: ICategoriesProps) => {
  //Data all categories
  console.log(allCategories);

  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();

  //Get all data categories
  const { error: errorAllCategories, data: dataAllCategories, refetch: rfCategories } = getallCategories(
    dataUser?.accessToken.token,
    allCategories
  );

  //Check exist and show error
  React.useEffect(() => {
    if (errorAllCategories) {
      message.error({
        content: errorAllCategories.response?.data.err,
      });
    }
  }, [errorAllCategories]);

  //  mutation call api to add Category
  const mutationAddCategory = useMutation<any, AxiosError, ICategoryForm>(
    (dataForm) => {
      return postData({
        url: '/api/category',
        body: dataForm,
        token: dataUser?.accessToken.token,
      });
    },
    {
      onSuccess: (data) => {
        message.success({
          content: data.msg,
        });
      },
      onError: (error) => {
        message.error({
          content: error.response?.data.err || 'Create Category false.',
        });
      },
    }
  );

  //  mutation call api to update Category
  const mutationUpdateCategory = useMutation<any, AxiosError, ICategoryForm>(
    ({ id, name, description }) => {
      return putData({
        url: `/api/category/${id}`,
        body: {
          name,
          description,
        },
        token: dataUser?.accessToken.token,
      });
    },
    {
      onSuccess: (data) => {
        message.success({
          content: data.msg,
        });
      },
      onError: (error) => {
        message.error({
          content: error.response?.data.err || 'Update Category false.',
        });
      },
    }
  );

  //  mutation call api to delete Category
  const mutationDeleteCategory = useMutation<any, AxiosError, ICategoryForm>(
    ({ id }) => {
      return deleteData({
        url: `/api/category/${id}`,
        token: dataUser?.accessToken.token,
      });
    },
    {
      onSuccess: (data) => {
        message.success({
          content: data.msg,
        });
        rfCategories()
      },
      onError: (error) => {
        message.error({
          content: error.response?.data.err || 'Delete Category false.',
        });
      },
    }
  );

  //Check exist and show error
  React.useEffect(() => {
    if (errorGetUser) {
      message.error({
        content: errorGetUser.response?.data.err,
      });
    }
  }, [errorGetUser]);

  //Function handle create new category
  const addCategory = async () => {
    //Refetch again let get accesstoken pass to api
    await dataUserRefetch();

    //Post data add category
    mutationAddCategory.mutate({
      name: 'Nguyen',
      description: 'Nguyen Quang Huy Nguyen Quang Huy',
    });
  };

  //Function handle update new category
  const updateCategory = async () => {
    //Refetch again let get accesstoken pass to api
    await dataUserRefetch();

    //Put data update category
    mutationUpdateCategory.mutate({
      id: '620f4ccfd337af08ff3cbfa6',
      name: 'Nguyen huy',
      description: 'Nguyen Quang Huy Nguyen Quang Huy',
    });
  };

  //Function handle delete new category
  const deleteCategory = async (id: string) => {
    //Refetch again let get accesstoken pass to api
    await dataUserRefetch();

    //Delete category
    mutationDeleteCategory.mutate({
      id,
    });
  };

  return (
    <>
      <Head>
        <title>All Categories Page</title>
      </Head>

      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Categories</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="All Categories"
        style={{ width: '100%', marginTop: '20px' }}
      >
        <Row gutter={[30, 30]}>
          {dataAllCategories?.category &&
            dataAllCategories?.category.map((category: IDetailCategory, key: number) => (
              <Category data={category} deleteCategory={deleteCategory} key={category._id} />
            ))}
        </Row>
        <Space direction="vertical" size={20}>
          <Button type="primary" onClick={addCategory}>
            Add new categories
          </Button>
          <Button type="primary" onClick={updateCategory}>
            Update categories
          </Button>
        </Space>
      </Card>
    </>
  );
};

export default Categories;

Categories.getLayout = ClientLayout;

export const getServerSideProps: GetServerSideProps = async (context) => {
  //Check login
  const res = await fetch('http://localhost:3000/api/auth/accesstoken', {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  });

  const data = await res.json();

  //Redirect login page when error
  if (res.status !== 200) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  //Check role
  if (data.user.role !== 'admin') {
    return {
      notFound: true,
    };
  }

  //Get all data categories
  const allCategories: IallCategories = await fetch(`http://localhost:3000/api/category`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
    } as HeadersInit,
  }).then((e) => e.json());

  return {
    props: {
      allCategories,
    },
  };
};
