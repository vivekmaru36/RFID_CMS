import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios


const Registration = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [finalYear, setFinalYear] = useState('');
  const [numericRFID, setNumericRFID] = useState('');
  const [password,setPassword]=useState('')  // new state for password
  const [course,setCourse]=useState('')  // new state for Course

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    console.log('Current Year:', currentYear);
    console.log('Final Year:', finalYear);
    console.log('Numeric RFID:', numericRFID);
    console.log('Password :', password);
    console.log('Course :', course);
    // Implement your registration logic here

    // calling submit form
    submitForm();

    // logic to give validation for rfid 
  };

  const navigate = useNavigate(); // this helps in submiting to dashboard

  const submitForm = () => {
    // Prepare the data for submission

    const formData = {
      id: "",
      createdDate: "",
      updatedDate: "",
      firstName: firstName,
      lastName: lastName,
      email: email,
      current_Year: currentYear,
      final_Year: finalYear,
      rfidno: numericRFID,
      password:password,
      course:course,
    };

    // Use Axios to send the form data
    //  https://localhost:44367/api/Registrationdata/RegDetails
    // https://localhost:44367/api/crudoperations/InsertRecord
    // https://localhost:44367/api/crudoperations/Regestration_Details
    axios.post('https://localhost:44367/api/crudoperations/Regestration_Details', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        // response.status === 200 || response.status === 201
        if (response.data.isSuccess) {
          console.log('Form data submitted successfully');
          navigate('/login');
        } else {
          console.error('Form data submission failed');
        }
      })
      .catch(error => {
        console.error('An error occurred:', error);
        // console.error('An error occurred:', response.data);
      });
  };

  const handleNumericRFIDChange = (e) => {
    const input = e.target.value;
    // Limit to 10 digits
    if (/^\d{0,10}$/.test(input)) {
      setNumericRFID(input);
    }
  };

  return (
    <div className="registration-container">
      <h2>Registration Page</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="currentYear">Current Year:</label>
          <input
            type="text"
            id="currentYear"
            value={currentYear}
            onChange={(e) => setCurrentYear(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="finalYear">Final Year:</label>
          <input
            type="text"
            id="finalYear"
            value={finalYear}
            onChange={(e) => setFinalYear(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password : </label>
          <input type="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
        </div>
        <div>
          <label htmlFor="course" style={{paddingRight: '55px'  }}>Select Course:</label>
          <select
            id="course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          >
            <option value="">Select a Course</option>
            <option value="CS">CS</option>
            <option value="BAF">BAF</option>
            <option value="IT">IT</option>
            {/* Add more options based on available courses */}
          </select>
        </div>
        <div>
          <label htmlFor="numericRFID">Numeric RFID:</label>
          <input
            type="number"
            id="numericRFID"
            value={numericRFID}
            // onChange={(e) => setNumericRFID(e.target.value)}
            onChange={handleNumericRFIDChange}
            required
          />
          {numericRFID.length !== 10 && <p style={{ color: 'red' }}>Numeric RFID must be 10 digits</p>}
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Registration;