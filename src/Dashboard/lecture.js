import React, { useState, useEffect } from 'react';
import axios from 'axios';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { addDays, setHours, setMinutes } from 'date-fns';

const Lecture = ({ userDetails }) => {
  const [lectures, setLectures] = useState([
    { id: 'lec1', teacher: 'Mr.Aditya', subject: 'CS', etime: '1:00 PM', stime: '2:00 PM', venue: 'Hardware Lab' },
    { id: 'lec2', teacher: 'Ms. Beena', subject: 'BDA', etime: '1:00 PM', stime: '2:00 PM', venue: '1 Law' }
  ]);

  const [role, setRole] = useState(userDetails && userDetails.role);
  const [teacher, setTeacher] = useState("");
  const [sTime, setSTime] = useState("");
  const [eTime, setETime] = useState("");
  const [course, setcourse] = useState(userDetails.course);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:5000/setlec", {
        Teacher: userDetails.fname,
        sTime: new Date().toISOString(), // Convert to UTC before sending
        eTime: new Date(eTime).toISOString(), // Convert to UTC before sending
        course: course,
        subject:Subject
      });

      console.log("Hardware update submitted successfully:", response.data);

      setTeacher("");
      setSTime("");
      setETime("");
    } catch (error) {
      console.error("Error submitting hardware update:", error);
    }
  };

  const [hardwareDetails, setHardwareDetails] = useState({
    Teacher: '',
    currentTime: '',
    eTime: '',
    sTime: '',
    Venue: '',
    course: '',
  });
  const currentWorldTime = new Date();
  useEffect(() => {
    const fetchHardwareDetails = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/getlec1');
        if (response.data.success) {
          const hdata = response.data.hardwaredetails;
          setHardwareDetails({
            Teacher: hdata.Teacher,
            currentTime: hdata.currentTime,
            eTime: hdata.eTime,
            sTime: hdata.sTime,
            Venue: hdata.venue,
            course: hdata.course,
          });

          // Check if eTime has passed from the current time

          const eTimeUTC = new Date(hdata.eTime);

          if (currentWorldTime > eTimeUTC) {
            // Call the delete API
            handleAutoDel();
          }
        } else {
          console.error('Error fetching hardware details:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching hardware details:', error);
      }
    };

    fetchHardwareDetails();
  }, []);

  useEffect(() => {
    setLectures((prevLectures) => [
      {
        ...prevLectures[0],
        teacher: hardwareDetails.Teacher,
        subject: userDetails.course,
        stime: hardwareDetails.sTime,
        etime: hardwareDetails.eTime,
      },
      ...prevLectures.slice(1),
    ]);
  }, [hardwareDetails]);

  function convertToIST12HourFormatWithDate(timestampString) {
    // Parse the input timestamp string
    const timestampUTC = new Date(timestampString);

    console.log(timestampUTC);

    // // Set the time zone to Indian Standard Time (IST)
    // timestampUTC.setUTCHours(timestampUTC.getUTCHours() + 5);
    // timestampUTC.setUTCMinutes(timestampUTC.getUTCMinutes() + 30);

    // Format the date and time in 12-hour format with AM/PM
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'short',
      minute: 'short',
      second: 'short',
      hour12: true,
    };
    const istTime12HourFormatWithDate = timestampUTC.toLocaleString('en-US',);

    return istTime12HourFormatWithDate;
  }

  // logic to display form only to respective teachers
  // const showForm = hardwareDetails && hardwareDetails.Teacher === userDetails.fname;
  const showForm = (hardwareDetails && hardwareDetails.Teacher === userDetails.fname) || !lectures.some(lecture => lecture.teacher === userDetails.fname && lecture.venue !== '');

  // logic to force del venue allotment
  const handleDelete = async () => {
    try {
      const response = await axios.delete("http://127.0.0.1:5000/deletelec", {
        data: {
          fname: userDetails.fname,
        },
      });

      console.log("Lecture deleted successfully:", response.data);
    } catch (error) {
      console.error("Error deleting lecture:", error);
    }
  };

  const handleAutoDel = async () => {
    try {
      const response = await axios.delete("http://127.0.0.1:5000/autodeletelec", {
        data: {
          etime: hardwareDetails.eTime,
        },
      });

      console.log("Lecture deleted successfully:", response.data);
    } catch (error) {
      console.error("Error deleting lecture:", error);
    }
  };

  // pick Date
  const [startDate, setStartDate] = useState(new Date());

  // pick stime 
  const [starttime, setStarttime] = useState(new Date());

  // pick etime 
  const [endtime, setEndtime] = useState(starttime);

  // pick subject
  const [Subject, setSubject] = useState('');

  if (role === 's') {
    return (
      <div className="lecture-content">
        {lectures.map(lecture => (
          <div key={lecture.id} className="lecture-item">
            <h3>{lecture.subject}</h3>
            <p>Teacher: {lecture.teacher}</p>
            <p>sTime: {lecture.stime ? convertToIST12HourFormatWithDate(lecture.stime) : 'No time allocated for eTime'}</p>
            <p>eTime: {lecture.etime ? convertToIST12HourFormatWithDate(lecture.etime) : 'No time allocated for eTime'}</p>
            <p>Venue: {lecture.venue}</p>
            <p>Course: {hardwareDetails.course}</p>
          </div>
        ))}
      </div>
    );
  } else if (role === 't') {
    return (
      <div>
        <div>hello this is lecture for t</div>
        <div className="lecture-content">
          {lectures.slice(0, 2).map((lecture, index) => (
            <div key={index} className="lecture-item">
              <h3>{lecture.subject}</h3>
              <p>Teacher: {lecture.teacher}</p>
              <p>sTime: {lecture.stime ? convertToIST12HourFormatWithDate(lecture.stime) : 'No time allocated for eTime'}</p>
              <p>eTime: {lecture.etime ? convertToIST12HourFormatWithDate(lecture.etime) : 'No time allocated for eTime'}</p>
              <p>Venue: {lecture.venue}</p>
              <p>Course: {hardwareDetails.course}</p>
              {showForm && (
                <form onSubmit={handleSubmit}>
                  <p>Pick date : <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    minDate={new Date()}
                    maxDate={addDays(new Date(), 2)} /></p>

                  <p>Start Time : <DatePicker
                    selected={starttime}
                    onChange={(date) => setStarttime(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    minTime={setHours(setMinutes(new Date(), 0), 8)}
                    maxTime={setHours(setMinutes(new Date(), 30), 18)}
                  /></p>

                  <p>End Time : <DatePicker
                    selected={endtime}
                    onChange={(date) => setEndtime(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    minTime={starttime}
                    maxTime={setHours(setMinutes(new Date(), 30), 18)}
                  /></p>
                  <p>
                    Give Subject : <input type="text" placeholder='Subject' value={Subject} onChange={(e) => setSubject(e.target.value)} required />
                  </p>
                  <p>
                    <button type='submit'>Submit</button>
                  </p>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="lecture-content">
          {lectures.map(lecture => (
            <div key={lecture.id} className="lecture-item">
              <h3>{lecture.subject}</h3>
              <p>Teacher: {lecture.teacher}</p>
              <p>sTime: {lecture.stime}</p>
              <p>eTime: {lecture.etime}</p>
              <p>Venue: {lecture.venue}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default Lecture;