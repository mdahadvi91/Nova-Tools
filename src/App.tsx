import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TOOLS } from './data/tools';
import { Header } from './components/layout/Header';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { RightSidebar } from './components/layout/RightSidebar';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/layout/SearchModal';
import { ToolWorkspace } from './components/common/ToolWorkspace';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';
import { initGlobalAnalyticsListeners } from './lib/analytics';

// Pages
import { HomePage } from './components/home/HomePage';
import { CategoryPage } from './components/pages/CategoryPage';
import {
  PrivacyPolicyPage,
  TermsPage,
  AboutPage,
  ContactPage,
  DisclaimerPage,
} from './components/pages/PolicyPages';
import { NotFoundPage } from './components/pages/NotFoundPage';

// QR Tools
import { PhotoQROverlayTool } from './components/tools/qr/PhotoQROverlayTool';
import { VCardBusinessCardTool } from './components/tools/qr/VCardBusinessCardTool';
import { UnifiedUrlQRTool } from './components/tools/qr/UnifiedUrlQRTool';
import { QRScannerTool } from './components/tools/qr/QRScannerTool';
import { BatchQRTool } from './components/tools/qr/BatchQRTool';

// Image Tools
import { ImageConverterTool } from './components/tools/image/ImageConverterTool';
import { ImageCompressorTool } from './components/tools/image/ImageCompressorTool';
import { ImageResizerTool } from './components/tools/image/ImageResizerTool';
import { ImageCropRotateTool } from './components/tools/image/ImageCropRotateTool';
import { PassportPhotoTool } from './components/tools/image/PassportPhotoTool';

// PDF Tools
import { MergePdfTool } from './components/tools/pdf/MergePdfTool';
import { SplitPdfTool } from './components/tools/pdf/SplitPdfTool';
import { ImagesToPdfTool } from './components/tools/pdf/ImagesToPdfTool';
import { WatermarkPdfTool } from './components/tools/pdf/WatermarkPdfTool';
import { PageNumberPdfTool } from './components/tools/pdf/PageNumberPdfTool';

// Career Tools
import { ResumeMakerTool } from './components/tools/career/ResumeMakerTool';
import { AtsCheckerTool } from './components/tools/career/AtsCheckerTool';
import { JobTrackerTool } from './components/tools/career/JobTrackerTool';

// Utilities & Dev
import { DevTools } from './components/tools/utilities/DevTools';
import { TextTools } from './components/tools/utilities/TextTools';
import { ColorTools } from './components/tools/design/ColorTools';
import { FinanceCalcTools } from './components/tools/calculators/FinanceCalcTools';
import { UnitConverterTool } from './components/tools/calculators/UnitConverterTool';

