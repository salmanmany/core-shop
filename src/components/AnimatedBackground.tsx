import { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

interface Cloud {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  opacity: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const starsRef = useRef<Star[]>([]);
  const cloudsRef = useRef<Cloud[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initElements();
    };

    const initElements = () => {
      // Initialize stars
      starsRef.current = [];
      for (let i = 0; i < 150; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random(),
          speed: Math.random() * 0.02 + 0.005,
        });
      }

      // Initialize clouds
      cloudsRef.current = [];
      for (let i = 0; i < 8; i++) {
        cloudsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height * 0.6),
          width: Math.random() * 200 + 100,
          height: Math.random() * 60 + 30,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.3 + 0.1,
        });
      }
    };

    const drawStar = (star: Star) => {
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
    };

    const drawCloud = (cloud: Cloud) => {
      if (!ctx) return;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;
      
      // Draw fluffy cloud shape
      const cx = cloud.x;
      const cy = cloud.y;
      const w = cloud.width;
      const h = cloud.height;
      
      ctx.ellipse(cx, cy, w * 0.5, h * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.ellipse(cx - w * 0.25, cy + h * 0.1, w * 0.3, h * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.ellipse(cx + w * 0.25, cy + h * 0.1, w * 0.35, h * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (theme === 'dark') {
        // Animate stars
        starsRef.current.forEach(star => {
          // Twinkle effect
          star.opacity += star.speed;
          if (star.opacity >= 1 || star.opacity <= 0) {
            star.speed = -star.speed;
          }
          drawStar(star);
        });
      } else {
        // Animate clouds
        cloudsRef.current.forEach(cloud => {
          cloud.x += cloud.speed;
          if (cloud.x > canvas.width + cloud.width) {
            cloud.x = -cloud.width;
          }
          drawCloud(cloud);
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
