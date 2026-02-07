import React from 'react';
import { motion } from 'framer-motion';

const ProgressCircle = ({ completed, total }) => {
  const percentage = total === 0 ? 0 : (completed / total) * 100;
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-5 h-5"> {/* Slightly smaller */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="10" cy="10" r={radius}
          stroke="currentColor" strokeWidth="2" fill="transparent"
          className="text-gray-100"
        />
        <motion.circle
          cx="10" cy="10" r={radius}
          stroke="currentColor" strokeWidth="2" fill="transparent"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className={percentage === 100 ? "text-emerald-500 opacity-40" : "text-emerald-400"}
          // Made the circle faint when the checkmark is inside it
        />
      </svg>
    </div>
  );
};

export default ProgressCircle;