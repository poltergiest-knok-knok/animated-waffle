import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import GlassButton from '../Shared/GlassButton';
import Banner3D from './Banner3D';

// --- Keyframes ---

const scrollLeft = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const scrollRight = keyframes`
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; filter: blur(10px); transform: translateY(20px); }
  to { opacity: 1; filter: blur(0); transform: translateY(0); }
`;

// --- Styled Components ---

const PageContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #050505;
  color: #fff;
  overflow-x: hidden;
  position: relative;
  font-family: 'Inter', sans-serif;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  background: #050505;
  padding-top: 50px; 
  padding-bottom: 100px;
  perspective: 1500px;
`;

const BackgroundGradient = styled.div`
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000 70%);
  z-index: 0;
`;

const HeaderOverlay = styled.div`
  position: relative;
  width: 100%;
  padding: 60px 50px 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 10;
  background: linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%);
  margin-bottom: 20px;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 30px;
    padding: 40px 20px;
  }
`;

const TitleBlock = styled.div`
  animation: ${fadeIn} 1s ease-out;
  max-width: 700px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 20px;
  letter-spacing: -2px;
  line-height: 1;
  text-shadow: 0 0 30px rgba(255,255,255,0.1);
  
  span {
    background: linear-gradient(135deg, #fff 30%, #666);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 600px) {
    font-size: 2.5rem;
  }
`;

const Description = styled.p`
  color: rgba(255,255,255,0.7);
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
  font-weight: 300;
  border-left: 3px solid rgba(255,255,255,0.2);
  padding-left: 20px;
`;

// --- Category Section ---

const CategorySection = styled.div`
  margin-bottom: 80px;
  position: relative;
  z-index: 5;
  transform-style: preserve-3d;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease-out forwards;
  animation-delay: ${props => props.delay}s;
`;

const CategoryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-left: 5%;
  margin-bottom: 25px;
  text-transform: uppercase;
  letter-spacing: 3px;
  display: flex;
  align-items: center;
  gap: 15px;

  &::before {
    content: '';
    display: block;
    width: 30px;
    height: 1px;
    background: #fff;
    box-shadow: 0 0 10px #fff;
  }
`;

// --- 3D Scroll Track ---

const ScrollTrackContainer = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  transform: rotateX(2deg) rotateY(-1deg);
  transform-style: preserve-3d;
  
  &:hover {
    z-index: 10;
    .track {
      animation-play-state: paused;
    }
  }
`;

const ScrollTrack = styled.div`
  display: flex;
  gap: 30px;
  width: max-content;
  padding: 20px 0;
  animation: ${props => props.direction === 'left' ? scrollLeft : scrollRight} ${props => props.speed || 40}s linear infinite;
`;

const Card3D = styled.div`
  width: 300px;
  height: 169px; /* 16:9 Aspect Ratio */
  position: relative;
  border-radius: 12px;
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  cursor: pointer;
  flex-shrink: 0;

  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);

  &:hover {
    transform: translateY(-10px) scale(1.15) rotateX(0deg) !important;
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 20px 50px rgba(0,0,0,0.8);
    z-index: 20;
    
    img {
      transform: scale(1.05);
    }
  }
  
  transform: translateZ(0);
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 12px;
  position: relative;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
  filter: brightness(0.8) contrast(1.1);

  ${Card3D}:hover & {
    filter: brightness(1) contrast(1);
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 15px;

  ${Card3D}:hover & {
    opacity: 1;
  }
`;

const CardTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
  color: #ddd;
  transform: translateY(10px);
  transition: transform 0.3s ease;
  
  ${Card3D}:hover & {
    transform: translateY(0);
  }
`;

const Vignette = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle, transparent 50%, black 120%);
  z-index: 2;
