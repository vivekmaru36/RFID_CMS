import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import './otp.css';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

export default function App() {
  const [otp, setOtp] = useState('');
  const [buttonText, setButtonText] = useState('Submit');
  const [status, setStatus] = useState({});
  const [error,setError] = useState("");


  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set button text to "Sending..."
    setButtonText('Sending...');

    const token = Cookies.get("token");
    setError("Error");

    try {
      let response = await fetch('http://127.0.0.1:5000/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ otp,token }),
      });

      let result = await response.json();

      if (result.success) {
        console.log(result.token);
        
        setStatus({
          success: true,
          message: 'Data sent successfully',
        });

        navigate("/verified");

      } 
      else {
        setStatus({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Reset button text to "Submit" after the request is complete
      setButtonText('Submit');
    }
  };

  return (
    <div className="container-otp">
      <div className="otp-box">
        <form onSubmit={handleSubmit}>
          <OtpInput
            className="otp"
            value={otp}
            onChange={setOtp}
            numInputs={4}
            renderSeparator={<span>-</span>}
            renderInput={(props) => <input {...props} />}
            inputStyle={{
              width: '45px',
              height: '50px',
              borderRadius: '7px',
              border: '2px solid black',
              background: 'transparent',
              fontSize: '30px',
            }}
          />
          <button
            type="submit"
            style={{
              marginBottom: '30px',
              left: '8%',
              marginTop: '35px',
            }}
          >
            <span>{buttonText}</span>
          </button>

          {
            status.message &&
            <p style={{textAlign:"center",fontSize:"30px"}}className={status.success === false ? "danger" : "success"}>{status.message}</p>
          }
        </form>
      </div>
    </div>
  );
}
