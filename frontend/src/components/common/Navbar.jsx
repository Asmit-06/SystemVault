import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Menu,
  LayoutGrid,
  List,
  ArrowUpDown,
  Folder,
  X,
  UploadCloud,
  FolderPlus,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import searchService from '../../services/searchService';
import { getFileIcon } from '../../utils/fileIcons';

export const Navbar = ({ onMenuClick }) => {
  const {
    viewMode,
    toggleViewMode,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    setIsUploadOpen,
    setIsCreateFolderOpen,
    currentFolder
  } = useVault();

  const navigate = useNavigate();

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({ folders: [], files: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const sortRef = useRef(null);

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults({ folders: [], files: [] });
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchService.search(searchTerm);
        setSearchResults(results);
        setShowSearchDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSearchDropdown(false);
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSelectFolder = (folderId) => {
    setShowSearchDropdown(false);
    setSearchTerm('');
    navigate(`/folder/${folderId}`);
  };

  const handleSelectFile = (file) => {
    setShowSearchDropdown(false);
    setSearchTerm('');
    if (file.folder) {
      navigate(`/folder/${file.folder}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-white/90 dark:bg-[#0c0c0e]/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 px-4 sm:px-6">
      <div className="h-full flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Trigger & Context Indicator */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuClick}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Sleek High-Contrast Command Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-xl mx-auto">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative flex items-center rounded-xl bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-700/70 hover:border-zinc-300 dark:hover:border-zinc-600 focus-within:border-brand-500 dark:focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 shadow-xs transition-all">
              <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-400 absolute left-3.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search files, folders, documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  if (searchResults.folders.length > 0 || searchResults.files.length > 0) {
                    setShowSearchDropdown(true);
                  }
                }}
                className="w-full h-9 pl-10 pr-14 bg-transparent text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 font-normal outline-none"
              />

              {/* Action / Keyboard Shortcut Indicator */}
              <div className="absolute right-2.5 flex items-center">
                {searchTerm ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setShowSearchDropdown(false);
                    }}
                    className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex items-center space-x-1 text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-zinc-200/80 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-300/60 dark:border-zinc-700/60">
                    <span>⌘</span>
                    <span>K</span>
                  </kbd>
                )}
              </div>
            </div>
          </form>

          {/* Instant Search Results Dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-11 left-0 right-0 z-50 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-scale-in max-h-96 overflow-y-auto">
              <div className="px-3.5 py-2 border-b border-zinc-100 dark:border-zinc-800/80 flex justify-between items-center text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <span>Matching Results</span>
                {isSearching && <span className="text-brand-500 lowercase font-normal">Searching...</span>}
              </div>

              {searchResults.folders?.length === 0 && searchResults.files?.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-400">
                  No matches found for "{searchTerm}"
                </div>
              ) : (
                <div className="p-1.5 divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {/* Folders */}
                  {searchResults.folders?.length > 0 && (
                    <div className="pb-1">
                      <p className="text-[10px] font-semibold text-zinc-400 px-3 py-1 uppercase tracking-wider">
                        Folders
                      </p>
                      {searchResults.folders.slice(0, 4).map((f) => (
                        <div
                          key={f._id}
                          onClick={() => handleSelectFolder(f._id)}
                          className="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/70 cursor-pointer transition-colors"
                        >
                          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                            <Folder className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">
                            {f.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Files */}
                  {searchResults.files?.length > 0 && (
                    <div className="pt-1">
                      <p className="text-[10px] font-semibold text-zinc-400 px-3 py-1 uppercase tracking-wider">
                        Files
                      </p>
                      {searchResults.files.slice(0, 5).map((file) => (
                        <div
                          key={file._id}
                          onClick={() => handleSelectFile(file)}
                          className="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/70 cursor-pointer transition-colors"
                        >
                          <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                            {getFileIcon(file, 'w-4 h-4')}
                          </div>
                          <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate flex-1">
                            {file.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-1.5 px-1">
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full py-2 text-center text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-950/30 rounded-xl transition-colors"
                    >
                      View all results for "{searchTerm}" →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Toolbar: Sort & View Mode Pill */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Sort Selector Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="h-8 px-2.5 rounded-xl bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/80 transition-colors flex items-center space-x-1.5 text-xs font-medium shadow-xs"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <span className="capitalize">{sortBy}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {showSortMenu && (
              <div className="absolute right-0 top-10 z-40 w-40 bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-1.5 space-y-1 animate-scale-in text-xs">
                <div className="px-2.5 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Sort By
                </div>
                {[
                  { id: 'date', label: 'Date Modified' },
                  { id: 'name', label: 'File Name' },
                  { id: 'size', label: 'File Size' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSortBy(opt.id);
                      setShowSortMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                      sortBy === opt.id
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <span>{opt.label}</span>
                  </button>
                ))}

                <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                  <button
                    onClick={() => {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      setShowSortMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <span>Order:</span>
                    <span className="font-semibold text-zinc-900 dark:text-white uppercase text-[10px]">
                      {sortOrder === 'asc' ? 'Ascending (A-Z)' : 'Descending (Z-A)'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* View Mode Toggle (Grid / List) */}
          <div className="flex items-center h-8 p-0.5 rounded-xl bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
            <button
              onClick={() => toggleViewMode('grid')}
              className={`h-full px-2 rounded-lg transition-all flex items-center justify-center ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => toggleViewMode('list')}
              className={`h-full px-2 rounded-lg transition-all flex items-center justify-center ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
