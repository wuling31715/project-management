import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ProjectsList from './components/ProjectsList';
import CreateProject from './components/CreateProject';
import ProjectView from './components/ProjectView';
import GanttChart from './components/GanttChart';
import Navbar from './components/Navbar';

const AppContent = () => {
  const location = useLocation();
  const isGanttPage = location.pathname === '/gantt';

  return (
    <>
      <Navbar />
      <div className={isGanttPage ? '' : 'container mt-4'}>
        <Routes>
          <Route path="/" element={<ProjectsList />} />
          <Route path="/create" element={<CreateProject />} />
          <Route path="/project/:id" element={<ProjectView />} />
          <Route path="/gantt" element={<GanttChart />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;