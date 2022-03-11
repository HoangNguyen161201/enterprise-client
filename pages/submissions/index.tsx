import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Card as AntCard,
  DatePicker,
  Input,
  message,
  Pagination,
  Row,
  Space
} from 'antd';
import axios, { AxiosError } from 'axios';
import { BreadCrumb, Card } from 'components/elements/common';
import { DrawerImg, DrawerSubm } from 'components/elements/drawer';
import { ClientLayout } from 'components/layouts';
import { GlobalContext } from 'contextApi/globalContext';
import { ICommon, IDetailUser, ISubmission, ISubmissions } from 'models/apiType';
import { ISubmissionForm } from 'models/formType';
import { NextPageWithLayout } from 'models/layoutType';
import moment from 'moment';
import { submMutation } from 'mutations/submission';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getallSubmissions, getCurrentUser } from 'queries';
import { useContext as UseContext, useEffect as UseEffect, useState as UseState } from 'react';
import { useForm as UseForm } from 'react-hook-form';
import { validateSubmission } from 'utils/validate';

interface submisionPage {
  result: ISubmissions;
  detailUser: IDetailUser;
}
const index: NextPageWithLayout = ({ result, detailUser }: submisionPage) => {

  const [isOpen, setIsopen] = UseState(false);
  const [isOpenSlImg, setIsOpenSlImg] = UseState(false);
  const [imgs, setImgs] = UseState<string[] | null>(null);
  const [page, setPage] = UseState<number>(1);
  const [search, setSearch] = UseState('');
  const [searchFirst, setSearchFirst] = UseState('');
  const [date, setDate] = UseState('');
  const [searchDate, setSearchDate] = UseState<any>(null);
  const [submissionUd, setSubmissionUd] = UseState<ISubmissionForm | null | undefined>(null);
  const [statusForm, setStatusForm] = UseState<'create' | 'update'>('create');
  const [imgSubmission, setImgSubmission] = UseState(
    'https://res.cloudinary.com/hoang161201/image/upload/v1645274633/Group_92_grzovc.svg'
  );
  let timeOutSearch: NodeJS.Timeout, timeOutSearchTime: NodeJS.Timeout;

  // darkmode
  const { color, handleLoadPage} = UseContext(GlobalContext);

  UseEffect(()=> {
    handleLoadPage(false)
  }, [])

  const [idDelete, setIdDelete] = UseState('');
  UseEffect(() => {
    timeOutSearch = setTimeout(() => {
      setSearch(searchFirst);
      setPage(1);
    }, 1000);
    return () => clearTimeout(timeOutSearch);
  }, [searchFirst]);

  UseEffect(() => {
    timeOutSearchTime = setTimeout(() => {
      setDate(searchDate);
      setPage(1);
    }, 1000);
    return () => clearTimeout(timeOutSearchTime);
  }, [searchDate]);

  // setting form
  const formSetting = UseForm<ISubmissionForm>({
    resolver: yupResolver(validateSubmission),
    defaultValues: {
      _id: '',
      name: '',
      description: '',
      closure_date: moment(),
      final_closure_date: moment(),
    },
  });

  const onSubmit = (value: ISubmissionForm) => {
    switch (statusForm) {
      case 'create':
        addSubmission.mutate({
          ...value,
          background: imgSubmission,
        });
        break;
      case 'update':
        updateSubmission.mutate({
          ...value,
          background: imgSubmission,
        });
        break;
    }
  };

  UseEffect(() => {
    if (!imgs && isOpenSlImg) {
      axios.get('/api/image/submissions').then((result) => {
        setImgs(result.data.imgs);
      });
    }
  }, [isOpenSlImg]);

  UseEffect(() => {
    if (!isOpen) {
      setImgSubmission(
        'https://res.cloudinary.com/hoang161201/image/upload/v1645274633/Group_92_grzovc.svg'
      );
      setStatusForm('create');
      formSetting.reset({
        _id: '',
        name: '',
        description: '',
        closure_date: moment(),
        final_closure_date: moment(),
      });
    }
  }, [isOpen, formSetting]);

  UseEffect(() => {
    if (statusForm == 'update') {
      formSetting.reset({
        _id: submissionUd?._id,
        name: submissionUd?.name,
        description: submissionUd?.description,
        closure_date: submissionUd?.closure_date,
        final_closure_date: submissionUd?.final_closure_date,
      });
    }
  }, [statusForm]);

  //Get access token
  const {
    data: dataUser,
    error: errorGetUser,
    refetch: dataUserRefetch,
  } = getCurrentUser(detailUser);

  // get all submission
  const {
    error: errorSubmission,
    data: dataSubmissions,
    refetch: RefetchSubmisssion,
  } = getallSubmissions(dataUser?.accessToken.token, result, {
    _page: page,
    _search: search,
    _time: date,
  });

  const addSubmission = submMutation.add({
    dataUserRefetch: dataUserRefetch,
    options: {
      onSuccess: (data: ICommon) => {
        message.success(data.msg);
        setIsopen(false);
        RefetchSubmisssion();
      },
      onError: (result: AxiosError) => {
        message.error(result.response?.data.err);
        setIsopen(false);
      },
    },
    token: dataUser?.accessToken.token,
  });

  const updateSubmission = submMutation.update({
    dataUserRefetch: dataUserRefetch,
    options: {
      onSuccess: (data: ICommon) => {
        message.success(data.msg);
        setIsopen(false);
        RefetchSubmisssion();
      },
      onError: (result: AxiosError) => {
        message.error(result.response?.data.err);
        setIsopen(false);
      },
    },
    token: dataUser?.accessToken.token,
  });

  const deleteSubmission = submMutation.delete({
    dataUserRefetch: dataUserRefetch,
    options: {
      onSuccess: (data: ICommon) => {
        message.success(data.msg);
        setIsopen(false);
        RefetchSubmisssion();
      },
      onError: (result: AxiosError) => {
        message.error(result.response?.data.err);
        setIsopen(false);
      },
    },
    token: dataUser?.accessToken.token,
  });

  // more to show drawer to update anh delete
  const more = (item: ISubmissionForm) => {
    setStatusForm('update');
    setIsopen(true);
    setSubmissionUd({
      _id: item._id,
      name: item.name,
      closure_date: moment(item.closure_date),
      final_closure_date: moment(item.final_closure_date),
      description: item.description,
    });
    setImgSubmission(item.background);
    setIdDelete(item._id as string);
  };

  return (
    <>
      <Head>
        <title>All Submissions</title>
      </Head>
      <BreadCrumb data={[{url: '/', label: 'Home'}]} main={{label: 'Submissions', url: '/submissions'}}/>
      <AntCard
        title={<span className={`${color}`}>Submissions</span>}
        extra={
          <Space size={15} key={'func_submission'}>
            <Button key={'add_sumission'} onClick={() => setIsopen(true)} type="link">
              Add new
            </Button>
            <Input
              placeholder="Search by name"
              style={{ borderRadius: 5 }}
              value={searchFirst}
              onChange={(event) => {
                setSearchFirst(event.target.value);
              }}
            />
            <DatePicker
              style={{ borderRadius: 5 }}
              format="YYYY-MM-DD HH:mm:ss"
              showTime
              showToday
              onChange={(value) => {
                setSearchDate(moment(value).toISOString());
              }}
            />
          </Space>
        }
        className='card-b shadow-l'
      >
        <DrawerSubm
          imgSubmission={imgSubmission}
          isDelete={deleteSubmission.isLoading}
          onSubmit={onSubmit}
          deleteSubm={() => deleteSubmission.mutate(idDelete)}
          openDrawerImg={() => setIsOpenSlImg(true)}
          isLoading={statusForm == 'create' ? addSubmission.isLoading : updateSubmission.isLoading}
          formSetting={formSetting}
          isOpen={isOpen}
          statusForm={statusForm}
          close={() => setIsopen(false)}
        />

        <DrawerImg
          imgs={imgs}
          isOpen={isOpenSlImg}
          close={() => setIsOpenSlImg(false)}
          setImg={(item) => {
            setImgSubmission(item);
            setIsOpenSlImg(false);
          }}
        />

        <Space direction="vertical" size={'large'}>
          <Row gutter={[30, 30]}>
            {dataSubmissions?.submissions &&
              dataSubmissions?.submissions.map((item: ISubmission) => (
                <Card
                  item={item}
                  more={more}
                  key={item._id}
                  current_user={dataUser as IDetailUser}
                />
              ))}
          </Row>
          <Space direction="vertical" align="end">
            {dataSubmissions?.page_Index && (
              <Pagination
              
                onChange={(pageSl) => {
                  setPage(pageSl);
                }}
                current={page}
                responsive
                pageSize={1}
                total={dataSubmissions.page_Index}
              />
            )}
          </Space>
        </Space>
      </AntCard>
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

  //Get all data users
  const result: ISubmissions = await fetch(`${process.env.CLIENT_URL}/api/submissions?_page=1`, {
    method: 'GET',
    headers: {
      cookie: context.req.headers.cookie,
      authorization: detailUser.accessToken.token,
    } as HeadersInit,
  }).then((e) => e.json());

  return {
    props: {
      result,
      detailUser,
    },
  };
};
