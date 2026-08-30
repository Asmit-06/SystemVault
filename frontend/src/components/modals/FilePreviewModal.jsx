import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  ExternalLink,
  Check,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { useToast } from '../../context/ToastContext';
import { formatBytes, formatDate } from '../../utils/formatters';
import { getFileTypeCategory, getFileIcon } from '../../utils/fileIcons';
import fileService from '../../services/fileService';

export const FilePreviewModal = () => {
  const { previewFile, setPreviewFile } = useVault();
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!previewFile) return null;

  const category = getFileTypeCategory(previewFile);

  const handleCopyLink = () => {
    if (previewFile.fileUrl) {
      navigator.clipboard.writeText(previewFile.fileUrl);
      setCopied(true);
      toast.success('Link copied');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await fileService.downloadFile(previewFile._id, previewFile.name);
      toast.success('Download started');
    } catch {
      toast.error('Failed to download');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-4xl max-h-[88vh] bg-white dark:bg-dark-card border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-dark-surface/50">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              {getFileIcon(previewFile, 'w-4 h-4')}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white truncate">
                {previewFile.name}
              </h3>
              <p className="text-[10px] text-zinc-400">
                {formatBytes(previewFile.size)} • {formatDate(previewFile.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleCopyLink}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Copy Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={() => setPreviewFile(null)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Preview Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-zinc-100/50 dark:bg-[#09090b]/80 min-h-[300px]">
          {category === 'image' && (
            <div className="relative max-h-full flex flex-col items-center">
              <img
                src={previewFile.fileUrl}
                alt={previewFile.name}
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                className="max-h-[55vh] max-w-full object-contain rounded-xl shadow-md transition-transform duration-200"
              />
              <div className="mt-3 flex items-center space-x-2 bg-zinc-900/90 text-white px-2.5 py-1 rounded-full text-[11px] backdrop-blur-sm">
                <button
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  className="hover:text-zinc-300 p-0.5"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span>{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  className="hover:text-zinc-300 p-0.5"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {category === 'video' && (
            <div className="w-full max-w-2xl flex justify-center">
              <video
                controls
                autoPlay
                className="max-h-[55vh] w-full rounded-2xl shadow-xl bg-black"
                src={previewFile.fileUrl}
              >
                Video playback not supported.
              </video>
            </div>
          )}

          {category === 'audio' && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-xl flex flex-col items-center max-w-sm w-full">
              <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center mb-3">
                {getFileIcon(previewFile, 'w-7 h-7')}
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-3 text-center truncate w-full">
                {previewFile.name}
              </h4>
              <audio controls className="w-full" src={previewFile.fileUrl}>
                Audio playback not supported.
              </audio>
            </div>
          )}

          {category === 'pdf' && (
            <div className="w-full h-[60vh] rounded-2xl overflow-hidden shadow-md border border-zinc-200 dark:border-zinc-800">
              <iframe
                src={`${previewFile.fileUrl}#toolbar=1`}
                title={previewFile.name}
                className="w-full h-full bg-white"
              />
            </div>
          )}

          {category === 'other' || category === 'archive' || category === 'document' || category === 'spreadsheet' || category === 'presentation' || category === 'code' ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-xl flex flex-col items-center max-w-sm w-full text-center">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                {getFileIcon(previewFile, 'w-7 h-7')}
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1 truncate max-w-xs">
                {previewFile.name}
              </h4>
              <p className="text-xs text-zinc-400 mb-5">
                Preview not available for this file type ({previewFile.mimeType}).
              </p>
              <button
                onClick={handleDownload}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download File</span>
              </button>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-dark-surface/50 flex items-center justify-between text-[11px] text-zinc-400">
          <span>Type: <strong className="text-zinc-700 dark:text-zinc-300 font-medium">{previewFile.mimeType}</strong></span>
          <a
            href={previewFile.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          >
            <span>Open raw</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
