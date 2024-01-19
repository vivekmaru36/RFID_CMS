import React, { useState, useEffect } from 'react';

const CreditPointsPage = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    // Fetch attendance records from the backend
    // For demonstration, I'm using a mock API call
    fetch('/api/attendance')
      .then(response => response.json())
      .then(data => setAttendanceRecords(data))
      .catch(error => console.error("Error fetching attendance records:", error));
  }, []);

  const calculateCreditPoints = () => {
    // Calculate total attendance percentage
    const totalDaysInMonth = 30; // Assuming a month has 30 days
    const totalPresentDays = attendanceRecords.filter(record => record.status === 'Present').length;
    const attendancePercentage = (totalPresentDays / totalDaysInMonth) * 100;

    // Award 2 points if attendance is at least 90%
    return attendancePercentage >= 90 ? 2 : 0;
  };

  const creditPoints = calculateCreditPoints();

  return (
    <div>
      <h2>Credit Points</h2>
      <p>Your current credit points:</p>
      <h3>{creditPoints}</h3>
    </div>
  );
};

export default CreditPointsPage;
