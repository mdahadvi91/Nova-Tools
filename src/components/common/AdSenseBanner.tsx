import React, { useEffect, useRef, useState } from 'react';
import { ADSENSE_CLIENT_ID, getStoredConsent } from '../../lib/analytics';
import { useApp } from '../../context/AppContext';

interface AdSenseBannerProps {
  slotId?: string;
  className?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slotId,
  className = '',
  format = 'auto',
}) => {
  const { t } = useApp();
  const adRef = useRef<HTMLModElement>(null);
  const [adPushed, setAdPushed] = useState(false);

  // Validate if slot is a genuine numeric AdSense slot
  const isNumericSlot = Boolean(slotId && /^\d+$/.test(slotId.trim()));

  useEffect(() => {
    // Check if user explicitly rejected advertising cookies
    const consent = getStoredConsent();
    if (consent && consent.advertising === false) {
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
        // Benign ad-blocker or pending approval suppression
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
          {...(isNumericSlot ? { 'data-ad-slot': slotId!.trim() } : {})}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
};
