import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

// Import project-specific background images from local assets
import finportImg from "./assets/Finport.png";
import vinwearImg from "./assets/1000styles.png";
import squareImg from "./assets/Square.png";
import gjmicImg from "./assets/GJMIC.png";
import GlassButton from "../Shared/GlassButton";

// ============== KEYFRAME EFFECTS =================

const floatingAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(1deg); }
  50% { transform: translateY(-10px) rotate(-1deg); }
  75% { transform: translateY(-25px) rotate(0.5deg); }
`;

const glowPulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3),
                0 0 40px rgba(0, 255, 255, 0.1),
                0 0 60px rgba(0, 255, 255, 0.05);
  }
  50% { 
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.6),
                0 0 60px rgba(0, 255, 255, 0.3),
                0 0 90px rgba(0, 255, 255, 0.1);
  }
`;

const textShimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// =================================================
//                 STYLED COMPONENTS
// =================================================

const Portfolio = styled(motion.div)`
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
      radial-gradient(circle at 50% 50%, rgba(76, 29, 149, 0.15), transparent 50%),
      radial-gradient(circle at 10% 10%, rgba(56, 189, 248, 0.15), transparent 50%),
      radial-gradient(circle at 90% 90%, rgba(236, 72, 153, 0.15), transparent 50%);
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

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 80px;
  
  @media (max-width: 768px) {
    margin-bottom: 60px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 40px;
  }
`;

const MainTitle = styled(motion.h1)`
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

const Subtitle = styled(motion.p)`
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

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 60px;
  margin-bottom: 100px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
    margin-bottom: 80px;
  }
  
  @media (max-width: 480px) {
    gap: 30px;
    margin-bottom: 60px;
  }
`;

const ProjectShowcase = styled(motion.div)`
  position: relative;
  height: 600px;
  /* Removed perspective to prevent 3D blur */
  cursor: pointer;
  border-radius: 30px;
  overflow: hidden;
  will-change: transform;
  
  /* Prism Glass Card */
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  transition: all 0.4s ease;
  
  &:hover {
    border-color: rgba(${props => props.glowColor || '0, 255, 255'}, 0.6);
    box-shadow: 
      0 20px 40px rgba(0,0,0,0.4),
      0 0 30px rgba(${props => props.glowColor || '0, 255, 255'}, 0.4),
      0 0 60px rgba(${props => props.glowColor || '0, 255, 255'}, 0.2);
    transform: translateY(-10px); /* Clean 2D lift */
  }
  
  @media (max-width: 768px) {
    height: 450px;
    display: flex;
    flex-direction: column;
    cursor: default;
  }
  
  @media (max-width: 480px) {
    height: 400px;
  }
`;

const ProjectImage = styled(motion.div)`
  width: 100%;
  height: 100%;
  /* Border radius handled by parent overflow: hidden */
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  transition: transform 0.5s ease; /* Smooth zoom transition */
  
  /* Zoom effect on hover */
  ${ProjectShowcase}:hover & {
    transform: scale(1.05);
  }
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.6) 100%
    );
    transition: all 0.4s ease;
  }
  
  ${ProjectShowcase}:hover &::before {
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.8) 100%
    );
  }
  
  @media (max-width: 768px) {
    height: 100%;
    flex-shrink: 0;
  }
  
  @media (max-width: 480px) {
    height: 100%;
  }
`;

const ProjectInfo = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  z-index: 10;
  
  /* Prism Glass Card inside image */
  background: rgba(10, 10, 10, 0.7); /* Slightly darker for better text contrast */
  backdrop-filter: blur(15px); /* Reduced blur */
  -webkit-backdrop-filter: blur(15px);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 -10px 30px rgba(0,0,0,0.3);
  transform: translateZ(0); /* Hardware acceleration for text sharpness */
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  
  @media (max-width: 768px) {
    padding: 30px;
    position: relative;
    background: rgba(20, 20, 20, 0.8);
    transform: none !important;
    opacity: 1 !important;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const ProjectTitle = styled(motion.h3)`
  font-size: 2rem;
  color: #fff;
  margin-bottom: 10px;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const ProjectDesc = styled(motion.p)`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
  line-height: 1.6;
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const TechStack = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
  
  @media (max-width: 480px) {
    gap: 6px;
    margin-bottom: 15px;
  }
`;

const TechTag = styled(motion.span)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  
  @media (max-width: 480px) {
    padding: 4px 10px;
    font-size: 0.7rem;
  }
`;



const FloatingElement = styled(motion.div)`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: 50%;
  filter: blur(1px);
  opacity: 0.6;
  animation: ${floatingAnimation} ${props => props.duration}s ease-in-out infinite;
  z-index: 1;
  
  @media (max-width: 768px) {
    width: ${props => props.size * 0.7}px;
    height: ${props => props.size * 0.7}px;
    opacity: 0.4;
  }
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const SkillsShowcase = styled(motion.div)`
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

const SkillsTitle = styled(motion.h2)`
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

const SkillsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 25px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const SkillCategory = styled(motion.div)`
  text-align: left;
`;

const SkillLabel = styled.h4`
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 15px;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const SkillList = styled.p`
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

