import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, message, Row } from 'antd';
import { AxiosError } from 'axios';
import { BreadCrumb, Category } from 'components/elements/common';
import ImportCSV from 'components/elements/common/ImportCSV';
import { DrawerCt } from 'components/elements/drawer';
import { ClientLayout } from 'components/layouts';
import { GlobalContext } from 'contextApi/globalContext';
import { IallCategories, ICommon, IDetailCategory, IDetailUser } from 'models/apiType';
import { NextPageWithLayout } from 'models/layoutType';
import { CtMutation } from 'mutations/category';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getCurrentUser } from 'queries/auth';
import { getallCategories } from 'queries/category';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { validCategory } from 'utils/validate';

export interface ICategoriesProps {
  allCategories: IallCategories;
}

const Categories: NextPageWithLayout = ({ allCategories }: ICategoriesProps) => {
  const { color } = useContext(GlobalContext);

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
  }, [statusForm, categoryUd, formSetting]);

  //  mutation call api to add Category
  const mutationAddCategory = CtMutation.add({
    dataUserRefetch: dataUserRefetch,
    token: dataUser?.accessToken.token,
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });
        setIsopen(false);
        rfCategories();
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Create Category false.',
        });
        setIsopen(false);
      },
    },
  });

  //  mutation call api to add many categories
  const mutationAddManyCategories = CtMutation.addMany({
    dataUserRefetch: dataUserRefetch,
    token: dataUser?.accessToken.token,
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });
        rfCategories();
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Create many Categories by import CSV false.',
        });
      },
    },
  });

  //  mutation call api to update Category
  const mutationUpdateCategory = CtMutation.update({
    dataUserRefetch: dataUserRefetch,
    token: dataUser?.accessToken.token,
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });
        setIsopen(false);
        rfCategories();
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Update Category false.',
        });
        setIsopen(false);
      },
    },
  });

  //  mutation call api to delete Category
  const mutationDeleteCategory = CtMutation.delete({
    dataUserRefetch: dataUserRefetch,
    token: dataUser?.accessToken.token,
    options: {
      onSuccess: (data: ICommon) => {
        message.success({
          content: data.msg,
        });
        rfCategories();
      },
      onError: (error: AxiosError) => {
        message.error({
          content: error.response?.data.err || 'Delete Category false.',
        });
      },
    },
  });

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
    //Post data add category
    mutationAddCategory.mutate(data);
  };

  //Function handle create new many categories
  const addManyCategories = async (categories: Partial<IDetailCategory> ) => {
    //Post data add category
    mutationAddManyCategories.mutate({
      categories
    });
  };

  //Function handle update category
  const updateCategory = async (data: IDetailCategory) => {
    mutationUpdateCategory.mutate(data);
  };

  //Function handle delete new category
  const deleteCategory = async (id: string) => {
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

      <BreadCrumb
        data={[{ url: '/', label: 'Home' }]}
        main={{ url: '/categories', label: 'Categories' }}
      />
      <Card
        extra={[
          <ImportCSV fieldsValid={["name", "description"]} onSubmit={addManyCategories} />,
          <Button
            key={'Add_ct'}
            type="link"
            onClick={() => {
              setStatusForm('create');
              setIsopen(true);
            }}
          >
            Add new
          </Button>,
        ]}
        title={<span className={`${color}`}>All Categories</span>}
        className="card-b"
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
  const detailUser: IDetailUser = await fetch(`http://localhost:3000/api/auth/accesstoken`, {
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
  if (detailUser.user.role !== 'admin' && detailUser.user.role !== 'qa_manager') {
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
