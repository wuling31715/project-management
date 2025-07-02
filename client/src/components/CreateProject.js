
import React, { useState } from 'react';
import axios from 'axios';

const CreateProject = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();

    const project = {
      name: name,
      description: description
    }

    axios.post('http://localhost:5000/api/projects/add', project)
      .then(res => console.log(res.data));

    window.location = '/';
  }

  return (
    <div>
      <h3>Create New Project</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group mb-3">
          <label>Name: </label>
          <input type="text"
            required
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label>Description: </label>
          <input type="text"
            required
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <input type="submit" value="Create Project" className="btn btn-primary" />
        </div>
      </form>
    </div>
  )
}

export default CreateProject;
