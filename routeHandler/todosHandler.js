const express = require('express');
const mongoose = require('mongoose');
const todoSchema = require('../schemas/todosSchema');
const userSchema = require('../schemas/userSchema');
const Todo = mongoose.model('Todo', todoSchema);
const User = mongoose.model('User', userSchema);
const checkLogin = require('../middlewares/checkLogin');

const router = express.Router();

// GET BY CATEGORY TODOS
router.get('/category', async (req, res) => {
    try {
        const todos = await Todo.find().findByStatus('active').select({ date: 0 }).limit(10);
        res.status(200).json({ message: 'Todos retrieved successfully.', todos });
    } catch (err) {
        res.status(500).json({ error: 'There was a server-side error!' });
    }
});

// GET ALL ACTIVE TODOS (using Instance method)
router.get('/active', async (req, res) => {
    try {
        const todo = new Todo();
        const activeTodos = await todo.findActive(); // Correctly calling the Instance method
        res.status(200).json({ message: 'Active todos retrieved successfully.', activeTodos });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'There was a server-side error!' });
    }
});

// GET ALL MOST ACTIVE TODOS (using Statics method)
router.get('/mostActive', async (req, res) => {
    try {
        const activeTodos = await Todo.findMostActive(); // Correctly calling the Statics method
        res.status(200).json({ message: 'Active todos retrieved successfully.', activeTodos });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'There was a server-side error!' });
    }
});


// Route to get todos by status using the query helper
router.get('/status/:status', async (req, res) => {
    const { status } = req.params; // Extract the status from the route parameters
    try {
        const todos = await Todo.find().findByStatus(status); // Call the query helper method
        res.status(200).json({ message: `${status} todos retrieved successfully.`, todos });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'There was a server-side error!' });
    }
});


// GET ALL TODOS
router.get('/', checkLogin, async (req, res) => {
    try {
        const todos = await Todo.find({}).populate('user', "name username").select({ date: 0 });
        res.status(200).json({ message: 'Todos retrieved successfully.', todos });
    } catch (err) {
        res.status(500).json({ error: 'There was a server-side error!' });
    }
});

// GET SINGLE TODO
router.get('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        const formattedDate = todo.getFormattedDate(); // Use instance method
        res.status(200).json({ message: 'Todo retrieved successfully.', todo, formattedDate });
    } catch (err) {
        res.status(500).json({ error: 'There was a server-side error!' });
    }
});


// POST A TODO
router.post('/post-one', checkLogin, async (req, res) => {
    const newTodo = new Todo({
        ...req.body,
        user: req.userId,
    });
    try {

        const todo = await newTodo.save();
        await User.updateOne({
            _id: req.userId,
        },
            {
                $push: {
                    todo: todo._id
                }
            });
        res.status(201).json({ message: 'Todo was inserted successfully.', todo: newTodo });
    } catch (err) {
        res.status(500).json({ error: 'There was a server-side error!' });
    }
});

// POST MULTIPLE TODOS
router.post('/post-many', async (req, res) => {
    try {
        const todos = await Todo.insertMany(req.body);
        res.status(201).json({ message: 'Multiple Todos were inserted successfully.', todos });
    } catch (err) {
        res.status(500).json({ error: 'There was a server-side error!' });
    }
});

// PUT TODOS
router.put('/:id', async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, {
            $set: { status: 'most active' }
        }, { new: true });
        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(200).json({ message: 'Todo updated successfully.', updatedTodo });
    } catch (err) {
        res.status(500).json({ error: 'There was a server-side error!' });
    }
});

// DELETE TODO
router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(200).json({ message: 'Todo deleted successfully.', todo });
    } catch (err) {
        res.status(500).json({ error: 'There was a server-side error!' });
    }
});

// DELETE BY CATEGORY TODOS
router.delete('/', async (req, res) => {
    try {
        const result = await Todo.deleteMany({ status: 'inactive' });
        res.status(200).json({ message: 'Inactive todos deleted successfully.', deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ error: 'There was a server-side error!' });
    }
});

// DELETE ALL TODOS
router.delete('/delete/all', async (req, res) => {
    try {
        const result = await Todo.deleteMany({});
        console.log(`Deleted count: ${result.deletedCount}`); // Log deleted count
        res.status(204).json({ message: 'All todos deleted successfully.', deletedCount: result.deletedCount });
    } catch (err) {
        console.error('Error deleting todos:', err); // More detailed error logging
        res.status(500).json({ error: 'There was a server-side error!' });
    }
});



module.exports = router;
