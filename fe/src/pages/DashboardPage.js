import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContextTabs from '../components/ContextTabs';
import DaySection from '../components/DaySection';
import FutureSection from '../components/FutureSection';
import PastSection from '../components/PastSection';
import { getDayLabels } from '../utils/helpers';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [data, setData] = useState({
    personal: {
      '0': [
        { id: '1', text: 'Daily Standup', completed: false, category: 'Work', isUrgent: true },
        { id: '2', text: 'Review feedback from client', completed: false, category: 'Work', isUrgent: false },
      ],
    },
    professional: {
      '0': [
        { id: '1', text: 'Finish NR-1603', completed: false, category: 'Work', isUrgent: true },
      ],
    }
  });

  const handleMoveTask = (taskId, currentOffset, direction) => {
    const targetOffset = currentOffset + direction;

    // 1. Extract task from source
    const taskToMove = data[activeTab][currentOffset]?.find(t => t.id === taskId);
    if (!taskToMove) return;

    // 2. Remove from source
    const updatedSourceList = data[activeTab][currentOffset].filter(t => t.id !== taskId);

    // 3. Add to target
    const targetList = data[activeTab][targetOffset] || [];
    // If moving forward, add to top. If moving back, add to top.
    const updatedTargetList = [taskToMove, ...targetList];

    setData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [currentOffset]: updatedSourceList,
        [targetOffset]: updatedTargetList
      }
    }));
  };

  const updateList = (dayKey, newTasks) => {
    setData(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [dayKey]: newTasks }
    }));
  };

  const currentData = data[activeTab];
  const todayLabels = getDayLabels(0);
  const tomorrowLabels = getDayLabels(1);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-black selection:text-white flex flex-col">
      <Navbar />

      {/* Reduced top padding from py-12 to pt-6 */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 pt-6 pb-20">

        {/* Tighter margin below tabs: mb-14 -> mb-6 */}
        <div className="mb-6">
          <ContextTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Tighter spacing between history, today and tomorrow: space-y-16 -> space-y-10 */}
        <div className="flex flex-col space-y-4">
          <PastSection data={currentData} onUpdateTasks={updateList} onMove={handleMoveTask} />

          <div>
            <DaySection
              title={todayLabels.title}
              dateLabel={todayLabels.label}
              dayOffset={0}
              tasks={currentData['0'] || []}
              onUpdateTasks={(t) => updateList('0', t)}
              autoFocus={true}
              isHero={true}
              onMove={handleMoveTask} // Pass it here
            />
          </div>

          <DaySection
            title={tomorrowLabels.title}
            dateLabel={tomorrowLabels.label}
            dayOffset={1}
            tasks={currentData['1'] || []}
            onUpdateTasks={(t) => updateList('1', t)}
            onMove={handleMoveTask} // Pass it here
          />

          <FutureSection data={currentData} onUpdateTasks={updateList} onMove={handleMoveTask} />
        </div>
      </main>

      <Footer />
    </div>
  );
}