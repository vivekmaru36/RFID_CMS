import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import axios from 'axios';
import Cookies from 'js-cookie';

const AttendancePage = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    // Fake data for demonstration
    const fakeAttendanceData = [
      { id: 1, date: '2023-01-01', subject: 'Math', teacher: 'Mr. Smith', status: 'Present', usercourse: 'Bcom', leccourse: 'cs' },
      { id: 2, date: '2023-01-02', subject: 'Science', teacher: 'Ms. Johnson', status: 'Absent', usercourse: 'Bcom', leccourse: 'cs' },
      // Add more fake data as needed
    ];

    setAttendanceRecords(fakeAttendanceData);
  }, []);

  const [userDetailsd, setUserDetails] = useState({
    fname: '',
    lname: '',
    email: '',
    course: '',
    currentYear: '',
    numericrfid: '',
    role: '',
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user-details', {
          headers: {
            Authorization: Cookies.get('token')
          }
        });

        if (response.data.success) {
          const userdata = response.data.data;
          setUserDetails({
            fname: userdata.firstName,
            lname: userdata.lastName || userdata.lasttName,
            email: userdata.email,
            course: userdata.course,
            currentYear: userdata.currentYear,
            numericrfid: userdata.numericRFID || userdata.rfidno,
            role: userdata.role,
          });
        } else {
          // Handle error state if needed
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        // Handle error state if needed
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    // Fetch attendance records only if numericRFID is available
    if (userDetailsd.numericrfid) {
      const fetchAttendanceRecords = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:5000/AttendanceRecords?numericRFID=${userDetailsd.numericrfid}`);

          if (response.data.success) {
            // Assuming response.data.attendanceRecords is an array
            const formattedAttendanceRecords = response.data.attendanceRecords.map(record => ({
              id: record._id, // Assuming _id is a unique identifier for each record
              date: new Date(record.currentTime).toLocaleDateString(), // Format date as needed
              subject: record.hardwaredetails.venue, // Assuming venue represents the subject
              teacher: record.hardwaredetails.Teacher,
              status: record.attendance ? 'Present' : 'Absent', // Assuming attendance indicates presence
              usercourse: record.details.course, // Adding user's course
              leccourse: record.hardwaredetails.course, // Adding lecture's course
            }));

            setAttendanceRecords(formattedAttendanceRecords);
          } else {
            console.error('Error fetching attendance records:', response.data.message);
          }
        } catch (error) {
          console.error('Error fetching attendance records:', error);
        }
      };

      fetchAttendanceRecords();
    }
  }, [userDetailsd.numericrfid]);

  return (
    <div className="attendance-container">
      <h2>Attendance Records</h2>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Classromm</th>
            <th>Teacher</th>
            <th>Status</th>
            <th>User Course</th>
            <th>Lecture Course</th>
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.map(record => (
            <tr key={record.id}>
              <td>{record.date}</td>
              <td>{record.subject}</td>
              <td>{record.teacher}</td>
              <td>{record.status}</td>
              <td>{record.usercourse}</td>
              <td>{record.leccourse}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendancePage;
