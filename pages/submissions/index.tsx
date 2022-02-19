import { Breadcrumb, Card, Col, Drawer, Image, Row, Skeleton, Space } from 'antd';
import Head from 'next/head';
import React from 'react';
import { ClientLayout } from '../../components/layouts';
import { NextPageWithLayout } from '../../models';

const index: NextPageWithLayout = ()=> {
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
        extra={<a href="#">Clear</a>}
        style={{ width: '100%', marginTop: '20px', backgroundColor: 'transparent' }}

      >
        <Drawer>
          <Space direction="vertical">
            <Skeleton.Button
              style={{
                height: 235,
              }}
              active={true}
              size={'large'}
              shape={'square'}
              block={true}
            />
            <Skeleton.Button
              style={{
                height: 235,
              }}
              active={true}
              size={'large'}
              shape={'square'}
              block={true}
            />
            <Skeleton.Button
              style={{
                height: 235,
              }}
              active={true}
              size={'large'}
              shape={'square'}
              block={true}
            />
            <Skeleton.Button
              style={{
                height: 235,
              }}
              active={true}
              size={'large'}
              shape={'square'}
              block={true}
            />
            <Skeleton.Button
              style={{
                height: 235,
              }}
              active={true}
              size={'large'}
              shape={'square'}
              block={true}
            />
            <Skeleton.Button
              style={{
                height: 235,
              }}
              active={true}
              size={'large'}
              shape={'square'}
              block={true}
            />
          </Space>
        </Drawer>
        <Row gutter={[30, 30]}>
 
          <Col xl={8}>
            <Space direction="vertical" size={15}>
              <Image
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
}

index.getLayout = ClientLayout

export default index
