import { Col, Grid, Space } from 'antd';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
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
  const {useBreakpoint} = Grid
  const {lg, xs} = useBreakpoint()
  return (
    <Col span={24} sm={12} md={12} lg={24}>
      <span className="font-1" style={{ color: 'gray' }}>
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
    </Col>
  );
};
