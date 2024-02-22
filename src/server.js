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
    // lasttName,
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
      // lasttName,
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
    // lastName,
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
      // lastName,
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
  const { Teacher, sTime, eTime, course,subject,Lecdate } = req.body;

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
      course,
      subject,
      Lecdate
    });

    await hardwared.save();

    const tokenlec1 = jwt.sign({ hardwared }, JWT_SECRECT_KEY, {
      expiresIn: "1d",
    });

    res.cookie("tokenlec1", tokenlec1, { httpOnly: true, sameSite: "Strict", secure: true }).status(200).json({ success: true, "tokenlec1": tokenlec1 });
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
  const { numericRFID, geoLocation, Ip, ucurrentTime } = req.body;
  console.log("current time by user : ", ucurrentTime);
  try {
    // Call the /getlec1 endpoint to get hardware details
    let hardwaredetails;
    try {
      const response = await axios.get('http://localhost:5000/getlec1');
      if (response.status === 200) {
        hardwaredetails = response.data.hardwaredetails;
        console.log('Hardware details:', hardwaredetails);
      } else {
        console.error('Failed to fetch hardware details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching hardware details:', error.message);
      // Handle the case where hardwaredetails are not fetched
      hardwaredetails = null; // Set hardwaredetails to null to indicate it's not available
    }

    // Check if the RFID already exists in rfid_h collection
    const existingPerson = await rfid_h.findOne({ numericRFID });

    // Check if the numericRFID exists in the studentRegister collection
    const studentData = await studentRegister.findOne({ numericRFID });

    // Check if the numericRFID exists in the teacherRegister collection
    const teacherData = await teacherRegister.findOne({ rfidno: numericRFID });

    if (existingPerson && hardwaredetails != null) {
      // If the RFID already exists, update the attendance_count if course matches
      if (
        existingPerson.details &&
        existingPerson.details.course === hardwaredetails.course &&
        ucurrentTime >= hardwaredetails.sTime && ucurrentTime <= hardwaredetails.eTime
      ) {
        existingPerson.attendance_count += 1;
        await existingPerson.save();
        return res.status(200).json({ success: true, message: 'RFID updated successfully.' });
      } else {
        const rfidData = new rfid_h({
          numericRFID,
          geoLocation,
          Ip,
          foundInCollection: studentData ? 'studentRegister' : 'teacherRegister',
          details: studentData || teacherData || null,
          currentTime: ucurrentTime,
        });
        // If hardwaredetails are present, store them as well
        if (hardwaredetails) {
          rfidData.hardwaredetails = hardwaredetails;
        }
        // Save the data to the database
        await rfidData.save();
        return res.status(200).json({ success: true, message: 'RFID, IP, and geo-location data stored successfully.' });
      }
    } else if (studentData || teacherData) {
      // If the RFID is found, store additional details in the rfid_h collection
      const rfidData = new rfid_h({
        numericRFID,
        geoLocation,
        Ip,
        foundInCollection: studentData ? 'studentRegister' : 'teacherRegister',
        details: studentData || teacherData,
        currentTime: ucurrentTime,
      });

      // If hardwaredetails are present, store them as well
      if (hardwaredetails) {
        rfidData.hardwaredetails = hardwaredetails;

        // Check if the user is present based on current time and hardware details
        if (
          ucurrentTime >= hardwaredetails.sTime && ucurrentTime <= hardwaredetails.eTime &&
          studentData &&
          studentData.course === hardwaredetails.course ||
          teacherData &&
          teacherData.course === hardwaredetails.course
        ) {
          // Check if the user is a student and the course matches
          rfidData.attendance = 'present';
          rfidData.attendance_count = 1 // Start attendance count at 1 for new documents
          await rfidData.save();
          return res.status(200).json({ success: true, message: 'RFID, IP, and geo-location data stored successfully. attendance marked' });
        } else if (
          studentData &&
          studentData.course !== hardwaredetails.course ||
          teacherData &&
          teacherData.course !== hardwaredetails.course
        ) {
          rfidData.attendance = null;
          rfidData.attendance_count = 0 // the course does not match for the student
          await rfidData.save();
          return res.status(200).json({ success: true, message: 'RFID, IP, and geo-location data stored successfully. no course match' });
        } else {
          rfidData.attendance = 'absent';
          await rfidData.save();
          return res.status(200).json({ success: true, message: 'RFID, IP, and geo-location data stored successfully. time limit out of bounds' });
        }
      } else {
        rfidData.hardwaredetails = null;
        await rfidData.save();
        return res.status(200).json({ success: true, message: 'RFID, IP, and geo-location data stored as anonymous. nothing in hardware' })
      }
    } else {
      // If the RFID is not found, store it as anonymous
      const rfidData = new rfid_h({
        numericRFID,
        geoLocation,
        Ip,
        foundInCollection: 'anonymous',
        details: null,
        currentTime: ucurrentTime
      });

      // If hardwaredetails are present, store them as well
      if (hardwaredetails) {
        rfidData.hardwaredetails = hardwaredetails;
      }
      // Save the data to the database
      await rfidData.save();
      return res.status(200).json({ success: true, message: 'RFID, IP, and geo-location data stored as anonymous.' });
    }
  } catch (error) {
    console.error('Error storing RFID, IP, and geo-location data:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


app.get('/AttendanceRecords', async (req, res) => {
  try {
    const { numericRFID } = req.query; // Access query parameters instead of params
    console.log('Server rfid : ',numericRFID);
    // Fetch attendance records for the given numericRFID, excluding the password field
    const attendanceRecords = await rfid_h.find({ numericRFID }).select('-details.password');
    console.log(attendanceRecords)
    res.status(200).json({ success: true, attendanceRecords });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});