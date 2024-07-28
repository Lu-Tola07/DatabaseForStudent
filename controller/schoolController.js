const schoolModel = require("../model/schoolModel");
const studentModel = require("../model/studentModel");
const { createStudent } = require("./studentController");

exports.createSchool = async (req, res) => {
    try {
    //    const {schoolName, schoolAddress, schoolEmail} = req.body;
       
       const createSchool = await schoolModel.create(req.body)
       res.status(200).json({
        message: `The school, ${createSchool.schoolName} has been created.`,
        data: createSchool
       })

    } catch (error) {
        res.status(500).json(error.message)
    }
};

exports.getASchool = async (req, res) => {
    try {
        
        const oneSchool = await schoolModel.findById(req.params.id).populate("studentInfo");
        const totalStudents = oneSchool.studentInfo.length;
        res.status(200).json({
            message: `The school with the ID: ${oneSchool.id} has been found. They are ${totalStudents} in number.`,
            totalStudents,
            data: oneSchool 
        })
        // console.log(oneSchool.studentInfo.length);

    } catch (error) {
        res.status(500).json(error.message)
    }
};

exports.getAllSchools = async (req, res) => {
    try {
        
        const school = await schoolModel.find();
        const allSchools = school.length;

        if(allSchools < 1) {
            res.status(404).json(`No school found.`)
        } else {
            res.status(200).json({
                message: `These are the number of schools available.`,
                allSchools,
                data: school
            })
        }

    } catch (error) {
        res.status(500).json(error.message)
    }
};

