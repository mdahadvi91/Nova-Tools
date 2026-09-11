import React, { useState, useEffect, useRef } from 'react';
import { Download, RefreshCw, Maximize2, Lock, Unlock, Image as ImageIcon, Upload } from 'lucide-react';

export const ImageResizerTool: React.FC = () => {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);

  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);

  const [isProcessing, setIsProcessing] = useState(false);
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with sample image on mount so everything is visible immediately
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, '#0d281e');
    grad.addColorStop(0.5, '#081c15');
    grad.addColorStop(1, '#05100c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);

    ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 60, 1080, 680);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('IMAGE RESIZER PREVIEW', 100, 360);

    ctx.fillStyle = '#34d399';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Custom Pixel Dimensions • Aspect Ratio Lock • Fast In-Browser Scaling', 100, 420);

    const img = new Image();
    img.onload = () => {
      setSourceImg((prev) => prev || img);
      setWidth(1200);
      setHeight(800);
      setAspectRatio(1200 / 800);
    };
    img.src = canvas.toDataURL('image/jpeg', 0.95);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSourceFile(file);
    setResizedBlob(null);
    setResizedUrl(null);

    const img = new Image();
    img.onload = () => {
      setSourceImg(img);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect && aspectRatio > 0) {
      setHeight(Math.round(val / aspectRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect && aspectRatio > 0) {
      setWidth(Math.round(val * aspectRatio));
    }
  };

  // Real-time resize processing
  useEffect(() => {
    if (!sourceImg || width <= 0 || height <= 0) return;
    setIsProcessing(true);

    const timer = setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(sourceImg, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setResizedBlob(blob);
              if (resizedUrl) URL.revokeObjectURL(resizedUrl);
              setResizedUrl(URL.createObjectURL(blob));
            }
            setIsProcessing(false);
          },
          'image/jpeg',
          0.92
        );
      } catch (err) {
        console.error('Resize error:', err);
        setIsProcessing(false);
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [sourceImg, width, height]);

  const handleDownload = () => {
    if (!resizedUrl) return;
    const baseName = sourceFile
      ? sourceFile.name.substring(0, sourceFile.name.lastIndexOf('.'))
      : 'resized_image';
    const a = document.createElement('a');
    a.href = resizedUrl;
    a.download = `${baseName}_${width}x${height}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const applyPreset = (presetW: number, presetH: number) => {
    setWidth(presetW);
    setHeight(presetH);
    if (lockAspect) {
      setAspectRatio(presetW / presetH);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Header Bar (Always Visible) */}
      <div className="p-4 rounded-2xl liquid-glass border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-white truncate max-w-sm">
              {sourceFile ? sourceFile.name : 'Upload Image to Resize'}
            </p>
            <p className="text-xs text-slate-300">
              {sourceFile
                ? `Original: ${sourceImg?.naturalWidth} × ${sourceImg?.naturalHeight} px`
                : 'Custom pixel dimensions, social presets, aspect ratio lock'}
            </p>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
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

      {/* Presets Bar (Always Visible) */}
      <div className="space-y-2 p-4 rounded-2xl liquid-glass border border-white/10">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Popular Presets</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Full HD (1080p)', w: 1920, h: 1080 },
            { label: 'HD (720p)', w: 1280, h: 720 },
            { label: 'Square (1:1)', w: 1080, h: 1080 },
            { label: 'Instagram Story (9:16)', w: 1080, h: 1920 },
            { label: 'Thumbnail (16:9)', w: 1280, h: 720 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset.w, preset.h)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/5 text-slate-200 hover:text-white transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dimension Inputs (Always Visible) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl liquid-glass border border-white/10">
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-2">Width (px)</label>
          <input
            type="number"
            min="10"
            max="10000"
            value={width}
            onChange={(e) => handleWidthChange(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-200 mb-2">Height (px)</label>
          <input
            type="number"
            min="10"
            max="10000"
            value={height}
            onChange={(e) => handleHeightChange(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="md:col-span-2 flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => setLockAspect(!lockAspect)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              lockAspect
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-white/5 text-slate-400 border border-white/5'
            }`}
          >
            {lockAspect ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>Lock Aspect Ratio</span>
          </button>
          <span className="text-xs font-mono text-emerald-400">
            Current: {width} × {height} px
          </span>
        </div>
      </div>

      {/* Preview & Download (Always Visible) */}
      <div className="p-5 rounded-2xl liquid-glass border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Resized Live Preview
          </span>
          {resizedBlob && (
            <span className="text-xs font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              Output: {(resizedBlob.size / 1024).toFixed(1)} KB
            </span>
          )}
        </div>

        <div className="w-full max-h-[440px] rounded-xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center p-2">
          {isProcessing ? (
            <div className="py-20 text-center text-slate-400 text-xs animate-pulse">
              Resizing image...
            </div>
          ) : resizedUrl ? (
            <img
              src={resizedUrl}
              alt="Resized Preview"
              className="max-h-[400px] w-auto max-w-full object-contain rounded-lg shadow-xl"
            />
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">Preparing preview...</div>
          )}
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={!resizedUrl || isProcessing}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          <span>Download Resized Image ({width} × {height} px)</span>
        </button>
      </div>
    </div>
  );
};
