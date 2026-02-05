'use client';

import { motion } from 'framer-motion';
import { Link } from '@/components/atoms/SmartLink';

interface TiltImageCardProps {
  href: string;
  imageSrc: string;
}

export function TiltImageCard({ href, imageSrc }: TiltImageCardProps) {
  return (
    <Link
      href={href}
      className="group relative hidden aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl shadow-2xl lg:block lg:w-1/2"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
        className="h-full w-full bg-cover bg-center"
      >
        <div className="from-primary/20 to-accent/20 pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr mix-blend-overlay" />
        <div
          className="hero-image-transition h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url("${imageSrc}")` }}
        />
      </motion.div>
    </Link>
  );
}
