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
    }
  });

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
          <PastSection data={currentData} onUpdateTasks={updateList} />

          <div>
            <DaySection
              title={todayLabels.title}
              dateLabel={todayLabels.label}
              dayOffset={0}
              tasks={currentData['0'] || []}
              onUpdateTasks={(t) => updateList('0', t)}
              autoFocus={true}
              isHero={true}
            />
          </div>

          <DaySection
            title={tomorrowLabels.title}
            dateLabel={tomorrowLabels.label}
            dayOffset={1}
            tasks={currentData['1'] || []}
            onUpdateTasks={(t) => updateList('1', t)}
          />

          <FutureSection data={currentData} onUpdateTasks={updateList} />
        </div>
      </main>

      <Footer />
    </div>
  );
}