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

// Get all users
router.route('/').get((req, res) => {
  const db = readDb();
  res.json(db.users);
});

module.exports = router;