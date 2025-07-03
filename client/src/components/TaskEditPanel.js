import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskEditPanel = ({ task, project, onSave, onCancel }) => {
  const [taskName, setTaskName] = useState(task.name);
  const [startDate, setStartDate] = useState(task.startDate);
  const [endDate, setEndDate] = useState(task.endDate);
  const [duration, setDuration] = useState('');
  const [assignedUser, setAssignedUser] = useState(task.assignedUser);
  const [progress, setProgress] = useState(task.progress || 0);

  useEffect(() => {
    // Calculate initial duration when component mounts
    if (task.startDate && task.endDate) {
      const start = new Date(task.startDate);
      const end = new Date(task.endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setDuration(diffDays);
      }
    }
  }, [task.startDate, task.endDate]);

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
                <input type="date" className="form-control" value={startDate} onChange={handleStartDateChange} />
              </div>
              <div className="form-group mb-3">
                <label>End Date</label>
                <input type="date" className="form-control" value={endDate} onChange={handleEndDateChange} />
              </div>
              <div className="form-group mb-3">
                <label>Duration (days)</label>
                <input type="number" className="form-control" value={duration} onChange={handleDurationChange} />
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