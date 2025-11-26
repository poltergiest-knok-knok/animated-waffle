// src/components/Dark.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Temp from "./Temp.jsx";

import video from "../assets/pixelbg.mp4";
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

const BackgroundVideo = styled.video`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

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
  
  /* Prism Glass Hero - Transparent & Clean */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.02) 0%,
    rgba(255, 255, 255, 0.005) 100%
  );
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 40px;
  
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.4),
    inset 0 0 30px rgba(255, 255, 255, 0.01);
    
  transition: all 0.4s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.1);
    border-top-color: rgba(255, 255, 255, 0.25);
    box-shadow: 
      0 25px 60px rgba(0, 0, 0, 0.5),
      0 0 30px rgba(255, 255, 255, 0.02);
    transform: translateY(-2px);
  }

  h1 {
    font-size: 3.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 20px;
    letter-spacing: -1px;
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.2));
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
  const tempRef = useRef(null);
  const [tempVisible, setTempVisible] = useState(false);

  /* ------------ Mobile Breakpoint Listener ------------ */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ------------ Temp Intersection Observer ------------ */
  useEffect(() => {
    const el = tempRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setTempVisible(entry.isIntersecting && entry.intersectionRatio > 0.2);
      },
      { threshold: [0, 0.2, 0.5] }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ------------ Animate letters trigger ------------ */
  useEffect(() => {
    if (!tempVisible) return;
    const el = tempRef.current;

    el.classList.add("animate-letters");

    const t = setTimeout(() => el.classList.remove("animate-letters"), 2000);
    return () => clearTimeout(t);
  }, [tempVisible]);

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

  return (
    <DarkContainer>
      <BackgroundVideo src={video} autoPlay loop muted playsInline />

      {/* ------------ NAVBAR ------------ */}
      <Navbar ref={navRef} className={menuOpen ? "open" : ""}>
        {/* Left: Webdev Portfolio */}
        <NavLink to="/web" className="main-link">Webdev Portfolio</NavLink>

        {/* Center: Other Links (hidden on mobile) */}
        {!isMobile && (
          <NavLinks className="nav-links">
            <NavLink href="#">
              <NavIcon viewBox="0 0 24 24">
                <path d="M12 1.5l2.35 7.24h7.65l-6.18 4.48 2.36 7.24-6.18-4.48-6.18 4.48 2.36-7.24-6.18-4.48h7.65z" />
              </NavIcon>
              Asterisk
            </NavLink>
            <NavLink href="#">Eooks</NavLink>
            <NavLink href="#">
              <OpalIcon />
              Opal
            </NavLink>
            <NavLink href="#">
              <NavIcon viewBox="0 0 24 24">
                <path d="M21.9,8.3C21.7,7.8,21.4,7.4,21,7
                    c-2.4-2.4-6.4-2.4-8.8,0c-1,1-1.6,2.4-1.6,3.8c0,0.5,0.1,1,0.2,1.5 
                    c-0.5,0-1,0.1-1.5,0.2c-2.4,0.4-4.2,2.5-4.2,5c0,2.8,2.2,5,5,5 
                    c0.2,0,0.5,0,0.7-0.1c0.5,0.6,1.2,1,2,1.2c2.8,0.7,5.6-0.3,7.2-2.5 
                    C22.3,15.8,22.1,12.3,19.9,9.9C19.7,9.5,19.4,9,19.4,9z" />
              </NavIcon>
              Dune
            </NavLink>
            <NavLink href="#">Oasis</NavLink>
          </NavLinks>
        )}

        {/* Right: Video Portfolio */}
        <NavLink to="/video" className="main-link">Video Portfolio</NavLink>

        {/* Mobile: Only show Webdev/Video links centered */}
        {isMobile && (
          <NavLinks className="nav-links">
            <NavLink to="/web" className="main-link">Webdev Portfolio</NavLink>
            <NavLink to="/video" className="main-link">Video Portfolio</NavLink>
          </NavLinks>
        )}
      </Navbar>

      {/* ------------ HERO ------------ */}
      <HeroContent>
        <h1>The best platform to get your designed sites</h1>

        <div className="subtitle">
          The most powerful person is here to help you !
        </div>

        {/* ------------ NAVIGATION BUTTONS ------------ */}
        <NavigationButtons>
          <GlassButton onClick={() => navigate("/web")}>
            Web Portfolio
          </GlassButton>
          <GlassButton onClick={() => navigate("/video")}>
            Video Portfolio
          </GlassButton>
        </NavigationButtons>

        <ActionButtons>
          <GlassButton onClick={() => navigate("/")}>Get started now</GlassButton>
          <GlassButton>Book a demo</GlassButton>
        </ActionButtons>

        <div style={{ marginTop: "24px", width: "100%" }}>
          <Temp visible={tempVisible} rootRef={tempRef} />
        </div>
      </HeroContent>
    </DarkContainer>
  );
}
