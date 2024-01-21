const router = require("express").Router();
const validateToken = require("../middleware/validTokenHandler");
const {createTask, updateTask, deleteTask, getAllTasks} = require("../controllers/taskControllers");

router.use(validateToken);

router.route("/create").post(createTask);
router.route("/update/:task_id").post(updateTask);
router.route("/delete/:task_id").post(deleteTask);
router.route("/tasks/").get(getAllTasks);

module.exports = router;