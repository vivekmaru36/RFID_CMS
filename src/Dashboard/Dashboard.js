import React, { useState, useEffect } from 'react';  // importing useffect
import './Dashboard.css';
import ProfilePage from './ProfilePage'; // Assuming you create a separate ProfilePage component
import AttendancePage from './AttendancePage'; // Import the AttendancePage component
import Cookies from 'js-cookie';

// importing axios
import axios from "axios";

// importing location to access navigate
import { useLocation } from 'react-router-dom';

// importing navigate to redirect to logout
import { useNavigate } from 'react-router-dom';

import Lecture from './lecture'

const Dashboard = () => {

  // navigate initialization
  const navigate = useNavigate()

  // accesing the state variable for api
  const location = useLocation();
  const { state } = location;

  const [selectedItem, setSelectedItem] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lectures, setLectures] = useState([
    { id: 'lec1', teacher: 'Mr. Aditya', subject: 'ML', time: '10:00 AM', venue: 'Hardware Lab' },
    { id: 'lec2', teacher: 'Ms. Beena', subject: 'CSF', time: '12:00 PM', venue: '1 Law' },
  ]);

  const handleMenuClick = () => {
    const newIsMenuOpen = !isMenuOpen;
    setIsMenuOpen(newIsMenuOpen);
    console.log('handleMenuClick called. isMenuOpen:', newIsMenuOpen);
  };

  const [userDetails, setUserDetails] = useState({
    fname: '',
    lname: '',
    email: '',
    course: '',
    currentYear: '',
    numericRfid: '',
    role:'',
  });
  // http://localhost:5000/userdetails
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user-details', {
          headers: {
            Authorization: Cookies.get('token') // Include the token in the request headers
          }
        });

        // console.log('User details response:', response.data.data);
        // console.log('User details response:', response);

        if (response.data.success) {
          // setUserDetails(response.data.data);
          const userdata = response.data.data;

          console.log(userdata)

          // updating the userdetails
          setUserDetails({
            fname: userdata.firstName,
            lname: userdata.lastName || userdata.lasttName,
            email: userdata.email,
            course: userdata.course,
            currentYear: userdata.currentYear,
            numericRfid: userdata.numericRfid||userdata.rfidno,
            role:userdata.role
          });

          // console.log(userDetails.course)

        } else {
          // Handle error state if needed
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        // Handle error state if needed
      }
    };

    fetchUserDetails();
  }, []); // Fetch user details whenever relods

  const handleItemClick = (item) => {
    try {
      // code to redirect when logout:
      if (item === 'Logout') {
        axios.post('http://localhost:5000/logout')
          .then(response => {
            if (response.data.success) {
              // Clear the token from the client-side as well
              Cookies.remove("token");
              // Redirect to the login page after successful logout
              navigate('/')
            }
          })
      }
      // else if (item === 'Lectures') {
      //   // Redirect to the "Lectures" page
      //   navigate('/lec'); 
      // }
      else {
        setSelectedItem(item);
      }

    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="greeting">
        <h2>Hello, {userDetails.fname} {userDetails.lname}</h2>
      </div>
      <button className="menu-button" onClick={handleMenuClick}>
        <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`}></div>
        <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`}></div>
        <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`}></div>
      </button>
      {isMenuOpen && (
        <div className="dashboard-items">
          <div className="item" onClick={() => handleItemClick('Profile')}>Profile</div>
          <div className="item" onClick={() => handleItemClick('Attendance')}>Attendance</div>
          <div className="item" onClick={() => handleItemClick('Lectures')}>Lectures</div>
          <div className="item" onClick={() => handleItemClick('Credit Points')}>Credit Points</div>
          <div className="item" onClick={() => handleItemClick('Pay')}>Pay</div>
          <div className="item" onClick={() => handleItemClick('Logout')}>Logout</div>
        </div>
      )}

      <div className={`content-area ${isMenuOpen ? 'open' : ''}`}>
        {selectedItem === 'Profile' && <ProfilePage />}
        {selectedItem === 'Attendance' && <AttendancePage />} {/* Display AttendancePage when 'Attendance' is selected */}
        {selectedItem === 'Lectures' && <Lecture userDetails={userDetails} />} {/* Display Lecture when 'lecture' is selected */}
      </div>

    </div>
  );
};

export default Dashboard;
