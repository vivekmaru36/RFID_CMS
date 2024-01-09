import React, { useEffect, useState } from 'react';

const ProfilePage = ({ rfid }) => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Fetch user profile data based on RFID from your backend
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`YOUR_BACKEND_API_ENDPOINT/${ rfid}`);
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        } else {
          console.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    // Call the function to fetch data when the component mounts
    fetchProfileData();
  }, [rfid]);

  if (!profileData) {
    return <p>Loading...</p>; // You can show a loading indicator while data is being fetched
  }

  return (
    <div className="profile-container">
      <h2>Profile Information</h2>
      <div><strong>Name:</strong> {profileData.name}</div>
      <div><strong>Email:</strong> {profileData.email}</div>
      <div><strong>RFID Number:</strong> {profileData.rfid}</div>
      {/* You can add more profile fields here */}
    </div>
  );
};

export default ProfilePage;
