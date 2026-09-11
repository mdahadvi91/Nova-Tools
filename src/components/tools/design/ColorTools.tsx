import React, { useState, useRef } from 'react';
import { Copy, Check, Palette, Eye, Pipette, RefreshCw } from 'lucide-react';
import { FileUploader } from '../../common/FileUploader';

interface ColorToolsProps {
  toolType: 'palette' | 'contrast' | 'picker';
}

export const ColorTools: React.FC<ColorToolsProps> = ({ toolType }) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Palette generator state
  const [baseColor, setBaseColor] = useState('#10b981');
  const [paletteMode, setPaletteMode] = useState<'complementary' | 'analogous' | 'triadic' | 'monochromatic'>('complementary');

  // Contrast checker state
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#f8fafc');

  // Image color picker state
  const [pickedColor, setPickedColor] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  React.useEffect(() => {
    if (toolType === 'picker' && !imageLoaded && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 600;
      canvas.height = 320;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw colorful spectrum gradient
        const grad = ctx.createLinearGradient(0, 0, 600, 0);
        grad.addColorStop(0, '#ef4444');
        grad.addColorStop(0.17, '#f97316');
        grad.addColorStop(0.33, '#eab308');
        grad.addColorStop(0.5, '#10b981');
        grad.addColorStop(0.67, '#06b6d4');
        grad.addColorStop(0.83, '#3b82f6');
        grad.addColorStop(1, '#a855f7');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 600, 320);

        const vGrad = ctx.createLinearGradient(0, 0, 0, 320);
        vGrad.addColorStop(0, 'rgba(255,255,255,0.85)');
        vGrad.addColorStop(0.5, 'rgba(255,255,255,0)');
        vGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
        ctx.fillStyle = vGrad;
        ctx.fillRect(0, 0, 600, 320);
      }
    }
  }, [toolType, imageLoaded]);

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1800);
  };

  // Hex to HSL
  const hexToHsl = (hex: string): [number, number, number] => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  // HSL to Hex
  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // Generate harmonic colors
  const generatePalette = (): string[] => {
    const [h, s, l] = hexToHsl(baseColor);
    if (paletteMode === 'complementary') {
      return [
        baseColor,
        hslToHex((h + 180) % 360, s, l),
        hslToHex((h + 180) % 360, Math.max(10, s - 30), Math.min(90, l + 20)),
        hslToHex(h, Math.max(10, s - 20), Math.min(90, l + 25)),
        hslToHex((h + 180) % 360, s, Math.max(10, l - 30)),
      ];
    } else if (paletteMode === 'analogous') {
      return [
        hslToHex((h - 40 + 360) % 360, s, l),
        hslToHex((h - 20 + 360) % 360, s, l),
        baseColor,
        hslToHex((h + 20) % 360, s, l),
        hslToHex((h + 40) % 360, s, l),
      ];
    } else if (paletteMode === 'triadic') {
      return [
        baseColor,
        hslToHex((h + 120) % 360, s, l),
        hslToHex((h + 240) % 360, s, l),
        hslToHex((h + 120) % 360, s, Math.min(85, l + 20)),
        hslToHex((h + 240) % 360, s, Math.max(15, l - 20)),
      ];
    } else {
      // Monochromatic
      return [
        hslToHex(h, s, Math.max(10, l - 35)),
        hslToHex(h, s, Math.max(20, l - 15)),
        baseColor,
        hslToHex(h, s, Math.min(85, l + 15)),
        hslToHex(h, Math.max(10, s - 40), Math.min(95, l + 35)),
      ];
    }
  };

  // Luminance & Contrast calculation
  const getLuminance = (hex: string): number => {
    const rgb = [
      parseInt(hex.slice(1, 3), 16) / 255,
      parseInt(hex.slice(3, 5), 16) / 255,
      parseInt(hex.slice(5, 7), 16) / 255,
    ].map((val) => (val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)));
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };

  const getContrastRatio = (fg: string, bg: string): number => {
    try {
      const l1 = getLuminance(fg);
      const l2 = getLuminance(bg);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
    } catch {
      return 1;
    }
  };

  const contrastRatio = getContrastRatio(fgColor, bgColor);

  // Canvas Image Pick
  const handleImageUpload = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      setImageLoaded(true);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
      .toString(16)
      .slice(1)}`;
    setPickedColor(hex);
  };

  return (
    <div className="space-y-6">
      {/* 1. COLOR PALETTE GENERATOR */}
      {toolType === 'palette' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
              />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Base Seed Color
                </span>
                <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                  {baseColor.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(['complementary', 'analogous', 'triadic', 'monochromatic'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaletteMode(mode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    paletteMode === mode
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'liquid-glass text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {generatePalette().map((c, i) => (
              <div
                key={i}
                onClick={() => copyColor(c)}
                className="group cursor-pointer rounded-2xl overflow-hidden liquid-glass border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <div
                  className="h-28 w-full transition-transform group-hover:scale-105"
                  style={{ backgroundColor: c }}
                />
                <div className="p-3 text-center">
                  <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                    {c.toUpperCase()}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {copiedColor === c ? 'Copied!' : 'Click to Copy'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. WCAG CONTRAST CHECKER */}
      {toolType === 'contrast' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Foreground Text Color
                </label>
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="font-mono text-sm font-bold bg-transparent outline-none"
                />
              </div>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
              />
            </div>

            <div className="p-4 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Background Canvas Color
                </label>
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="font-mono text-sm font-bold bg-transparent outline-none"
                />
              </div>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
              />
            </div>
          </div>

          {/* Live Contrast Preview Canvas */}
          <div
            className="p-8 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700 transition-colors"
            style={{ backgroundColor: bgColor, color: fgColor }}
          >
            <h4 className="text-xl font-bold tracking-tight mb-2">
              Sample Heading Text ({contrastRatio}:1)
            </h4>
            <p className="text-sm max-w-lg leading-relaxed">
              Ensure body and heading copy maintain legible contrast across diverse display calibrations and visual accessibility needs.
            </p>
          </div>

          {/* WCAG Compliance Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'AA Normal Text', required: 4.5, pass: contrastRatio >= 4.5 },
              { label: 'AA Large Text', required: 3.0, pass: contrastRatio >= 3.0 },
              { label: 'AAA Normal Text', required: 7.0, pass: contrastRatio >= 7.0 },
              { label: 'AAA Large Text', required: 4.5, pass: contrastRatio >= 4.5 },
            ].map((badge, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-center ${
                  badge.pass
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                    : 'bg-red-500/10 border-red-500/20 text-red-800 dark:text-red-300'
                }`}
              >
                <span className="text-xs font-bold">{badge.pass ? 'PASS' : 'FAIL'}</span>
                <p className="text-[11px] font-medium opacity-80 mt-0.5">{badge.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. IMAGE COLOR PICKER */}
      {toolType === 'picker' && (
        <div className="space-y-6 animate-fade-in">
          <FileUploader
            accept="image/*"
            title="Upload Image to Extract Exact Colors"
            subtitle="Click anywhere on the image or sample palette canvas below to sample precise HEX, RGB, and HSL values."
            onFilesSelected={handleImageUpload}
          />

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl liquid-glass border border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl border border-white/20 shadow-sm"
                  style={{ backgroundColor: pickedColor || '#10b981' }}
                />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Sampled Color
                  </span>
                  <p className="font-mono text-sm font-bold text-white">
                    {pickedColor ? pickedColor.toUpperCase() : '#10B981 (Click canvas to pick)'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => copyColor(pickedColor || '#10b981')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 transition-all"
              >
                {copiedColor === (pickedColor || '#10b981') ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedColor === (pickedColor || '#10b981') ? 'Copied' : 'Copy HEX'}</span>
              </button>
            </div>

            <div className="flex flex-col items-center justify-center overflow-auto max-h-[500px] rounded-2xl border border-white/10 bg-black/40 p-4">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="cursor-crosshair max-w-full rounded-xl object-contain shadow-lg"
              />
              <p className="text-[11px] text-slate-400 mt-2">
                Eyedropper active: Click anywhere on the canvas above to pick exact color.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
