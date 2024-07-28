const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    studentName: {
        type: String
    },
    studentClass: {
        type: String
    },
    department: {
        type: String,
        enum: {
            values: ["Science", "Commercial", "Art"],
            message: 'Department must be either Science, Art, or Commercial.'
        },
        required: true
    },
    gender: {
        type: String,
        enum: {
            values: ["Male", "Female"],
            message: 'Gender can only either Male or Female.'
        },
        required: true
    },
    email: {
        type: String,
        // unique: true
    },
    passWord: {
        type: String
    },
    school: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "school"
    }],
    isVerified:{
        type:Boolean,
        default:false
    },
    isLoggedIn:{
        type:Boolean,
        default:false
    }
});


const studentModel = mongoose.model("student", studentSchema);

module.exports = studentModel;
