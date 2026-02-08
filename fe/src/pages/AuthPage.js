import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { postLogin, postSignUp, saveUserInformation } from '../services/AuthenticationService';
import { cn } from '../utils/helpers';

const AuthPage = () => {
  const navigate = useNavigate();

  // Toggle State
  const [isLogin, setIsLogin] = useState(true);

  // Form States
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Status States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const response = await postLogin(username, password);
        saveUserInformation(response.data);
        navigate('/dashboard');
      } else {
        // REGISTER logic
        await postSignUp({
          username: username,
          name: name,
          email: email,
          password: password
        });

        setSuccessMessage("Account created successfully! Please login.");
        setIsLogin(true);
        setPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Check your details.");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 font-sans selection:bg-black selection:text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px]"
      >
        <div className="flex items-center justify-center gap-2 mb-10 select-none">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg shadow-black/10">
            <div className="w-2.5 h-2.5 bg-white rounded-full" />
          </div>
          <span className="font-bold tracking-tight text-2xl text-black">Focus.</span>
        </div>

        <div className="flex bg-gray-200/50 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(null); setSuccessMessage(null); }}
            className={cn(
              "flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all",
              isLogin ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
            )}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(null); setSuccessMessage(null); }}
            className={cn(
              "flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all",
              !isLogin ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
            )}
          >
            Sign Up
          </button>
        </div>

        <motion.div
          layout
          className="bg-white border border-gray-200 rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div className="mb-6">
            <h1 className="text-xl font-bold tracking-tight text-black">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-sm text-gray-400">
              {isLogin ? "Enter credentials to access workspace." : "Join the minimalist movement."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Success Message Banner */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2 text-emerald-600 text-[11px] font-bold bg-emerald-50 p-3 rounded-lg border border-emerald-100 uppercase tracking-tight mb-2"
                >
                  <CheckCircle2 size={14} />
                  {successMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <input
                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-xl outline-none focus:border-emerald-500/50 focus:bg-white transition-all text-sm placeholder:text-gray-300"
                  />
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-xl outline-none focus:border-emerald-500/50 focus:bg-white transition-all text-sm placeholder:text-gray-300"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <input
              type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-xl outline-none focus:border-emerald-500/50 focus:bg-white transition-all text-sm placeholder:text-gray-300"
            />

            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-4 bg-gray-50/50 border border-gray-100 rounded-xl outline-none focus:border-emerald-500/50 focus:bg-white transition-all text-sm placeholder:text-gray-300"
            />

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-red-500 text-[11px] font-bold bg-red-50 p-3 rounded-lg border border-red-100 uppercase tracking-tight"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white p-4 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 mt-4"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin text-emerald-400" />
              ) : (
                <>
                  {isLogin ? "Enter Workspace" : "Get Started"}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em] select-none">
            Simple • Fast • Focused
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;