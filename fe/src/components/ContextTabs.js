import React from 'react';
import { User, Briefcase } from 'lucide-react';
import { cn } from '../utils/helpers';

const ContextTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex bg-gray-100 p-1 rounded-full inline-flex">
      <button 
        onClick={() => setActiveTab('personal')}
        className={cn(
          "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
          activeTab === 'personal' ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"
        )}
      >
        <User size={14} /> Personal
      </button>
      <button 
        onClick={() => setActiveTab('professional')}
        className={cn(
          "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
          activeTab === 'professional' ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"
        )}
      >
        <Briefcase size={14} /> Professional
      </button>
    </div>
  );
};

export default ContextTabs;