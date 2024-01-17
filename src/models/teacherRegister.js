// Teacher Registration


const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },
    rfidno: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("teacherRegister", teacherSchema);