import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import "./registration.css";
import { Container, Row, Col } from "react-bootstrap";
import Form from 'react-bootstrap/Form';


const Registration = () => {
    const formInitialDetails = {
        firstName: '',
        lasttName: '',
        email: '',
        currentYear: '',
        collegename: '',
        dob: '',
        password: ''

    }
    const [formDetails, setFormDetails] = useState(formInitialDetails);
    const [buttonText, setButtonText] = useState('Sign Up');
    const [status, setStatus] = useState({});
    
    const onFormUpdate = (category, value) => {
        setFormDetails({
          ...formDetails,
          [category]: value
        })
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setButtonText("Sending...");
      let response = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(formDetails),
      });
      setButtonText("Send");
      let result = await response.json();
      setFormDetails(formInitialDetails);
      if (result.code == 200) {
        setStatus({ succes: true, message: 'Data sent successfully'});
      } else {
        setStatus({ succes: false, message: 'Something went wrong, please try again later.'});
      }
    };

    const [currentSection, setCurrentSection] = useState('ncp-signup');

  return (
    <div className="container-manual">
        <div className="btn-grp" style={{position:"relative",left:"28%",top:"20%",zIndex:"1"}}>
            <button type="button" className={`btn btn-primary ${currentSection === 'ncp-signup' ? 'active-signup' : ''}`} onClick={() => setCurrentSection('ncp-signup')}>
                Student Registration
            </button>
            <button type="button" className={`btn btn-primary ${currentSection === 'ncp-login' ? 'active-signup' : ''}`} onClick={() => setCurrentSection('ncp-login')}>
                Teacher Registration
            </button>

        </div>

        <div className="cont" style={{ overflow: 'auto' }}>

            {currentSection === 'ncp-signup' && (
                <div className="ncp-signup">
                <h2 className="mb-2 text-center text-4xl pb-10 font-bold tracking-tight  text-gray-900 ">Student Registration</h2>
                <Container>
                    <form onSubmit={handleSubmit}>
                        <input type="text" value={formDetails.firstName} placeholder="First Name" onChange={(e) => onFormUpdate('firstName', e.target.value)} />
                        <input type="text" value={formDetails.lasttName} placeholder="Last Name" onChange={(e) => onFormUpdate('lastName', e.target.value)}/>
                        <input type="text" value={formDetails.email} placeholder="Email" onChange={(e)=>onFormUpdate("email",e.target.value)}/>
                        <input type="text" value={formDetails.currentYear} placeholder="Current Year" onChange={(e)=> onFormUpdate("currentYear",e.target.value)}/>
                        <input type="text" value={formDetails.currentYear} placeholder="Current Year" onChange={(e)=> onFormUpdate("currentYear",e.target.value)}/>

                    </form>

                </Container>
                    
                </div>
            )}

            {currentSection === 'ncp-login' && (
                <div className="ncp-signup">
                    <h2>Teacher Registration</h2>
                    <p>Please enter your details to log in.</p>
                    <form >
                        <input type="text" value={formDetails.ncpid} placeholder="NCP ID" onChange={(e) => onFormUpdate('ncpid', e.target.value)} />
                        <input type="password" value={formDetails.password} placeholder="password" onChange={(e) => onFormUpdate('password', e.target.value)}/>
                        <br></br>
                        <button type="submit"><span>Login</span></button>
                        {
                        status.message &&
                            <p className={status.success === false ? "danger" : "success"}>{status.message}</p>
                        }
                    </form>
                </div>
            )}

            {currentSection === 'cc-login' && (
                <div className="ncp-signup">
                    <h2>CC LOGIN</h2>
                    <p>Please enter your details to log in.</p>
                    <form >
                        <input type="text" value={formDetails.ccid} placeholder="CC ID" onChange={(e) => onFormUpdate('ncpid', e.target.value)} />
                        <input type="password" value={formDetails.password} placeholder="password" onChange={(e) => onFormUpdate('password', e.target.value)}/>
                        <br></br>
                        <button type="submit"><span>Login</span></button>
                        {
                        status.message &&
                            <p className={status.success === false ? "danger" : "success"}>{status.message}</p>
                        }
                    </form>
                </div>
            )}

        </div>
        </div>
  );
};

export default Registration;