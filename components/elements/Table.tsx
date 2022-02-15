import React from 'react';
import { Button, Table as AntTable, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';

export default function Table() {
  const dataSource = [
    {
      key: '1ddf',
      name: 'Mike',
      age: 32,
      address: '10 dfdfdfdf',
      tag: ['1', '2'],
    },
    {
      key: '2fgdfgfffffdg',
      name: 'Mike',
      age: 32,
      address: '10 dfdfdfdf',
    },
    {
        key: '2sfsdf',
        name: 'Mike',
        age: 32,
        address: '10 dfdfdfdf',
      },
      {
        key: '2sfsdfsdf',
        name: 'Mike',
        age: 32,
        address: '10 dfdfdfdf',
      },
      {
        key: '2xvcxcvx',
        name: 'Mike',
        age: 32,
        address: '10 dfdfdfdf',
      },
      {
        key: '2xcvxv',
        name: 'Mike',
        age: 32,
        address: '10 dfdfdfdf',
      },
      {
        key: '2xxvxv',
        name: 'Mike',
        age: 32,
        address: '10 dfdfdfdf',
      },
      {
        key: '2fgfgfg',
        name: 'Mike',
        age: 32,
        address: '10 dfdfdfdf',
      },
      {
        key: '2fgfg',
        name: 'Mike',
        age: 32,
        address: '10 dfdfdfdf',
      },
      {
        key: '2fgf',
        name: 'Mike',
        age: 32,
        address: '10 dfdfdfdf',
      },
      {
        key: 'sfsdfsd',
        name: 'Mike',
        age: 32,
        address: '10 dfdfdfdf',
      },
      {
        key: '2ererer',
        name: 'Mike',
        age: 32,
        address: '10 dfdfdfdf',
      },
      {
        key: '2sdtere',
        name: 'Mike',
        age: 32,
        address: '10 dfdfdfdf',
      },
      {
        key: '2vsdss',
        name: 'Mike',
        age: 32,
        address: '10 dfdfdfdf',
      },
      {
        key: '2dfccc',
        name: 'Mike',
        age: 32,
        address: '10 dfdfdfdf',
      },
      {
        key: '2ssd',
        name: 'Mike',
        age: 32,
        address: '10 dfdfdfdf',
      },
      {
        key: '2fgfg',
        name: 'Mike',
        age: 32,
        address: '10 dfdfdfdf',
      },
      {
        key: '2fgfg',
        name: 'Mike',
        age: 32,
        address: '10 dfdfdfdf',
      },
      {
        key: '211',
        name: 'Mike',
        age: 32,
        address: '10 dfdfdfdf',
      },
  ];

  const columns: ColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Button type={'primary'}>{text}</Button>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      dataIndex: 'tag',
      key: 'tag',
      render: (tags) => (
        <>
          {tags && tags.map((tag: any) => (
            <Tag color={'cyan'} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
    },
  ];
  return (
    <div>
      <AntTable rowSelection={{
          type: 'checkbox',
          onChange: (value)=> {
              console.log(value)
          }

      }} dataSource={dataSource} columns={columns} />
    </div>
  );
}
