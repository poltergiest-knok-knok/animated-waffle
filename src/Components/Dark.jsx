// src/components/Dark.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Temp from "./Temp.jsx";
import video from "../assets/pixelbg.mp4";

/* ========================================================= */
/*                  🔥 KEYFRAME ANIMATIONS 🔥                */
/* ========================================================= */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const blinkBorder = keyframes`
  0%, 100% {
    border-color: #00ffff;
    box-shadow: 0 0 15px #00ffff, inset 0 0 10px #00ffff;
  }
  50% {
    border-color: #ff00ff;
    box-shadow: 0 0 25px #ff00ff, inset 0 0 15px #ff00ff;
  }
`;

/* ========================================================= */
/*                🔥 STYLED COMPONENTS SETUP 🔥              */
/* ========================================================= */

const DarkContainer = styled.div`
  margin: 0;
  padding: 20px;
  min-height: 100vh;
  color: white;
  font-family: "Press Start 2P", cursive;
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 70px;
  justify-content: center;
  animation: ${fadeIn} 1s ease-in-out;
  text-transform: uppercase;
  position: relative;
  z-index: 1;

  /* Scanlines */
  background-image: repeating-linear-gradient(
    0deg,
    rgba(0, 255, 0, 0.15),
    rgba(0, 255, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );

  /* Pixel cursor */
  cursor: url('data:image/svg+xml;utf8,<svg width="22" height="16" viewBox="0 0 11 8" xmlns="http://www.w3.org/2000/svg"><rect fill="%2300ff00" x="2" y="0" width="1" height="1"/><rect fill="%2300ff00" x="8" y="0" width="1" height="1"/><rect fill="%2300ff00" x="3" y="1" width="1" height="1"/><rect fill="%2300ff00" x="7" y="1" width="1" height="1"/><rect fill="%2300ff00" x="2" y="2" width="7" height="1"/><rect fill="%2300ff00" x="1" y="3" width="2" height="1"/><rect fill="%2300ff00" x="4" y="3" width="3" height="1"/><rect fill="%2300ff00" x="8" y="3" width="2" height="1"/><rect fill="%2300ff00" x="0" y="4" width="11" height="1"/><rect fill="%2300ff00" x="0" y="5" width="1" height="1"/><rect fill="%2300ff00" x="2" y="5" width="7" height="1"/><rect fill="%2300ff00" x="10" y="5" width="1" height="1"/><rect fill="%2300ff00" x="0" y="6" width="1" height="1"/><rect fill="%2300ff00" x="2" y="6" width="1" height="1"/><rect fill="%2300ff00" x="8" y="6" width="1" height="1"/><rect fill="%2300ff00" x="10" y="6" width="1" height="1"/><rect fill="%2300ff00" x="3" y="7" width="2" height="1"/><rect fill="%2300ff00" x="6" y="7" width="2" height="1"/></svg>'),
      auto;

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
  padding: 20px 30px;
  border: 3px solid #39ff14;
  background-color: rgba(0, 0, 0, 0.7);
  box-shadow: 0 0 15px #39ff14, inset 0 0 10px #39ff14;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0;
  transition: 0.3s ease;
  position: relative;

  &:hover {
    animation: ${blinkBorder} 1s infinite;
  }

  &.open .nav-links {
    opacity: 1;
    transform: translateY(0);
    height: auto;
  }

  @media (max-width: 768px) {
    width: 95%;
    padding: 10px 8px;
    flex-direction: column;
    gap: 0;
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
    background: #ff00ff;
    border-radius: 50%;
    box-shadow: 0 0 6px #ff00ff;
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
  color: #ff00ff;
  text-decoration: none;
  font-size: 1rem;
  transition: 0.3s;
  text-shadow: 0 0 5px #ff00ff;

  &.main-link {
    color: #00eaff;
    text-shadow: 0 0 8px #00eaff;
    font-weight: bold;
  }

  &:hover {
    color: #ffff00;
    text-shadow: 0 0 10px #ffff00;
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

  h1 {
    font-size: 2rem;
    color: #00ff00;
    margin-bottom: 25px;
    text-shadow: 0 0 8px #00ff00, 0 0 15px #00ff00;
  }

  .subtitle {
    font-size: 1rem;
    color: #00ffff;
    margin-bottom: 40px;
    text-shadow: 0 0 7px #00ffff;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.6rem;
    }
    .subtitle {
      font-size: 0.9rem;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;

  p {
    padding: 15px 25px;
    border: 3px solid #ff00ff;
    background-color: transparent;
    cursor: pointer;
    color: #ff00ff;
    box-shadow: 0 0 10px #ff00ff;
    transition: 0.3s;

    &:hover {
      background-color: #ff00ff;
      color: black;
      box-shadow: 0 0 20px #ff00ff, 0 0 35px #ff00ff;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;

    p {
      width: 80%;
      margin: 0 auto;
    }
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

        <ActionButtons>
          <p>Get started now</p>
          <p>Book a demo</p>
        </ActionButtons>

        <div style={{ marginTop: "24px", width: "100%" }}>
          <Temp visible={tempVisible} rootRef={tempRef} />
        </div>
      </HeroContent>
    </DarkContainer>
  );
}
