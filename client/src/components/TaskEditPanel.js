import React, { useState } from 'react';
import axios from 'axios';

const TaskEditPanel = ({ task, project, onSave, onCancel }) => {
  const [taskName, setTaskName] = useState(task.name);
  const [startDate, setStartDate] = useState(task.startDate);
  const [endDate, setEndDate] = useState(task.endDate);
  const [assignedUser, setAssignedUser] = useState(task.assignedUser);
  const [progress, setProgress] = useState(task.progress || 0);

  const handleProgressChange = (e) => {
    const value = Math.max(0, Math.min(100, Number(e.target.value)));
    setProgress(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTask = { ...task, name: taskName, startDate, endDate, assignedUser, progress: Number(progress) };
    axios.put(`http://localhost:5000/api/projects/${project.id}/tasks/${task.id}`, updatedTask)
      .then(res => {
        onSave(updatedTask);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const contentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '500px',
  };

  return (
    <div style={modalStyle} onClick={onCancel}>
      <div style={contentStyle} onClick={e => e.stopPropagation()}>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Edit Task</h5>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label>Task Name</label>
                <input type="text" className="form-control" value={taskName} onChange={e => setTaskName(e.target.value)} />
              </div>
              <div className="form-group mb-3">
                <label>Start Date</label>
                <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div className="form-group mb-3">
                <label>End Date</label>
                <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
              <div className="form-group mb-3">
                <label>Assigned To</label>
                <input type="text" className="form-control" value={assignedUser} onChange={e => setAssignedUser(e.target.value)} />
              </div>
              <div className="form-group mb-3">
                <label>Progress</label>
                <input type="number" className="form-control" value={progress} min="0" max="100" onChange={handleProgressChange} />
              </div>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-secondary ms-2" onClick={onCancel}>Cancel</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskEditPanel;
