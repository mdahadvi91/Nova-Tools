import React, { useState } from 'react';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { Download, Layers, RefreshCw, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface BatchItem {
  id: string;
  data: string;
  dataUrl?: string;
  error?: string;
}

export const BatchQRTool: React.FC = () => {
  const [inputText, setInputText] = useState(
    'https://example.com/item-101\nhttps://example.com/item-102\nhttps://example.com/item-103\nhttps://example.com/item-104'
  );
  const [items, setItems] = useState<BatchItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleGenerateBatch = async () => {
    const lines = inputText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;
    setIsProcessing(true);

    const generated: BatchItem[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      try {
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, line, {
          width: 250,
          margin: 2,
        });
        generated.push({
          id: `qr-${i + 1}`,
          data: line,
          dataUrl: canvas.toDataURL('image/png'),
        });
      } catch (err: any) {
        generated.push({
          id: `qr-${i + 1}`,
          data: line,
          error: err.message,
        });
      }
    }

    setItems(generated);
    setIsProcessing(false);
  };

  const handleDownloadZip = async () => {
    if (items.length === 0) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      const folder = zip.folder('nova-batch-qr');

      items.forEach((item, index) => {
        if (item.dataUrl) {
          const base64Data = item.dataUrl.split(',')[1];
          folder?.file(`qr-code-${index + 1}.png`, base64Data, { base64: true });
        }
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nova-batch-qr-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error creating ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
          Enter URLs or Text (One Per Line or CSV)
        </label>
        <textarea
          rows={6}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste list of URLs or text rows..."
          className="w-full p-4 rounded-2xl liquid-glass border border-slate-300 dark:border-slate-700 text-sm font-mono text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleGenerateBatch}
          disabled={isProcessing || !inputText.trim()}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {isProcessing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Layers className="w-4 h-4" />
          )}
          <span>{isProcessing ? 'Generating Codes...' : 'Generate Batch QR Codes'}</span>
        </button>

        {items.length > 0 && (
          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-slate-900 dark:bg-emerald-500 hover:bg-slate-800 text-white shadow-md active:scale-95 transition-all disabled:opacity-50"
          >
            {isZipping ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Download All as ZIP ({items.length} Files)</span>
          </button>
        )}
      </div>

      {items.length > 0 && (
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Generated Output ({items.length} Codes)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 rounded-xl liquid-glass border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center space-y-2"
              >
                {item.dataUrl ? (
                  <img
                    src={item.dataUrl}
                    alt={`QR #${idx + 1}`}
                    className="w-32 h-32 object-contain bg-white rounded-lg p-1 shadow-sm"
                  />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center text-red-500 text-xs">
                    Failed
                  </div>
                )}
                <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 truncate max-w-[140px]" title={item.data}>
                  #{idx + 1}: {item.data}
                </span>
                {item.dataUrl && (
                  <a
                    href={item.dataUrl}
                    download={`qr-code-${idx + 1}.png`}
                    className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Download
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
