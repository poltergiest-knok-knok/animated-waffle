// src/components/Dark.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Canvas } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, TorusKnot, Icosahedron, Tetrahedron, Float, Stars, MeshWobbleMaterial } from "@react-three/drei";



import GlassButton from "./Shared/GlassButton";

/* ========================================================= */
/*                  🔥 KEYFRAME ANIMATIONS 🔥                */
/* ========================================================= */
/* ========================================================= */
/*                  🔥 KEYFRAME ANIMATIONS 🔥                */
/* ========================================================= */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const textShimmer = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;



/* ========================================================= */
/*                🔥 STYLED COMPONENTS SETUP 🔥              */
/* ========================================================= */

const DarkContainer = styled.div`
  margin: 0;
  padding: 20px;
  min-height: 100vh;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 70px;
  justify-content: center;
  animation: ${fadeIn} 1s ease-out;
  position: relative;
  z-index: 1;
  overflow: hidden;

  /* Dark Overlay for Video */
  &::before {
    content: "";
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6); /* Darken the video */
    z-index: -1;
  }

  @media (max-width: 768px) {
    gap: 40px;
    padding: 20px 15px;
  }
`;

/* ========================================================= */
/*                   3D BACKGROUND COMPONENTS                */
/* ========================================================= */

const CanvasContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: -1;
  background: black;
`;

const LiquidBackground = () => {
  return (
    <CanvasContainer>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={["#000000"]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Colorful Lights for Iridescence */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#00ffff" />
        <pointLight position={[-10, -10, -5]} intensity={5} color="#ff00ff" />
        <pointLight position={[0, 5, 0]} intensity={2} color="#ffffff" />

        {/* Main Abstract Shape - Twisted Liquid Knot */}
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
          <TorusKnot args={[1, 0.3, 128, 16]} position={[0, 0, 0]}>
            <MeshDistortMaterial
              color="#000"
              envMapIntensity={1}
              clearcoat={1}
              clearcoatRoughness={0}
              metalness={0.9}
              roughness={0.1}
              distort={0.4}
              speed={2}
            />
          </TorusKnot>
        </Float>

        {/* Secondary Abstract Shape - Flowing Liquid */}
        <Float speed={2.5} rotationIntensity={2} floatIntensity={3}>
          <TorusKnot args={[0.6, 0.2, 100, 16]} position={[-3, 2, -2]}>
            <MeshDistortMaterial
              color="#111"
              envMapIntensity={1}
              clearcoat={1}
              clearcoatRoughness={0}
              metalness={0.95}
              roughness={0.1}
              distort={0.5}
              speed={3}
            />
          </TorusKnot>
        </Float>

        {/* Tertiary Abstract Shape - Distorted Glass */}
        <Float speed={3} rotationIntensity={1.5} floatIntensity={2.5}>
          <TorusKnot args={[0.5, 0.15, 100, 16]} position={[3, -2, -1]}>
            <MeshDistortMaterial
              color="#050505"
              envMapIntensity={1}
              clearcoat={1}
              clearcoatRoughness={0}
              metalness={1}
              roughness={0}
              distort={0.6}
              speed={2.5}
            />
          </TorusKnot>
        </Float>









      </Canvas>
    </CanvasContainer>
  );
};

const Navbar = styled.nav`
  width: 100%;
  max-width: 1200px;
  padding: 15px 30px;
  
  /* Prism Glass Navbar */
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0;
  transition: all 0.3s ease;
  position: relative;
  margin-top: 20px;

  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.05);
  }

  &.open .nav-links {
    opacity: 1;
    transform: translateY(0);
    height: auto;
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 15px 20px;
    flex-direction: column;
    gap: 0;
    border-radius: 20px;
  }
`;

const MenuToggle = styled.button`
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;

  .dot {
    width: 6px;
    height: 6px;
    margin: 3px 0;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const NavLinks = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  gap: 25px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    position: static;
    width: 100%;
    padding: 0;
    background: none;
    border: none;
    box-shadow: none;
    opacity: 1;
    transform: none;
    height: auto;
    overflow: visible;
    z-index: 10;
    gap: 18px;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: 0.3s;
  padding: 8px 16px;
  border-radius: 12px;

  &.main-link {
    color: #fff;
    font-weight: 600;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  }

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
  }
`;

const NavIcon = styled.svg`
  width: 20px;
  height: 20px;
  fill: currentColor;
  filter: drop-shadow(0 0 3px currentColor);
`;

const OpalIcon = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid currentColor;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    background: currentColor;
    border-radius: 50%;
  }
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
  padding: 50px;
  position: relative;
  overflow: hidden;
  
  /* Base Glass Style */
  background: rgba(255, 255, 255, 0.01);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 40px;
  
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.4),
    inset 0 0 30px rgba(255, 255, 255, 0.05);
    
  transition: all 0.4s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  h1 {
    font-size: 3.5rem;
    font-weight: 800;
    
    /* Holographic Text Effect */
    background: linear-gradient(
      90deg,
      #ffffff 0%,
      #00ffff 20%,
      #ff00ff 40%,
      #00ffff 60%,
      #ffffff 80%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    
    animation: ${textShimmer} 4s linear infinite;
    
    margin-bottom: 20px;
    letter-spacing: -1px;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
  }

  .subtitle {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 40px;
    font-weight: 400;
    line-height: 1.6;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 768px) {
    padding: 30px 20px;
    h1 {
      font-size: 2.2rem;
    }
    .subtitle {
      font-size: 1rem;
    }
  }
`;

