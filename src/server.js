const express = require("express");
const router = express.Router();
const cors = require("cors");
const mongoose = require("mongoose");
const { default: axios } = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

//const nodemailer = require("nodemailer");

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://0.0.0.0:27017/register");

const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("DB CONNECTED"));

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.listen(5000, () => console.log("Server Running"));

// Manage OTP & Reset Email
const { generateOTP } = require("./services/otp");
const { sendOTP, sendResetMail } = require("./services/emailService");


const Register = require("./models/register");


app.post("/signup", async (req, res) => {
  const {
    firstName,
    lasttName,
    email,
    phone,
    collegename,
    dob,
    password,
  } = req.body;
    
  try {

    const alreadyExists = await Register.findOne({ email });

    const OTP = generateOTP();
    const emailRes = await sendOTP({ OTP, to: email });

    if (emailRes.rejected.length != 0)
      return res.status(500).json({
      message: "Something went wrong! Try Again",
    });

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new Register({
      firstName,
      lasttName,
      email,
      phone,
      collegename,
      dob,
      password: hashPassword,
      ncpid: OTP,

    });

    await user.save();
  
    user.password = undefined;
    user.ncpid = undefined;

    res.status(200).json({ code: 200 });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      err,
      message: "Something went wrong!",
    });
  }
});