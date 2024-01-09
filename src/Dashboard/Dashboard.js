import React, { useState, useEffect } from 'react';  // importing useffect
import './Dashboard.css';
import ProfilePage from './ProfilePage'; // Assuming you create a separate ProfilePage component
import AttendancePage from './AttendancePage'; // Import the AttendancePage component

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

  // Access rfid and password from state object
  const { rfid } = state || {};
  // console.log(state);
  // console.log(rfid);
  // console.log(password);

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

  const handleItemClick = (item) => {
    // code to redirect when logout :
    if (item === 'Logout') {
      navigate('/')
    } else {
      setSelectedItem(item);
    }
  };

  const [student, _setStudent] = useState({
    firstName: '',
    lastName: '',
    // Other student details...
  });

  // const [fetchedData, setFetchedData] = useState(null);
  // // this function is responsible for storing fetch data
  // const handlefetchData=()=>{
  //   axios
  //     .get('https://localhost:44367/api/crudoperations/GetRecordByRfid')
  //     .then((response)=>{
  //       // setting the fetching data in the state
  //       setFetchedData(response.data);
  //       // storing each one

  //     })
  // }

  const [role, setrole] = useState('');   // assigning the roles to help
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:44367/api/crudoperations/GetRecordByRfid', {
          params: {
            rfid: rfid // Pass the RFID value as a parameter
          }
        });

        // Check if the response data exists and has at least one student object
        if (response.data && response.data.data && response.data.data.length > 0) {
          const fetchedStudent = response.data.data[0]; // Get the first student from the API response

          // Update the student state with the fetched student's information
          _setStudent({
            firstName: fetchedStudent.firstName,
            lastName: fetchedStudent.lastName,
            // Add other student details as needed
          });

          // update the role
          setrole('student');
          console.log(role)
        }
        else if (response.data && response.data.data2 && response.data.data2.length > 0) {
          const fetchedStudent = response.data.data2[0]; // Get the first student from the API response
          // Update the student state with the fetched student's information
          _setStudent({
            firstName: fetchedStudent.firstName,
            lastName: fetchedStudent.lastName,
            // Add other student details as needed
          });

          // update the role
          setrole('teacher');
          console.log(role)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error state if needed
      }
    };

    fetchData();
  }, [role], [rfid]);

  // Function to log student details when the state updates
  const logStudentDetails = () => {
    console.log('Student details:', student.firstName);
  };

  useEffect(() => {
    logStudentDetails();
  }, [student]);

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

  // const handleTimeSubmit = async (lectureId) => {
  //   // Fetch the lecture item by ID or use the stored value in state
  //   const lectureToUpdate = lectures.find(lecture => lecture.id === lectureId);

  //   try {
  //     // Make an API call to send the updated time for this lecture
  //     await axios.put('YOUR_API_ENDPOINT', {
  //       lectureId: lectureToUpdate.id,
  //       newTime: lectureToUpdate.time,
  //       // Other relevant data to update
  //     });
  //     // Handle success or feedback if needed
  //   } catch (error) {
  //     console.error('Error updating time:', error);
  //     // Handle error state if needed
  //   }
  // };

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
        <h2>Hello, {student.firstName} {student.lastName}</h2>
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
                    {/* <p>Teacher: {lecture.teacher}</p> */}
                    {role === 'teacher' ? (
                      <div>
                        <input
                          type="text"
                          placeholder="Enter Time"
                          // Handle input change and store data in state or send it to the API
                          onChange={(e) => handleTimeChange(e, lecture.id)}
                        />
                        <input
                          type="text"
                          placeholder="Enter Subject"
                          // Handle input change and store data in state or send it to the API
                          onChange={(e) => handleSubjectChange(e, lecture.id)}
                        />
                        <button onClick={() => handleDataSubmit(lecture.id)}>Submit</button>
                      </div>
                    ) : (
                      <p>Time: {lecture.time}</p>
                    )}
                    <p>Time: {lecture.time}</p>
                    <p>Subject: {lecture.subject}</p>
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
