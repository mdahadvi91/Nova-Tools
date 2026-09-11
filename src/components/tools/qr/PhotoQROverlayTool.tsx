import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Upload,
  Download,
  Image as ImageIcon,
  Link,
  Wifi,
  MessageSquare,
  User,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

type PayloadType = 'url' | 'wifi' | 'whatsapp' | 'contact';
type CornerPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export const PhotoQROverlayTool: React.FC = () => {
  // 1. Photo state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoImg, setPhotoImg] = useState<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. Payload selection
  const [payloadType, setPayloadType] = useState<PayloadType>('url');

  // URL fields
  const [urlInput, setUrlInput] = useState('https://novatools.dev');

  // Wi-Fi fields
  const [wifiSsid, setWifiSsid] = useState('Office_Guest_WiFi');
  const [wifiPassword, setWifiPassword] = useState('ConnectSecure2026');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // WhatsApp fields
  const [waPhone, setWaPhone] = useState('+15551234567');
  const [waMessage, setWaMessage] = useState('Hello! Inquiring about your services.');

  // Contact fields
  const [contactName, setContactName] = useState('Alex Rahman');
  const [contactPhone, setContactPhone] = useState('+1 (555) 349-2810');
  const [contactEmail, setContactEmail] = useState('alex@example.com');
  const [contactOrg, setContactOrg] = useState('Nova Digital');

  // 4. Corner badge placement & sizing
  const [corner, setCorner] = useState<CornerPosition>('bottom-right');
  const [badgeTheme, setBadgeTheme] = useState<'white' | 'dark'>('white');
  const [qrSizeRatio, setQrSizeRatio] = useState<number>(20); // 15% - 32% of photo width

  // Preview & Processing state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCompositing, setIsCompositing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize with a clean sample canvas on mount so the tool is 100% visible immediately
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Elegant emerald gradient canvas
    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, '#0c221b');
    grad.addColorStop(0.5, '#071612');
    grad.addColorStop(1, '#050f0c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.lineWidth = 2;
    for (let x = 0; x <= 1200; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 800);
      ctx.stroke();
    }
    for (let y = 0; y <= 800; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 46px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('YOUR PHOTO / FLYER PREVIEW', 80, 360);

    ctx.fillStyle = '#34d399';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Click "Upload Your Photo" to replace this with your picture', 80, 420);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '400 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Photo clarity is 100% preserved • QR placed in corner badge', 80, 470);

    const img = new Image();
    img.onload = () => {
      setPhotoImg((prev) => prev || img);
    };
    img.src = canvas.toDataURL('image/jpeg', 0.95);
  }, []);

  // Handle uploaded photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      setPhotoImg(img);
    };
    img.src = objectUrl;
  };

  // Build the QR payload string
  const computePayloadString = (): string => {
    switch (payloadType) {
      case 'url':
        return urlInput.trim() || 'https://novatools.dev';
      case 'wifi': {
        const ssid = wifiSsid.trim() || 'Guest-WiFi';
        const pass = wifiPassword.trim();
        const enc = wifiEncryption;
        const hidden = wifiHidden ? 'H:true;' : '';
        return `WIFI:S:${ssid};T:${enc};P:${pass};${hidden};`;
      }
      case 'whatsapp': {
        const cleanPhone = waPhone.replace(/\D/g, '');
        const encodedMsg = encodeURIComponent(waMessage.trim());
        if (!cleanPhone) return 'https://wa.me/';
        return `https://wa.me/${cleanPhone}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
      }
      case 'contact': {
        const name = contactName.trim() || 'Nova Contact';
        const phone = contactPhone.trim();
        const email = contactEmail.trim();
        const org = contactOrg.trim();
        return [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `FN:${name}`,
          org ? `ORG:${org}` : '',
          phone ? `TEL:${phone}` : '',
          email ? `EMAIL:${email}` : '',
          'END:VCARD',
        ]
          .filter(Boolean)
          .join('\n');
      }
    }
  };

  // Re-render composite canvas whenever inputs change
  useEffect(() => {
    if (!photoImg) return;
    setIsCompositing(true);

    const timer = setTimeout(async () => {
      try {
        const canvas = canvasRef.current || document.createElement('canvas');
        const photoW = photoImg.naturalWidth || photoImg.width || 1200;
        const photoH = photoImg.naturalHeight || photoImg.height || 800;

        canvas.width = photoW;
        canvas.height = photoH;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. Draw photo clean and sharp without distortion
        ctx.drawImage(photoImg, 0, 0, photoW, photoH);

        // 2. Compute QR badge size
        const qrSize = Math.max(120, Math.round((photoW * qrSizeRatio) / 100));
        const padding = Math.max(12, Math.round(qrSize * 0.08));
        const badgeW = qrSize + padding * 2;
        const badgeH = qrSize + padding * 2;
        const margin = Math.max(16, Math.round(photoW * 0.03));

        // 3. Compute position coordinates for chosen corner
        let x = 0;
        let y = 0;
        switch (corner) {
          case 'bottom-right':
            x = photoW - badgeW - margin;
            y = photoH - badgeH - margin;
            break;
          case 'bottom-left':
            x = margin;
            y = photoH - badgeH - margin;
            break;
          case 'top-right':
            x = photoW - badgeW - margin;
            y = margin;
            break;
          case 'top-left':
            x = margin;
            y = margin;
            break;
        }

        // 4. Generate QR code on temporary offscreen canvas
        const qrCanvas = document.createElement('canvas');
        const qrString = computePayloadString();
        await QRCode.toCanvas(qrCanvas, qrString, {
          errorCorrectionLevel: 'Q',
          width: qrSize,
          margin: 1,
          color: {
            dark: badgeTheme === 'dark' ? '#ffffff' : '#0a0f0d',
            light: badgeTheme === 'dark' ? '#0d1814' : '#ffffff',
          },
        });

        // 5. Draw rounded corner badge background with shadow
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 6;

        const radius = Math.max(12, Math.round(badgeW * 0.08));
        ctx.fillStyle = badgeTheme === 'dark' ? '#0d1814' : '#ffffff';
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + badgeW - radius, y);
        ctx.quadraticCurveTo(x + badgeW, y, x + badgeW, y + radius);
        ctx.lineTo(x + badgeW, y + badgeH - radius);
        ctx.quadraticCurveTo(x + badgeW, y + badgeH, x + badgeW - radius, y + badgeH);
        ctx.lineTo(x + radius, y + badgeH);
        ctx.quadraticCurveTo(x, y + badgeH, x, y + badgeH - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();

        // Badge border
        ctx.strokeStyle = badgeTheme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = Math.max(2, Math.round(badgeW * 0.015));
        ctx.stroke();
        ctx.restore();

        // 6. Draw QR code centered inside badge
        ctx.drawImage(qrCanvas, x + padding, y + padding, qrSize, qrSize);

        // Generate data URL for preview
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setPreviewUrl(dataUrl);
      } catch (err) {
        console.error('Composite failed', err);
      } finally {
        setIsCompositing(false);
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [
    photoImg,
    payloadType,
    urlInput,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    wifiHidden,
    waPhone,
    waMessage,
    contactName,
    contactPhone,
    contactEmail,
    contactOrg,
    corner,
    badgeTheme,
    qrSizeRatio,
  ]);

  // 5. Download in High Quality JPG Format
  const handleDownloadJpg = () => {
    if (!previewUrl) return;
    const baseName = photoFile
      ? photoFile.name.substring(0, photoFile.name.lastIndexOf('.'))
      : 'photo';
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `${baseName}_qr_overlay.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 2-Column Responsive Layout: EVERYTHING is visible from the start */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Steps 1, 2, 3 & Corner Settings */}
        <div className="lg:col-span-6 space-y-5">
          {/* 1. PHOTO UPLOAD SECTION */}
          <div className="p-4 rounded-2xl liquid-glass border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span>1. Upload Photo / Picture</span>
              </div>
              {photoFile && (
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Custom Photo Loaded</span>
                </span>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs sm:text-sm font-semibold transition-all shadow-sm"
              >
                <Upload className="w-4 h-4" />
                <span>{photoFile ? 'Change Photo' : 'Upload Your Photo'}</span>
              </button>

              {photoFile ? (
                <div className="text-xs text-slate-300 truncate max-w-xs">
                  <span className="font-semibold text-white">{photoFile.name}</span>
                  <span className="text-slate-400 ms-1.5">
                    ({(photoFile.size / 1024).toFixed(0)} KB)
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-400">
                  Select any picture. Photo remains 100% clear.
                </span>
              )}
            </div>
          </div>

          {/* 2. PAYLOAD SELECT */}
          <div className="space-y-2.5 p-4 rounded-2xl liquid-glass border border-white/10">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              <span>2. Select QR Payload</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPayloadType('url')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-medium gap-1 transition-all ${
                  payloadType === 'url'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                <Link className="w-4 h-4" />
                <span>URL / Link</span>
              </button>

              <button
                type="button"
                onClick={() => setPayloadType('wifi')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-medium gap-1 transition-all ${
                  payloadType === 'wifi'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                <Wifi className="w-4 h-4" />
                <span>Wi-Fi QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPayloadType('whatsapp')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-medium gap-1 transition-all ${
                  payloadType === 'whatsapp'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setPayloadType('contact')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-medium gap-1 transition-all ${
                  payloadType === 'contact'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Contact</span>
              </button>
            </div>
          </div>

          {/* 3. LINK / PAYLOAD INPUT DETAILS */}
          <div className="space-y-3 p-4 rounded-2xl liquid-glass border border-white/10">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              <span>3. Enter Link / QR Data</span>
            </div>

            {/* URL INPUT */}
            {payloadType === 'url' && (
              <div className="space-y-2">
                <label className="text-xs text-slate-300">Destination Website or Social Link</label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            )}

            {/* WI-FI INPUTS */}
            {payloadType === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-300">Network Name (SSID)</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="e.g. Office_WiFi_5G"
                    className="w-full mt-1 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300">Wi-Fi Password</label>
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="Enter network password"
                    className="w-full mt-1 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[11px] text-slate-400">Security</label>
                    <select
                      value={wifiEncryption}
                      onChange={(e) => setWifiEncryption(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                      className="w-full mt-1 px-2.5 py-2 rounded-xl bg-slate-800 border border-white/15 text-white text-xs"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None (Open)</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={wifiHidden}
                        onChange={(e) => setWifiHidden(e.target.checked)}
                        className="rounded text-emerald-500 focus:ring-emerald-400"
                      />
                      <span>Hidden Network</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* WHATSAPP INPUTS */}
            {payloadType === 'whatsapp' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-300">WhatsApp Phone (with country code)</label>
                  <input
                    type="tel"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    placeholder="e.g. +8801700000000 or 15551234567"
                    className="w-full mt-1 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300">Pre-filled Chat Message (Optional)</label>
                  <input
                    type="text"
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    placeholder="Hello! I would like to inquire about..."
                    className="w-full mt-1 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>
            )}

            {/* CONTACT INPUTS */}
            {payloadType === 'contact' && (
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-300">Full Name</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300">Phone</label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+1 234 567 8900"
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-300">Email</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="hello@example.com"
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300">Company / Org</label>
                    <input
                      type="text"
                      value={contactOrg}
                      onChange={(e) => setContactOrg(e.target.value)}
                      placeholder="Company Inc."
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIDE CORNER POSITION & BADGE STYLE */}
          <div className="space-y-3 p-4 rounded-2xl liquid-glass border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Side Corner Badge Placement
              </span>
              <span className="text-[11px] text-slate-300 font-medium">Photo remains clear</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setCorner('bottom-right')}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all ${
                  corner === 'bottom-right'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                Bottom-Right
              </button>
              <button
                type="button"
                onClick={() => setCorner('bottom-left')}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all ${
                  corner === 'bottom-left'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                Bottom-Left
              </button>
              <button
                type="button"
                onClick={() => setCorner('top-right')}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all ${
                  corner === 'top-right'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                Top-Right
              </button>
              <button
                type="button"
                onClick={() => setCorner('top-left')}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all ${
                  corner === 'top-left'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                Top-Left
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] text-slate-300">Badge Background</label>
                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setBadgeTheme('white')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                      badgeTheme === 'white'
                        ? 'bg-white text-slate-900 shadow-md'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    White Badge
                  </button>
                  <button
                    type="button"
                    onClick={() => setBadgeTheme('dark')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                      badgeTheme === 'dark'
                        ? 'bg-slate-900 text-white border border-white/20 shadow-md'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    Dark Badge
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>QR Size</span>
                  <span className="font-mono text-emerald-400">{qrSizeRatio}%</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="32"
                  value={qrSizeRatio}
                  onChange={(e) => setQrSizeRatio(Number(e.target.value))}
                  className="w-full mt-2 accent-emerald-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4. PREVIEW & 5. DOWNLOAD BUTTON (VISIBLE IMMEDIATELY) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-2xl liquid-glass border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                4. Real Preview (Photo + Corner QR)
              </span>
              {isCompositing && (
                <span className="text-[11px] text-emerald-400 animate-pulse">Rendering...</span>
              )}
            </div>

            {/* Canvas Container */}
            <div className="w-full max-h-[440px] rounded-xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center p-2">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Photo with QR Corner Badge"
                  className="max-h-[400px] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <div className="py-24 text-center text-slate-400 text-xs">
                  Loading preview...
                </div>
              )}
            </div>

            {/* Canvas element offscreen */}
            <canvas ref={canvasRef} className="hidden" />

            {/* 5. DOWNLOAD BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDownloadJpg}
                disabled={!previewUrl}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                <span>5. Download High Quality JPG Photo (.jpg)</span>
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Full resolution output • Photo clarity preserved with scannable corner badge
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
