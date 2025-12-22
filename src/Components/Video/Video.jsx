import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import GlassButton from "../Shared/GlassButton";
import SEO from "../Shared/SEO";
import VynceVisual from "./vyncevisual";

// ==========================================
// CDN CONFIGURATION
// ==========================================
const CDN_BASE_URL = import.meta.env.VITE_CDN_URL || "";

// ==========================================
// DATA
// ==========================================
const videoProjects = {
  short: [
    {
      title: "Social Media Edit",
      description: "High-energy fast cuts for maximum retention.",
      src: "https://res.cloudinary.com/durvm2hdf/video/upload/v1765177344/Videos/Neha_Datta_Shorts_6.mp4",
      thumbnail: "",
      glowColor: "rgba(255, 100, 255, 0.6)"
    },
    {
      title: "Vintage Benz",
      description: "Classic car restoration showcase.",
      src: "https://res.cloudinary.com/durvm2hdf/video/upload/v1765177247/Videos/benz_300d_graded_F1_topaz_enhanced.mp4",
      thumbnail: "",
      glowColor: "rgba(255, 215, 0, 0.6)"
    },
    {
      title: "Product Commercial",
      description: "Sleek 3D motion graphics and product showcase.",
      src: "https://res.cloudinary.com/durvm2hdf/video/upload/v1765177354/Videos/x_part_3_credit_card.mp4",
      thumbnail: "",
      glowColor: "rgba(0, 200, 255, 0.6)"
    },
    {
      title: "Creative Recreation",
      description: "Stylized visual recreation and color grading.",
      src: "https://res.cloudinary.com/durvm2hdf/video/upload/v1765177350/Videos/recreation_N1.mp4",
      thumbnail: "",
      glowColor: "rgba(255, 50, 50, 0.6)"
    },
    {
      title: "Cinematic Food",
      description: "High-end culinary cinematography.",
      src: "https://res.cloudinary.com/durvm2hdf/video/upload/v1765177282/Videos/Chickpea_salad_bowl.mp4",
      thumbnail: "",
      glowColor: "rgba(255, 165, 0, 0.6)"
    },
    {
      title: "Automotive B-Roll",
      description: "Dynamic automotive cinematography.",
      src: "https://res.cloudinary.com/durvm2hdf/video/upload/v1765177259/Videos/blue_benz.mp4",
      thumbnail: "",
      glowColor: "rgba(0, 100, 255, 0.6)"
    },
    {
      title: "Travel Vlog",
      description: "Narrative storytelling and lifestyle.",
      src: "https://res.cloudinary.com/durvm2hdf/video/upload/v1765177307/Videos/Dogesh.mp4",
      thumbnail: "",
      glowColor: "rgba(255, 255, 100, 0.6)"
    },
    {
      title: "Event Highlights",
      description: "Capturing the energy of live events.",
      src: "https://res.cloudinary.com/durvm2hdf/video/upload/v1765177315/Videos/EVO_final_topaz.mp4",
      thumbnail: "",
      glowColor: "rgba(200, 0, 255, 0.6)"
    }
  ],
  long: [
    {
      title: "Visual Effects",
      description: "Abstract 3D simulation and rendering.",
      src: "https://res.cloudinary.com/durvm2hdf/video/upload/v1765177290/Videos/cube_animation.mp4",
      thumbnail: "",
      glowColor: "rgba(100, 255, 100, 0.6)"
    },
    {
      title: "Corporate Brand",
      description: "Professional brand identity work.",
      src: "https://res.cloudinary.com/durvm2hdf/video/upload/v1765177324/Videos/Magnates_ae.mp4",
      thumbnail: "",
      glowColor: "rgba(0, 255, 200, 0.6)"
    },
    {
      title: "Technical Tracking",
      description: "Advanced camera tracking and stabilization.",
      src: "https://res.cloudinary.com/durvm2hdf/video/upload/v1765177269/Videos/camera_follow.mp4",
      thumbnail: "",
      glowColor: "rgba(255, 255, 255, 0.6)"
    }
  ]
};

// ==========================================
// STYLED COMPONENTS
// ==========================================

const PageContainer = styled.div`
  min-height: 100vh;
  background: #050505;
  color: white;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(20, 20, 40, 1), #000 80%);
    z-index: 0;
    pointer-events: none;
  }
`;

const FixedTopBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  padding-top: calc(20px + env(safe-area-inset-top));
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  @media(max-width: 768px) {
    padding: 10px 15px;
    padding-top: calc(10px + env(safe-area-inset-top));
    background: rgba(0, 0, 0, 0.5);
    gap: 10px;
  }
