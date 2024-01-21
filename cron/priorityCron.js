const cron = require('node-cron');
const Task = require('../models/taskModel');
const getPriority = require("../utils/getPriority");

const startPriorityCron = () => {
    console.log("Inside Cron")
    cron.schedule('0 0 0 * * *', async () => {
        try {
            const tasks = await Task.find();
            tasks.forEach(async (task) => {
                const newPriority = getPriority(due_date);
                await Task.findByIdAndUpdate(task._id, { priority: newPriority });
            });

            console.log('Priority update cron job executed successfully.');
        } catch (error) {
            console.error('Error in priority update cron job:', error);
        }
    });
    console.log('Priority update cron job started.');
};

module.exports = startPriorityCron;