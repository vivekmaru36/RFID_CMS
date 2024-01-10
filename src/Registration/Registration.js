import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./registration.css";


const Registration = () => {
    const formInitialDetails = {
        firstName: '',
        lasttName: '',
        email: '',
        currentYear: '',
        password: '',
        course:'',
        numericRFID: ""

    }

    const teacherIntialDetails = {
        createdDate: "",
        updatedDate: "",
        firstName: "",
        lastName:"",
        email: "",
        rfidno: "",
        password:"",
        course:""
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

    const handleNumericRFIDChange = (e) => {
        const input = e.target.value;
        // Limit to 10 digits
        if (/^\d{0,10}$/.test(input)) {
            onFormUpdate("numericRFID",e.target.value)        
        }
    };

    const handleNumericRFIDChangeT = (e) => {
        const input = e.target.value;
        // Limit to 10 digits
        if (/^\d{0,10}$/.test(input)) {
            onFormUpdate("rfidno",e.target.value)        
        }
    } 

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

            {currentSection === 'ncp-signup' && (
                <div className="ncp-signup">
                <h2 className="mb-2 text-center text-4xl pb-10 font-bold tracking-tight  text-gray-900 ">Student Registration</h2>
                <p style={{textAlign:"center"}}>Please Provide Registration Details here.</p>

                <form onSubmit={handleSubmit} >
    
                    <input type="text" value={formDetails.firstName} placeholder="First Name" onChange={(e) => onFormUpdate('firstName', e.target.value)} />
                    <input type="text" value={formDetails.lasttName} placeholder="Last Name" onChange={(e) => onFormUpdate('lasttName', e.target.value)} />
                    <input type="text" value={formDetails.email} placeholder="Email" onChange={(e)=>onFormUpdate("email",e.target.value)}/>
                    <input type="text" value={formDetails.currentYear} placeholder="Current Year" onChange={(e)=> onFormUpdate("currentYear",e.target.value)}/>
                    <input type="text" value={formDetails.course} placeholder="Course" onChange={(e)=> onFormUpdate("course",e.target.value)}/>
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
                    <button type="submit" style={{marginBottom:"30px",left:"32%"}}><span>Register</span></button>
                    {
                    status.message &&
                        <p className={status.success === false ? "danger" : "success"}>{status.message}</p>
                    }
                </form>
              
                    
                </div>
            )}

            {currentSection === 'ncp-login' && (
                <div className="ncp-signup">
                    <h2>Teacher Registration</h2>
                    <p style={{textAlign:"center"}}>Please Provide Registration Details here.</p>
                    <form >
     
                        <input
                            type="text"
                            placeholder="First Name"
                            value={teacherIntialDetails.firstName}
                            onChange={(e) => onFormUpdate('firstName', e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder="Last Name"
                            value={teacherIntialDetails.lastName}
                            onChange={(e) => onFormUpdate('lastName', e.target.value)}
                            required
                        />
                        
                        <input
                            type="email"
                            placeholder="Email"
                            value={teacherIntialDetails.email}
                            onChange={(e) => onFormUpdate('email', e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={teacherIntialDetails.password}
                            onChange={(e) => onFormUpdate('password', e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder="Course"
                            value={teacherIntialDetails.course}
                            onChange={(e) => onFormUpdate('course', e.target.value)}
                            required
                        />

                        <input
                            type="number"
                            placeholder="RFID NO"
                            value={teacherIntialDetails.rfidno}
                            onChange={handleNumericRFIDChangeT}
                            required
                        />
                        {teacherIntialDetails.rfidno.length !== 10 && <p style={{ color: 'red',textAlign:"center",fontWeight:"bold" }}>Numeric RFID must be 10 digits</p>}

                        <button type="submit" style={{marginBottom:"30px"}}><span>Register</span></button>
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