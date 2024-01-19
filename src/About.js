import React from 'react'; 
import overlay_image from "./images/conny-schneider-pREq0ns_p_E-unsplash (2).png";

const About = () => {
    return (
      <div className='about-us-container'>
        <div className="about-us-overlay">
          <img className="overlay-image" src={overlay_image} alt= "" />
          <div className="overlay-content">
            <span>
              <h3 className="about-us-heading">About Us</h3>
            </span>
          </div>
        </div>
        <div className="about-us-content">
          <div className='heading-content' >
            <p>Welcome to <b>Group 14</b></p>
          </div>
          <div className="content">
            <p>the innovators behind the RFID-based Campus Management System. We are driven by a passion for transforming traditional campus operations and paving the way for a more efficient and secure educational environment.</p>

            <p>Our RFID-based solution is designed to redefine how educational institutions manage their day-to-day activities. By harnessing the power of RFID technology, we aim to streamline processes, enhance security, and provide valuable insights for administrators, educators, and students alike.</p>

            <p><b>Key Features:</b></p>
            <ul style={{color:"#ffdd40"}}>
              <li><b>Automated Attendance:</b>  Our system simplifies attendance tracking with RFID-enabled cards or tags, reducing manual efforts and ensuring accuracy.</li>
              <br></br>
              <li><b>Access Control:</b>  Enhance campus security by implementing RFID-based access control, restricting entry to authorized personnel only.</li>
              <br></br>
              <li><b>Efficient Resource Management:</b>  From library books to equipment, our platform facilitates easy tracking and management of campus resources.</li>
              <br></br>
              <li><b>Data-Driven Insights:</b>  Gain valuable insights through real-time data analytics, enabling informed decision-making for administrators.</li>
            </ul>

            <p>At [Group 14], our mission is to empower educational institutions with technology that not only meets their current needs but also anticipates future challenges. We believe in creating solutions that foster a dynamic and innovative learning environment.</p>

            <p>Thank you for choosing [Group 14] as your partner in advancing campus management. If you have any questions or would like to explore how our RFID-based system can benefit your institution, please don't hesitate to reach out. We are excited to be part of your journey towards a smarter and more connected campus!</p>
          </div>
          
        </div>
        

      </div>
      
      
    );
  };
    

export default About;
