import React from 'react';
import { Search, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-full border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo Area */}
        <div className="flex items-center gap-2 select-none">
          <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <span className="font-bold tracking-tight text-lg">TD APP.</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-5 text-gray-400">
          <button className="hover:text-black transition-colors" aria-label="Notifications">
            <Bell size={18} />
          </button>
          
          <div className="h-4 w-px bg-gray-200"></div>
          
          <button 
            onClick={() => navigate('/login')}
            className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center hover:border-gray-400 hover:text-red-500 transition-all group"
            title="Logout"
          >
            <span className="text-xs font-semibold text-gray-600 group-hover:hidden">JD</span>
            <LogOut size={12} className="hidden group-hover:block" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;