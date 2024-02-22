// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home/Home';
import About from './About';
import Signup from './Signup';
import Login from './Login';
import Registration from './Registration/Registration';
import Navbar from './Navbar/Navbar';
import Dashboard from './Dashboard/Dashboard';
import LogoutPage from './Dashboard/LogoutPage';
import Verified from './VerificationComplete/VerificationComplete';


import './App.css';
import './Navbar.css';
import './Dashboard/Dashboard.css';
import { Banner } from "./Banner/Banner"
import Otp from "./otp/Otp"
import PrivateRoute from "./privateRoute";

import Lecture from './Dashboard/lecture'

// importing room url for rfid for Hardware room
import Hardwarefirst from './Rooms/hardware_first';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from "axios";

const App = () => {
  const currentPath = window.location.pathname;

  const [userinfo, setUserinfo] = useState({
    fname: '',
    lname: '',
    email: '',
    course: '',
    currentYear: '',
    numericRfid: '',
    role: '',
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user-details', {
          headers: {
            Authorization: Cookies.get('token') // Include the token in the request headers
          }
        });

        // console.log('User details response:', response.data.data);

        if (response.data.success) {
          // setUserDetails(response.data.data);
          const userdata = response.data.data;

          console.log(userdata)

          // updating the userdetails
          setUserinfo({
            fname: userdata.firstName,
            lname: userdata.lastName || userdata.lasttName,
            email: userdata.email,
            course: userdata.course,
            currentYear: userdata.currentYear,
            numericRfid: userdata.numericRFID || userdata.rfidno,
            role: userdata.role,
          });

          // console.log(userDetails.numericRFID);

        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        // Handle error state if needed
      }
    };


    fetchUserDetails();
  }, []);
  return (
    <>

      <Router>
        <div>
          {currentPath !== '/dashboard' && currentPath !== '/lec' && currentPath !== '/HardwareRoom' && <Navbar />} {/* Hide navbar on dashboard */}
          <div className="container">
            <Routes>
              <Route path="/" element={<div><Banner /><Home /></div>} />
              {/* <Route path='/otp' element={<Otp/>} />
                <Route path="/dashboard" element={<Dashboard />} exact /> */}

              <Route element={<PrivateRoute />}>
                <Route path='/otp' element={<Otp />} />
                <Route path="/dashboard" element={<Dashboard userinfo={userinfo} />} exact />
                <Route path="/verified" element={<Verified />} />
                {/* lecture route */}
                <Route path="/lec" element={<Lecture userinfo={userinfo} />} />

              </Route>


              <Route path="/about" element={<About />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/logout" element={<LogoutPage />} />

              <Route path="/HardwareRoom" element={<Hardwarefirst />} />

            </Routes>
          </div>
        </div>
      </Router>


    </>
  );
};

export default App;
