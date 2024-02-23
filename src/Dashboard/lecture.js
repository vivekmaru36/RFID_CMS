import React, { useState, useEffect } from 'react';
import axios from 'axios';

import DatePicker from "react-datepicker";
import Cookies from 'js-cookie';

import "react-datepicker/dist/react-datepicker.css";
import { addDays, setHours, setMinutes } from 'date-fns';

const Lecture = ({ userDetails, userinfo }) => {
  const [lectures, setLectures] = useState([
    { id: 'lec1', teacher: 'Mr.Aditya', subject: 'CS', etime: '1:00 PM', stime: '2:00 PM', venue: 'Hardware Lab' },
    { id: 'lec2', teacher: 'Ms. Beena', subject: 'BDA', etime: '1:00 PM', stime: '2:00 PM', venue: '1 Law' }
  ]);

  // console.log("This is : ",props);
  console.log("This is userinfo from lec : ", userinfo);


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
        Lecdate: new Date(startDate).toISOString(),
        sTime: new Date(starttime).toISOString(),
        eTime: new Date(endtime).toISOString(),
        course: course,
        subject: Subject,
        rfidno: userinfo.rfidno || userinfo.numericRfid,
      });

      console.log("Hardware update submitted successfully:", response.data);

      setStartDate("");
      setStarttime("");
      setEndtime("");
      setSubject("");
      alert("Lec Updated Succesfully");
      Cookies.set("tokenlec1", response.data.tokenlec1);
    } catch (error) {
      console.error("Error submitting hardware update:", error);
      alert("Hardware Lab has already a lec");
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:5000/setlec2", {
        Teacher: userDetails.fname,
        Lecdate: new Date(startDate).toISOString(),
        sTime: new Date(starttime).toISOString(),
        eTime: new Date(endtime).toISOString(),
        course: course,
        subject: Subject,
        rfidno: userinfo.rfidno || userinfo.numericRfid,
      });

      console.log("1 Law Lec update submitted successfully:", response.data);

      setStartDate("");
      setStarttime("");
      setEndtime("");
      setSubject("");
      alert("1 Law Lec Updated Succesfully");
      Cookies.set("tokenlec2", response.data.tokenlec2);
    } catch (error) {
      console.error("Error submitting 1 Law update:", error);
      alert("1 Law has already a lec");
    }
  };

  const [LawDetails, setLawDetails] = useState({
    Teacher: '',
    currentTime: '',
    eTime: '',
    sTime: '',
    Venue: '',
    course: '',
    rfidno: ''
  });

  useEffect(() => {
    const fetchLawDetails = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/getlec2');
        if (response.data.success) {
          const ldata = response.data.Lawdetails;
          setLawDetails({
            Teacher: ldata.Teacher,
            currentTime: ldata.currentTime,
            eTime: ldata.eTime,
            sTime: ldata.sTime,
            Venue: ldata.venue,
            course: ldata.course,
            rfidno: ldata.rfidno
          });

          // Check if eTime has passed from the current time

          const eTimeUTC = new Date(ldata.eTime);

          if (currentWorldTime > eTimeUTC) {
            // Call the delete API
            handleAutoDelL();
          }
        } else {
          console.error('Error fetching Law details:', response.data.message);
          setLawDetails(null);
        }
      } catch (error) {
        console.error('Error fetching Law details:', error);
        setLawDetails(null);
      }
    };

    fetchLawDetails();
  }, []);

  useEffect(() => {
    setLectures((prevLectures) => [
      prevLectures[0], // Keep the first element unchanged
      {
        ...prevLectures[1], // Spread the content of the second element
        // Update the specific properties you want to change
        teacher: LawDetails ? LawDetails.Teacher : "",
        subject: userDetails.course,
        stime: LawDetails ? LawDetails.sTime : "",
        etime: LawDetails ? LawDetails.eTime : "",
      },
      ...prevLectures.slice(2), // Keep the rest of the array unchanged
    ]);
  }, [LawDetails]);

  const [hardwareDetails, setHardwareDetails] = useState({
    Teacher: '',
    currentTime: '',
    eTime: '',
    sTime: '',
    Venue: '',
    course: '',
    rfidno: ''
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
            rfidno: hdata.rfidno
          });

          // Check if eTime has passed from the current time

          const eTimeUTC = new Date(hdata.eTime);

          if (currentWorldTime > eTimeUTC) {
            // Call the delete API
            handleAutoDel();
          }
        } else {
          console.error('Error fetching hardware details:', response.data.message);
          setHardwareDetails(null);
        }
      } catch (error) {
        console.error('Error fetching hardware details:', error);
        setHardwareDetails(null);
      }
    };

    fetchHardwareDetails();
  }, []);

  useEffect(() => {
    setLectures((prevLectures) => [
      {
        ...prevLectures[0],
        teacher: hardwareDetails ? hardwareDetails.Teacher : "",
        subject: userDetails.course,
        stime: hardwareDetails ? hardwareDetails.sTime : "",
        etime: hardwareDetails ? hardwareDetails.eTime : "",
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
  
  let showForm = false;
  if (role === 't') {
    if (!hardwareDetails) {
      showForm = true;
    } else {
      showForm = (hardwareDetails && hardwareDetails.rfidno === userinfo.numericRfid)
    }
  }

  let showForm2 = false;
  if (role === 't') {
    if (!LawDetails) {
      showForm2 = true;
    } else {
      showForm2 = (LawDetails && LawDetails.rfidno === userinfo.numericRfid)
    }
  }
  console.log("Show form 2 : ", showForm2);

  // logic to force del venue allotment
  const handleDelete = async () => {
    try {
      const response = await axios.delete("http://127.0.0.1:5000/deletelec", {
        data: {
          fname: userDetails.fname,
        },
      });

      console.log("Lecture deleted successfully:", response.data);
      alert("Lec Deleted Succesfully");
    } catch (error) {
      console.error("Error deleting lecture:", error);
      alert("No Lec Set To Delete");
    }
  };

  // logic to force del 1Law venue allotment
  const handleDeleteL = async () => {
    try {
      const response = await axios.delete("http://127.0.0.1:5000/deletelec2", {
        data: {
          fname: userDetails.fname,
        },
      });

      console.log("Lecture deleted successfully:", response.data);
      alert(" 1 Law Lec Deleted Succesfully");
    } catch (error) {
      console.error("Error deleting lecture:", error);
      alert("No 1 Law Lec Set To Delete");
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

  const handleAutoDelL = async () => {
    try {
      const response = await axios.delete("http://127.0.0.1:5000/autodeletelecL", {
        data: {
          etime: hardwareDetails.eTime,
        },
      });

      console.log("1 Law Lecture deleted Automatically", response.data);
    } catch (error) {
      console.error("Error deleting lecture 1 Law Auto", error);
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

  // current hour and minute
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();


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
            <p>Course: {hardwareDetails ? (hardwareDetails.course || '') : ''}</p>
          </div>
        ))}
      </div>
    );
  } else if (role === 't') {
    return (
      <div>
        <div>hello this is lecture for t</div>
        <div className="lecture-content">

          <div key={0} className="lecture-item">
            <h3>{lectures[0].subject}</h3>
            <p>Teacher: {lectures[0].teacher}</p>
            <p>sTime: {lectures[0].stime ? convertToIST12HourFormatWithDate(lectures[0].stime) : 'No time allocated for eTime'}</p>
            <p>eTime: {lectures[0].etime ? convertToIST12HourFormatWithDate(lectures[0].etime) : 'No time allocated for eTime'}</p>
            <p>Venue: {lectures[0].venue}</p>
            <p>Course: {hardwareDetails ? (hardwareDetails.course || '') : ''}</p>
            {showForm && (
              <form onSubmit={handleSubmit}>
                <p>Pick date : <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  minDate={new Date()}
                  maxDate={addDays(new Date(), 0)} /></p>

                <p>Start Time : <DatePicker
                  selected={starttime}
                  onChange={(date) => setStarttime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  minTime={setHours(setMinutes(new Date(), currentMinute), currentHour)}
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
                  // minTime={starttime}
                  minTime={setHours(setMinutes(new Date(), currentMinute), currentHour)}
                  maxTime={setHours(setMinutes(new Date(), 30), 18)}
                /></p>
                <p>
                  Give Subject : <input type="text" placeholder='Subject' value={Subject} onChange={(e) => setSubject(e.target.value)} required />
                </p>
                <p>
                  <button type='submit'>Submit</button> <button type='button' onClick={handleDelete}>Delete</button>
                </p>
              </form>
            )}
          </div>

          {/* second lec */}
          <div key={1} className="lecture-item">
            <h3>{lectures[1].subject}</h3>
            <p>Teacher: {lectures[1].teacher}</p>
            <p>sTime: {lectures[1].stime ? convertToIST12HourFormatWithDate(lectures[1].stime) : 'No time allocated for eTime'}</p>
            <p>eTime: {lectures[1].etime ? convertToIST12HourFormatWithDate(lectures[1].etime) : 'No time allocated for eTime'}</p>
            <p>Venue: {lectures[1].venue}</p>
            <p>Course: {LawDetails ? (LawDetails.course || '') : ''}</p>

            {showForm2 && (
              <form onSubmit={handleSubmit2}>
                <p>Pick date : <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  minDate={new Date()}
                  maxDate={addDays(new Date(), 0)} /></p>

                <p>Start Time : <DatePicker
                  selected={starttime}
                  onChange={(date) => setStarttime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  minTime={setHours(setMinutes(new Date(), currentMinute), currentHour)}
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
                  // minTime={starttime}
                  minTime={setHours(setMinutes(new Date(), currentMinute), currentHour)}
                  maxTime={setHours(setMinutes(new Date(), 30), 18)}
                /></p>
                <p>
                  Give Subject : <input type="text" placeholder='Subject' value={Subject} onChange={(e) => setSubject(e.target.value)} required />
                </p>
                <p>
                  <button type='submit'>Submit</button> <button type='button' onClick={handleDeleteL}>Delete</button>
                </p>
              </form>
            )}
          </div>
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