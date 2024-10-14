const express = require('express');
const mongoose = require('mongoose');
const dotenv= require('dotenv');
const todosHandler = require('./routeHandler/todosHandler');
const userHandler= require('./routeHandler/usersHandler');
const app = express();
dotenv.config();
// Express app initialization
app.use(express.json());

// Database connection
mongoose
    .connect('mongodb://localhost/todo')
    .then(() => console.log('Database connection successful'))
    .catch((err) => console.error('Database connection error:', err));

// Routes
app.use('/todo', todosHandler);
app.use('/user', userHandler);

// Default error handler
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Start the server
app.listen(5000, () => {
    console.log('Application running on port 5000');
});
