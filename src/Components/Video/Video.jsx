import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

// ============== KEYFRAME EFFECTS =================

const cinemaFlicker = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  10% { opacity: 0.95; transform: scale(1.005); }
  20% { opacity: 0.98; transform: scale(0.995); }
  30% { opacity: 1; transform: scale(1.002); }
  40% { opacity: 0.97; transform: scale(0.998); }
  50% { opacity: 1; transform: scale(1); }
`;

const neonGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 25px rgba(255, 20, 147, 0.4),
                0 0 50px rgba(255, 20, 147, 0.2),
                0 0 75px rgba(255, 20, 147, 0.1);
  }
  50% { 
    box-shadow: 0 0 35px rgba(255, 20, 147, 0.7),
                0 0 70px rgba(255, 20, 147, 0.4),
                0 0 100px rgba(255, 20, 147, 0.2);
  }
`;

const filmGrain = keyframes`
  0%, 100% { background-position: 0% 0%; }
  25% { background-position: 5% 5%; }
  50% { background-position: 10% 10%; }
  75% { background-position: 15% 15%; }
`;

const textReveal = keyframes`
  0% { 
    background-position: -200% center;
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% { 
    background-position: 200% center;
    opacity: 0.9;
  }
`;

const pulseRing = keyframes`
  0% {
    transform: scale(0.33);
    opacity: 1;
  }
  80%, 100% {
    transform: scale(2.33);
    opacity: 0;
  }
`;

// =================================================
//                 STYLED COMPONENTS
// =================================================

const CinemaContainer = styled(motion.div)`
  min-height: 100vh;
  background: 
    radial-gradient(circle at 25% 25%, #1a0033 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, #330066 0%, transparent 50%),
    linear-gradient(135deg, #000000 0%, #0f0f23 50%, #1a1a3a 100%);
  color: white;
  font-family: 'Press Start 2P', monospace;
  position: relative;
  overflow-x: hidden;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255, 20, 147, 0.03) 2px,
        rgba(255, 20, 147, 0.03) 4px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 2px,
        rgba(0, 191, 255, 0.03) 2px,
        rgba(0, 191, 255, 0.03) 4px
      );
    pointer-events: none;
    z-index: 1;
    animation: ${filmGrain} 0.5s infinite;
  }
`;

const Container = styled.div`
  position: relative;
  z-index: 2;
  padding: 60px 40px;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 40px 20px;
  }
  
  @media (max-width: 480px) {
    padding: 30px 15px;
  }
`;

const BackButton = styled(motion.button)`
  position: fixed;
  top: 30px;
  left: 30px;
  background: linear-gradient(45deg, #ff1493, #00bfff);
  color: #000;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.6rem;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 0 20px rgba(255, 20, 147, 0.3);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(255, 20, 147, 0.6);
  }
  
  @media (max-width: 768px) {
    top: 20px;
    left: 20px;
    padding: 10px 16px;
    font-size: 0.55rem;
  }
  
  @media (max-width: 480px) {
    top: 15px;
    left: 15px;
    padding: 8px 12px;
    font-size: 0.5rem;
  }
`;

const CinemaHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 80px;
  position: relative;
  
  @media (max-width: 768px) {
    margin-bottom: 60px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 40px;
  }
`;

const CinemaTitle = styled(motion.h1)`
  font-size: clamp(1.8rem, 5vw, 4.5rem);
  margin-bottom: 20px;
  background: linear-gradient(45deg, #ff1493, #00bfff, #ffff00, #ff6347);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${textReveal} 4s linear infinite;
  filter: drop-shadow(0 0 30px rgba(255, 20, 147, 0.6));
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: linear-gradient(45deg, transparent, rgba(255, 20, 147, 0.1), transparent);
    animation: ${cinemaFlicker} 3s ease-in-out infinite;
    z-index: -1;
  }
  
  @media (max-width: 480px) {
    font-size: clamp(1.4rem, 6vw, 2rem);
    margin-bottom: 15px;
  }
`;

const CinemaSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: #00bfff;
  opacity: 0.9;
  text-shadow: 
    0 0 10px rgba(0, 191, 255, 0.5),
    0 0 20px rgba(0, 191, 255, 0.3),
    0 0 30px rgba(0, 191, 255, 0.1);
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0 10px;
  }
`;

const VideoCategories = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 80px;
  
  @media (max-width: 768px) {
    gap: 30px;
    margin-bottom: 60px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 40px;
  }