`;

const NavLeft = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
`;

const NavRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

// Showcase Section
const ShowcaseSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 80px 20px;
  background: #000;
  z-index: 10;
`;

const ShowcaseTitle = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 6rem);
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  letter-spacing: 1.5rem;
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
  
  @media(max-width: 768px) {
    letter-spacing: 0.8rem;
  }
`;

const ShowcaseSubtitle = styled(motion.p)`
  font-size: clamp(0.8rem, 1.5vw, 1rem);
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  letter-spacing: 0.4rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 20px;
  text-align: center;
`;

const ShowcaseDescription = styled(motion.p)`
  font-size: clamp(0.85rem, 1.2vw, 1rem);
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  letter-spacing: 0.15rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 60px;
  text-align: center;
  max-width: 600px;
`;

const ScrollPrompt = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
  
  span {
    font-size: 0.75rem;
    letter-spacing: 0.2rem;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 500;
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: rgba(255, 255, 255, 0.5);
    animation: bounce 2s infinite;
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(10px); }
  }
`;

const CategoryButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
`;

const PillButton = styled(motion.button)`
  padding: 12px 40px;
  background: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? '#000' : '#fff'};
  border: 1px solid ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 50px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.1rem;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.15)'};
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1);
  }
  
  @media(max-width: 768px) {
    padding: 10px 35px;
    font-size: 0.85rem;
  }
`;

// Video Gallery Section
const VideoSection = styled.section`
  min-height: 100vh;
  position: relative;
  padding: 80px 20px;
  background: #000;
  z-index: 10;
`;

const VideoSectionTitle = styled(motion.h2)`
  font-size: clamp(2rem, 4vw, 3rem);
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.5rem;
  color: #fff;
  margin-bottom: 60px;
  text-align: center;
  
  span {
    display: block;
    font-size: 1rem;
    opacity: 0.5;
    letter-spacing: 0.2rem;
    margin-top: 10px;
    font-weight: 400;
  }
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
  padding-bottom: 60px;

  @media(max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const VideoCard = styled.div`
  position: relative;
  background: #000;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  aspect-ratio: 9/16;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.02);
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
`;

// Reel Modal Styles
const ReelModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  touch-action: none;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: auto;
  
  @media(max-width: 768px) {
    /* Fullscreen on mobile */
    inset: 0;
    position: fixed;
    height: 100vh;
    height: -webkit-fill-available;
  }
`;

const ReelContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  touch-action: none;
`;

const ReelVideoWrapper = styled.div`
  position: relative;
  width: auto;
  height: 100%;
  max-width: 56.25vh; /* 9:16 aspect ratio */
  aspect-ratio: 9/16;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  touch-action: none;

  @media(max-width: 768px) {
    width: 100vw;
    max-width: 100vw;
    height: 100vh;
    height: -webkit-fill-available;
    max-height: none;
    aspect-ratio: auto;
  }
`;

const ReelCloseButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2001;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  color: white;
  font-size: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

const ReelNavButton = styled(motion.button)`
  position: fixed;
  right: 20px;
  ${props => props.$direction === 'prev' ? 'top: calc(50% - 80px);' : 'top: calc(50% + 20px);'}
  z-index: 2001;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  color: white;
  font-size: 1.8rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  @media(max-width: 768px) {
    display: none;
  }
