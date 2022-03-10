import React, { useContext } from 'react'
import {Avatar, List as AntList} from 'antd'
import Link from 'next/link'
import { EyeOutlined } from '@ant-design/icons'
import { GlobalContext } from 'contextApi/globalContext'
export const List = ({data, url, center = true }: {center?: boolean, data: {avatar: string, count: number, name?: string, email?: string }[], url: string}) => {
  const {darkMode} = useContext(GlobalContext)
  return (
    <AntList className={darkMode ? 'shadow-l': 'shadow-d'}
    style={{
      background: 'white',
      borderRadius: 10,
      border:'3px solid #07456F50',
    }}
    size="large"
    dataSource={data}
    renderItem={(item: any) => (
      <AntList.Item
        extra={
          <Link href={`${url}${item._id}`} passHref={true}>
            <a style={{
                paddingLeft: 15
            }}>
              <EyeOutlined className='color-3' />
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
          avatar={<Avatar size={'large'} alt={item.email || item.name} style={{background: 'white'}} src={item.avatar.url} />}
          title={<span className={`font-3`}>{item.count}</span>}
          description={<span style={{color: 'gray'}}>{item.email || item.name}</span>}
        />
      </AntList.Item>
    )}
  />
  )
}
