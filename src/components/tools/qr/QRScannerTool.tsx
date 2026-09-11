import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import {
  Camera,
  CameraOff,
  SwitchCamera,
  ExternalLink,
  Copy,
  Check,
  Upload,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const QRScannerTool: React.FC = () => {
  const { t } = useApp();

  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [decodedResult, setDecodedResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Stop camera and cleanup streams
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported by your browser or environment.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setScanning(true);
        scanFrame();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on your device.');
      } else {
        setCameraError('Unable to access camera: ' + (err.message || 'Unknown error'));
      }
      setScanning(false);
    }
  };

  const scanFrame = () => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animationFrameId.current = requestAnimationFrame(scanFrame);
      return;
    }

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data) {
        setDecodedResult(code.data);
        stopCamera();
        return;
      }
    }

    animationFrameId.current = requestAnimationFrame(scanFrame);
  };

  // Image file scan fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          setDecodedResult(code.data);
          setCameraError(null);
        } else {
          setCameraError('No readable QR code found in this image.');
        }
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (scanning) {
      setTimeout(() => startCamera(), 100);
    }
  };

  const handleCopy = () => {
    if (!decodedResult) return;
    navigator.clipboard.writeText(decodedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUrl = decodedResult && /^(https?:\/\/)/i.test(decodedResult.trim());

  return (
    <div className="space-y-6">
      {/* Mode Bar & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {!scanning ? (
            <button
              type="button"
              onClick={startCamera}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Start Camera Scanner</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopCamera}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-red-600 hover:bg-red-500 text-white shadow-md transition-all"
            >
              <CameraOff className="w-4 h-4" />
              <span>Stop Camera</span>
            </button>
          )}

          {scanning && (
            <button
              type="button"
              onClick={toggleCameraFacing}
              className="p-2.5 rounded-xl liquid-glass text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Switch Camera (Front/Back)"
            >
              <SwitchCamera className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Upload file fallback */}
        <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl liquid-glass text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white/90 dark:hover:bg-slate-800 cursor-pointer transition-colors border border-slate-200 dark:border-slate-700">
          <Upload className="w-4 h-4 text-emerald-600" />
          <span>Scan from Photo File</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {cameraError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-700 dark:text-red-400 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Video Viewport / Viewfinder */}
      <div className="relative w-full max-w-lg mx-auto rounded-3xl overflow-hidden bg-black aspect-[4/3] flex items-center justify-center border border-slate-300 dark:border-slate-800 shadow-xl">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${scanning ? 'block' : 'hidden'}`}
          muted
        />

        {scanning && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Viewfinder Target Box */}
            <div className="w-64 h-64 border-2 border-emerald-400 rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl -mt-1 -ml-1" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl -mt-1 -mr-1" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl -mb-1 -ml-1" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl -mb-1 -mr-1" />
            </div>
          </div>
        )}

        {!scanning && (
          <div className="text-center p-6 text-slate-400">
            <Camera className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-semibold text-slate-300">Camera is Inactive</p>
            <p className="text-xs text-slate-500 mt-1">
              Click &quot;Start Camera Scanner&quot; above or choose an image file to decode.
            </p>
          </div>
        )}
      </div>

      {/* Safe Decoded Content Display (Never auto navigates!) */}
      {decodedResult && (
        <div className="p-6 rounded-2xl liquid-glass border border-emerald-500/40 shadow-lg space-y-4 animate-scale-up">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400" /> Decoded QR Content
            </span>
            <span className="text-[11px] text-slate-400">Untrusted Input</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-100 break-all select-all">
            {decodedResult}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl liquid-glass text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Content'}</span>
            </button>

            {isUrl && (
              <a
                href={decodedResult}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Link Safely</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
