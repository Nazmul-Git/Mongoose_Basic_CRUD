const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({       // create Schema/blueprint of types of data..
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        default: '', // Optional: Set a default value if needed
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
    },
    date: {
        type: Date,
        default: Date.now // Correctly reference Date.now
    },
    todo: [
        {
            type : mongoose.Types.ObjectId,
            ref : "Todo"
        }
    ]
});

module.exports = userSchema;