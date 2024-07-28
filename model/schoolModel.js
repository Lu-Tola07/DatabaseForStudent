const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
    schoolName: {
        type: String
    },
    schoolAddress: {
        type: String
    },
    schoolEmail: {
        type: String
    },
    studentInfo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "student"
    }]
});

const schoolModel = mongoose.model("school", schoolSchema);

module.exports = schoolModel;