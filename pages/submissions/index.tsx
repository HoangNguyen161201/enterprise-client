import { yupResolver } from '@hookform/resolvers/yup';
import { Breadcrumb, Button, Card, Col, Drawer, Image, message, Row, Space } from 'antd';
import axios, { AxiosError } from 'axios';
import Head from 'next/head';
import { useEffect as UseEffect, useState as UseState } from 'react';
import { useForm as UseForm } from 'react-hook-form';
import { DateInput, Input, TextArea } from '../../components/elements';
import Skeletons from '../../components/elements/Skeletons';
import { ClientLayout } from '../../components/layouts';
import { ICommon, ISumission, NextPageWithLayout } from '../../models';
import { postData, validateSubmission } from '../../utils';
import moment from 'moment';
import { EditOutlined } from '@ant-design/icons';
import { useMutation as UseMutation } from 'react-query';
import { getCurrentUser } from '../../queries';

const index: NextPageWithLayout = () => {
  const [isOpen, setIsopen] = UseState(false);
  const [isOpenSlImg, setIsOpenSlImg] = UseState(false);
  const [imgs, setImgs] = UseState<string[] | null>(null);
  const [imgSubmission, setImgSubmission] = UseState(
    'https://res.cloudinary.com/hoang161201/image/upload/v1645274633/Group_92_grzovc.svg'
  );

  UseEffect(() => {
    if (!imgs && isOpenSlImg) {
      axios.get('/api/image/submissions').then((result) => {
        setImgs(result.data.imgs);
      });
    }
  }, [isOpenSlImg]);

  // setting form
  const formSetting = UseForm<ISumission>({
    resolver: yupResolver(validateSubmission),
    defaultValues: {
      name: '',
      description: '',
      closure_date: moment(),
      final_closure_date: moment(),
    },
  });

  const onSubmit = (value: ISumission) => {
    addSubmission.mutate(value);
  };

  //Get access token
  const { data: dataUser, error: errorGetUser, refetch: dataUserRefetch } = getCurrentUser();
  UseEffect(() => {
    dataUserRefetch();
  }, []);

  const addSubmission = UseMutation<any, AxiosError, ISumission>(
    (value) => {
      return postData({
        url: '/api/submissions',
        body: value,
        token: dataUser?.accessToken.token,
      });
    },
    {
      onSuccess: (data: ICommon) => {
        message.success(data.msg);
        setIsopen(false);
        formSetting.reset({
          name: '',
          description: '',
          closure_date: moment(),
          final_closure_date: moment(),
        });
        setImgSubmission(
          'https://res.cloudinary.com/hoang161201/image/upload/v1645274633/Group_92_grzovc.svg'
        );
      },
      onError: (result) => {
        message.error(result.response?.data.err);
        setIsopen(false);
      },
    }
  );

  return (
    <>
      <Head>
        <title>Add Submission Page</title>
      </Head>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Submission</Breadcrumb.Item>
        <Breadcrumb.Item>Add Submission</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="Add Submission"
        extra={[
          <Button key={'add_sumission'} onClick={() => setIsopen(true)} type="link">
            Add new
          </Button>,
        ]}
        style={{ width: '100%', marginTop: '20px', backgroundColor: 'transparent' }}
      >
        <Drawer
          title="Add new Submission"
          closable
          onClose={() => setIsopen(false)}
          visible={isOpen}
        >
          <Space size={20} direction="vertical">
            <Image
              alt={'img_submission'}
              onClick={() => setIsOpenSlImg(true)}
              preview={false}
              src={imgSubmission}
              style={{
                cursor: 'pointer',
              }}
            />
            <form onSubmit={formSetting.handleSubmit(onSubmit)}>
              <Space direction="vertical" size={20}>
                <Input
                  icon={<EditOutlined style={{ marginRight: 10, color: 'gray' }} />}
                  label="Name"
                  name="name"
                  formSetting={formSetting}
                  placeholder="Enter submission name"
                />
                <DateInput label="Closure date" name="closure_date" formSetting={formSetting} />
                <DateInput
                  label="Final closure date"
                  name="final_closure_date"
                  formSetting={formSetting}
                />
                <TextArea label="Description" name="description" formSetting={formSetting} />
                <Button disabled={addSubmission.isLoading} htmlType="submit" type="primary">
                  Save
                </Button>
              </Space>
            </form>
          </Space>
        </Drawer>

        <Drawer title="Images" closable onClose={() => setIsOpenSlImg(false)} visible={isOpenSlImg}>
          <Space direction="vertical">
            {imgs ? (
              imgs.map((item, key) => (
                <Image
                  alt={`img_${key}`}
                  style={{
                    cursor: 'pointer',
                  }}
                  preview={false}
                  onClick={() => {
                    setImgSubmission(item);
                    setIsOpenSlImg(false);
                  }}
                  loading="lazy"
                  src={item}
                  key={key}
                />
              ))
            ) : (
              <Skeletons />
            )}
          </Space>
        </Drawer>
        <Row gutter={[30, 30]}>
          <Col xl={8}>
            <Space direction="vertical" size={15}>
              <Image
                alt="submission_df"
                style={{
                  background: 'white',
                }}
                preview={false}
                src="https://res.cloudinary.com/hoang161201/image/upload/v1645254094/image/shopping-2194208-0_kenboc.svg"
              />
              <div>
                <span
                  className="font-3"
                  style={{
                    fontWeight: 'bold',
                    display: 'block',
                  }}
                >
                  Title 1
                </span>
                <span style={{ color: 'gray' }}>
                  nguywn q efw wes sdfsd sd sdf sdfsd f sdf sdf fdgdf g fdgd dfgdf sdf s sd sdf
                </span>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>
    </>
  );
};

index.getLayout = ClientLayout;

export default index;
