'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/theme-context';

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

interface Cloud {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  scale: number;
}

interface Constellation {
  stars: { x: number; y: number; vx: number; vy: number }[];
  connections: [number, number][];
  vx: number;
  vy: number;
  name: string;
  category: string;
}

export default function AnimatedBackground() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);
  const cloudsRef = useRef<Cloud[]>([]);
  const constellationsRef = useRef<Constellation[]>([]);
  const availablePatternsRef = useRef<any[]>([]);
  const usedPatternsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Check if current theme is dark (including system theme detection)
    const isDarkMode = theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createClouds = (count: number): Cloud[] => {
      return Array.from({ length: count }, () => ({
        x: Math.random() * (canvas.width + 200) - 100,
        y: Math.random() * canvas.height,
        vx: (Math.random() * 0.15 + 0.05) * (Math.random() < 0.5 ? 1 : -1),
        vy: (Math.random() - 0.5) * 0.05,
        radius: Math.random() * 80 + 40,
        opacity: Math.random() * 0.4 + 0.1,
        scale: Math.random() * 0.5 + 0.5,
      }));
    };

    const drawCloud = (cloud: Cloud) => {
      ctx.save();
      ctx.globalAlpha = cloud.opacity;
      ctx.translate(cloud.x, cloud.y);
      ctx.scale(cloud.scale, cloud.scale * 0.6);
      
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, cloud.radius);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(0.4, 'rgba(220, 230, 250, 0.7)');
      gradient.addColorStop(0.7, 'rgba(200, 220, 240, 0.4)');
      gradient.addColorStop(1, 'rgba(180, 200, 230, 0.1)');
      
      // Main cloud body
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, cloud.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Additional cloud puffs for more realistic shape
      const puffs = [
        { x: -cloud.radius * 0.5, y: -cloud.radius * 0.3, r: cloud.radius * 0.7 },
        { x: cloud.radius * 0.4, y: -cloud.radius * 0.2, r: cloud.radius * 0.8 },
        { x: -cloud.radius * 0.3, y: cloud.radius * 0.4, r: cloud.radius * 0.6 },
        { x: cloud.radius * 0.6, y: cloud.radius * 0.3, r: cloud.radius * 0.5 },
      ];
      
      puffs.forEach(puff => {
        const puffGradient = ctx.createRadialGradient(puff.x, puff.y, 0, puff.x, puff.y, puff.r);
        puffGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        puffGradient.addColorStop(0.5, 'rgba(230, 240, 255, 0.6)');
        puffGradient.addColorStop(1, 'rgba(200, 220, 240, 0.2)');
        
        ctx.fillStyle = puffGradient;
        ctx.beginPath();
        ctx.arc(puff.x, puff.y, puff.r, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.restore();
    };

    const createStars = (count: number): Star[] => {
      return Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
      }));
    };

    const createConstellations = (): Constellation[] => {
      const constellations: Constellation[] = [];
      
      // All constellation patterns (Zodiac + Seasonal)
      const constellationPatterns = [
        // === 황도 12궁 (Zodiac) ===
        // Aries (양자리)
        {
          name: 'Aries',
          category: 'zodiac',
          stars: [
            { x: 0, y: 0 },
            { x: 30, y: -5 },
            { x: 50, y: 10 }
          ],
          connections: [[0,1], [1,2]]
        },
        // Taurus (황소자리)
        {
          name: 'Taurus',
          category: 'zodiac',
          stars: [
            { x: 0, y: 0 },
            { x: 20, y: 15 },
            { x: 40, y: 25 },
            { x: 60, y: 15 },
            { x: 80, y: 30 },
            { x: 50, y: 50 }
          ],
          connections: [[0,1], [1,2], [2,3], [3,4], [2,5]]
        },
        // Gemini (쌍둥이자리)
        {
          name: 'Gemini',
          category: 'zodiac',
          stars: [
            { x: 0, y: 0 },
            { x: 15, y: 20 },
            { x: 30, y: 40 },
            { x: 50, y: 0 },
            { x: 65, y: 20 },
            { x: 80, y: 40 }
          ],
          connections: [[0,1], [1,2], [3,4], [4,5]]
        },
        // Cancer (게자리)
        {
          name: 'Cancer',
          category: 'zodiac',
          stars: [
            { x: 20, y: 0 },
            { x: 0, y: 20 },
            { x: 40, y: 20 },
            { x: 20, y: 40 }
          ],
          connections: [[1,0], [0,2], [1,3], [3,2]]
        },
        // Leo (사자자리)
        {
          name: 'Leo',
          category: 'zodiac',
          stars: [
            { x: 0, y: 0 },
            { x: 30, y: -10 },
            { x: 50, y: 10 },
            { x: 70, y: 0 },
            { x: 80, y: 20 },
            { x: 60, y: 30 }
          ],
          connections: [[0,1], [1,2], [2,3], [3,4], [4,5], [2,5]]
        },
        // Virgo (처녀자리)
        {
          name: 'Virgo',
          category: 'zodiac',
          stars: [
            { x: 0, y: 0 },
            { x: 20, y: 15 },
            { x: 40, y: 30 },
            { x: 60, y: 20 },
            { x: 80, y: 35 }
          ],
          connections: [[0,1], [1,2], [2,3], [3,4]]
        },
        // Libra (천칭자리)
        {
          name: 'Libra',
          category: 'zodiac',
          stars: [
            { x: 0, y: 20 },
            { x: 30, y: 0 },
            { x: 60, y: 20 },
            { x: 30, y: 40 }
          ],
          connections: [[0,1], [1,2], [0,3], [3,2]]
        },
        // Scorpius (전갈자리)
        {
          name: 'Scorpius',
          category: 'zodiac',
          stars: [
            { x: 0, y: 0 },
            { x: 20, y: 10 },
            { x: 40, y: 20 },
            { x: 60, y: 30 },
            { x: 80, y: 50 },
            { x: 70, y: 70 },
            { x: 50, y: 80 }
          ],
          connections: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6]]
        },
        // Sagittarius (궁수자리)
        {
          name: 'Sagittarius',
          category: 'zodiac',
          stars: [
            { x: 0, y: 40 },
            { x: 30, y: 0 },
            { x: 60, y: 20 },
            { x: 80, y: 40 },
            { x: 50, y: 60 },
            { x: 20, y: 70 }
          ],
          connections: [[0,1], [1,2], [2,3], [1,4], [4,5]]
        },
        // Capricornus (염소자리)
        {
          name: 'Capricornus',
          category: 'zodiac',
          stars: [
            { x: 0, y: 0 },
            { x: 30, y: 20 },
            { x: 60, y: 15 },
            { x: 80, y: 30 },
            { x: 50, y: 45 }
          ],
          connections: [[0,1], [1,2], [2,3], [2,4]]
        },
        // Aquarius (물병자리)
        {
          name: 'Aquarius',
          category: 'zodiac',
          stars: [
            { x: 0, y: 20 },
            { x: 25, y: 0 },
            { x: 50, y: 25 },
            { x: 75, y: 5 },
            { x: 100, y: 30 }
          ],
          connections: [[0,1], [1,2], [2,3], [3,4]]
        },
        // Pisces (물고기자리)
        {
          name: 'Pisces',
          category: 'zodiac',
          stars: [
            { x: 0, y: 0 },
            { x: 20, y: 20 },
            { x: 40, y: 30 },
            { x: 80, y: 10 },
            { x: 100, y: 30 },
            { x: 120, y: 20 }
          ],
          connections: [[0,1], [1,2], [3,4], [4,5], [2,3]]
        },

        // === 계절별 별자리 ===
        // Orion (오리온자리) - 겨울
        {
          name: 'Orion',
          category: 'seasonal',
          stars: [
            { x: 30, y: 0 },
            { x: 0, y: 20 },
            { x: 60, y: 20 },
            { x: 20, y: 40 },
            { x: 40, y: 40 },
            { x: 60, y: 40 },
            { x: 30, y: 60 }
          ],
          connections: [[0,1], [0,2], [1,3], [3,4], [4,5], [2,5], [4,6]]
        },
        // Big Dipper (북두칠성) - 봄
        {
          name: 'Big Dipper',
          category: 'seasonal',
          stars: [
            { x: 0, y: 0 },
            { x: 20, y: -10 },
            { x: 40, y: -5 },
            { x: 60, y: 0 },
            { x: 70, y: 20 },
            { x: 50, y: 30 },
            { x: 30, y: 25 }
          ],
          connections: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6]]
        },
        // Cygnus (백조자리) - 여름
        {
          name: 'Cygnus',
          category: 'seasonal',
          stars: [
            { x: 30, y: 0 },
            { x: 30, y: 30 },
            { x: 0, y: 50 },
            { x: 60, y: 50 },
            { x: 30, y: 80 }
          ],
          connections: [[0,1], [1,2], [1,3], [1,4]]
        },
        // Cassiopeia (카시오페이아) - 가을
        {
          name: 'Cassiopeia',
          category: 'seasonal',
          stars: [
            { x: 0, y: 0 },
            { x: 25, y: 15 },
            { x: 50, y: 0 },
            { x: 75, y: 20 },
            { x: 100, y: 5 }
          ],
          connections: [[0,1], [1,2], [2,3], [3,4]]
        },
        // Lyra (거문고자리) - 여름
        {
          name: 'Lyra',
          category: 'seasonal',
          stars: [
            { x: 20, y: 0 },
            { x: 0, y: 15 },
            { x: 40, y: 15 },
            { x: 10, y: 30 },
            { x: 30, y: 30 }
          ],
          connections: [[0,1], [0,2], [1,3], [2,4], [3,4]]
        },
        // Andromeda (안드로메다자리) - 가을
        {
          name: 'Andromeda',
          category: 'seasonal',
          stars: [
            { x: 0, y: 0 },
            { x: 30, y: 10 },
            { x: 60, y: 5 },
            { x: 90, y: 15 },
            { x: 40, y: 35 }
          ],
          connections: [[0,1], [1,2], [2,3], [1,4]]
        },
        // Perseus (페르세우스자리) - 겨울
        {
          name: 'Perseus',
          category: 'seasonal',
          stars: [
            { x: 0, y: 40 },
            { x: 20, y: 20 },
            { x: 40, y: 0 },
            { x: 60, y: 25 },
            { x: 80, y: 40 }
          ],
          connections: [[0,1], [1,2], [1,3], [3,4]]
        },
        // Boötes (목동자리) - 봄
        {
          name: 'Boötes',
          category: 'seasonal',
          stars: [
            { x: 30, y: 0 },
            { x: 15, y: 25 },
            { x: 45, y: 25 },
            { x: 0, y: 50 },
            { x: 30, y: 60 },
            { x: 60, y: 50 }
          ],
          connections: [[0,1], [0,2], [1,3], [1,4], [2,4], [2,5]]
        }
      ];

      // Store all patterns for later use
      availablePatternsRef.current = [...constellationPatterns];
      
      // Create initial 10-15 constellations
      const initialCount = Math.floor(Math.random() * 6) + 10; // 10-15 constellations
      
      for (let i = 0; i < initialCount && i < constellationPatterns.length; i++) {
        const pattern = constellationPatterns[i];
        usedPatternsRef.current.add(pattern.name);
        
        const constellation = createConstellationFromPattern(pattern, canvas);
        constellations.push(constellation);
      }
      
      return constellations;
    };

    const createConstellationFromPattern = (pattern: any, canvas: HTMLCanvasElement): Constellation => {
      // Random position and consistent scale for the constellation
      const centerX = Math.random() * canvas.width;
      const centerY = Math.random() * canvas.height;
      const scale = 1.2; // Fixed appropriate scale
      
      // Constellation movement velocity (slower than individual stars)
      const constellationVx = (Math.random() - 0.5) * 0.05;
      const constellationVy = (Math.random() - 0.5) * 0.05;

      const stars = pattern.stars.map((star: any) => ({
        x: centerX + (star.x * scale),
        y: centerY + (star.y * scale),
        vx: constellationVx, // Same velocity for all stars to maintain shape
        vy: constellationVy,
      }));

      return { 
        stars, 
        connections: pattern.connections, 
        vx: constellationVx, 
        vy: constellationVy,
        name: pattern.name,
        category: pattern.category
      };
    };

    const addNewConstellation = (canvas: HTMLCanvasElement) => {
      const availablePatterns = availablePatternsRef.current.filter(
        pattern => !usedPatternsRef.current.has(pattern.name)
      );
      
      if (availablePatterns.length === 0) {
        // Reset if all patterns used
        usedPatternsRef.current.clear();
        availablePatterns.push(...availablePatternsRef.current);
      }
      
      const randomPattern = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
      usedPatternsRef.current.add(randomPattern.name);
      
      return createConstellationFromPattern(randomPattern, canvas);
    };

    const drawStar = (star: Star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
      
      // Add a subtle glow
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.1})`;
      ctx.fill();
    };

    const drawConstellation = (constellation: Constellation) => {
      // Draw constellation lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      
      constellation.connections.forEach(([startIdx, endIdx]) => {
        const start = constellation.stars[startIdx];
        const end = constellation.stars[endIdx];
        
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      });

      // Draw constellation stars
      constellation.stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
        
        // Add glow to constellation stars
        ctx.beginPath();
        ctx.arc(star.x, star.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isDarkMode) {
        // Dark mode: stars and constellations
        // Update and draw moving stars
        starsRef.current.forEach(star => {
          star.x += star.vx;
          star.y += star.vy;

          // Wrap around edges
          if (star.x < 0) star.x = canvas.width;
          if (star.x > canvas.width) star.x = 0;
          if (star.y < 0) star.y = canvas.height;
          if (star.y > canvas.height) star.y = 0;

          // Twinkle effect
          star.opacity += (Math.random() - 0.5) * 0.02;
          star.opacity = Math.max(0.1, Math.min(0.9, star.opacity));

          drawStar(star);
        });

        // Update and draw constellations (moving as a group)
        constellationsRef.current = constellationsRef.current.filter(constellation => {
          // Calculate constellation bounds
          const minX = Math.min(...constellation.stars.map(s => s.x));
          const maxX = Math.max(...constellation.stars.map(s => s.x));
          const minY = Math.min(...constellation.stars.map(s => s.y));
          const maxY = Math.max(...constellation.stars.map(s => s.y));
          
          // Move all stars together
          constellation.stars.forEach(star => {
            star.x += constellation.vx;
            star.y += constellation.vy;
          });

          // Check if constellation is completely off screen
          const margin = 200; // Give some margin before removing
          const isOffScreen = maxX < -margin || minX > canvas.width + margin || 
                             maxY < -margin || minY > canvas.height + margin;
          
          if (isOffScreen) {
            // Remove this constellation from used patterns so it can appear again later
            usedPatternsRef.current.delete(constellation.name);
            return false; // Remove from array
          }

          // Wrap around edges (entire constellation) - only for partially off screen
          if (maxX < 0 && minX > -margin) {
            const offsetX = canvas.width - minX;
            constellation.stars.forEach(star => star.x += offsetX);
          }
          if (minX > canvas.width && maxX < canvas.width + margin) {
            const offsetX = -maxX;
            constellation.stars.forEach(star => star.x += offsetX);
          }
          if (maxY < 0 && minY > -margin) {
            const offsetY = canvas.height - minY;
            constellation.stars.forEach(star => star.y += offsetY);
          }
          if (minY > canvas.height && maxY < canvas.height + margin) {
            const offsetY = -maxY;
            constellation.stars.forEach(star => star.y += offsetY);
          }
          
          drawConstellation(constellation);
          return true; // Keep in array
        });

        // Add new constellations to maintain 10-15 on screen
        const targetCount = Math.floor(Math.random() * 6) + 10; // 10-15
        while (constellationsRef.current.length < targetCount) {
          const newConstellation = addNewConstellation(canvas);
          constellationsRef.current.push(newConstellation);
        }
      } else {
        // Light mode: clouds
        cloudsRef.current.forEach(cloud => {
          cloud.x += cloud.vx;
          cloud.y += cloud.vy;

          // Wrap around edges
          if (cloud.x > canvas.width + 100) {
            cloud.x = -100;
            cloud.y = Math.random() * canvas.height;
          }
          if (cloud.x < -100) {
            cloud.x = canvas.width + 100;
            cloud.y = Math.random() * canvas.height;
          }
          if (cloud.y > canvas.height + 50) cloud.y = -50;
          if (cloud.y < -50) cloud.y = canvas.height + 50;

          // Subtle opacity variation
          cloud.opacity += (Math.random() - 0.5) * 0.01;
          cloud.opacity = Math.max(0.1, Math.min(0.5, cloud.opacity));

          drawCloud(cloud);
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    
    if (isDarkMode) {
      starsRef.current = createStars(150);
      constellationsRef.current = createConstellations();
    } else {
      cloudsRef.current = createClouds(12);
    }
    
    animate();

    const handleResize = () => {
      resizeCanvas();
      if (isDarkMode) {
        starsRef.current = createStars(150);
        constellationsRef.current = createConstellations();
      } else {
        cloudsRef.current = createClouds(12);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [theme]);

  // Check if current theme is dark (including system theme detection)
  const isDarkMode = theme === 'dark' || 
    (theme === 'system' && typeof window !== 'undefined' && 
     window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const backgroundStyle = isDarkMode 
    ? { background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)' }
    : { background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 30%, #90caf9 60%, #64b5f6 100%)' };

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={backgroundStyle}
    />
  );
}