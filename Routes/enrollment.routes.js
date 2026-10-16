const express = require("express");
const router = express.Router();

const {enrollCourse} = require("../Controllers/EnrollmentController");
const { isAuthenticated,authorizeRoles } = require("../Middlewares/authMiddlewares");

router.post("/:courseID",isAuthenticated,authorizeRoles("student"),enrollCourse)

module.exports = router;