const LiquidLayer = styled.div`
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  filter: url(#liquid-filter);
  opacity: 0.6;
  z-index: 0;
  pointer-events: none;
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 30px;
  justify-content: center;
  margin: 20px 0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
`;



const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    align-items: center;
  }
`;

/* ========================================================= */
/*                         COMPONENT                         */
/* ========================================================= */

export default function Dark() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );
  const navigate = useNavigate();

  const navRef = useRef(null);

  /* ------------ Liquid Animation Ref ------------ */
  const turbulenceRef = useRef(null);

  /* ------------ Mobile Breakpoint Listener ------------ */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ------------ Close menu on outside click ------------ */
  useEffect(() => {
    if (!menuOpen) return;
    function close(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    function onEsc(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("click", close);
    document.addEventListener("keydown", onEsc);

    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);

  /* ------------ Mobile menu animation ------------ */
  useEffect(() => {
    const el = navRef.current?.querySelector(".nav-links");
    if (!el || !isMobile) return;

    if (el._anim) {
      el._anim.cancel();
      el._anim = null;
    }

    if (menuOpen) {
      el.style.display = "flex";
      el.style.height = "auto";
      const fullHeight = el.scrollHeight;
      el.style.height = "0px";

      const anim = el.animate(
        [
          { height: "0px", opacity: 0, transform: "translateY(-8px)" },
          { height: fullHeight + "px", opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 280,
          easing: "cubic-bezier(.2,.9,.2,1)",
          fill: "forwards",
        }
      );

      el._anim = anim;

      anim.onfinish = () => {
        el.style.height = "auto";
        el._anim = null;
      };
    } else {
      const startHeight = el.getBoundingClientRect().height;

      const anim = el.animate(
        [
          { height: startHeight + "px", opacity: 1 },
          { height: "0px", opacity: 0, transform: "translateY(-8px)" },
        ],
        {
          duration: 220,
          easing: "cubic-bezier(.2,.9,.2,1)",
          fill: "forwards",
        }
      );

      el._anim = anim;

      anim.onfinish = () => {
        el.style.display = "none";
        el.style.height = "";
        el._anim = null;
      };
    }
  }, [menuOpen, isMobile]);

  /* ------------ Liquid Animation Loop ------------ */
  useEffect(() => {
    let frame;
    let time = 0;

    const animateLiquid = () => {
      if (turbulenceRef.current) {
        time += 0.002;
        const val = 0.01 + Math.sin(time) * 0.005;
        turbulenceRef.current.setAttribute("baseFrequency", `${val} ${val + 0.01}`);
      }
      frame = requestAnimationFrame(animateLiquid);
    };

    animateLiquid();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <DarkContainer>
      <LiquidBackground />

      {/* ------------ LIQUID SVG FILTER ------------ */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="liquid-filter">
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.01 0.02"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* ------------ NAVBAR ------------ */}
      <Navbar ref={navRef} className={menuOpen ? "open" : ""}>
        {isMobile ? (
          <>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <NavLink to="/" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>
                VynceVisuals
              </NavLink>
              <MenuToggle onClick={() => setMenuOpen(!menuOpen)}>
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </MenuToggle>
            </div>

            <NavLinks className="nav-links">
              <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
              <NavLink to="/web" onClick={() => setMenuOpen(false)}>Webdev Portfolio</NavLink>
              <NavLink to="/vyncevisuals" onClick={() => setMenuOpen(false)}>Video Portfolio</NavLink>
              <NavLink to="/thumbnail" onClick={() => setMenuOpen(false)}>Thumbnails</NavLink>
              <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
            </NavLinks>
          </>
        ) : (
          <>
            <NavLinks className="nav-links">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/web">Webdev Portfolio</NavLink>
              <NavLink to="/vyncevisuals">Video Portfolio</NavLink>
              <NavLink to="/thumbnail">Thumbnails</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </NavLinks>
          </>
        )}
      </Navbar>

      {/* ------------ HERO ------------ */}
      <HeroContent>
        <LiquidLayer />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1>The best platform to get your designed sites</h1>

          <div className="subtitle">
            The most powerful person is here to help you !
          </div>

          {/* ------------ NAVIGATION BUTTONS ------------ */}
          <NavigationButtons>
            <GlassButton onClick={() => navigate("/web")}>
              Web Portfolio
            </GlassButton>
            <GlassButton onClick={() => navigate("/vyncevisuals")}>
              Video Portfolio
            </GlassButton>
            <GlassButton onClick={() => navigate("/thumbnail")}>
              Thumbnail Gallery
            </GlassButton>
          </NavigationButtons>

          <ActionButtons>
            <GlassButton onClick={() => navigate("/")}>Get started now</GlassButton>
            <GlassButton>Book a demo</GlassButton>
          </ActionButtons>
        </div>
      </HeroContent>
    </DarkContainer>
  );
}

