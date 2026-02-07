import React, { useState } from 'react';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { cn } from '../utils/helpers';
import CheckBurst from './CheckBurst';

const TaskItem = ({ task, toggleTask }) => {
  const [showBurst, setShowBurst] = useState(false);

  const handleToggle = () => {
    if (!task.completed) {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 700);
    }
    toggleTask(task.id);
  };

  return (
    <Reorder.Item
      value={task}
      id={task.id}
      // CRITICAL: layout="position" prevents the checkbox from scaling/growing
      layout="position" 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileDrag={{ 
        scale: 1.01, 
        boxShadow: "0px 10px 20px rgba(0,0,0,0.05)",
        backgroundColor: "white" 
      }}
      className={cn(
        // Added h-[64px]: This locks the height so bold text doesn't stretch the row
        "group flex items-center gap-3 h-[64px] px-4 border-b border-gray-50 transition-colors duration-500",
        task.completed ? "bg-emerald-50/30" : "bg-white hover:bg-gray-50/50"
      )}
    >
      <div className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical size={14} />
      </div>

      <div className="relative flex-shrink-0 flex items-center justify-center w-6 h-6">
        <AnimatePresence>{showBurst && <CheckBurst />}</AnimatePresence>

        <motion.button
          onClick={handleToggle}
          whileTap={{ scale: 0.8 }}
          // Added min-w/min-h to ensure it never changes size
          className={cn(
            "w-5 h-5 min-w-[20px] min-h-[20px] rounded-full border-2 flex items-center justify-center transition-all duration-300", 
            task.completed 
                ? "bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-200" 
                : "border-gray-200 hover:border-emerald-400 bg-white"
          )}
        >
          {task.completed && (
            <motion.svg viewBox="0 0 12 12" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <motion.path 
                d="M2 6.5l2.5 2.5L10 3.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.25 }}
              />
            </motion.svg>
          )}
        </motion.button>
      </div>

      <div className="flex-1 flex items-center justify-between min-w-0">
        <span
          className={cn(
            "text-[15px] truncate transition-all tracking-tight pr-4 leading-none",
            task.completed ? "text-emerald-800/40 line-through" : "text-gray-900",
            // Urgent is bold, but since height is fixed at 64px, it won't affect the layout
            task.isUrgent && !task.completed ? "font-bold" : "font-normal"
          )}
        >
          {task.text}
        </span>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <AnimatePresence>
            {task.isUrgent && !task.completed && (
                <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    className="text-[9px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase tracking-widest"
                >
                    Urgent
                </motion.span>
            )}
          </AnimatePresence>
          <span className={cn(
            "text-[9px] px-2 py-1 rounded font-bold uppercase tracking-widest border transition-colors",
            task.completed ? "bg-emerald-100/50 border-emerald-100 text-emerald-600" : "bg-gray-50 border-gray-100 text-gray-400"
          )}>
            {task.category}
          </span>
        </div>
      </div>
    </Reorder.Item>
  );
};

export default TaskItem;