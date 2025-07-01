import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProjectsList from './components/ProjectsList';
import CreateProject from './components/CreateProject';
import ProjectView from './components/ProjectView';
import GanttChart from './components/GanttChart';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<ProjectsList />} />
          <Route path="/create" element={<CreateProject />} />
          <Route path="/project/:id" element={<ProjectView />} />
          <Route path="/gantt" element={<GanttChart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;