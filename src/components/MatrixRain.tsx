import React, { useRef, useEffect } from 'react';

interface MatrixRainProps {
  modalOpen?: boolean;
}

const MatrixRain: React.FC<MatrixRainProps> = ({ modalOpen = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- Configuration ---
    const fontSize = 16;
    const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン01';
    
    let width: number;
    let height: number;
    let columns: number;
    let drops: number[] = [];
    let lastTime = 0;
    
    const initializeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      
      drops = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * height / fontSize);
      }
    };
    
    initializeCanvas();
    
    // --- Optimized Animation Loop with requestAnimationFrame ---
    const animate = (currentTime: number) => {
      // Skip frames to reduce intensity when modal is open
      const frameSkip = modalOpen ? 3 : 1;
      if (currentTime - lastTime < (1000 / 60) * frameSkip) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = currentTime;

      // Dual-layer rendering: Fade layer first
      const fadeOpacity = modalOpen ? 0.15 : 0.2;
      ctx.fillStyle = `rgba(13, 17, 23, ${fadeOpacity})`; 
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        const y = drops[i] * fontSize;
        
        // Only draw each character once, with proper trail effect
        if (y <= height) {
          // Determine if this is the leading character (bottom of column)
          const isLeading = y === Math.max(...drops.map(d => d * fontSize));
          
          if (isLeading) {
            // Bright leading character
            ctx.fillStyle = modalOpen ? '#70ab6c' : '#c8ffc8';
          } else {
            // Standard trail character with reduced opacity
            const trailOpacity = modalOpen ? 0.4 : 0.7;
            ctx.fillStyle = `rgba(112, 171, 108, ${trailOpacity})`;
          }
          
          ctx.fillText(text, i * fontSize, y);
        }

        // Reset column when it goes off screen
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start the animation loop
    animationRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      initializeCanvas();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };

  }, [modalOpen]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: 'none',
        opacity: modalOpen ? 0.5 : 1,
      }}
    />
  );
};

export default MatrixRain; 