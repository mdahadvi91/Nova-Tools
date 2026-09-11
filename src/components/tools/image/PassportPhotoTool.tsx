import React, { useState, useEffect } from 'react';
import { Download, Camera, Sliders, CheckCircle2 } from 'lucide-react';
import { FileUploader } from '../../common/FileUploader';
import { useApp } from '../../../context/AppContext';

interface CountryPreset {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  widthPx: number; // 300 DPI
  heightPx: number;
  headRatioMin: number;
  headRatioMax: number;
}

const PASSPORT_PRESETS: CountryPreset[] = [
  {
    id: 'us',
    name: 'United States & Americas (2×2 in / 51×51 mm)',
    widthMm: 51,
    heightMm: 51,
    widthPx: 600,
    heightPx: 600,
    headRatioMin: 0.5,
    headRatioMax: 0.69,
  },
  {
    id: 'uk_eu',
    name: 'UK, Europe & Schengen (35×45 mm)',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    headRatioMin: 0.7,
    headRatioMax: 0.8,
  },
  {
    id: 'india',
    name: 'India Passport & Visa (35×45 mm / 51×51 mm)',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    headRatioMin: 0.7,
    headRatioMax: 0.8,
  },
  {
    id: 'canada',
    name: 'Canada Passport (50×70 mm)',
    widthMm: 50,
    heightMm: 70,
    widthPx: 590,
    heightPx: 826,
    headRatioMin: 0.44,
    headRatioMax: 0.51,
  },
  {
    id: 'australia',
    name: 'Australia & New Zealand (35×45 mm)',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    headRatioMin: 0.71,
    headRatioMax: 0.8,
  },
  {
    id: 'china',
    name: 'China Passport & Visa (33×48 mm)',
    widthMm: 33,
    heightMm: 48,
    widthPx: 390,
    heightPx: 567,
    headRatioMin: 0.58,
    headRatioMax: 0.68,
  },
];

