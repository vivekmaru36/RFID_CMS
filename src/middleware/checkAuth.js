const studentRegister = require("../models/studentRegister");
const teacherRegister = require("../models/teacherRegister");
const jwt = require("jsonwebtoken");

const JWT_SECRECT_KEY="47d39093940795f6c54900b31345b29d3ff30bd9ac8510ea35b90feb3d25ab678bd50cc5e7d13e02ce6a1f1d8c5cd729c2fa"

const checkAuth = async(req,res,next) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Please Login" });

    try{
        const decode = jwt.verify(token,JWT_SECRECT_KEY);
        const {user} = decode

        const isStudentExist = await studentRegister.findOne({
            _id: user._id
        });

        const isTeacherExist = await teacherRegister.findOne({
            _id: user._id
        });

        if (isStudentExist == null){
            res.clearCookie("token");
            return res.status(401).json({
                message: "Invalid Token",
            });
        }

        if (isTeacherExist == null){
            res.clearCookie("token");
            return res.status(401).json({
                message: "Invalid Token",
            });
        }

        req.student = isStudentExist;
        req.teacher = isTeacherExist;

    }catch(err){
        console.log(err);
        res.status(400).json({
        err,
        message: "Something went wrong!",
        });
    }
    next();
}

module.exports = checkAuth;