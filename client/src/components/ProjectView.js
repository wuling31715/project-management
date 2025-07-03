import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return 'N/A';
  }
  // Add 1 to include both start and end dates in the duration
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

const ProjectView = () => {
  const [project, setProject] = useState({ tasks: [] });
  const [taskName, setTaskName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState('');
  const [assignedUser, setAssignedUser] = useState('');
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/projects/${id}`)
      .then(response => {
        setProject(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [id]);

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (duration) {
      const start = new Date(newStartDate);
      if (!isNaN(start.getTime())) {
        const end = new Date(start);
        end.setDate(start.getDate() + parseInt(duration, 10) - 1);
        setEndDate(end.toISOString().split('T')[0]);
      }
    } else if (endDate) {
      const start = new Date(newStartDate);
      const end = new Date(endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setDuration(diffDays);
      }
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    if (duration) {
      const end = new Date(newEndDate);
      if (!isNaN(end.getTime())) {
        const start = new Date(end);
        start.setDate(end.getDate() - parseInt(duration, 10) + 1);
        setStartDate(start.toISOString().split('T')[0]);
      }
    } else if (startDate) {
      const start = new Date(startDate);
      const end = new Date(newEndDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setDuration(diffDays);
      }
    }
  };

  const handleDurationChange = (e) => {
    const newDuration = e.target.value;
    setDuration(newDuration);
    if (newDuration && endDate) {
      const end = new Date(endDate);
      if (!isNaN(end.getTime())) {
        const start = new Date(end);
        start.setDate(end.getDate() - parseInt(newDuration, 10) + 1);
        setStartDate(start.toISOString().split('T')[0]);
      }
    }
  };

  const addTask = (e) => {
    e.preventDefault();
    const newTask = { id: Date.now(), name: taskName, startDate, endDate, assignedUser };
    const updatedProject = { ...project, tasks: [...project.tasks, newTask] };

    axios.post(`http://localhost:5000/api/projects/update/${id}`, updatedProject)
      .then(res => {
        console.log(res.data)
        setProject(updatedProject);
        setTaskName('');
        setStartDate('');
        setEndDate('');
        setDuration('');
        setAssignedUser('');
      });
  }

  const deleteTask = (taskId) => {
    axios.delete(`http://localhost:5000/api/projects/${id}/tasks/${taskId}`)
      .then(res => {
        console.log(res.data);
        const updatedProject = { ...project, tasks: project.tasks.filter(t => t.id !== taskId) };
        setProject(updatedProject);
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div>
      <h3>{project.name}</h3>
      <p>{project.description}</p>

      <h4>Add New Task</h4>
      <form onSubmit={addTask}>
        <div className="form-group mb-3">
          <label>Task Name: </label>
          <input type="text" required className="form-control" value={taskName} onChange={e => setTaskName(e.target.value)} />
        </div>
        <div className="form-group mb-3">
          <label>Start Date: </label>
          <input type="date" required className="form-control" value={startDate} onChange={handleStartDateChange} />
        </div>
        <div className="form-group mb-3">
          <label>End Date: </label>
          <input type="date" required className="form-control" value={endDate} onChange={handleEndDateChange} />
        </div>
        <div className="form-group mb-3">
          <label>Duration (days): </label>
          <input type="number" required className="form-control" value={duration} onChange={handleDurationChange} />
        </div>
        <div className="form-group mb-3">
          <label>Assign to: </label>
          <input type="text" required className="form-control" value={assignedUser} placeholder="Enter username" onChange={e => setAssignedUser(e.target.value)} />
        </div>
        <div className="form-group mb-3">
          <input type="submit" value="Add Task" className="btn btn-primary" />
        </div>
      </form>

      <h4>Tasks</h4>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Task Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Duration (days)</th>
            <th>Assigned To</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {project.tasks.sort((a, b) => {
            const startDateComparison = new Date(a.startDate) - new Date(b.startDate);
            if (startDateComparison === 0) {
              return new Date(a.endDate) - new Date(b.endDate);
            }
            return startDateComparison;
          }).map((task, index) => (
            <tr key={index}>
              <td>{task.name}</td>
              <td>{task.startDate}</td>
              <td>{task.endDate}</td>
              <td>{calculateDuration(task.startDate, task.endDate)}</td>
              <td>{task.assignedUser}</td>
              <td>
                <button onClick={() => deleteTask(task.id)} className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectView;
