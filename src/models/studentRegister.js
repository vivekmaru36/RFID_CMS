// Student Registration


const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lasttName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    currentYear: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
    numericRFID: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("studentRegister", studentSchema);