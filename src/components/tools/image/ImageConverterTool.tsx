import React, { useState, useEffect, useRef } from 'react';
import { Download, Image as ImageIcon, CheckCircle2, Upload, RotateCcw } from 'lucide-react';

interface ImageConverterToolProps {
  forcedTargetFormat?: 'png' | 'jpeg' | 'webp';
}

export const ImageConverterTool: React.FC<ImageConverterToolProps> = ({
  forcedTargetFormat,
}) => {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp'>(
    forcedTargetFormat || 'png'
  );
  const [quality] = useState<number>(92);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync forcedTargetFormat if prop changes
  useEffect(() => {
    if (forcedTargetFormat) {
      setTargetFormat(forcedTargetFormat);
    }
  }, [forcedTargetFormat]);

  // Load a clean sample image on mount so the tool is 100% visible immediately
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, 1000, 700);
    grad.addColorStop(0, '#0d281e');
    grad.addColorStop(0.5, '#081c15');
    grad.addColorStop(1, '#05100c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1000, 700);

    // Decorative shape
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 60, 880, 580);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('IMAGE CONVERTER PREVIEW', 100, 320);

    ctx.fillStyle = '#34d399';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Select your file above to convert to ' + (targetFormat === 'jpeg' ? 'JPG' : targetFormat.toUpperCase()), 100, 380);

    const img = new Image();
    img.onload = () => {
      setSourceImg((prev) => prev || img);
    };
    img.src = canvas.toDataURL('image/png');
  }, [targetFormat]);

  // Handle uploaded file
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSourceFile(file);
    setConvertedBlob(null);
    setConvertedUrl(null);

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      setSourceImg(img);
    };
    img.src = objectUrl;
  };

  // Convert whenever sourceImg or targetFormat changes
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

        // White background for JPEG to prevent black transparent areas
        if (targetFormat === 'jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, w, h);
        }

        ctx.drawImage(sourceImg, 0, 0, w, h);

        const mimeType = `image/${targetFormat}`;
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setConvertedBlob(blob);
              if (convertedUrl) URL.revokeObjectURL(convertedUrl);
              setConvertedUrl(URL.createObjectURL(blob));
            }
            setIsProcessing(false);
          },
          mimeType,
          quality / 100
        );
      } catch (err) {
        console.error('Image conversion error', err);
        setIsProcessing(false);
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [sourceImg, targetFormat, quality]);

  // Direct Download Trigger
  const handleDownload = () => {
    if (!convertedUrl) return;
    const baseName = sourceFile
      ? sourceFile.name.substring(0, sourceFile.name.lastIndexOf('.'))
      : 'converted_image';
    const extension = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
    const a = document.createElement('a');
    a.href = convertedUrl;
    a.download = `${baseName}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatDisplay = targetFormat === 'jpeg' ? 'JPG' : targetFormat.toUpperCase();

  return (
    <div className="space-y-6">
      {/* 1. UPLOAD IMAGE BAR (ALWAYS VISIBLE) */}
      <div className="p-4 rounded-2xl liquid-glass border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white truncate max-w-xs">
              {sourceFile ? sourceFile.name : 'Upload Source Image'}
            </h4>
            <p className="text-xs text-slate-300">
              {sourceFile
                ? `Original: ${(sourceFile.size / 1024).toFixed(1)} KB • ${sourceImg?.naturalWidth} × ${sourceImg?.naturalHeight} px`
                : 'Select any PNG, JPG, or WebP to convert'}
            </p>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>{sourceFile ? 'Change Image' : 'Select Your Image'}</span>
          </button>
        </div>
      </div>

      {/* 2. TARGET FORMAT SELECTOR (ALWAYS VISIBLE) */}
      {!forcedTargetFormat && (
        <div className="p-4 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Target Output Format
          </span>
          <div className="flex gap-2">
            {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setTargetFormat(fmt)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                  targetFormat === fmt
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                {fmt === 'jpeg' ? 'JPG' : fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. LIVE PREVIEW & 4. DIRECT DOWNLOAD (ALWAYS VISIBLE) */}
      <div className="p-4 rounded-2xl liquid-glass border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Live Preview ({formatDisplay})
            </span>
          </div>
          {convertedBlob && (
            <span className="text-xs font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              Output Size: {(convertedBlob.size / 1024).toFixed(1)} KB
            </span>
          )}
        </div>

        {/* Preview Frame */}
        <div className="w-full max-h-[440px] rounded-xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center p-2">
          {isProcessing ? (
            <div className="py-20 text-center text-slate-400 text-xs animate-pulse">
              Converting image to {formatDisplay}...
            </div>
          ) : convertedUrl ? (
            <img
              src={convertedUrl}
              alt="Converted Preview"
              className="max-h-[400px] w-auto max-w-full object-contain rounded-lg shadow-xl"
            />
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              Preparing preview...
            </div>
          )}
        </div>

        {/* Single Direct Download Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!convertedUrl || isProcessing}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            <span>Download Converted {formatDisplay}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
