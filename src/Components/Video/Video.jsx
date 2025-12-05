import React, { useState, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled, { keyframes, css } from "styled-components";
import { useNavigate } from "react-router-dom";

import GlassButton from "../Shared/GlassButton"; // Import shared GlassButton


const CinemaContainer = styled(motion.div)`
  height: 100vh; /* Fallback */
  height: 100dvh;
  background: #050505;
  color: white;
  font-family: 'Inter', sans-serif;
  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  
  /* Hide scrollbar for cleaner mobile look */
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
  
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

const CinematicVideoItem = ({ video, index, isActive, onInView, format, isMuted, toggleMute }) => {
  const videoRef = React.useRef(null);
  const [isLiked, setIsLiked] = useState(false); // Local liked state for visible feedback

  const isShort = format === 'short';

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const width = isMobile ? '100%' : '400px';
  const maxWidth = isMobile ? '100%' : '400px';
  const aspectRatio = '9/16';
  const borderRadius = isMobile ? '24px' : '30px'; // Rounded corners on mobile for aesthetic card look
  const actualWidth = width; // Use container width (with padding) instead of full viewport

  // Play/Pause Logic
  React.useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Auto-play prevented:", error);
          });
        }
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0; // Reset to start
        // Mute state is now controlled by parent, do not reset it here
      }
    }
  }, [isActive]);

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const togglePlay = (e) => {
    // Basic tap to play/pause
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <motion.div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        perspective: '1000px',
        marginBottom: '40px', // Reduced margin for smoother snap feel
        paddingTop: '20px',
        scrollSnapAlign: 'center'
      }}
      // Use margin to trigger earlier/later without requiring 60% visibility
      viewport={{ amount: 0.5, margin: "-10% 0px -10% 0px" }}
      onViewportEnter={() => onInView(index)}
    >
      <motion.div
        style={{
          width: actualWidth,
          maxWidth: isMobile ? '100vw' : maxWidth,
          aspectRatio,
          transformStyle: 'preserve-3d',
          position: 'relative'
        }}
        animate={{
          scale: isActive ? 1 : 0.85, // More dramatic scale difference for "pop"
          opacity: isActive ? 1 : 0.5,
          y: isActive ? 0 : 50, // Slight vertical movement
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 1
        }}
      >
        <VideoCard
          $isActive={isActive}
          $glowColor={video.glowColor}
          style={{ borderRadius, width: '100%', height: '100%' }}
        >
          {isActive && (
            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 30 }}>
              <RecIndicator>REC</RecIndicator>
            </div>
          )}

          <div
            onClick={togglePlay} // Tap to toggle play/pause
            style={{ width: '100%', height: '100%', background: '#000', position: 'relative', cursor: 'pointer' }}
          >
            <video
              ref={videoRef}
              src={video.src}
              muted={isMuted}
              loop
              playsInline
              preload="auto"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius
              }}
            />

            {/* Reel UI Overlays - Only visible when Active */}
            <AnimatePresence>
              {isActive && (
                <>
                  {/* Right Sidebar Actions */}
                  <ReelSidebar
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ReelActionButton onClick={handleLike} whileTap={{ scale: 0.9 }}>
                      {isLiked ? '❤️' : '🤍'}
                    </ReelActionButton>

                    <ReelActionButton onClick={(e) => { e.stopPropagation(); toggleMute(); }} whileTap={{ scale: 0.9 }}>
                      {isMuted ? '🔇' : '🔊'}
                    </ReelActionButton>

                    <ReelActionButton whileTap={{ scale: 0.9 }}>
                      🔗
                    </ReelActionButton>

                    <ReelActionButton style={{ borderRadius: '15px' }} whileTap={{ scale: 0.9 }}>
                      <div style={{ width: '24px', height: '24px', background: 'white', borderRadius: '50%' }} />
                    </ReelActionButton>
                  </ReelSidebar>

                  {/* Bottom Info Gradient */}
                  <ReelBottomInfo
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <TagPill>#{video.title.split(' ')[0]}</TagPill>
                      <TagPill>#Portfolio</TagPill>
                    </div>
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                  </ReelBottomInfo>
                </>
              )}
            </AnimatePresence>

            {/* Play Overlay - Fades out when active */}
            <AnimatePresence>
              {!isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Thumbnail>
                    <PlayOverlay>
                      <div className="icon">▶</div>
                    </PlayOverlay>
                  </Thumbnail>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </VideoCard>
      </motion.div>
    </motion.div>
  );
};

// Cinematic Assets
const GrainOverlay = styled.div`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  opacity: 0.05;
  background-image: url("https://upload.wikimedia.org/wikipedia/commons/7/76/Noise_overlay.png");
  mix-blend-mode: overlay;
`;

const Vignette = styled.div`
  position: fixed;
  inset: 0;
  background: radial-gradient(circle, transparent 50%, rgba(0,0,0,0.8) 100%);
  pointer-events: none;
  z-index: 2;
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

const CinemaHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 10;
  
  /* Hero Section Styling: Full Height, Centered */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  scroll-snap-align: start; // Snap to the top securely
`;

const CinemaTitle = styled(motion.h1)`
  font-family: 'Inter', sans-serif;
  font-size: clamp(2.5rem, 5vw, 8rem); // Slightly smaller min for mobile
  font-weight: 300;
  letter-spacing: clamp(0.2rem, 1vw, 1rem); // Adaptive spacing
  color: #fff;
  text-transform: uppercase;
  margin-bottom: 20px;
  text-shadow: 0 0 30px rgba(255,255,255,0.2);
  
  span {
    display: block;
    font-size: clamp(0.8rem, 1.5vw, 1rem);
    letter-spacing: 0.5rem;
    opacity: 0.5;
    margin-top: 10px;
    font-weight: 600;
  }
`;

const CinemaSubtitle = styled(motion.p)`
  font-size: clamp(0.7rem, 2vw, 0.9rem);
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  max-width: 600px;
  margin: 0 auto;
  border-top: 1px solid rgba(255,255,255,0.2);
  display: inline-block;
  padding-left: 10px; // Safety padding
  padding-right: 10px;
`;

const ScrollPrompt = styled(motion.div)`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  
  p {
    font-size: 0.75rem;
    letter-spacing: 0.3rem;
    text-transform: uppercase;
    color: rgba(255,255,255,0.5);
    margin: 0;
  }
  
  .arrow {
    font-size: 1.2rem;
    color: rgba(255,255,255,0.8);
    animation: ${bounce} 2s infinite;
    text-shadow: 0 0 10px rgba(255,255,255,0.3);
  }
`;

const RecIndicator = styled(motion.div)`
  position: absolute;
  top: 30px;
  left: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ff3b3b;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 2px;
  z-index: 20;

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    background: #ff3b3b;
    border-radius: 50%;
    box-shadow: 0 0 10px #ff3b3b;
  }
