import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';  remember this dont work cause we using reactv6

const Login = () => {

  const navigate = useNavigate(); // this helps in submiting to dashboard

  // const [id, setid]=useState('');
  const [rfid, setRFID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log(rfid);
      console.log(password);

      sendLogin();

    } catch (error) {
      console.error('Login error:', error.message);
      setError('An error occurred during login');
    }
  };

  const sendLogin = async () => {

    // const credential = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     Id:'',
    //     rfid: rfid,
    //     password: password,
    //   })

    // }
    // await (await fetch("https://localhost:44367/api/crudoperations/Login",credential)).json();

    try {
      const response = await axios.post('https://localhost:44367/api/crudoperations/Login', {
        id:'',
        rfid: rfid,
        password: password,
      });
  
      if (response.data.isSuccess) {
        // Login successful
        console.log('Login successful', response.data); // Handle successful login here
        
        // code to send the rfid and password to api
        // navigate('/dashboard', { state: { rfid, password } });
        navigate('/dashboard', { state: { rfid } });

        // navigate('/dashboard');
      } else {
        // Login failed
        console.error('Login failed', response.data); // Handle failed login here
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setError('An error occurred during login');
    }
  }
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = ''; 
    };
  }, []);

  const handleNumericRFIDChange = (e) => {
    const input = e.target.value;
    if (/^\d{0,10}$/.test(input)) {
      setRFID(input);
    }
  };

  return (
    <div className="login-container">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        <div className='login-content'>
          <div>
            <label htmlFor="rfid">RFID:</label><br></br>
            <input
              type="text"
              id="rfid"
              value={rfid}
              onChange={handleNumericRFIDChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label><br></br>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
