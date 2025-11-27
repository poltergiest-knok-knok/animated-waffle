import React, { useRef } from "react";
import styled, { keyframes } from "styled-components";

const rotateCCW = keyframes`
  from {
    transform: translate(-50%, -50%) rotate(360deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(0deg);
  }
`;

const GlowBorder = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50px;
  padding: 2px; /* Thickness of the glowing edge */
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: -1;
  transition: opacity 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    background: conic-gradient(
      from 0deg,
      transparent 0%, 
      transparent 50%, 
      #fff 80%,
      transparent 100%
    );
    filter: blur(10px);
    transform: translate(-50%, -50%);
    animation: ${rotateCCW} 3s linear infinite;
  }
`;

const StyledButton = styled.button`
  position: relative;
  padding: 16px 32px;
  font-family: inherit;
  
  /* Prism Liquid Glass & Neon Glow (Default State) */
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  backdrop-filter: blur(2px); /* Minimal blur for clarity */
  -webkit-backdrop-filter: blur(2px);
  
  /* Depth & Prism Borders */
  border: 1px solid rgba(255, 255, 255, 0.1); 
  border-top: 1px solid rgba(255, 255, 255, 0.3); /* Catch light on top */
  border-left: 1px solid rgba(255, 255, 255, 0.15);
  
  box-shadow: 
    inset 0 0 30px rgba(255, 255, 255, 0.02), /* Subtle inner volume */
    0 10px 20px rgba(0, 0, 0, 0.3); /* Deep drop shadow for lift */

  border-radius: 50px;
  color: #fff;
  
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  /* Overflow hidden to clip the GlowBorder if it bleeds (though mask handles it) */
  overflow: hidden; 

  &:hover {
    /* Brighter & Clearer on Hover */
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
    backdrop-filter: blur(0px); /* Crystal clear on hover */
    -webkit-backdrop-filter: blur(0px);
    
    color: #fff;
    border-color: rgba(255, 255, 255, 0.3);
    border-top-color: rgba(255, 255, 255, 0.6);
    
    box-shadow: 
      inset 0 0 40px rgba(255, 255, 255, 0.05),
      0 15px 35px rgba(0, 0, 0, 0.4), /* Deeper shadow */
      0 0 20px rgba(255, 255, 255, 0.1); /* Subtle outer glow */
      
    transform: translateY(-2px) scale(1.01);
  }
  
  &:hover ${GlowBorder}::before {
    animation: none;
    transform: translate(-50%, -50%) rotate(var(--button-angle));
    transition: transform 0.1s linear;
  }

  &:active {
    transform: translateY(1px) scale(0.98);
    background: rgba(255, 255, 255, 0.01);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 0.9rem;
  }
`;

export default function GlassButton({ children, onClick, className, style, onMouseEnter, onMouseLeave, ...props }) {
  const buttonRef = useRef(null);
  const lastAngle = useRef(0);

  const handleMouseMove = (e) => {
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Calculate raw angle in degrees (-180 to 180)
    let angle = Math.atan2(y, x) * (180 / Math.PI);

    // Adjust angle to be continuous with the last angle to avoid jumps
    // This handles the wrap-around at -180/180 degrees
    const delta = angle - (lastAngle.current % 360);

    if (delta > 180) {
      lastAngle.current += (delta - 360);
    } else if (delta < -180) {
      lastAngle.current += (delta + 360);
    } else {
      lastAngle.current += delta;
    }

    // Add offset to align the glow correctly (original was +60)
    const rotation = lastAngle.current + 60;

    btn.style.setProperty('--button-angle', `${rotation}deg`);
  };

  return (
    <StyledButton
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={className}
      style={style}
      {...props}
    >
      {children}
      <GlowBorder />
    </StyledButton>
  );
}
