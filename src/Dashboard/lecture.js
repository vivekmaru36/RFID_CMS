import React, { useState } from 'react';
// import './Dashboard.css';
import Cookies from 'js-cookie';

// importing axios
import axios from "axios";

const Lecture = ({ userDetails }) => {

    console.log(userDetails)

    const [lectures, setLectures] = useState([
        { id: 'lec1', teacher: 'Mr. Aditya', subject: 'ML', time: '10:00 AM', venue: 'Hardware Lab' },
        { id: 'lec2', teacher: 'Ms. Beena', subject: 'CSF', time: '12:00 PM', venue: '1 Law' },
        { id: 'lec3', teacher: 'Ms. Geeta', subject: 'BDA', time: '2:00 PM', venue: 'CS Lab' },
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
            // You need to replace the URL with the actual endpoint for your backend
            const response = await axios.post("http://127.0.0.1:5000/setlec", {
                Teacher: teacher,
                sTime: new Date(sTime),
                eTime: new Date(eTime),
            });

            console.log("Hardware update submitted successfully:", response.data);

            // Optionally, you can reset the form after submission
            setTeacher("");
            setSTime("");
            setETime("");
        } catch (error) {
            console.error("Error submitting hardware update:", error);
        }
    };



    if (role === 's') {
        return (
            <div>
                <div>hello this is lecture for s</div>
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

    } else if (role === 't') {
        return (
            <div>
                <div>hello this is lecture for t</div>
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