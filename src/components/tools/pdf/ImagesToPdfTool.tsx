import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Download, FileImage, RefreshCw, Trash2, ArrowUp, ArrowDown, FileText } from 'lucide-react';
import { FileUploader } from '../../common/FileUploader';
import { useApp } from '../../../context/AppContext';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

export const ImagesToPdfTool: React.FC = () => {
  const { t } = useApp();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [margin, setMargin] = useState<'none' | 'small' | 'large'>('small');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    const newItems: ImageItem[] = files.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newItems]);
    setPdfBlobUrl(null);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === images.length - 1)
    )
      return;
    const target = direction === 'up' ? index - 1 : index + 1;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setImages(updated);
    setPdfBlobUrl(null);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setPdfBlobUrl(null);
  };

  const handleCreatePdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const arrayBuffer = await item.file.arrayBuffer();
        let embeddedImage;

        if (item.file.type === 'image/jpeg' || item.file.type === 'image/jpg') {
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        } else if (item.file.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          // Convert WebP / other formats via Canvas
          const imgBitmap = await createImageBitmap(item.file);
          const canvas = document.createElement('canvas');
          canvas.width = imgBitmap.width;
          canvas.height = imgBitmap.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(imgBitmap, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          const byteString = atob(dataUrl.split(',')[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          embeddedImage = await pdfDoc.embedJpg(ab);
        }

        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;

        let pageWidth = 595.28; // A4 default
        let pageHeight = 841.89;

        if (pageSize === 'letter') {
          pageWidth = 612;
          pageHeight = 792;
        } else if (pageSize === 'fit') {
          pageWidth = imgWidth;
          pageHeight = imgHeight;
        }

        let marginPts = 0;
        if (pageSize !== 'fit') {
          if (margin === 'small') marginPts = 20;
          if (margin === 'large') marginPts = 40;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        if (pageSize === 'fit') {
          page.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: imgWidth,
            height: imgHeight,
          });
        } else {
          const availWidth = pageWidth - marginPts * 2;
          const availHeight = pageHeight - marginPts * 2;
          const scale = Math.min(availWidth / imgWidth, availHeight / imgHeight);

          const drawWidth = imgWidth * scale;
          const drawHeight = imgHeight * scale;

          const posX = (pageWidth - drawWidth) / 2;
          const posY = (pageHeight - drawHeight) / 2;

          page.drawImage(embeddedImage, {
            x: posX,
            y: posY,
            width: drawWidth,
            height: drawHeight,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfBlobUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('PDF creation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlobUrl) return;
    const a = document.createElement('a');
    a.href = pdfBlobUrl;
    a.download = `nova-document-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* File Uploader - Always visible */}
      <FileUploader
        accept="image/*"
        multiple
        title="Upload Images to Convert to PDF"
        subtitle="Select multiple JPG, PNG, or WebP images. Formatted directly into a clean PDF document."
        onFilesSelected={handleFiles}
      />

      {/* Controls: Page Size & Margins - ALWAYS VISIBLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-2xl liquid-glass border border-white/10">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
            Page Size
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'a4', label: 'A4 Standard' },
              { id: 'letter', label: 'US Letter' },
              { id: 'fit', label: 'Fit to Image' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setPageSize(s.id as any);
                  setPdfBlobUrl(null);
                }}
                className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all ${
                  pageSize === s.id
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
            Page Margins
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'none', label: 'No Margin' },
              { id: 'small', label: 'Small (20pt)' },
              { id: 'large', label: 'Large (40pt)' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setMargin(m.id as any);
                  setPdfBlobUrl(null);
                }}
                className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all ${
                  margin === m.id
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Image sequence preview - ALWAYS VISIBLE */}
      <div className="space-y-3 p-5 rounded-2xl liquid-glass border border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Page Sequence ({images.length} Images Loaded)
          </span>
          {images.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setImages([]);
                setPdfBlobUrl(null);
              }}
              className="text-xs text-red-400 hover:underline font-semibold"
            >
              Clear All
            </button>
          )}
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((item, index) => (
              <div
                key={item.id}
                className="group relative rounded-xl border border-white/10 bg-white/5 p-2 space-y-2 flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] bg-black/40 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={item.previewUrl}
                    alt={`Page ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute top-1.5 start-1.5 px-2 py-0.5 rounded bg-black/70 text-[11px] font-bold text-white">
                    {index + 1}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                    {item.file.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveImage(index, 'up')}
                      className="p-1 rounded hover:bg-white/10 text-slate-300 disabled:opacity-20"
                      title="Move previous"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={() => moveImage(index, 'down')}
                      className="p-1 rounded hover:bg-white/10 text-slate-300 disabled:opacity-20"
                      title="Move next"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(item.id)}
                      className="p-1 rounded hover:bg-red-500/20 text-red-400"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-dashed border-white/10 text-center space-y-2 text-slate-400">
            <FileImage className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
            <p className="text-xs font-semibold">
              No images added yet. Upload pictures above to configure multi-page PDF output.
            </p>
          </div>
        )}

        {/* Action and Download Buttons - ALWAYS VISIBLE */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleCreatePdf}
            disabled={images.length === 0 || isProcessing}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'Generating PDF...' : `Generate PDF (${images.length} Pages)`}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!pdfBlobUrl}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-slate-900 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/40 shadow-lg active:scale-95 transition-all disabled:opacity-35 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>{pdfBlobUrl ? t.actions.download : 'Download Final PDF (Ready on Generation)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
