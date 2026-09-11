import React, { useState, useEffect, useRef } from 'react';
import { Download, Sparkles, Image as ImageIcon, ArrowDownRight, Upload } from 'lucide-react';

export const ImageCompressorTool: React.FC = () => {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const [quality, setQuality] = useState<number>(75);
  const [outputFormat, setOutputFormat] = useState<'jpeg' | 'webp'>('jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with sample image on mount so the tool is 100% visible immediately
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 1000, 700);
    grad.addColorStop(0, '#0d281e');
    grad.addColorStop(0.5, '#081c15');
    grad.addColorStop(1, '#05100c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1000, 700);

    ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 60, 880, 580);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('IMAGE COMPRESSOR PREVIEW', 100, 320);

    ctx.fillStyle = '#34d399';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Select any JPG, PNG, or WebP to compress in-browser', 100, 380);

    const img = new Image();
    img.onload = () => {
      setSourceImg((prev) => prev || img);
    };
    img.src = canvas.toDataURL('image/jpeg', 0.95);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSourceFile(file);
    setCompressedBlob(null);
    setCompressedUrl(null);

    const img = new Image();
    img.onload = () => setSourceImg(img);
    img.src = URL.createObjectURL(file);
  };

  // Real-time auto-compress
  useEffect(() => {
    if (!sourceImg) return;
    setIsProcessing(true);

    const timer = setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        const w = sourceImg.naturalWidth || sourceImg.width || 1000;
        const h = sourceImg.naturalHeight || sourceImg.height || 700;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (outputFormat === 'jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, w, h);
        }
        ctx.drawImage(sourceImg, 0, 0, w, h);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedBlob(blob);
              if (compressedUrl) URL.revokeObjectURL(compressedUrl);
              setCompressedUrl(URL.createObjectURL(blob));
            }
            setIsProcessing(false);
          },
          `image/${outputFormat}`,
          quality / 100
        );
      } catch (err) {
        console.error('Compression error:', err);
        setIsProcessing(false);
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [sourceImg, quality, outputFormat]);

  const handleDownload = () => {
    if (!compressedUrl) return;
    const baseName = sourceFile
      ? sourceFile.name.substring(0, sourceFile.name.lastIndexOf('.'))
      : 'compressed_image';
    const a = document.createElement('a');
    a.href = compressedUrl;
    a.download = `${baseName}_compressed.${outputFormat === 'jpeg' ? 'jpg' : 'webp'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const reductionPercent =
    sourceFile && compressedBlob
      ? Math.round(((sourceFile.size - compressedBlob.size) / sourceFile.size) * 100)
      : null;

  return (
    <div className="space-y-6">
      {/* File summary bar (Always Visible) */}
      <div className="p-4 rounded-2xl liquid-glass border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-white truncate max-w-sm">
              {sourceFile ? sourceFile.name : 'Upload Image to Compress'}
            </p>
            <p className="text-xs text-slate-300">
              {sourceFile
                ? `Original: ${(sourceFile.size / 1024).toFixed(1)} KB • ${sourceImg?.naturalWidth} × ${sourceImg?.naturalHeight} px`
                : 'Supports JPG, PNG, WebP • Smart client-side compression'}
            </p>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInput}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs sm:text-sm font-semibold transition-all shadow-sm"
        >
          <Upload className="w-4 h-4" />
          <span>{sourceFile ? 'Change Image' : 'Select Your Image'}</span>
        </button>
      </div>

      {/* Controls (Always Visible) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl liquid-glass border border-white/10">
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-200 mb-2">
            <span>Compression Quality</span>
            <span className="font-mono text-emerald-400">{quality}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="95"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>Smaller Size</span>
            <span>Higher Quality</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-200 mb-2">Output Format</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setOutputFormat('jpeg')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                outputFormat === 'jpeg'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
              }`}
            >
              JPG
            </button>
            <button
              type="button"
              onClick={() => setOutputFormat('webp')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                outputFormat === 'webp'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
              }`}
            >
              WebP (Best Compression)
            </button>
          </div>
        </div>
      </div>

      {/* Preview & Download (Always Visible) */}
      <div className="p-5 rounded-2xl liquid-glass border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Real-Time Compressed Preview
          </span>
          {compressedBlob && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                Size: {(compressedBlob.size / 1024).toFixed(1)} KB
              </span>
              {reductionPercent !== null && reductionPercent > 0 && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  {reductionPercent}% Saved
                </span>
              )}
            </div>
          )}
        </div>

        <div className="w-full max-h-[440px] rounded-xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center p-2">
          {isProcessing ? (
            <div className="py-20 text-center text-slate-400 text-xs animate-pulse">
              Compressing image...
            </div>
          ) : compressedUrl ? (
            <img
              src={compressedUrl}
              alt="Compressed Preview"
              className="max-h-[400px] w-auto max-w-full object-contain rounded-lg shadow-xl"
            />
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              Preparing compressed image...
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={!compressedUrl || isProcessing}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          <span>Download Compressed Image</span>
        </button>
      </div>
    </div>
  );
};
