const exprerss = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');  // Encription
const jwt = require('jsonwebtoken'); //token
const userSchema = require('../schemas/userSchema');
const User = mongoose.model('User', userSchema);

const router = exprerss.Router();

// Sign Up
router.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({ message: 'User was inserted successfully.', user: newUser });
    } catch (err) {
        console.error('Error during signup:', err); // More detailed error logging
        res.status(500).json({ error: 'There was a server-side error!' });
    }
});

// Log In
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username }); // Use findOne to get a single user
        if (user) {
            const isValidPassword = await bcrypt.compare(req.body.password, user.password); // Directly access user.password
            if (isValidPassword) {
                // Generate token
                const token = jwt.sign({
                    username: user.username, // Directly access user.username
                    userId: user._id // Directly access user._id
                }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });

                res.status(200).json({
                    "access_token": token,
                    "message": "Login Successful!"
                });
            } else {
                res.status(401).json({
                    "error": "Authentication Failed!"
                });
            }
        } else {
            res.status(401).json({
                "error": "Authentication Failed!"
            });
        }
    } catch (err) {
        console.error('Error during login:', err); // Log error for debugging
        res.status(500).json({ "error": err.message });
    }
});

module.exports = router;