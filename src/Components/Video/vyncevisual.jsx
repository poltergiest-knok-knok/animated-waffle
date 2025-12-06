// src/components/Jet.jsx
import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import GlassButton from "../Shared/GlassButton";


/* ---------------- Styled Components ---------------- */

const JetRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #000;
  color: #fff;
  overflow: hidden;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const MainContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translate(-50%, 30px); filter: blur(12px); }
  100% { opacity: 1; transform: translate(-50%, 0); filter: none; }
`;

const lightSweep = keyframes`
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
`;

const CinematicText = styled.h1`
  position: absolute;
  top: 40vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  margin: 0;
  white-space: nowrap;

  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 4vw;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  
  /* Smooth White Reveal Sweep */
  background: linear-gradient(
    120deg, 
    transparent 20%,
    rgba(255, 255, 255, 0.9) 50%,
    transparent 80%
  );
  
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  
  /* Entrance Animation */
  animation: ${fadeInUp} 1.2s ease-out forwards, ${lightSweep} 6s linear infinite;
  opacity: 0;

  @media (max-width: 768px) {
    font-size: 8vw;
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 60vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 100%;
  display: flex;
  justify-content: center;

  @media (max-width: 480px) {
    top: 55vh;
  }
`;

const StyledCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none; /* Let clicks pass through to WaterEffect if needed, or handle interaction separately */
`;

/* ---------------- Component ---------------- */

export default function VynceVisual({ onButtonClick }) {
  const canvasRef = useRef(null);
  const dots = useRef([]);
  const frameRef = useRef(null);
  const navigate = useNavigate();
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  /* ---------------- Custom Cursor & Interaction State ---------------- */
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    // Unified handler for mouse and touch
    const updatePosition = (clientX, clientY) => {
      mouseRef.current.x = clientX;
      mouseRef.current.y = clientY;
    };

    function onMouseMove(e) {
      updatePosition(e.clientX, e.clientY);
    }

    function onTouchMove(e) {
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchMove);
    };
  }, []);

  /* ---------------- Animated Dot Grid Canvas ---------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    const spacing = 55;
    const repelDistance = 80;
    const connectDistance = 120;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDots();
    }

    function initDots() {
      dots.current = [];

      // Calculate number of columns and rows
      const cols = Math.floor(width / spacing);
      const rows = Math.floor(height / spacing);

      // Calculate total dimensions of the grid
      const gridWidth = (cols - 1) * spacing;
      const gridHeight = (rows - 1) * spacing;

      // Calculate starting offsets to center the grid
      const startX = (width - gridWidth) / 2;
      const startY = (height - gridHeight) / 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = startX + i * spacing;
          const y = startY + j * spacing;

          dots.current.push({
            x, y,
            ox: x, oy: y,
            vx: 0, vy: 0,
            phase: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.005 + Math.random() * 0.01
          });
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Use the ref for coordinates instead of DOM reading (much faster & works for touch)
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const allDots = dots.current;

      for (let i = 0; i < allDots.length; i++) {
        const d = allDots[i];
        const dx = d.x - mx;
        const dy = d.y - my;
        const dist = Math.hypot(dx, dy);

        // repulsion
        if (dist < repelDistance) {
          const force = (repelDistance - dist) / repelDistance;
          d.vx += (dx / dist) * force * 2; // Increased force slightly for better feel
          d.vy += (dy / dist) * force * 2;
        }

        // pull back to original position
        d.vx += (d.ox - d.x) * 0.05; // Stronger pull back
        d.vy += (d.oy - d.y) * 0.05;

        d.vx *= 0.9; // More friction
        d.vy *= 0.9;

        d.x += d.vx;
        d.y += d.vy;

        // Twinkle effect
        d.phase += d.twinkleSpeed;
        const opacity = 0.1 + (Math.sin(d.phase) + 1) * 0.25;

        // draw dot (WHITE for black background)
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // connect dots (WHITE lines)
      for (let i = 0; i < allDots.length; i++) {
        for (let j = i + 1; j < allDots.length; j++) {
          const dx = allDots[i].x - allDots[j].x;
          const dy = allDots[i].y - allDots[j].y;
          if (dx * dx + dy * dy < connectDistance * connectDistance) {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(allDots[i].x, allDots[i].y);
            ctx.lineTo(allDots[j].x, allDots[j].y);
            ctx.stroke();
          }
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <JetRoot style={{ scrollSnapAlign: 'start' }}>
      <MainContainer>
        {/* StyledCanvas at z-index 1 */}
        <StyledCanvas ref={canvasRef} />

        <CinematicText>
          VYNCEVISUALS
        </CinematicText>
        <ButtonContainer>
          <GlassButton
            onClick={onButtonClick}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            Know More.
          </GlassButton>
        </ButtonContainer>

        {/* WaterEffect at z-index 100 (overlay) */}

      </MainContainer>
    </JetRoot>
  );
}
