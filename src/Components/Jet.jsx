// src/components/Jet.jsx
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import GlassButton from "./Shared/GlassButton";

/* ---------------- Styled Components ---------------- */

const JetRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #000;
  color: white;
  cursor: none;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

const MainContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;

const TypingText = styled.h1`
  position: absolute;
  top: 40vh;
  left: 50%;
  transform: translateX(-50%);
  /* width is auto to fit content */
  
  font-size: 4rem;
  font-weight: 700;
  color: #fff;
  opacity: 1;
  transition: opacity 0.15s linear;
  letter-spacing: 2px;
  white-space: nowrap;
  
  /* Removed box styling and animation */
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 60vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
`;

const CircleCursor = styled.div`
  position: fixed;
  width: 22px;
  height: 22px;
  background-color: #00ffff;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 9999;
  transition: background-color 0.3s linear, opacity 0.2s ease;
  opacity: ${props => props.$hidden ? 0 : 1};
`;

const StyledCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

/* ---------------- Component ---------------- */

export default function Jet() {
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const cursorRef = useRef(null);
  const dots = useRef([]);
  const frameRef = useRef(null);
  const navigate = useNavigate();
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  /* ---------------- Typing Effect ---------------- */
  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const text = "vynce.visuals";
    const typeSpeed = 120;
    const fadeSpeed = 40;
    const delayAfterComplete = 800;

    let index = 0;
    let fading = false;

    function typeLoop() {
      if (!element) return;

      if (!fading) {
        element.textContent = text.slice(0, index);
        index++;

        if (index > text.length) {
          fading = true;
          setTimeout(typeLoop, delayAfterComplete);
          return;
        }
      } else {
        let opacity = parseFloat(element.style.opacity || "1");
        opacity -= 0.05;
        element.style.opacity = opacity;

        if (opacity <= 0) {
          fading = false;
          index = 0;
          element.style.opacity = 1;
        }
      }

      setTimeout(typeLoop, fading ? fadeSpeed : typeSpeed);
    }

    typeLoop();
  }, []);

  /* ---------------- Custom Cursor ---------------- */
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const colors = ["#ff4d4d", "#4dff4d", "#4d4dff", "#ffff4d", "#ff4dff"];
    let ci = 0;

    const colorCycle = setInterval(() => {
      cursor.style.backgroundColor = colors[ci];
      ci = (ci + 1) % colors.length;
    }, 500);

    function move(e) {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    }

    window.addEventListener("mousemove", move);
    document.body.style.cursor = "none";

    return () => {
      clearInterval(colorCycle);
      window.removeEventListener("mousemove", move);
      document.body.style.cursor = "auto";
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
      for (let x = spacing; x < width; x += spacing) {
        for (let y = spacing; y < height; y += spacing) {
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

      const cursor = cursorRef.current;
      const mx = cursor ? parseFloat(cursor.style.left) : -100;
      const my = cursor ? parseFloat(cursor.style.top) : -100;

      const allDots = dots.current;

      for (let i = 0; i < allDots.length; i++) {
        const d = allDots[i];
        const dx = d.x - mx;
        const dy = d.y - my;
        const dist = Math.hypot(dx, dy);

        // repulsion
        if (dist < repelDistance && dist > 1) {
          const force = (repelDistance - dist) / repelDistance;
          d.vx += (dx / dist) * force;
          d.vy += (dy / dist) * force;
        }

        // pull back to original position
        d.vx += (d.ox - d.x) * 0.015;
        d.vy += (d.oy - d.y) * 0.015;

        d.vx *= 0.92;
        d.vy *= 0.92;

        d.x += d.vx;
        d.y += d.vy;

        // Twinkle effect
        d.phase += d.twinkleSpeed;
        const opacity = 0.1 + (Math.sin(d.phase) + 1) * 0.25; // Oscillate between 0.1 and 0.6

        // draw dot
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // connect dots
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
    <JetRoot>
      <MainContainer>
        <StyledCanvas ref={canvasRef} />
        <TypingText ref={textRef} />
        <ButtonContainer>
          <GlassButton
            onClick={() => navigate("/dark")}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            f#ck me more.
          </GlassButton>
        </ButtonContainer>
        <CircleCursor ref={cursorRef} $hidden={isButtonHovered} />
      </MainContainer>
    </JetRoot>
  );
}
