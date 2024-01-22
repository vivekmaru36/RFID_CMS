import React, { useState } from 'react';
// import './Dashboard.css';
import Cookies from 'js-cookie';

// importing axios
import axios from "axios";

const Lecture = ({userDetails}) => {

    console.log(userDetails)

    const [lectures, setLectures] = useState([
        { id: 'lec1', teacher: 'Mr. Aditya', subject: 'ML', time: '10:00 AM', venue: 'Hardware Lab' },
        { id: 'lec2', teacher: 'Ms. Beena', subject: 'CSF', time: '12:00 PM', venue: '1 Law' },
        { id: 'lec3', teacher: 'Ms. Geeta', subject: 'BDA', time: '2:00 PM', venue: 'CS Lab' },
    ]);

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
};

export default Lecture;