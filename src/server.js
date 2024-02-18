const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const router = express.Router();
//const nodemailer = require("nodemailer");

const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
// mongoose.connect("mongodb://0.0.0.0:27017/register");
mongoose.connect("mongodb+srv://admin:yJWaFSJ6smqbD9EQ@register.tbgugnr.mongodb.net/?retryWrites=true&w=majority");


const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("DB CONNECTED"));

const app = express();
app.use(cors());
app.use(cookieParser())
app.use(express.json());
app.use("/", router);
app.listen(5000, () => console.log("Server Running"));



// Manage OTP & Reset Email
const { generateOTP } = require("./services/otp");
const { sendOTP, sendResetMail } = require("./services/emailService");


const studentRegister = require("./models/studentRegister");
const teacherRegister = require("./models/teacherRegister");
const hardware = require("./models/hardware");


const checkAuth = require("./middleware/checkAuth");

const rfid_h = require("./models/rfid_h");


const JWT_SECRECT_KEY = "47d39093940795f6c54900b31345b29d3ff30bd9ac8510ea35b90feb3d25ab678bd50cc5e7d13e02ce6a1f1d8c5cd729c2fa"


app.post("/otp", async (req, res) => {
  const { otp, token } = req.body;  // Destructure otp directly from req.body

  try {

    const decode = jwt.verify(token, JWT_SECRECT_KEY);

    let emailExists;

    if (decode.student) {
      emailExists = await studentRegister.findOne({ email: decode.student.email });
    } else if (decode.teacher) {
      emailExists = await teacherRegister.findOne({ email: decode.teacher.email });
    }


    if (emailExists != null && otp == emailExists.otp) {
      const updateField = decode.student ? 'student' : 'teacher';

      await (decode.student ? studentRegister : teacherRegister).updateOne(
        { email: decode[updateField].email },
        {
          $set: {
            isVerified: true
          },
        }
      );

      const token = jwt.sign({ student: emailExists }, JWT_SECRECT_KEY, {
        expiresIn: "1d",
      });
      res.cookie("token", token).status(200).json({ success: true, "token": token });

    }
    else {
      return res.status(401).json({
        message: "Invalid otp",
        success: false
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      err,
      message: "Internal Server Error",
    });
  }
});

app.post("/signup", async (req, res) => {
  const {
    firstName,
    lasttName,
    email,
    currentYear,
    password,
    course,
    numericRFID,
  } = req.body;

  try {

    const alreadyExists = await studentRegister.findOne({ email });
    const rfidExistsInStudent = await studentRegister.findOne({ numericRFID });
    const rfidExistsInTeacher = await teacherRegister.findOne({ rfidno: numericRFID });

    if (alreadyExists != null) {
      return res.status(409).json({
        success: false,
        message: "Email Already In Use!"
      });
    }

    if (rfidExistsInStudent != null || rfidExistsInTeacher != null) {
      return res.status(409).json({
        success: false,
        message: "RFID Already In Use!"
      });
    }


    const OTP = generateOTP();
    const emailRes = await sendOTP({ OTP, to: email });

    if (emailRes.rejected.length != 0)
      return res.status(500).json({
        message: "Something went wrong! Try Again",
      });

    const hashPassword = await bcrypt.hash(password, 10);

    const student = new studentRegister({
      firstName,
      lasttName,
      email,
      currentYear,
      course,
      numericRFID,
      password: hashPassword,
      otp: OTP,
      isVerified: false
    });

    await student.save();

    student.password = undefined;
    student.otp = undefined;

    const token = jwt.sign({ student }, JWT_SECRECT_KEY, {
      expiresIn: "1d",
    });



    res.cookie("token", token).status(200).json({ success: true, "token": token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      err,
      message: err,
    });
  }
});


app.post("/tsignup", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    rfidno,
    password,
    course,
  } = req.body;

  try {
    const alreadyExists = await teacherRegister.findOne({ email });
    const rfidExistsInStudent = await studentRegister.findOne({ numericRFID: rfidno });
    const rfidExistsInTeacher = await teacherRegister.findOne({ rfidno });

    if (alreadyExists != null) {
      return res.status(409).json({
        success: false,
        message: "Email Already In Use!"
      });
    }

    if (rfidExistsInStudent != null || rfidExistsInTeacher != null) {
      return res.status(409).json({
        success: false,
        message: "RFID Already In Use!"
      });
    }

    const OTP = generateOTP();
    const emailRes = await sendOTP({ OTP, to: email });

    if (emailRes.rejected.length != 0)
      return res.status(500).json({
        message: "Something went wrong! Try Again",
      });

    const hashPassword = await bcrypt.hash(password, 10);

    const teacher = new teacherRegister({
      firstName,
      lastName,
      email,
      rfidno,
      password: hashPassword,
      course,
      otp: OTP,
      isVerified: false,
    });

    await teacher.save();

    teacher.password = undefined;
    teacher.otp = undefined;

    const token = jwt.sign({ teacher }, JWT_SECRECT_KEY, {
      expiresIn: "1d",
    });

    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      path: "/",
    };

    res.cookie("token", token, options).status(200).json({ success: true, "token": token });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      err,
      message: err,
    });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/", expires: new Date(0) }).status(200).json({ success: true });
});