const MainContent: React.FC = () => {
  const { navState } = useApp();

  React.useEffect(() => {
    const cleanup = initGlobalAnalyticsListeners();
    return cleanup;
  }, []);

  const renderToolComponent = (toolId: string) => {
    switch (toolId) {
      // QR Tools
      case 'photo-qr-overlay':
      case 'url-link-qr':
      case 'wifi-qr':
      case 'whatsapp-qr':
        return <PhotoQROverlayTool />;

      case 'vcard-qr':
      case 'visiting-card':
        return <VCardBusinessCardTool />;

      case 'qr-designer':
        return <UnifiedUrlQRTool />;

      case 'batch-qr':
        return <BatchQRTool />;

      case 'qr-scanner':
        return <QRScannerTool />;

      // Image Tools
      case 'jpg-to-png':
        return <ImageConverterTool forcedTargetFormat="png" />;

      case 'png-to-jpg':
        return <ImageConverterTool forcedTargetFormat="jpeg" />;

      case 'jpg-to-webp':
        return <ImageConverterTool forcedTargetFormat="webp" />;

      case 'webp-to-jpg':
        return <ImageConverterTool forcedTargetFormat="jpeg" />;

      case 'png-to-webp':
        return <ImageConverterTool forcedTargetFormat="webp" />;

      case 'webp-to-png':
        return <ImageConverterTool forcedTargetFormat="png" />;

      case 'image-converter':
        return <ImageConverterTool />;

      case 'image-compressor':
        return <ImageCompressorTool />;

      case 'image-resizer':
        return <ImageResizerTool />;

      case 'image-cropper':
      case 'image-rotator':
        return <ImageCropRotateTool />;

      case 'passport-photo-maker':
        return <PassportPhotoTool />;

      // PDF Tools
      case 'image-to-pdf':
        return <ImagesToPdfTool />;

      case 'pdf-merge':
        return <MergePdfTool />;

      case 'pdf-split':
      case 'pdf-page-manager':
        return <SplitPdfTool />;

      case 'pdf-watermark':
        return <WatermarkPdfTool />;

      case 'pdf-rotate':
      case 'pdf-password':
        return <PageNumberPdfTool />;

      // Career Tools
      case 'resume-builder':
      case 'cover-letter-builder':
      case 'business-card':
        return <ResumeMakerTool />;

      case 'resume-analyzer':
      case 'job-description-analyzer':
        return <AtsCheckerTool />;

      case 'job-search-tracker':
        return <JobTrackerTool />;

      // Utility & Developer Tools
      case 'word-counter':
        return <TextTools toolType="counter" />;

      case 'case-converter':
        return <TextTools toolType="case" />;

      case 'text-cleaner':
        return <TextTools toolType="cleaner" />;

      case 'markdown-preview':
        return <TextTools toolType="markdown" />;

      case 'json-formatter':
        return <DevTools toolType="json" />;

      case 'base64-converter':
        return <DevTools toolType="base64" />;

      case 'url-encoder':
        return <DevTools toolType="url" />;

      case 'timestamp-converter':
        return <DevTools toolType="timestamp" />;

      case 'password-generator':
        return <DevTools toolType="password" />;

      case 'unit-converter':
        return <UnitConverterTool />;

      // Design Tools
      case 'color-picker':
        return <ColorTools toolType="contrast" />;

      case 'css-gradient':
        return <ColorTools toolType="palette" />;

      case 'image-color-extractor':
        return <ColorTools toolType="picker" />;

      // Calculators & Finance Tools
      case 'loan-calculator':
        return <FinanceCalcTools calcType="loan" />;

      case 'compound-interest':
        return <FinanceCalcTools calcType="compound" />;

      case 'tip-calculator':
        return <FinanceCalcTools calcType="tip" />;

      case 'discount-calculator':
        return <FinanceCalcTools calcType="discount" />;

      case 'date-calculator':
        return <FinanceCalcTools calcType="date" />;

      default:
        return <NotFoundPage attemptedSlug={toolId} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative text-slate-100 selection:bg-emerald-500 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Background layer */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat bg-[#060b09]"
        style={{
          backgroundImage: "url('/assets/background.jpg')",
        }}
      />

      <div
        aria-hidden="true"
        className="fixed inset-0 app-bg-overlay pointer-events-none z-0"
      />

      <div className="relative z-10 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden pt-14 sm:pt-16">
        <Header />

        <LeftSidebar />

        <RightSidebar />

        <SearchModal />

        <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-6 overflow-x-hidden">
          {/* Router View */}
          {navState.view === 'home' && <HomePage />}

          {navState.view === 'category' && navState.category && (
            <CategoryPage category={navState.category} />
          )}

          {navState.view === 'legal' && (
            <>
              {navState.legalPage === 'privacy' && <PrivacyPolicyPage />}
              {navState.legalPage === 'terms' && <TermsPage />}
              {navState.legalPage === 'about' && <AboutPage />}
              {navState.legalPage === 'contact' && <ContactPage />}
              {navState.legalPage === 'disclaimer' && <DisclaimerPage />}
              {!navState.legalPage && <PrivacyPolicyPage />}
            </>
          )}

          {navState.view === 'tool' &&
            navState.toolId &&
            (() => {
              const toolDef = TOOLS.find((t) => t.id === navState.toolId);

              if (!toolDef) {
                return <NotFoundPage attemptedSlug={navState.toolId} />;
              }

              return (
                <ToolWorkspace tool={toolDef}>
                  {renderToolComponent(navState.toolId)}
                </ToolWorkspace>
              );
            })()}

          {navState.view === '404' && (
            <NotFoundPage attemptedSlug={navState.toolId} />
          )}
        </main>

        <Footer />

        <CookieConsentBanner />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
