import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Loader2, Info, X, Zap } from 'lucide-react';
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

const HabitCreator = ({ panelId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

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
        frequency: selectedDays.length === 7 ? "DAILY" : "WEEKLY"
      });
      setName('');
      setSelectedDays([]);
      setIsOpen(false);
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 8000);
    } catch (err) {
      console.error("Forge failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* 1. THE TRIGGER: Stronger Amber contrast */}
      {!isOpen && !showWarning && (
        <motion.button 
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50/50 text-amber-600 shadow-sm transition-all active:ring-2 active:ring-amber-100 group"
        >
          <Zap size={12} className="fill-amber-500 text-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">Forge Routine</span>
        </motion.button>
      )}

      {/* 2. SUCCESS WARNING */}
      <AnimatePresence>
        {showWarning && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="absolute right-0 top-0 whitespace-nowrap flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-600 shadow-xl z-50"
          >
            <Info size={12} strokeWidth={3} />
            <span className="text-[9px] font-black uppercase tracking-tight">Forged. Spawning in progress...</span>
            <button onClick={() => setShowWarning(false)} className="hover:text-emerald-800"><X size={10} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. THE PANEL: Fixed width and internal spacing */}
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
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1 hover:bg-gray-50 rounded-md text-gray-400"
              >
                <X size={14} />
              </button>
            </div>

            <input 
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Daily Reading"
              className="w-full bg-transparent text-[14px] font-bold tracking-tight outline-none placeholder:text-gray-200 text-zinc-800 px-1"
            />

            {/* Bottom Row: Using flex-wrap to prevent overflow */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-50 gap-2">
              <div className="flex gap-0.5">
                {DAYS.map(day => (
                  <button
                    key={day.id}
                    onClick={() => toggleDay(day.id)}
                    className={cn(
                      "w-5.5 h-5.5 sm:w-6 sm:h-6 rounded flex items-center justify-center text-[9px] font-black transition-all border",
                      selectedDays.includes(day.id)
                        ? "bg-amber-500 border-amber-600 text-white shadow-sm"
                        : "bg-gray-50 border-gray-100 text-gray-300 hover:border-amber-100"
                    )}
                  >
                    {day.label}
                  </button>
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