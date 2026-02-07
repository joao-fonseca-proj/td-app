import React, { useState } from 'react';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Trash2, ArrowRight, ArrowLeft } from 'lucide-react'; 
import { cn } from '../utils/helpers';
import CheckBurst from './CheckBurst';

const TaskItem = ({ task, toggleTask, onDelete, onMove, dayOffset }) => {
  const [showBurst, setShowBurst] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for back, 1 for forward

  const handleToggle = () => {
    if (!task.completed) {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 700);
    }
    toggleTask(task.id);
  };

  const handleMove = (dir) => {
    setDirection(dir);
    // Tiny delay to let the exit animation trigger with the right direction
    setTimeout(() => onMove(task.id, dayOffset, dir), 10);
  };

  return (
    <Reorder.Item
      value={task}
      id={task.id}
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ 
        x: direction === 1 ? 40 : direction === -1 ? -40 : 0, 
        opacity: 0, 
        transition: { duration: 0.2 } 
      }}
      className={cn(
        "group flex items-center gap-3 h-[52px] px-4 border-b border-gray-50 bg-white transition-colors duration-500",
        task.completed ? "opacity-40" : "opacity-100"
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
          className={cn(
            "w-5 h-5 min-w-[20px] min-h-[20px] rounded-full border-2 flex items-center justify-center transition-all duration-300", 
            task.completed ? "bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-200" : "border-gray-200 hover:border-emerald-400 bg-white"
          )}
        >
          {task.completed && (
            <motion.svg viewBox="0 0 12 12" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="4">
              <motion.path d="M2 6.5l2.5 2.5L10 3.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            </motion.svg>
          )}
        </motion.button>
      </div>

      <div className="flex-1 flex items-center justify-between min-w-0">
        <span className={cn(
          "text-[14px] truncate transition-all tracking-tight pr-4 leading-none",
          task.completed ? "text-gray-400 line-through" : "text-gray-900",
          task.isUrgent && !task.completed ? "font-bold" : "font-normal"
        )}>
          {task.text}
        </span>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          
          {/* MOVE BACK BUTTON (Show if in Tomorrow or Future) */}
          {!task.completed && dayOffset > 0 && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleMove(-1); }}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-black hover:bg-gray-100 rounded-md transition-all"
              title="Move to previous day"
            >
              <ArrowLeft size={14} />
            </button>
          )}

          {/* MOVE FORWARD BUTTON (Snooze) */}
          {!task.completed && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleMove(1); }}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-black hover:bg-gray-100 rounded-md transition-all"
              title="Move to next day"
            >
              <ArrowRight size={14} />
            </button>
          )}

          {/* DELETE */}
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>

          <AnimatePresence>
            {task.isUrgent && !task.completed && (
                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="text-[9px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase tracking-widest ml-1"
                >Urgent</motion.span>
            )}
          </AnimatePresence>
          <span className="text-[9px] px-2 py-1 rounded font-bold uppercase tracking-widest border border-gray-100 text-gray-400 bg-gray-50 ml-1">
            {task.category}
          </span>
        </div>
      </div>
    </Reorder.Item>
  );
};

export default TaskItem;