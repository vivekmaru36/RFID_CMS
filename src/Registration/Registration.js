import React, { useState } from 'react';
import "./registration.css";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('ncp-signup');

  const formInitialDetails = {
    firstName: '',
    email: '',
    currentYear: '',
    password: '',
    course: '',
    numericRFID: ""
  };

  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [buttonText, setButtonText] = useState('Sign Up');
  const [status, setStatus] = useState({});

  const onFormUpdate = (category, value) => {
    setFormDetails({
      ...formDetails,
      [category]: value
    });
  };

  const validateForm = () => {
    let isValid = true;

    const validations = {
      'firstName': formDetails.firstName.trim() !== '' ? '' : 'Name is required',
      'email': /\S+@\S+\.\S+/.test(formDetails.email) ? '' : 'Invalid email address',
      'password': formDetails.password.length >= 8 ? '' : 'Password must be at least 8 characters long',
      'currentYear': formDetails.currentYear ? '' : 'Please select a currentYear',
      'course': formDetails.course ? '' : 'Please select a course',
      'numericRFID': /^\d{10}$/.test(formDetails.numericRFID) ? '' : 'Numeric RFID must be 10 digits',
    };

    for (const key in validations) {
      if (validations[key] !== '') {
        setStatus({ success: false, message: validations[key] });
        isValid = false;
        break;
      }
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setButtonText("Sending...");

    try {
      let response = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(formDetails),
      });

      let result = await response.json();
      setFormDetails(formInitialDetails);

      if (result.success) {
        if (result.token) {
          Cookies.set("token", result.token);
          navigate("/otp");
        } else {
          navigate("/registration");
        }

        setStatus({ success: true, message: 'Data sent successfully' });
      } else {
        setStatus({ success: false, message: result.message });
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setButtonText("Signup");
    }
  };

  const teacherInitialDetails = {
    firstName: '',
    email: '',
    numericRFID: '',
    password: '',
    course: ''
  };

  const [teacherDetails, setTeacherDetails] = useState(teacherInitialDetails);

  const teacherSubmit = async (e) => {
    e.preventDefault();

    if (!validateTeacherForm()) {
      return;
    }

    setButtonText("Sending...");

    try {
      let response = await fetch("http://127.0.0.1:5000/tsignup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          ...teacherDetails,
          rfidno: teacherDetails.numericRFID,
        }),
      });

      let result = await response.json();

      if (result.success) {
        if (result.token) {
          Cookies.set("token", result.token);
          navigate("/otp");
        } else {
          navigate("/registration");
        }

        setStatus({ success: true, message: 'Data sent successfully' });
      } else {
        setStatus({ success: false, message: result.message });
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setButtonText("Signup");
    }
  };

  const validateTeacherForm = () => {
    let isValid = true;

    const validations = {
      'firstName': teacherDetails.firstName.trim() !== '' ? '' : 'Name is required',
      'email': /\S+@\S+\.\S+/.test(teacherDetails.email) ? '' : 'Invalid email address',
      'password': teacherDetails.password.length >= 8 ? '' : 'Password must be at least 8 characters long',
      'course': teacherDetails.course ? '' : 'Please select a course',
      'numericRFID': /^\d{10}$/.test(teacherDetails.numericRFID) ? '' : 'Numeric RFID must be 10 digits',
    };

    for (const key in validations) {
      if (validations[key] !== '') {
        setStatus({ success: false, message: validations[key] });
        isValid = false;
        break;
      }
    }

    return isValid;
  };

  const handleNumericRFIDChange = (e) => {
    const input = e.target.value;

    if (/^\d{0,10}$/.test(input)) {
      onFormUpdate("numericRFID", e.target.value);
    }
  };

  const handleNumericRFIDChangeT = (e) => {
    const input = e.target.value;

    if (/^\d{0,10}$/.test(input)) {
      setTeacherDetails({
        ...teacherDetails,
        numericRFID: input
      });
    }
  };

  return (
    <div className="container-manual">
      <div className="btn-grp" style={{ position: "relative", left: "30%", top: "20%", zIndex: "1" }}>
        <button type="button" className={`btn btn-primary ${currentSection === 'ncp-signup' ? 'active-signup' : ''}`} onClick={() => setCurrentSection('ncp-signup')}>
          Student Registration
        </button>

        <button type="button" className={`btn btn-primary ${currentSection === 'ncp-login' ? 'active-signup' : ''}`} onClick={() => setCurrentSection('ncp-login')}>
          Teacher Registration
        </button>
      </div>

      <div className="cont" style={{ overflow: 'auto' }}>
        {/* -------- STUDENT REGISTRATION --------- */}
        {currentSection === 'ncp-signup' && (
          <div className="ncp-signup">
            <h2 className="mb-2 text-center text-4xl pb-10 font-bold tracking-tight  text-gray-900 ">Student Registration</h2>
            <p style={{ textAlign: "center" }}>Please Provide Registration Details here.</p>
            <form onSubmit={handleSubmit}>

              <input type="text" value={formDetails.firstName} placeholder="First Name" onChange={(e) => onFormUpdate('firstName', e.target.value)} />
              {status.message && status.message === 'Name is required' && <p style={{ color: 'red', textAlign: "center", fontWeight: "bold" }}>{status.message}</p>}

              <input type="text" value={formDetails.email} placeholder="Email" onChange={(e) => onFormUpdate("email", e.target.value)} />
              {status.message && status.message === 'Invalid email address' && <p style={{ color: 'red', textAlign: "center", fontWeight: "bold" }}>{status.message}</p>}

              <select id="currentYear" value={formDetails.currentYear} onChange={(e) => onFormUpdate("currentYear", e.target.value)}>
                <option value="">Select Year</option>
                <option value="1st">First</option>
                <option value="2nd">Second</option>
                <option value="3rd">Third</option>
              </select>
              {status.message && status.message === 'Please select a currentYear' && <p style={{ color: 'red', textAlign: "center", fontWeight: "bold" }}>{status.message}</p>}

              <select id="course" value={formDetails.course} onChange={(e) => onFormUpdate("course", e.target.value)}>
                <option value="">Select Course</option>
                <option value="CS">Computer Science</option>
                <option value="BCOM">BCOM</option>
                <option value="BA">BA</option>
              </select>
              {status.message && status.message === 'Please select a course' && <p style={{ color: 'red', textAlign: "center", fontWeight: "bold" }}>{status.message}</p>}

              <input type="password" value={formDetails.password} placeholder="Password" onChange={(e) => onFormUpdate("password", e.target.value)} />
              {status.message && status.message === 'Password must be at least 8 characters long' && <p style={{ color: 'red', textAlign: "center", fontWeight: "bold" }}>{status.message}</p>}

              <input
                type="number"
                id="numericRFID"
                value={formDetails.numericRFID}
                placeholder="RFID"
                onChange={handleNumericRFIDChange}
                required
              />
              {formDetails.numericRFID.length !== 10 && <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>Numeric RFID must be 10 digits</p>}
              <button type="submit" style={{ marginBottom: "30px", left: "32%" }}><span>{buttonText}</span></button>

              {status.message && status.message !== 'Name is required' && status.message !== 'Invalid email address' && status.message !== 'Please select a currentYear' && status.message !== 'Please select a course' && status.message !== 'Password must be at least 8 characters long' &&
                <p style={{ textAlign: "center" }} className={status.success === false ? "danger" : "success"}>{status.message}</p>
              }
            </form>
          </div>
        )}

        {/* --------- TEACHER SIGNUP  ------------ */}
        {currentSection === 'ncp-login' && (
          <div className="ncp-signup">
            <h2>Teacher Registration</h2>
            <p style={{ textAlign: "center" }}>Please Provide Registration Details here.</p>
            <form onSubmit={teacherSubmit}>

              <input type="text" placeholder='First Name' value={teacherDetails.firstName} onChange={(e) => setTeacherDetails({ ...teacherDetails, firstName: e.target.value })} required />
              {status.message && status.message === 'Name is required' && <p style={{ color: 'red', textAlign: "center", fontWeight: "bold" }}>{status.message}</p>}

              <input type="email" placeholder='Email' value={teacherDetails.email} onChange={(e) => setTeacherDetails({ ...teacherDetails, email: e.target.value })} required />
              {status.message && status.message === 'Invalid email address' && <p style={{ color: 'red', textAlign: "center", fontWeight: "bold" }}>{status.message}</p>}

              <input type="password" placeholder="Password" value={teacherDetails.password} onChange={(e) => setTeacherDetails({ ...teacherDetails, password: e.target.value })} required />
              {status.message && status.message === 'Password must be at least 8 characters long' && <p style={{ color: 'red', textAlign: "center", fontWeight: "bold" }}>{status.message}</p>}

              <select id="course" value={teacherDetails.course} onChange={(e) => setTeacherDetails({ ...teacherDetails, course: e.target.value })}>
                <option value="">Select Course</option>
                <option value="CS">Computer Science</option>
                <option value="BCOM">BCom</option>
                <option value="WA">BA</option>
              </select>
              {status.message && status.message === 'Please select a course' && <p style={{ color: 'red', textAlign: "center", fontWeight: "bold" }}>{status.message}</p>}

              <input type="number" placeholder="RFID NO" value={teacherDetails.numericRFID} onChange={handleNumericRFIDChangeT} required />
              {teacherDetails.numericRFID.length !== 10 && <p style={{ textAlign: "center", color: 'red' }}>Numeric RFID must be 10 digits</p>}
              <button type="submit" style={{ marginBottom: "30px", left: "32%", border: "1px solid transparent" }}><span>{buttonText}</span></button>

              {status.message && status.message !== 'Name is required' && status.message !== 'Invalid email address' && status.message !== 'Password must be at least 8 characters long' && status.message !== 'Please select a course' &&
                <p style={{ textAlign: "center" }} className={status.success === false ? "danger" : "success"}>{status.message.message}</p>
              }
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registration;
