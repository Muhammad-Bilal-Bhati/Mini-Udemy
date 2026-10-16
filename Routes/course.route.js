const express = require("express");
const router = express.Router();
const {createCourse,getAllCourses,getCourseById,addChapter,deleteChapter,addingReview} = require("../Controllers/CourseController");
const { isAuthenticated,authorizeRoles } = require("../Middlewares/authMiddlewares");
const {signUp,signIn} = require("../Controllers/AuthController");

router.post("/signup",signUp)
router.post("/signin",signIn)
router.get("/courses",getAllCourses)
router.get("/courses/:courseID",getCourseById)
router.post("/createCourse",isAuthenticated,authorizeRoles("admin","instructor"),createCourse)
router.post("/courses/:courseID/chapters",isAuthenticated,authorizeRoles("admin","instructor"),addChapter)
router.delete("/courses/:courseID/chapters/:chapterID",isAuthenticated,authorizeRoles("admin","instructor"),deleteChapter)
router.post('/courses/:courseID/reviews', isAuthenticated, authorizeRoles('student'), addingReview);

module.exports = router;

