import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Globe, Share2, Smartphone, Utensils, MessageSquareText, Building, Calendar, MapPin, Link as LinkIcon, Check } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export type UrlType =
  | 'website'
  | 'social'
  | 'app'
  | 'menu'
  | 'feedback'
  | 'business'
  | 'event'
  | 'location'
  | 'custom';

export const UnifiedUrlQRTool: React.FC = () => {
  const { t } = useApp();

  const [urlType, setUrlType] = useState<UrlType>('website');
  const [targetUrl, setTargetUrl] = useState('https://novatools.dev');
  const [socialPlatform, setSocialPlatform] = useState('instagram');
  const [socialUsername, setSocialUsername] = useState('novatools');
  const [appName, setAppName] = useState('');
  const [appStoreUrl, setAppStoreUrl] = useState('');
  const [menuUrl, setMenuUrl] = useState('');
  const [feedbackFormUrl, setFeedbackFormUrl] = useState('');
  const [businessUrl, setBusinessUrl] = useState('');
  const [eventLinkUrl, setEventLinkUrl] = useState('');
  const [locationCoordinates, setLocationCoordinates] = useState('');

  // QR Customization
  const [qrColor, setQrColor] = useState('#059669');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrSize, setQrSize] = useState(300);
  const [ecc, setEcc] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Compute final QR payload
  const computeFinalPayload = (): string => {
    switch (urlType) {
      case 'website':
        return targetUrl.trim() || 'https://novatools.dev';
      case 'social':
        if (socialPlatform === 'instagram') return `https://instagram.com/${socialUsername.replace(/^@/, '')}`;
        if (socialPlatform === 'twitter') return `https://x.com/${socialUsername.replace(/^@/, '')}`;
        if (socialPlatform === 'linkedin') return `https://linkedin.com/in/${socialUsername.replace(/^@/, '')}`;
        if (socialPlatform === 'youtube') return `https://youtube.com/@${socialUsername.replace(/^@/, '')}`;
        return `https://${socialPlatform}.com/${socialUsername}`;
      case 'app':
        return appStoreUrl.trim() || 'https://apps.apple.com';
      case 'menu':
        return menuUrl.trim() || 'https://restaurant.menu';
      case 'feedback':
        return feedbackFormUrl.trim() || 'https://forms.google.com';
      case 'business':
        return businessUrl.trim() || 'https://mybusiness.com';
      case 'event':
        return eventLinkUrl.trim() || 'https://eventbrite.com';
      case 'location':
        return locationCoordinates ? `https://maps.google.com/?q=${encodeURIComponent(locationCoordinates)}` : 'https://maps.google.com';
      case 'custom':
      default:
        return targetUrl.trim() || 'https://novatools.dev';
    }
  };

  const finalPayload = computeFinalPayload();

  useEffect(() => {
    let active = true;

    async function generate() {
      try {
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, finalPayload, {
          width: qrSize,
          margin: 2,
          errorCorrectionLevel: ecc,
          color: {
            dark: qrColor,
            light: bgColor,
          },
        });
        if (active) {
          setPreviewUrl(canvas.toDataURL('image/png'));
        }
      } catch (err) {
        console.error('QR generation error:', err);
      }
    }

    generate();
    return () => {
      active = false;
    };
  }, [finalPayload, qrColor, bgColor, qrSize, ecc]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.download = `nova-qr-${urlType}.png`;
    a.href = previewUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const typeTabs: { id: UrlType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'website', label: 'Website', icon: Globe },
    { id: 'social', label: 'Social Profile', icon: Share2 },
    { id: 'app', label: 'App Download', icon: Smartphone },
    { id: 'menu', label: 'Menu', icon: Utensils },
    { id: 'feedback', label: 'Feedback', icon: MessageSquareText },
    { id: 'business', label: 'Business Website', icon: Building },
    { id: 'event', label: 'Event Link', icon: Calendar },
    { id: 'location', label: 'Location Link', icon: MapPin },
    { id: 'custom', label: 'Custom URL', icon: LinkIcon },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Selectable Types Bar */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
          Select URL Destination Type
        </label>
        <div className="flex flex-wrap gap-2">
          {typeTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = urlType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setUrlType(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                    : 'liquid-glass text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Dynamic Fields by Selected Type */}
        <div className="lg:col-span-6 space-y-5">
          {urlType === 'website' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Website URL
              </label>
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {urlType === 'social' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Social Platform
                </label>
                <select
                  value={socialPlatform}
                  onChange={(e) => setSocialPlatform(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  <option value="instagram">Instagram</option>
                  <option value="twitter">X (Twitter)</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                  <option value="facebook">Facebook</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Handle or Username
                </label>
                <input
                  type="text"
                  value={socialUsername}
                  onChange={(e) => setSocialUsername(e.target.value)}
                  placeholder="username (without @)"
                  className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {urlType === 'app' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  App Store or Play Store Link
                </label>
                <input
                  type="url"
                  value={appStoreUrl}
                  onChange={(e) => setAppStoreUrl(e.target.value)}
                  placeholder="https://apps.apple.com/app/... or play.google.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {urlType === 'menu' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Digital Menu or PDF Menu Link
              </label>
              <input
                type="url"
                value={menuUrl}
                onChange={(e) => setMenuUrl(e.target.value)}
                placeholder="https://bistro.com/menu.pdf"
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {urlType === 'feedback' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Google Form / Survey / Feedback URL
              </label>
              <input
                type="url"
                value={feedbackFormUrl}
                onChange={(e) => setFeedbackFormUrl(e.target.value)}
                placeholder="https://forms.gle/..."
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {urlType === 'business' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Company / Business Portal
              </label>
              <input
                type="url"
                value={businessUrl}
                onChange={(e) => setBusinessUrl(e.target.value)}
                placeholder="https://corp.com"
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {urlType === 'event' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Event Page or Invitation Link
              </label>
              <input
                type="url"
                value={eventLinkUrl}
                onChange={(e) => setEventLinkUrl(e.target.value)}
                placeholder="https://eventbrite.com/e/..."
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {urlType === 'location' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Google Maps Address or Coordinates
              </label>
              <input
                type="text"
                value={locationCoordinates}
                onChange={(e) => setLocationCoordinates(e.target.value)}
                placeholder="e.g., 37.7749,-122.4194 or 1600 Amphitheatre Pkwy"
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {urlType === 'custom' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Custom URL
              </label>
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {/* QR Colors & Quality */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                QR Foreground Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                />
                <span className="text-xs font-mono text-slate-600 dark:text-slate-300 uppercase">{qrColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                />
                <span className="text-xs font-mono text-slate-600 dark:text-slate-300 uppercase">{bgColor}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-100/60 dark:bg-slate-800/40 p-3 rounded-xl">
            <span className="font-mono truncate max-w-sm">Payload: {finalPayload}</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Ready
            </span>
          </div>
        </div>

        {/* Live Preview & Download Column */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-md flex items-center justify-center">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Generated QR Code"
                className="w-56 h-56 object-contain"
              />
            )}
          </div>
          <p className="text-xs text-slate-400">Scan with any smartphone camera</p>

          <button
            type="button"
            onClick={handleDownload}
            className="w-full max-w-xs flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download QR Code (PNG)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
