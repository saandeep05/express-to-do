const mongoose = require('mongoose');
const { userSchema } = require('./User');

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    tags: [String],
    description: String,
    isCompleted: {
        type: Boolean,
        default: false
    },
    username: String
});

module.exports = mongoose.model('Task', taskSchema);