const projects = [
  {
    name: "Finport",
    description: "Revolutionary finance trading platform with real-time analytics, portfolio management, and advanced charting capabilities.",
    tech: ["React", "Node.js", "PostgreSQL", "Prisma", "JWT", "WebSocket"],
    role: "Full Stack Developer",
    link: "https://finportk.netlify.app/",
    image: finportImg
  },
  {
    name: "Vinwear",
    description: "Modern e-commerce platform for fashion enthusiasts with AI-powered recommendations and seamless shopping experience.",
    tech: ["Svelte", "Express", "MongoDB", "Stripe", "CloudinaryAPI"],
    role: "Full Stack Developer",
    link: "https://1000styles.netlify.app/",
    image: vinwearImg
  },
  {
    name: "Squarexx",
    description: "Next-generation social media platform focused on authentic connections and content discovery with advanced algorithms.",
    tech: ["React", "Zustand", "Redux", "Socket.io", "Firebase"],
    role: "Frontend Developer",
    link: "https://squarexx.netlify.app/",
    image: squareImg
  },
  {
    name: "GJMIC",
    description: "Official institutional website for GJMIC BIT Sindri featuring dynamic content management and student portal integration.",
    tech: ["React", "Node.js", "Express", "MongoDB", "AWS"],
    role: "Frontend Developer",
    link: "https://gjmic.bitsindri.ac.in/",
    image: gjmicImg
  }
];

const skills = {
  frontend: "React, Svelte, Vue, TypeScript, Next.js, Tailwind CSS, styled-components, GSAP, Framer Motion, Three.js",
  backend: "Node.js, Express, Python, FastAPI, GraphQL, REST APIs, Microservices, Docker",
  database: "PostgreSQL, MongoDB, Redis, Prisma ORM, Mongoose, Firebase",
  tools: "Git, AWS, Netlify, Vercel, Docker, Kubernetes, CI/CD, Jest, Cypress"
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

const projectVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// =================================================
//                   COMPONENT
// =================================================

export default function Web() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [glowColor, setGlowColor] = useState("0, 255, 255"); // Default Cyan
  const navigate = useNavigate();

  return (
    <Portfolio
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div style={{ position: 'fixed', top: '30px', left: '30px', zIndex: 1000 }}>
        <GlassButton onClick={() => navigate('/dark')}>
          ← Back
        </GlassButton>
      </div>
      {/* Floating Background Elements */}
      <FloatingElement
        size={100}
        color="rgba(0, 255, 255, 0.1)"
        duration={6}
        style={{ top: '10%', left: '10%' }}
      />
      <FloatingElement
        size={150}
        color="rgba(255, 0, 255, 0.1)"
        duration={8}
        style={{ top: '60%', right: '10%' }}
      />
      <FloatingElement
        size={80}
        color="rgba(255, 255, 0, 0.1)"
        duration={7}
        style={{ bottom: '20%', left: '20%' }}
      />

      <Container>
        <Header variants={itemVariants}>
          <MainTitle
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            DIGITAL ARCHITECT
          </MainTitle>
          <Subtitle
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Crafting exceptional digital experiences through code
          </Subtitle>
        </Header>

        <ProjectsGrid variants={containerVariants}>
          {projects.map((project, index) => (
            <ProjectShowcase
              key={index}
              variants={projectVariants}
              whileHover="hover"
              onHoverStart={() => {
                setSelectedProject(index);
                const randomColor = neonColors[Math.floor(Math.random() * neonColors.length)];
                setGlowColor(randomColor);
              }}
              onHoverEnd={() => setSelectedProject(null)}
              glowColor={glowColor}
            >
              <ProjectImage bgImage={project.image}>
                <ProjectInfo
                  initial={{ y: 100, opacity: 0 }}
                  animate={{
                    y: selectedProject === index ? 0 : 50,
                    opacity: selectedProject === index ? 1 : 0.8
                  }}
                  transition={{ duration: 0.4 }}
                  style={{
                    '@media (max-width: 768px)': {
                      y: 0,
                      opacity: 1
                    }
                  }}
                >
                  <ProjectTitle>{project.name}</ProjectTitle>
                  <ProjectDesc>{project.description}</ProjectDesc>
                  <TechStack>
                    {project.tech.map((tech, i) => (
                      <TechTag
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {tech}
                      </TechTag>
                    ))}
                  </TechStack>
                  <GlassButton
                    as="a"
                    href={project.link}
                    target="_blank"
                    style={{ display: 'inline-flex', textDecoration: 'none' }}
                  >
                    Explore Project →
                  </GlassButton>
                </ProjectInfo>
              </ProjectImage>
            </ProjectShowcase>
          ))}
        </ProjectsGrid>

        <SkillsShowcase
          variants={itemVariants}
          whileInView={{ scale: [0.95, 1.02, 1] }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <SkillsTitle>EXPERTISE</SkillsTitle>
          <SkillsGrid>
            <SkillCategory>
              <SkillLabel>Frontend Mastery</SkillLabel>
              <SkillList>{skills.frontend}</SkillList>
            </SkillCategory>
            <SkillCategory>
              <SkillLabel>Backend Excellence</SkillLabel>
              <SkillList>{skills.backend}</SkillList>
            </SkillCategory>
            <SkillCategory>
              <SkillLabel>Database Solutions</SkillLabel>
              <SkillList>{skills.database}</SkillList>
            </SkillCategory>
            <SkillCategory>
              <SkillLabel>Development Tools</SkillLabel>
              <SkillList>{skills.tools}</SkillList>
            </SkillCategory>
          </SkillsGrid>
        </SkillsShowcase>
      </Container>
    </Portfolio>
  );
}
