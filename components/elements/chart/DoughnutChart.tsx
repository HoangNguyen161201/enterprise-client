import { Col, Space } from 'antd';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { GlobalContext } from 'contextApi/globalContext';
import { useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


interface IDoughnutChart {
  data: number[]
  labels: string[]
  backgrounds: string[]
  title: string
  size: number
}

export const DoughnutChart = ({ size, data, backgrounds, labels, title }: IDoughnutChart) => {
  const {desColor} = useContext(GlobalContext)
  return (
    <Col span={24} sm={12} md={12} lg={24}>
      <Space direction='vertical' size={10}>
        <span className= {`font-1 ${desColor}`} style={{ color: 'gray' }}>
          {title}
        </span>

        <Doughnut
          data={{
            labels,
            datasets: [
              {
                data,
                backgroundColor: backgrounds,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
                align: 'start',
                fullSize: true,
              },
            },
          }}
        />
      </Space>
    </Col>
  );
};
