const express = require('express');
const mongoose = require('mongoose');
const todosHandler = require('./routeHandler/todosHandler');
const app = express();

// Express app initialization
app.use(express.json());

// Database connection
mongoose
    .connect('mongodb://localhost/todo')
    .then(() => console.log('Database connection successful'))
    .catch((err) => console.error('Database connection error:', err));

// Routes
app.use('/todo', todosHandler);

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
