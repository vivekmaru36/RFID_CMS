import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Lecture = ({ userDetails }) => {
  const [lectures, setLectures] = useState([
    { id: 'lec1', teacher: 'Mr.Aditya', subject: 'CS', etime: '1:00 PM', stime: '2:00 PM', venue: 'Hardware Lab' },
    { id: 'lec2', teacher: 'Ms. Beena', subject: 'CSF', etime: '1:00 PM', stime: '2:00 PM', venue: '1 Law' },
    { id: 'lec3', teacher: 'Ms. Geeta', subject: 'BDA', etime: '1:00 PM', stime: '2:00 PM', venue: 'CS Lab' },
  ]);

  const [role, setRole] = useState(userDetails && userDetails.role);
  const [teacher, setTeacher] = useState("");
  const [sTime, setSTime] = useState("");
  const [eTime, setETime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:5000/setlec", {
        Teacher: userDetails.fname,
        sTime: new Date(sTime).toISOString(), // Convert to UTC before sending
        eTime: new Date(eTime).toISOString(), // Convert to UTC before sending
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
  });

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
          });
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
  const showForm = hardwareDetails && hardwareDetails.Teacher === userDetails.fname;

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
          </div>
        ))}
      </div>
    );
  } else if (role === 't') {
    return (
      <div>
        <div>hello this is lecture for t</div>
        <div className="lecture-content">
          {lectures.map(lecture => (
            <div key={lecture.id} className="lecture-item">
              <h3>{lecture.subject}</h3>
              <p>Teacher: {lecture.teacher}</p>
              <p>sTime: {lecture.stime ? convertToIST12HourFormatWithDate(lecture.stime) : 'No time allocated for eTime'}</p>
              <p>eTime: {lecture.etime ? convertToIST12HourFormatWithDate(lecture.etime) : 'No time allocated for eTime'}</p>
              <p>Venue: {lecture.venue}</p>
            </div>
          ))}
        </div>
        {showForm && (
          <form onSubmit={handleSubmit}>
            <label>
              Start Time:
              <input
                type="datetime-local"
                value={sTime}
                onChange={(e) => setSTime(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              End Time:
              <input
                type="datetime-local"
                value={eTime}
                onChange={(e) => setETime(e.target.value)}
                required
              />
            </label>
            <br />
            <button type="submit">Submit</button>
          </form>
        )}
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