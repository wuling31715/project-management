
const router = require('express').Router();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');

// Helper function to read the database
const readDb = () => {
  const db = fs.readFileSync(dbPath);
  return JSON.parse(db);
};

// Helper function to write to the database
const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Get all projects
router.route('/').get((req, res) => {
  const db = readDb();
  res.json(db.projects);
});

// Add a new project
router.route('/add').post((req, res) => {
  const db = readDb();
  const newProject = {
    id: Date.now(),
    ...req.body,
    tasks: [],
  };
  db.projects.push(newProject);
  writeDb(db);
  res.json('Project added!');
});

// Get a project by id
router.route('/:id').get((req, res) => {
  const db = readDb();
  const project = db.projects.find((p) => p.id === parseInt(req.params.id));
  res.json(project);
});

// Delete a project
router.route('/:id').delete((req, res) => {
  let db = readDb();
  db.projects = db.projects.filter((p) => p.id !== parseInt(req.params.id));
  writeDb(db);
  res.json('Project deleted.');
});

// Update a project
router.route('/update/:id').post((req, res) => {
  let db = readDb();
  let project = db.projects.find((p) => p.id === parseInt(req.params.id));
  if (project) {
    Object.assign(project, req.body);
    writeDb(db);
    res.json('Project updated!');
  } else {
    res.status(404).json('Project not found');
  }
});

module.exports = router;
