import React, { useState, useRef, useEffect } from 'react';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '../utils/helpers';
import CheckBurst from './CheckBurst';

const TaskItem = ({ task, toggleTask, onDelete, onMove, onEdit, dayOffset }) => {
  const [showBurst, setShowBurst] = useState(false);
  const [direction, setDirection] = useState(0);

  // EDIT STATE
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleToggle = () => {
    if (!task.completed) {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 600);
    }
    toggleTask();
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editText.trim() !== "" && editText !== task.text) {
      onEdit(task.id, dayOffset, editText);
    } else {
      setEditText(task.text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleBlur();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(task.text);
    }
  };

  const handleMoveAction = (dir) => {
    setDirection(dir);
    // Directional slide out
    setTimeout(() => onMove(task.id, dayOffset, dir), 50);
  };

  return (
    <Reorder.Item
      value={task}
      id={task.id}
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        x: direction === 1 ? 60 : direction === -1 ? -60 : 0,
        transition: { duration: 0.2 }
      }}
      className={cn(
        // High Density: Height reduced to 42px, horizontal padding reduced to px-3
        "group flex items-center gap-2 h-[42px] px-3 border-b border-gray-50 bg-white transition-colors duration-500",
        task.completed ? "opacity-40" : "opacity-100"
      )}
    >
      {/* 1. Drag Handle: Scaled down */}
      <div className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical size={12} />
      </div>

      {/* 2. Checkbox: Compact 18px size */}
      <div className="relative flex-shrink-0 flex items-center justify-center w-5 h-5">
        <AnimatePresence>{showBurst && <CheckBurst />}</AnimatePresence>
        <button
          onClick={handleToggle}
          className={cn(
            "w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full border-2 flex items-center justify-center transition-all duration-300",
            task.completed ? "bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-200" : "border-gray-200 hover:border-emerald-400 bg-white"
          )}
        >
          {task.completed && (
            <motion.svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="4">
              <motion.path d="M2 6.5l2.5 2.5L10 3.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            </motion.svg>
          )}
        </button>
      </div>

      {/* 3. Main Text Area: Prioritized using flex-1 and min-w-0 */}
      <div className="flex-1 min-w-0 h-full flex items-center">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full h-full bg-transparent text-[13px] outline-none text-black font-medium"
          />
        ) : (
          <span
            onClick={() => !task.completed && setIsEditing(true)}
            className={cn(
              "text-[13px] truncate tracking-tight pr-2 leading-none flex-1 h-full flex items-center cursor-text",
              task.completed ? "text-gray-400 line-through" : "text-gray-900 hover:text-black",
              task.isUrgent && !task.completed ? "font-bold" : "font-normal"
            )}
          >
            {task.text}
          </span>
        )}
      </div>

      {/* 4. Action Zone: Compact layout for mobile */}
      <div className="flex items-center gap-1 flex-shrink-0">
        
        {/* Buttons: Hidden until hover to reduce noise */}
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          {!task.completed && dayOffset > 0 && (
            <button onClick={() => handleMoveAction(-1)} className="p-1 text-gray-300 hover:text-black transition-colors">
              <ArrowLeft size={12} />
            </button>
          )}
          {!task.completed && (
            <button onClick={() => handleMoveAction(1)} className="p-1 text-gray-300 hover:text-black transition-colors">
              <ArrowRight size={12} />
            </button>
          )}
          <button onClick={() => onDelete(task.id, dayOffset)} className="p-1 text-gray-300 hover:text-red-500 transition-colors">
            <Trash2 size={12} />
          </button>
        </div>

        {/* Status Badges: Minimal styling */}
        <div className="flex items-center gap-1">
          <AnimatePresence>
            {task.isUrgent && !task.completed && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0 }} 
                className="text-[8px] font-black text-red-500 bg-red-50 px-1 py-0.5 rounded border border-red-100 uppercase"
              >
                !
              </motion.span>
            )}
          </AnimatePresence>
          <span className={cn(
            "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter border transition-colors",
            "bg-gray-50 border-gray-100 text-gray-400",
            // On mobile, limit the width of the category tag so it doesn't squash the task text
            "max-w-[50px] truncate sm:max-w-none"
          )}>
            {task.category}
          </span>
        </div>
      </div>
    </Reorder.Item>
  );
};

export default TaskItem;