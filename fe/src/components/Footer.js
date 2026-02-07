import React from 'react';
import { Command } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-100 py-10 mt-auto bg-white">
      <div className="max-w-3xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-400">
        
        <div className="flex gap-6">
          <button className="hover:text-black transition-colors">Settings</button>
          <button className="hover:text-black transition-colors">Help & Support</button>
        </div>

        <div className="flex items-center gap-4 select-none">

          
          <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100">Enter</span>
          <span className="text-gray-300">to save</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;