
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProjectsList = () => {
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

  const deleteProject = (id) => {
    axios.delete(`http://localhost:5000/api/projects/${id}`)
      .then(res => console.log(res.data));

    setProjects(projects.filter(el => el.id !== id));
  }

  return (
    <div>
      <h3>Projects</h3>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.description}</td>
              <td><button className="btn btn-primary btn-sm" onClick={() => window.location.href = `/project/${project.id}`}>Edit</button></td>
              <td><button className="btn btn-danger btn-sm" onClick={() => { deleteProject(project.id) }}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsList;
