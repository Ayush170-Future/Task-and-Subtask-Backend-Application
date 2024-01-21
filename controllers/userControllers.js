const asyncHandler = require("express-async-handler");
const Task = require('../models/taskModel');
const User = require("../models/userModel");

const createUser = asyncHandler(async (req, res) => {
    const { phone_number, priority } = req.body;

    if (!phone_number || priority === undefined) {
        res.status(400);
        throw new Error("Phone number and priority are mandatory.");
    }

    // Validate priority against enum values [0, 1, 2]
    if (![0, 1, 2].includes(priority)) {
        res.status(400);
        throw new Error("Invalid priority value. It should be one of [0, 1, 2].");
    }

    const newUser = new User({
        phone_number,
        priority,
    });

    const savedUser = await newUser.save();

    if (savedUser) {
        res.status(201).json({
            title: "Created",
            user_id: savedUser._id,
            message: "User created successfully.",
            user: savedUser,
        });
    } else {
        res.status(500).json({
            title: "Internal Server Error",
            message: "User did not save.",
        });
        throw new Error("User did not save.");
    }
});

const addUserToTask = asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    const { task_id } = req.body;

    const task = await Task.findOne({ _id: task_id, is_delete: false });

    if (!task) {
        res.status(400);
        throw new Error("Task not found or it is already deleted");
    }

    const user = await User.findOne({ _id: user_id });

    if (!user) {
        res.status(400);
        throw new Error("User not found");
    }

    // Check if the user is already in the task
    if (task.users.includes(user_id)) {
        res.status(400);
        throw new Error("User is already added to the task");
    }

    task.users.push(user_id);
    const updatedTask = await task.save();

    res.status(200).json({
        title: "Updated",
        task_id: updatedTask._id,
        message: "User added to the task successfully.",
        task: updatedTask,
    });
});

module.exports = { createUser, addUserToTask };
