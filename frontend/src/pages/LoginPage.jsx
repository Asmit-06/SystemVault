import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sun,
  Moon,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { getErrorMessage } from '../utils/formatters';

export const LoginPage = () => {
  const { login } = useAuth();
  const toast = useToast();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      await login(email.trim(), password);
      toast.success('Welcome back to SystemVault!');
      navigate('/');
    } catch (err) {
      const msg = getErrorMessage(err, 'Invalid email or password');
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 p-4 sm:p-6 transition-colors relative overflow-hidden bg-grid-pattern">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 dark:bg-brand-500/15 blur-3xl rounded-full pointer-events-none" />

      {/* Top Header */}
      <div className="flex justify-between items-center max-w-5xl w-full mx-auto py-2 z-10">
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-glow-sm">
            <Shield className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight">
            System<span className="text-brand-500">Vault</span>
          </span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-white dark:bg-dark-card border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:scale-105 transition-all shadow-xs"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Center Auth Card */}
      <div className="w-full max-w-sm mx-auto my-8 z-10">
        <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl shadow-zinc-950/5">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Sign In to SystemVault
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Enter your credentials to access your cloud vault
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email Input */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Email
              </label>
              <div className="relative flex items-center">
                <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-3.5 h-3.5 text-zinc-400 absolute left-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full mt-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white active:scale-[0.98] disabled:opacity-50 text-white dark:text-zinc-900 font-semibold text-xs transition-all shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-center">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-zinc-900 dark:text-white hover:underline ml-0.5"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-zinc-400 dark:text-zinc-600 py-2 z-10">
        © {new Date().getFullYear()} SystemVault. Encrypted cloud storage.
      </div>
    </div>
  );
};

export default LoginPage;
