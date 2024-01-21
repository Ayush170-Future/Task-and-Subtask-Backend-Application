const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");
const getPriority = require("../utils/getPriority");

const createTask = asyncHandler(async (req, res) => {
    const { title, description, due_date } = req.body;

    if (!title || !description || !due_date) {
        res.status(400)
        throw new Error("Title, description, and due_date are mandatory.");
    }

    const priority = getPriority(due_date);    

    const newTask = new Task({
        title,
        description,
        due_date: new Date(due_date),
        priority,
        status: 'TODO',
    });

    const savedTask = await newTask.save();

    if(savedTask) {
        res.status(200).json({
            title: "Created",
            task_id: newTask._id,
            message: "Task created successfully."
        });
    } else {
        res.status(500)
        throw new Error("Task did not save.");
    }
});

const updateTask = asyncHandler(async (req, res) => {
    const { task_id } = req.params;
    const { due_date, status } = req.body;

    if (!task_id) {
        res.status(400);
        throw new Error("task_id is mandatory.");
    }

    const task = await Task.findOne({_id: task_id, is_delete: false});

    if (!task) {
        res.status(400);
        throw new Error("Task not found.");
    }

    if (due_date) {
        task.due_date = new Date(due_date);
        task.priority = getPriority(due_date);
    }

    if (status && ['TODO', 'DONE'].includes(status)) {
        task.status = status;
    }

    const updatedTask = await task.save();

    if(updateTask) {
        res.status(200).json({
            title: "Updated",
            task_id: updatedTask._id,
            message: "Task updated successfully.",
            task: updatedTask,
        });
    } else {
        res.status(500)
        throw new Error("Details did not update");
    }
});

const deleteTask = asyncHandler(async (req, res) => {
    const { task_id } = req.params;

    if (!task_id) {
        res.status(400);
        throw new Error("task_id is mandatory.");
    }

    const task = await Task.findOne({_id: task_id, is_delete: false});

    if (!task) {
        res.status(400);
        throw new Error("Task not found or it is already deleted");
    }

    task.is_delete = true;
    const updatedTask = await task.save();
    res.status(200).json({
        title: "Deleted",
        task_id: updatedTask._id,
        message: "Task deleted successfully.",
        task: updatedTask,
    });
});

const getAllTasks = asyncHandler(async (req, res) => {
    const { priority, status, dueDate, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (priority !== undefined) {
        filter.priority = priority;
    }
    if (status !== undefined) {
        filter.status = status;
    }
    if (dueDate !== undefined) {
        filter.due_date = { $lte: new Date(dueDate) };
    }
    filter.is_delete = false;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Query tasks with filters and pagination
    const tasks = await Task.find(filter)
        .sort({ due_date: 1 }) // Sorting by due date ascending
        .skip(skip)
        .limit(parseInt(limit));

    // Count total tasks matching the filters
    const totalTasks = await Task.countDocuments(filter);

    res.status(200).json({
        title: "Success",
        message: "Tasks fetched successfully.",
        tasks,
        page: parseInt(page),
        limit: parseInt(limit),
        totalTasks,
    });
});

module.exports = {createTask, updateTask, deleteTask, getAllTasks};