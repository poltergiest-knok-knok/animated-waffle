import React, { useEffect, useRef } from "react";
import "./Jet.css";
// import video from "../assets/space.mp4"; // No longer needed
import { useNavigate } from "react-router-dom";

export default function Jet() {
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const cursorRef = useRef(null);
  const dots = useRef([]);
  const animationFrame = useRef(null);
  const typeTimeout = useRef(null);

  // The animateTransition state is no longer needed
  // const [animateTransition, setAnimateTransition] = useState(false); 
  const navigate = useNavigate();

  // ---------------- Typing Text ----------------
  useEffect(() => {
    const fullText = "Hello I am Abhi";
    const typingSpeed = 150;
    const fadeSpeed = 50;
    const displayTime = 1000;

    let index = 0;
    let fading = false;

    function typeText() {
      if (!textRef.current) return;

      if (!fading) {
        textRef.current.textContent = fullText.slice(0, index);
        index++;
        if (index > fullText.length) {
          fading = true;
          typeTimeout.current = setTimeout(typeText, displayTime);
          return;
        }
      } else {
        let opacity = parseFloat(getComputedStyle(textRef.current).opacity);
        opacity -= 0.05;
        textRef.current.style.opacity = opacity;
        if (opacity <= 0) {
          fading = false;
          textRef.current.style.opacity = 1;
          index = 0;
        }
      }

      typeTimeout.current = setTimeout(
        typeText,
        fading ? fadeSpeed : typingSpeed
      );
    }

    typeText();
    return () => {
      if (typeTimeout.current) clearTimeout(typeTimeout.current);
    };
  }, []);

  // ---------------- Custom Cursor ----------------
  useEffect(() => {
    const cursor = cursorRef.current;
    const colors = ["#ff4d4d", "#4dff4d", "#4d4dff", "#ffff4d", "#ff4dff"];
    let colorIndex = 0;

    const cursorInterval = setInterval(() => {
      if (cursor) cursor.style.backgroundColor = colors[colorIndex];
      colorIndex = (colorIndex + 1) % colors.length;
    }, 500);

    function moveCursor(e) {
      if (cursor) {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
      }
    }

    window.addEventListener("mousemove", moveCursor);

    return () => {
      clearInterval(cursorInterval);
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  // ---------------- Grid Dots ----------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const spacing = 50;
    const maxDist = 120;

    function initDots() {
      dots.current = [];
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          dots.current.push({
            x,
            y,
            ox: x,
            oy: y,
            vx: 0,
            vy: 0,
            radius: 2,
          });
        }
      }
    }

    initDots();

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let dot of dots.current) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,255,255,0.2)";
        ctx.fill();
      }

      for (let i = 0; i < dots.current.length; i++) {
        for (let j = i + 1; j < dots.current.length; j++) {
          const dx = dots.current[i].x - dots.current[j].x;
          const dy = dots.current[i].y - dots.current[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(dots.current[i].x, dots.current[i].y);
            ctx.lineTo(dots.current[j].x, dots.current[j].y);
            ctx.stroke();
          }
        }
      }

      const cursor = cursorRef.current;
      const mouseX = cursor ? parseFloat(cursor.style.left) : -100;
      const mouseY = cursor ? parseFloat(cursor.style.top) : -100;

      for (let dot of dots.current) {
        const dx = dot.x - mouseX;
        const dy = dot.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          const force = 0.2 * (1 - dist / 80);
          dot.vx += (dx / dist) * force;
          dot.vy += (dy / dist) * force;
        }

        dot.vx += (dot.ox - dot.x) * 0.002;
        dot.vy += (dot.oy - dot.y) * 0.002;
        dot.vx *= 0.95;
        dot.vy *= 0.95;
        dot.x += dot.vx;
        dot.y += dot.vy;
      }

      animationFrame.current = requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDots();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ---------------- Button Click (Simplified) ----------------
  const handleButtonClick = () => {
    // Navigate immediately without animation
    navigate("/dark");
  };

  return (
    <div
      className="App main-container"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
      ></canvas>

      <h1
        className="typing-text"
        ref={textRef}
        style={{
          position: "absolute",
          top: "40vh",
          width: "100%",
          textAlign: "center",
          fontSize: "3rem",
          zIndex: 2,
          color: "white",
        }}
      ></h1>

      <button
        className={`more-info-button`}
        onClick={handleButtonClick}
        style={{
          position: "absolute",
          top: "60vh",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "12px 25px",
          fontSize: "1.2rem",
          backgroundColor: "rgba(1, 8, 8, 0.7)",
          border: "1px solid rgba(236, 242, 242, 0.9)",
          borderRadius: "5px",
          color: "white",
          cursor: "pointer",
          zIndex: 3,
          transition: "all 0.3s ease",
        }}
      >
        Wanna know more.
      </button>

      <div
        className="circle-cursor"
        ref={cursorRef}
        style={{
          position: "fixed",
          left: "-100px",
          top: "-100px",
          width: 20,
          height: 20,
          borderRadius: "50%",
          pointerEvents: "none",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          backgroundColor: "#00ffff",
        }}
      ></div>

      {/* The merge-cut overlay has been removed */}
    </div>
  );
}