import React from 'react'
import {Avatar, List as AntList} from 'antd'
import Link from 'next/link'
import { EyeOutlined } from '@ant-design/icons'
export const List = ({data, url, center = true }: {center?: boolean, data: {avatar: string, count: number, name?: string, email?: string }[], url: string}) => {
  return (
    <AntList 
    size="large"
    dataSource={data}
    renderItem={(item: any) => (
      <AntList.Item
        extra={
          <Link href={`${url}${item._id}`} passHref={true}>
            <a style={{
                paddingLeft: 15
            }}>
              <EyeOutlined />
            </a>
          </Link>
        }
        key={item.email || item.name }
      >
        <AntList.Item.Meta
          style={{
            display: 'flex',
            alignItems: center ? 'center': 'start',
          }}
          avatar={<Avatar size={'large'} src={item.avatar.url} />}
          title={<span className="font-3">{item.count}</span>}
          description={item.email || item.name + 'ffd gdf ddf fdffd dfddf df df'}
        />
      </AntList.Item>
    )}
  />
  )
}
