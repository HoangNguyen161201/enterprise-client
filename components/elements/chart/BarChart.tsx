import {
  BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title,
  Tooltip
} from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';

interface IBarChart {
  labels: string[]
  data: number[]
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const BarChart = ({labels, data}: IBarChart) => {
  return (
    <Bar
      options={{
        maintainAspectRatio: false,
        aspectRatio: 3,
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
            label: 'Ideas of department by date',
            data,
            backgroundColor: '#009F9D',
            maxBarThickness: 80,
            borderRadius: 10,
          },
        ],
      }}
    />
  );
};
