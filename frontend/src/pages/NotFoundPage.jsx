import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 mb-4 shadow-inner">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1.5">
        404 - Page Not Found
      </h1>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
        The location you are looking for doesn't exist or may have been moved.
      </p>
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs transition-all shadow-sm active:scale-95"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Return to Vault Home</span>
      </button>
    </div>
  );
};

export default NotFoundPage;
