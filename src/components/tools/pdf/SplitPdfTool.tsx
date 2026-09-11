import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Download, Scissors, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { FileUploader } from '../../common/FileUploader';
import { useApp } from '../../../context/AppContext';

export const SplitPdfTool: React.FC = () => {
  const { t } = useApp();
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageRangeInput, setPageRangeInput] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [splitBlobUrl, setSplitBlobUrl] = useState<string | null>(null);
  const [extractedCount, setExtractedCount] = useState<number>(0);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSourceFile(file);
    setSplitBlobUrl(null);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = doc.getPageCount();
      setTotalPages(count);
      setPageRangeInput(count > 1 ? `1-${Math.min(count, 3)}` : '1');
    } catch (err) {
      console.error('Error reading PDF:', err);
    }
  };

  const parsePageIndices = (input: string, max: number): number[] => {
    const indices = new Set<number>();
    const parts = input.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const minVal = Math.max(1, Math.min(start, end));
          const maxVal = Math.min(max, Math.max(start, end));
          for (let i = minVal; i <= maxVal; i++) {
            indices.add(i - 1);
          }
        }
      } else {
        const pageNum = parseInt(trimmed, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= max) {
          indices.add(pageNum - 1);
        }
      }
    }

    return Array.from(indices).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!sourceFile || totalPages === 0) return;
    setIsProcessing(true);

    try {
      const targetIndices = parsePageIndices(pageRangeInput, totalPages);
      if (targetIndices.length === 0) {
        setIsProcessing(false);
        return;
      }

      const fileBuffer = await sourceFile.arrayBuffer();
      const srcDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();

      const copiedPages = await newDoc.copyPages(srcDoc, targetIndices);
      copiedPages.forEach((page) => newDoc.addPage(page));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setSplitBlobUrl(URL.createObjectURL(blob));
      setExtractedCount(targetIndices.length);
    } catch (err) {
      console.error('Split error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!splitBlobUrl) return;
    const a = document.createElement('a');
    a.href = splitBlobUrl;
    a.download = `extracted-pages-${sourceFile?.name || 'document.pdf'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* File Uploader - Always visible */}
      <FileUploader
        accept=".pdf,application/pdf"
        title="Upload PDF to Split or Extract Pages"
        subtitle="Select any PDF document. Extract individual pages or custom ranges with full privacy."
        onFilesSelected={handleFiles}
      />

      {/* Selected File Status Banner */}
      {sourceFile && (
        <div className="p-4 rounded-2xl liquid-glass border border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white truncate max-w-sm">
                {sourceFile.name}
              </p>
              <p className="text-xs text-slate-300">
                Total Pages: {totalPages} • {(sourceFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSourceFile(null);
              setTotalPages(0);
              setSplitBlobUrl(null);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
          >
            Clear File
          </button>
        </div>
      )}

      {/* Page Selection Controls - ALWAYS VISIBLE */}
      <div className="p-6 rounded-2xl liquid-glass border border-white/10 space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
          Pages to Extract {totalPages > 0 ? `(1 to ${totalPages})` : '(e.g. 1-3, 5)'}
        </label>
        <input
          type="text"
          value={pageRangeInput}
          onChange={(e) => setPageRangeInput(e.target.value)}
          placeholder="e.g. 1-2, 4, 6-8"
          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-mono text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-slate-500"
        />

        {/* Quick Range Presets */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-xs text-slate-400 self-center me-1">Quick Select:</span>
          {[
            { label: 'Page 1 Only', value: '1' },
            { label: 'Pages 1-3', value: '1-3' },
            { label: 'First & Last', value: totalPages > 1 ? `1, ${totalPages}` : '1' },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setPageRangeInput(preset.value)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-400">
          Format: Use commas for individual pages (e.g. <code>1, 3, 5</code>) and hyphens for page intervals (e.g. <code>2-4</code>).
        </p>

        {/* Action and Download controls - ALWAYS VISIBLE */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleSplit}
            disabled={!sourceFile || isProcessing || !pageRangeInput.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Scissors className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Extracting...' : 'Extract Pages Now'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!splitBlobUrl}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-slate-900 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/40 shadow-lg active:scale-95 transition-all disabled:opacity-35 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>
              {splitBlobUrl
                ? `Download Extracted PDF (${extractedCount} Pages)`
                : 'Download Extracted PDF (Ready on Extract)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