`;

// Brand Indicator (Top-Left) - Clickable
const RecIndicator = styled.a`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #ff3333;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  text-decoration: none;
  cursor: pointer;
  pointer-events: auto;
  animation: textBlink 2s infinite;
  transition: all 0.3s ease;

  &:hover {
    color: #ff5555;
    transform: scale(1.05);
  }

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: #ff3333;
    border-radius: 50%;
    box-shadow: 0 0 10px #ff3333;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 10px #ff3333; }
    50% { opacity: 0.5; box-shadow: 0 0 5px #ff3333; }
  }

  @keyframes textBlink {
    0%, 100% { color: #ff3333; }
    50% { color: #ff6666; }
  }

  @media(max-width: 768px) {
    top: 15px;
    left: 15px;
    font-size: 0.65rem;
  }
`;

const ReelInfo = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  max-width: 65%;
  padding: 30px;
  padding-bottom: calc(30px + env(safe-area-inset-bottom));
  background: linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  z-index: 10;
  pointer-events: none;

  @media(max-width: 768px) {
    padding: 20px;
    padding-bottom: calc(20px + env(safe-area-inset-bottom));
    max-width: 75%;
  }
`;

const HashtagRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const Hashtag = styled.span`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  font-weight: 500;

  @media(max-width: 768px) {
    font-size: 0.75rem;
    padding: 3px 10px;
  }
`;

const ReelTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
  line-height: 1.2;

  @media(max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const ReelDescription = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.4;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);

  @media(max-width: 768px) {
    font-size: 0.85rem;
  }
`;

// Reel Action Sidebar (Right Side)
const ReelActionBar = styled.div`
  position: absolute;
  right: 20px;
  bottom: 120px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 2001;

  @media(max-width: 768px) {
    right: 10px;
    bottom: calc(100px + env(safe-area-inset-bottom));
    gap: 15px;
  }
`;

const ActionButton = styled(motion.button)`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  color: white;
  font-size: 1.5rem;
  pointer-events: auto;
  
  /* Liquid glass glow */
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: linear-gradient(45deg, 
      rgba(255, 255, 255, 0.1), 
      rgba(255, 255, 255, 0.05)
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.1);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 0 20px rgba(255, 255, 255, 0.2),
      inset 0 0 20px rgba(255, 255, 255, 0.1);
    
    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: scale(0.95);
  }

  /* Icon glow on hover */
  &:hover svg,
  &:hover span {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
  }

  @media(max-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 1.3rem;
  }
`;

const ActionLabel = styled.span`
  font-size: 0.7rem;
  margin-top: 4px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

// Mute button with special styling
const MuteButton = styled(ActionButton)`
  ${props => props.$isMuted && `
    background: rgba(255, 100, 100, 0.15);
    border-color: rgba(255, 100, 100, 0.3);
    
    &:hover {
      background: rgba(255, 100, 100, 0.25);
      border-color: rgba(255, 100, 100, 0.5);
    }
  `}
`;

// Pause Overlay
const PauseOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  z-index: 5;
  pointer-events: none;

  svg {
    width: 80px;
    height: 80px;
    filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.8));
  }

  @media(max-width: 768px) {
    svg {
      width: 60px;
      height: 60px;
    }
  }
`;

// Chat Prompt Tooltip
const ChatPrompt = styled(motion.div)`
  position: absolute;
  right: 80px;
  bottom: calc(120px + 60px + 35px);
  background: rgba(255, 255, 255, 0.95);
  color: #000;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05rem;
  white-space: nowrap;
  z-index: 2002;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  
  &::after {
    content: '';
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid rgba(255, 255, 255, 0.95);
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
  }

  @media(max-width: 768px) {
    right: 70px;
    bottom: calc(100px + 48px + 30px + env(safe-area-inset-bottom));
    font-size: 0.75rem;
    padding: 10px 16px;
  }
