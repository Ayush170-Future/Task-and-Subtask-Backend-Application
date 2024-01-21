const router = require("express").Router();
const validateToken = require("../middleware/validTokenHandler");
const { createUser, addUserToTask } = require("../controllers/userControllers");

router.use(validateToken);

router.route("/create").post(createUser);
router.route("/addtotask/:user_id").post(addUserToTask);

module.exports = router;