
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import { Link } from 'react-router-dom';
import TaskEditPanel from './TaskEditPanel';
import AddTaskPanel from './AddTaskPanel';

const GanttChart = () => {
  const [projects, setProjects] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [projectForNewTask, setProjectForNewTask] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleTaskSelect = (project, task) => {
    setSelectedProject(project);
    setSelectedTask(task);
  };

  const handleTaskSave = (updatedTask) => {
    const updatedProjects = projects.map(p => {
      if (p.id === selectedProject.id) {
        return { ...p, tasks: p.tasks.map(t => t.id === updatedTask.id ? updatedTask : t) };
      }
      return p;
    });
    setProjects(updatedProjects);
    setSelectedTask(null);
    setSelectedProject(null);
  };

  const handleAddTaskClick = (project) => {
    setProjectForNewTask(project);
    setShowAddTaskModal(true);
  };

  const handleNewTaskSave = (newTask) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectForNewTask.id) {
        return { ...p, tasks: [...p.tasks, newTask] };
      }
      return p;
    });
    setProjects(updatedProjects);
    setShowAddTaskModal(false);
    setProjectForNewTask(null);
  };

  const handleAddTaskCancel = () => {
    setShowAddTaskModal(false);
    setProjectForNewTask(null);
  };

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
      const startDate = new Date(task.startDate);
      const endDate = new Date(task.endDate);
      let duration = null;
      // Ensure dates are valid before calculating duration
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        duration = endDate.getTime() - startDate.getTime();
      }

      data.push([
        `${project.id}-${task.name}`,
        `${task.name} (${task.assignedUser})`,
        task.assignedUser,
        startDate,
        endDate,
        duration,
        task.progress || 0,
        null,
      ]);
    });
    return data;
  };

  return (
    <div style={{ padding: '20px' }}>
      {selectedTask && (
        <TaskEditPanel
          task={selectedTask}
          project={selectedProject}
          onSave={handleTaskSave}
          onCancel={() => setSelectedTask(null)}
        />
      )}
      {showAddTaskModal && projectForNewTask && (
        <AddTaskPanel
          project={projectForNewTask}
          onSave={handleNewTaskSave}
          onCancel={handleAddTaskCancel}
        />
      )}
      {projects.map(project => (
        <div key={project.id}>
          <h4 className="d-flex justify-content-between align-items-center">
            <Link to={`/project/${project.id}`} style={{ textDecoration: 'none' }}>{project.name}</Link>
            <button className="btn btn-primary btn-sm" onClick={() => handleAddTaskClick(project)}>Add Task</button>
          </h4>
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
              chartEvents={[
                {
                  eventName: 'select',
                  callback: ({ chartWrapper }) => {
                    const chart = chartWrapper.getChart();
                    const selection = chart.getSelection();
                    if (selection.length > 0) {
                      const rowIndex = selection[0].row;
                      const task = project.tasks[rowIndex];
                      handleTaskSelect(project, task);
                    }
                  },
                },
              ]}
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
