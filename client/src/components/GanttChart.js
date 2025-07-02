
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import { Link } from 'react-router-dom';

const GanttChart = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const getChartData = (project) => {
    const data = [
      [
        { type: 'string', label: 'Task ID' },
        { type: 'string', label: 'Task Name (Assigned User)' },
        { type: 'string', label: 'Resource' },
        { type: 'date', label: 'Start Date' },
        { type: 'date', label: 'End Date' },
        { type: 'number', label: 'Duration' },
        { type: 'number', label: 'Percent Complete' },
        { type: 'string', label: 'Dependencies' },
      ],
    ];

    project.tasks.forEach(task => {
      data.push([
        `${project.id}-${task.name}`,
        `${task.name} (${task.assignedUser})`,
        task.assignedUser,
        new Date(task.startDate),
        new Date(task.endDate),
        null,
        0,
        null,
      ]);
    });
    return data;
  };

  return (
    <div>
      {/* <h3>Project Schedules</h3> */}
      {projects.map(project => (
        <div key={project.id}>
          <h4><Link to={`/project/${project.id}`}>{project.name}</Link></h4>
          {project.tasks.length > 0 ? (
            <Chart
              width={'100%'}
              chartType="Gantt"
              loader={<div>Loading Chart</div>}
              data={getChartData(project)}
              options={{
                height: project.tasks.length * 50 + 50, // Adjust height based on number of tasks
                gantt: {
                  trackHeight: 50,
                },
              }}
            />
          ) : (
            <p>No tasks for this project.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default GanttChart;
