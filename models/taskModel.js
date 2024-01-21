const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    due_date: {
        type: Date,
        required: true
    },
    priority: {
        type: Number,
        enum: [0, 1, 2, 3],
        default: 0
    },
    status: {
        type: String,
        enum: ['TODO', 'IN_PROGRESS', 'DONE'],
        default: 'TODO',
    },
    is_delete: {
        type: Boolean,
        default: false
    },
    completed_sub_task_count: {
        type: Number,
        default: 0
    },
    total_sub_task: {
        type: Number,
        default: 0
    },
    users: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }
    ]
}, {
    timestamps: true
});

taskSchema.pre('save', async function(next) {
    if (this.isModified('completed_sub_task_count') || this.isModified('total_sub_task')) {
        if (this.completed_sub_task_count == this.total_sub_task) {
            this.status = 'DONE'
        } else if (this.completed_sub_task_count > 0 && this.completed_sub_task_count < this.total_sub_task) {
            this.status = 'IN_PROGRESS'
        } else {
            this.status = 'TODO'
        }
    }
    next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;