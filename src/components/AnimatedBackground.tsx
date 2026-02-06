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

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: 'diamond' | 'emerald' | 'gold' | 'redstone';
  pulseOffset: number;
}

const PARTICLE_COLORS = {
  diamond: { main: '#4DD0E1', glow: '#00BCD4', highlight: '#B2EBF2' },
  emerald: { main: '#4CAF50', glow: '#2E7D32', highlight: '#A5D6A7' },
  gold: { main: '#FFD700', glow: '#FFA000', highlight: '#FFECB3' },
  redstone: { main: '#F44336', glow: '#C62828', highlight: '#FFCDD2' },
};

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const starsRef = useRef<Star[]>([]);
  const cloudsRef = useRef<Cloud[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

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

      // Initialize Minecraft particles
      particlesRef.current = [];
      const types: Particle['type'][] = ['diamond', 'emerald', 'gold', 'redstone'];
      for (let i = 0; i < 20; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 12 + 8,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: -Math.random() * 0.3 - 0.1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          opacity: Math.random() * 0.4 + 0.3,
          type: types[Math.floor(Math.random() * types.length)],
          pulseOffset: Math.random() * Math.PI * 2,
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

    const drawDiamond = (x: number, y: number, size: number, rotation: number, colors: typeof PARTICLE_COLORS.diamond, opacity: number, pulse: number) => {
      if (!ctx) return;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      const glowSize = size * (1.2 + pulse * 0.1);
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
      gradient.addColorStop(0, `${colors.glow}${Math.floor(opacity * 60).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(-glowSize, -glowSize, glowSize * 2, glowSize * 2);
      
      // Diamond shape (rhombus)
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.6, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.6, 0);
      ctx.closePath();
      
      ctx.fillStyle = `${colors.main}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.fill();
      
      // Highlight
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.7);
      ctx.lineTo(size * 0.3, -size * 0.2);
      ctx.lineTo(0, size * 0.3);
      ctx.lineTo(-size * 0.15, -size * 0.2);
      ctx.closePath();
      ctx.fillStyle = `${colors.highlight}${Math.floor(opacity * 150).toString(16).padStart(2, '0')}`;
      ctx.fill();
      
      ctx.restore();
    };

    const drawEmerald = (x: number, y: number, size: number, rotation: number, colors: typeof PARTICLE_COLORS.emerald, opacity: number, pulse: number) => {
      if (!ctx) return;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      const glowSize = size * (1.2 + pulse * 0.1);
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
      gradient.addColorStop(0, `${colors.glow}${Math.floor(opacity * 60).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(-glowSize, -glowSize, glowSize * 2, glowSize * 2);
      
      // Hexagonal emerald
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 - Math.PI / 2;
        const px = Math.cos(angle) * size * 0.7;
        const py = Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      
      ctx.fillStyle = `${colors.main}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.fill();
      
      // Highlight
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.6);
      ctx.lineTo(size * 0.3, -size * 0.2);
      ctx.lineTo(size * 0.2, size * 0.4);
      ctx.lineTo(-size * 0.1, size * 0.2);
      ctx.lineTo(-size * 0.2, -size * 0.3);
      ctx.closePath();
      ctx.fillStyle = `${colors.highlight}${Math.floor(opacity * 150).toString(16).padStart(2, '0')}`;
      ctx.fill();
      
      ctx.restore();
    };

    const drawGoldNugget = (x: number, y: number, size: number, rotation: number, colors: typeof PARTICLE_COLORS.gold, opacity: number, pulse: number) => {
      if (!ctx) return;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      const glowSize = size * (1.3 + pulse * 0.15);
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
      gradient.addColorStop(0, `${colors.glow}${Math.floor(opacity * 80).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(-glowSize, -glowSize, glowSize * 2, glowSize * 2);
      
      // Irregular nugget shape
      ctx.beginPath();
      ctx.moveTo(-size * 0.4, -size * 0.6);
      ctx.lineTo(size * 0.5, -size * 0.5);
      ctx.lineTo(size * 0.6, size * 0.3);
      ctx.lineTo(size * 0.1, size * 0.7);
      ctx.lineTo(-size * 0.5, size * 0.4);
      ctx.lineTo(-size * 0.6, -size * 0.2);
      ctx.closePath();
      
      ctx.fillStyle = `${colors.main}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.fill();
      
      // Highlight
      ctx.beginPath();
      ctx.arc(-size * 0.1, -size * 0.2, size * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = `${colors.highlight}${Math.floor(opacity * 180).toString(16).padStart(2, '0')}`;
      ctx.fill();
      
      ctx.restore();
    };

    const drawRedstone = (x: number, y: number, size: number, rotation: number, colors: typeof PARTICLE_COLORS.redstone, opacity: number, pulse: number) => {
      if (!ctx) return;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      const glowSize = size * (1.4 + pulse * 0.2);
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
      gradient.addColorStop(0, `${colors.glow}${Math.floor(opacity * 100).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(-glowSize, -glowSize, glowSize * 2, glowSize * 2);
      
      // Pixelated dust shape
      const pixelSize = size / 3;
      ctx.fillStyle = `${colors.main}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
      
      // Cross pattern
      ctx.fillRect(-pixelSize / 2, -pixelSize * 1.5, pixelSize, pixelSize * 3);
      ctx.fillRect(-pixelSize * 1.5, -pixelSize / 2, pixelSize * 3, pixelSize);
      
      // Center highlight
      ctx.fillStyle = `${colors.highlight}${Math.floor(opacity * 200).toString(16).padStart(2, '0')}`;
      ctx.fillRect(-pixelSize / 4, -pixelSize / 4, pixelSize / 2, pixelSize / 2);
      
      ctx.restore();
    };

    const drawParticle = (particle: Particle, time: number) => {
      const pulse = Math.sin(time * 0.003 + particle.pulseOffset);
      const colors = PARTICLE_COLORS[particle.type];
      
      switch (particle.type) {
        case 'diamond':
          drawDiamond(particle.x, particle.y, particle.size, particle.rotation, colors, particle.opacity, pulse);
          break;
        case 'emerald':
          drawEmerald(particle.x, particle.y, particle.size, particle.rotation, colors, particle.opacity, pulse);
          break;
        case 'gold':
          drawGoldNugget(particle.x, particle.y, particle.size, particle.rotation, colors, particle.opacity, pulse);
          break;
        case 'redstone':
          drawRedstone(particle.x, particle.y, particle.size, particle.rotation, colors, particle.opacity, pulse);
          break;
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      
      timeRef.current += 16;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (theme === 'dark') {
        // Animate stars
        starsRef.current.forEach(star => {
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

      // Animate Minecraft particles (both modes)
      particlesRef.current.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;
        
        // Wrap around screen
        if (particle.y < -particle.size * 2) {
          particle.y = canvas.height + particle.size;
          particle.x = Math.random() * canvas.width;
        }
        if (particle.x < -particle.size * 2) {
          particle.x = canvas.width + particle.size;
        }
        if (particle.x > canvas.width + particle.size * 2) {
          particle.x = -particle.size;
        }
        
        drawParticle(particle, timeRef.current);
      });

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