`;

const CategoryButton = styled(motion.button)`
  padding: 15px 30px;
  background: ${props => props.active 
    ? 'linear-gradient(45deg, #ff1493, #00bfff)' 
    : 'rgba(255, 20, 147, 0.1)'};
  color: ${props => props.active ? '#000' : '#ff1493'};
  border: 2px solid #ff1493;
  border-radius: 25px;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  
  &:hover {
    background: linear-gradient(45deg, #ff1493, #00bfff);
    color: #000;
    box-shadow: 0 0 25px rgba(255, 20, 147, 0.5);
  }
  
  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 0.7rem;
  }
  
  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 0.65rem;
    width: 250px;
  }
`;

const VideoGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 40px;
  margin-bottom: 100px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
    margin-bottom: 80px;
  }
  
  @media (max-width: 480px) {
    gap: 25px;
    margin-bottom: 60px;
  }
`;

const VideoShowcase = styled(motion.div)`
  position: relative;
  height: 450px;
  perspective: 1000px;
  cursor: pointer;
  border-radius: 25px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255, 20, 147, 0.1), rgba(0, 191, 255, 0.1));
  border: 3px solid rgba(255, 20, 147, 0.3);
  animation: ${neonGlow} 4s ease-in-out infinite;
  
  @media (max-width: 768px) {
    height: 350px;
  }
  
  @media (max-width: 480px) {
    height: 300px;
  }
`;

const VideoThumbnail = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 20px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.3) 0%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.3) 100%
    );
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const PlayButton = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: linear-gradient(45deg, rgba(255, 20, 147, 0.9), rgba(0, 191, 255, 0.9));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid rgba(255, 20, 147, 0.4);
    border-radius: 50%;
    animation: ${pulseRing} 2s infinite;
  }
  
  &::after {
    content: '▶';
    font-size: 2.5rem;
    color: #000;
    margin-left: 8px;
  }
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    
    &::after {
      font-size: 2rem;
    }
  }
  
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    
    &::after {
      font-size: 1.5rem;
    }
  }
`;

const VideoInfo = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  z-index: 10;
  
  @media (max-width: 768px) {
    padding: 25px;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const VideoTitle = styled(motion.h3)`
  font-size: 1.4rem;
  color: #ffff00;
  margin-bottom: 15px;
  text-shadow: 0 0 15px rgba(255, 255, 0, 0.7);
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 10px;
  }
`;

const VideoDesc = styled(motion.p)`
  font-size: 0.8rem;
  color: #00bfff;
  margin-bottom: 15px;
  line-height: 1.6;
  text-shadow: 0 0 10px rgba(0, 191, 255, 0.3);
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.65rem;
    margin-bottom: 10px;
    line-height: 1.4;
  }
`;

const VideoLink = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 25px;
  background: linear-gradient(45deg, #ff1493, #00bfff);
  color: #000;
  text-decoration: none;
  border-radius: 25px;
  font-size: 0.7rem;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(255, 20, 147, 0.3);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(255, 20, 147, 0.6);
  }
  
  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.65rem;
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 0.6rem;
    gap: 6px;
  }
`;

const SpecsShowcase = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 20, 147, 0.1) 0%, rgba(0, 191, 255, 0.1) 100%);
  border: 2px solid rgba(255, 20, 147, 0.3);
  border-radius: 30px;
  padding: 50px;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 20, 147, 0.1), transparent);
    animation: ${textReveal} 8s linear infinite;
  }
  
  @media (max-width: 768px) {
    padding: 35px;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 25px;
    border-radius: 15px;
    margin: 0 10px;
  }
`;

const SpecsTitle = styled(motion.h2)`
  font-size: 2.2rem;
  color: #ffff00;
  margin-bottom: 30px;
  text-shadow: 0 0 20px rgba(255, 255, 0, 0.7);
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 25px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
    margin-bottom: 20px;
  }
`;

const SpecsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 25px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const SpecCategory = styled(motion.div)`
  text-align: left;
`;

const SpecLabel = styled.h4`
  color: #ff1493;
  font-size: 1.1rem;
  margin-bottom: 15px;
  text-shadow: 0 0 15px rgba(255, 20, 147, 0.5);
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 10px;
  }
`;

const SpecList = styled.p`
  color: #00bfff;
  font-size: 0.75rem;
  line-height: 1.8;
  text-shadow: 0 0 10px rgba(0, 191, 255, 0.3);
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
    line-height: 1.6;
  }
  
  @media (max-width: 480px) {
    font-size: 0.65rem;
    line-height: 1.5;
  }
