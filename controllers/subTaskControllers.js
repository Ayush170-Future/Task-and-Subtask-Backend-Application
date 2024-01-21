const asyncHandler = require("express-async-handler");
const SubTask = require("../models/subtaskModel");
const Task = require("../models/taskModel");

const createSubTask = asyncHandler(async (req, res) => {
    const { task_id } = req.body;

    if (!task_id) {
        res.status(400)
        throw new Error("Task ID is mandatory.");
    }

    const task = await Task.findOne({ _id: task_id, is_delete: false });
    if(!task) {
        res.status(400)
        throw new Error("Task doesn't exist or It is deleted");
    }

    // Current Date
    const created_at = new Date();

    const newSubTask = new SubTask({
        task_id: task._id,
        created_at: created_at
    })

    const savedSubTask = await newSubTask.save();

    if(savedSubTask) {

        // Updating the Number of Sub Tasks
        task.total_sub_task += 1;
        await task.save();
        res.status(200).json({
            title: "Created",
            message: "Sub Task created successfully.",
            sub_task_id: savedSubTask._id,
        });
    } else {
        res.status(400)
        throw new Error("Sub task did not save, Try again");
    }
});

const updateSubTask = asyncHandler(async (req, res) => {
    const { sub_task_id } = req.params;
    const { status } = req.body;

    if (!sub_task_id || !status) {
        res.status(400)
        throw new Error("Sub Task ID and Status are mandatory.");
    }

    const sub_task = await SubTask.findOne({ _id: sub_task_id, is_delete: false });

    if (!sub_task) {
        res.status(400)
        throw new Error("Sub Task not found or it is deleted.");
    }

    const task_id = sub_task.task_id;
    const task = await Task.findOne({_id: task_id, is_delete: false});

    // If Parent Task is deleted we want to soft delete sub-task too -- Assumption
    if(!task) {
        sub_task.is_delete = true;
        await sub_task.save();
        res.status(400)
        throw new Error("Parent Task is deleted, soft deleting the Sub Task too!");
    }

    const old_status = parseInt(sub_task.status, 10);
    const new_status = parseInt(status, 10);

    sub_task.status = new_status;
    const savedSubTask = await sub_task.save();

    if (old_status == 0 && new_status == 1) {
        task.completed_sub_task_count += 1;
        await task.save();
    } else if (old_status == 1 && new_status == 0) {
        task.completed_sub_task_count -= 1;
        await task.save();
    }

    res.status(200).json({
        title: "Success",
        message: "Sub Task updated successfully.",
        subTask: savedSubTask,
    });
});

const deleteSubTask = asyncHandler(async (req, res) => {
    const { sub_task_id } = req.params;

    if (!sub_task_id) {
        res.status(400)
        throw new Error("Sub Task ID is mandatory.");
    }

    const sub_task = await SubTask.findOne({ _id: sub_task_id, is_delete: false });

    if (!sub_task) {
        res.status(400)
        throw new Error("Sub Task is already deleted or It doesn't exist!");
    }

    sub_task.is_delete = true;
    const savedSubTask = await sub_task.save();

    // Updating the `completed_sub_task_count` and `total_sub_task`, if the parent task is not deleted
    const task_id = sub_task.task_id;
    const task = await Task.findOne({_id: task_id, is_delete: false});

    if (task) {
        task.total_sub_task -= 1;
        if(sub_task.status == 1) {
            task.completed_sub_task_count -= 1;
        }
        await task.save();
    } 

    res.status(200).json({
        title: "Success",
        message: "Sub Task deleted successfully.",
        subTask: savedSubTask,
    });
})

const getAllUserSubTasks = asyncHandler(async (req, res) => {
    const { task_id } = req.query;
    let filter = { is_delete: false };

    if (task_id) {
        filter.task_id = task_id;
    }

    const subTasks = await SubTask.find(filter);

    res.status(200).json({
        title: "Success",
        message: "All User Sub Tasks fetched successfully.",
        count: subTasks.length,
        subTasks,
    });
});

module.exports = {createSubTask, updateSubTask, deleteSubTask, getAllUserSubTasks};