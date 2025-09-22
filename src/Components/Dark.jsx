import React, { useEffect, useRef, useState } from 'react';
import './Dark.css'; // Import the stylesheet
import Temp from './Temp.jsx';
import video from "../assets/pixelbg.mp4"; // Ensure the path to your video file is correct

export default function Dark() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(max-width: 768px)').matches;
  });
  const navRef = useRef(null);
  const toggleMenu = () => setMenuOpen((v) => !v);
  const handleLinkClick = () => setMenuOpen(false);

  // Keep isMobile in sync with viewport using a media query listener
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(max-width: 768px)');
    const onChange = (e) => setIsMobile(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

    // Temp visibility ref + observer
    const tempRef = useRef(null);
    const [tempVisible, setTempVisible] = useState(false);

    useEffect(() => {
      const el = tempRef.current;
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          const e = entries[0];
          setTempVisible(e.isIntersecting && e.intersectionRatio > 0.2);
        },
        { threshold: [0, 0.2, 0.5] }
      );
      io.observe(el);
      return () => io.disconnect();
    }, []);

    // When Temp becomes visible, add CSS class to trigger animations
    useEffect(() => {
      if (!tempVisible) return;
      const root = tempRef.current;
      if (!root) return;
      
      // Add animation class to trigger CSS animations
      root.classList.add('animate-letters');
      
      // Optional: remove class after animation completes to allow re-triggering
      const timer = setTimeout(() => {
        if (root) root.classList.remove('animate-letters');
      }, 2000);
      
      return () => clearTimeout(timer);
    }, [tempVisible]);

  // Close on outside click and Escape key when open
  useEffect(() => {
    if (!menuOpen) return;
    function onDocClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // Animate mobile nav drop-in/out using Web Animations API (vanilla JS)
  useEffect(() => {
    const el = navRef.current && navRef.current.querySelector('.nav-links');
    if (!el) return;

    // Only run animation on small screens (mobile)
    if (!isMobile) {
      // If switching to desktop, ensure nav is visible and clean up inline styles
      el.style.display = '';
      el.style.height = '';
      el.style.opacity = '';
      el.style.transform = '';
      // close mobile menu state
      setMenuOpen(false);
      return;
    }

    // Cancel any running animation
    if (el._currentAnimation) {
      el._currentAnimation.cancel();
      el._currentAnimation = null;
    }

    if (menuOpen) {
      // measure content height
      el.style.display = 'flex';
      el.style.height = 'auto';
      const fullHeight = el.scrollHeight;
      el.style.height = '0px';

      const anim = el.animate([
        { height: '0px', opacity: 0, transform: 'translateY(-8px)' },
        { height: fullHeight + 'px', opacity: 1, transform: 'translateY(0)' }
      ], {
        duration: 280,
        easing: 'cubic-bezier(.2,.9,.2,1)',
        fill: 'forwards'
      });
      el._currentAnimation = anim;
      anim.onfinish = () => {
        el.style.height = 'auto';
        el._currentAnimation = null;
      };
    } else {
      // Animate closed
      const startH = el.getBoundingClientRect().height;
      const anim = el.animate([
        { height: startH + 'px', opacity: 1, transform: 'translateY(0)' },
        { height: '0px', opacity: 0, transform: 'translateY(-8px)' }
      ], {
        duration: 220,
        easing: 'cubic-bezier(.2,.9,.2,1)',
        fill: 'forwards'
      });
      el._currentAnimation = anim;
      anim.onfinish = () => {
        el.style.display = 'none';
        el.style.height = '';
        el._currentAnimation = null;
      };
    }

    return () => {
      if (el._currentAnimation) el._currentAnimation.cancel();
    };
  }, [menuOpen, navRef]);
  return (
    <>
      <div className="dark-mode-container">
        <video className="background-video" src={video} autoPlay loop muted playsInline />

        {/* Navigation Component */}
        <nav ref={navRef} className={`navbar ${menuOpen ? 'open' : ''}`}>
          {/* Three-dots toggle for mobile (render only on mobile) */}
          {isMobile && (
            <button
              type="button"
              className="menu-toggle"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="nav-links"
              onClick={toggleMenu}
            >
              <span className="dot"/>
              <span className="dot"/>
              <span className="dot"/>
            </button>
          )}

          <div id="nav-links" className="nav-links" role="menu">
            <a href="#" className="nav-link" onClick={handleLinkClick} role="menuitem">
              <svg className="nav-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 1.5l2.35 7.24h7.65l-6.18 4.48 2.36 7.24-6.18-4.48-6.18 4.48 2.36-7.24-6.18-4.48h7.65z"/></svg>
              <span>Asterisk</span>
            </a>
            <a href="#" className="nav-link" onClick={handleLinkClick} role="menuitem"><span className="eooks-text">Eooks</span></a>
            <a href="#" className="nav-link" onClick={handleLinkClick} role="menuitem"><div className="opal-icon"></div><span>Opal</span></a>
            <a href="#" className="nav-link" onClick={handleLinkClick} role="menuitem">
              <svg className="nav-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.9,8.3c-0.2-0.5-0.5-0.9-0.9-1.3c-2.4-2.4-6.4-2.4-8.8,0c-1,1-1.6,2.4-1.6,3.8c0,0.5,0.1,1,0.2,1.5 c-0.5,0-1,0.1-1.5,0.2c-2.4,0.4-4.2,2.5-4.2,5c0,2.8,2.2,5,5,5c0.2,0,0.5,0,0.7-0.1c0.5,0.6,1.2,1,2,1.2c2.8,0.7,5.6-0.3,7.2-2.5 c1.9-2.6,1.7-6.1-0.5-8.5C22.2,9.3,22.1,8.8,21.9,8.3z M19.4,18.1c-1.2,1.7-3.4,2.4-5.4,1.9c-0.6-0.1-1.1-0.5-1.5-0.9 c-0.2,0-0.3,0-0.5,0c-1.9,0-3.5-1.6-3.5-3.5c0-1.8,1.4-3.3,3.2-3.5c0.6-0.1,1.1,0.4,1.1,1c0,0.3-0.1,0.5-0.3,0.7 c-0.7,0.5-1.1,1.3-1.1,2.1c0,0.8,0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5c0-1.7,1.4-3.1,3.1-3.1c0.8,0,1.5,0.3,2.1,0.8 C20.9,13.9,21.2,16,19.4,18.1z"/></svg>
              <span>Dune</span>
            </a>
            <a href="#" className="nav-link" onClick={handleLinkClick} role="menuitem"><span>Oasis</span></a>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="hero-content">
          <h1>The best platform to get your designed sites</h1>
          <div className="subtitle">
            The most powerful person is here to help you !
          </div>
          <div className="action-buttons">
            <p>Get started now</p>
            <p>Book a demo</p>
          </div>
          {/* Temp slider component */}
          <div style={{ marginTop: '24px', width: '100%' }}>
            <Temp visible={tempVisible} rootRef={tempRef} />
          </div>
        </div>
      </div>
    </>
  );
}