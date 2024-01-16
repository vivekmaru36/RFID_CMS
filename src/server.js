const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { default: axios } = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const router = express.Router();
//const nodemailer = require("nodemailer");
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://0.0.0.0:27017/register");

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

const checkAuth = require("./middleware/checkAuth");



const JWT_SECRECT_KEY="47d39093940795f6c54900b31345b29d3ff30bd9ac8510ea35b90feb3d25ab678bd50cc5e7d13e02ce6a1f1d8c5cd729c2fa"


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

    //const alreadyExists = await studentRegister.findOne({ email });

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

    });

    await student.save();
  
    student.password = undefined;
    student.otp = undefined;

    const token = jwt.sign({ student }, JWT_SECRECT_KEY, {
      expiresIn: "1d",
    });

    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      path: "/",
    };

    res.cookie("token", token, options).status(200).json({ success: true,"token":token });
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
    password    
  } = req.body;
    
  try {


    //const alreadyExists = await studentRegister.findOne({ email });

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
      otp: OTP,
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

    res.cookie("token", token, options).status(200).json({ success: true });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      err,
      message: err,
    });
  }
});

app.get("/check-auth", async(req, res) => {
  return res.status(200).json("pras");
});