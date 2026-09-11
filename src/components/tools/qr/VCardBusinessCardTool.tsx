import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Upload,
  Download,
  Image as ImageIcon,
  User,
  Building,
  Phone,
  Mail,
  Globe,
  MapPin,
  Sparkles,
  Share2,
  FileCheck,
} from 'lucide-react';

export const VCardBusinessCardTool: React.FC = () => {
  // 1. Photo / Logo state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // 2. Contact details
  const [fullName, setFullName] = useState('Alex Rahman');
  const [jobTitle, setJobTitle] = useState('Senior Product Designer');
  const [company, setCompany] = useState('Nova Digital Studio');
  const [phone, setPhone] = useState('+1 (555) 349-2810');
  const [email, setEmail] = useState('alex@novadigital.io');
  const [website, setWebsite] = useState('https://novadigital.io');
  const [address, setAddress] = useState('Dubai, United Arab Emirates');

  // Card theme styling
  const [cardTheme, setCardTheme] = useState<'emerald-dark' | 'obsidian-gold' | 'clean-white'>('emerald-dark');

  // Preview & export state
  const [cardPreviewUrl, setCardPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle logo / photo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);

    const objectUrl = URL.createObjectURL(file);
    setLogoPreview(objectUrl);

    const img = new Image();
    img.onload = () => {
      setLogoImg(img);
    };
    img.src = objectUrl;
  };

  // Build standard vCard 3.0 string for contact saving
  const generateVCardData = (): string => {
    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${fullName.trim()}`,
      `TITLE:${jobTitle.trim()}`,
      `ORG:${company.trim()}`,
      `TEL;TYPE=CELL:${phone.trim()}`,
      `EMAIL:${email.trim()}`,
      `URL:${website.trim()}`,
      `ADR;TYPE=WORK:;;${address.trim()};;;;`,
      'END:VCARD',
    ].join('\n');
  };

  // Render high resolution standard 3.5" x 2" card (1050x600 px)
  useEffect(() => {
    setIsGenerating(true);
    const timer = setTimeout(async () => {
      try {
        const canvas = canvasRef.current || document.createElement('canvas');
        // Standard 3.5" x 2" at 300 DPI = 1050 x 600 px
        const width = 1050;
        const height = 600;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. Draw Card Background according to theme
        if (cardTheme === 'emerald-dark') {
          const bgGrad = ctx.createLinearGradient(0, 0, width, height);
          bgGrad.addColorStop(0, '#0a1612');
          bgGrad.addColorStop(0.5, '#07120e');
          bgGrad.addColorStop(1, '#050c0a');
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, width, height);

          // Subtle decorative emerald glow
          const glow = ctx.createRadialGradient(200, 200, 50, 200, 200, 450);
          glow.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
          glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = glow;
          ctx.fillRect(0, 0, width, height);

          // Divider line between details (left) and QR code (right)
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(680, 50);
          ctx.lineTo(680, 550);
          ctx.stroke();
        } else if (cardTheme === 'obsidian-gold') {
          const bgGrad = ctx.createLinearGradient(0, 0, width, height);
          bgGrad.addColorStop(0, '#161412');
          bgGrad.addColorStop(1, '#0a0908');
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, width, height);

          // Gold accent divider
          ctx.strokeStyle = 'rgba(234, 179, 8, 0.25)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(680, 50);
          ctx.lineTo(680, 550);
          ctx.stroke();
        } else {
          // Clean White Minimalist
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);

          ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(680, 50);
          ctx.lineTo(680, 550);
          ctx.stroke();
        }

        // 2. Draw User Photo / Logo on Left Side
        const isDarkTheme = cardTheme !== 'clean-white';
        let contentLeftX = 60;
        let contentTopY = 70;

        if (logoImg) {
          ctx.save();
          const avatarSize = 110;
          ctx.beginPath();
          ctx.arc(contentLeftX + avatarSize / 2, contentTopY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(logoImg, contentLeftX, contentTopY, avatarSize, avatarSize);
          ctx.restore();

          // Avatar circular border
          ctx.strokeStyle = isDarkTheme ? '#10b981' : '#059669';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(contentLeftX + avatarSize / 2, contentTopY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
          ctx.stroke();

          contentTopY += 135;
        }

        // 3. User Name & Company
        ctx.fillStyle = isDarkTheme ? '#ffffff' : '#0f172a';
        ctx.font = 'bold 38px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(fullName || 'Your Name', contentLeftX, contentTopY + 30);

        ctx.fillStyle = isDarkTheme ? '#34d399' : '#059669';
        ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
        const titleStr = [jobTitle, company].filter(Boolean).join(' • ');
        ctx.fillText(titleStr || 'Job Title', contentLeftX, contentTopY + 65);

        // 4. Contact Details List (Phone, Email, Web, Address)
        const detailsList = [
          { icon: '📞', text: phone },
          { icon: '✉️', text: email },
          { icon: '🌐', text: website },
          { icon: '📍', text: address },
        ].filter((d) => Boolean(d.text));

        let detailY = contentTopY + 115;
        detailsList.forEach((item) => {
          ctx.font = '500 19px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = isDarkTheme ? 'rgba(255, 255, 255, 0.85)' : '#334155';
          ctx.fillText(`${item.icon}  ${item.text}`, contentLeftX, detailY);
          detailY += 34;
        });

        // 5. Generate vCard QR Code for Right Side
        const qrCanvas = document.createElement('canvas');
        const vCardStr = generateVCardData();
        const qrSize = 250;

        await QRCode.toCanvas(qrCanvas, vCardStr, {
          errorCorrectionLevel: 'M',
          width: qrSize,
          margin: 1,
          color: {
            dark: '#0a0f0d',
            light: '#ffffff',
          },
        });

        // Right side container coordinates
        const qrBoxX = 720;
        const qrBoxY = 120;
        const qrPadding = 18;
        const qrTotalW = qrSize + qrPadding * 2;
        const qrTotalH = qrSize + qrPadding * 2;

        // Draw White container box for maximum scan contrast
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 6;
        ctx.fillStyle = '#ffffff';

        const r = 16;
        ctx.beginPath();
        ctx.moveTo(qrBoxX + r, qrBoxY);
        ctx.lineTo(qrBoxX + qrTotalW - r, qrBoxY);
        ctx.quadraticCurveTo(qrBoxX + qrTotalW, qrBoxY, qrBoxX + qrTotalW, qrBoxY + r);
        ctx.lineTo(qrBoxX + qrTotalW, qrBoxY + qrTotalH - r);
        ctx.quadraticCurveTo(qrBoxX + qrTotalW, qrBoxY + qrTotalH, qrBoxX + qrTotalW - r, qrBoxY + qrTotalH);
        ctx.lineTo(qrBoxX + r, qrBoxY + qrTotalH);
        ctx.quadraticCurveTo(qrBoxX, qrBoxY + qrTotalH, qrBoxX, qrBoxY + qrTotalH - r);
        ctx.lineTo(qrBoxX, qrBoxY + r);
        ctx.quadraticCurveTo(qrBoxX, qrBoxY, qrBoxX + r, qrBoxY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Draw QR code onto white badge
        ctx.drawImage(qrCanvas, qrBoxX + qrPadding, qrBoxY + qrPadding, qrSize, qrSize);

        // QR Label underneath
        ctx.fillStyle = isDarkTheme ? '#94a3b8' : '#64748b';
        ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SCAN TO SAVE CONTACT', qrBoxX + qrTotalW / 2, qrBoxY + qrTotalH + 34);
        ctx.textAlign = 'left';

        // Set card preview url
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setCardPreviewUrl(dataUrl);
      } catch (err) {
        console.error('vCard card generation failed', err);
      } finally {
        setIsGenerating(false);
      }
    }, 80);

    return () => clearTimeout(timer);
  }, [fullName, jobTitle, company, phone, email, website, address, logoImg, cardTheme]);

  // Download card as high resolution JPG
  const handleDownloadCard = () => {
    if (!cardPreviewUrl) return;
    const cleanName = fullName.replace(/\s+/g, '_') || 'vcard';
    const a = document.createElement('a');
    a.href = cardPreviewUrl;
    a.download = `${cleanName}_business_card.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download .vcf file
  const handleDownloadVcf = () => {
    const vcardString = generateVCardData();
    const blob = new Blob([vcardString], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const cleanName = fullName.replace(/\s+/g, '_') || 'contact';
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cleanName}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 1. Photo Logo & Contact Details */}
        <div className="lg:col-span-6 space-y-5">
          {/* 1. PHOTO / LOGO UPLOAD */}
          <div className="p-4 rounded-2xl liquid-glass border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                1. Upload Photo / Logo
              </div>
              <span className="text-[11px] text-slate-400">Used as Card Avatar / Logo</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center overflow-hidden flex-shrink-0">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-slate-400" />
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white border border-white/10 flex items-center gap-2 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{logoPreview ? 'Change Photo' : 'Upload Headshot / Logo'}</span>
                </button>
                <p className="text-[10px] text-slate-400">PNG, JPG, or WebP logo or personal photo.</p>
              </div>
            </div>
          </div>

          {/* 2. USER DETAILS INPUT FORM */}
          <div className="p-4 rounded-2xl liquid-glass border border-white/10 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              2. User & Company Details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Smith"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-xs focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Managing Director"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-xs focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300">Company Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-xs focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-xs focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-xs focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300">Website / Portfolio</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://company.com"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-xs focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-300">Location / Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="City, Country or Business Address"
                className="w-full mt-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-xs focus:ring-1 focus:ring-emerald-400"
              />
            </div>
          </div>

          {/* Theme Style */}
          <div className="p-4 rounded-2xl liquid-glass border border-white/10 space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Card Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCardTheme('emerald-dark')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  cardTheme === 'emerald-dark'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                    : 'bg-white/5 text-slate-300 border border-white/5'
                }`}
              >
                Emerald Obsidian
              </button>
              <button
                type="button"
                onClick={() => setCardTheme('obsidian-gold')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  cardTheme === 'obsidian-gold'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'bg-white/5 text-slate-300 border border-white/5'
                }`}
              >
                Obsidian Gold
              </button>
              <button
                type="button"
                onClick={() => setCardTheme('clean-white')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  cardTheme === 'clean-white'
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'bg-white/5 text-slate-300 border border-white/5'
                }`}
              >
                Clean White
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3. Original vCard Size & 4. Dual-Sided Layout Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-2xl liquid-glass border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                3. & 4. Card Preview (Standard 3.5&quot; × 2&quot; Dual-Sided)
              </div>
              <span className="text-[11px] font-mono text-slate-400">1050 × 600 px (300 DPI)</span>
            </div>

            {/* Visual Card Display */}
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-black/40 flex items-center justify-center p-2">
              {cardPreviewUrl ? (
                <img
                  src={cardPreviewUrl}
                  alt="vCard Digital Business Card"
                  className="w-full h-auto rounded-xl shadow-2xl"
                />
              ) : (
                <div className="py-24 text-center text-slate-400 text-xs">
                  Generating card preview...
                </div>
              )}
            </div>

            {/* Hidden canvas for high-DPI rendering */}
            <canvas ref={canvasRef} className="hidden" />

            {/* 5. DOWNLOAD BUTTONS */}
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={handleDownloadCard}
                disabled={!cardPreviewUrl}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                <span>Download High-Res Business Card (.jpg)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadVcf}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold border border-white/10 flex items-center justify-center gap-2 transition-colors"
              >
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Download .VCF Digital Contact File</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
