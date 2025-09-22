import React, { useEffect, useRef, useState } from 'react';
import star from '../assets/star.jpg';
import milky from '../assets/milky.jpg';
import space from '../assets/cosmos.jpg';
import './Temp.css';

const slidesData = [
    { img: star, text: 'Life is like stars shining bright in the night sky.' },
    { img: milky, text: 'Life is like the Milky Way, a beautiful blend of light and darkness.' },
    { img: space, text: 'Life is like outer space, vast and full of possibilities.' },
];

const Temp = ({ visible = true, rootRef: externalRef = null }) => {
    const [index, setIndex] = useState(0);
    const rootRefInternal = useRef(null);
    const rootRef = externalRef || rootRefInternal;
    const slideRefs = useRef([]);
    const autoplayRef = useRef(null);
    const touchStartX = useRef(0);

    // No need to split text into spans anymore since we're not using animejs

    // Autoplay (only when visible prop is true)
    useEffect(() => {
        if (!visible) return;
        autoplayRef.current = setInterval(() => {
            setIndex((i) => (i + 1) % slidesData.length);
        }, 4000);
        return () => {
            if (autoplayRef.current) clearInterval(autoplayRef.current);
        };
    }, [visible]);

    // NOTE: visibility is controlled by parent via `visible` prop

    // Touch handlers for swipe
    function onTouchStart(e) {
        touchStartX.current = e.touches[0].clientX;
        clearInterval(autoplayRef.current);
    }
    function onTouchEnd(e) {
        const dx = (e.changedTouches[0].clientX || 0) - touchStartX.current;
        if (dx > 40) prev();
        else if (dx < -40) next();
        autoplayRef.current = setInterval(() => {
            setIndex((i) => (i + 1) % slidesData.length);
        }, 4000);
    }

    function prev() {
        setIndex((i) => (i - 1 + slidesData.length) % slidesData.length);
    }
    function next() {
        setIndex((i) => (i + 1) % slidesData.length);
    }

    return (
        <div ref={rootRef} className={`temp-slider temp-popup ${visible ? 'in-view' : ''}`} aria-hidden={!visible}>
            <div
                className="slider-viewport"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                <div
                    className="slides"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                >
                    {slidesData.map((s, i) => (
                        <div
                            key={i}
                            className={`slide ${i === index ? 'active' : ''}`}
                            ref={(el) => (slideRefs.current[i] = el)}
                        >
                            <div className="slide-media">
                                <img src={s.img} alt={`slide-${i}`} />
                            </div>
                            <div className="slide-copy">
                                <p className="slide-text">{s.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="controls">
                <button aria-label="Previous" onClick={prev} className="control prev">‹</button>
                <div className="indicators">
                    {slidesData.map((_, i) => (
                        <button
                            key={i}
                            className={`dot ${i === index ? 'active' : ''}`}
                            onClick={() => setIndex(i)}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
                <button aria-label="Next" onClick={next} className="control next">›</button>
            </div>
        </div>
    );
};

export default Temp;