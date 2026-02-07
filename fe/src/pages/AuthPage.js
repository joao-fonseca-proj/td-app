import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you'd handle API calls here
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <h1 className="text-4xl font-bold tracking-tighter mb-2">TODO.</h1>
        <p className="text-gray-400 mb-8">Minimalist task management.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:border-black transition-colors"
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:border-black transition-colors"
          />
          <button 
            type="submit"
            className="w-full bg-black text-white p-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Enter Workspace
          </button>
        </form>

        <p className="mt-8 text-xs text-gray-300 uppercase tracking-widest">
          Simple. Fast. Focused.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;