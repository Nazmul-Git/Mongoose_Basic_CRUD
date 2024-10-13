const mongoose = require('mongoose');
const { Schema } = mongoose; //If use distructuring. Otherwise use mongoose.Schema({...}). mongoose contain Schema class

const todoSchema = new Schema({       // create Schema/blueprint of types of data..
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: '' // Optional: Set a default value if needed
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
    },
    date: {
        type: Date,
        default: Date.now // Correctly reference Date.now
    }
});


// Instance method to get active status
todoSchema.methods = {
    findActive: function () {
        return mongoose.model('Todo').find({ status: 'active' }); // or any other formatting you prefer
    }
};


// Static method
todoSchema.statics={
    findMostActive: function () {
        return this.find({status:'most active'});
    }
};


module.exports = todoSchema;
