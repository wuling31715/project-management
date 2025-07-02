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

      <h4>Tasks</h4>
      <ul>
        {project.tasks.map((task, index) => (
          <li key={index}>
            {task.name} (Start: {task.startDate}, End: {task.endDate}, Assigned to: {task.assignedUser})
            <button onClick={() => deleteTask(task.id)} className="btn btn-danger btn-sm ml-2">Delete</button>
          </li>
        ))}
      </ul>

      <h4>Add New Task</h4>
      <form onSubmit={addTask}>
        <div className="form-group">
          <label>Task Name: </label>
          <input type="text" required className="form-control" value={taskName} onChange={e => setTaskName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Start Date: </label>
          <input type="date" required className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>End Date: </label>
          <input type="date" required className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Assign to: </label>
          <input type="text" required className="form-control" value={assignedUser} placeholder="Enter username" onChange={e => setAssignedUser(e.target.value)} />
        </div>
        <div className="form-group">
          <input type="submit" value="Add Task" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
};

export default ProjectView;