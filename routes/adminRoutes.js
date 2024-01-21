const router = require("express").Router();
const {registerAdmin, loginAdmin} = require("../controllers/adminControllers");

router.route("/signup").post(registerAdmin);

router.route("/login").post(loginAdmin);

module.exports = router;