`;

const Timecode = styled.div`
  position: absolute;
  top: 30px;
  right: 30px;
  font-family: 'Courier New', monospace;
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
  letter-spacing: 1px;
  z-index: 20;
`;

const VideoCategories = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 80px;
  position: sticky;
  top: 20px;
  z-index: 100;
  backdrop-filter: blur(10px);
  padding: 10px;
  border-radius: 50px;
  background: rgba(0,0,0,0.5);
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
`;

const StyledCategoryButton = styled(GlassButton)`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.active ? '#000' : '#fff'};
  border: none;
  
  &:hover {
    background: ${props => props.active ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.15)'};
  }
`;

const VideoStreamContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 30vh;
  perspective: 2000px;
`;

const VideoCard = styled(motion.div)`
  position: relative;
  background: #000;
  overflow: hidden;
  box-shadow: 0 20px 80px rgba(0,0,0,0.8);
  border: 1px solid rgba(255,255,255,0.08);
  transition: border-color 0.3s ease;
  
  will-change: transform, box-shadow; // Optimization hint
  
  ${props => props.$isActive && css`
    border-color: rgba(255,255,255,0.3);
    box-shadow: 0 0 40px ${props.$glowColor || 'rgba(255, 20, 147, 0.5)'};
    animation: ${activeGlow} 4s infinite ease-in-out;
    --glow-color: ${props.$glowColor || 'rgba(255, 20, 147, 0.5)'};
  `}
