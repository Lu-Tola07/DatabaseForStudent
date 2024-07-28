const router = require("express").Router();
const { createSchool, getASchool, getAllSchools } = require("../controller/schoolController");
const { createStudent, getAllStudents, deleteAStudent, logIn } = require("../controller/studentController");

router.post("/School", createSchool);
router.post("/Student/:id", createStudent);
router.post("/Login", logIn);

router.get("/School/:id", getASchool);
router.get("/School", getAllSchools);
router.get("/Student", getAllStudents);

router.delete("/Student/:id", deleteAStudent);


module.exports = router;