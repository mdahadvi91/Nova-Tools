import React, { useRef, useState } from 'react';
import { Upload, File, AlertCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { trackFileUpload } from '../../lib/analytics';

interface FileUploaderProps {
  accept: string;
  multiple?: boolean;
  maxSizeBytes?: number;
  onFilesSelected: (files: File[]) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  accept,
  multiple = false,
  maxSizeBytes = 50 * 1024 * 1024, // 50MB safe default
  onFilesSelected,
  title,
  subtitle,
  className = '',
}) => {
  const { t, navState } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateAndPassFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);

    const validFiles: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > maxSizeBytes) {
        const mb = Math.round(maxSizeBytes / (1024 * 1024));
        setErrorMessage(`"${file.name}" exceeds the maximum allowable size of ${mb}MB.`);
        continue;
      }
      validFiles.push(file);
      if (!multiple) break;
    }

    if (validFiles.length > 0) {
      validFiles.forEach((file) => {
        trackFileUpload(
          navState.toolId || 'general_upload',
          file.type || file.name.split('.').pop() || 'application/octet-stream',
          file.size
        );
      });
      onFilesSelected(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndPassFiles(e.dataTransfer.files);
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition-all duration-200 liquid-glass group ${
          isDragging
            ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500/60 hover:bg-white/80 dark:hover:bg-slate-800/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => validateAndPassFiles(e.target.files)}
          className="hidden"
          aria-label={title || t.actions.upload}
        />

        <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-100">
              {title || t.actions.dragDrop}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {subtitle || `Supported formats: ${accept.replace(/\./g, ' ').toUpperCase()}`}
            </p>
          </div>
          <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white shadow-sm group-hover:bg-emerald-500 transition-colors">
            {t.actions.browse}
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="p-1 hover:text-red-800 dark:hover:text-red-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
