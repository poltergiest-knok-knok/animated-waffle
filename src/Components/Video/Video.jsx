import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const VideoContainer = styled.div`
  min-height: 100vh;
  background-color: #121212;
  color: white;
  padding: 40px 20px;
  font-family: "Press Start 2P", cursive;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

const Title = styled.h1`
  color: #ff00ff;
  text-align: center;
  text-shadow: 0 0 10px #ff00ff;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  padding: 15px 30px;
  font-family: "Press Start 2P", cursive;
  background: rgba(0, 0, 0, 0.8);
  color: #00ffff;
  border: 3px solid #00ffff;
  text-transform: uppercase;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
  margin-bottom: 30px;

  &:hover {
    background: rgba(0, 255, 255, 0.1);
    color: #ffffff;
    border-color: #ffffff;
    transform: translateY(-2px);
  }
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  width: 100%;
`;

const VideoCard = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #00ffff;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff00ff;
    box-shadow: 0 0 15px #ff00ff;
  }
`;

function Video() {
  const navigate = useNavigate();

  const videoProjects = [
    {
      title: "Project 1",
      description: "Video editing showcase",
      type: "Motion Graphics"
    },
    {
      title: "Project 2", 
      description: "Animation reel",
      type: "2D Animation"
    },
    {
      title: "Project 3",
      description: "Commercial video",
      type: "Video Production"
    }
  ];

  return (
    <VideoContainer>
      <BackButton onClick={() => navigate('/dark')}>
        ← Back to Main
      </BackButton>
      
      <Title>Video Portfolio</Title>
      
      <VideoGrid>
        {videoProjects.map((project, index) => (
          <VideoCard key={index}>
            <h3 style={{ color: '#00ff00', marginBottom: '15px' }}>
              {project.title}
            </h3>
            <p style={{ color: '#ffffff', marginBottom: '10px' }}>
              {project.description}
            </p>
            <p style={{ color: '#ffff00', fontSize: '10px' }}>
              Type: {project.type}
            </p>
          </VideoCard>
        ))}
      </VideoGrid>
    </VideoContainer>
  );
}

export default Video;