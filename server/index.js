
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import routes
const projectsRouter = require('./routes/projects');
const usersRouter = require('./routes/users');

// Use routes
app.use('/api/projects', projectsRouter);
app.use('/api/users', usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
