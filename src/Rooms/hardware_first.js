import React, { useState, useEffect } from 'react';

const Hardware_First = () => {
  const [rfidNumber, setRfidNumber] = useState('');

  useEffect(() => {
    // Simulate RFID card swipe event
    const simulateRfidSwipe = () => {
      const randomTenDigitNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      setRfidNumber(randomTenDigitNumber);
    };

    // Start simulating RFID card swipes
    const intervalId = setInterval(simulateRfidSwipe, 5000); // Change this to match your RFID reader behavior

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Only run this effect once on mount

  useEffect(() => {
    // Check if the RFID number is 10 digits and send it
    if (rfidNumber.length === 10) {
      sendRfidNumber(rfidNumber); // Replace with your actual function to send the number
    }
  }, [rfidNumber]);

  const sendRfidNumber = (number) => {
    // Replace this with your logic to send the RFID number to the server
    console.log('Sending RFID number:', number);
    // You can make an API call here to send the number to your server
  };

  return (
    <div>
      <h2>RFID Form</h2>
      <input
        type="text"
        value={rfidNumber}
        onChange={(e) => setRfidNumber(e.target.value)}
        placeholder="Swipe RFID card..."
        autoFocus
      />
      <p>Current RFID Number: {rfidNumber}</p>
    </div>
  );
};

export default Hardware_First;