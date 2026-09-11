import React, { useEffect, useRef, useState } from 'react';
import { ADSENSE_CLIENT_ID, getStoredConsent } from '../../lib/analytics';
import { useApp } from '../../context/AppContext';

interface AdSenseBannerProps {
  slotId?: string;
  className?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slotId = 'nova-default-slot',
  className = '',
  format = 'auto',
}) => {
  const { t } = useApp();
  const adRef = useRef<HTMLModElement>(null);
  const [adPushed, setAdPushed] = useState(false);
  const [isBlockedOrEmpty, setIsBlockedOrEmpty] = useState(false);

  useEffect(() => {
    // Check if user explicitly rejected advertising cookies
    const consent = getStoredConsent();
    if (consent && consent.advertising === false) {
      // AdSense Consent Mode handles non-personalized ads, but if completely disabled, don't spam
      return;
    }

    if (adRef.current && !adPushed) {
      try {
        if (typeof window !== 'undefined') {
          // Initialize window.adsbygoogle array safely
          window.adsbygoogle = window.adsbygoogle || [];
          
          // Verify element has not already been filled by adsbygoogle
          const alreadyFilled = adRef.current.getAttribute('data-adsbygoogle-status');
          if (!alreadyFilled) {
            window.adsbygoogle.push({});
            setAdPushed(true);
          }
        }
      } catch (err: any) {
        // Benign ad-blocker or duplicate push suppression
        setIsBlockedOrEmpty(true);
      }
    }
  }, [slotId, adPushed]);

  return (
    <aside
      aria-label={t.advertisement || 'Advertisement'}
      className={`w-full my-6 flex flex-col items-center justify-center p-3 rounded-2xl liquid-glass border border-white/10 text-center overflow-hidden transition-all ${className}`}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 opacity-75 select-none">
        {t.advertisement || 'Advertisement'}
      </span>

      <div className="w-full flex items-center justify-center min-h-[90px] overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px' }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />

        {/* Fallback label shown if blocked by client extension or awaiting Google review */}
        {isBlockedOrEmpty && (
          <div className="text-[11px] text-slate-400/60 py-2 select-none">
            Google AdSense Slot ({slotId})
          </div>
        )}
      </div>
    </aside>
  );
};