`;

// Helper component for Infinite Loop
const InfiniteRow = ({ images, direction, speed, category }) => {
  if (!images || images.length === 0) return null;

  // Ensure enough content to loop smoothly; repeat more if few images
  const multiplier = images.length < 5 ? 4 : 2;
  const content = Array(multiplier).fill(images).flat();

  return (
    <ScrollTrackContainer className="track-container">
      <ScrollTrack className="track" direction={direction} speed={speed}>
        {content.map((imgName, i) => (
          <Card3D key={`${imgName}-${i}`}>
            <ImageContainer>
              <StyledImage
                src={`/thumbnails/${imgName}`}
                alt={`${category} Design ${i}`}
                loading="lazy"
              />
              <Overlay>
                <CardTitle>{category} Design</CardTitle>
              </Overlay>
            </ImageContainer>
          </Card3D>
        ))}
      </ScrollTrack>
    </ScrollTrackContainer>
  );
};

export default function Thumbnail() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState({});

  useEffect(() => {
    // Manually mapping the files found in the directory scan to categories
    const allFiles = [
      "cinematic (2).jpg", "cinematic (3).jpg", "cinematic (4).jpg", "cinematic (5).jpg",
      "cinematic (6).jpg", "cinematic (7).jpg", "cinematic (8).jpg", "cinematic.jpg",
      "infotainment (2).jpg", "infotainment (3).jpg", "infotainment (4).jpg", "infotainment (5).jpg",
      "infotainment.jpg",
      "money (2).jpg", "money (3).jpg", "money (4).jpg", "money (5).jpg", "money (6).jpg",
      "money (7).jpg", "money.jpg",
      "motivation (2).jpg", "motivation (3).jpg", "motivation (4).jpg", "motivation.jpg",
      "roblox (2).jpg", "roblox.jpg",
      "sports (2).jpg", "sports (3).jpg", "sports (4).jpg", "sports.jpg",
      "tech (2).jpg", "tech (3).jpg", "tech (4).jpg", "tech (5).jpg", "tech (6).jpg",
      "tech (7).jpg", "tech (8).jpg", "tech (9).jpg", "tech.jpg"
    ];

    const sorted = {
      Cinematic: allFiles.filter(f => f.includes('cinematic')),
      Tech: allFiles.filter(f => f.includes('tech')),
      Sports: allFiles.filter(f => f.includes('sports')),
      Roblox: allFiles.filter(f => f.includes('roblox')),
      Infotainment: allFiles.filter(f => f.includes('infotainment')),
      Finance: allFiles.filter(f => f.includes('money')),
      Motivation: allFiles.filter(f => f.includes('motivation'))
    };

    setCategories(sorted);
  }, []);

  return (
    <PageContainer>
      <Banner3D />

      <ContentWrapper>
        <BackgroundGradient />
        <Vignette />

        <HeaderOverlay>
          <TitleBlock>
            <Title><span>GRAPHIC DESIGN</span> PORTFOLIO</Title>
            <Description>
              High-impact visuals for the digital age. Specializing in cinematic compositions,
              brand identity, sports graphics, and immersive gaming aesthetics.
              Every pixel crafted with precision and passion.
            </Description>
          </TitleBlock>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <GlassButton onClick={() => window.open('mailto:contact@example.com')}>Let's Work Together</GlassButton>
            <GlassButton onClick={() => navigate('/dark')}>Back to Hub</GlassButton>
          </div>
        </HeaderOverlay>

        {/* Render Available Categories */}

        {/* Cinematic */}
        {categories.Cinematic?.length > 0 && (
          <CategorySection delay={0.1}>
            <CategoryTitle>Cinematic & Visuals</CategoryTitle>
            <InfiniteRow images={categories.Cinematic} direction="left" speed={45} category="Cinematic" />
          </CategorySection>
        )}

        {/* Tech */}
        {categories.Tech?.length > 0 && (
          <CategorySection delay={0.2}>
            <CategoryTitle>Technology & Future</CategoryTitle>
            <InfiniteRow images={categories.Tech} direction="right" speed={50} category="Tech" />
          </CategorySection>
        )}

        {/* Sports */}
        {categories.Sports?.length > 0 && (
          <CategorySection delay={0.3}>
            <CategoryTitle>Sports Design</CategoryTitle>
            <InfiniteRow images={categories.Sports} direction="left" speed={40} category="Sports" />
          </CategorySection>
        )}

        {/* Roblox */}
        {categories.Roblox?.length > 0 && (
          <CategorySection delay={0.35}>
            <CategoryTitle>Roblox Gaming</CategoryTitle>
            <InfiniteRow images={categories.Roblox} direction="right" speed={35} category="Roblox" />
          </CategorySection>
        )}


        {/* Infotainment */}
        {categories.Infotainment?.length > 0 && (
          <CategorySection delay={0.4}>
            <CategoryTitle>Infotainment</CategoryTitle>
            <InfiniteRow images={categories.Infotainment} direction="right" speed={42} category="Infotainment" />
          </CategorySection>
        )}

        {/* Finance */}
        {categories.Finance?.length > 0 && (
          <CategorySection delay={0.5}>
            <CategoryTitle>Finance & Business</CategoryTitle>
            <InfiniteRow images={categories.Finance} direction="left" speed={48} category="Finance" />
          </CategorySection>
        )}

        {/* Motivation */}
        {categories.Motivation?.length > 0 && (
          <CategorySection delay={0.6}>
            <CategoryTitle>Motivation & Quotes</CategoryTitle>
            <InfiniteRow images={categories.Motivation} direction="right" speed={38} category="Motivation" />
          </CategorySection>
        )}
      </ContentWrapper>

    </PageContainer>
  );
}
