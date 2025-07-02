
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [editProjectId, setEditProjectId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

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

  const handleEditClick = (project) => {
    setEditProjectId(project.id);
    setEditName(project.name);
    setEditDescription(project.description);
  };

  const handleSaveClick = (id) => {
    const updatedProject = { name: editName, description: editDescription };
    axios.post(`http://localhost:5000/api/projects/update/${id}`, updatedProject)
      .then(res => {
        console.log(res.data);
        setProjects(projects.map(project => 
          project.id === id ? { ...project, name: editName, description: editDescription } : project
        ));
        setEditProjectId(null);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleCancelClick = () => {
    setEditProjectId(null);
  };

  return (
    <div>
      <h3>Projects</h3>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Edit</th>
            <th>Task</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id}>
              <td>
                {editProjectId === project.id ? (
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                  />
                ) : (
                  project.name
                )}
              </td>
              <td>
                {editProjectId === project.id ? (
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editDescription} 
                    onChange={(e) => setEditDescription(e.target.value)} 
                  />
                ) : (
                  project.description
                )}
              </td>
              <td>
                {editProjectId === project.id ? (
                  <>
                    <button className="btn btn-success btn-sm me-2" onClick={() => handleSaveClick(project.id)}>Save</button>
                    <button className="btn btn-secondary btn-sm" onClick={handleCancelClick}>Cancel</button>
                  </>
                ) : (
                  <button className="btn btn-primary btn-sm" onClick={() => handleEditClick(project)}>Edit</button>
                )}
              </td>
              <td>
                <Link to={`/project/${project.id}`} className="btn btn-primary btn-sm">Task</Link>
              </td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => { deleteProject(project.id) }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsList;
