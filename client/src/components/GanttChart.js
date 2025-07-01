
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';

const GanttChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then(response => {
        const projects = response.data;
        const data = [
          [
            {
              type: 'string',
              label: 'Task ID',
            },
            {
              type: 'string',
              label: 'Task Name',
            },
            {
              type: 'date',
              label: 'Start Date',
            },
            {
              type: 'date',
              label: 'End Date',
            },
            {
              type: 'number',
              label: 'Duration',
            },
            {
              type: 'number',
              label: 'Percent Complete',
            },
            {
              type: 'string',
              label: 'Dependencies',
            },
          ],
        ];

        projects.forEach(project => {
          project.tasks.forEach(task => {
            data.push([
              `${project.id}-${task.name}`,
              task.name,
              new Date(task.startDate),
              new Date(task.endDate),
              null,
              0,
              null,
            ]);
          });
        });

        setChartData(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h3>Project Schedule</h3>
      <Chart
        width={'100%'}
        height={'400px'}
        chartType="Gantt"
        loader={<div>Loading Chart</div>}
        data={chartData}
        options={{
          height: 400,
          gantt: {
            trackHeight: 30,
          },
        }}
      />
    </div>
  );
};

export default GanttChart;