`;

// =================================================
//                 DATA
// =================================================

const videoProjects = {
  short: [
    {
      title: "Cinematic Montage",
      description: "High-energy promotional video featuring dynamic transitions, color grading, and synchronized audio for maximum impact.",
      type: "Commercial",
      duration: "0:45",
      link: "https://drive.google.com/file/d/1atG4tA2ToM3gQy62abHBn2xlKUxoIgUn/view?usp=drive_link",
      embedId: "1atG4tA2ToM3gQy62abHBn2xlKUxoIgUn"
    },
    {
      title: "Brand Story",
      description: "Compelling narrative-driven content with professional motion graphics and seamless visual storytelling.",
      type: "Marketing",
      duration: "1:30",
      link: "https://drive.google.com/file/d/1-NK0xtCaFurfKdVOx6jl7fhPKmWJX04Z/view?usp=drive_link",
      embedId: "1-NK0xtCaFurfKdVOx6jl7fhPKmWJX04Z"
    },
    {
      title: "Social Media Promo",
      description: "Fast-paced social media content optimized for engagement with trendy cuts and vibrant color schemes.",
      type: "Social Media",
      duration: "0:30",
      link: "https://drive.google.com/file/d/1-2n8UcqRxt75bIausHPoPwHSfjJPaBwl/view?usp=drive_link",
      embedId: "1-2n8UcqRxt75bIausHPoPwHSfjJPaBwl"
    },
    {
      title: "Product Showcase",
      description: "Sleek product demonstration featuring smooth transitions, close-up details, and professional lighting effects.",
      type: "Product Demo",
      duration: "1:15",
      link: "https://drive.google.com/file/d/1ZcPSuMzJEOcmhPKSMF5gFp9u5YZvwYRN/view?usp=drive_link",
      embedId: "1ZcPSuMzJEOcmhPKSMF5gFp9u5YZvwYRN"
    },
    {
      title: "Event Highlights",
      description: "Dynamic event recap with synchronized beats, crowd reactions, and atmospheric color grading for maximum energy.",
      type: "Event",
      duration: "2:00",
      link: "https://drive.google.com/file/d/1gULhVfXtzTwTEQDe9DjyzEkTmotJHfz5/view?usp=drive_link",
      embedId: "1gULhVfXtzTwTEQDe9DjyzEkTmotJHfz5"
    },
    {
      title: "Creative Trailer",
      description: "Cinematic trailer with dramatic pacing, epic sound design, and Hollywood-style visual effects and transitions.",
      type: "Trailer",
      duration: "1:45",
      link: "https://drive.google.com/file/d/1EduKn1LEe-fgyNOn-9_fSjE1fAU9AaU7/view?usp=drive_link",
      embedId: "1EduKn1LEe-fgyNOn-9_fSjE1fAU9AaU7"
    },
    {
      title: "Fashion Reel",
      description: "Stylish fashion video with rhythmic editing, trendy effects, and mood-driven color palettes for modern aesthetics.",
      type: "Fashion",
      duration: "1:20",
      link: "https://drive.google.com/file/d/17AE-hyDxoAYkogmuTm06SVDrm9lii6pD/view?usp=drive_link",
      embedId: "17AE-hyDxoAYkogmuTm06SVDrm9lii6pD"
    },
    {
      title: "Music Video",
      description: "Beat-synchronized music video featuring creative visual effects, dynamic camera angles, and artistic storytelling.",
      type: "Music Video",
      duration: "2:30",
      link: "https://drive.google.com/file/d/1ENuSIjisGMLP_1hiOsDumeAR_hcROj8g/view?usp=drive_link",
      embedId: "1ENuSIjisGMLP_1hiOsDumeAR_hcROj8g"
    },
    {
      title: "Tech Demo",
      description: "Modern technology showcase with sleek animations, futuristic transitions, and clean minimalist design aesthetics.",
      type: "Technology",
      duration: "1:10",
      link: "https://drive.google.com/file/d/1niEhx022OR91BLSQfF4vuVfJkxVLLmTU/view?usp=drive_link",
      embedId: "1niEhx022OR91BLSQfF4vuVfJkxVLLmTU"
    }
  ],
  long: [
    {
      title: "Documentary Feature",
      description: "Full-length documentary with advanced editing techniques, multicamera synchronization, and immersive sound design.",
      type: "Documentary",
      duration: "15:30",
      link: "https://drive.google.com/file/d/1e2vY0CLRAy4iquChpngQsakoR1xPZCM7/view?usp=drive_link",
      embedId: "1e2vY0CLRAy4iquChpngQsakoR1xPZCM7"
    },
    {
      title: "Creative Showcase",
      description: "Artistic video production showcasing advanced visual effects, color theory application, and innovative editing workflows.",
      type: "Artistic",
      duration: "12:45",
      link: "https://drive.google.com/file/d/1l0UcpnQWaVJCkULNUSA8TBqeaVMhDSSV/view?usp=drive_link",
      embedId: "1l0UcpnQWaVJCkULNUSA8TBqeaVMhDSSV"
    }
  ]
};

const expertise = {
  software: "Adobe Premiere Pro, After Effects, DaVinci Resolve, Final Cut Pro, Avid Media Composer",
  techniques: "Color Grading, Motion Graphics, Visual Effects, Audio Synchronization, Multicam Editing",
  specialties: "Narrative Storytelling, Documentary Production, Commercial Content, Social Media Optimization",
  equipment: "4K/8K Workflows, HDR Processing, Professional Audio Mixing, Advanced Codec Management"
};

// =================================================
//               MOTION VARIANTS
// =================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const videoVariants = {
  hidden: { rotateY: -15, opacity: 0, scale: 0.8 },
  visible: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    rotateY: 5,
    rotateX: 5,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

// =================================================
//                   COMPONENT
// =================================================

export default function Video() {
  const [activeCategory, setActiveCategory] = useState('short');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const navigate = useNavigate();

  const handlePlayVideo = (index) => {
    setPlayingVideo(playingVideo === index ? null : index);
  };

  return (
    <CinemaContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <BackButton
        onClick={() => navigate('/dark')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        ← Back
      </BackButton>

      <Container>
        <CinemaHeader variants={itemVariants}>
          <CinemaTitle
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            CINEMA ARCHITECT
          </CinemaTitle>
          <CinemaSubtitle
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Crafting visual stories that captivate and inspire
          </CinemaSubtitle>
        </CinemaHeader>

        <VideoCategories variants={itemVariants}>
          <CategoryButton
            active={activeCategory === 'short'}
            onClick={() => {
              setActiveCategory('short');
              setPlayingVideo(null);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Short Form
          </CategoryButton>
          <CategoryButton
            active={activeCategory === 'long'}
            onClick={() => {
              setActiveCategory('long');
              setPlayingVideo(null);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Long Form
          </CategoryButton>
        </VideoCategories>

        <AnimatePresence mode="wait">
          <VideoGrid 
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -50 }}
          >
            {videoProjects[activeCategory].map((video, index) => (
              <VideoShowcase
                key={`${activeCategory}-${index}`}
                variants={videoVariants}
                whileHover="hover"
                onHoverStart={() => setSelectedVideo(index)}
                onHoverEnd={() => setSelectedVideo(null)}
              >
                <VideoThumbnail>
                  {playingVideo === index ? (
                    <iframe
                      src={`https://drive.google.com/file/d/${video.embedId}/preview`}
                      allow="autoplay"
                      allowFullScreen
                      title={video.title}
                    />
                  ) : (
                    <PlayButton
                      style={{
                        opacity: selectedVideo === index ? 1 : 0.7
                      }}
                      whileHover={{ scale: 1.1, opacity: 1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePlayVideo(index)}
                    />
                  )}
                </VideoThumbnail>
                <VideoInfo
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ 
                    y: selectedVideo === index ? 0 : 50, 
                    opacity: selectedVideo === index ? 1 : 0.9 
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <VideoTitle>{video.title}</VideoTitle>
                  <VideoDesc>
                    {video.description}
                    <br />
                    <strong style={{ color: '#ff1493' }}>
                      {video.type} • {video.duration}
                    </strong>
                  </VideoDesc>
                  <VideoLink 
                    href={video.link} 
                    target="_blank"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {playingVideo === index ? 'Open Full Screen →' : 'Watch Now →'}
                  </VideoLink>
                </VideoInfo>
              </VideoShowcase>
            ))}
          </VideoGrid>
        </AnimatePresence>

        <SpecsShowcase
          variants={itemVariants}
          whileInView={{ scale: [0.95, 1.02, 1] }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <SpecsTitle>PRODUCTION ARSENAL</SpecsTitle>
          <SpecsGrid>
            <SpecCategory>
              <SpecLabel>Software Mastery</SpecLabel>
              <SpecList>{expertise.software}</SpecList>
            </SpecCategory>
            <SpecCategory>
              <SpecLabel>Technical Skills</SpecLabel>
              <SpecList>{expertise.techniques}</SpecList>
            </SpecCategory>
            <SpecCategory>
              <SpecLabel>Creative Specialties</SpecLabel>
              <SpecList>{expertise.specialties}</SpecList>
            </SpecCategory>
            <SpecCategory>
              <SpecLabel>Technical Workflows</SpecLabel>
              <SpecList>{expertise.equipment}</SpecList>
            </SpecCategory>
          </SpecsGrid>
        </SpecsShowcase>
      </Container>
    </CinemaContainer>
  );
}