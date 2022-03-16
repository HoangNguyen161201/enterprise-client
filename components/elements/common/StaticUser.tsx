import { Col, Space } from 'antd'
import { IStaticUser } from 'models/elementType'
import React from 'react'

export const StaticUser = ({count, icon, label}: IStaticUser) => {
  return (
    <Col span={24} xl={8} md={12}>
    <Space direction='vertical' align='start' style={{
      background: '#07456F',
      height: 150,
      width: '100%',
      borderRadius: 10,
      padding: 20,
      overflow: 'hidden',
      position: 'relative',
      boxShadow: '36px 23px 46px -9px rgba(0,0,0,0.06)',
    }}>
      <span style={{
        color: '#FFFFFF80'
      }}>{label}</span>
      <h2 className='font-5' style={{
        fontWeight: 'bold',
        color: 'white'
      }}>{count}</h2>
      <span style={{
        fontSize: 100,
        color: '#FFFFFF80',
        position: 'absolute',
        bottom: -40,
        right: -30,
        transform: 'rotate(-45deg)'
      }}>{icon}</span>
    </Space>
  </Col>
  )
}
