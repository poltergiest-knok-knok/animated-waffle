import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

// --- Keyframes for specific animations ---
const autoRun = keyframes`
  from {
    transform: perspective(1000px) rotateX(-13deg) rotateY(0deg);
  }
  to {
    transform: perspective(1000px) rotateX(-13deg) rotateY(360deg);
  }
`;

// --- Styled Components ---

const BannerContainer = styled.div`
  width: 100%;
  height: 100vh;
  text-align: center;
  overflow: hidden;
  position: relative;
  background-color: #050505; // Matches the dark theme
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Slider = styled.div`
  position: absolute;
  width: 300px;
  height: 170px;
  top: 10%;
  left: calc(50% - 150px);
  transform-style: preserve-3d;
  transform: perspective(1000px);
  animation: ${autoRun} 20s linear infinite;
  z-index: 2; /* RESTORED TO 2 as per original GitHub reference */

  &:hover {
    animation-play-state: paused;
  }

  @media (max-width: 1023px) {
    width: 200px;
    height: 115px;
    left: calc(50% - 100px);
  }
  
  @media (max-width: 767px) {
    width: 160px;
    height: 90px;
    left: calc(50% - 80px);
  }
`;

const InitialItem = styled.div`
  position: absolute;
  inset: 0;
  transform: rotateY(calc( (var(--position) - 1) * (360 / var(--quantity)) * 1deg)) translateZ(550px);
  
  @media (max-width: 1023px) {
      transform: rotateY(calc( (var(--position) - 1) * (360 / var(--quantity)) * 1deg)) translateZ(400px); // Increased Z for wider cards
  }

  @media (max-width: 767px) {
      transform: rotateY(calc( (var(--position) - 1) * (360 / var(--quantity)) * 1deg)) translateZ(300px); // Increased Z for wider cards
  }

  img {
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.2);
  }
`;

const Content = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(1400px, 100vw);
  height: max-content;
  padding-bottom: 100px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  z-index: 1;

  @media (max-width: 1023px) {
    padding-bottom: 50px;
  }
`;

const Title = styled.h1`
  font-family: 'ICA Rubrik', sans-serif;
  font-size: 10em; // Adjust as needed
  line-height: 1em;
  color: #25283B;
  position: relative;
  margin: 0;
  
  @media (max-width: 1023px) {
      font-size: 5em;
  }
  
  @media (max-width: 767px) {
     font-size: 3em; 
  }

  &::after { 
    position: absolute;
    inset: 0;
    content: attr(data-content);
    z-index: 2;
    -webkit-text-stroke: 2px #d2d2d2;
    color: transparent;
  }
`;

const Author = styled.div`
  font-family: 'Inter', sans-serif;
  text-align: right;
  max-width: 200px;
  color: #fff;
  
  h2 {
    font-size: 3em;
    margin: 0;
  }

  p {
    margin: 5px 0 0 0;
    color: #888;
  }
`;

const Model = styled.div`
  background-image: url('/thumbnails/model.png'); // Using local model image
  width: 100%;
  height: 75vh;
  position: absolute;
  bottom: 0;
  left: 0;
  background-size: auto 130%;
  background-repeat: no-repeat;
  background-position: top center;
  z-index: 1;
  pointer-events: none;
`;

const OutlineTitle = styled(Title)`
  color: transparent;
  -webkit-text-stroke: 2px #d2d2d2;
  z-index: 3;
  &::after {
    content: none;
  }
`;

export default function Banner3D() {
  const quantity = 10;
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Just picking the first 10 'cinematic' or similar images for the banner
    const bannerImages = [];
    const sources = [
      'cinematic.jpg', 'cinematic (2).jpg', 'cinematic (3).jpg', 'cinematic (4).jpg',
      'cinematic (5).jpg', 'cinematic (6).jpg', 'cinematic (7).jpg', 'cinematic (8).jpg',
      'tech.jpg', 'tech (2).jpg'
    ];

    setImages(sources);
  }, []);

  return (
    <BannerContainer className="banner">
      <Slider className="slider" style={{ '--quantity': quantity }}>
        {images.map((img, index) => (
          <InitialItem className="item" style={{ '--position': index + 1 }} key={index}>
            <img src={`/thumbnails/${img}`} alt={`Banner ${index}`} />
          </InitialItem>
        ))}
      </Slider>

      <Content className="content">
        <Title data-content="PORTFOLIO">
          PORTFOLIO
        </Title>
        <Author className="author">
          <h2>DESIGN</h2>
          <p><b>Visual</b> Archive</p>
          <p>Cinematic & 3D</p>
        </Author>
      </Content>

      <Model className="model" />

      <Content className="content" style={{ zIndex: 1, pointerEvents: 'none' }}>
        <OutlineTitle>PORTFOLIO</OutlineTitle>
        <Author style={{ visibility: 'hidden' }}>
          <h2>DESIGN</h2>
          <p><b>Visual</b> Archive</p>
          <p>Cinematic & 3D</p>
        </Author>
      </Content>
    </BannerContainer>
  );
}