`;

// Update keyframe to use CSS variable for dynamic color
const activeGlow = keyframes`
  0% { box-shadow: 0 0 20px var(--glow-color); }
  50% { box-shadow: 0 0 50px var(--glow-color); }
  100% { box-shadow: 0 0 20px var(--glow-color); }
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.bg});
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6));
  }
`;

const PlayOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  
  .icon {
    font-size: 4rem;
    color: rgba(255,255,255,0.9);
    filter: drop-shadow(0 0 20px rgba(0,0,0,0.5));
  }
`;

const VideoMeta = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 40px;
  background: linear-gradient(to top, #000 0%, transparent 100%);
  z-index: 5;
  pointer-events: none;
  text-align: center; // Center align like movie posters
  
  h3 {
    font-family: 'Inter', sans-serif;
    font-size: 2rem;
    font-weight: 300;
    letter-spacing: 5px;
    text-transform: uppercase;
    margin-bottom: 10px;
    color: #fff;
    text-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }
  
  p {
    font-family: 'Courier New', monospace; // Tech/Edit feel
    font-size: 0.8rem;
    color: rgba(255,255,255,0.6);
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  @media (max-width: 768px) {
    padding: 20px;
    h3 { font-size: 1.2rem; letter-spacing: 2px; }
    p { font-size: 0.7rem; }
  }
`;

const videoProjects = {
  short: [
    {
      title: "Social Media Edit",
      description: "High-energy fast cuts for maximum retention.",
      src: "/Videos/Neha Datta Shorts 6.mp4",
      thumbnail: "",
      glowColor: "rgba(255, 100, 255, 0.6)" // Purple/Pink
    },
    {
      title: "Vintage Benz",
      description: "Classic car restoration showcase.",
      src: "/Videos/benz 300d graded F1 topaz enhanced.mp4",
      thumbnail: "",
      glowColor: "rgba(255, 215, 0, 0.6)" // Gold
    },
    {
      title: "Product Commercial",
      description: "Sleek 3D motion graphics and product showcase.",
      src: "/Videos/x part 3 credit card.mp4",
      thumbnail: "",
      glowColor: "rgba(0, 200, 255, 0.6)" // Cyan
    },
    {
      title: "Visual Effects",
      description: "Abstract 3D simulation and rendering.",
      src: "/Videos/cube animation.mp4",
      thumbnail: "",
      glowColor: "rgba(100, 255, 100, 0.6)" // Green
    },
    {
      title: "Creative Recreation",
      description: "Stylized visual recreation and color grading.",
      src: "/Videos/recreation N1.mp4",
      thumbnail: "",
      glowColor: "rgba(255, 50, 50, 0.6)" // Red
    },
    {
      title: "Cinematic Food",
      description: "High-end culinary cinematography.",
      src: "/Videos/Chickpea salad bowl.mp4",
      thumbnail: "",
      glowColor: "rgba(255, 165, 0, 0.6)" // Orange
    },
    {
      title: "Automotive B-Roll",
      description: "Dynamic automotive cinematography.",
      src: "/Videos/blue_benz.mp4",
      thumbnail: "",
      glowColor: "rgba(0, 100, 255, 0.6)" // Deep Blue
    },
    {
      title: "Travel Vlog",
      description: "Narrative storytelling and lifestyle.",
      src: "/Videos/Dogesh.mp4",
      thumbnail: "",
      glowColor: "rgba(255, 255, 100, 0.6)" // Yellow
    },
    {
      title: "Event Highlights",
      description: "Capturing the energy of live events.",
      src: "/Videos/EVO final topaz.mp4",
      thumbnail: "",
      glowColor: "rgba(200, 0, 255, 0.6)" // Violet
    },
    {
      title: "Corporate Brand",
      description: "Professional brand identity work.",
      src: "/Videos/Magnates ae.mp4",
      thumbnail: "",
      glowColor: "rgba(0, 255, 200, 0.6)" // Teal
    },
    {
      title: "Technical Tracking",
      description: "Advanced camera tracking and stabilization.",
      src: "/Videos/camera follow.mp4",
      thumbnail: "",
      glowColor: "rgba(255, 255, 255, 0.6)" // White
    }
  ],
  long: []
};

// Reel / TikTok Style UI Components
const ReelSidebar = styled(motion.div)`
  position: absolute;
  right: 15px;
  bottom: 120px; /* Moved up to clear text */
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 30;

  @media (max-width: 768px) {
    right: 10px;
    bottom: calc(100px + env(safe-area-inset-bottom));
    gap: 15px;
  }
`;

const ReelActionButton = styled(motion.button)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
    border-color: rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 1.2rem;
  }

  span {
    font-size: 0.7rem;
    margin-top: 5px;
    font-weight: 600;
  }
`;

const ReelBottomInfo = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30px 20px;
  padding-bottom: calc(30px + env(safe-area-inset-bottom)); /* Safe area padding */
  background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 60%, transparent 100%);
  z-index: 25;
  z-index: 25;
  text-align: left;
  pointer-events: none;

  h3 {
    font-family: 'Inter', sans-serif;
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 8px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    background: none;
    -webkit-text-fill-color: initial;
    color: #fff;
    letter-spacing: 0.5px;
  }

  p {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.4;
    max-width: 75%; /* Limit width to avoid hitting buttons if they overlap */
    margin-bottom: 5px;
    text-shadow: 0 1px 4px rgba(0,0,0,0.5);
    font-family: 'Inter', sans-serif;
    text-transform: none;
    letter-spacing: normal;
    
    /* Ensure only 2 lines max */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  @media (max-width: 768px) {
    padding: 20px 15px;
    padding-bottom: calc(20px + env(safe-area-inset-bottom));
    h3 { font-size: 1.2rem; }
    p { font-size: 0.85rem; max-width: 80%; }
  }
`;

const TagPill = styled.span`
  display: inline-block;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  font-size: 0.75rem;
  margin-right: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  padding-top: calc(20px + env(safe-area-inset-top)); /* Safe area top padding */
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  
  @media (max-width: 768px) {
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

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
`;

const Video = memo(() => {
  const [activeCategory, setActiveCategory] = useState("short");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isGlobalMuted, setIsGlobalMuted] = useState(true); // Global mute state
  const navigate = useNavigate();

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setActiveIndex(0);
    // When changing category, scroll back to the hero section (top)
    document.querySelector('.sc-fszimp')?.scrollTo({ top: 0, behavior: 'smooth' }); // Use class based generic selector if ref not available, or just window
    // Actually, since we are inside a custom scroll container, we need to scroll THAT container.
    // Ideally we should use a Ref for CinemaContainer.
  };

  const currentVideos = useMemo(() => videoProjects[activeCategory], [activeCategory]);

  return (
    <CinemaContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <GrainOverlay />
      <Vignette />

      <FixedTopBar
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <NavLeft>
          <GlassButton
            onClick={() => navigate('/dark')}
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          >
            ← Back
          </GlassButton>
        </NavLeft>

        <NavCenter>
          <CategorySwitcher>
            <SwitcherButton
              active={activeCategory === 'short'}
              onClick={() => handleCategoryChange('short')}
            >
              Shorts
            </SwitcherButton>
            <SwitcherButton
              active={activeCategory === 'long'}
              onClick={() => handleCategoryChange('long')}
            >
              Cinematic
            </SwitcherButton>
          </CategorySwitcher>
        </NavCenter>

        <div style={{ flex: 1 }}>{/* Spacer for right side balance */}</div>
      </FixedTopBar>

      <Container>
        <CinemaHeader style={{ marginTop: '0px' }}>
          <CinemaTitle
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Showcase<span>Portfolio</span>
          </CinemaTitle>
          <CinemaSubtitle>
            A curated collection of visual storytelling.
          </CinemaSubtitle>

          <ScrollPrompt
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <p>Scroll to explore</p>
            <div className="arrow">↓</div>
          </ScrollPrompt>
        </CinemaHeader>

        <VideoStreamContainer>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: '100%' }}
            >
              {currentVideos.map((video, index) => (
                <CinematicVideoItem
                  key={`${activeCategory}-${index}`}
                  video={video}
                  index={index}
                  format={activeCategory}
                  isActive={activeIndex === index}
                  isMuted={isGlobalMuted}
                  toggleMute={() => setIsGlobalMuted(prev => !prev)}
                  onInView={setActiveIndex}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </VideoStreamContainer>
      </Container>
    </CinemaContainer>
  );
});

export default Video;