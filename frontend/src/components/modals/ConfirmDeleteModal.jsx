import React, { useState } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { useVault } from '../../context/VaultContext';

export const ConfirmDeleteModal = () => {
  const { itemToDelete, setItemToDelete, handleDelete } = useVault();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!itemToDelete) return null;

  const { type, item, isPermanent, onConfirmPermanent } = itemToDelete;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      if (isPermanent && onConfirmPermanent) {
        await onConfirmPermanent();
      } else {
        await handleDelete(type, item._id, item.name);
      }
      setItemToDelete(null);
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
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                {isPermanent ? `Permanently Delete` : `Move to Trash`}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setItemToDelete(null)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="my-4">
          <p className="text-xs text-zinc-600 dark:text-zinc-300">
            Are you sure you want to {isPermanent ? 'permanently delete' : 'move'}{' '}
            <strong className="text-zinc-900 dark:text-white font-semibold">
              "{item?.name}"
            </strong>{' '}
            {isPermanent ? '?' : 'to trash?'}
          </p>

          {isPermanent ? (
            <div className="mt-2.5 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-[11px] text-rose-700 dark:text-rose-300">
              ⚠️ This will delete the file permanently from cloud storage. This cannot be undone.
            </div>
          ) : (
            <p className="mt-1.5 text-[11px] text-zinc-400">
              You can restore it anytime from Trash.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={() => setItemToDelete(null)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Deleting...
              </>
            ) : isPermanent ? (
              'Delete Forever'
            ) : (
              'Move to Trash'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
