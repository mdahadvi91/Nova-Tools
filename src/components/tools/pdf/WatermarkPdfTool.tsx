import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { Download, Stamp, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { FileUploader } from '../../common/FileUploader';
import { useApp } from '../../../context/AppContext';

export const WatermarkPdfTool: React.FC = () => {
  const { t } = useApp();
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(25);
  const [fontSize, setFontSize] = useState(48);
  const [angle, setAngle] = useState<'diagonal' | 'horizontal'>('diagonal');
  const [color, setColor] = useState<'gray' | 'red' | 'blue'>('gray');
  const [isProcessing, setIsProcessing] = useState(false);
  const [watermarkedBlobUrl, setWatermarkedBlobUrl] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    setSourceFile(files[0]);
    setWatermarkedBlobUrl(null);
  };

  const handleAddWatermark = async () => {
    if (!sourceFile || !watermarkText.trim()) return;
    setIsProcessing(true);

    try {
      const buffer = await sourceFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      let textColor = rgb(0.5, 0.5, 0.5);
      if (color === 'red') textColor = rgb(0.85, 0.15, 0.15);
      if (color === 'blue') textColor = rgb(0.15, 0.45, 0.85);

      const alpha = opacity / 100;
      const rotationAngle = angle === 'diagonal' ? 45 : 0;

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        // Center calculation
        const x = width / 2 - (textWidth / 2) * Math.cos((rotationAngle * Math.PI) / 180);
        const y = height / 2 - (textHeight / 2);

        page.drawText(watermarkText, {
          x,
          y,
          size: fontSize,
          font,
          color: textColor,
          opacity: alpha,
          rotate: degrees(rotationAngle),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setWatermarkedBlobUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Watermark error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!watermarkedBlobUrl) return;
    const a = document.createElement('a');
    a.href = watermarkedBlobUrl;
    a.download = `watermarked-${sourceFile?.name || 'document.pdf'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* File Uploader - Always visible */}
      <FileUploader
        accept=".pdf,application/pdf"
        title="Upload PDF to Apply Watermark"
        subtitle="Add custom text watermarks across every page with opacity and angle controls."
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
              setWatermarkedBlobUrl(null);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
          >
            Clear File
          </button>
        </div>
      )}

      {/* Watermark controls - ALWAYS VISIBLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl liquid-glass border border-white/10">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5">
              Watermark Text
            </label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => {
                setWatermarkText(e.target.value);
                setWatermarkedBlobUrl(null);
              }}
              placeholder="e.g. CONFIDENTIAL or DRAFT"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1.5">
              <span>Transparency / Opacity</span>
              <span className="text-emerald-400">{opacity}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="90"
              value={opacity}
              onChange={(e) => {
                setOpacity(Number(e.target.value));
                setWatermarkedBlobUrl(null);
              }}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1.5">
              <span>Font Size</span>
              <span className="text-emerald-400">{fontSize} pt</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={fontSize}
              onChange={(e) => {
                setFontSize(Number(e.target.value));
                setWatermarkedBlobUrl(null);
              }}
              className="w-full accent-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Orientation Angle
              </label>
              <select
                value={angle}
                onChange={(e) => {
                  setAngle(e.target.value as any);
                  setWatermarkedBlobUrl(null);
                }}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="diagonal" className="bg-slate-900">Diagonal 45°</option>
                <option value="horizontal" className="bg-slate-900">Horizontal 0°</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Watermark Color
              </label>
              <select
                value={color}
                onChange={(e) => {
                  setColor(e.target.value as any);
                  setWatermarkedBlobUrl(null);
                }}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="gray" className="bg-slate-900">Neutral Gray</option>
                <option value="red" className="bg-slate-900">Urgent Red</option>
                <option value="blue" className="bg-slate-900">Corporate Blue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Text Stamp Preview */}
        <div className="md:col-span-2 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center min-h-[70px] relative overflow-hidden">
          <div
            className={`font-bold tracking-widest uppercase select-none pointer-events-none transition-all ${
              color === 'red' ? 'text-red-500' : color === 'blue' ? 'text-blue-400' : 'text-slate-400'
            }`}
            style={{
              opacity: opacity / 100,
              fontSize: `${Math.min(fontSize, 36)}px`,
              transform: angle === 'diagonal' ? 'rotate(-15deg)' : 'none',
            }}
          >
            {watermarkText || 'WATERMARK PREVIEW'}
          </div>
        </div>

        {/* Action and Download controls - ALWAYS VISIBLE */}
        <div className="md:col-span-2 pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleAddWatermark}
            disabled={!sourceFile || isProcessing || !watermarkText.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Stamp className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Stamping Watermark...' : 'Apply Watermark Now'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!watermarkedBlobUrl}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-slate-900 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/40 shadow-lg active:scale-95 transition-all disabled:opacity-35 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>{watermarkedBlobUrl ? t.actions.download : 'Download Watermarked PDF (Ready on Apply)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
