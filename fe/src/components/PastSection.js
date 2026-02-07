import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, History, RotateCcw, Plus } from 'lucide-react';
import { cn, getDayLabels } from '../utils/helpers';
import DaySection from './DaySection';

const PastSection = ({ data, onUpdateTasks }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pages, setPages] = useState(1);
  const DAYS_PER_PAGE = 2;

  const days = Array.from({ length: pages * DAYS_PER_PAGE }, (_, i) => -1 - i);

  // Updated: Resets both the page count and closes the accordion
  const handleReset = () => {
    setIsOpen(false);
    setTimeout(() => setPages(1), 300); // Wait for collapse animation before resetting data
  };

  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-2">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors"
        >
          <History size={13} strokeWidth={2.5} />
          {isOpen ? 'Hide History' : 'Show History'}
          <ChevronDown size={12} className={cn("transition-transform duration-300", isOpen ? "rotate-180" : "")} />
        </button>

        {/* Updated Logic here */}
        {isOpen && pages > 1 && (
          <button 
            onClick={handleReset}
            className="flex items-center gap-1.5 text-[10px] font-bold text-red-500/80 hover:text-red-600 transition-colors uppercase tracking-widest"
          >
            <RotateCcw size={10} /> Reset & Close
          </button>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-10 pb-6"
          >
            <div className="flex justify-center pt-2">
              <button 
                onClick={() => setPages(p => p + 1)}
                className="w-fit flex items-center gap-2 px-8 py-2.5 bg-white border border-gray-100 border-dashed rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black hover:border-gray-300 transition-all shadow-sm"
              >
                <Plus size={12} /> Load older
              </button>
            </div>

            {days.slice().reverse().map(day => (
              <DaySection 
                key={day} 
                title={getDayLabels(day).title} 
                dateLabel={getDayLabels(day).label} 
                dayOffset={day} 
                tasks={data[day] || []} 
                onUpdateTasks={(t) => onUpdateTasks(day, t)} 
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PastSection;