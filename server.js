const path = require('path');
const express = require('express');
const cors = require('cors');

require('dotenv').config();
const port = process.env.PORT || 5000;
const connectDB = require('./config/db');

connectDB();
const app = express();

// CORS Middleware
app.use(
  cors({
    origin: ['http://localhost:5000', 'http://localhost:3000'],
  })
);

// Middleware Making the public folder static
app.use(express.static(path.join(__dirname, 'public')));

// Middleware Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Welcome Route
app.get('/', (req, res) => {
  res.send({ message: 'Welcome to the RandomIdeas API' });
});

// Middlewares-----------
const ideasRouter = require('./routes/ideas');
app.use('/api/ideas', ideasRouter);

// ----------------------
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
