import React, { useState } from 'react';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { cn } from '../utils/helpers';
import TaskItem from './TaskItem';
import ProgressCircle from './ProgressCircle';
import AnimatedCounter from './AnimatedCounter';

const DaySection = ({ title, dateLabel, tasks, onUpdateTasks, onCreateTask, onToggleTask, onDeleteTask, dayOffset, onMove, onEdit, autoFocus = false, isHero = false }) => {
  const [inputValue, setInputValue] = useState('');

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const isDone = totalCount > 0 && completedCount === totalCount;

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === 'Tab') && inputValue.trim()) {
      e.preventDefault();

      // CALL THE DASHBOARD HANDLER
      onCreateTask(inputValue, dayOffset);
      setInputValue('');
    }
  };

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        {/* Left Side: Just Title and Date */}
        <div className="flex items-center gap-3">
          <motion.h2
            animate={{ color: isDone ? "#000" : isHero ? "#000" : "#9ca3af" }}
            className={cn("font-bold tracking-tighter transition-colors", isHero ? "text-2xl" : "text-lg")}
          >
            {title}
          </motion.h2>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
            {dateLabel}
          </span>
        </div>

        {/* Right Side: The Status Pill (The Transformation happens here) */}
        {totalCount > 0 && (
          <motion.div
            layout
            className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-500 bg-white shadow-sm",
              isDone ? "border-emerald-500/30" : "border-gray-100"
            )}
          >
            <div className="flex items-center h-4 overflow-hidden min-w-[30px] justify-center">
              <AnimatePresence mode="wait">
                {isDone ? (
                  <motion.span
                    key="done-text"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    className="text-[9px] font-black uppercase tracking-[0.1em] text-emerald-600"
                  >
                    Done
                  </motion.span>
                ) : (
                  <motion.div
                    key="counter-ui"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    className="flex items-center text-[11px] font-mono font-bold text-gray-500"
                  >
                    <AnimatedCounter value={completedCount} />
                    <span className="mx-0.5 opacity-20">/</span>
                    <span>{totalCount}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <ProgressCircle completed={completedCount} total={totalCount} />
              <AnimatePresence>
                {isDone && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center text-emerald-500"
                  >
                    <Check size={10} strokeWidth={4} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Section Body */}
      <div className={cn(
        "bg-white border rounded-[22px]  transition-all duration-700",
        isHero ? "border-gray-200 shadow-sm" : "border-gray-100 opacity-80",
        isDone && "border-emerald-500/30 shadow-lg shadow-emerald-500/[0.02]"
      )}>
        <div className="p-1">
          <Reorder.Group axis="y" values={tasks} onReorder={onUpdateTasks}>
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                dayOffset={dayOffset} // Pass this down so Item knows its context
                onEdit={onEdit} // <--- Pass it here
                onMove={onMove} // Changed prop name to be generic
                toggleTask={() => onToggleTask(task.id, dayOffset)} // Call the new handler
                onDelete={() => onDeleteTask(task.id, dayOffset)} // Call the handler
              />
            ))}
          </Reorder.Group>
        </div>

        {/* INPUT AREA: Fixed with rounded-b-[22px] */}
        <div className={cn(
          "relative group border-none bg-gray-50/10 transition-colors",
          "rounded-b-[20px]" // This makes the input sit perfectly inside the parent curve
        )}>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black">
            <Plus size={14} />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown}
            autoFocus={autoFocus}
            placeholder="Add task..."
            className={cn(
              "w-full pl-12 pr-6 py-4 bg-transparent border-none outline-none", // outline-none is critical
              "text-gray-900 placeholder:text-gray-300 text-[14px]",
              "rounded-b-[21px]"
            )} />
        </div>
      </div>
    </section>
  );
};

export default DaySection;