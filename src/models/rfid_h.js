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
  }
});

const rfid_h = mongoose.model('rfid_h', rfidSchema);

module.exports = rfid_h;
