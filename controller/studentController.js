require("dotenv").config();
const studentModel = require("../model/studentModel");
const schoolModel = require("../model/schoolModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {welcomeEmail} = require("../utils/emailTemplates");
const sendMail = require("../utils/email");
const fs = require("fs");
const path = require("path");


// exports.createStudent = async (req, res) => {
//     try {
//         const {studentName, studentClass, department, gender, email, passWord} = req.body;

//         const id = req.params.id;
//         const school = await schoolModel.findById(id);

//         const createStudent = new studentModel(req.body);

//         const bcryptPassword = await bcrypt.genSaltSync(10);
//         const hashedPassword = await bcrypt.hashSync(passWord, bcryptPassword);

//         const data = {
//             studentName,
//             studentClass,
//             department,
//             gender,
//             email: email.toLowerCase(),
//             passWord: hashedPassword,
//             school
//         };

//         createStudent.school = school;
//         await createStudent.save();

//         school.studentInfo.push(createStudent);
//         await school.save();

//         res.status(200).json({
//             message: `A new student has been created.`,
//             data: createStudent
//         });

//         const createdUser = await userModel.create(data);

//         await fs.unlink(req.file.path, (err) => {
//             if(err) {
//                 return res.status(400).json("Unable to delete user's file.")
//                 console.log(err.message)
//             } else {
//                 console.log(`File has been deleted successfully.`)
//             }
//         });

//         const userToken = jwt.sign({id:createdUser._id, email:createdUser.email}, process.env.jwtSecret, {expiresIn: "3 minutes"});
//         const verifyLink = `${req.protocol}://${req.get("host")}/api/v1/verify/${createdUser._id}/${userToken}`;
        
//         sendMail({
//             subject: `Kindly verify your mail.`,
//             email: createdUser.email,
//             html: html(verifyLink, createdUser.firstName)
//         });
        
//         res.status(201).json({
//            message: `Welcome ${createdUser.firstName}, kindly check your gmail to access the link to verify your email.`,
//            data: createdUser 
//         });

//     } catch (error) {
//         res.status(500).json(error.message)
//     }
// };

exports.createStudent = async (req, res) => {
    try {
        const {studentName, studentClass, department, gender, email, passWord} = req.body;

        const id = req.params.id;
        const school = await schoolModel.findById(id);

        const createStudent = new studentModel(req.body);

        const bcryptPassword = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(passWord, bcryptPassword);

        const data = {
            studentName,
            studentClass,
            department,
            gender,
            email: email.toLowerCase(),
            passWord: hashedPassword,
            school
        };

        createStudent.school = school;
        await createStudent.save();

        school.studentInfo.push(createStudent);
        await school.save();

        const createdUser = await studentModel.create(data);

        // await fs.unlink(req.file.path, (err) => {
        //     if (err) {
        //         return res.status(400).json("Unable to delete user's file.");
        //         console.log(err.message);
        //     } else {
        //         console.log(`File has been deleted successfully.`);
        //     }
        // });

        const loginToken = jwt.sign({
            id: createdUser._id, email: createdUser.email},
            process.env.jwtSecret,
            {expiresIn: "3 minutes"}
        );
        const loginLink = `${req.protocol}://${req.get("host")}/api/v1/login/${createdUser._id}/${loginToken}`;
        
        sendMail({
            subject: `Kindly verify your mail.`,
            email: createdUser.email,
            html: welcomeEmail(loginLink, createdUser.studentName)
        });

        res.status(201).json({
            message: `Welcome ${createdUser.studentName}, kindly check your email to access the link to log in.`,
            data: createdUser
        });

    } catch (error) {
        res.status(500).json(error.message);
    }
};


exports.getAllStudents = async (req, res) => {
    try {
        
        const student = await studentModel.find();
        const allStudents = student.length;

        if(allStudents < 1) {
            res.status(404).json(`No student was found.`)
        } else {
            res.status(200).json({
                message: `These are the number of students available.`,
                allStudents,
                data: student
            })
        }

    } catch (error) {
        res.status(500).json(error.message)
    }
};

exports.deleteAStudent = async (req, res) => {
    try {
        
        const id = req.params.id;
        const deleteStudent = await studentModel.findByIdAndDelete(id);

        if(!deleteStudent) {
            res.status(404).json(`The student with Id: ${id} was not found.`)
        } else {
            res.status(201).json(`This student has successfully been deleted.`)
        }

    } catch (error) {
        res.status(500).json(error.message)
    }
};

// exports.logIn = async (req, res) => {
//     try {
//         const {email, passWord}= req.body
        
//         const findUser = await studentModel.findOne({
//             $or:[{studentName: email}, {email: email.toLowerCase()}]
//         });

//         if(!findUser) {
//             return res.status(404).json({
//                 message:'The user with this email does not exist.'
//             })
//         };

//         const matchPassword = await bcrypt.compare(passWord, findUser.passWord);
        
//         if(!matchPassword) {
//             return res.status(400).json({
//                 message:'Invalid password.'
//             })
//         };

//         if(findUser.isVerified === false) {
//             return  res.status(400).json({
//                 message:'The user with this email is not verified.'
//             })
//         };

//         findUser.isLoggedIn = true;

//         const user = jwt.sign({
//             studentName:findUser.studentName,
//             email: findUser.email,
//             userId: findUser._id
//         },
//         process.env.jwtSecret,
//         {expiresIn: "1d"});
        
//         const {department, gender, isVerified, createdAt, updatedAt, __v, ...others} = findWithEmail._doc;

//         return res.status(200).json({
//             message:'Logged in successfully.',
//             data: others,
//             token: user
//         });

//     } catch (error) {
//         res.status(500).json(error.message)
//     }
// };

exports.logIn = async (req, res) => {
    try {
        const {email, passWord} = req.body;
        
        const findUser = await studentModel.findOne({
            $or: [{studentName: email}, {email: email.toLowerCase()}]
        });

        if (!findUser) {
            return res.status(404).json({
                message: 'The user with this email does not exist.'
            });
        }

        const matchPassword = await bcrypt.compare(passWord, findUser.passWord);
        
        if (!matchPassword) {
            return res.status(400).json({
                message: 'Invalid password.'
            });
        }

        if (findUser.isVerified === false) {
            return res.status(400).json({
                message: 'The user with this email is not verified.'
            });
        }

        findUser.isLoggedIn = true;

        const user = jwt.sign({
            studentName: findUser.studentName,
            email: findUser.email,
            userId: findUser._id
        }, process.env.jwtSecret, {expiresIn: "1d"});

        const {department, gender, isVerified, createdAt, updatedAt, __v, ...others} = findUser._doc;

        return res.status(200).json({
            message: 'Logged in successfully.',
            data: others,
            token: user
        });

    } catch (error) {
        res.status(500).json(error.message);
    }
};
