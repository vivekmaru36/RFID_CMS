import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

// importing axios
import axios from "axios";

const ProfilePage = ({ rfid }) => {

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
            numericRfid: userdata.numericRFID||userdata.rfidno,
            role:userdata.role,
          });

          // console.log(userDetails.numericRFID);

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


  // if (!profileData) {
  //   return <p>Loading...</p>; // You can show a loading indicator while data is being fetched
  // }

  return (
    <div className="profile-container">
      <h2>Profile Information</h2>
      <div><strong>Name:</strong> {userDetails.fname}</div>
      <div><strong>Email:</strong> {userDetails.email}</div>
      <div><strong>RFID Number:</strong> {userDetails.numericRfid}</div>
      <div><strong>Role:</strong> {userDetails.role}</div>
      {/* You can add more profile fields here */}
    </div>
  );
};

export default ProfilePage;
