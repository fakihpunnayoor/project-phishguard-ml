import React, { useEffect, useRef, useState } from 'react';

export const CinematicCursor = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);

  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);
  const canvasRef = useRef(null);
  const animIdRef = useRef(null);

  // Position references with smooth lerping
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const trailPoints = useRef([]);

  useEffect(() => {
    // Only activate for devices with a fine pointer (Desktop / mouse, not touch devices)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const checkPointer = () => {
      setIsSupported(mediaQuery.matches && !('ontouchstart' in window));
    };

    checkPointer();
    mediaQuery.addEventListener('change', checkPointer);

    return () => mediaQuery.removeEventListener('change', checkPointer);
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    // Handle mouse movement
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check if hovering over clickable element
      const target = e.target;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button')
      ) {
        setIsHoveringClickable(true);
      } else {
        setIsHoveringClickable(false);
      }

      // Add to trail buffer
      trailPoints.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0,
        maxAge: 18,
        radius: 3.5
      });
      if (trailPoints.current.length > 25) {
        trailPoints.current.shift();
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Canvas setup for high-performance trail rendering
    const canvas = canvasRef.current;
    let ctx = null;
    if (canvas) {
      ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop (60 FPS lerp)
    const render = () => {
      // Smooth lerp for outer reticle ring (lerp factor: 0.16)
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.16;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.16;

      // Update center dot (instant response)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      // Update outer reticle ring
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      // Update ambient background light position
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${ringPos.current.x - 300}px, ${ringPos.current.y - 300}px, 0)`;
      }

      // Render smooth canvas motion trail
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const points = trailPoints.current;
        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          pt.age += 1;
          const alpha = Math.max(0, 1 - pt.age / pt.maxAge);
          const currentRadius = pt.radius * (1 - pt.age / (pt.maxAge * 1.5));

          if (currentRadius > 0.2 && alpha > 0.02) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, currentRadius, 0, Math.PI * 2);
            // Neon red cyber glow with diminishing opacity
            ctx.fillStyle = `rgba(255, 42, 42, ${alpha * 0.55})`;
            ctx.shadowColor = '#ff2a2a';
            ctx.shadowBlur = 8;
            ctx.fill();
          }
        }

        // Filter out expired points
        trailPoints.current = points.filter((p) => p.age < p.maxAge);
      }

      animIdRef.current = requestAnimationFrame(render);
    };

    animIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('resize', handleResize);
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
      }
    };
  }, [isSupported, isVisible]);

  if (!isSupported) return null;

  return (
    <div className={`fixed inset-0 pointer-events-none z-[9999] overflow-hidden transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* 1. Ambient Mouse-Following Cyber Glow */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(255, 42, 42, 0.08) 0%, rgba(255, 30, 56, 0.03) 45%, transparent 75%)',
          transition: 'opacity 0.2s ease-out'
        }}
      />

      {/* 2. High-Performance Canvas for Particle Trail */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none will-change-transform"
      />

      {/* 3. Smooth Outer Reticle Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -ml-4 -mt-4 w-8 h-8 rounded-full border border-red-500/80 pointer-events-none will-change-transform transition-[width,height,border-color,background-color] duration-150 flex items-center justify-center ${
          isHoveringClickable
            ? 'scale-150 border-red-400 bg-red-500/10 shadow-[0_0_16px_rgba(255,42,42,0.6)]'
            : 'scale-100 shadow-[0_0_10px_rgba(255,42,42,0.35)]'
        }`}
      >
        {/* Subtle crosshair notches */}
        <div className="absolute top-0 w-0.5 h-1 bg-red-400/80" />
        <div className="absolute bottom-0 w-0.5 h-1 bg-red-400/80" />
        <div className="absolute left-0 h-0.5 w-1 bg-red-400/80" />
        <div className="absolute right-0 h-0.5 w-1 bg-red-400/80" />
      </div>

      {/* 4. Sharp Center Core Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full pointer-events-none will-change-transform transition-transform duration-75 ${
          isHoveringClickable
            ? 'bg-white shadow-[0_0_8px_#ffffff]'
            : 'bg-red-500 shadow-[0_0_6px_#ff2a2a]'
        }`}
      />
    </div>
  );
};

export default CinematicCursor;
