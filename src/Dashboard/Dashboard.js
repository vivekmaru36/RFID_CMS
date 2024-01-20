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
    { id: 'lec3', teacher: 'Ms. Geeta', subject: 'BDA', time: '2:00 PM', venue: 'CS Lab' },
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
            numericRfid: userdata.numericRfid,
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
      } else {
        setSelectedItem(item);
      }

    } catch (error) {
      console.error('Error during logout:', error);
    }
  };



  const [student, _setStudent] = useState({
    firstName: '',
    lastName: '',
    // Other student details...
  });

  const [role, setrole] = useState('');   // assigning the roles to help

  const handleTimeChange = (e, lectureId) => {
    // Handle input change and store data in state or send it to the API
    const newTime = e.target.value;
    // Update the lecture item in the state or perform API call to send the data
    // Update the lectures state with the modified lecture item
    setLectures(prevLectures =>
      prevLectures.map(lecture =>
        lecture.id === lectureId ? { ...lecture, time: newTime } : lecture
      )
    );
  };


  const handleSubjectChange = (e, lectureId) => {
    // Handle input change and store data in state or send it to the API
    const newSubject = e.target.value;
    // Update the lecture item in the state or perform API call to send the data
    setLectures(prevLectures =>
      prevLectures.map(lecture =>
        lecture.id === lectureId ? { ...lecture, subject: newSubject } : lecture
      )
    );
  };

  const handleDataSubmit = async (lectureId) => {
    // Fetch the lecture item by ID or use the stored value in state
    const lectureToUpdate = lectures.find(lecture => lecture.id === lectureId);

    try {
      // Make an API call to send the updated data for this lecture
      await axios.put('YOUR_API_ENDPOINT', {
        lectureId: lectureToUpdate.id,
        newTime: lectureToUpdate.time,
        newSubject: lectureToUpdate.subject,
        // Other relevant data to update
      });
      // Handle success or feedback if needed
    } catch (error) {
      console.error('Error updating data:', error);
      // Handle error state if needed
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
        {selectedItem && selectedItem !== 'Profile' && selectedItem !== 'Attendance' && (
          <div className="content">
            {selectedItem === 'Lectures' && (
              <div className="lecture-content">
                {lectures.map(lecture => (
                  <div key={lecture.id} className="lecture-item">
                    <h3>{lecture.subject}</h3>
                    <p>Teacher: {lecture.teacher}</p>
                    <p>Time: {lecture.time}</p>
                    <p>Venue: {lecture.venue}</p>
                  </div>
                ))}
              </div>
            )}
            {`CODE HERE for ${selectedItem}`}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
