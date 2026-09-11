import React, { useState, useEffect } from 'react';
import { Copy, Check, Code2, Binary, Link2, Clock, KeyRound, AlertCircle, RefreshCw } from 'lucide-react';

interface DevToolsProps {
  toolType: 'json' | 'base64' | 'url' | 'timestamp' | 'password';
}

export const DevTools: React.FC<DevToolsProps> = ({ toolType }) => {
  const [copied, setCopied] = useState(false);

  // JSON state
  const [jsonInput, setJsonInput] = useState('{"name":"Nova Tools","status":"production","features":["qr","pdf","images"]}');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Base64 state
  const [b64Input, setB64Input] = useState('Hello from Nova Tools!');
  const [b64Mode, setB64Mode] = useState<'encode' | 'decode'>('encode');

  // URL state
  const [urlInput, setUrlInput] = useState('https://novatools.dev/search?q=qr codes & pdf');
  const [urlMode, setUrlMode] = useState<'encode' | 'decode'>('encode');

  // Timestamp state
  const [nowTs, setNowTs] = useState<number>(Math.floor(Date.now() / 1000));
  const [customTs, setCustomTs] = useState<string>(Math.floor(Date.now() / 1000).toString());

  // Password state
  const [pwdLength, setPwdLength] = useState(16);
  const [incUpper, setIncUpper] = useState(true);
  const [incNumbers, setIncNumbers] = useState(true);
  const [incSymbols, setIncSymbols] = useState(true);
  const [generatedPwd, setGeneratedPwd] = useState('');

  // Auto-format JSON on change or button
  const formatJson = (spaces = 2) => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, spaces));
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message);
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed));
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message);
    }
  };

  // Base64 output
  const getB64Output = (): string => {
    try {
      if (b64Mode === 'encode') {
        return btoa(unescape(encodeURIComponent(b64Input)));
      } else {
        return decodeURIComponent(escape(atob(b64Input)));
      }
    } catch (e: any) {
      return `Invalid input: ${e.message}`;
    }
  };

  // URL output
  const getUrlOutput = (): string => {
    try {
      return urlMode === 'encode' ? encodeURIComponent(urlInput) : decodeURIComponent(urlInput);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  };

  // Password generator logic
  const generatePassword = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (incUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (incNumbers) chars += '0123456789';
    if (incSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let result = '';
    const array = new Uint32Array(pwdLength);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < pwdLength; i++) {
      result += chars[array[i] % chars.length];
    }
    setGeneratedPwd(result);
  };

  useEffect(() => {
    if (toolType === 'password') {
      generatePassword();
    }
  }, [toolType, pwdLength, incUpper, incNumbers, incSymbols]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. JSON FORMATTER */}
      {toolType === 'json' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => formatJson(2)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
              >
                Format (2 Spaces)
              </button>
              <button
                type="button"
                onClick={minifyJson}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold liquid-glass border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              >
                Minify JSON
              </button>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(jsonInput)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          <textarea
            rows={12}
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              setJsonError(null);
            }}
            placeholder="Paste raw JSON here..."
            className="w-full p-4 rounded-2xl liquid-glass border border-slate-300 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
          />

          {jsonError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>JSON Syntax Error: {jsonError}</span>
            </div>
          )}
        </div>
      )}

      {/* 2. BASE64 ENCODER / DECODER */}
      {toolType === 'base64' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setB64Mode('encode')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                b64Mode === 'encode' ? 'bg-emerald-600 text-white border-emerald-600' : 'liquid-glass'
              }`}
            >
              Encode to Base64
            </button>
            <button
              type="button"
              onClick={() => setB64Mode('decode')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                b64Mode === 'decode' ? 'bg-emerald-600 text-white border-emerald-600' : 'liquid-glass'
              }`}
            >
              Decode from Base64
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Input Text
              </label>
              <textarea
                rows={8}
                value={b64Input}
                onChange={(e) => setB64Input(e.target.value)}
                className="w-full p-3 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 font-mono text-xs"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Output Result</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(getB64Output())}
                  className="text-xs text-emerald-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <textarea
                readOnly
                rows={8}
                value={getB64Output()}
                className="w-full p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. URL ENCODER / DECODER */}
      {toolType === 'url' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setUrlMode('encode')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                urlMode === 'encode' ? 'bg-emerald-600 text-white border-emerald-600' : 'liquid-glass'
              }`}
            >
              URL Encode
            </button>
            <button
              type="button"
              onClick={() => setUrlMode('decode')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                urlMode === 'decode' ? 'bg-emerald-600 text-white border-emerald-600' : 'liquid-glass'
              }`}
            >
              URL Decode
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Input URL
              </label>
              <textarea
                rows={6}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full p-3 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 font-mono text-xs"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Output Result</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(getUrlOutput())}
                  className="text-xs text-emerald-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <textarea
                readOnly
                rows={6}
                value={getUrlOutput()}
                className="w-full p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-mono text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. TIMESTAMP CONVERTER */}
      {toolType === 'timestamp' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Current Unix Epoch Time
              </span>
              <p className="text-2xl font-mono font-black text-slate-900 dark:text-white mt-1">
                {nowTs}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const ts = Math.floor(Date.now() / 1000);
                setNowTs(ts);
                setCustomTs(ts.toString());
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass text-xs font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          <div className="p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Enter Timestamp (Seconds or Milliseconds)
              </label>
              <input
                type="text"
                value={customTs}
                onChange={(e) => setCustomTs(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm font-mono"
              />
            </div>

            {(() => {
              const num = parseInt(customTs.trim(), 10);
              if (isNaN(num)) return null;
              const date = new Date(num > 9999999999 ? num : num * 1000);
              return (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">UTC String:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{date.toUTCString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">ISO 8601:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{date.toISOString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">Local Timezone:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{date.toString()}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* 5. SECURE PASSWORD GENERATOR */}
      {toolType === 'password' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 text-white font-mono text-base sm:text-lg break-all select-all">
              <span>{generatedPwd}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(generatedPwd)}
                className="p-2 hover:bg-slate-800 rounded-lg text-emerald-400"
                title="Copy Password"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Password Length</span>
                <span className="font-bold">{pwdLength} characters</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={pwdLength}
                onChange={(e) => setPwdLength(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={incUpper}
                  onChange={(e) => setIncUpper(e.target.checked)}
                  className="rounded accent-emerald-600"
                />
                <span>Uppercase (A-Z)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={incNumbers}
                  onChange={(e) => setIncNumbers(e.target.checked)}
                  className="rounded accent-emerald-600"
                />
                <span>Numbers (0-9)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={incSymbols}
                  onChange={(e) => setIncSymbols(e.target.checked)}
                  className="rounded accent-emerald-600"
                />
                <span>Symbols (!@#$%)</span>
              </label>
            </div>

            <button
              type="button"
              onClick={generatePassword}
              className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate New Secure Password</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
