import { KeyOutlined } from '@ant-design/icons';
import { Col, Space, Grid } from 'antd';

interface ICardStatic {
    title: string
    description: string
    icon: any
    count: number
    borderR?: boolean
}

export const CardStatic = ({title, description, icon, count, borderR = true}: ICardStatic) => {
  const {useBreakpoint} = Grid
  const {md} = useBreakpoint()
  return (
    <Col
      span={24}
      md={8}
      style={{
        borderRight: borderR ? '1px solid #FFFFFF30': '',
        paddingInline: md ?20: 0,
      }}
    >
      <Space size={'small'} direction="vertical">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              color: !md ? 'black': 'white',
            }}
            className="font-2"
          >
            {title}
          </span>
          {icon}
        </div>
        <Space size={5} direction="vertical">
          <span
            style={{
              fontWeight: 'bold',
              color: !md ? '#07456F': 'white',
            }}
            className="font-3"
          >
            {count}
          </span>
          <span
            style={{
              color: !md ? '#b9b9b9': '#FFFFFF50',
            }}
            className="font-1"
          >
            {
                description
            }
          </span>
        </Space>
      </Space>
    </Col>
  );
};
