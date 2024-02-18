// models/rfid_h.js

const mongoose = require('mongoose');

const rfidSchema = new mongoose.Schema({
    numericRFID: {
        type: String,
        required: true
    },
    geoLocation: {
        type: String,
        required: true
    },
    Ip: {
        type: String,
        required: true
    },
    currentTime: {
        type: Date,
        // default: new Date(),  // current date and time
    },
    foundInCollection: {
        type: String,
        required: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    },
    hardwaredetails: {
        type: mongoose.Schema.Types.Mixed  // Add another field for hardwaredetails
    },
    attendance: {
        type: String  // Add field for attendance
    }
});

const rfid_h = mongoose.model('rfid_h', rfidSchema);

module.exports = rfid_h;
