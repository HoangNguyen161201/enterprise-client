import { EyeOutlined } from '@ant-design/icons';
import { Button, Col, Image, Space } from 'antd';
import { IStaff } from 'models/elementType';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useContext } from 'react';
import { GlobalContext } from 'contextApi/globalContext';

export const User = ({ image, name, role, employee_id, xs, sm, lg, xl, id }: IStaff) => {
  const {color2} = useContext(GlobalContext)
  return (
    <Col xs={xs} sm={sm} lg={lg} xl={xl}>
      <motion.div
        whileHover={{
          scale: 1.1,
          border: '2px solid #009F9D',
        }}
        whileTap={{
          scale: 1,
          border: '0px solid #009F9D30',
        }}
        style={{
          width: '100%',
          borderRadius: 10,
          position: 'relative',
          padding: 20,
          boxShadow: '36px 23px 46px -9px rgba(0,0,0,0.06)',
          border: '3px solid white',
          background: 'white'
        }}
      >
        <Image
          alt={name}
          width={'100%'}
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: 8,
            overflow: 'hidden',
          }}
          height={100}
          src={image}
        />
        <Space direction="vertical" size={0} style={{ marginTop: 10 }}>
          <h2 className="font-2">{name}</h2>
          <p>{`epl-${employee_id}`}</p>
          <Space
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: -10,
            }}
          >
            <span style={{ color: 'gray' }}>{role}</span>
            <Link href={`/employees/detail/${id}`} passHref>
              <Button shape="circle" type="primary" icon={<EyeOutlined className={`${color2}`}/>} />
            </Link>
          </Space>
        </Space>
      </motion.div>
    </Col>
  );
};
