import { FileTextOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Breadcrumb, Button, Card, Drawer, message, Row, Space } from 'antd';
import { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Input, TextArea } from '../../components/elements';
import Category from '../../components/elements/Category';
import DrawerCt from '../../components/elements/DrawerCt';
import { ClientLayout } from '../../components/layouts';
import { IallCategories, ICategoryForm, IDetailCategory } from '../../models';
import { NextPageWithLayout } from '../../models/layoutType';
import { getCurrentUser } from '../../queries';
import { getallCategories } from '../../queries/category';
import { deleteData, postData, putData, validCategory } from '../../utils';

export interface ICategoriesProps {
  allCategories: IallCategories;
}

const Categories: NextPageWithLayout = ({ allCategories }: ICategoriesProps) => {
  console.log(allCategories)
  const [categoryUd, setCategoryUd] = useState<IDetailCategory | null | undefined>(null);
  const [statusForm, setStatusForm] = useState<'create' | 'update'>('create');
  const [isOpen, setIsopen] = useState(false);

  // setting form
  const formSetting = useForm<IDetailCategory>({
    resolver: yupResolver(validCategory),
    defaultValues: {
      _id: '',
      name: '',
      description: '',
    },
  });

  // submit login
  const onSubmit = (values: IDetailCategory) => {
    switch (statusForm) {
      case 'update':
        updateCategory({
          ...values,
          id: values._id,
        });
        break;
      case 'create':
        addCategory(values);
        break;
    }
  };

  // open drawer
  const openDrawer = (data?: IDetailCategory) => {
    if (data) {
      setCategoryUd(data);
      setStatusForm('update');
    } else {
      setStatusForm('create');
    }
    setIsopen(true);
  };

  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();

  //Get all data categories
  const {
    error: errorAllCategories,
    data: dataAllCategories,
    refetch: rfCategories,
  } = getallCategories(dataUser?.accessToken.token, allCategories);

  //Check exist and show error
  useEffect(() => {
    if (errorAllCategories) {
      message.error({
        content: errorAllCategories.response?.data.err,
      });
    }
  }, [errorAllCategories]);

  //Check exist and show error
  useEffect(() => {
    if (statusForm == 'create') {
      formSetting.reset({
        name: '',
        description: '',
        _id: '',
      });
    }

    if (statusForm == 'update') {
      formSetting.reset({
        name: categoryUd?.name || '',
        description: categoryUd?.description || '',
        _id: categoryUd?._id || '',
      });
    }
  }, [statusForm, categoryUd]);

  //  mutation call api to add Category
  const mutationAddCategory = useMutation<any, AxiosError, ICategoryForm>(
    (dataForm) => {
      return postData({
        url: '/api/categories',
        body: dataForm,
        token: dataUser?.accessToken.token,
      });
    },
    {
      onSuccess: (data) => {
        message.success({
          content: data.msg,
        });
        setIsopen(false);
        rfCategories();
      },
      onError: (error) => {
        message.error({
          content: error.response?.data.err || 'Create Category false.',
        });
        setIsopen(false);
      },
    }
  );

  //  mutation call api to update Category
  const mutationUpdateCategory = useMutation<any, AxiosError, ICategoryForm>(
    ({ id, name, description }) => {
      return putData({
        url: `/api/categories/${id}`,
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
        setIsopen(false);
        rfCategories();
      },
      onError: (error) => {
        message.error({
          content: error.response?.data.err || 'Update Category false.',
        });
        setIsopen(false);
      },
    }
  );

  //  mutation call api to delete Category
  const mutationDeleteCategory = useMutation<any, AxiosError, ICategoryForm>(
    ({ id }) => {
      return deleteData({
        url: `/api/categories/${id}`,
        token: dataUser?.accessToken.token,
      });
    },
    {
      onSuccess: (data) => {
        message.success({
          content: data.msg,
        });
        rfCategories();
      },
      onError: (error) => {
        message.error({
          content: error.response?.data.err || 'Delete Category false.',
        });
      },
    }
  );

  //Check exist and show error
  useEffect(() => {
    if (errorGetUser) {
      message.error({
        content: errorGetUser.response?.data.err,
      });
    }
  }, [errorGetUser]);

  //Function handle create new category
  const addCategory = async (data: IDetailCategory) => {
    //Refetch again let get accesstoken pass to api
    await dataUserRefetch();

    //Post data add category
    mutationAddCategory.mutate(data);
  };

  //Function handle update new category
  const updateCategory = async (data: IDetailCategory) => {
    //Refetch again let get accesstoken pass to api
    await dataUserRefetch();

    //Put data update category
    mutationUpdateCategory.mutate(data);
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

      <DrawerCt
        title={statusForm == 'create' ? 'Add new category' : 'Update category'}
        isLoading={
          statusForm == 'create' ? mutationAddCategory.isLoading : mutationUpdateCategory.isLoading
        }
        onSubmit={onSubmit}
        statusForm={statusForm}
        isOpen={isOpen}
        formSetting={formSetting}
        setIsopen={(isOpen: boolean) => setIsopen(isOpen)}
      />

      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Categories</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        extra={[
          <Button
            type="link"
            onClick={() => {
              setStatusForm('create');
              setIsopen(true);
            }}
          >
            Add new
          </Button>,
        ]}
        title="All Categories"
        style={{ width: '100%', marginTop: '20px' }}
      >
        <Row gutter={[30, 30]}>
          {dataAllCategories?.categories &&
            dataAllCategories?.categories.map((category: IDetailCategory, key: number) => (
              <Category
                data={category}
                openDrawer={openDrawer}
                deleteCategory={deleteCategory}
                key={category._id}
              />
            ))}
        </Row>
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
  const allCategories: IallCategories = await fetch(`http://localhost:3000/api/categories`, {
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
