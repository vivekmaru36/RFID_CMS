// AttendancePage.js

import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const AttendancePage = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    // Fake data for demonstration
    const fakeAttendanceData = [
      { id: 1, date: '2023-01-01', subject: 'Math', teacher: 'Mr. Smith', status: 'Present' },
      { id: 2, date: '2023-01-02', subject: 'Science', teacher: 'Ms. Johnson', status: 'Absent' },
      // Add more fake data as needed
    ];

    setAttendanceRecords(fakeAttendanceData);
  }, []);

  return (
    <div className="attendance-container">
      <h2>Attendance Records</h2>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Subject</th>
            <th>Teacher</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.map(record => (
            <tr key={record.id}>
              <td>{record.date}</td>
              <td>{record.subject}</td>
              <td>{record.teacher}</td>
              <td>{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendancePage;
