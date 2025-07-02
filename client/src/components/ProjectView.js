import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProjectView = () => {
  const [project, setProject] = useState({ tasks: [] });
  const [taskName, setTaskName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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
          <input type="date" required className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className="form-group mb-3">
          <label>End Date: </label>
          <input type="date" required className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
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
            <th>Assigned To</th>
            <th>Actions</th>
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