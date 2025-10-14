import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

interface FeatherParticlesProps {
  trigger: number;
  onComplete?: () => void;
}

export const FeatherParticles: React.FC<FeatherParticlesProps> = ({ trigger, onComplete }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger > 0) {
      // Create 8-12 particles in a circle around the center
      const newParticles: Particle[] = [];
      const particleCount = 8 + Math.floor(Math.random() * 5);
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 30 + Math.random() * 20;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        newParticles.push({
          id: Date.now() + i,
          x,
          y,
          delay: Math.random() * 0.3,
        });
      }
      
      setParticles(newParticles);
      
      // Clean up particles after animation
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute text-yellow-400 text-2xl"
            initial={{ 
              x: 0, 
              y: 0, 
              scale: 0,
              opacity: 0 
            }}
            animate={{ 
              x: particle.x * 2,
              y: particle.y * 2 - 50,
              scale: [0, 1, 0.8],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 1.5,
              delay: particle.delay,
              ease: "easeOut"
            }}
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            🪶
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