export const PassportPhotoTool: React.FC = () => {
  const { t } = useApp();
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);

  const [selectedPreset, setSelectedPreset] = useState<CountryPreset>(PASSPORT_PRESETS[0]);
  const [zoom, setZoom] = useState<number>(1);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [bgColor, setBgColor] = useState<'white' | 'light_gray' | 'light_blue' | 'original'>('white');
  const [sheetMode, setSheetMode] = useState<'single' | '4x6_grid'>('single');

  const [singlePreviewUrl, setSinglePreviewUrl] = useState<string | null>(null);
  const [sheetPreviewUrl, setSheetPreviewUrl] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSourceFile(file);
    setZoom(1);
    setPanX(0);
    setPanY(0);

    const img = new Image();
    img.onload = () => setSourceImg(img);
    img.src = URL.createObjectURL(file);
  };

  // Render cropped single passport canvas
  useEffect(() => {
    const { widthPx, heightPx } = selectedPreset;
    const canvas = document.createElement('canvas');
    canvas.width = widthPx;
    canvas.height = heightPx;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background color
    if (bgColor === 'white') ctx.fillStyle = '#FFFFFF';
    else if (bgColor === 'light_gray') ctx.fillStyle = '#E5E7EB';
    else if (bgColor === 'light_blue') ctx.fillStyle = '#E0F2FE';
    else ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, widthPx, heightPx);

    if (sourceImg) {
      // Filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

      // Scale and center with pan & zoom
      const imgAspect = sourceImg.naturalWidth / sourceImg.naturalHeight;
      const targetAspect = widthPx / heightPx;

      let drawW = widthPx * zoom;
      let drawH = heightPx * zoom;

      if (imgAspect > targetAspect) {
        drawW = drawH * imgAspect;
      } else {
        drawH = drawW / imgAspect;
      }

      const drawX = (widthPx - drawW) / 2 + panX;
      const drawY = (heightPx - drawH) / 2 + panY;

      ctx.drawImage(sourceImg, drawX, drawY, drawW, drawH);
    } else {
      // Demo avatar placeholder
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(widthPx / 2, heightPx * 0.42, widthPx * 0.22, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(widthPx / 2, heightPx * 0.95, widthPx * 0.42, Math.PI, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Sample Portrait', widthPx / 2, heightPx * 0.45);
    }

    setSinglePreviewUrl(canvas.toDataURL('image/jpeg', 0.95));
  }, [sourceImg, selectedPreset, zoom, panX, panY, brightness, contrast, bgColor]);

  // Generate 4x6 inch printable grid sheet
  useEffect(() => {
    if (!singlePreviewUrl) return;

    const sheetCanvas = document.createElement('canvas');
    // 4x6 inches at 300 DPI is 1200 x 1800 or 1800 x 1200
    sheetCanvas.width = 1800;
    sheetCanvas.height = 1200;
    const sCtx = sheetCanvas.getContext('2d');
    if (!sCtx) return;

    sCtx.fillStyle = '#FFFFFF';
    sCtx.fillRect(0, 0, 1800, 1200);

    const singleImg = new Image();
    singleImg.onload = () => {
      const pW = selectedPreset.widthPx;
      const pH = selectedPreset.heightPx;

      const cols = Math.floor((1800 - 100) / (pW + 40));
      const rows = Math.floor((1200 - 100) / (pH + 40));

      const marginX = (1800 - (cols * pW + (cols - 1) * 40)) / 2;
      const marginY = (1200 - (rows * pH + (rows - 1) * 40)) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const posX = marginX + c * (pW + 40);
          const posY = marginY + r * (pH + 40);

          sCtx.drawImage(singleImg, posX, posY, pW, pH);

          // Subtle cutting guide line around photo
          sCtx.strokeStyle = '#D1D5DB';
          sCtx.lineWidth = 1;
          sCtx.strokeRect(posX, posY, pW, pH);
        }
      }

      setSheetPreviewUrl(sheetCanvas.toDataURL('image/jpeg', 0.95));
    };
    singleImg.src = singlePreviewUrl;
  }, [singlePreviewUrl, selectedPreset]);

  const handleDownload = () => {
    const targetUrl = sheetMode === '4x6_grid' ? sheetPreviewUrl : singlePreviewUrl;
    if (!targetUrl) return;

    const a = document.createElement('a');
    a.href = targetUrl;
    a.download = `passport-${selectedPreset.id}-${sheetMode === '4x6_grid' ? '4x6-print-sheet' : 'photo'}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Headshot Upload - Always visible */}
      <FileUploader
        accept="image/*"
        title="Upload Headshot for Passport / Visa Photo"
        subtitle="Supports US, UK, EU, India, Canada official sizing with optional 4×6 inch print sheets."
        onFilesSelected={handleFiles}
      />

      {/* Selected File Status Banner */}
      {sourceFile && (
        <div className="p-4 rounded-2xl liquid-glass border border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white truncate max-w-sm">
                {sourceFile.name}
              </p>
              <p className="text-xs text-slate-300">
                {(sourceFile.size / 1024).toFixed(1)} KB • Loaded into Biometric Framing
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
            Change Photo
          </button>
        </div>
      )}

      {/* All-in-One Dashboard Layout: Controls + Live Framing Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-5 p-6 rounded-2xl liquid-glass border border-white/10">
          {/* Preset selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
              Official Country Standard
            </label>
            <select
              value={selectedPreset.id}
              onChange={(e) => {
                const found = PASSPORT_PRESETS.find((p) => p.id === e.target.value);
                if (found) setSelectedPreset(found);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white focus:outline-none"
            >
              {PASSPORT_PRESETS.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Size: {selectedPreset.widthMm} × {selectedPreset.heightMm} mm ({selectedPreset.widthPx} × {selectedPreset.heightPx} px @ 300 DPI)
            </p>
          </div>

          {/* Head position adjustments (Zoom, Pan) */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1">
                <span>Face Zoom</span>
                <span className="text-emerald-400">{zoom.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Pan Horizontal
                </label>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  value={panX}
                  onChange={(e) => setPanX(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Pan Vertical
                </label>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  value={panY}
                  onChange={(e) => setPanY(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Background & Lighting */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Background Color
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'white', label: 'Pure White' },
                  { id: 'light_gray', label: 'Off White' },
                  { id: 'light_blue', label: 'Light Blue' },
                ].map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setBgColor(bg.id as any)}
                    className={`py-2 px-2 text-xs font-medium rounded-xl border transition-all ${
                      bgColor === bg.id
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Brightness ({brightness}%)
                </label>
                <input
                  type="range"
                  min="70"
                  max="130"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contrast ({contrast}%)
                </label>
                <input
                  type="range"
                  min="70"
                  max="130"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Sheet Mode (Single vs 4x6 Printable) */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
              Export Print Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSheetMode('single')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  sheetMode === 'single'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                Single Digital Photo
              </button>
              <button
                type="button"
                onClick={() => setSheetMode('4x6_grid')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  sheetMode === '4x6_grid'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                4×6 Inch Print Sheet
              </button>
            </div>
          </div>

          {/* Action Download Button - ALWAYS VISIBLE */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>
                Download {sheetMode === '4x6_grid' ? '4×6 Print Sheet (JPG)' : 'Passport Photo (JPG)'}
              </span>
            </button>
          </div>
        </div>

        {/* Live Preview Column - ALWAYS VISIBLE */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 rounded-2xl liquid-glass border border-white/10 space-y-3">
          <span className="text-xs font-semibold text-slate-300">
            {sheetMode === '4x6_grid'
              ? 'Print Sheet Preview (Ready for Walgreens, CVS, or home printer)'
              : 'Official Passport Framing Preview'}
          </span>

          <div className="relative p-2 bg-black/40 rounded-xl max-h-[460px] flex items-center justify-center">
            {sheetMode === 'single' && singlePreviewUrl && (
              <div className="relative">
                <img
                  src={singlePreviewUrl}
                  alt="Passport Photo Preview"
                  className="max-h-[360px] rounded-lg shadow-md object-contain border border-white/10"
                />
                {/* Biometric Head Guide Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-3/5 h-4/5 border border-dashed border-emerald-400 rounded-full opacity-80" />
                </div>
              </div>
            )}

            {sheetMode === '4x6_grid' && sheetPreviewUrl && (
              <img
                src={sheetPreviewUrl}
                alt="4x6 Print Sheet Preview"
                className="max-h-[360px] rounded-lg shadow-md object-contain border border-white/10"
              />
            )}
          </div>

          <p className="text-[11px] text-slate-400 text-center max-w-sm">
            Position your eyes inside the upper third of the guideline and chin inside the lower curve.
          </p>
        </div>
      </div>
    </div>
  );
};
