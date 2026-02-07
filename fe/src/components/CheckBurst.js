import React from 'react';
import { motion } from 'framer-motion';

const CheckBurst = () => {
  const particles = Array.from({ length: 8 }); // Increased to 8 for more "juice"

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
          animate={{ 
            scale: [0, 1.2, 0], 
            opacity: [1, 1, 0],
            x: Math.cos((i * 45 * Math.PI) / 180) * 30,
            y: Math.sin((i * 45 * Math.PI) / 180) * 30 
          }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className={cn(
            "absolute w-1 h-1 rounded-full",
            // Alternate between emerald and black particles
            i % 2 === 0 ? "bg-emerald-500" : "bg-zinc-800"
          )}
        />
      ))}
    </div>
  );
};

// Helper inside the file since we are using 'cn'
function cn(...inputs) { return inputs.filter(Boolean).join(' '); }

export default CheckBurst;