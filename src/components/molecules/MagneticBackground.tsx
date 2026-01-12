'use client';

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef } from 'react';

const GRID_COLS = 32;
const GRID_ROWS = 16;
const TOTAL_ITEMS = GRID_COLS * GRID_ROWS;

const SPRING_CONFIG = { damping: 20, stiffness: 150, mass: 0.5 };

function Filing({
  mouseX,
  mouseY,
  containerRef,
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const itemRef = useRef<HTMLDivElement>(null);

  const rotate = useTransform([mouseX, mouseY], ([mx, my]) => {
    if (!itemRef.current || !containerRef.current) return 0;

    const rect = itemRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (mx as number) - centerX;
    const deltaY = (my as number) - centerY;

    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;

    return angle;
  });

  const smoothRotate = useSpring(rotate, SPRING_CONFIG);

  return (
    <div ref={itemRef} className="flex h-full w-full items-center justify-center">
      <motion.div
        style={{ rotate: smoothRotate }}
        className="bg-foreground/20 hover:bg-primary/50 h-6 w-1.5 rounded-full transition-colors duration-300"
      />
    </div>
  );
}

export function MagneticBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 flex flex-wrap content-center items-center justify-center overflow-hidden opacity-40"
    >
      <div
        className="grid h-full w-full"
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
        }}
      >
        {Array.from({ length: TOTAL_ITEMS }).map((_, i) => (
          <Filing key={i} mouseX={mouseX} mouseY={mouseY} containerRef={containerRef} />
        ))}
      </div>

      <div className="bg-background/0 pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_90%)]" />
    </div>
  );
}
