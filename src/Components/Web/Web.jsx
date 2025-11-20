import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

// Import project-specific background images from local assets
import finportImg from "./assets/Finport.png";
import vinwearImg from "./assets/1000styles.png";
import squareImg from "./assets/Square.png";
import gjmicImg from "./assets/GJMIC.png";

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
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
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
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
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
  font-size: clamp(1.8rem, 5vw, 4rem);
  margin-bottom: 20px;
  background: linear-gradient(45deg, #00ffff, #ff00ff, #ffff00, #00ff00);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${textShimmer} 3s linear infinite;
  filter: drop-shadow(0 0 30px rgba(0, 255, 255, 0.5));
  
  @media (max-width: 480px) {
    font-size: clamp(1.4rem, 6vw, 2rem);
    margin-bottom: 15px;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1rem;
  color: #00eaff;
  opacity: 0.8;
  text-shadow: 0 0 10px rgba(0, 234, 255, 0.5);
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 0 10px;
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
  height: 500px;
  perspective: 1000px;
  cursor: pointer;
  
  @media (max-width: 768px) {
    height: 400px;
  }
  
  @media (max-width: 480px) {
    height: 350px;
  }
`;

const ProjectImage = styled(motion.div)`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  border: 3px solid rgba(0, 255, 255, 0.3);
  animation: ${glowPulse} 4s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0.8) 100%
    );
    transition: all 0.4s ease;
  }
  
  &:hover::before {
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.4) 100%
    );
  }
`;

const ProjectInfo = styled(motion.div)`
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

const ProjectTitle = styled(motion.h3)`
  font-size: 1.5rem;
  color: #00ff00;
  margin-bottom: 15px;
  text-shadow: 0 0 15px rgba(0, 255, 0, 0.7);
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 10px;
  }
`;

const ProjectDesc = styled(motion.p)`
  font-size: 0.8rem;
  color: #00eaff;
  margin-bottom: 15px;
  line-height: 1.6;
  text-shadow: 0 0 10px rgba(0, 234, 255, 0.3);
  
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
  background: linear-gradient(45deg, rgba(255, 0, 255, 0.2), rgba(0, 255, 255, 0.2));
  border: 1px solid rgba(255, 0, 255, 0.5);
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.6rem;
  color: #ff00ff;
  text-shadow: 0 0 8px rgba(255, 0, 255, 0.5);
  
  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 0.55rem;
  }
`;

const ProjectLink = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 25px;
  background: linear-gradient(45deg, #ff00ff, #00ffff);
  color: #000;
  text-decoration: none;
  border-radius: 25px;
  font-size: 0.7rem;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(255, 0, 255, 0.6);
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
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(255, 0, 255, 0.1) 100%);
  border: 2px solid rgba(0, 255, 255, 0.3);
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
    background: linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.1), transparent);
    animation: ${textShimmer} 8s linear infinite;
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

const SkillsTitle = styled(motion.h2)`
  font-size: 2rem;
  color: #ffff00;
  margin-bottom: 30px;
  text-shadow: 0 0 20px rgba(255, 255, 0, 0.7);
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin-bottom: 25px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
    margin-bottom: 20px;
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
  color: #00ff00;
  font-size: 1rem;
  margin-bottom: 15px;
  text-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 10px;
  }
`;

const SkillList = styled.p`
  color: #00eaff;
  font-size: 0.7rem;
  line-height: 1.8;
  text-shadow: 0 0 10px rgba(0, 234, 255, 0.3);
  
  @media (max-width: 768px) {
    font-size: 0.65rem;
    line-height: 1.6;
  }
  
  @media (max-width: 480px) {
    font-size: 0.6rem;
    line-height: 1.5;
  }
`;

const BackButton = styled(motion.button)`
  position: fixed;
  top: 30px;
  left: 30px;
  background: linear-gradient(45deg, #ff00ff, #00ffff);
  color: #000;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.6rem;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(255, 0, 255, 0.6);
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

export default function Web() {
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  return (
    <Portfolio
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
              onHoverStart={() => setSelectedProject(index)}
              onHoverEnd={() => setSelectedProject(null)}
            >
              <ProjectImage 
                bgImage={project.image}
                animate={{
                  scale: selectedProject === index ? 1.02 : 1,
                  filter: selectedProject === index ? "brightness(1.1)" : "brightness(1)"
                }}
                transition={{ duration: 0.3 }}
              >
                <ProjectInfo
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ 
                    y: selectedProject === index ? 0 : 50, 
                    opacity: selectedProject === index ? 1 : 0.8 
                  }}
                  transition={{ duration: 0.4 }}
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
                  <ProjectLink 
                    href={project.link} 
                    target="_blank"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore Project →
                  </ProjectLink>
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
