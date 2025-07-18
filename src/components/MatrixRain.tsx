import React, { useRef, useEffect } from 'react';

interface MatrixRainProps {
  modalOpen?: boolean;
}

const MatrixRain: React.FC<MatrixRainProps> = ({ modalOpen = false }) => {
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
      // Reduce opacity and slow down animation when modal is open
      const fadeOpacity = modalOpen ? 0.1 : 0.2;
      ctx.fillStyle = `rgba(13, 17, 23, ${fadeOpacity})`; 
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        
        // Reduce trail brightness when modal is open
        const trailOpacity = modalOpen ? 0.5 : 1;
        ctx.fillStyle = `rgba(112, 171, 108, ${trailOpacity})`; // Your standard --crt-green with reduced opacity
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reduce leading character brightness when modal is open
        ctx.fillStyle = modalOpen ? '#70ab6c' : '#c8ffc8'; // Use darker color when modal is open
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    // Slow down animation when modal is open
    const interval = modalOpen ? 100 : 33;
    const intervalId = setInterval(draw, interval);

    const handleResize = () => {
      initializeCanvas();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
    };

  }, [modalOpen]); // Add modalOpen to dependencies

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: 'none',
        opacity: modalOpen ? 0.5 : 1, // Reduce overall opacity when modal is open
      }}
    />
  );
};

export default MatrixRain; 