// Login
app.post("/login", async (req, res) => {
  const { rfid, password } = req.body;
  try {
    const isRfidExistsSt = await studentRegister.findOne({ numericRFID: rfid });
    const isRfidExistsTe = await teacherRegister.findOne({ rfidno: rfid });

    if (
      isRfidExistsSt &&
      (await bcrypt.compare(password, isRfidExistsSt.password))
    ) {

      const token = jwt.sign({ student: isRfidExistsSt }, JWT_SECRECT_KEY, {
        expiresIn: "1d",
      });
      const options = {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        path: "/",
      };

      return res
        .status(200)
        .cookie("token", token, options)
        .json({ success: true, "token": token });
    }

    if (
      isRfidExistsTe &&
      (await bcrypt.compare(password, isRfidExistsTe.password))
    ) {

      const token = jwt.sign({ teacher: isRfidExistsTe }, JWT_SECRECT_KEY, {
        expiresIn: "1d",
      });
      const options = {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        path: "/",
      };
      return res
        .status(200)
        .cookie("token", token, options)
        .json({ success: true, "token": token });
    }


    return res.status(401).json({
      message: "RFID/Password is Invalid!",
    });
  } catch (err) {

    console.log(err);
    return res.status(500).json({
      err,
      message: "Something went wrong!",
    });
  }
});

app.get('/user-details', checkAuth, async (req, res) => {
  try {
    if (req.student) {
      return res.status(200).json({ success: true, data: req.student });
    } else if (req.teacher) {
      return res.status(200).json({ success: true, data: req.teacher });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/setlec', async (req, res) => {
  const { Teacher, sTime, eTime, course } = req.body;

  try {
    // Check if a document already exists
    const existingDocument = await hardware.findOne();

    if (existingDocument) {
      // Document already exists, send an error response
      return res.status(400).json({ success: false, message: 'A document already exists. Only one document is allowed.' });
    }

    // No existing document found, proceed to save a new one
    const hardwared = new hardware({
      Teacher,
      sTime,
      eTime,
      course
    });

    await hardwared.save();

    const tokenlec = jwt.sign({ hardwared }, JWT_SECRECT_KEY, {
      expiresIn: "1d",
    });

    res.cookie("tokenlec", tokenlec, { httpOnly: true, sameSite: "Strict", secure: true }).status(200).json({ success: true, "tokenlec": tokenlec });
  } catch (error) {
    console.error('Error updating lec details:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/getlec1', async (req, res) => {

  try {
    // Check if a document already exists
    const hardwaredetails = await hardware.findOne();

    if (!hardwaredetails) {
      // NO Document exists, send an error response
      return res.status(404).json({ success: false, message: 'No hardware details available.' });
    }

    // Document found, send the details in the response
    res.status(200).json({ success: true, hardwaredetails });
  } catch (error) {
    console.error('Error Fetching lec1 details:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


// force del for respective tea
app.delete('/deletelec', async (req, res) => {
  const { fname } = req.body;

  try {
    // Check if the user is a teacher and present in hardware
    const isTeacher = await hardware.findOne({ Teacher: fname });

    if (isTeacher) {
      // If the user is a teacher, delete all data from the hardware collection
      await hardware.deleteMany({ Teacher: fname });

      return res.status(200).json({ success: true, message: 'Hardware data deleted successfully.' });
    } else {
      return res.status(403).json({ success: false, message: 'Access forbidden. Only teachers can delete hardware data.' });
    }
  } catch (error) {
    console.error('Error deleting hardware data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// auto del api
app.delete('/autodeletelec', async (req, res) => {
  // const { etime } = req.body;
  try {
    // Delete all documents from the hardware collection
    const result = await hardware.deleteMany({});

    return res.status(200).json({ success: true, message: `All hardware data deleted successfully. ${result.deletedCount} documents deleted.` });
  } catch (error) {
    console.error('Error deleting all hardware data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


app.post('/hrfid', async (req, res) => {
  const { numericRFID, geoLocation, Ip } = req.body;

  try {
    // Create a new instance of the RFID model
    const rfidData = new rfid_h({
      numericRFID,
      geoLocation,
      Ip
    });
    
    // Save the data to the database
    await rfidData.save();
    res.status(200).json({ success: true, message: 'RFID, IP, and geo-location data stored successfully.' });
  } catch (error) {
    console.error('Error storing RFID, IP, and geo-location data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});