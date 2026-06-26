import React, { useState, useEffect, useRef, useMemo } from 'react';

// ==========================================
// CINEMATIC SPLIT WORD COMPONENT
// ==========================================

function SplitText({ text, tag: Tag = 'div', className, style, ...props }) {
  const words = text.split(' ');
  return (
    <Tag className={`${className} split-text-parent`} style={{ display: 'block', margin: 0, ...style }} {...props}>
      {words.map((word, idx) => (
        <span key={idx} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.22em', verticalAlign: 'top' }}>
          <span
            className="split-word-inner"
            style={{
              display: 'inline-block',
              transform: 'translate3d(0, 110%, 0)',
              transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${idx * 0.06}s`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}

// ==========================================
// STYLE OBJECTS FOR THE CORE SECTIONS
// ==========================================

const section2ContainerStyle = {
  backgroundColor: '#1a1614',
  color: '#ffffff',
  padding: '16vh 10vw 12vh 10vw',
  width: '100%',
  overflow: 'hidden',
  position: 'relative',
};

const section2HeadingStyle = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 900,
  fontSize: 'clamp(36px, 6vw, 76px)',
  letterSpacing: '-0.04em',
  color: '#ffffff',
  marginBottom: '10px',
  lineHeight: '1.15',
  textAlign: 'left',
};

const section2SubLabelStyle = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '11px',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.25em',
  color: '#c9a96e',
  marginBottom: '8vh',
  display: 'block',
  textAlign: 'left',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '40px',
  width: '100%',
};

// Style objects for process stats (used below)

const statsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '30px',
  justifyContent: 'center',
};

const statItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  position: 'relative',
};

const statNumberStyle = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '72px',
  fontWeight: 900,
  color: '#c9a96e',
  lineHeight: '1.1',
  letterSpacing: '-0.02em',
};

const statLabelStyle = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.25em',
  color: '#1a1614',
  textTransform: 'uppercase',
  marginTop: '5px',
};

// ==========================================
// MAIN APP SINGLE-PAGE COMPONENT
// ==========================================

// ==========================================
// UPGRADED FEATURED LISTING CARD COMPONENT
// ==========================================
function PropertyCard({ item, idx, prefersReducedMotion }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [prevSlideIndex, setPrevSlideIndex] = useState(null);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const cardRef = useRef(null);

  const images = useMemo(() => {
    if (item.id === 1) {
      return [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
      ];
    } else if (item.id === 2) {
      return [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"
      ];
    } else {
      return [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"
      ];
    }
  }, [item.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsRevealed(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.15 });

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isRevealed || prefersReducedMotion || isHovered) {
      setTimerActive(false);
      return;
    }
    const staggerTime = idx * 1500;
    const t = setTimeout(() => {
      setTimerActive(true);
    }, staggerTime);
    return () => clearTimeout(t);
  }, [isRevealed, prefersReducedMotion, isHovered, idx]);

  useEffect(() => {
    if (!timerActive || prefersReducedMotion || isHovered) return;
    const interval = setInterval(() => {
      setPrevSlideIndex(slideIndex);
      setSlideIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [timerActive, slideIndex, prefersReducedMotion, isHovered, images.length]);

  const handleDotClick = (dotIdx) => {
    if (dotIdx === slideIndex) return;
    setPrevSlideIndex(slideIndex);
    setSlideIndex(dotIdx);
  };

  const handleImageLoad = (imgIdx) => {
    if (imgIdx === 0) {
      setFirstLoaded(true);
    }
  };

  const getKenBurnsClass = (imgIdx) => {
    if (prefersReducedMotion || isHovered) return "kb-static";
    const variantId = (idx + imgIdx) % 6;
    const variants = [
      "kb-zoom-in",
      "kb-zoom-out",
      "kb-drift-left",
      "kb-drift-right",
      "kb-drift-up",
      "kb-drift-diagonal"
    ];
    return variants[variantId];
  };

  return (
    <div
      ref={cardRef}
      data-reveal="fade-up"
      style={{
        width: '100%',
        height: '100%',
        aspectRatio: '3/4',
      }}
    >
      <div
        className="property-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          borderRadius: '4px',
          overflow: 'hidden',
          transform: isHovered ? 'translateY(-10px) scale(1.015)' : 'translateY(0) scale(1)',
          boxShadow: isHovered ? '0 25px 50px rgba(0, 0, 0, 0.55)' : 'none',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'pointer',
        }}
      >
        <div
          className="card-inner"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#1a1614',
            borderRadius: '4px',
            transform: 'scale(var(--card-lift, 1))',
            transition: 'transform 0.1s ease-out, border-color 0.5s ease, box-shadow 0.6s ease',
          }}
        >
          {!firstLoaded && (
            <div className="shimmer-loader" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 3,
              background: 'linear-gradient(90deg, rgba(201,169,110,0.05) 25%, rgba(201,169,110,0.15) 50%, rgba(201,169,110,0.05) 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite linear',
            }} />
          )}

          {images.map((url, imgIdx) => {
            const isActive = imgIdx === slideIndex;
            const isPrev = imgIdx === prevSlideIndex;
            if (!isActive && !isPrev) return null;

            return (
              <img
                key={imgIdx}
                src={url}
                alt={`${item.name} Slide ${imgIdx + 1}`}
                onLoad={() => handleImageLoad(imgIdx)}
                className={getKenBurnsClass(imgIdx)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 1.5s ease-in-out',
                  zIndex: isActive ? 1 : 0,
                }}
              />
            );
          })}

          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: isHovered 
              ? 'linear-gradient(to top, rgba(26,22,20,0.98) 0%, rgba(26,22,20,0.6) 70%, rgba(26,22,20,0.2) 100%)'
              : 'linear-gradient(to top, rgba(26,22,20,0.95) 0%, rgba(26,22,20,0.45) 70%, transparent 100%)',
            transition: 'background 0.4s ease',
            zIndex: 2,
            pointerEvents: 'none',
          }} />

          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            color: '#c9a96e',
            letterSpacing: '0.1em',
            zIndex: 3,
          }}>
            {`0${slideIndex + 1} / 03`}
          </div>

          <div style={{
            position: 'absolute',
            bottom: '120px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 3,
          }}>
            {images.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => handleDotClick(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: dotIdx === slideIndex ? '#c9a96e' : 'rgba(255, 255, 255, 0.4)',
                  transform: dotIdx === slideIndex ? 'scale(1.3)' : 'scale(1)',
                  transition: 'background-color 0.3s ease, transform 0.3s ease',
                  cursor: 'pointer',
                  border: 'none',
                  padding: 0,
                }}
              />
            ))}
          </div>

          <div style={{
            position: 'absolute',
            top: '10%',
            left: '-10%',
            fontSize: '9vw',
            fontWeight: 900,
            color: '#ffffff',
            opacity: isHovered ? 0.03 : 0.06,
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            fontFamily: "'Inter', sans-serif",
            transition: 'opacity 0.4s ease',
            zIndex: 2,
          }}>
            {item.ghost}
          </div>

          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            transform: isHovered ? 'translate3d(0, -8px, 0)' : 'translate3d(0, 0, 0)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 3,
          }}>
            <div style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '9px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: '#c9a96e',
              border: '1px solid rgba(201, 169, 110, 0.4)',
              padding: '4px 8px',
              borderRadius: '2px',
              marginBottom: '12px',
            }}>{item.location}</div>
            <h3 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '24px',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '6px',
            }}>{item.name}</h3>
            <div style={{
              fontFamily: "'Georgia', serif",
              fontSize: '14px',
              fontStyle: 'italic',
              color: '#e8d5b7',
              marginBottom: '15px',
              display: 'flex',
              gap: '15px',
            }}>
              <span>{item.details}</span>
              <span style={{ color: '#c9a96e' }}>&middot;</span>
              <span style={{ fontWeight: 700, color: '#ffffff' }}>{item.price}</span>
            </div>
            <div style={{
              width: '100%',
              height: '1px',
              backgroundColor: 'rgba(201,169,110,0.25)',
              margin: '15px 0',
            }} />
            <button className="view-btn" style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              color: '#c9a96e',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'color 0.3s ease',
            }}>
              VIEW PROPERTY <span style={{ transition: 'transform 0.3s ease', transform: isHovered ? 'translateX(4px)' : 'none' }}>&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
    const [formSubmitted, setFormSubmitted] = useState(false);
  const [formFields, setFormFields] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'General Enquiry',
    message: ''
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  // Interactive reviews slider state & data
  const [activeReview, setActiveReview] = useState(0);
  const [reviewsHovered, setReviewsHovered] = useState(false);

  const reviews = [
    {
      id: 1,
      quote: "ÂLTO didn't show us houses. They showed us who we were becoming. The integration of site flow and spatial intelligence is unmatched.",
      author: "Mihail & Priya Shenoy",
      details: "Bandra Residence, Mumbai"
    },
    {
      id: 2,
      quote: "A masterpiece of engineering and visual prestige. ÂLTO understands the discretion and architectural truth required for beachfront living.",
      author: "Fariq Al-Mansoori",
      details: "Palm Crescent, Dubai"
    },
    {
      id: 3,
      quote: "Their team did not sell us a heritage flat. They placed us inside a historical future. The attention to historic detail was exemplary.",
      author: "Lady Charlotte Sterling",
      details: "Kensington Court, London"
    }
  ];

  useEffect(() => {
    if (prefersReducedMotion || reviewsHovered) return;
    const interval = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeReview, prefersReducedMotion, reviewsHovered]);

  const handleReviewSelect = (idx) => {
    setActiveReview(idx);
  };
  const [loading, setLoading] = useState(true);
  const [exitAnim, setExitAnim] = useState(false);

  useEffect(() => {
    let removeTimer;
    const timer = setTimeout(() => {
      setExitAnim(true);
      removeTimer = setTimeout(() => {
        setLoading(false);
      }, 1000);
    }, 2500);
    return () => {
      clearTimeout(timer);
      if (removeTimer) clearTimeout(removeTimer);
    };
  }, []);

  // Hero slideshow state
  const [heroIndex, setHeroIndex] = useState(0);
  const [prevHeroIndex, setPrevHeroIndex] = useState(null);

  const heroImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
  ];

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setPrevHeroIndex(heroIndex);
      setHeroIndex((prev) => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroIndex, prefersReducedMotion]);

  const handleHeroDotClick = (idx) => {
    if (idx === heroIndex) return;
    setPrevHeroIndex(heroIndex);
    setHeroIndex(idx);
  };

  // --- Caption crossfade logic ---
  const captions = [
    "Where architecture meets aspiration.",
    "Curated properties across three continents.",
    "Homes that hold meaning."
  ];
  const [captionIndex, setCaptionIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setCaptionIndex((prev) => (prev + 1) % captions.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion, captions.length]);

  // --- Custom Cursor & Scroll Engine setup ---
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const mouseTarget = useRef({ x: 0, y: 0 });

  const [showRipple, setShowRipple] = useState(false);
  const rippleFired = useRef(false);

  const stat1Animated = useRef(false);
  const stat2Animated = useRef(false);
  const stat3Animated = useRef(false);

  const section2Ref = useRef(null);
  const section3Ref = useRef(null);

  useEffect(() => {
    // Mouse listener updates target ref immediately
    const handleMouseMove = (e) => {
      mouseTarget.current.x = e.clientX;
      mouseTarget.current.y = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${e.clientX - 14}px, ${e.clientY - 14}px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Cursor hover state delegation
  useEffect(() => {
    const handleMouseEnter = (e) => {
      const target = e.target.closest('a, button, [role="button"], .property-card, .footer-link, .nav-link, .dark-pill, .dark-circle');
      if (target) {
        document.body.classList.add('cursor-hover-active');
      }
    };
    const handleMouseLeave = (e) => {
      const target = e.target.closest('a, button, [role="button"], .property-card, .footer-link, .nav-link, .dark-pill, .dark-circle');
      if (target) {
        document.body.classList.remove('cursor-hover-active');
      }
    };
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  // requestAnimationFrame scroll loop
  useEffect(() => {
    let lastScrollY = window.scrollY ?? window.pageYOffset;
    let currentScrollY = window.scrollY ?? window.pageYOffset;
    let rAFId = null;

    // Cache DOM element references once
    const docEl = document.documentElement;
    const navbar = document.querySelector('.nav-bar');
    const hero = document.getElementById('hero-section');
    const section2 = document.getElementById('properties');
    let cards = [];

    const loop = () => {
      currentScrollY = window.scrollY ?? window.pageYOffset;
      const scrollHeight = document.body.scrollHeight;
      const innerHeight = window.innerHeight;
      const maxScroll = scrollHeight - innerHeight;
      const progress = maxScroll > 0 ? (currentScrollY / maxScroll).toFixed(4) : "0.0000";

      // 1. Write properties to root
      docEl.style.setProperty('--scroll-y', currentScrollY + 'px');
      docEl.style.setProperty('--scroll-progress', progress);

      // Mouse values for parallax
      docEl.style.setProperty('--mouse-x', (mouseTarget.current.x / window.innerWidth - 0.5) * 35 + 'px');
      docEl.style.setProperty('--mouse-y', (mouseTarget.current.y / window.innerHeight - 0.5) * 35 + 'px');

      // 2. Scroll direction
      const dir = currentScrollY > lastScrollY ? 'down' : (currentScrollY < lastScrollY ? 'up' : null);
      if (dir) {
        document.body.setAttribute('data-scroll-dir', dir);
      }
      lastScrollY = currentScrollY;

      const isMobile = window.innerWidth < 768;

      // 3. Card inner scale (cached after loading screen exits)
      if (cards.length === 0) {
        cards = document.querySelectorAll('.card-inner');
      }
      const viewportMidY = currentScrollY + innerHeight / 2;
      cards.forEach(card => {
        if (isMobile) {
          card.style.setProperty('--card-lift', '1');
        } else {
          const rect = card.getBoundingClientRect();
          const cardMidY = rect.top + currentScrollY + rect.height / 2;
          const dist = Math.abs(cardMidY - viewportMidY) / innerHeight;
          const val = Math.max(0, 1 - dist);
          const scale = (1 + val * 0.012).toFixed(4);
          card.style.setProperty('--card-lift', scale);
        }
      });

      // 4. Hero exit (Moment 1)
      if (hero) {
        if (currentScrollY > hero.offsetHeight * 0.72) {
          hero.classList.add('hero-exit');
        } else {
          hero.classList.remove('hero-exit');
        }
      }

      // 5. Listings center ripple (Moment 2)
      if (section2 && !rippleFired.current) {
        const rect = section2.getBoundingClientRect();
        const section2MidY = rect.top + currentScrollY + rect.height / 2;
        if (Math.abs(section2MidY - viewportMidY) < 60) {
          rippleFired.current = true;
          setShowRipple(true);
        }
      }

      // 6. Lerp cursor ring position removed (handled in mousemove event via CSS transitions)

      // 7. Navbar scroll class transition
      if (navbar) {
        if (currentScrollY > 80) {
          navbar.classList.add('nav-scrolled');
        } else {
          navbar.classList.remove('nav-scrolled');
        }
      }

      rAFId = requestAnimationFrame(loop);
    };

    rAFId = requestAnimationFrame(loop);
    return () => {
      if (rAFId) cancelAnimationFrame(rAFId);
    };
  }, []);

  // Shared IntersectionObservers (timing delay added)
  useEffect(() => {
    if (loading) return;

    let revealObserver;
    let entryObserver;

    const timer = setTimeout(() => {
      // --- Observer 1: Reveal triggers ---
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
            const el = entry.target;
            el.classList.add('revealed');
            el.setAttribute('data-revealed', 'true');
            revealObserver.unobserve(el);
          }
        });
      }, {
        threshold: [0, 0.15, 0.4],
        rootMargin: '0px 0px -8% 0px'
      });

      const revealEls = document.querySelectorAll('[data-reveal]');
      revealEls.forEach(el => {
        if (el.getAttribute('data-revealed') !== 'true') {
          revealObserver.observe(el);
        }
      });

      // Apply staggers
      const staggerContainers = document.querySelectorAll('[data-stagger]');
      staggerContainers.forEach(container => {
        const ms = parseInt(container.getAttribute('data-stagger') || '100', 10);
        const children = container.querySelectorAll('[data-reveal]');
        children.forEach((child, idx) => {
          child.style.transitionDelay = `${idx * ms}ms`;
        });
      });

      // --- Observer 2: Entry Events (Stats, Scan Line, Footer Curtain) ---
      entryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            
            // Stats counters (threshold 0.4)
            if (el.classList.contains('stat-item') && entry.intersectionRatio >= 0.4) {
              if (el.id === 'stat-1' && !stat1Animated.current) {
                stat1Animated.current = true;
                animateNumber(el.querySelector('.stat-num-value'), 847);
                entryObserver.unobserve(el);
              }
              if (el.id === 'stat-2' && !stat2Animated.current) {
                stat2Animated.current = true;
                animateNumber(el.querySelector('.stat-num-value'), 3);
                entryObserver.unobserve(el);
              }
              if (el.id === 'stat-3' && !stat3Animated.current) {
                stat3Animated.current = true;
                animateNumber(el.querySelector('.stat-num-value'), 14);
                entryObserver.unobserve(el);
              }
            }

            // Process Horizontal Scan (threshold 0.2)
            if (el.id === 'process-section' && entry.intersectionRatio >= 0.2) {
              el.classList.add('scan-active');
              entryObserver.unobserve(el);
            }

            // Footer Curtain (threshold 0.2)
            if (el.id === 'contact-footer' && entry.intersectionRatio >= 0.2) {
              el.classList.add('revealed');
              entryObserver.unobserve(el);
            }
          }
        });
      }, {
        threshold: [0.2, 0.4]
      });

      const stat1 = document.getElementById('stat-1');
      const stat2 = document.getElementById('stat-2');
      const stat3 = document.getElementById('stat-3');
      const processSec = document.getElementById('process-section');
      const footer = document.getElementById('contact-footer');

      if (stat1) entryObserver.observe(stat1);
      if (stat2) entryObserver.observe(stat2);
      if (stat3) entryObserver.observe(stat3);
      if (processSec) entryObserver.observe(processSec);
      if (footer) entryObserver.observe(footer);
    }, 300);

    return () => {
      clearTimeout(timer);
      if (revealObserver) revealObserver.disconnect();
      if (entryObserver) entryObserver.disconnect();
    };
  }, [loading]);

  // Eased Number countup animator
  const animateNumber = (element, target, duration = 1800) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutExpo
      const easeVal = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(easeVal * target);
      
      if (element) {
        element.textContent = currentVal;
      }
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else if (element) {
        element.textContent = target;
      }
    };
    requestAnimationFrame(step);
  };

  
  const listings = [
    {
      id: 1,
      name: "The Bandra Residence",
      location: "Bandra West, Mumbai",
      price: "₹18.5 Cr",
      details: "4 BHK + Study",
      color: "#2a2420",
      ghost: "BANDRA"
    },
    {
      id: 2,
      name: "Palm Crescent",
      location: "Palm Jumeirah, Dubai",
      price: "AED 12.4M",
      details: "5 BHK Penthouse",
      color: "#1e2228",
      ghost: "PALM"
    },
    {
      id: 3,
      name: "Kensington Court",
      location: "Kensington, London",
      price: "£6.2M",
      details: "3 BHK Garden Flat",
      color: "#22201e",
      ghost: "KENSINGTON"
    }
  ];

  const processSteps = [
    {
      roman: "I",
      title: "DISCOVERY",
      desc: "Every mandate begins with listening to your architectural aspirations."
    },
    {
      roman: "II",
      title: "CURATION",
      desc: "We select only properties that hold structural truth and aesthetic power."
    },
    {
      roman: "III",
      title: "NEGOTIATION",
      desc: "Aligning interest, value, and structural integrity with absolute precision."
    },
    {
      roman: "IV",
      title: "TRANSITION",
      desc: "Our relationship with your space only begins when the keys are handed over."
    }
  ];

  
  
  return (
    <div className={prefersReducedMotion ? "reduced-motion" : ""} style={{ width: '100%' }}>
      {/* 
        ====================================================
        INJECTED STYLE BLOCK FOR KEYFRAMES & COMPLEX RULES
        ====================================================
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* --- CSS Keyframe Animations --- */
        @keyframes logo-entrance {
          0% { opacity: 0; transform: scale(0.85) translateY(15px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes text-entrance {
          0% { opacity: 0; letter-spacing: 0.1em; }
          100% { opacity: 1; letter-spacing: 0.35em; }
        }

        @keyframes line-expand {
          0% { width: 0px; }
          100% { width: 140px; }
        }

        @keyframes manifesto-fade {
          0%, 100% { opacity: 0.85; transform: translateY(-50%) translateX(0); }
          6% { opacity: 0.85; }
          18%, 82% { opacity: 0; transform: translateY(-50%) translateX(10px); }
          94% { opacity: 0.85; }
        }

        @keyframes scan-sweep {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }

        @keyframes ripple-gold {
          0%   { transform: scale(0); opacity: 0.4; }
          100% { transform: scale(3.5); opacity: 0; }
        }

        /* --- Ken Burns Keyframes --- */
        @keyframes kb-zoom-in {
          0% { transform: scale(1); }
          100% { transform: scale(1.12); }
        }

        @keyframes kb-zoom-out {
          0% { transform: scale(1.12); }
          100% { transform: scale(1); }
        }

        @keyframes kb-drift-left {
          0% { transform: translateX(0) scale(1.08); }
          100% { transform: translateX(-4%) scale(1.08); }
        }

        @keyframes kb-drift-right {
          0% { transform: translateX(-4%) scale(1.08); }
          100% { transform: translateX(0) scale(1.08); }
        }

        @keyframes kb-drift-up {
          0% { transform: translateY(0) scale(1.08); }
          100% { transform: translateY(-4%) scale(1.08); }
        }

        @keyframes kb-drift-diagonal {
          0% { transform: translate3d(0, 0, 0) scale(1.08); }
          100% { transform: translate3d(3%, -3%, 0) scale(1.08); }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes scroll-line-down {
          0% { transform: scaleY(0); transform-origin: top; }
          45% { transform: scaleY(1); transform-origin: top; }
          55% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }

        .kb-zoom-in { animation: kb-zoom-in 6s ease-out forwards; }
        .kb-zoom-out { animation: kb-zoom-out 6s ease-out forwards; }
        .kb-drift-left { animation: kb-drift-left 6s ease-out forwards; }
        .kb-drift-right { animation: kb-drift-right 6s ease-out forwards; }
        .kb-drift-up { animation: kb-drift-up 6s ease-out forwards; }
        .kb-drift-diagonal { animation: kb-drift-diagonal 6s ease-out forwards; }
        .kb-static { transform: scale(1.04) !important; animation: none !important; }

        /* --- Contact Form Inputs --- */
        .contact-input {
          width: 100%;
          background: transparent !important;
          border: none !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
          padding: 12px 0 !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 11px !important;
          font-weight: 500 !important;
          letter-spacing: 0.15em !important;
          color: #ffffff !important;
          transition: border-color 0.4s ease, color 0.4s ease !important;
          outline: none !important;
        }
        .contact-input::placeholder {
          color: rgba(255, 255, 255, 0.35) !important;
        }
        .contact-input:focus {
          border-bottom-color: #c9a96e !important;
        }
        .contact-select {
          cursor: pointer !important;
          appearance: none !important;
          -webkit-appearance: none !important;
        }
        .contact-select option {
          background-color: #1a1614 !important;
          color: #ffffff !important;
          font-family: 'Inter', sans-serif !important;
          letter-spacing: 0.1em !important;
        }
        .contact-submit-btn:hover {
          background-color: transparent !important;
          color: #c9a96e !important;
          transform: scale(1.02);
        }

        /* --- Reviews Slider Selectors --- */
        .review-selector-btn {
          border: none !important;
          background: transparent !important;
          outline: none !important;
          padding: 18px 0 !important;
          transition: border-color 0.4s ease !important;
        }
        .review-selector-btn:hover span {
          color: #c9a96e !important;
        }

        /* --- Helper Classes & Hover effects --- */
        .cursor-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 6px;
          height: 6px;
          background-color: #c9a96e;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          transition: opacity 0.3s ease;
        }

        body.cursor-hover-active .cursor-ring {
          transform: scale(2.2) !important;
          border-color: #c9a96e !important;
          mix-blend-mode: difference !important;
          background-color: transparent !important;
        }

        body.cursor-hover-active .cursor-dot {
          opacity: 0 !important;
        }

        /* Scroll reveal styling engine */
        [data-reveal] {
          opacity: 0;
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.9s cubic-bezier(0.16, 1, 0.3, 1),
                      clip-path 0.9s cubic-bezier(0.16, 1, 0.3, 1) !important;
          will-change: opacity, transform, clip-path;
        }

        [data-reveal="fade-up"] { transform: translate3d(0, 52px, 0); }
        [data-reveal="fade-down"] { transform: translate3d(0, -36px, 0); }
        [data-reveal="fade-left"] { transform: translate3d(64px, 0, 0); }
        [data-reveal="fade-right"] { transform: translate3d(-64px, 0, 0); }
        [data-reveal="scale-up"] { transform: scale(0.88); }
        [data-reveal="clip-left"] { clip-path: inset(0 100% 0 0); }
        [data-reveal="fade"] { transform: none; }

        .revealed {
          opacity: 1 !important;
          transform: translate3d(0,0,0) scale(1) !important;
          clip-path: inset(0 0% 0 0) !important;
        }
        .revealed .split-word-inner {
          transform: translate3d(0, 0, 0) !important;
        }

        /* Hover lift and glow on property cards */
        .property-card {
          border: 1px solid transparent;
          transition: border-color 0.5s ease, box-shadow 0.6s ease;
        }
        .property-card:hover {
          border-color: #c9a96e !important;
        }
        .property-card:hover .view-btn {
          color: #ffffff !important;
        }

        /* Process Strip horizontal scan layout animations */
        .process-step-inner {
          opacity: 0 !important;
          transform: translate3d(0, 40px, 0) !important;
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .scan-active .process-step-inner {
          opacity: 1 !important;
          transform: translate3d(0, 0, 0) !important;
        }
        .scan-active .process-step:nth-child(1) .process-step-inner { transition-delay: 0.1s !important; }
        .scan-active .process-step:nth-child(2) .process-step-inner { transition-delay: 0.25s !important; }
        .scan-active .process-step:nth-child(3) .process-step-inner { transition-delay: 0.40s !important; }
        .scan-active .process-step:nth-child(4) .process-step-inner { transition-delay: 0.55s !important; }

        .process-step {
          padding: 60px 40px;
          border-right: 1px solid rgba(201, 169, 110, 0.15);
          transition: background-color 0.4s ease;
        }
        .process-step:hover {
          background-color: rgba(201, 169, 110, 0.07);
        }
        .process-step:last-child {
          border-right: none;
        }

        /* Curtain rise footer */
        #contact-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #1a1614;
          z-index: 5;
          transform-origin: bottom;
          transform: scaleY(1);
          transition: transform 0.8s cubic-bezier(0.85, 0, 0.15, 1);
          pointer-events: none;
        }
        #contact-footer.revealed::before {
          transform: scaleY(0);
        }

        /* Mouse movement parallax class */
        .parallax-square {
          transform: translate3d(calc(var(--mouse-x) * var(--factor)), calc(var(--mouse-y) * var(--factor)), 0) !important;
          transition: transform 0.15s ease-out;
        }

        /* Header utility hover */
        .nav-link {
          position: relative;
          color: #ffffff;
          transition: color 0.3s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          width: 100%;
          transform: scaleX(0);
          height: 1px;
          bottom: -4px;
          left: 0;
          background-color: #c9a96e;
          transform-origin: bottom right;
          transition: transform 0.3s cubic-bezier(0.86, 0, 0.07, 1);
        }
        .nav-link:hover {
          color: #c9a96e;
        }
        .nav-link:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }

        /* Pill buttons and explore circle */
        .dark-pill {
          background-color: #1a1614;
          color: #f5f1eb;
          border: 1px solid #1a1614;
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
        .dark-pill:hover {
          background-color: transparent;
          color: #1a1614;
          border-color: #1a1614;
        }

        .dark-circle {
          background-color: #1a1614;
          color: #f5f1eb;
          border: 1px solid #1a1614;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, color 0.3s ease;
        }
        .dark-circle:hover {
          transform: rotate(45deg) scale(1.1);
          background-color: transparent;
          color: #1a1614;
        }
        
        .hero-primary-btn:hover {
          background-color: transparent !important;
          color: #ffffff !important;
          border-color: #ffffff !important;
          transform: translateY(-2px);
        }
        .hero-primary-btn:active {
          transform: translateY(0);
        }

        .hero-secondary-btn:hover {
          background-color: #ffffff !important;
          color: #1a1614 !important;
          border-color: #ffffff !important;
          transform: translateY(-2px);
        }
        .hero-secondary-btn:active {
          transform: translateY(0);
        }

        .footer-link {
          transition: color 0.3s ease, padding-left 0.3s ease;
        }
        .footer-link:hover {
          color: #ffffff !important;
          padding-left: 4px;
        }

        /* Navbar transitions */
        .nav-bar {
          transition: background-color 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease, padding 0.4s ease !important;
          background-color: transparent !important;
          backdrop-filter: none !important;
          WebkitBackdropFilter: none !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
        }
        .nav-bar .logo-text, .nav-bar .nav-link {
          color: #ffffff !important;
          transition: color 0.4s ease;
        }
        .nav-bar .nav-link::after {
          background-color: #c9a96e !important;
        }
        .nav-bar.nav-scrolled {
          background-color: rgba(10, 8, 6, 0.88) !important;
          backdrop-filter: blur(16px) !important;
          WebkitBackdropFilter: blur(16px) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          padding: 18px 60px !important;
        }
        .nav-bar.nav-scrolled .logo-text {
          color: #c9a96e !important;
        }

        /* Hero exit modifications */
        #hero-section {
          transition: opacity 0.6s ease;
        }
        .hero-exit .nav-bar,
        .hero-exit .side-ruler,
        .hero-exit .hero-caption-item,
        .hero-exit .dark-pill,
        .hero-exit .dark-circle,
        .hero-exit .hero-manifesto,
        .hero-exit .hero-scroll-indicator,
        .hero-exit .hero-slideshow-ctrl,
        .hero-exit .hero-stats-bar {
          opacity: 0 !important;
          transition: opacity 0.3s ease !important;
          pointer-events: none !important;
        }

        /* Responsive Overrides */
        @media (max-width: 1000px) {
          .side-ruler {
            display: none !important;
          }
          .section2-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          .section3-grid {
            grid-template-columns: 1fr !important;
            gap: 60px !important;
            padding: 8vh 6vw !important;
          }
          .section4-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
          .process-step {
            border-right: none !important;
            border-bottom: 1px solid rgba(201, 169, 110, 0.15);
            padding: 40px 20px !important;
          }
          .process-step:last-child {
            border-bottom: none !important;
          }
          .hero-caption {
            font-size: 14px !important;
          }
          .hero-manifesto {
            display: none !important;
          }
          .nav-links-container {
            gap: 15px !important;
          }
          .nav-bar {
            padding: 20px 4vw !important;
          }
          .stat-number {
            font-size: 56px !important;
          }
        }

        @media (max-width: 767px) {
          .cursor-dot, .cursor-ring-wrapper {
            display: none !important;
          }
          .hero-stats-bar {
            display: none !important;
          }
        }

        /* Prefers-reduced-motion overrides */
        .reduced-motion .scan-line {
          display: none !important;
        }
        .reduced-motion .process-step-inner {
          opacity: 1 !important;
          transform: none !important;
          clip-path: none !important;
        }
        .reduced-motion #contact-footer::before {
          display: none !important;
        }
        .reduced-motion [data-reveal] {
          opacity: 1 !important;
          transform: none !important;
          clip-path: none !important;
        }
      ` }} />

      {/* 
        ====================================================
        SCROLL PROGRESS BAR (z-index 99999)
        ====================================================
      */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '2px',
        background: 'linear-gradient(90deg, #c9a96e, #e8d5b7, #c9a96e)',
        width: 'calc(var(--scroll-progress) * 100%)',
        zIndex: 99999,
      }} />

      {/* 
        ====================================================
        CUSTOM FOLLOW CURSOR (Desktop only)
        ====================================================
      */}
      <div ref={cursorRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring-wrapper" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 99998,
        transform: 'translate3d(-100px, -100px, 0)',
        transition: 'transform 0.15s cubic-bezier(0.1, 0.8, 0.3, 1)'
      }}>
        <div className="cursor-ring" style={{
          width: '28px',
          height: '28px',
          border: '1px solid #c9a96e',
          borderRadius: '50%',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease'
        }} />
      </div>

      {/* 
        ====================================================
        FILM GRAIN OVERLAY (Fixed, above everything)
        ====================================================
      */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity: 0.05,
        mixBlendMode: 'multiply',
        zIndex: 999,
        pointerEvents: 'none',
      }} />

      {/* Animated Preloader */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: '#1a1614',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'transform 1s cubic-bezier(0.85, 0, 0.15, 1), opacity 1s ease',
          transform: exitAnim ? 'translateY(-100%)' : 'translateY(0)',
          opacity: exitAnim ? 0 : 1,
          pointerEvents: exitAnim ? 'none' : 'auto',
        }}>
          {/* Minimal Gold Triangle Logo */}
          <div style={{
            animation: 'logo-entrance 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            opacity: 0,
            transform: 'scale(0.8) translateY(10px)',
            marginBottom: '30px',
          }}>
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 15L85 75H15L50 15Z" stroke="#c9a96e" strokeWidth="2" strokeLinejoin="round" />
              <path d="M50 38L71 75H29L50 38Z" stroke="#c9a96e" strokeWidth="1" strokeLinejoin="round" opacity="0.5" />
            </svg>
          </div>
          {/* Title Wordmark */}
          <h1 style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '24px',
            letterSpacing: '0.3em',
            color: '#ffffff',
            fontWeight: 900,
            margin: 0,
            opacity: 0,
            animation: 'text-entrance 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards',
          }}>
            ÂLTO <span style={{ fontFamily: "'Georgia', serif", fontStyle: 'italic', fontWeight: 300, color: '#c9a96e', letterSpacing: '0.15em' }}>ESTATES</span>
          </h1>
          {/* Expanding Line */}
          <div style={{
            width: '0px',
            height: '1px',
            backgroundColor: '#c9a96e',
            marginTop: '20px',
            animation: 'line-expand 1.5s cubic-bezier(0.85, 0, 0.15, 1) 0.6s forwards',
          }} />
        </div>
      )}

      {/* 
        =========================================
        SECTION 1 — HERO & 3D JELLYFISH
        =========================================
      */}
      <section id="hero-section" style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        
        {/* Background Slideshow Layer */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          overflow: 'hidden',
        }}>
          {heroImages.map((url, idx) => {
            const isActive = idx === heroIndex;
            const isPrev = idx === prevHeroIndex;
            if (!isActive && !isPrev) return null;

            const kbClasses = ["kb-zoom-in", "kb-drift-left", "kb-zoom-out", "kb-drift-diagonal"];
            const kbClass = prefersReducedMotion ? "kb-static" : kbClasses[idx];

            return (
              <img
                key={idx}
                src={url}
                alt={`Hero Slide ${idx + 1}`}
                className={kbClass}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 1.5s ease-in-out',
                  zIndex: isActive ? 1 : 0,
                }}
              />
            );
          })}
          {/* Dark overlay vignette */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at center, rgba(10, 8, 6, 0.4) 0%, rgba(10, 8, 6, 0.75) 60%, rgba(10, 8, 6, 0.95) 100%)',
            zIndex: 2,
            pointerEvents: 'none',
          }} />
        </div>

        {/* NAV BAR */}
        <nav className="nav-bar" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '25px 60px',
          zIndex: 100,
        }}>
          {/* Logo */}
          <div className="logo-text" style={{ fontSize: '16px', letterSpacing: '0.12em' }}>
            <span style={{ fontWeight: 900 }}>ÂLTO</span>
            <span style={{ fontFamily: "'Georgia', serif", fontStyle: 'italic', fontWeight: 300 }}> ESTATES</span>
          </div>
          {/* Nav utilities */}
          <div className="nav-links-container" style={{ display: 'flex', gap: '30px' }}>
            <a href="#properties" className="nav-link" style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '0.22em' }}>[ PROPERTIES ]</a>
            <a href="#about" className="nav-link" style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '0.22em' }}>[ ABOUT ]</a>
            <a href="#contact" className="nav-link" style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '0.22em' }}>[ CONTACT ]</a>
          </div>
        </nav>

        {/* SIDE TICK RULERS */}
        <div className="side-ruler" style={{
          position: 'absolute',
          left: '40px',
          top: '55%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '9px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            color: 'rgba(255, 255, 255, 0.45)',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            margin: '20px 0',
            whiteSpace: 'nowrap',
          }}>
            RESIDENTIAL &middot; COMMERCIAL &middot; WATERFRONT &middot; PENTHOUSES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Array.from({ length: 13 }).map((_, i) => (
              <div
                key={`left-tick-${i}`}
                style={{
                  width: i % 2 === 0 ? '24px' : '12px',
                  height: '1px',
                  backgroundColor: 'rgba(255, 255, 255, 0.18)',
                }}
              />
            ))}
          </div>
        </div>

        <div className="side-ruler" style={{
          position: 'absolute',
          right: '40px',
          top: '55%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Array.from({ length: 13 }).map((_, i) => (
              <div
                key={`right-tick-${i}`}
                style={{
                  width: i % 2 === 0 ? '24px' : '12px',
                  height: '1px',
                  backgroundColor: 'rgba(255, 255, 255, 0.18)',
                }}
              />
            ))}
          </div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '9px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            color: 'rgba(255, 255, 255, 0.45)',
            writingMode: 'vertical-rl',
            margin: '20px 0',
            whiteSpace: 'nowrap',
          }}>
            RESIDENTIAL &middot; COMMERCIAL &middot; WATERFRONT &middot; PENTHOUSES
          </div>
        </div>

        {/* CENTERED HERO CONTENT */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 10,
          width: '100%',
          maxWidth: '800px',
          padding: '0 20px',
        }}>
          {/* Eyebrow */}
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.35em',
            color: '#c9a96e',
            marginBottom: '15px',
            textTransform: 'uppercase',
            opacity: loading ? 0 : 1,
            transform: loading ? 'translateY(10px)' : 'translateY(0)',
            transition: 'opacity 0.8s ease 0.8s, transform 0.8s ease 0.8s',
          }}>
            — PREMIER PROPERTIES
          </div>

          {/* Main Headline with rollups (H1 for SEO) */}
          <h1 style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(40px, 7vw, 92px)',
            color: '#ffffff',
            lineHeight: '1.2',
            letterSpacing: '-0.03em',
            margin: '0 0 25px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            {/* Line 1 */}
            <span style={{ display: 'block', overflow: 'hidden', height: '1.1em' }}>
              <span style={{
                display: 'block',
                transform: loading ? 'translate3d(0, 110%, 0)' : 'translate3d(0, 0, 0)',
                transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.9s',
              }}>
                LIVE AT
              </span>
            </span>

            {/* Line 2 */}
            <span style={{ display: 'block', overflow: 'hidden', height: '1.15em', position: 'relative', paddingBottom: '10px' }}>
              <span style={{
                display: 'block',
                color: '#c9a96e',
                transform: loading ? 'translate3d(0, 110%, 0)' : 'translate3d(0, 0, 0)',
                transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 1.1s',
              }}>
                ALTITUDE
              </span>
              {/* Golden Underline */}
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: '10%',
                width: loading ? '0%' : '80%',
                height: '1.5px',
                backgroundColor: '#c9a96e',
                transition: 'width 1.5s cubic-bezier(0.85, 0, 0.15, 1) 1.3s',
              }} />
            </span>
          </h1>

          {/* Sub-headline (Cinematic crossfade of curated captions) */}
          <div style={{
            fontFamily: "'Georgia', serif",
            fontStyle: 'italic',
            fontSize: '18px',
            color: '#e8d5b7',
            letterSpacing: '0.05em',
            margin: '0 0 35px 0',
            opacity: loading ? 0 : 1,
            transform: loading ? 'translateY(15px)' : 'translateY(0)',
            transition: 'opacity 1s ease 1.5s, transform 1s ease 1.5s',
            minHeight: '28px',
            position: 'relative',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}>
            {captions.map((cap, idx) => {
              const isActive = idx === captionIndex;
              return (
                <span
                  key={idx}
                  style={{
                    position: isActive ? 'relative' : 'absolute',
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'translate3d(0, 0, 0)' : 'translate3d(0, 8px, 0)',
                    transition: 'opacity 1.0s ease-in-out, transform 1.0s cubic-bezier(0.16, 1, 0.3, 1)',
                    whiteSpace: 'nowrap',
                    pointerEvents: isActive ? 'auto' : 'none',
                  }}
                >
                  {cap}
                </span>
              );
            })}
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: loading ? 0 : 1,
            transform: loading ? 'translateY(15px)' : 'translateY(0)',
            transition: 'opacity 1s ease 1.7s, transform 1s ease 1.7s',
          }}>
            <a href="#properties" className="hero-primary-btn" style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              backgroundColor: '#c9a96e',
              color: '#1a1614',
              padding: '16px 32px',
              borderRadius: '2px',
              border: '1px solid #c9a96e',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              display: 'inline-block',
            }}>
              EXPLORE PORTFOLIO
            </a>
            <a href="#contact" className="hero-secondary-btn" style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              backgroundColor: 'transparent',
              color: '#ffffff',
              padding: '16px 32px',
              borderRadius: '2px',
              border: '1px solid rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              display: 'inline-block',
              textAlign: 'center',
            }}>
              SCHEDULE PRIVATE TOUR
            </a>
          </div>
        </div>

        {/* HERO SLIDESHOW CONTROLLER & CONTROLS */}
        <div style={{
          position: 'absolute',
          right: '80px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          zIndex: 10,
          opacity: loading ? 0 : 1,
          transition: 'opacity 1s ease 1.5s',
        }} className="hero-slideshow-ctrl">
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            color: '#c9a96e',
            letterSpacing: '0.1em',
            writingMode: 'vertical-rl',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            {`0${heroIndex + 1} / 04`}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleHeroDotClick(idx)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: idx === heroIndex ? '#c9a96e' : 'rgba(255, 255, 255, 0.4)',
                  transform: idx === heroIndex ? 'scale(1.3)' : 'scale(1)',
                  transition: 'background-color 0.3s ease, transform 0.3s ease',
                  cursor: 'pointer',
                  border: 'none',
                  padding: 0,
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Scroll line indicator */}
        <div style={{
          position: 'absolute',
          bottom: '25px',
          left: '50%',
          transform: 'translateX(-50%)',
          height: '50px',
          width: '1px',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          overflow: 'hidden',
          zIndex: 10,
          opacity: loading ? 0 : 1,
          transition: 'opacity 1s ease 2s',
        }} className="hero-scroll-indicator">
          <div className="scroll-line-animated" style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#c9a96e',
            transformOrigin: 'top',
          }} />
        </div>

        {/* Bottom Stats Bar */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1200px',
          padding: '0 60px',
          zIndex: 10,
          opacity: loading ? 0 : 1,
          transform: loading ? 'translate(-50%, 15px)' : 'translate(-50%, 0)',
          transition: 'opacity 1s ease 1.9s, transform 1s ease 1.9s',
        }} className="hero-stats-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '24px', fontWeight: 900, color: '#c9a96e' }}>847+</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>HOMES PLACED</span>
            </div>
            <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '24px', fontWeight: 900, color: '#c9a96e' }}>3</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>GLOBAL CITIES</span>
            </div>
            <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '24px', fontWeight: 900, color: '#c9a96e' }}>14</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>YEARS OF INTENTION</span>
            </div>
          </div>
        </div>

      </section>

      {/* 
        ====================================================
        SECTION 2 — SELECTED PROPERTIES (Charcoal Dark)
        ====================================================
      */}
      <section id="properties" ref={section2Ref} style={section2ContainerStyle}>
        
        {/* Organic Section Wipe Transition (S1 -> S2) */}
        <div className="section-wipe" style={{
          position: 'absolute',
          top: '-60px',
          left: 0,
          width: '100%',
          height: '120px',
          backgroundColor: '#f5f1eb',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          zIndex: 3,
        }} />

        {/* Listings Midpoint Ripple Ring (Moment 2) */}
        {showRipple && (
          <div className="ripple-ring" />
        )}

        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 4 }}>
          
          {/* Parallax Wrapper for Section Heading */}
          <div style={{ width: '100%', paddingBottom: '10px' }}>
            <div style={{ transform: 'translate3d(0, calc(var(--scroll-y) * var(--parallax-factor-s2-head)), 0)' }}>
              <SplitText
                text="SELECTED PROPERTIES"
                tag="h2"
                className="section2-title"
                style={section2HeadingStyle}
                data-reveal="letter-split"
              />
            </div>
          </div>
          
          <span className="section2-subtitle" style={section2SubLabelStyle} data-reveal="fade-up">
            EST. 2009 &middot; 847 HOMES PLACED
          </span>

          <div className="section2-grid" style={gridStyle} data-stagger="120">
            {listings.map((item, idx) => (
              <PropertyCard
                key={`listing-${item.id}`}
                item={item}
                idx={idx}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 
        ====================================================
        SECTION 3 — BRAND PHILOSOPHY (Travertine Light)
        ====================================================
      */}
      <section id="about" ref={section3Ref} style={{
        backgroundColor: '#f5f1eb',
        padding: '16vh 10vw 14vh 10vw',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}>
        
        {/* Organic Section Wipe Transition (S2 -> S3) */}
        <div className="section-wipe" style={{
          position: 'absolute',
          top: '-60px',
          left: 0,
          width: '100%',
          height: '120px',
          backgroundColor: '#1a1614',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          zIndex: 3,
        }} />

        <div className="section3-grid" style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '80px',
          width: '100%',
          position: 'relative',
          zIndex: 4,
        }}>
          
          {/* Left Column (Reveal Slide-in) */}
          <div className="philosophy-left" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }} data-reveal="fade-left">
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              color: '#c9a96e',
              marginBottom: '20px',
            }}>
              OUR PHILOSOPHY
            </span>
            <SplitText
              text="We believe the finest homes are not found. They are recognised."
              tag="h2"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(32px, 5vw, 64px)',
                color: '#1a1614',
                lineHeight: '1.2',
                letterSpacing: '-0.03em',
                marginBottom: '30px',
                textAlign: 'left',
              }}
              data-reveal="letter-split"
            />
            <p style={{
              fontFamily: "'Georgia', serif",
              fontSize: '16px',
              lineHeight: '1.7',
              color: '#1a1614',
              opacity: 0.8,
              marginBottom: '35px',
              textAlign: 'left',
              maxWidth: '520px',
            }} data-reveal="fade-up">
              ÂLTO Estates operates at the intersection of architectural intelligence and human intuition. Every mandate begins with listening. Every placement ends with belonging.
            </p>
                        <button className="dark-pill" style={{
              padding: '14px 35px',
              borderRadius: '50px',
              fontSize: '11px',
              fontWeight: 900,
              letterSpacing: '0.22em',
            }} data-reveal="fade-up">
              &rarr; OUR STORY
            </button>

            {/* Editorial Luxury Image */}
            <div 
              style={{
                width: '100%',
                marginTop: '45px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '4px',
                border: '1px solid rgba(201, 169, 110, 0.2)',
                padding: '8px',
                backgroundColor: '#ede8df',
              }}
              data-reveal="fade-up"
            >
              <div style={{ position: 'relative', overflow: 'hidden', width: '100%', aspectRatio: '21/9' }}>
                <img 
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
                  alt="Minimalist Travertine Residence"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.8s ease, filter 0.8s ease',
                    filter: 'grayscale(0.3) contrast(1.05)',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.04)';
                    e.target.style.filter = 'grayscale(0) contrast(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.filter = 'grayscale(0.3) contrast(1.05)';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column (Counter stats / Parallax Counter-scroll) */}
          <div style={{ width: '100%' }}>
            <div style={{
              transform: 'translate3d(0, calc(var(--scroll-y) * var(--parallax-factor-s3-right)), 0)',
              ...statsContainerStyle
            }} data-stagger="150">
              
              {/* Stat 1 */}
              <div id="stat-1" className="stat-item" style={statItemStyle} data-reveal="fade-up">
                <div style={statNumberStyle}>
                  <span className="stat-num-value">0</span>
                </div>
                <div style={statLabelStyle}>HOMES PLACED</div>
              </div>

              {/* Stat 2 */}
              <div id="stat-2" className="stat-item" style={statItemStyle} data-reveal="fade-up">
                <div style={statNumberStyle}>
                  <span className="stat-num-value">0</span>
                </div>
                <div style={statLabelStyle}>GLOBAL CITIES</div>
              </div>

              {/* Stat 3 */}
              <div id="stat-3" className="stat-item" style={statItemStyle} data-reveal="fade-up">
                <div style={statNumberStyle}>
                  <span className="stat-num-value">0</span>
                </div>
                <div style={statLabelStyle}>YEARS OF INTENTION</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 
        ====================================================
        SECTION 4 — PROCESS STRIP (Charcoal Dark)
        ====================================================
      */}
      <section id="process-section" style={{
        backgroundColor: '#1a1614',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}>
        
        {/* Organic Section Wipe Transition (S3 -> S4) */}
        <div className="section-wipe" style={{
          position: 'absolute',
          top: '-60px',
          left: 0,
          width: '100%',
          height: '120px',
          backgroundColor: '#f5f1eb',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          zIndex: 3,
        }} />

        {/* Gold Horizontal Scan Line */}
        <div className="scan-line" />

        <div className="section4-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          width: '100%',
          position: 'relative',
          zIndex: 4,
          paddingTop: '60px'
        }}>
          {processSteps.map((step, idx) => (
            <div key={`step-${idx}`} className="process-step">
              <div className="process-step-inner">
                {/* Roman Numeral */}
                <div style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: '28px',
                  fontStyle: 'italic',
                  color: '#c9a96e',
                  marginBottom: '18px',
                }}>
                  {step.roman}
                </div>
                {/* Title */}
                <h3 style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 900,
                  fontSize: '14px',
                  letterSpacing: '0.2em',
                  color: '#ffffff',
                  marginBottom: '10px',
                }}>
                  {step.title}
                </h3>
                {/* Description */}
                <p style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: '#d4cabc',
                  opacity: 0.7,
                }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

            {/* 
        ====================================================
        SECTION 5 — INTERACTIVE REVIEWS (Travertine Light)
        ====================================================
      */}
      <section 
        id="reviews"
        onMouseEnter={() => setReviewsHovered(true)}
        onMouseLeave={() => setReviewsHovered(false)}
        style={{
          backgroundColor: '#f5f1eb',
          padding: '16vh 10vw',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {/* Organic Section Wipe Transition (S4 -> S5) */}
        <div className="section-wipe" style={{
          position: 'absolute',
          top: '-60px',
          left: 0,
          width: '100%',
          height: '120px',
          backgroundColor: '#1a1614',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          zIndex: 3,
          pointerEvents: 'none',
        }} />

        {/* Large Parallax Quote Mark Background */}
        <div style={{ overflow: 'hidden', position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', width: '100%', height: '35vh', zIndex: 1, pointerEvents: 'none' }}>
          <div style={{
            fontFamily: "'Georgia', serif",
            fontSize: '22vw',
            fontWeight: 900,
            color: '#c9a96e',
            opacity: 0.06,
            lineHeight: 1,
            textAlign: 'center',
            transform: 'translate3d(0, calc(var(--scroll-y) * var(--parallax-factor-s5-quote)), 0)',
            transition: 'opacity 1.6s ease',
          }} data-reveal="fade">
            &ldquo;
          </div>
        </div>

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.25fr 0.75fr',
          gap: '80px',
          width: '100%',
          position: 'relative',
          zIndex: 4,
        }} className="section2-grid">
          
          {/* Left Column - Large Quote with 1-second transitions */}
          <div style={{ position: 'relative', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              color: '#c9a96e',
              marginBottom: '20px',
              display: 'block',
              textAlign: 'left',
            }} data-reveal="fade-up">
              CLIENT TESTIMONIALS
            </span>
            
            <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '180px' }}>
              {reviews.map((rev, idx) => {
                const isActive = idx === activeReview;
                return (
                  <div
                    key={rev.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translate3d(0, 0, 0)' : 'translate3d(0, 15px, 0)',
                      transition: 'opacity 1.0s ease-in-out, transform 1.0s cubic-bezier(0.16, 1, 0.3, 1)',
                      pointerEvents: isActive ? 'auto' : 'none',
                    }}
                  >
                    <blockquote style={{
                      fontFamily: "'Georgia', serif",
                      fontSize: '28px',
                      fontStyle: 'italic',
                      lineHeight: '1.5',
                      color: '#1a1614',
                      marginBottom: '25px',
                      textAlign: 'left',
                      margin: '0 0 25px 0',
                    }}>
                      &ldquo;{rev.quote}&rdquo;
                    </blockquote>
                    <cite style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.22em',
                      color: '#c9a96e',
                      display: 'block',
                      fontStyle: 'normal',
                      textAlign: 'left',
                    }}>
                      {rev.author} &mdash; <span style={{ color: '#1a1614', opacity: 0.5 }}>{rev.details}</span>
                    </cite>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Client Selectors List */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }} data-reveal="fade-left">
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              color: 'rgba(26, 22, 20, 0.4)',
              marginBottom: '10px',
              display: 'block',
              textAlign: 'left',
            }}>
              SELECT MANDATE INQUIRY
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              {reviews.map((rev, idx) => {
                const isActive = idx === activeReview;
                return (
                  <button
                    key={rev.id}
                    onClick={() => handleReviewSelect(idx)}
                    className="review-selector-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px 0',
                      borderBottom: '1px solid rgba(26,22,20,0.1)',
                      width: '100%',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '11px',
                      fontWeight: 700,
                      color: isActive ? '#c9a96e' : 'rgba(26,22,20,0.4)',
                      transition: 'color 0.3s ease',
                    }}>
                      0{idx + 1}
                    </span>
                    <span style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '12px',
                      fontWeight: 700,
                      color: isActive ? '#1a1614' : 'rgba(26,22,20,0.4)',
                      letterSpacing: '0.05em',
                      transition: 'color 0.3s ease, transform 0.3s ease',
                      transform: isActive ? 'translateX(6px)' : 'translateX(0)',
                    }}>
                      {rev.author.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

            {/* 
        ====================================================
        SECTION 6 — CONTACT & GOOGLE MAPS (Charcoal Dark)
        ====================================================
      */}
      <section id="contact" style={{
        backgroundColor: '#1a1614',
        padding: '16vh 10vw 14vh 10vw',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Organic Section Wipe Transition (S5 -> S6) */}
        <div className="section-wipe" style={{
          position: 'absolute',
          top: '-60px',
          left: 0,
          width: '100%',
          height: '120px',
          backgroundColor: '#1a1614',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          zIndex: 3,
          pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '80px',
          width: '100%',
          position: 'relative',
          zIndex: 4,
        }} className="section2-grid">
          
          {/* Left Column - Contact Form */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} data-reveal="fade-up">
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              color: '#c9a96e',
              marginBottom: '20px',
            }}>
              INQUIRIES & MANDATES
            </span>
            <h2 style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(28px, 4vw, 52px)',
              color: '#ffffff',
              lineHeight: '1.2',
              letterSpacing: '-0.03em',
              marginBottom: '40px',
              textAlign: 'left',
            }}>
              Let us place you inside your future.
            </h2>

            {formSubmitted ? (
              <div style={{
                border: '1px solid #c9a96e',
                padding: '40px',
                width: '100%',
                backgroundColor: 'rgba(201, 169, 110, 0.05)',
                textAlign: 'left',
              }} data-reveal="scale-up">
                <span style={{ fontSize: '28px', color: '#c9a96e', display: 'block', marginBottom: '15px' }}>◎</span>
                <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '18px', color: '#ffffff', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Mandate Received
                </h3>
                <p style={{ fontFamily: "'Georgia', serif", fontSize: '15px', fontStyle: 'italic', color: '#e8d5b7', lineHeight: '1.6' }}>
                  Our private client advisors will review your credentials and contact you within one business day to discuss your architectural requirements.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '30px' }} data-stagger="80">
                <div style={{ display: 'flex', gap: '20px', width: '100%' }} className="section2-grid">
                  <div style={{ flex: 1, position: 'relative' }} data-reveal="fade-up">
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      required
                      placeholder="NAME"
                      aria-label="Full Name"
                      autoComplete="name"
                      value={formFields.name}
                      onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                      className="contact-input"
                    />
                  </div>
                  <div style={{ flex: 1, position: 'relative' }} data-reveal="fade-up">
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      placeholder="EMAIL ADDRESS"
                      aria-label="Email Address"
                      autoComplete="email"
                      value={formFields.email}
                      onChange={(e) => setFormFields({ ...formFields, email: e.target.value })}
                      className="contact-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', width: '100%' }} className="section2-grid">
                  <div style={{ flex: 1, position: 'relative' }} data-reveal="fade-up">
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      placeholder="TELEPHONE"
                      aria-label="Telephone Number"
                      autoComplete="tel"
                      value={formFields.phone}
                      onChange={(e) => setFormFields({ ...formFields, phone: e.target.value })}
                      className="contact-input"
                    />
                  </div>
                  <div style={{ flex: 1, position: 'relative' }} data-reveal="fade-up">
                    <select
                      id="contact-interest"
                      name="interest"
                      aria-label="Area of Interest"
                      value={formFields.interest}
                      onChange={(e) => setFormFields({ ...formFields, interest: e.target.value })}
                      className="contact-input contact-select"
                    >
                      <option value="General Enquiry">GENERAL ENQUIRY</option>
                      <option value="Bandra Residence, Mumbai">THE BANDRA RESIDENCE, MUMBAI</option>
                      <option value="Palm Crescent, Dubai">PALM CRESCENT, DUBAI</option>
                      <option value="Kensington Court, London">KENSINGTON COURT, LONDON</option>
                    </select>
                  </div>
                </div>

                <div style={{ position: 'relative', width: '100%' }} data-reveal="fade-up">
                  <textarea
                    id="contact-message"
                    name="message"
                    rows="4"
                    required
                    placeholder="TELL US ABOUT YOUR ARCHITECTURAL ASPIRATIONS"
                    aria-label="Message / Architectural Aspirations"
                    value={formFields.message}
                    onChange={(e) => setFormFields({ ...formFields, message: e.target.value })}
                    className="contact-input"
                    style={{ resize: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  className="contact-submit-btn"
                  style={{
                    alignSelf: 'flex-start',
                    padding: '16px 40px',
                    backgroundColor: '#c9a96e',
                    color: '#1a1614',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    border: '1px solid #c9a96e',
                    borderRadius: '2px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  data-reveal="fade-up"
                >
                  SEND MANDATE
                </button>
              </form>
            )}
          </div>

          {/* Right Column - Map Frame */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }} data-reveal="fade-left">
            <div style={{
              width: '100%',
              aspectRatio: '4/3',
              border: '1px solid rgba(201, 169, 110, 0.3)',
              padding: '10px',
              backgroundColor: '#110e0d',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                top: '5px',
                left: '5px',
                right: '5px',
                bottom: '5px',
                border: '1px solid rgba(201, 169, 110, 0.1)',
                pointerEvents: 'none',
                zIndex: 1,
              }} />
              
              <iframe
                title="Alto Estates Mumbai Office"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.8358245149303!2d72.86241387610667!3d19.071018552163776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e6df388151%3A0xe5a3c94d0c915f07!2sBandra%20Kurla%20Complex%2C%20Bandra%20East%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1719400000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: 'grayscale(1) invert(0.9) contrast(1.15)',
                  position: 'relative',
                  zIndex: 0,
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div style={{
              marginTop: '15px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.15em',
              color: 'rgba(255, 255, 255, 0.5)',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}>
              <span>OFFICE / BKC, MUMBAI</span>
              <span style={{ color: '#c9a96e' }}>MUMBAI &middot; DUBAI &middot; LONDON</span>
            </div>
          </div>

        </div>
      </section>

      {/* 
        ====================================================
        SECTION 7 — FOOTER (Charcoal Dark)
        ====================================================
      */}
      <footer id="contact-footer" style={{
        backgroundColor: '#1a1614',
        padding: '14vh 10vw 4vh 10vw',
        color: '#ffffff',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}>
        
        {/* Organic Section Wipe Transition (S6 -> S7) */}
        <div className="section-wipe" style={{
          position: 'absolute',
          top: '-60px',
          left: 0,
          width: '100%',
          height: '120px',
          backgroundColor: '#1a1614',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          zIndex: 6, // Above curtain cover
        }} />
        
        {/* 3 Column Structure */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr 1fr',
          gap: '60px',
          width: '100%',
          paddingBottom: '8vh',
          position: 'relative',
          zIndex: 4,
        }} className="section2-grid">
          
          {/* Column 1 (Brand info + Address) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', transitionDelay: '0.8s' }} data-reveal="fade-up">
            {/* Parallax Logo */}
            <div style={{ width: '100%' }}>
              <div style={{ transform: 'translate3d(0, calc(var(--scroll-y) * var(--parallax-factor-footer-logo)), 0)' }}>
                <div style={{ fontSize: '20px', letterSpacing: '0.12em', color: '#ffffff', marginBottom: '15px' }}>
                  <span style={{ fontWeight: 900 }}>ÂLTO</span>
                  <span style={{ fontFamily: "'Georgia', serif", fontStyle: 'italic', fontWeight: 300 }}> ESTATES</span>
                </div>
              </div>
            </div>
            <p style={{
              fontFamily: "'Georgia', serif",
              fontStyle: 'italic',
              fontSize: '14px',
              color: '#d4cabc',
              opacity: 0.6,
              marginBottom: '25px',
            }}>
              Living at altitude.
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px',
              lineHeight: '1.8',
              color: '#d4cabc',
              opacity: 0.7,
              textAlign: 'left',
            }}>
              Bandra Kurla Complex, Mumbai &middot; 400051
            </p>
          </div>

          {/* Column 2 (Directory navigation links) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', transitionDelay: '0.9s' }} data-reveal="fade-up">
            <h4 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: '#ffffff',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              NAVIGATION
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
              <a href="#properties" className="footer-link" style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#c9a96e' }}>Properties</a>
              <a href="#about" className="footer-link" style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#c9a96e' }}>About Us</a>
              <a href="#about" className="footer-link" style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#c9a96e' }}>Our Process</a>
              <a href="#contact" className="footer-link" style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#c9a96e' }}>Get In Touch</a>
            </div>
          </div>

          {/* Column 3 (Contact & Social media) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', transitionDelay: '1.0s' }} data-reveal="fade-up">
            <h4 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: '#ffffff',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              GET IN TOUCH
            </h4>
            <a href="mailto:hello@altoestates.com" style={{
              fontFamily: "'Georgia', serif",
              fontSize: '18px',
              fontStyle: 'italic',
              color: '#ffffff',
              marginBottom: '10px',
              transition: 'color 0.3s ease',
            }} onMouseOver={(e) => e.target.style.color = '#c9a96e'} onMouseOut={(e) => e.target.style.color = '#ffffff'}>
              hello@altoestates.com
            </a>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px',
              color: '#d4cabc',
              opacity: 0.8,
              marginBottom: '25px',
            }}>
              +91 22 6800 0000
            </span>

            {/* Social Text links */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                color: '#c9a96e',
                transition: 'color 0.3s ease',
              }} onMouseOver={(e) => e.target.style.color = '#ffffff'} onMouseOut={(e) => e.target.style.color = '#c9a96e'}>
                INSTAGRAM ↗
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                color: '#c9a96e',
                transition: 'color 0.3s ease',
              }} onMouseOver={(e) => e.target.style.color = '#ffffff'} onMouseOut={(e) => e.target.style.color = '#c9a96e'}>
                LINKEDIN ↗
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.35)',
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '0.05em',
          position: 'relative',
          zIndex: 4,
        }}>
          <div>
            © 2026 ÂLTO ESTATES. All rights reserved.
          </div>
          <div>
            Built with intention.
          </div>
        </div>

      </footer>
    </div>
  );
}
