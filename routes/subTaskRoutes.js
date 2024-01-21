const router = require("express").Router();
const validateToken = require("../middleware/validTokenHandler");
const {createSubTask, updateSubTask, deleteSubTask, getAllUserSubTasks} = require("../controllers/subTaskControllers");

router.use(validateToken);

router.route("/create").post(createSubTask);
router.route("/update/:sub_task_id").post(updateSubTask);
router.route("/delete/:sub_task_id").post(deleteSubTask);
router.route("/subtasks/").get(getAllUserSubTasks);

module.exports = router;