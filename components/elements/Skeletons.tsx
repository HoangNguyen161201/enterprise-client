import { Skeleton, Space } from 'antd';
import React from 'react';

export default function Skeletons() {
  return (
    <Space direction='vertical'>
      <Skeleton.Button
        style={{
          height: 235,
          borderRadius: 10
        }}
        active={true}
        size={'large'}
        shape={'square'}
        block={true}
      />
      <Skeleton.Button
        style={{
          height: 235,
          borderRadius: 10
        }}
        active={true}
        size={'large'}
        shape={'square'}
        block={true}
      />
      <Skeleton.Button
        style={{
          height: 235,
          borderRadius: 10
        }}
        active={true}
        size={'large'}
        shape={'square'}
        block={true}
      />
      <Skeleton.Button
        style={{
          height: 235,
          borderRadius: 10
        }}
        active={true}
        size={'large'}
        shape={'square'}
        block={true}
      />
      <Skeleton.Button
        style={{
          height: 235,
          borderRadius: 10
        }}
        active={true}
        size={'large'}
        shape={'square'}
        block={true}
      />
      <Skeleton.Button
        style={{
          height: 235,
          borderRadius: 10
        }}
        active={true}
        size={'large'}
        shape={'square'}
        block={true}
      />
    </Space>
  );
}
