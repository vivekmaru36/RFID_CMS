import React from 'react';
import "./home.css";
import DisplayLottie from "./DisplayLottie";
import codingPerson from "./codingPerson";
import {Fade} from "react-reveal";
import landingPerson from "./landingPerson";
import splashAnimation from "./splashAnimation.json";

const Home = () => {


  const Group = {
    title: "What We do .",
    subTitle: 
    "Welcome to Our Campus Management System \na cutting-edge solution designed to streamline and enhance every aspect of campus administration.",
    
    subTitleRight:
    "Welcome to Our Campus Management System \na cutting-edge solution designed to streamline and enhance every aspect of campus administration.",
  
  };
  return (
    <div className='home-page'>
      <h2>Welcome to Our Campus Management System</h2>
      <div className="svg-design">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="16.6 44.02 157.75 121.75" className="absolute -z-10 py-8  w-[20rem] md:w-[32rem] xl:w-[32rem]"><path fill="blue" d="M52.8,-47.3C66.7,-38.9,75.1,-19.4,74.3,-0.8C73.5,17.9,63.6,35.8,49.7,48.3C35.8,60.8,17.9,67.9,2.7,65.2C-12.6,62.6,-25.1,50.1,-41.5,37.6C-57.9,25.1,-78.2,12.6,-82.5,-4.3C-86.8,-21.2,-75.2,-42.4,-58.8,-50.8C-42.4,-59.3,-21.2,-55,-0.9,-54.1C19.4,-53.2,38.9,-55.8,52.8,-47.3Z" transform="translate(100 100)"></path></svg>
      </div>
      <div className='content'  style={{backgroundColor:"transparent",boxShadow:"none",}}>
          <Fade left duration={1000}>
            <div className='skills-image-div'>
              <DisplayLottie animationData={codingPerson} />
            </div>
          </Fade>
          <Fade right duration={1000}>
            <div className="skills-text-div">
              <h1
                className={"skills-heading"}
              >
                {Group.title}{" "}
              </h1>
              <p
                className={
                  "subTitle skills-text-subtitle"
                }
              >
                {Group.subTitle}
              </p>
            </div>
          </Fade>

          <Fade right duration={1000}>
            <div className="greeting-image-div">
                <DisplayLottie animationData={landingPerson} />
            </div>
          </Fade>

            <div className='Tech'>
              <h1>Tech We Use</h1>
              <p>
                Add Some description here
              </p>
            </div>

          <div className="rfid">
            <h1>What is Rfid?</h1>  
          </div>

          <Fade left>
            <div className="build-image-div">
              <DisplayLottie animationData={splashAnimation} />
            </div>
          </Fade> 
          
          <div className="build-image-div rfid-Text">
            <p>
              Radio Frequency Identification (RFID) refers to a wireless system comprised of two components: tags and readers. The reader is a device that has one or more antennas that emit radio waves and receive signals back from the RFID tag.
            </p>
          </div>
        
        

      </div>
      
    </div>
    
  );
};

export default Home;
