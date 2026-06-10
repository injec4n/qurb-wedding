'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

/* ─── Seeded random for hydration consistency ─── */
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/* ─── Gold Particle System ─── */
export default function GoldParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: seededRandom(i * 7 + 1) * 100,
        y: seededRandom(i * 13 + 3) * 100,
        size: seededRandom(i * 17 + 5) * 3 + 1,
        duration: seededRandom(i * 23 + 7) * 8 + 6,
        delay: seededRandom(i * 31 + 11) * 5,
        opacity: seededRandom(i * 37 + 13) * 0.4 + 0.1,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          initial={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
          style={{ backgroundColor: '#D4A853' }}
        />
      ))}
    </div>
  );
}
