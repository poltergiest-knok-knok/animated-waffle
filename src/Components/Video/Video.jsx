import React, { useState, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import GlassButton from "../Shared/GlassButton";

// ============== KEYFRAME EFFECTS =================

const cinemaFlicker = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.95; }
`;

const neonGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(255, 20, 147, 0.4);
  }
  50% { 
    box-shadow: 0 0 30px rgba(255, 20, 147, 0.6);
  }
`;

const filmGrain = keyframes`
  0%, 100% { background-position: 0% 0%; }
  50% { background-position: 5% 5%; }
`;

const textReveal = keyframes`
  0% { 
    background-position: -100% center;
  }
  100% { 
    background-position: 100% center;
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

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// =================================================
//                 STYLED COMPONENTS
// =================================================

const CinemaContainer = styled(motion.div)`
  min-height: 100vh;
  background: #000;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  position: relative;
  overflow-x: hidden;
  
  /* Abstract Background Blobs */
  &::before {
    content: '';
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(circle at 30% 30%, rgba(255, 20, 147, 0.15), transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(0, 191, 255, 0.15), transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(138, 43, 226, 0.15), transparent 50%);
    filter: blur(60px);
    z-index: 0;
    pointer-events: none;
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
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #fff 0%, #ccc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -2px;
  
  @media (max-width: 480px) {
    font-size: clamp(2rem, 8vw, 3rem);
    margin-bottom: 15px;
  }
`;

const CinemaSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0 20px;
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

const StyledCategoryButton = styled(GlassButton)`
  background: ${props => props.active
    ? 'rgba(255, 255, 255, 0.2)'
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.active
    ? 'rgba(255, 255, 255, 0.4)'
    : 'rgba(255, 255, 255, 0.1)'};
`;

const VideoGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: ${props => props.format === 'short'
    ? 'repeat(auto-fit, minmax(300px, 1fr))'
    : 'repeat(auto-fit, minmax(500px, 1fr))'};
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
  width: 100%;
  aspect-ratio: ${props => props.format === 'short' ? '9/16' : '16/9'};
  cursor: pointer;
  border-radius: 30px;
  overflow: hidden;
  will-change: transform;
  
  /* Base Card Style - Clean & Premium */
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  transition: all 0.4s ease;
  z-index: 1;
  
  &:hover {
    transform: translateY(-10px);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 
      0 20px 50px rgba(0,0,0,0.5),
      0 0 30px rgba(255, 255, 255, 0.05);
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
  background-image: url(${props => props.thumbnail});
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease; /* Smooth zoom transition */
  
  /* Zoom effect on hover */
  ${VideoShowcase}:hover & {
    transform: scale(1.05);
  }
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 20px;
    position: relative;
    z-index: 5;
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
      rgba(0, 0, 0, 0.6) 0%,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0.6) 100%
    );
    z-index: 1;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 0.8;
  }
`;

const PlayButton = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  /* transform is handled by framer-motion initial prop to avoid conflicts */
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: opacity 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    animation: ${pulseRing} 2s infinite;
  }
  
  &::after {
    content: '▶';
    font-size: 2.5rem;
    color: #fff;
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
  z-index: 10;
  
  /* Prism Glass Card inside */
  background: rgba(10, 10, 10, 0.7); /* Slightly darker for better text contrast */
  backdrop-filter: blur(15px); /* Reduced blur to help with text sharpness */
  -webkit-backdrop-filter: blur(15px);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 -10px 30px rgba(0,0,0,0.3);
  transform: translateZ(0); /* Hardware acceleration for text sharpness */
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  
  @media (max-width: 768px) {
    padding: 25px;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const VideoTitle = styled(motion.h3)`
  font-size: 1.4rem;
  color: #fff;
  margin-bottom: 10px;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const VideoDesc = styled(motion.p)`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const SpecsShowcase = styled(motion.div)`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.02)
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  padding: 60px;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  transition: all 0.4s ease;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 
      0 20px 40px rgba(0,0,0,0.3),
      0 0 30px rgba(255, 255, 255, 0.05);
  }
  
  @media (max-width: 768px) {
    padding: 40px;
    border-radius: 30px;
  }
  
  @media (max-width: 480px) {
    padding: 30px;
    border-radius: 20px;
  }
`;

const SpecsTitle = styled(motion.h2)`
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 40px;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
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
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 15px;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const SpecList = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.8;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
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
      link: "https://drive.google.com/file/d/1atG4tA2ToM3gQy62abHBn2xlKUxoIgUn/view?usp=drive_link",
      embedId: "1atG4tA2ToM3gQy62abHBn2xlKUxoIgUn",
      thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Brand Story",
      description: "Compelling narrative-driven content with professional motion graphics and seamless visual storytelling.",
      type: "Marketing",
      link: "https://drive.google.com/file/d/1-NK0xtCaFurfKdVOx6jl7fhPKmWJX04Z/view?usp=drive_link",
      embedId: "1-NK0xtCaFurfKdVOx6jl7fhPKmWJX04Z",
      thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Social Media Promo",
      description: "Fast-paced social media content optimized for engagement with trendy cuts and vibrant color schemes.",
      type: "Social Media",
      link: "https://drive.google.com/file/d/1-2n8UcqRxt75bIausHPoPwHSfjJPaBwl/view?usp=drive_link",
      embedId: "1-2n8UcqRxt75bIausHPoPwHSfjJPaBwl",
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Product Showcase",
      description: "Sleek product demonstration featuring smooth transitions, close-up details, and professional lighting effects.",
      type: "Product Demo",
      link: "https://drive.google.com/file/d/1ZcPSuMzJEOcmhPKSMF5gFp9u5YZvwYRN/view?usp=drive_link",
      embedId: "1ZcPSuMzJEOcmhPKSMF5gFp9u5YZvwYRN",
      thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Event Highlights",
      description: "Dynamic event recap with synchronized beats, crowd reactions, and atmospheric color grading for maximum energy.",
      type: "Event",
      link: "https://drive.google.com/file/d/1gULhVfXtzTwTEQDe9DjyzEkTmotJHfz5/view?usp=drive_link",
      embedId: "1gULhVfXtzTwTEQDe9DjyzEkTmotJHfz5",
      thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Creative Trailer",
      description: "Cinematic trailer with dramatic pacing, epic sound design, and Hollywood-style visual effects and transitions.",
      type: "Trailer",
      link: "https://drive.google.com/file/d/1EduKn1LEe-fgyNOn-9_fSjE1fAU9AaU7/view?usp=drive_link",
      embedId: "1EduKn1LEe-fgyNOn-9_fSjE1fAU9AaU7",
      thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e63?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Fashion Reel",
      description: "Stylish fashion video with rhythmic editing, trendy effects, and mood-driven color palettes for modern aesthetics.",
      type: "Fashion",
      link: "https://drive.google.com/file/d/17AE-hyDxoAYkogmuTm06SVDrm9lii6pD/view?usp=drive_link",
      embedId: "17AE-hyDxoAYkogmuTm06SVDrm9lii6pD",
      thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Music Video",
      description: "Beat-synchronized music video featuring creative visual effects, dynamic camera angles, and artistic storytelling.",
      type: "Music Video",
      link: "https://drive.google.com/file/d/1ENuSIjisGMLP_1hiOsDumeAR_hcROj8g/view?usp=drive_link",
      embedId: "1ENuSIjisGMLP_1hiOsDumeAR_hcROj8g",
      thumbnail: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Tech Demo",
      description: "Modern technology showcase with sleek animations, futuristic transitions, and clean minimalist design aesthetics.",
      type: "Technology",
      link: "https://drive.google.com/file/d/1niEhx022OR91BLSQfF4vuVfJkxVLLmTU/view?usp=drive_link",
      embedId: "1niEhx022OR91BLSQfF4vuVfJkxVLLmTU",
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ],
  long: [
    {
      title: "Documentary Feature",
      description: "Full-length documentary with advanced editing techniques, multicamera synchronization, and immersive sound design.",
      type: "Documentary",
      link: "https://drive.google.com/file/d/1e2vY0CLRAy4iquChpngQsakoR1xPZCM7/view?usp=drive_link",
      embedId: "1e2vY0CLRAy4iquChpngQsakoR1xPZCM7",
      thumbnail: "https://images.unsplash.com/photo-1533561797500-4fad4750814e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Creative Showcase",
      description: "Artistic video production showcasing advanced visual effects, color theory application, and innovative editing workflows.",
      type: "Artistic",
      link: "https://drive.google.com/file/d/1l0UcpnQWaVJCkULNUSA8TBqeaVMhDSSV/view?usp=drive_link",
      embedId: "1l0UcpnQWaVJCkULNUSA8TBqeaVMhDSSV",
      thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ]
};

const expertise = {
  software: "Adobe Premiere Pro, After Effects, DaVinci Resolve, Final Cut Pro, Avid Media Composer",
  techniques: "Color Grading, Motion Graphics, Visual Effects, Audio Synchronization, Multicam Editing",
  specialties: "Narrative Storytelling, Documentary Production, Commercial Content, Social Media Optimization",
  equipment: "4K/8K Workflows, HDR Processing, Professional Audio Mixing, Advanced Codec Management"
};

const neonColors = [
  "255, 20, 147", // Deep Pink
  "0, 255, 255",  // Cyan
  "255, 0, 255",  // Magenta
  "57, 255, 20",  // Neon Green
  "255, 255, 0",  // Yellow
  "138, 43, 226", // Blue Violet
  "255, 69, 0"    // Orange Red
];

// =================================================
//               MOTION VARIANTS
// =================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
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
  }
  // Removed hover 3D scaling to fix blurriness
};

// =================================================
//                   COMPONENT
// =================================================

const Video = memo(() => {
  const [activeCategory, setActiveCategory] = useState('short');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [hoveredPlayButton, setHoveredPlayButton] = useState(null);
  const navigate = useNavigate();

  const handlePlayVideo = useCallback((index) => {
    setPlayingVideo(prev => prev === index ? null : index);
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
    setPlayingVideo(null);
  }, []);

  const currentVideos = useMemo(() => videoProjects[activeCategory], [activeCategory]);

  return (
    <CinemaContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div style={{ position: 'fixed', top: '30px', left: '30px', zIndex: 1000 }}>
        <GlassButton onClick={() => navigate('/dark')}>
          ← Back
        </GlassButton>
      </div>

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
          <StyledCategoryButton
            active={activeCategory === 'short'}
            onClick={() => handleCategoryChange('short')}
          >
            Short Form
          </StyledCategoryButton>
          <StyledCategoryButton
            active={activeCategory === 'long'}
            onClick={() => handleCategoryChange('long')}
          >
            Long Form
          </StyledCategoryButton>
        </VideoCategories>

        <AnimatePresence mode="wait">
          <VideoGrid
            key={activeCategory}
            format={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -50 }}
          >
            {currentVideos.map((video, index) => (
              <VideoShowcase
                key={`${activeCategory}-${index}`}
                format={activeCategory}
                variants={videoVariants}
                whileHover={playingVideo === index ? {} : "hover"}
                onHoverStart={() => setSelectedVideo(index)}
                onHoverEnd={() => setSelectedVideo(null)}
              >
                <VideoThumbnail thumbnail={video.thumbnail}>
                  {playingVideo === index ? (
                    <iframe
                      src={`https://drive.google.com/file/d/${video.embedId}/preview`}
                      allow="autoplay"
                      allowFullScreen
                      title={video.title}
                      style={{ pointerEvents: 'auto' }}
                    />
                  ) : (
                    <PlayButton
                      initial={{ x: "-50%", y: "-50%" }}
                      style={{
                        opacity: selectedVideo === index ? 1 : 0.7
                      }}
                      whileHover={{ scale: 1.1, opacity: 1 }}
                      whileTap={{ scale: 0.95 }}
                      onHoverStart={() => setHoveredPlayButton(index)}
                      onHoverEnd={() => setHoveredPlayButton(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayVideo(index);
                      }}
                    />
                  )}
                </VideoThumbnail>
                <VideoInfo
                  initial={{ y: 100, opacity: 0 }}
                  animate={{
                    y: playingVideo === index ? 100 : (hoveredPlayButton === index ? 50 : (selectedVideo === index ? 0 : 50)),
                    opacity: playingVideo === index ? 0 : (hoveredPlayButton === index ? 0.8 : (selectedVideo === index ? 1 : 0.8)),
                    pointerEvents: playingVideo === index ? 'none' : 'auto'
                  }}
                  transition={{ duration: 0.4 }}
                  style={{
                    '@media (max-width: 768px)': {
                      y: 0,
                      opacity: 1
                    }
                  }}
                >
                  <VideoTitle>{video.title}</VideoTitle>
                  <VideoDesc>{video.description}</VideoDesc>
                  <GlassButton
                    as="a"
                    href={video.link}
                    target="_blank"
                    style={{ display: 'inline-flex', textDecoration: 'none' }}
                  >
                    Watch Full Video →
                  </GlassButton>
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
          <SpecsTitle>TECHNICAL ARSENAL</SpecsTitle>
          <SpecsGrid>
            <SpecCategory>
              <SpecLabel>Software Proficiency</SpecLabel>
              <SpecList>{expertise.software}</SpecList>
            </SpecCategory>
            <SpecCategory>
              <SpecLabel>Advanced Techniques</SpecLabel>
              <SpecList>{expertise.techniques}</SpecList>
            </SpecCategory>
            <SpecCategory>
              <SpecLabel>Creative Specialties</SpecLabel>
              <SpecList>{expertise.specialties}</SpecList>
            </SpecCategory>
            <SpecCategory>
              <SpecLabel>Equipment & Workflow</SpecLabel>
              <SpecList>{expertise.equipment}</SpecList>
            </SpecCategory>
          </SpecsGrid>
        </SpecsShowcase>
      </Container>
    </CinemaContainer>
  );
});

export default Video;