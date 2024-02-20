import React, { useState } from 'react';
import "./registration.css";
import Cookies from 'js-cookie';
/* import useAuth from "./context/useAuth";*/
import { useNavigate } from "react-router-dom";



const Registration = () => {
    /* const [otp,setOtp] = useState(null);
    const auth = useAuth(); */

    const navigate = useNavigate();

    const formInitialDetails = {
      firstName: '',
      lasttName: '',
      email: '',
      currentYear: '',
      password: '',
      course:'',
      numericRFID: ""
    }
    const [formDetails, setFormDetails] = useState(formInitialDetails);
    const onFormUpdate = (category, value) => {
      setFormDetails({
        ...formDetails,
        [category]: value
      })
    }

    /* ------------------------ STUDENT DETAILS ------------------ */

    const handleSubmit = async (e) => {
      e.preventDefault();
      setButtonText("Sending...");
      
      try{
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

          if (result.token){
            Cookies.set("token",result.token);
            navigate("/otp");
          }
          else{
            navigate("/registration");
          }

          setStatus({ success: true, message: 'Data sent successfully'});
        } else {
            setStatus({ success: false, message: result.message});
        }
      }catch(error){
        console.log("Error",error);
      }
      finally{
        setButtonText("Singup");
      }
      
    };

    

    const [buttonText, setButtonText] = useState('Sign Up');
    const [status, setStatus] = useState({});
    
    /* TEACHER DETAILS  */
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [numericRFID, setNumericRFID] = useState('');
    const [password,setPassword]=useState('')
    const [course, setCourse]=useState('')

    const teacherSubmit = async (e) => {
      e.preventDefault();
      setButtonText("Sending...");

      const formData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        rfidno: numericRFID,
        password:password,
        course:course,
      };
      
      try{
        let response = await fetch("http://127.0.0.1:5000/tsignup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
          body: JSON.stringify(formData),
        });
        let result = await response.json();

        if (result.success) {

          if (result.token){
            Cookies.set("token",result.token);
            navigate("/otp");
          }
          else{
            navigate("/registration");
          }

          setStatus({ success: true, message: 'Data sent successfully'});
        } 
        else {
          setStatus({ success: false, message: result.message});
        }
      }catch(error){
        console.log("Error",error);
      }
      finally{
        setButtonText("Singup");
      }
      
    };

    const [currentSection, setCurrentSection] = useState('ncp-signup');

    const handleNumericRFIDChange = (e) => {
        const input = e.target.value;
        // Limit to 10 digits
        if (/^\d{0,10}$/.test(input)) {
            onFormUpdate("numericRFID",e.target.value)        
        }
    };

    const handleNumericRFIDChangeT = (e) => {
      const input = e.target.value;
      if (/^\d{0,10}$/.test(input)) {
        setNumericRFID(input);
      }
    };
  

  return (
    <div className="container-manual">
        <div className="btn-grp" style={{position:"relative",left:"30%",top:"20%",zIndex:"1"}}>
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
                <p style={{textAlign:"center"}}>Please Provide Registration Details here.</p>
                <form onSubmit={handleSubmit} >
                  <input type="text" value={formDetails.firstName} placeholder="First Name" onChange={(e) => onFormUpdate('firstName', e.target.value)} />
                  <input type="text" value={formDetails.lasttName} placeholder="Last Name" onChange={(e) => onFormUpdate('lasttName', e.target.value)} />
                  <input type="text" value={formDetails.email} placeholder="Email" onChange={(e)=>onFormUpdate("email",e.target.value)}/>
                  <input type="text" value={formDetails.currentYear} placeholder="Current Year" onChange={(e)=> onFormUpdate("currentYear",e.target.value)}/>
                  <select id="course" value={formDetails.course} onChange={(e) => onFormUpdate("course", e.target.value)}>
                  <option value="">Select Course</option>
                  <option value="CS">Computer Science</option>
                  <option value="BDA">Big Data Analytics</option>
                  </select>
                  <input type="password" value={formDetails.password} placeholder="Password" onChange={(e)=> onFormUpdate("password",e.target.value)}/>
                  <input
                    type="number"
                    id="numericRFID"
                    value={formDetails.numericRFID}
                    placeholder="RFID"
                    onChange={handleNumericRFIDChange}
                    required
                  />
                  {formDetails.numericRFID.length !== 10 && <p style={{ color: 'red',textAlign:"center",fontWeight:"bold" }}>Numeric RFID must be 10 digits</p>}
                  <button type="submit" style={{marginBottom:"30px",left:"32%"}}><span>{buttonText}</span></button>

                  {
                  status.message &&
                      <p style={{textAlign:"center"}}className={status.success === false ? "danger" : "success"}>{status.message}</p>
                  }
                </form>
                </div>
            )}

            {/* --------- TEACHER SIGNUP  ------------ */}
        
            {currentSection === 'ncp-login' && (
              <div className="ncp-signup">
                  <h2>Teacher Registration</h2>
                  <p style={{textAlign:"center"}}>Please Provide Registration Details here.</p>
                  <form onSubmit={teacherSubmit}>
                    
                    <input type="text" placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    <input type="text" placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                    <select id="course" value={course} onChange={(e) => setCourse(e.target.value)}>
                      <option value="">Select Course</option>
                      <option value="CS">Computer Science</option>
                      <option value="BDA">Big Data Analytics</option>
                    </select>
                    <input type="number" placeholder="RFID NO" value={numericRFID} onChange={handleNumericRFIDChangeT} required/>
                    {numericRFID.length !== 10 && <p style={{textAlign:"center", color: 'red' }}>Numeric RFID must be 10 digits</p>}
                    <button type="submit" style={{marginBottom:"30px",left:"32%",border:"1px solid transparent"}}><span>{buttonText}</span></button>
                    {
                    status.message &&
                      <p style={{textAlign:"center"}}className={status.success === false ? "danger" : "success"}>{status.message.message}</p>
                    }
                  </form>
              </div>
            )}

        </div>
        </div>
  );
};

export default Registration;