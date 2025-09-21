import React from 'react';
import './Dark.css'; // Import the stylesheet
import video from "../assets/pixelbg.mp4"; // Ensure the path to your video file is correct

export default function Dark() {
  return (
    <>
      <div className="dark-mode-container">
        <video className="background-video" src={video} autoPlay loop muted playsInline />

        {/* Navigation Component */}
        <nav className="navbar">
            <a href="#" className="nav-link">
                <svg className="nav-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 1.5l2.35 7.24h7.65l-6.18 4.48 2.36 7.24-6.18-4.48-6.18 4.48 2.36-7.24-6.18-4.48h7.65z"/></svg>
                <span>Asterisk</span>
            </a>
            <a href="#" className="nav-link"><span className="eooks-text">Eooks</span></a>
            <a href="#" className="nav-link"><div className="opal-icon"></div><span>Opal</span></a>
            <a href="#" className="nav-link">
                <svg className="nav-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.9,8.3c-0.2-0.5-0.5-0.9-0.9-1.3c-2.4-2.4-6.4-2.4-8.8,0c-1,1-1.6,2.4-1.6,3.8c0,0.5,0.1,1,0.2,1.5 c-0.5,0-1,0.1-1.5,0.2c-2.4,0.4-4.2,2.5-4.2,5c0,2.8,2.2,5,5,5c0.2,0,0.5,0,0.7-0.1c0.5,0.6,1.2,1,2,1.2c2.8,0.7,5.6-0.3,7.2-2.5 c1.9-2.6,1.7-6.1-0.5-8.5C22.2,9.3,22.1,8.8,21.9,8.3z M19.4,18.1c-1.2,1.7-3.4,2.4-5.4,1.9c-0.6-0.1-1.1-0.5-1.5-0.9 c-0.2,0-0.3,0-0.5,0c-1.9,0-3.5-1.6-3.5-3.5c0-1.8,1.4-3.3,3.2-3.5c0.6-0.1,1.1,0.4,1.1,1c0,0.3-0.1,0.5-0.3,0.7 c-0.7,0.5-1.1,1.3-1.1,2.1c0,0.8,0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5c0-1.7,1.4-3.1,3.1-3.1c0.8,0,1.5,0.3,2.1,0.8 C20.9,13.9,21.2,16,19.4,18.1z"/></svg>
                <span>Dune</span>
            </a>
            <a href="#" className="nav-link"><span>Oasis</span></a>
        </nav>

        {/* Hero Content */}
        <div className="hero-content">
          <h1>The best platform to get your designed sites</h1>
          <div className="subtitle">
            The most powerful person is here to help you !
          </div>
          <div className="action-buttons">
            <p>Get started now</p>
            <p>Book a demo</p>
          </div>
        </div>
      </div>
    </>
  );
}