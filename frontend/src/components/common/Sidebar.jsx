import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HardDrive,
  FolderPlus,
  UploadCloud,
  Trash2,
  Search,
  LogOut,
  Plus,
  X,
  Sun,
  Moon,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useVault } from '../../context/VaultContext';
import { useTheme } from '../../context/ThemeContext';
import StorageMeter from './StorageMeter';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { setIsCreateFolderOpen, setIsUploadOpen, uploadQueue, currentFolder } = useVault();
  const [showNewMenu, setShowNewMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'My Vault', icon: HardDrive, end: true },
    { to: '/search', label: 'Search Files', icon: Search },
    { to: '/trash', label: 'Trash & Bin', icon: Trash2 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-[#09090b] border-r border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Branding - h-14 to match Navbar */}
        <div>
          <div className="h-14 flex items-center justify-between px-5 border-b border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-glow-sm">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight flex items-center">
                  System<span className="text-brand-500">Vault</span>
                </h1>
                <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">
                  Cloud Storage
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* "+ New" Action Button */}
          <div className="p-3 relative">
            <button
              onClick={() => setShowNewMenu(!showNewMenu)}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs shadow-sm active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Item</span>
            </button>

            {/* Dropdown Menu */}
            {showNewMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowNewMenu(false)}
                />
                <div className="absolute left-3 right-3 top-16 z-30 bg-white dark:bg-dark-card border border-zinc-200 dark:border-zinc-700/80 rounded-2xl shadow-xl p-1.5 space-y-0.5 animate-scale-in text-xs">
                  <button
                    onClick={() => {
                      setShowNewMenu(false);
                      setIsCreateFolderOpen(true);
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <div className="p-1 rounded-lg bg-amber-500/10 text-amber-500">
                      <FolderPlus className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium">New Folder</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowNewMenu(false);
                      setIsUploadOpen(true);
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <div className="p-1 rounded-lg bg-brand-500/10 text-brand-500">
                      <UploadCloud className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left font-medium">
                      <div>Upload Files</div>
                      {!currentFolder && (
                        <div className="text-[10px] text-zinc-400">Select folder first</div>
                      )}
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-900 dark:text-white font-semibold'
                        : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-3 space-y-3 border-t border-zinc-100 dark:border-zinc-800/80">
          {/* Active Uploads Mini Bar */}
          {uploadQueue.length > 0 && (
            <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                <span className="flex items-center">
                  <UploadCloud className="w-3.5 h-3.5 mr-1 text-brand-500 animate-bounce" />
                  Uploading ({uploadQueue.filter((u) => u.status === 'uploading').length})
                </span>
              </div>
              <div className="space-y-1.5 max-h-20 overflow-y-auto">
                {uploadQueue.map((item) => (
                  <div key={item.id} className="text-[10px]">
                    <div className="flex justify-between text-zinc-500 dark:text-zinc-400 truncate mb-0.5">
                      <span className="truncate mr-2">{item.name}</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          item.status === 'completed'
                            ? 'bg-emerald-500'
                            : item.status === 'error'
                            ? 'bg-rose-500'
                            : 'bg-brand-500'
                        }`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Storage Meter */}
          <StorageMeter />

          {/* User Profile Card */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                {(user?.name || user?.username || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                  {user?.name || user?.username || 'Vault User'}
                </p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
                  {user?.email || ''}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-0.5">
              <button
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
