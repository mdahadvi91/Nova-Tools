import React, { useState, useEffect, useRef } from 'react';
import { Download, RotateCw, FlipHorizontal, FlipVertical, Crop, Image as ImageIcon } from 'lucide-react';
import { FileUploader } from '../../common/FileUploader';
import { useApp } from '../../../context/AppContext';

export const ImageCropRotateTool: React.FC = () => {
  const { t } = useApp();
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);

  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [aspect, setAspect] = useState<'free' | '1:1' | '16:9' | '4:3' | '9:16'>('free');

  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSourceFile(file);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setAspect('free');

    const img = new Image();
    img.onload = () => setSourceImg(img);
    img.src = URL.createObjectURL(file);
  };

  const handleRotate90 = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (sourceImg) {
      let srcW = sourceImg.naturalWidth;
      let srcH = sourceImg.naturalHeight;

      // Calculate target crop dimensions
      let cropW = srcW;
      let cropH = srcH;
      let cropX = 0;
      let cropY = 0;

      if (aspect !== 'free') {
        const ratios: Record<string, number> = {
          '1:1': 1,
          '16:9': 16 / 9,
          '4:3': 4 / 3,
          '9:16': 9 / 16,
        };
        const targetRatio = ratios[aspect];
        const currentRatio = srcW / srcH;

        if (currentRatio > targetRatio) {
          cropW = srcH * targetRatio;
          cropX = (srcW - cropW) / 2;
        } else {
          cropH = srcW / targetRatio;
          cropY = (srcH - cropH) / 2;
        }
      }

      // Handle 90 / 270 degree rotation swapping width & height
      const isSwapped = rotation === 90 || rotation === 270;
      canvas.width = isSwapped ? cropH : cropW;
      canvas.height = isSwapped ? cropW : cropH;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      ctx.drawImage(
        sourceImg,
        cropX,
        cropY,
        cropW,
        cropH,
        -cropW / 2,
        -cropH / 2,
        cropW,
        cropH
      );
      ctx.restore();
    } else {
      // Demo placeholder canvas
      canvas.width = 800;
      canvas.height = 500;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 800, 500);

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, 720, 420);

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Interactive Transform & Crop Stage', 400, 240);
      ctx.font = '14px sans-serif';
      ctx.fillText('Select an image above to rotate, flip, and crop with precision', 400, 275);
    }

    setPreviewDataUrl(canvas.toDataURL('image/jpeg', 0.95));
  }, [sourceImg, rotation, flipH, flipV, aspect]);

  const handleDownload = () => {
    if (!previewDataUrl) return;
    const a = document.createElement('a');
    a.href = previewDataUrl;
    a.download = `transformed-${sourceFile?.name || 'image.jpg'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* File Uploader - Always visible */}
      <FileUploader
        accept="image/*"
        title="Upload Image to Crop or Rotate"
        subtitle="Supports 90° rotation, flipping, and aspect ratio crop presets."
        onFilesSelected={handleFiles}
      />

      {/* Selected File Status Banner */}
      {sourceFile && (
        <div className="p-4 rounded-2xl liquid-glass border border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white truncate max-w-sm">
                {sourceFile.name}
              </p>
              <p className="text-xs text-slate-300">
                Original Dimensions: {sourceImg?.naturalWidth} × {sourceImg?.naturalHeight} px
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSourceFile(null);
              setSourceImg(null);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
          >
            Change Image
          </button>
        </div>
      )}

      {/* Action Toolbar - ALWAYS VISIBLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl liquid-glass border border-white/10">
        {/* Rotation & Flips */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Orientation & Transform
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleRotate90}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotate 90° ({rotation}°)</span>
            </button>
            <button
              type="button"
              onClick={() => setFlipH(!flipH)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                flipH
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              <span>Flip Horizontal</span>
            </button>
            <button
              type="button"
              onClick={() => setFlipV(!flipV)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                flipV
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <FlipVertical className="w-3.5 h-3.5" />
              <span>Flip Vertical</span>
            </button>
          </div>
        </div>

        {/* Aspect Crop Presets */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Crop Presets
          </span>
          <div className="flex flex-wrap gap-2">
            {(['free', '1:1', '16:9', '4:3', '9:16'] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAspect(preset)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase border transition-all ${
                  aspect === preset
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                {preset === 'free' ? 'Original' : preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview Stage & Download - ALWAYS VISIBLE */}
      <div className="p-6 rounded-2xl liquid-glass border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Live Preview Stage
          </span>
          <span className="text-xs text-slate-400">
            Rotation: {rotation}° • Crop: {aspect.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center justify-center p-4 bg-black/40 rounded-xl overflow-hidden min-h-[300px] max-h-[500px]">
          {previewDataUrl && (
            <img
              src={previewDataUrl}
              alt="Transformed Preview"
              className="max-h-[460px] max-w-full rounded-lg shadow-xl object-contain border border-white/10"
            />
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{t.actions.download} (Processed Image)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
