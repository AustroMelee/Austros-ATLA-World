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

    const fontSize = 16;
    const charSet =
      'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const orientations = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

    interface Cell {
      char: string;
      angle: number;
      flip: boolean;
    }

    interface Stream {
      y: number;
      speed: number;
      delay: number;
    }

    const trailLength = 20;

    let width: number;
    let height: number;
    let columns: number;
    let rows: number;
    let grid: Cell[][] = [];
    let streams: Stream[][] = [];
    let lastTime = 0;

    const initGrid = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      rows = Math.floor(height / fontSize);

      grid = Array.from({ length: columns }, () =>
        Array.from({ length: rows }, () => ({
          char: charSet.charAt(Math.floor(Math.random() * charSet.length)),
          angle: orientations[Math.floor(Math.random() * orientations.length)],
          flip: Math.random() < 0.5,
        }))
      );

      streams = Array.from({ length: columns }, () => [
        {
          y: -Math.random() * rows,
          speed: 0.5 + Math.random() * 1.5,
          delay: Math.floor(Math.random() * 50),
        },
      ]);
    };

    const drawCell = (x: number, y: number, cell: Cell, color: string) => {
      ctx.save();
      ctx.translate(x + fontSize / 2, y + fontSize / 2);
      ctx.rotate(cell.angle);
      if (cell.flip) ctx.scale(-1, 1);
      ctx.fillStyle = color;
      ctx.fillText(cell.char, -fontSize / 2, -fontSize / 2);
      ctx.restore();
    };

    const updateChars = () => {
      for (let c = 0; c < columns; c += 1) {
        for (let r = 0; r < rows; r += 1) {
          if (Math.random() < 0.02) {
            grid[c][r].char = charSet.charAt(Math.floor(Math.random() * charSet.length));
          }
        }
      }
    };

    const draw = () => {
      ctx.fillStyle = modalOpen ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';

      // base dim grid
      for (let c = 0; c < columns; c += 1) {
        for (let r = 0; r < rows; r += 1) {
          drawCell(c * fontSize, r * fontSize, grid[c][r], 'rgba(112,171,108,0.15)');
        }
      }

      // streams
      for (let c = 0; c < columns; c += 1) {
        const colStreams = streams[c];
        for (let s = colStreams.length - 1; s >= 0; s -= 1) {
          const stream = colStreams[s];
          if (stream.delay > 0) {
            stream.delay -= 1;
            continue;
          }
          stream.y += stream.speed;

          for (let k = 0; k < trailLength; k += 1) {
            const row = Math.floor(stream.y) - k;
            if (row < 0 || row >= rows) continue;
            const brightness = 1 - k / trailLength;
            const color =
              k === 0
                ? modalOpen
                  ? '#c8ffc8'
                  : '#ffffff'
                : `rgba(112, 171, 108, ${brightness})`;
            drawCell(c * fontSize, row * fontSize, grid[c][row], color);
          }

          if (stream.y - trailLength > rows) {
            colStreams.splice(s, 1);
            colStreams.push({
              y: -Math.random() * rows,
              speed: 0.5 + Math.random() * 1.5,
              delay: Math.floor(Math.random() * 50),
            });
          }
        }

        if (colStreams.length < 2 && Math.random() < 0.02) {
          colStreams.push({
            y: -Math.random() * rows,
            speed: 0.5 + Math.random() * 1.5,
            delay: Math.floor(Math.random() * 50),
          });
        }
      }
    };

    const animate = (time: number) => {
      const frameSkip = modalOpen ? 3 : 1;
      if (time - lastTime > (1000 / 60) * frameSkip) {
        updateChars();
        draw();
        lastTime = time;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    initGrid();
    animationRef.current = requestAnimationFrame(animate);
    window.addEventListener('resize', initGrid);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', initGrid);
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