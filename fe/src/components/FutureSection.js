import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Plus } from 'lucide-react';
import { cn, getDayLabels } from '../utils/helpers';
import DaySection from './DaySection';

const FutureSection = ({ data, onUpdateTasks, onMove, onEdit, onToggleTask, onLoadMore }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pages, setPages] = useState(1);
  const DAYS_PER_PAGE = 1;

  const days = Array.from({ length: pages * DAYS_PER_PAGE }, (_, i) => 2 + i);

  const handleReset = () => {
    setIsOpen(false);
    setTimeout(() => setPages(1), 300);
  };

  return (
    <div className="relative mt-12 flex flex-col items-center">
      {/* The Timeline Rail Leading Down */}
      <div className="absolute top-0 bottom-[-40px] w-px bg-gray-100 -z-10" />

      {/* Centered Trigger Icon */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "w-8 h-8 rounded-full border bg-white flex items-center justify-center transition-all duration-300 z-10",
          isOpen ? "border-black text-black shadow-md" : "border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600"
        )}
      >
        <ChevronDown size={18} className={cn("transition-transform duration-300", isOpen ? "rotate-180" : "")} />
      </motion.button>

      {/* Reset Link */}
      <AnimatePresence>
        {isOpen && pages > 1 && (
          <motion.button
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            onClick={handleReset}
            className="mt-2 text-[9px] font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-[0.2em]"
          >
            Reset View
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full overflow-hidden space-y-10 pt-10"
          >
            {days.map(day => (
              <DaySection
                key={day}
                onEdit={onEdit}
                onMove={onMove}
                title={getDayLabels(day).title}
                dateLabel={getDayLabels(day).label}
                dayOffset={day}
                tasks={data[day] || []}
                onUpdateTasks={(t) => onUpdateTasks(day, t)}
                onToggleTask={onToggleTask}
              />
            ))}

            <div className="flex justify-center py-4">
              <button
                onClick={() => {
                  setPages(p => p + 1); // Expand UI
                  onLoadMore();       // 2. TRIGGER API FETCH
                }}
                className="w-fit flex items-center gap-2 px-8 py-2 bg-white border border-gray-100 border-dashed rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-all shadow-sm"
              >
                <Plus size={12} /> MORE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FutureSection;