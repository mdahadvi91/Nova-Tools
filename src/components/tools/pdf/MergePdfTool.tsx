import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Download, Files, Trash2, ArrowUp, ArrowDown, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { FileUploader } from '../../common/FileUploader';
import { useApp } from '../../../context/AppContext';

interface UploadedPdfItem {
  id: string;
  file: File;
  pageCount?: number;
}

export const MergePdfTool: React.FC = () => {
  const { t } = useApp();
  const [items, setItems] = useState<UploadedPdfItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);

  const handleFiles = async (files: File[]) => {
    const newItems: UploadedPdfItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let pageCount: number | undefined;
      try {
        const buffer = await file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        pageCount = doc.getPageCount();
      } catch (err) {
        console.warn('Could not read page count for', file.name, err);
      }

      newItems.push({
        id: `${Date.now()}-${i}`,
        file,
        pageCount,
      });
    }

    setItems((prev) => [...prev, ...newItems]);
    setMergedBlobUrl(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === items.length - 1)
    )
      return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setItems(updated);
    setMergedBlobUrl(null);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setMergedBlobUrl(null);
  };

  const handleMerge = async () => {
    if (items.length < 2) return;
    setIsProcessing(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of items) {
        const fileBuffer = await item.file.arrayBuffer();
        const srcDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      setMergedBlobUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Merge error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!mergedBlobUrl) return;
    const a = document.createElement('a');
    a.href = mergedBlobUrl;
    a.download = `nova-merged-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* File Uploader - Always visible */}
      <FileUploader
        accept=".pdf,application/pdf"
        multiple
        title="Upload PDF Files to Merge"
        subtitle="Select two or more PDF documents. Files are processed entirely in your browser."
        onFilesSelected={handleFiles}
      />

      {/* Reorder and Configuration Zone - ALWAYS VISIBLE */}
      <div className="space-y-4 p-5 rounded-2xl liquid-glass border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Selected Documents Queue ({items.length} Files)
            </h3>
            <p className="text-xs text-slate-400">
              Drag or use arrows to adjust document merge sequence
            </p>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setItems([]);
                setMergedBlobUrl(null);
              }}
              className="text-xs text-red-400 hover:underline font-semibold"
            >
              Clear All
            </button>
          )}
        </div>

        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 transition-all"
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <FileText className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div className="truncate">
                    <p className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                      {item.file.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {(item.file.size / 1024).toFixed(1)} KB{' '}
                      {item.pageCount ? `• ${item.pageCount} pages` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveItem(index, 'up')}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 disabled:opacity-30"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(index, 'down')}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 disabled:opacity-30"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-dashed border-white/10 text-center space-y-2 text-slate-400">
            <FileText className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
            <p className="text-xs font-semibold">
              No files currently loaded in queue. Upload 2 or more PDF files above to assemble.
            </p>
          </div>
        )}

        {/* Action and Download controls - ALWAYS VISIBLE */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleMerge}
            disabled={items.length < 2 || isProcessing}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Files className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Merging PDFs...' : `Merge ${items.length > 0 ? items.length : 'PDF'} Files`}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!mergedBlobUrl}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-slate-900 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/40 shadow-lg active:scale-95 transition-all disabled:opacity-35 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>{mergedBlobUrl ? t.actions.download : 'Download Merged PDF (Ready on Merge)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
