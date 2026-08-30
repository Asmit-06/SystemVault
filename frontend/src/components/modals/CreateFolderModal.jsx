import React, { useState } from 'react';
import { FolderPlus, X, Loader2 } from 'lucide-react';
import { useVault } from '../../context/VaultContext';

export const CreateFolderModal = () => {
  const { isCreateFolderOpen, setIsCreateFolderOpen, handleCreateFolder, currentFolder } = useVault();
  const [folderName, setFolderName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCreateFolderOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    setIsSubmitting(true);
    try {
      await handleCreateFolder(folderName.trim(), currentFolder?._id || null);
      setFolderName('');
      setIsCreateFolderOpen(false);
    } catch {
      // Handled by toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-sm bg-white dark:bg-dark-card border border-zinc-200/80 dark:border-zinc-800 rounded-3xl shadow-2xl p-5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                New Folder
              </h3>
              <p className="text-[10px] text-zinc-400">
                Inside: <span className="font-semibold text-zinc-600 dark:text-zinc-300">{currentFolder?.name || 'My Vault (Root)'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateFolderOpen(false)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Folder Name
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Invoices, Projects"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCreateFolderOpen(false)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !folderName.trim()}
              className="inline-flex items-center px-4 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white active:scale-95 disabled:opacity-50 text-white dark:text-zinc-900 text-xs font-semibold transition-all shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderModal;
