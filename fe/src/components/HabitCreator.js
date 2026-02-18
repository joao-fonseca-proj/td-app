import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X, Zap, HardHat } from 'lucide-react'; // Added HardHat and Hammer
import { postHabit } from '../services/HabitService';
import { cn } from '../utils/helpers';

const DAYS = [
  { id: 'MONDAY', label: 'M' },
  { id: 'TUESDAY', label: 'T' },
  { id: 'WEDNESDAY', label: 'W' },
  { id: 'THURSDAY', label: 'T' },
  { id: 'FRIDAY', label: 'F' },
  { id: 'SATURDAY', label: 'S' },
  { id: 'SUNDAY', label: 'S' }
];

const HabitCreator = ({ panelId, fetchTasks}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSpawning, setIsSpawning] = useState(false);

  const toggleDay = (id) => {
    setSelectedDays(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!name.trim() || selectedDays.length === 0) return;
    setLoading(true);
    try {
      await postHabit({
        panelId,
        name,
        daysOfWeek: selectedDays,
        category: "GENERAL",
        frequency: "EVERY"
      });
      setName('');
      setSelectedDays([]);
      setIsOpen(false);
      
      // TRIGGER THE "CONSTRUCTION" STATE
      setIsSpawning(true);
      // Let it stay for 10 seconds to really inform the user
      setTimeout(() => setIsSpawning(false), 36000);
    } catch (err) {
      console.error("Forge failed:", err);
    } finally {
      fetchTasks();
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* 1. THE TRIGGER BUTTON */}
      {!isOpen && !isSpawning && (
        <motion.button 
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50/50 text-amber-600 shadow-sm transition-all group"
        >
          <Zap size={12} className="fill-amber-500 text-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">Forge Routine</span>
        </motion.button>
      )}

      {/* 2. THE "CONSTRUCTION" BANNER (Stronger Presence) */}
      <AnimatePresence>
        {isSpawning && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute right-0 top-0 z-[110] w-[300px] bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-2xl overflow-hidden"
          >
            {/* Shimmer Effect Background */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none"
            />

            <div className="relative flex items-start gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-500">
                <HardHat size={16} strokeWidth={2.5} className="animate-bounce" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Forge in Action</span>
                  <button onClick={() => setIsSpawning(false)} className="text-zinc-500 hover:text-white">
                    <X size={12} />
                  </button>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-300 font-medium">
                  The forge is hot! We are actively spawning tasks for the <span className="text-white font-bold">next 30 days</span>. 
                  They will materialize in your timeline shortly after a refresh.
                </p>
                
                {/* Progress bar simulation */}
                <div className="mt-3 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 30, ease: "linear" }}
                        className="h-full bg-amber-500"
                    />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. THE FORGE PANEL (Same as before) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-0 z-[100] w-[270px] bg-white border border-amber-200 shadow-[0_20px_50px_rgba(245,158,11,0.1)] rounded-2xl p-3.5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-600/70">Routine Forge</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-50 rounded-md text-gray-400"><X size={14} /></button>
            </div>

            <input 
              autoFocus value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Daily Reading"
              className="w-full bg-transparent text-[14px] font-bold tracking-tight outline-none placeholder:text-gray-200 text-zinc-800 px-1"
            />

            <div className="flex items-center justify-between pt-3 border-t border-gray-50 gap-2">
              <div className="flex gap-0.5">
                {DAYS.map(day => (
                  <button
                    key={day.id} onClick={() => toggleDay(day.id)}
                    className={cn(
                      "w-5.5 h-5.5 sm:w-6 sm:h-6 rounded flex items-center justify-center text-[9px] font-black transition-all border",
                      selectedDays.includes(day.id) ? "bg-amber-500 border-amber-600 text-white shadow-sm" : "bg-gray-50 border-gray-100 text-gray-400 hover:border-amber-100"
                    )}
                  >{day.label}</button>
                ))}
              </div>

              <button 
                onClick={handleCreate}
                disabled={loading || !name.trim() || selectedDays.length === 0}
                className="flex-shrink-0 px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-black disabled:opacity-20 transition-all flex items-center justify-center gap-1"
              >
                {loading ? <Loader2 size={10} className="animate-spin" /> : 'Forge'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HabitCreator;