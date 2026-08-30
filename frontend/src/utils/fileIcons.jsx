import React from 'react';
import {
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Code,
  FileSpreadsheet,
  Presentation,
  FileCheck,
  FileQuestion,
  Folder as FolderIcon
} from 'lucide-react';

export const getFileTypeCategory = (file) => {
  const mimeType = file?.mimeType || file?.fileType || '';
  const name = file?.name || '';
  const ext = name.split('.').pop()?.toLowerCase() || '';

  if (mimeType.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext)) {
    return 'image';
  }
  if (mimeType.startsWith('video/') || ['mp4', 'mkv', 'webm', 'mov', 'avi'].includes(ext)) {
    return 'video';
  }
  if (mimeType.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'].includes(ext)) {
    return 'audio';
  }
  if (mimeType === 'application/pdf' || ext === 'pdf') {
    return 'pdf';
  }
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext) || mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('compressed')) {
    return 'archive';
  }
  if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'py', 'java', 'c', 'cpp', 'rs', 'go', 'php', 'rb', 'sql', 'sh', 'xml', 'yaml', 'yml', 'md'].includes(ext)) {
    return 'code';
  }
  if (['xls', 'xlsx', 'csv'].includes(ext) || mimeType.includes('sheet') || mimeType.includes('csv') || mimeType.includes('excel')) {
    return 'spreadsheet';
  }
  if (['ppt', 'pptx'].includes(ext) || mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
    return 'presentation';
  }
  if (['doc', 'docx', 'txt', 'rtf', 'odt'].includes(ext) || mimeType.includes('word') || mimeType.includes('document') || mimeType.startsWith('text/')) {
    return 'document';
  }

  return 'other';
};

export const getFileIcon = (file, className = "w-6 h-6") => {
  const category = getFileTypeCategory(file);

  switch (category) {
    case 'image':
      return <Image className={`${className} text-emerald-500 dark:text-emerald-400`} />;
    case 'video':
      return <Video className={`${className} text-indigo-500 dark:text-indigo-400`} />;
    case 'audio':
      return <Music className={`${className} text-pink-500 dark:text-pink-400`} />;
    case 'pdf':
      return <FileText className={`${className} text-rose-500 dark:text-rose-400`} />;
    case 'archive':
      return <Archive className={`${className} text-amber-500 dark:text-amber-400`} />;
    case 'code':
      return <Code className={`${className} text-cyan-500 dark:text-cyan-400`} />;
    case 'spreadsheet':
      return <FileSpreadsheet className={`${className} text-emerald-600 dark:text-emerald-400`} />;
    case 'presentation':
      return <Presentation className={`${className} text-orange-500 dark:text-orange-400`} />;
    case 'document':
      return <FileCheck className={`${className} text-violet-500 dark:text-violet-400`} />;
    default:
      return <FileQuestion className={`${className} text-zinc-400 dark:text-zinc-500`} />;
  }
};

export const isPreviewable = (file) => {
  const category = getFileTypeCategory(file);
  return ['image', 'video', 'audio', 'pdf', 'code'].includes(category);
};
