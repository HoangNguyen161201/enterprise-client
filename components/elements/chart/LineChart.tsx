import {
    CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title,
    Tooltip
} from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ILineChart {
  labels: number[];
  data: number[];
}
export const LineChart = ({ labels, data }: ILineChart) => {
 
  return (
    <Line
      options={{
        backgroundColor: 'white',
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
      }}
      data={{
        labels,
        datasets: [
          {
            label: 'Idea',
            data,
            backgroundColor: '#07456F',
            borderColor: '#07456F50',
            cubicInterpolationMode: 'monotone',
          },
        ],
      }}
    />
  );
};
