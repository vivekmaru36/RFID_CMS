import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


const Login = () => {

  const navigate = useNavigate();
  const [status, setStatus] = useState({});


  const [rfid, setRFID] = useState('');
  const [password, setPassword] = useState('');

  const sendLogin = async () => {
    try {
      let response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
          body: JSON.stringify({
            rfid: rfid,
            password: password,
          }),
      });

      let result = await response.json();
      if (result.success) {

        Cookies.set("token",result.token);
        navigate("/dashboard");
        setStatus({ success: true, message: 'Data sent successfully'}); 
      } 
      else {
        setStatus({ success: false, message: result.message});
      }
    } catch (error) {
      console.log('Login error:', error.message);
    }
  }
  useEffect(() => {
    if (Cookies.get("token")){
      navigate("/dashboard");
    }

  }, []);
  const handleNumericRFIDChange = (e) => {
    const input = e.target.value;
    if (/^\d{0,10}$/.test(input)) {
      setRFID(input);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={sendLogin} className="login-form">
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
        {
          status.message &&
          <p style={{textAlign:"center"}}className={status.success === false ? "danger" : "success"}>{status.message}</p>
        }
      </form>
    </div>
  );
};

export default Login;
