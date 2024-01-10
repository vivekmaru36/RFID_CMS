import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import "./otp.css";

export default function App() {
  const [otp, setOtp] = useState('');

  return (
    <div className="container-otp">
      <div className="otp-box">
        <OtpInput
          className="otp"
          value={otp}
          onChange={setOtp}
          numInputs={4}
          renderSeparator={<span>-</span>}
          renderInput={(props) => <input {...props} />}
          inputStyle={{width:"45px",height:"50px",borderRadius:"7px",
            border:"2px solid black",background:"transparent",
            fontSize:"30px"}}
          />
    </div>
    </div>
     
    
  );
}