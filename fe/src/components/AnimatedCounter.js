import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedCounter = ({ value }) => {
  return (
    <div className="flex overflow-hidden h-5 items-center font-mono font-bold text-sm">
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -15, opacity: 0 }}
          transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 20 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedCounter;