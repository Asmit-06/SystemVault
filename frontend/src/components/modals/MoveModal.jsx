import React, { useState, useEffect } from 'react';
import { FolderInput, X, Folder, Home, Loader2 } from 'lucide-react';
import { useVault } from '../../context/VaultContext';

export const MoveModal = () => {
  const { itemToMove, setItemToMove, handleMove, getAllFoldersList } = useVault();
  const [folders, setFolders] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (itemToMove) {
      setIsLoadingFolders(true);
      getAllFoldersList().then((list) => {
        const filtered = itemToMove.type === 'folder'
          ? list.filter((f) => f._id !== itemToMove.item._id)
          : list;
        setFolders(filtered);
        
        if (itemToMove.type === 'folder') {
          setSelectedDestination('root');
        } else if (filtered.length > 0) {
          setSelectedDestination(filtered[0]._id);
        }
        setIsLoadingFolders(false);
      });
    }
  }, [itemToMove]);

  if (!itemToMove) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const targetId = selectedDestination === 'root' ? null : selectedDestination;
      await handleMove(itemToMove.type, itemToMove.item._id, targetId);
      setItemToMove(null);
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
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <FolderInput className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Move {itemToMove.type === 'folder' ? 'Folder' : 'File'}
              </h3>
              <p className="text-[10px] text-zinc-400 truncate max-w-[200px]">
                "{itemToMove.item.name}"
              </p>
            </div>
          </div>
          <button
            onClick={() => setItemToMove(null)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoadingFolders ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Destination
              </label>

              <div className="max-h-52 overflow-y-auto space-y-1 p-0.5">
                {itemToMove.type === 'folder' && (
                  <div
                    onClick={() => setSelectedDestination('root')}
                    className={`flex items-center space-x-2.5 p-2.5 rounded-xl cursor-pointer border transition-all ${
                      selectedDestination === 'root'
                        ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-white font-semibold'
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5 text-brand-500" />
                    <span className="text-xs">My Vault (Root)</span>
                  </div>
                )}

                {folders.length === 0 && itemToMove.type === 'file' ? (
                  <div className="p-4 text-center text-xs text-zinc-400">
                    No folders available.
                  </div>
                ) : (
                  folders.map((f) => (
                    <div
                      key={f._id}
                      onClick={() => setSelectedDestination(f._id)}
                      className={`flex items-center space-x-2.5 p-2.5 rounded-xl cursor-pointer border transition-all ${
                        selectedDestination === f._id
                          ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-white font-semibold'
                          : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <Folder className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-xs truncate">{f.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
              <button
                type="button"
                onClick={() => setItemToMove(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (!selectedDestination && itemToMove.type === 'file')}
                className="inline-flex items-center px-4 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white active:scale-95 disabled:opacity-50 text-white dark:text-zinc-900 text-xs font-semibold transition-all shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Moving...
                  </>
                ) : (
                  'Move'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MoveModal;
