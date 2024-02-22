import { Container } from "react-bootstrap";
import headerImg from "./app-thumbnail-3.webp";
import Typewriter from "typewriter-effect";
import thesis from "./thesis-b5aec7be.png";
import sop from "./sop-05464f5b.png";
import research from "./research-91004840.png";
import coding from "./coding-20cc59cb.png";
import React from 'react';
import emoji from "react-easy-emoji";

import "./banner.css";

export const Banner = () => {

    return (
        <section className="banner" id="home">
            <Container>
                <div>
                    <span className="tagline" style={{ marginLeft: '20px' }}>GROUP 14</span>
                    <h1>
                        Hello
                        <span className="wave-emoji">{emoji("👋")}</span>
                    </h1>
                    <h2>
                        <span>
                            <span className="wrap">
                                <Typewriter
                                    options={{
                                        strings: [
                                            "09-Bhoomika Mamidi",
                                            "16-Deepali",
                                            "21-Vivek Maru",
                                            "48-Suraj"
                                        ],
                                        autoStart: true,
                                        loop: true,
                                        deleteSpeed: 50,
                                    }} />
                            </span>
                        </span>
                    </h2>

                </div>
                {/* <div className="text">
                    <p >
                        This is the paragraph tagline
                    </p>
                </div> */}
                <div className="banner-container">
                    <div className="text-2xl button-container font-league"><svg xmlns="http://www.w3.org/2000/svg" viewBox="16.6 44.02 157.75 121.75" className="absolute -z-10 py-8  w-[20rem] md:w-[32rem] xl:w-[32rem] "><path fill="#231F20" d="M52.8,-47.3C66.7,-38.9,75.1,-19.4,74.3,-0.8C73.5,17.9,63.6,35.8,49.7,48.3C35.8,60.8,17.9,67.9,2.7,65.2C-12.6,62.6,-25.1,50.1,-41.5,37.6C-57.9,25.1,-78.2,12.6,-82.5,-4.3C-86.8,-21.2,-75.2,-42.4,-58.8,-50.8C-42.4,-59.3,-21.2,-55,-0.9,-54.1C19.4,-53.2,38.9,-55.8,52.8,-47.3Z" transform="translate(100 100)"></path></svg>
                        <div className="banner-icons">
                            <ul><li className="banner-li"><img className="thesis" src={thesis}></img></li><li><img className="sop" src={sop}></img></li><li><img className="coding" src={coding}></img></li><li><img className="research" src={research}></img></li></ul>
                            <img src="https://img.icons8.com/3d-fluency/94/null/ball-point-pen.png" alt="logo" id="pen" style={{ transform: "rotate(140deg) translateZ(0px);" }}></img>
                        </div>


                    </div>
                </div>

            </Container>

        </section>

    )
}