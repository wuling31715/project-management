
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.description}</td>
              <td>
                <Link to={`/project/${project.id}`}>View</Link> | <a href="#" onClick={() => { deleteProject(project.id) }}>Delete</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsList;
