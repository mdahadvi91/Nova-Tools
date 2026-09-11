import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Wifi, Contact2, MessageSquare, Type, Check } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

interface GenericQRToolProps {
  mode: 'wifi' | 'vcard' | 'whatsapp' | 'text';
}

export const GenericQRTool: React.FC<GenericQRToolProps> = ({ mode }) => {
  const { t } = useApp();

  // Wi-Fi fields
  const [ssid, setSsid] = useState('Office-Guest');
  const [wifiPass, setWifiPass] = useState('Welcome2026!');
  const [encryption, setEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [hidden, setHidden] = useState(false);

  // vCard fields
  const [firstName, setFirstName] = useState('Sarah');
  const [lastName, setLastName] = useState('Connor');
  const [org, setOrg] = useState('Nova Innovations');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [email, setEmail] = useState('sarah@novatools.dev');
  const [website, setWebsite] = useState('https://novatools.dev');

  // WhatsApp fields
  const [waPhone, setWaPhone] = useState('15552345678');
  const [waMessage, setWaMessage] = useState('Hello, I am contacting you regarding your services.');

  // Text fields
  const [plainText, setPlainText] = useState('Welcome to Nova Tools! Scan for information.');

  // Styling
  const [qrColor, setQrColor] = useState('#059669');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const getPayload = (): string => {
    if (mode === 'wifi') {
      return `WIFI:S:${ssid};T:${encryption};P:${wifiPass};H:${hidden ? 'true' : 'false'};;`;
    }
    if (mode === 'vcard') {
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${lastName};${firstName};;;`,
        `FN:${firstName} ${lastName}`,
        org ? `ORG:${org}` : '',
        phone ? `TEL;TYPE=CELL:${phone}` : '',
        email ? `EMAIL:${email}` : '',
        website ? `URL:${website}` : '',
        'END:VCARD',
      ]
        .filter(Boolean)
        .join('\n');
    }
    if (mode === 'whatsapp') {
      const cleanPhone = waPhone.replace(/\D/g, '');
      const encodedMsg = encodeURIComponent(waMessage);
      return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
    }
    return plainText;
  };

  const payload = getPayload();

  useEffect(() => {
    let active = true;

    async function gen() {
      try {
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, payload, {
          width: 320,
          margin: 2,
          color: { dark: qrColor, light: bgColor },
        });
        if (active) {
          setPreviewUrl(canvas.toDataURL('image/png'));
        }
      } catch (err) {
        console.error('Error generating QR:', err);
      }
    }

    gen();
    return () => {
      active = false;
    };
  }, [payload, qrColor, bgColor]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.download = `nova-${mode}-qr.png`;
    a.href = previewUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Input Fields */}
      <div className="lg:col-span-6 space-y-4">
        {mode === 'wifi' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Network Name (SSID)
              </label>
              <input
                type="text"
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Wi-Fi Password
              </label>
              <input
                type="text"
                value={wifiPass}
                onChange={(e) => setWifiPass(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Security
                </label>
                <select
                  value={encryption}
                  onChange={(e) => setEncryption(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-xs"
                >
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (Open Network)</option>
                </select>
              </div>
              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hidden}
                    onChange={(e) => setHidden(e.target.checked)}
                    className="rounded accent-emerald-600"
                  />
                  <span>Hidden Network</span>
                </label>
              </div>
            </div>
          </>
        )}

        {mode === 'vcard' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Website
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3 py-2 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>
          </>
        )}

        {mode === 'whatsapp' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                WhatsApp Phone Number (with Country Code)
              </label>
              <input
                type="text"
                value={waPhone}
                onChange={(e) => setWaPhone(e.target.value)}
                placeholder="e.g. 15552345678 (no symbols)"
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pre-Filled Message
              </label>
              <textarea
                rows={3}
                value={waMessage}
                onChange={(e) => setWaMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>
          </>
        )}

        {mode === 'text' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Text Content
            </label>
            <textarea
              rows={5}
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>
        )}

        {/* Colors */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              QR Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
              />
              <span className="text-xs font-mono">{qrColor}</span>
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
              <span className="text-xs font-mono">{bgColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Preview */}
      <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="p-4 bg-white rounded-2xl shadow-md">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="QR Code"
              className="w-56 h-56 object-contain"
            />
          )}
        </div>
        <button
          type="button"
          onClick={handleDownload}
          className="w-full max-w-xs flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download QR Code</span>
        </button>
      </div>
    </div>
  );
};
