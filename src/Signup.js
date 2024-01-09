// Signup.js
import React, { useState } from 'react';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate signup logic (replace this with your actual signup API call)
    console.log('Form submitted:', formData);

    // Reset the form after submission
    setFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
      <div className="signup" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    
        <form
          onSubmit={handleSubmit}
          className="signup-form"
        >
          <h2 style={{fontSize:"50px"}}>Sign Up</h2>
          <div className='signup-content'>
            <label >
              Username<br></br>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required />
            </label>
            <br />
            <label>
              Email<br></br>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </label>
            <br />
            <label>
              Password<br></br>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </label>
            
            <br />
          </div>
          <button type="submit">Sign Up</button>

        </form>
      </div>
  );
};

export default Signup;
