import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Download, Hash, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { FileUploader } from '../../common/FileUploader';
import { useApp } from '../../../context/AppContext';

export const PageNumberPdfTool: React.FC = () => {
  const { t } = useApp();
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [position, setPosition] = useState<'bottom-center' | 'bottom-right' | 'top-right'>('bottom-center');
  const [format, setFormat] = useState<'page_x_of_y' | 'x_slash_y' | 'num_only'>('page_x_of_y');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [numberedBlobUrl, setNumberedBlobUrl] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    setSourceFile(files[0]);
    setNumberedBlobUrl(null);
  };

  const handleAddPageNumbers = async () => {
    if (!sourceFile) return;
    setIsProcessing(true);

    try {
      const buffer = await sourceFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const totalPages = pdfDoc.getPageCount();

      const pages = pdfDoc.getPages();

      pages.forEach((page, index) => {
        const pageNum = index + 1;
        const { width, height } = page.getSize();
        const fontSize = 10;

        let label = '';
        if (format === 'page_x_of_y') {
          label = `Page ${pageNum} of ${totalPages}`;
        } else if (format === 'x_slash_y') {
          label = `${pageNum} / ${totalPages}`;
        } else {
          label = `${pageNum}`;
        }

        const textWidth = font.widthOfTextAtSize(label, fontSize);
        let x = width / 2 - textWidth / 2;
        let y = 25;

        if (position === 'bottom-right') {
          x = width - textWidth - 36;
          y = 25;
        } else if (position === 'top-right') {
          x = width - textWidth - 36;
          y = height - 35;
        }

        page.drawText(label, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setNumberedBlobUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Page numbering error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!numberedBlobUrl) return;
    const a = document.createElement('a');
    a.href = numberedBlobUrl;
    a.download = `numbered-${sourceFile?.name || 'document.pdf'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* File Uploader - Always visible */}
      <FileUploader
        accept=".pdf,application/pdf"
        title="Upload PDF to Insert Page Numbers"
        subtitle="Automatically stamp clean, professional page numbering across all pages."
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
                {(sourceFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSourceFile(null);
              setNumberedBlobUrl(null);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
          >
            Clear File
          </button>
        </div>
      )}

      {/* Numbering options - ALWAYS VISIBLE */}
      <div className="p-6 rounded-2xl liquid-glass border border-white/10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
              Placement Position
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'bottom-center', label: 'Bottom Center' },
                { id: 'bottom-right', label: 'Bottom Right' },
                { id: 'top-right', label: 'Top Right' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPosition(p.id as any);
                    setNumberedBlobUrl(null);
                  }}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all ${
                    position === p.id
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
              Numbering Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'page_x_of_y', label: 'Page X of Y' },
                { id: 'x_slash_y', label: 'X / Y' },
                { id: 'num_only', label: 'X (Number)' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setFormat(f.id as any);
                    setNumberedBlobUrl(null);
                  }}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all ${
                    format === f.id
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action and Download controls - ALWAYS VISIBLE */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleAddPageNumbers}
            disabled={!sourceFile || isProcessing}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Hash className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Applying Numbers...' : 'Insert Page Numbers'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!numberedBlobUrl}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-slate-900 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/40 shadow-lg active:scale-95 transition-all disabled:opacity-35 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>
              {numberedBlobUrl ? t.actions.download : 'Download Numbered PDF (Ready on Apply)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
