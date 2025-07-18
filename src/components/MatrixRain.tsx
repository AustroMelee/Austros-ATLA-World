import React, { useRef, useEffect } from 'react';

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    
    // --- The Animation Loop ---
    const draw = () => {
      // --- CHANGE #1: Higher transparency for a cleaner background ---
      // We can use a higher value now because our leading character will be brighter.
      // This makes old trails fade out much faster. Try values between 0.2 and 0.3.
      ctx.fillStyle = 'rgba(13, 17, 23, 0.2)'; 
      ctx.fillRect(0, 0, width, height);

      // --- CHANGE #2: We will now set two different colors inside the loop ---
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        
        // --- CHANGE #3: Draw the standard green trail character first ---
        ctx.fillStyle = '#70ab6c'; // Your standard --crt-green
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // --- CHANGE #4: Draw a bright "leading" character on top ---
        // This makes the head of the drop pop, creating the iconic effect.
        ctx.fillStyle = '#c8ffc8'; // A bright, light-green/white color
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    // Use requestAnimationFrame for smoother animation
    const fps = 30;
    const frameInterval = 1000 / fps;
    let lastTime = 0;
    let animationFrameId: number;

    const render = (time: number) => {
      if (time - lastTime >= frameInterval) {
        draw();
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    const start = () => {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const stop = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };

    start();

    const handleResize = () => {
      initializeCanvas();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stop();
      } else {
        start();
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stop();
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default MatrixRain; 