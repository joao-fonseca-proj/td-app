import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, X, Calendar } from 'lucide-react';
import { cn } from '../utils/helpers';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const SHORT_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const HabitInfoCard = ({ habit, loading, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      className="absolute right-0 top-full mt-2 z-[100] w-[230px] bg-white/95 backdrop-blur-xl border border-amber-200/50 shadow-[0_10px_30px_rgba(0,0,0,0.12)] rounded-xl overflow-hidden pointer-events-auto"
    >
      {/* Small arrow pointer */}
      <div className="absolute right-4 -top-1 w-2 h-2 bg-white border-l border-t border-amber-200/40 rotate-45" />

      {loading ? (
        <div className="h-20 flex items-center justify-center">
          <RefreshCcw size={14} className="text-amber-500 animate-spin" />
        </div>
      ) : habit ? (
        <div className="p-3 space-y-3 bg-white">
          {/* Header - Tightened */}
          <div className="flex justify-between items-start">
            <div className="min-w-0">
              <div className="flex items-center gap-1 mb-0.5">
                <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-[0.15em] text-amber-600/70">Routine</span>
              </div>
              <h3 className="text-[13px] font-bold text-zinc-900 truncate leading-none py-1">
                {habit.name}
              </h3>
            </div>
            <button 
              onClick={onClose} 
              className="p-1 hover:bg-zinc-100 rounded-md text-zinc-400 transition-colors"
            >
              <X size={12} />
            </button>
          </div>

          {/* Mini Specs - Condensed boxes */}
          <div className="flex gap-1.5">
            <div className="flex-1 bg-zinc-50/50 rounded-lg p-1.5 border border-zinc-100/50">
              <span className="block text-[7px] uppercase font-bold text-zinc-400 tracking-tighter">Freq</span>
              <span className="text-[9px] font-bold text-zinc-600 uppercase truncate">{habit.frequency}</span>
            </div>
            <div className="flex-1 bg-zinc-50/50 rounded-lg p-1.5 border border-zinc-100/50">
              <span className="block text-[7px] uppercase font-bold text-zinc-400 tracking-tighter">Cat</span>
              <span className="text-[9px] font-bold text-zinc-600 uppercase truncate">{habit.category}</span>
            </div>
          </div>

          {/* Schedule - Smaller bubbles */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 px-0.5">
              <Calendar size={10} className="text-zinc-400" />
              <span className="text-[8px] uppercase font-black tracking-widest text-zinc-400">Weekly Cycle</span>
            </div>
            <div className="flex justify-between items-center bg-zinc-50/30 p-1.5 rounded-lg border border-zinc-100/30">
              {DAYS.map((day, i) => {
                const isActive = habit.daysOfWeek.includes(day);
                return (
                  <div key={day} className={cn(
                    "w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black transition-all",
                    isActive 
                      ? "bg-amber-500 text-white shadow-sm" 
                      : "text-zinc-300"
                  )}>
                    {SHORT_DAYS[i]}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
};

export default HabitInfoCard;