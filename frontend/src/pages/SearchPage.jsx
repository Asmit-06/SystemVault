import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Folder as FolderIcon, FileText, X } from 'lucide-react';
import searchService from '../services/searchService';
import FolderCard from '../components/vault/FolderCard';
import FileCard from '../components/vault/FileCard';
import EmptyState from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState({ folders: [], files: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    if (q.trim()) {
      executeSearch(q.trim());
    }
  }, [searchParams]);

  const executeSearch = async (searchTerm) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const data = await searchService.search(searchTerm);
      setResults(data || { folders: [], files: [] });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const totalResults = (results.folders?.length || 0) + (results.files?.length || 0);

  return (
    <div className="min-h-[85vh] space-y-5">
      <div className="max-w-2xl">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-1">
          Search Vault
        </h2>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-3.5">
          Find folders and files across your entire vault
        </p>

        <form onSubmit={handleFormSubmit} className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Type name, extension, or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white dark:bg-dark-card border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 shadow-xs"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSearchParams({});
                setResults({ folders: [], files: [] });
                setHasSearched(false);
              }}
              className="absolute right-3.5 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {isLoading ? (
        <LoadingSpinner text={`Searching for "${query}"...`} />
      ) : !hasSearched ? (
        <div className="p-10 text-center text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <Search className="w-8 h-8 mx-auto mb-2 text-zinc-300 dark:text-zinc-700" />
          <p className="text-xs font-medium">Type a keyword above to start searching</p>
        </div>
      ) : totalResults === 0 ? (
        <EmptyState
          type="search"
          title={`No results found for "${query}"`}
          description="Try checking for typos or searching for a different keyword."
        />
      ) : (
        <div className="space-y-6">
          <p className="text-[11px] font-semibold text-zinc-400">
            Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
          </p>

          {results.folders?.length > 0 && (
            <section>
              <div className="flex items-center space-x-2 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5">
                <FolderIcon className="w-3.5 h-3.5 text-amber-500" />
                <span>Folders ({results.folders.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {results.folders.map((folder) => (
                  <FolderCard key={folder._id} folder={folder} />
                ))}
              </div>
            </section>
          )}

          {results.files?.length > 0 && (
            <section>
              <div className="flex items-center space-x-2 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5">
                <FileText className="w-3.5 h-3.5 text-zinc-500" />
                <span>Files ({results.files.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {results.files.map((file) => (
                  <FileCard key={file._id} file={file} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
