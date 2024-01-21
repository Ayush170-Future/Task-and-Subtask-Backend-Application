const mongoose = require('mongoose');

const subTaskSchema = mongoose.Schema({
    task_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Task',
        required: true
    },
    status: {
        type: Number,
        enum: [0, 1], // 0 - incomplete, 1 - complete
        default: 0,
    },
    is_delete: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: null,
    },
    deleted_at: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

subTaskSchema.pre('save', async function(next) {
    this.updated_at = new Date();
    if(this.isModified('is_delete')) {
        this.deleted_at = new Date();
    }
    next();
})

const SubTask = mongoose.model('SubTask', subTaskSchema);

module.exports = SubTask;
