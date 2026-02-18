import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, X, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../utils/helpers';
import { deleteHabitById } from '../services/HabitService'; 

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const SHORT_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const HabitInfoCard = ({ habit, loading, onClose, onRefresh }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (deleteTasks) => {
    setIsDeleting(true);
    try {
      await deleteHabitById(habit.id, deleteTasks);
      onClose();
      onRefresh(); 
    } catch (err) {
      console.error("Delete failed:", err);
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      className="absolute right-0 top-full mt-2 z-[110] w-[240px] bg-white border border-zinc-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-xl overflow-hidden pointer-events-auto"
    >
      {/* Small arrow pointer */}
      <div className="absolute right-4 -top-1 w-2 h-2 bg-white border-l border-t border-zinc-200 rotate-45" />

      <div className="p-3 bg-white">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" className="h-32 flex items-center justify-center">
              <RefreshCcw size={16} className="text-amber-500 animate-spin" />
            </motion.div>
          ) : isConfirming ? (
            /* --- DELETE CONFIRMATION VIEW --- */
            <motion.div 
              key="confirm"
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle size={14} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-widest">Delete Habit</span>
              </div>
              
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                How should we handle the existing tasks for <span className="text-black font-bold">"{habit.name}"</span>?
              </p>

              <div className="space-y-1.5 pt-1">
                <button 
                  disabled={isDeleting}
                  onClick={() => handleDelete(false)}
                  className="w-full py-2 px-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg text-[10px] font-bold text-zinc-700 transition-all flex items-center justify-between group"
                >
                  KEEP EXISTING TASKS
                  {isDeleting ? <Loader2 size={10} className="animate-spin" /> : <Trash2 size={10} className="opacity-0 group-hover:opacity-100" />}
                </button>

                <button 
                  disabled={isDeleting}
                  onClick={() => handleDelete(true)}
                  className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg text-[10px] font-bold text-red-600 transition-all flex items-center justify-between group"
                >
                  WIPE ALL TASKS
                  {isDeleting ? <Loader2 size={10} className="animate-spin" /> : <Trash2 size={10} className="opacity-0 group-hover:opacity-100" />}
                </button>
              </div>

              <button 
                onClick={() => setIsConfirming(false)}
                className="w-full py-1 text-[9px] font-bold text-zinc-400 uppercase tracking-widest hover:text-black"
              >
                Go Back
              </button>
            </motion.div>
          ) : (
            /* --- MAIN INFO VIEW --- */
            <motion.div 
              key="info"
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
              className="space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-[0.15em] text-amber-600/70">Routine</span>
                  </div>
                  <h3 className="text-[13px] font-bold text-zinc-900 truncate leading-none py-1">{habit.name}</h3>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-zinc-100 rounded-md text-zinc-400 transition-colors"><X size={12} /></button>
              </div>

              <div className="flex justify-between items-center bg-zinc-50/50 p-1.5 rounded-lg border border-zinc-100/50">
                {DAYS.map((day, i) => {
                  const isActive = habit.daysOfWeek.includes(day);
                  return (
                    <div key={day} className={cn(
                      "w-5 h-5 rounded flex items-center justify-center text-[9px] font-black transition-all",
                      isActive ? "bg-amber-500 text-white shadow-sm" : "text-zinc-300"
                    )}>{SHORT_DAYS[i]}</div>
                  );
                })}
              </div>

              <div className="pt-1 flex gap-1.5">
                <button className="flex-1 py-2 bg-zinc-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">
                  Settings
                </button>
                <button 
                  onClick={() => setIsConfirming(true)}
                  className="p-2 bg-white border border-zinc-200 text-zinc-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default HabitInfoCard;