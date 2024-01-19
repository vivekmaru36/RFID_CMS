import React from 'react';
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
// imports for teacher
import RegistrationT from './Regestration_teacher/RegestrationT';

import './App.css';
import './Navbar.css';
import './Dashboard/Dashboard.css';
import {Banner} from "./Banner/Banner"
import Otp from "./otp/Otp"
import PrivateRoute from "./privateRoute";

const App = () => {
  const currentPath = window.location.pathname;

  return (
    <>
   
        <Router>
          <div>
            {currentPath !== '/dashboard' && <Navbar />} {/* Hide navbar on dashboard */}
            <div className="container">
              <Routes>
                <Route path="/" element={<div><Banner /><Home /></div>} />
                {/* <Route path='/otp' element={<Otp/>} />
                <Route path="/dashboard" element={<Dashboard />} exact /> */}

                <Route element={<PrivateRoute/>}>
                  <Route path='/otp' element={<Otp/>} />
                  <Route path="/dashboard" element={<Dashboard />} exact />
                  <Route path="/verified" element={<Verified />} />

                </Route>


                <Route path="/about" element={<About />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/Register_T" element={<RegistrationT/>} />
                
              </Routes>
            </div>
          </div>
      </Router>
    
      
    </>
  );
};

export default App;
