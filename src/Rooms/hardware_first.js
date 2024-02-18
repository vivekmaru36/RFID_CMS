import React, { useState, useEffect } from 'react';

const Hardwarefirst = () => {
  const [rfidNumber, setRfidNumber] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [userIP, setUserIP] = useState('');

  useEffect(() => {
    // Check if the RFID number is 10 digits and send it
    if (rfidNumber.length === 10 && userLocation && userIP) {
      sendRfidNumberWithLocationAndIP(rfidNumber, userLocation, userIP); // Replace with your actual function to send the number
      setRfidNumber(''); // Reset the RFID number after sending
    }
  }, [rfidNumber, userLocation, userIP]);

  const sendRfidNumberWithLocationAndIP = (number, location, ip) => {
    // Replace this with your logic to send the RFID number, location, and IP to the server
    console.log('Sending RFID number:', number, 'with location:', location, 'and IP:', ip);
    // You can make an API call here to send the number, location, and IP to your server
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        error => {
          console.error('Error getting user location:', error);
          setUserLocation(null);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setUserLocation(null);
    }
  };

  const fetchUserIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setUserIP(data.ip);
    } catch (error) {
      console.error('Error fetching user IP:', error);
      setUserIP('');
    }
  };

  useEffect(() => {
    handleLocation(); // Fetch user location when component mounts
    fetchUserIP(); // Fetch user IP when component mounts
  }, []);

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
      {userLocation && (
        <p>
          User Location: Latitude - {userLocation.latitude}, Longitude - {userLocation.longitude}
        </p>
      )}
      {userIP && (
        <p>User IP Address: {userIP}</p>
      )}
    </div>
  );
};

export default Hardwarefirst;