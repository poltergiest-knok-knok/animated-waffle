import React, { useState, useMemo, useCallback, memo } from "react";
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

const CinemaContainer = styled(motion.div)`
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

const Container = styled.div`
  position: relative;
  z-index: 2;
  padding: 60px 20px;
  max-width: 1600px;
  margin: 0 auto;
`;

const VideoStreamContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  padding: 40px 20px;
  padding-bottom: 10vh;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 5;
  position: relative;

  @media(max-width: 768px) {
    grid-template-columns: 1fr; /* Single column on mobile */
    gap: 40px;
  }
`;

const VideoCard = styled(motion.div)`
  position: relative;
  background: #000;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  z-index: 1;
  backface-visibility: hidden;
  will-change: transform;
`;

const VideoContentWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  overflow: hidden;
  background: #000;
  z-index: 2;
  transform: translateZ(0);
  mask-image: -webkit-radial-gradient(white, black);
`;

const CinemaHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 10;
  min-height: 20vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CinemaTitle = styled(motion.h1)`
  font-family: 'Inter', sans-serif;
  font-size: clamp(2.5rem, 5vw, 5rem);
  font-weight: 300;
  letter-spacing: clamp(0.2rem, 1vw, 1rem);
  color: #fff;
  text-transform: uppercase;
  margin-bottom: 20px;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
  
  span {
    display: block;
    font-size: clamp(0.8rem, 1.5vw, 1rem);
    letter-spacing: 0.5rem;
    opacity: 0.5;
    margin-top: 10px;
    font-weight: 600;
  }
`;

// Header Components
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
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);

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

const NavCenter = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NavRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const CategorySwitcher = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 5px;
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  gap: 5px;
`;

const SwitcherButton = styled.button`
  background: ${props => props.active ? 'rgba(255, 255, 255, 1)' : 'transparent'};
  color: ${props => props.active ? '#000' : 'rgba(255, 255, 255, 0.7)'};
  border: none;
  padding: 8px 20px;
  border-radius: 30px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: ${props => props.active ? '0 4px 15px rgba(0,0,0,0.2)' : 'none'};
  
  &:hover {
    color: ${props => props.active ? '#000' : '#fff'};
    background: ${props => props.active ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.05)'};
  }

  @media(max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
`;

// Selection View Components
const SelectionSection = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 40px 20px;
  background: #000;
  z-index: 10;
`;

const SelectionTitle = styled(motion.h2)`
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

const CardsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  width: 100%;
  max-width: 1200px;
  flex-wrap: wrap;
`;

const CategorySelectionCard = styled(motion.div)`
  flex: 1;
  min-width: 300px;
  aspect-ratio: 16/9;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  padding: 40px;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.08);
    
    h3 {
      transform: scale(1.1);
      letter-spacing: 1rem;
    }
  }

  h3 {
    font-size: 2rem;
    text-transform: uppercase;
    letter-spacing: 0.5rem;
    color: #fff;
    font-weight: 300;
    transition: all 0.5s ease;
    z-index: 2;
  }
  
  &::before {
    content: '';
    position: absolute;
    width: 200px;
    height: 200px;
    background: ${props => props.$glow || 'rgba(255,255,255,0.1)'};
    filter: blur(80px);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.5s ease;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:hover::before {
    opacity: 1;
  }
  
  @media(max-width: 768px) {
    min-width: 100%;
    aspect-ratio: 4/3;
  }
`;

// ==========================================
// SUB-COMPONENTS
// ==========================================

const CinematicVideoItem = ({ video }) => {
  const videoRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        // Unmute on play
        videoRef.current.muted = false;
        videoRef.current.play().catch(() => { });
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%', aspectRatio: '9/16' }}
      onClick={handleClick}
    >
      <VideoCard>
        <VideoContentWrapper>
          <div style={{ width: '100%', height: '100%', background: '#000', position: 'relative', cursor: 'pointer' }}>
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
              muted={true}
              loop
              playsInline
              webkit-playsinline="true"
              disablePictureInPicture
              preload="metadata"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '20px',
                    pointerEvents: 'none'
                  }}
                >
                  <h3 style={{ fontSize: '1.2rem', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{video.title}</h3>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </VideoContentWrapper>
      </VideoCard>
    </motion.div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

const Video = memo(() => {
  const [viewState, setViewState] = useState("landing"); // 'landing', 'short', 'long'
  const navigate = useNavigate();
  const showcaseRef = React.useRef(null);

  const handleScrollToSelection = () => {
    showcaseRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelection = (type) => {
    setViewState(type);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToLanding = () => {
    setViewState("landing");
  };

  const currentVideos = useMemo(() => {
    if (viewState === "landing") return [];
    return videoProjects[viewState] || [];
  }, [viewState]);

  // RENDER: GALLERY VIEW (Shorts or Cinematic)
  if (viewState !== "landing") {
    return (
      <CinemaContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <SEO
          title={`UnmuteXE - ${viewState === 'short' ? 'Shorts' : 'Cinematic'}`}
          description="Video Portfolio"
        />
        <FixedTopBar>
          <NavLeft>
            <GlassButton onClick={handleBackToLanding}>← Back to Showcase</GlassButton>
          </NavLeft>
          <NavCenter>
            <h3 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>
              {viewState === 'short' ? 'Shorts Collection' : 'Cinematic Collection'}
            </h3>
          </NavCenter>
          <NavRight>
            <GlassButton onClick={() => navigate('/contact')}>Contact</GlassButton>
          </NavRight>
        </FixedTopBar>

        <Container style={{ paddingTop: '100px' }}>
          <VideoStreamContainer>
            <AnimatePresence mode="wait">
              <motion.div
                key={viewState}
                style={{ display: 'contents' }}
              >
                {currentVideos.map((video, index) => (
                  <CinematicVideoItem
                    key={`${viewState}-${index}`}
                    video={video}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </VideoStreamContainer>

          {/* Empty state check */}
          {currentVideos.length === 0 && (
            <div style={{ textAlign: 'center', padding: '50px', opacity: 0.5 }}>
              No videos found in this category yet.
            </div>
          )}
        </Container>
      </CinemaContainer>
    );
  }

  // RENDER: LANDING VIEW (Hero + Selection)
  return (
    <CinemaContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <SEO
        title="UnmuteXE - Portfolio"
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

      <VynceVisual onButtonClick={handleScrollToSelection} />

      <SelectionSection ref={showcaseRef}>
        <SelectionTitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Showcase<span>Select your visual experience</span>
        </SelectionTitle>

        <CardsRow>
          <CategorySelectionCard
            $glow="rgba(255, 100, 255, 0.4)"
            onClick={() => handleSelection('short')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3>Shorts</h3>
          </CategorySelectionCard>

          <CategorySelectionCard
            $glow="rgba(0, 200, 255, 0.4)"
            onClick={() => handleSelection('long')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3>Cinematic</h3>
          </CategorySelectionCard>
        </CardsRow>
      </SelectionSection>
    </CinemaContainer>
  );
});

export default Video;