const mongoose = require('mongoose');
const { use } = require('../routeHandler/todosHandler');
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
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
});


// Instance method to get active status
todoSchema.methods = {
    findActive: function () {
        return mongoose.model('Todo').find({ status: 'active' }); // or any other formatting you prefer
    }
};

todoSchema.methods={
    getFormattedDate: function(){
        return this.date ? this.date.toISOString().split('T')[0] : null;
    }
}


// Static method
todoSchema.statics = {
    findMostActive: function () {
        return this.find({ status: 'most active' });
    }
};


// Query Helper
todoSchema.query = {
    findByStatus: function (status) {
        return this.find({ status });
    }
};


module.exports = todoSchema;
