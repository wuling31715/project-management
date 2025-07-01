
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

// Register a new user
router.route('/register').post((req, res) => {
  const db = readDb();
  const newUser = {
    id: Date.now(),
    ...req.body,
  };
  db.users.push(newUser);
  writeDb(db);
  res.json('User registered!');
});

// Login a user
router.route('/login').post((req, res) => {
  const db = readDb();
  const user = db.users.find(
    (u) => u.username === req.body.username && u.password === req.body.password
  );
  if (user) {
    res.json({ message: 'Logged in successfully', user });
  } else {
    res.status(400).json('Invalid credentials');
  }
});

module.exports = router;
