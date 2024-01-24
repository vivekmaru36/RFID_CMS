import React, { useState, useEffect } from 'react';
// import './Dashboard.css';
import Cookies from 'js-cookie';

// importing axios
import axios from "axios";

const Lecture = ({ userDetails }) => {

    console.log(userDetails)

    const [lectures, setLectures] = useState([
        { id: 'lec1', teacher: 'Mr.Aditya', subject: 'CS', etime: '1:00 PM',stime: '2:00 PM', venue: 'Hardware Lab' },
        { id: 'lec2', teacher: 'Ms. Beena', subject: 'CSF', etime: '1:00 PM',stime: '2:00 PM', venue: '1 Law' },
        { id: 'lec3', teacher: 'Ms. Geeta', subject: 'BDA', etime: '1:00 PM',stime: '2:00 PM', venue: 'CS Lab' },
    ]);

    const [role, setRole] = useState(userDetails && userDetails.role);

    console.log(role);

    // var for t
    const [teacher, setTeacher] = useState("");
    const [sTime, setSTime] = useState("");
    const [eTime, setETime] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log(teacher);
            console.log(sTime);
            console.log(eTime);

            const response = await axios.post("http://127.0.0.1:5000/setlec", {
                Teacher: userDetails.fname,
                sTime: new Date(sTime),
                eTime: new Date(eTime),
            });

            console.log("Hardware update submitted successfully:", response.data);


            setTeacher("");
            setSTime("");
            setETime("");
        } catch (error) {
            console.error("Error submitting hardware update:", error);
        }
    };

    // var for storing fetch of hardware
    const [hardwareDetails, setHardwareDetails] = useState({
        Teacher: '',
        currentTime: '',
        eTime: '',
        sTime: '',
        Venue: '',
    });

    // fetching the hardware lab details
    useEffect(() => {
        // Fetch hardware details when the component mounts
        const fetchHardwareDetails = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getlec1');
                if (response.data.success) {
                    const hdata = response.data.hardwaredetails;
                    // console.log(hdata.Teacher);
                    // console.log(response.data.hardwaredetails);
                    // setLectures([response.data.hardwaredetails]);
                    // console.log(lectures);

                    // updating the hardwareDetails var
                    setHardwareDetails({
                        Teacher: hdata.Teacher,
                        currentTime: hdata.currentTime,
                        eTime: hdata.eTime,
                        sTime: hdata.sTime,
                        Venue: hdata.venue,
                    });

                    console.log(hardwareDetails);

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
                } else {
                    console.error('Error fetching hardware details:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching hardware details:', error);
            }
        };

        fetchHardwareDetails();
    }, [hardwareDetails, userDetails.course]); // Empty dependency array ensures the effect runs only once after the initial render


    if (role === 's') {
        return (
            <div>
                <div>hello this is lecture for s</div>
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

    } else if (role === 't') {
        return (
            <div>
                <div>hello this is lecture for t</div>
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

                <form onSubmit={handleSubmit}>
                    <label>
                        Teacher:
                        <input
                            type="text"
                            value={teacher}
                            onChange={(e) => setTeacher(e.target.value)}
                            required
                        />
                    </label>
                    <br />
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
            </div>
        );
    }
    else {
        return (
            <div>
                {/* <div>hello this is lecture</div> */}
                <div className="lecture-content">
                    {lectures.map(lecture => (
                        <div key={lecture.id} className="lecture-item">
                            <h3>{lecture.subject}</h3>
                            <p>Teacher: {lecture.teacher}</p>
                            <p>Time: {lecture.time}</p>
                            <p>Venue: {lecture.venue}</p>
                        </div>
                    ))}
                </div>
            </div>
        );

    }

};

export default Lecture;