`;



// ==========================================
// SUB-COMPONENTS
// ==========================================

const VideoItem = ({ video, onClick, index }) => {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    };
    setIsMobile(checkMobile());
  }, []);

  const handleMouseEnter = () => {
    // Disable hover-to-play on mobile
    if (isMobile) return;

    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => { });
    }
  };

  const handleMouseLeave = () => {
    // Disable hover effects on mobile
    if (isMobile) return;

    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <VideoCard
      onClick={() => onClick(index)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <VideoWrapper>
        <video
          ref={videoRef}
          src={(() => {
            let url = video.src.startsWith('http') ? video.src : (CDN_BASE_URL ? `${CDN_BASE_URL}${video.src.replace(/\s+/g, '_')}` : video.src);
            if (url.includes('cloudinary.com') && !url.includes('/upload/')) {
              const parts = url.split('/upload/');
              return `${parts[0]}/upload/w_500,q_auto:eco,f_auto/${parts[1]}`;
            }
            return url;
          })()}
          poster={(() => {
            // Generate thumbnail from Cloudinary video
            let url = video.src;
            if (url.includes('cloudinary.com') && url.includes('/upload/')) {
              const parts = url.split('/upload/');
              // Get thumbnail from video at 1 second mark
              return `${parts[0]}/upload/so_1.0,w_500,q_auto,f_jpg/${parts[1].replace('.mp4', '.jpg')}`;
            }
            return '';
          })()}
          muted={true}
          loop
          playsInline
          disablePictureInPicture
          preload="metadata"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {/* Thumbnail overlay - always visible on mobile, hidden on hover on desktop */}
        <AnimatePresence>
          {(!isHovered || isMobile) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 60%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '20px',
                pointerEvents: 'none'
              }}
            >
              <h3 style={{
                fontSize: '1.2rem',
                margin: 0,
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                fontWeight: 400
              }}>
                {video.title}
              </h3>
              <p style={{
                fontSize: '0.85rem',
                margin: '8px 0 0 0',
                color: 'rgba(255,255,255,0.7)',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                fontWeight: 300
              }}>
                {video.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </VideoWrapper>
    </VideoCard>
  );
};

// Reel Modal Component
const ReelModalView = ({ video, onClose, onNext, onPrev, canGoNext, canGoPrev, navigate }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showChatPrompt, setShowChatPrompt] = useState(false);

  React.useEffect(() => {
    // Auto-play when modal opens and reset like state
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => { });
      setIsPlaying(true);
      setIsMuted(false);
    }
    // Reset like when video changes
    setIsLiked(false);
    setShowChatPrompt(false);

    // Safari-specific scroll prevention
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // Prevent body scroll when modal is open (Safari compatible)
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.position = 'fixed';
    document.documentElement.style.width = '100%';
    document.documentElement.style.height = '100%';
    document.documentElement.style.top = `-${scrollY}px`;
    document.documentElement.style.left = `-${scrollX}px`;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = `-${scrollX}px`;
    document.body.style.touchAction = 'none';

    return () => {
      // Re-enable body scroll when modal closes
      document.documentElement.style.overflow = '';
      document.documentElement.style.position = '';
      document.documentElement.style.width = '';
      document.documentElement.style.height = '';
      document.documentElement.style.top = '';
      document.documentElement.style.left = '';

      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.touchAction = '';

      // Restore scroll position
      window.scrollTo(scrollX, scrollY);
    };
  }, [video]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => { });
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    // Show chat prompt when liked
    if (newLikedState) {
      setShowChatPrompt(true);
      // Auto-hide after 3 seconds
      setTimeout(() => {
        setShowChatPrompt(false);
      }, 3000);
    }
  };

  const handleComment = () => {
    onClose();
    navigate('/contact');
  };

  const handleShare = () => {
    onClose();
    navigate('/contact');
  };

  // Scroll/Swipe navigation
  const scrollTimeoutRef = useRef(null);
  const touchStartRef = useRef(0);

  const handleWheel = (e) => {
    e.preventDefault();

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Debounce scroll events
    scrollTimeoutRef.current = setTimeout(() => {
      if (e.deltaY > 0 && canGoNext) {
        // Scroll down - next video
        onNext();
      } else if (e.deltaY < 0 && canGoPrev) {
        // Scroll up - previous video
        onPrev();
      }
    }, 100);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    touchStartRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStartRef.current - touchEnd;

    // Swipe threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0 && canGoNext) {
        // Swipe up - next video
        onNext();
      } else if (diff < 0 && canGoPrev) {
        // Swipe down - previous video
        onPrev();
      }
    }
  };

  React.useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <ReelModal
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <ReelCloseButton onClick={onClose} whileTap={{ scale: 0.9 }}>
        ✕
      </ReelCloseButton>

      {canGoPrev && (
        <ReelNavButton
          $direction="prev"
          onClick={onPrev}
          whileTap={{ scale: 0.9 }}
        >
          ↑
        </ReelNavButton>
      )}

      {canGoNext && (
        <ReelNavButton
          $direction="next"
          onClick={onNext}
          whileTap={{ scale: 0.9 }}
        >
          ↓
        </ReelNavButton>
      )}

      <ReelContainer>
        <ReelVideoWrapper onClick={handlePlayPause}>
          <video
            ref={videoRef}
            src={(() => {
              let url = video.src.startsWith('http') ? video.src : (CDN_BASE_URL ? `${CDN_BASE_URL}${video.src.replace(/\s+/g, '_')}` : video.src);
              if (url.includes('cloudinary.com') && url.includes('/upload/')) {
                const parts = url.split('/upload/');
                return `${parts[0]}/upload/w_1080,q_auto:good,f_auto/${parts[1]}`;
              }
              return url;
            })()}
            loop
            playsInline
            disablePictureInPicture
            style={{
              width: '100%',
              height: '100%',
              objectFit: window.innerWidth <= 768 ? 'cover' : 'contain',
              display: 'block',
            }}
          />

          {/* Brand Indicator */}
          <RecIndicator
            href="https://www.instagram.com/vynce.visuals/"
            target="_blank"
            rel="noopener noreferrer"
          >
            vynce.visuals
          </RecIndicator>

          {/* Video Info */}
          <ReelInfo>
            <HashtagRow>
              <Hashtag>#Portfolio</Hashtag>
              <Hashtag>#Video</Hashtag>
            </HashtagRow>
            <ReelTitle>{video.title}</ReelTitle>
            <ReelDescription>{video.description}</ReelDescription>
          </ReelInfo>

          {/* Action Buttons Sidebar */}
          <ReelActionBar>
            <ActionButton
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                color: isLiked ? '#ff4458' : 'white',
              }}
            >
              {isLiked ? '❤️' : '🤍'}
            </ActionButton>

            <ActionButton
              onClick={(e) => {
                e.stopPropagation();
                handleComment();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              💬
            </ActionButton>

            <ActionButton
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
              </svg>
            </ActionButton>

            <MuteButton
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              $isMuted={isMuted}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMuted ? '🔇' : '🔊'}
            </MuteButton>
          </ReelActionBar>

          {/* Pause Overlay */}
          <AnimatePresence>
            {!isPlaying && (
              <PauseOverlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <svg viewBox="0 0 100 100" fill="white">
                  <polygon points="30,20 30,80 80,50" />
                </svg>
              </PauseOverlay>
            )}
          </AnimatePresence>

          {/* Chat Prompt Tooltip */}
          <AnimatePresence>
            {showChatPrompt && (
              <ChatPrompt
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                💬 Chat Now
              </ChatPrompt>
            )}
          </AnimatePresence>
        </ReelVideoWrapper>
      </ReelContainer>
    </ReelModal>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

const Video = () => {
  const navigate = useNavigate();
  const showcaseRef = useRef(null);
  const videosRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [reelOpen, setReelOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleScrollToShowcase = () => {
    showcaseRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToVideos = (category) => {
    setSelectedCategory(category);
    setTimeout(() => {
      videosRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const displayVideos = selectedCategory
    ? videoProjects[selectedCategory]
    : [...videoProjects.short, ...videoProjects.long];

  const openReel = (index) => {
    setCurrentVideoIndex(index);
    setReelOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeReel = () => {
    setReelOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextVideo = () => {
    if (currentVideoIndex < displayVideos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const prevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (!reelOpen) return;

      if (e.key === 'Escape') closeReel();
      if (e.key === 'ArrowRight') nextVideo();
      if (e.key === 'ArrowLeft') prevVideo();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [reelOpen, currentVideoIndex, displayVideos.length]);

  return (
    <PageContainer>
      <SEO
        title="UnmuteXE - Video Portfolio"
        description="Cinematic Video Editing & Motion Graphics Portfolio by UnmuteXE."
      />

      <FixedTopBar>
        <NavLeft>
          <GlassButton onClick={() => navigate('/dark')}>← Back</GlassButton>
        </NavLeft>
        <NavRight>
          <GlassButton onClick={() => navigate('/contact')}>Contact</GlassButton>
        </NavRight>
      </FixedTopBar>

      {/* Section 1: Vynce Visuals Hero */}
      <VynceVisual onButtonClick={handleScrollToShowcase} />

      {/* Section 2: Showcase - Category Selection */}
      <ShowcaseSection ref={showcaseRef}>
        <ShowcaseTitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          SHOWCASE
        </ShowcaseTitle>

        <ShowcaseSubtitle
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          PORTFOLIO
        </ShowcaseSubtitle>

        <ShowcaseDescription
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          A CURATED COLLECTION OF VISUAL STORYTELLING.
        </ShowcaseDescription>

        <ScrollPrompt
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <span>SCROLL TO EXPLORE</span>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </ScrollPrompt>

        <CategoryButtons>
          <PillButton
            onClick={() => handleScrollToVideos('short')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Shorts
          </PillButton>

          <PillButton
            onClick={() => handleScrollToVideos('long')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            Cinematic
          </PillButton>
        </CategoryButtons>
      </ShowcaseSection>

      {/* Section 3: Video Gallery */}
      <VideoSection ref={videosRef}>
        <VideoSectionTitle>
          {selectedCategory === 'short' && 'Shorts Collection'}
          {selectedCategory === 'long' && 'Cinematic Collection'}
          {!selectedCategory && 'All Works'}
          <span>Hover to preview • Click to watch</span>
        </VideoSectionTitle>

        <VideoGrid>
          {displayVideos.map((video, index) => (
            <VideoItem
              key={`${selectedCategory || 'all'}-${index}`}
              video={video}
              index={index}
              onClick={openReel}
            />
          ))}
        </VideoGrid>
      </VideoSection>

      {/* Reel Modal */}
      <AnimatePresence>
        {reelOpen && (
          <ReelModalView
            video={displayVideos[currentVideoIndex]}
            onClose={closeReel}
            onNext={nextVideo}
            onPrev={prevVideo}
            canGoNext={currentVideoIndex < displayVideos.length - 1}
            canGoPrev={currentVideoIndex > 0}
            navigate={navigate}
          />
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default Video;