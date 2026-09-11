import { FaqItem } from '../types';

export interface ToolSeoData {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  introduction: string;
  howToUse: string[];
  features: string[];
  supportedFormats: string;
  privacyExplanation: string;
  useCases: Array<{ title: string; description: string }>;
  faqs: FaqItem[];
  relatedToolIds: string[];
}

/**
 * Handcrafted, people-first SEO details for key utility tools.
 * strictly adheres to Google's Helpful Content guidelines:
 * - NO keyword stuffing
 * - NO hidden text
 * - NO duplicate copy
 * - Clear, practical, user-focused instructions and benefits.
 */
export const TOOL_SEO_DICTIONARY: Record<string, Partial<ToolSeoData>> = {
  'photo-qr-overlay': {
    h1: 'Photo + QR Code Overlay Generator',
    metaTitle: 'Photo + QR Code Overlay Generator (100% Free & Private) | Nova Tools',
    metaDescription: 'Overlay scannable QR codes onto personal photos, event posters, flyers, or business cards directly in your browser. Client-side, instant, zero uploads.',
    introduction: 'The Photo + QR Code Overlay tool allows creators, business owners, and event organizers to place scannable Wi-Fi, URL, WhatsApp, or vCard QR codes directly onto any image without needing heavy desktop graphic design software.',
    howToUse: [
      'Upload your background photo or banner (JPG, PNG, WebP supported).',
      'Choose the QR payload type: website URL, Wi-Fi login, contact vCard, or WhatsApp chat link.',
      'Adjust the QR badge placement (top-right, bottom-right, centered, etc.), size, and corner padding.',
      'Customize optional corner styling, margin, and contrast badge.',
      'Download your high-resolution composite photo ready for digital sharing or print.',
    ],
    features: [
      'Supports high-density QR generation with automatic error correction (Level M and Q).',
      'Interactive visual positioning with corner presets and edge snapping.',
      'Client-side canvas rendering preserving native camera photo resolution.',
      'Optional protective background badge ensuring scannability over busy photo textures.',
      'No watermark, no account registration required.',
    ],
    supportedFormats: 'Input: JPG, JPEG, PNG, WebP, SVG. Output: High-resolution PNG or JPG up to 4096×4096 px.',
    privacyExplanation: 'Your uploaded photos and QR inputs are processed exclusively in your browser using the HTML5 2D Canvas API. No images are ever transmitted over a network or saved to remote cloud servers.',
    useCases: [
      {
        title: 'Restaurant & Café Table Tents',
        description: 'Place table-ordering or Wi-Fi login QR codes directly onto mouth-watering food photography banners.',
      },
      {
        title: 'Event Invitations & Posters',
        description: 'Add Google Maps venue links or calendar RSVP QR badges into wedding, concert, or conference flyers.',
      },
      {
        title: 'Real Estate & Product Showcases',
        description: 'Overlay virtual tour links or product spec sheet links onto property or catalog photographs.',
      },
      {
        title: 'Social Media & Networking Cards',
        description: 'Print scannable contact vCard or Instagram portfolio codes onto promotional handouts.',
      },
    ],
    faqs: [
      {
        question: 'Will overlaying a QR code over a dark photo make it hard to scan?',
        answer: 'Our tool automatically applies a clean contrast shield behind the QR code, ensuring optical barcode readers and mobile smartphone cameras can detect the quiet zone instantly.',
      },
      {
        question: 'Does this tool reduce my original photo resolution?',
        answer: 'No. The output maintains your original uploaded dimensions up to standard web canvas limits, delivering crisp prints and clear QR modules.',
      },
      {
        question: 'Can I generate a Wi-Fi QR code that connects automatically?',
        answer: 'Yes! Select the Wi-Fi mode, enter your SSID and network password. When scanned with iOS or Android camera apps, phones prompt to join the Wi-Fi network immediately.',
      },
      {
        question: 'Are there watermarks or download fees?',
        answer: 'No. Nova Tools is completely free and never adds promotional branding, watermarks, or hidden paywalls to your images.',
      },
    ],
    relatedToolIds: ['vcard-qr', 'whatsapp-qr', 'qr-designer', 'qr-scanner'],
  },

  'jpg-to-png': {
    h1: 'Online JPG to PNG Converter (Lossless & Fast)',
    metaTitle: 'Convert JPG to PNG Online - Free & Lossless | Nova Tools',
    metaDescription: 'Convert compressed JPEG and JPG images to lossless PNG format in your browser. Fast client-side rendering with zero file uploads or quality loss.',
    introduction: 'Convert JPEG and JPG files into lossless PNG format without uploading your private images to third-party servers. Fast, simple, and runs locally inside your browser.',
    howToUse: [
      'Select or drag-and-drop one or multiple JPG/JPEG photos into the workspace.',
      'Preview image dimensions, resolution, and estimated PNG output format.',
      'Click Convert to transform the raster image using the browser-native rendering engine.',
      'Download your pristine PNG file individually or in bulk.',
    ],
    features: [
      'Lossless pixel retention prevents additional compression artifacts.',
      'High-speed local conversion with zero network latency or server queue delays.',
      'Preserves original color profiles and full pixel dimensions.',
      'Batch processing capability for converting collections of photographs quickly.',
      'Safe for sensitive workplace documents, IDs, and private photography.',
    ],
    supportedFormats: 'Input: .jpg, .jpeg, .jfif. Output: Standard 24-bit / 32-bit lossless .png format.',
    privacyExplanation: 'Unlike traditional online conversion sites that upload your photos to external cloud storage, Nova Tools decodes and recompresses your images in local memory on your device. Your data never touches our servers.',
    useCases: [
      {
        title: 'Graphic Design & Cutouts',
        description: 'Convert JPEG stock assets to PNG before importing into design suites or overlaying transparent artwork.',
      },
      {
        title: 'Archival & Image Editing',
        description: 'Stop generation loss from repeated JPEG saves by switching editing pipelines to lossless PNG.',
      },
      {
        title: 'Software Development & Icons',
        description: 'Prepare pixel-perfect raster graphics for web applications, mobile apps, and UI mockups.',
      },
    ],
    faqs: [
      {
        question: 'Will converting a JPG to PNG improve its image quality?',
        answer: 'Converting from JPG to PNG does not magically fix existing compression artifacts from the JPG, but it stops any further degradation and allows you to add transparent layers in graphic editors.',
      },
      {
        question: 'Why is the resulting PNG file sometimes larger than the JPG?',
        answer: 'JPG uses lossy compression that discards subtle color nuances, whereas PNG is a lossless format that preserves every pixel exactly as decoded. For photos, PNGs are naturally larger.',
      },
      {
        question: 'Can I convert large camera photos?',
        answer: 'Yes! Because processing runs in your local browser memory, file sizes are not restricted by strict 5MB server upload caps.',
      },
    ],
    relatedToolIds: ['png-to-jpg', 'image-compressor', 'image-resizer', 'image-to-pdf'],
  },

  'png-to-jpg': {
    h1: 'Online PNG to JPG Converter (Small Size & Clean)',
    metaTitle: 'Convert PNG to JPG Online - Reduce File Size | Nova Tools',
    metaDescription: 'Convert transparent or heavy PNG graphics to lightweight standard JPG format. Adjust compression quality, select custom background fill, and download instantly.',
    introduction: 'Easily turn heavy, transparent PNG images into lightweight, universally compatible JPG photos. Ideal for email attachments, web publishing, and reducing storage footprint.',
    howToUse: [
      'Drag and drop your PNG file into the upload box.',
      'Select a background color (default clean white) to replace any transparent areas.',
      'Adjust the quality slider (e.g. 85% to 95%) to balance file weight against visual fidelity.',
      'Click Convert and download your optimized JPG photo immediately.',
    ],
    features: [
      'Customizable background fill (white, black, or custom hex) prevents transparent areas from turning black.',
      'Variable compression quality slider with live file-size estimation.',
      'Dramatically reduces file size by up to 70-90% compared to heavy PNG graphics.',
      'Runs 100% in your browser without uploading confidential graphics to the web.',
    ],
    supportedFormats: 'Input: .png (8-bit, 24-bit, 32-bit with alpha). Output: Standard progressive/baseline .jpg.',
    privacyExplanation: 'Zero server communication: Nova Tools draws your PNG onto an off-screen HTML canvas element, fills transparency with your chosen color, and exports the JPEG data URL locally in JavaScript.',
    useCases: [
      {
        title: 'Website Performance & Page Speed',
        description: 'Replace heavy PNG hero banners and product images with compact JPGs to boost Google Core Web Vitals.',
      },
      {
        title: 'Email Attachments & Resumes',
        description: 'Convert oversized screenshots and scanned graphics to lightweight JPGs that fit under strict email inbox limits.',
      },
      {
        title: 'Form & Portal Uploads',
        description: 'Satisfy government, passport, or job application portals that explicitly reject PNG formats.',
      },
    ],
    faqs: [
      {
        question: 'What happens to transparent backgrounds when converting to JPG?',
        answer: 'JPG does not support alpha transparency. Nova Tools lets you choose a clean fill color (such as white or custom) so your subject looks seamless.',
      },
      {
        question: 'What quality setting is recommended for the web?',
        answer: 'A quality setting of 82% to 88% generally provides an imperceptible loss of visual detail while reducing file size by up to 80%.',
      },
    ],
    relatedToolIds: ['jpg-to-png', 'image-compressor', 'image-resizer', 'jpg-to-webp'],
  },

  'image-compressor': {
    h1: 'Free Online Image Compressor (JPG, PNG, WebP)',
    metaTitle: 'Compress Images Online Free - Lossless & Lossy | Nova Tools',
    metaDescription: 'Reduce image file size dramatically without noticeable quality loss. Real-time file size preview, adjustable slider, batch support, 100% private.',
    introduction: 'Shrink your photos, banners, and screenshots by up to 85% while keeping crisp visual detail. Optimized for web developers, designers, and content creators looking to speed up websites.',
    howToUse: [
      'Upload one or more images (JPG, PNG, or WebP format).',
      'Adjust the target quality slider to your desired compression level.',
      'Compare original file size against the new compressed size in real time.',
      'Download your optimized file ready for upload or sharing.',
    ],
    features: [
      'Real-time before-and-after byte counter showing exact percentage saved.',
      'Smart canvas re-sampling preserving high-frequency image edges.',
      'Multi-format support covering standard JPEG, modern WebP, and PNG.',
      'No daily quota, no file size restrictions, and zero remote server processing.',
    ],
    supportedFormats: 'JPEG (.jpg, .jpeg), PNG (.png), WebP (.webp).',
    privacyExplanation: 'Every byte stays on your machine. Compression is executed via client-side canvas algorithms, guaranteeing complete privacy for personal photos and confidential corporate media.',
    useCases: [
      {
        title: 'Faster Website Load Times',
        description: 'Compress blog images and e-commerce catalogs to improve SEO rankings and reduce bandwidth costs.',
      },
      {
        title: 'Job & University Application Portals',
        description: 'Meet strict 500KB or 2MB upload limits on portal forms without losing readability on scanned certificates.',
      },
      {
        title: 'WhatsApp & Messaging Efficiency',
        description: 'Share lightweight photos that send instantly even on limited mobile data connections.',
      },
    ],
    faqs: [
      {
        question: 'Will image compression make my photos look blurry?',
        answer: 'Not when tuned properly. Our modern quantization algorithm removes imperceptible high-frequency color variations while retaining sharp lines, text, and faces.',
      },
      {
        question: 'Is there a limit on how many images I can compress?',
        answer: 'No! Since compression runs locally in your web browser, you can compress as many files as your device memory comfortably supports.',
      },
    ],
    relatedToolIds: ['image-resizer', 'jpg-to-png', 'png-to-jpg', 'image-to-pdf'],
  },

  'image-resizer': {
    h1: 'Online Image Resizer (Pixel & Percentage Scaling)',
    metaTitle: 'Resize Images Online Free - Custom Width & Height | Nova Tools',
    metaDescription: 'Resize photos to exact width and height dimensions with aspect ratio locking. High-fidelity interpolation, instant preview, 100% private in-browser tool.',
    introduction: 'Quickly change image pixel dimensions with locked aspect ratio, percentage scaling presets, and smooth bicubic re-sampling. Fast and entirely private.',
    howToUse: [
      'Select your source image from your computer or mobile gallery.',
      'Enter desired width or height, or pick a percentage scaling preset (50%, 75%, 200%).',
      'Keep aspect ratio locked to avoid distortion or unlock for custom freeform sizing.',
      'Preview the new dimensions and download your scaled image.',
    ],
    features: [
      'Aspect ratio lock prevents accidental stretching or distortion.',
      'Quick scaling presets (25%, 50%, 75%, 150%, 200%).',
      'High-quality multi-step canvas downsampling to eliminate jagged pixel artifacts.',
      'Outputs to JPG, PNG, or WebP format.',
    ],
    supportedFormats: 'Input: JPG, PNG, WebP, GIF, SVG. Output: JPG, PNG, WebP.',
    privacyExplanation: 'Zero cloud latency: Scaling is computed entirely in your browser window using your computer graphics hardware. No media is stored or monitored.',
    useCases: [
      {
        title: 'Social Media Banners & Avatars',
        description: 'Resize graphics to exact platform dimensions (e.g. YouTube banner 2560×1440, LinkedIn cover 1584×396).',
      },
      {
        title: 'Thumbnail Generation',
        description: 'Generate standardized uniform thumbnails for blogs, portfolio galleries, and product catalogs.',
      },
    ],
    faqs: [
      {
        question: 'Does resizing maintain image sharpness?',
        answer: 'Yes. For downscaling, our canvas engine uses smoothing interpolation to avoid aliasing and preserve clarity.',
      },
    ],
    relatedToolIds: ['image-compressor', 'image-cropper', 'image-converter', 'image-rotator'],
  },

  'pdf-merge': {
    h1: 'Free Online PDF Merge (Combine Multiple PDFs)',
    metaTitle: 'Merge PDF Files Online - 100% Free & Private | Nova Tools',
    metaDescription: 'Combine multiple PDF documents into a single organized file with easy drag-and-drop ordering. Fast client-side merging with zero server uploads.',
    introduction: 'Merge multiple PDF documents, receipts, contracts, and scans into a single organized PDF file. Safe, instant, and runs entirely in your browser without exposing sensitive paperwork.',
    howToUse: [
      'Select or drop two or more PDF files into the merge queue.',
      'Drag or use arrow buttons to arrange documents into your preferred sequential order.',
      'Inspect page counts and document titles in the live queue list.',
      'Click Merge PDF to assemble the new document and download immediately.',
    ],
    features: [
      'Intuitive drag-and-drop sequence reordering.',
      'Retains original vector text clarity, bookmarks, and high-resolution embedded scans.',
      'Client-side PDF compilation powered by WebAssembly/PDF engines.',
      'Zero server upload: Safe for tax returns, medical files, legal briefs, and bank statements.',
    ],
    supportedFormats: 'Standard PDF 1.3 to PDF 2.0 files.',
    privacyExplanation: 'Confidential documents should never be uploaded to unknown third-party conversion servers. Nova Tools reads, splices, and outputs your PDF files purely inside your browser memory.',
    useCases: [
      {
        title: 'Job Applications & Portfolios',
        description: 'Combine your cover letter, resume, certificates, and reference letters into a single professional PDF attachment.',
      },
      {
        title: 'Financial & Tax Documentation',
        description: 'Merge monthly bank statements, receipts, and invoices into unified yearly tax folders.',
      },
      {
        title: 'Academic Papers & Theses',
        description: 'Join chapter drafts, title pages, appendices, and bibliographies into a single submission-ready dissertation.',
      },
    ],
    faqs: [
      {
        question: 'Is there a page or file limit when merging PDFs?',
        answer: 'Because Nova Tools runs on your device rather than a shared server, limits are determined only by your computer or phone available memory.',
      },
      {
        question: 'Will merging PDFs degrade text quality or make vector shapes blurry?',
        answer: 'No. Vector fonts, crisp vector line-art, and exact embedded raster assets are cloned directly without re-rendering or compression.',
      },
      {
        question: 'Is it safe to merge confidential medical or financial records?',
        answer: 'Yes! Nova Tools does not send your documents across the internet. You can even disconnect your Wi-Fi and the tool will continue working.',
      },
    ],
    relatedToolIds: ['pdf-split', 'image-to-pdf', 'pdf-rotate', 'pdf-page-manager'],
  },

  'pdf-split': {
    h1: 'Free Online PDF Split (Extract Pages Instantly)',
    metaTitle: 'Split PDF Pages Online - Fast, Free & Private | Nova Tools',
    metaDescription: 'Extract specific pages or page ranges from any PDF document into a clean new file. Client-side processing with zero file uploads or data leakage.',
    introduction: 'Extract specific pages, chapters, or page ranges from any PDF document without uploading confidential papers to external servers.',
    howToUse: [
      'Upload the PDF document you wish to extract pages from.',
      'Enter page ranges (e.g., 1-3, 5, 8-12) or select target individual pages.',
      'Preview extracted page boundaries to confirm accuracy.',
      'Click Split PDF to generate and download your lightweight new document.',
    ],
    features: [
      'Flexible range syntax: specify single pages (1, 4), ranges (5-10), or combinations.',
      'Instant extraction with zero upload wait times.',
      'Preserves original typography, hyperlinks, and vector artwork.',
      '100% private client-side processing.',
    ],
    supportedFormats: 'All standard PDF documents.',
    privacyExplanation: 'Your PDF stays strictly on your local device. The extraction logic runs within the browser sandbox with zero telemetry or remote archiving.',
    useCases: [
      {
        title: 'Contract Extraction',
        description: 'Extract signature pages or specific clauses from lengthy 100-page commercial contracts.',
      },
      {
        title: 'Academic Readings & Chapters',
        description: 'Isolate a single required book chapter or syllabus section for reading on tablets.',
      },
    ],
    faqs: [
      {
        question: 'Can I split password-protected PDFs?',
        answer: 'If the PDF requires a password to open, unlock it first or supply your password so your browser can decrypt the page contents before splitting.',
      },
    ],
    relatedToolIds: ['pdf-merge', 'pdf-rotate', 'image-to-pdf', 'pdf-page-manager'],
  },

  'image-to-pdf': {
    h1: 'Online Image to PDF Converter (JPG & PNG to PDF)',
    metaTitle: 'Convert Image to PDF Online - Free & High Quality | Nova Tools',
    metaDescription: 'Convert JPG, PNG, and WebP images into a cleanly formatted, printable multi-page PDF document. Fast client-side generation, no uploads, 100% private.',
    introduction: 'Turn multiple photos, scans, whiteboard notes, and screenshots into a single, beautifully formatted, multi-page PDF document ready for printing or emailing.',
    howToUse: [
      'Upload one or more image files (JPG, PNG, WebP supported).',
      'Reorder images in your desired sequence.',
      'Choose page orientation (Portrait or Landscape) and margins.',
      'Click Generate PDF to export and save your document.',
    ],
    features: [
      'Multi-page compilation from multiple image sources.',
      'Automatic page sizing with standard A4 and Letter dimensions.',
      'High-resolution print output with crisp image scaling.',
      '100% browser-based with zero file storage on the web.',
    ],
    supportedFormats: 'Input: JPG, PNG, WebP. Output: Standard multi-page PDF.',
    privacyExplanation: 'Your photos never travel across a network. Everything is generated using client-side PDF document libraries.',
    useCases: [
      {
        title: 'Scanned Document Compilation',
        description: 'Convert smartphone photos of signed forms, receipts, or contracts into a single official PDF.',
      },
      {
        title: 'Homework & Assignment Submissions',
        description: 'Combine handwritten homework page photos into a single PDF document for classroom portals.',
      },
    ],
    faqs: [
      {
        question: 'Can I combine different image formats like JPG and PNG together?',
        answer: 'Yes! You can mix JPG, PNG, and WebP images in the same document seamlessly.',
      },
    ],
    relatedToolIds: ['pdf-merge', 'jpg-to-png', 'png-to-jpg', 'image-compressor'],
  },

  'json-formatter': {
    h1: 'Online JSON Formatter & Validator (Beautify & Minify)',
    metaTitle: 'JSON Formatter & Validator Online - Beautify & Minify | Nova Tools',
    metaDescription: 'Format, validate, beautify, and minify JSON data with syntax highlighting and instant error detection. 100% private client-side developer utility.',
    introduction: 'Clean up messy, minified, or unformatted JSON strings into human-readable indented structures. Highlights syntax errors, validates schemas, and runs entirely in your browser.',
    howToUse: [
      'Paste your raw JSON text or drag-and-drop a .json file.',
      'Choose your indentation preference: 2 spaces, 4 spaces, or compact 1-line minification.',
      'Check the real-time syntax validator for syntax errors or line numbers.',
      'Click Copy to Clipboard or Download as .json file.',
    ],
    features: [
      'Instant syntax validation with precise error highlighting and line-number reporting.',
      'One-click Beautify (2 spaces or 4 spaces) and Minify toggle.',
      'Full Unicode and emoji compatibility.',
      'No server communication: Safe for proprietary API payloads and production JSON tokens.',
    ],
    supportedFormats: 'Standard RFC 8259 JSON format.',
    privacyExplanation: 'Developers often handle sensitive API keys, customer payloads, and database records. Nova Tools formats JSON strictly in client JavaScript memory without sending data to servers.',
    useCases: [
      {
        title: 'API Debugging',
        description: 'Format unreadable single-line REST or GraphQL API response payloads for easy inspection.',
      },
      {
        title: 'Configuration File Editing',
        description: 'Clean up and validate package.json, settings.json, and CI/CD workflow configuration files.',
      },
      {
        title: 'Payload Minification',
        description: 'Strip unnecessary whitespace from JSON payloads before transmitting over bandwidth-sensitive web sockets.',
      },
    ],
    faqs: [
      {
        question: 'Does this JSON tool send my data to third-party servers?',
        answer: 'No. All parsing and stringification occurs directly on your computer inside the V8 JavaScript engine of your browser.',
      },
      {
        question: 'What happens if my JSON has trailing commas?',
        answer: 'Standard JSON syntax forbids trailing commas. Our validator pinpoints the exact line and character so you can fix it immediately.',
      },
    ],
    relatedToolIds: ['base64-converter', 'url-encoder', 'jwt-inspector', 'hash-tool'],
  },

  'base64-converter': {
    h1: 'Online Base64 Encoder & Decoder (Text & Data)',
    metaTitle: 'Base64 Encoder & Decoder Online - Fast & Private | Nova Tools',
    metaDescription: 'Encode and decode plain text and binary strings to and from Base64 format. Full UTF-8 support, live conversion, 100% browser-based security.',
    introduction: 'Quickly encode plain text strings into standard Base64 representation or decode Base64 data back into readable text. Robust UTF-8 handling prevents character corruption.',
    howToUse: [
      'Select Encode or Decode mode.',
      'Type or paste your content into the input field.',
      'View the real-time converted output instantly.',
      'Copy the output with one click or download it as a text file.',
    ],
    features: [
      'Full UTF-8 encoding support prevents garbled accents and international characters.',
      'Instant two-way conversion with real-time character counters.',
      'One-click copy to clipboard with responsive feedback.',
      'Secure client-side operation with zero tracking.',
    ],
    supportedFormats: 'UTF-8 text, ASCII, standard RFC 4648 Base64 strings.',
    privacyExplanation: 'All encoding and decoding runs in browser memory via native TextEncoder/TextDecoder APIs. Your strings are never stored or inspected.',
    useCases: [
      {
        title: 'Web Development & Basic Auth',
        description: 'Generate authorization headers and URL safe data strings for web integrations.',
      },
      {
        title: 'Data URI Inspection',
        description: 'Decode embedded data URI strings from stylesheets and HTML email templates.',
      },
    ],
    faqs: [
      {
        question: 'Does Base64 count as encryption?',
        answer: 'No. Base64 is an encoding format designed for safe data transmission across text channels, not an encryption cipher. Anyone can decode it.',
      },
    ],
    relatedToolIds: ['url-encoder', 'hash-tool', 'json-formatter', 'html-entities'],
  },

  'url-encoder': {
    h1: 'Online URL Encoder & Decoder (Percent-Encoding)',
    metaTitle: 'URL Encoder & Decoder Online - Percent Encoding Tool | Nova Tools',
    metaDescription: 'Encode special characters into percent-encoded URL formats or decode query parameters back to clean text. 100% private in-browser utility.',
    introduction: 'Convert reserved characters and special symbols into safe percent-encoded format for HTTP query parameters, or decode complex URLs back to readable text.',
    howToUse: [
      'Paste your raw URL, query parameter, or text string into the input area.',
      'Toggle between URL Encode and URL Decode modes.',
      'Select standard encodeURIComponent or full URI encode mode.',
      'Copy the sanitized, valid URL string ready for use in web applications.',
    ],
    features: [
      'Handles full internationalized Unicode characters, accents, and symbols.',
      'Instant two-way encoding and decoding.',
      'Live validation of malformed percent-sequences (%XX).',
      'Completely client-side with zero telemetry.',
    ],
    supportedFormats: 'Standard RFC 3986 URI / URL encoding specifications.',
    privacyExplanation: 'URLs and query strings frequently contain sensitive session IDs, email addresses, or internal endpoints. Nova Tools handles them 100% locally in your browser.',
    useCases: [
      {
        title: 'Query String Building',
        description: 'Safely encode user-submitted search terms, UTM tracking parameters, and redirect destination URLs.',
      },
      {
        title: 'Webhook & API Troubleshooting',
        description: 'Decode complex callback URLs and verify webhook payload arguments.',
      },
    ],
    faqs: [
      {
        question: 'What is the difference between encodeURI and encodeURIComponent?',
        answer: 'encodeURI preserves protocol characters like http://, ?, and & for entire web addresses, while encodeURIComponent encodes everything including slashes and ampersands for query parameter values.',
      },
    ],
    relatedToolIds: ['base64-converter', 'json-formatter', 'hash-tool', 'html-entities'],
  },

  'resume-builder': {
    h1: 'Free ATS-Friendly Resume Builder & CV Maker',
    metaTitle: 'Free ATS Resume Builder - Clean Single-Column CV Maker | Nova Tools',
    metaDescription: 'Build professional, ATS-optimized resumes that pass automated applicant tracking systems. Live preview, instant PDF export, 100% private local storage.',
    introduction: 'Create a clean, ATS-compliant single-column resume that passes corporate Applicant Tracking Systems with ease. Choose standard typography, structure work experience, and export high-resolution PDFs without watermarks.',
    howToUse: [
      'Enter your contact information, summary, work history, and core skills.',
      'Use action-oriented bullet points emphasizing quantifiable business achievements.',
      'Preview the real-time ATS layout formatted with standard margins and fonts.',
      'Download your finalized PDF ready to submit to top employers.',
    ],
    features: [
      'Standardized single-column typography parsed accurately by Workday, Taleo, and Greenhouse.',
      'Local browser persistence: your draft saves automatically to your browser storage.',
      'Zero forced watermarks, subscriptions, or paywalls.',
      'Integrated AI-assisted bullet point suggestions and ATS score review.',
    ],
    supportedFormats: 'Printable vector PDF, editable JSON backup file.',
    privacyExplanation: 'Your contact details, employment dates, and career history are confidential. Your resume draft is saved exclusively in your browser localStorage and is never sold to recruiters or advertisers.',
    useCases: [
      {
        title: 'Corporate Job Hunting',
        description: 'Maximize interview callbacks by eliminating multi-column graphics that confuse ATS parsers.',
      },
      {
        title: 'Career Transitions & New Graduates',
        description: 'Highlight transferable skills, internships, and project work in an internationally accepted layout.',
      },
    ],
    faqs: [
      {
        question: 'Why does this resume builder use a single-column layout?',
        answer: 'Top Applicant Tracking Systems (like Workday and Taleo) scan documents top-to-bottom, left-to-right. Multi-column tables often scramble your experience and cause automated rejections.',
      },
      {
        question: 'Is my resume draft saved if I refresh the page?',
        answer: 'Yes! Your draft is stored securely in your browser localStorage, so you can return anytime to edit or update it.',
      },
    ],
    relatedToolIds: ['ats-checker', 'bullet-improver', 'interview-prep', 'image-to-pdf'],
  },
};

/**
 * Returns complete SEO metadata for any tool ID.
 * If specific handcrafted copy exists in dictionary, it uses it.
 * Otherwise, it generates rich, people-first, non-duplicate copy based on the tool definition.
 */
export function getToolSeoContent(toolId: string, toolName: string, toolDescription: string, category: string): ToolSeoData {
  const custom = TOOL_SEO_DICTIONARY[toolId];
  if (custom && custom.h1 && custom.introduction) {
    return {
      h1: custom.h1,
      metaTitle: custom.metaTitle || `${custom.h1} | Nova Tools`,
      metaDescription: custom.metaDescription || `${toolDescription} 100% private client-side processing.`,
      introduction: custom.introduction,
      howToUse: custom.howToUse || [
        'Open the tool workspace directly in your browser.',
        'Configure your inputs or upload your source media.',
        'Inspect the real-time live preview for accuracy.',
        'Download or copy your finalized result with one click.',
      ],
      features: custom.features || [
        'High-performance client-side processing with zero server delays.',
        '100% private: no data stored on remote cloud servers.',
        'Mobile and desktop responsive with high DPI rendering.',
        'Free forever with zero watermarks or account signups.',
      ],
      supportedFormats: custom.supportedFormats || 'Standard web standards and formats.',
      privacyExplanation: custom.privacyExplanation || 'Nova Tools runs entirely inside your browser sandbox. Your data never leaves your device.',
      useCases: custom.useCases || [
        {
          title: 'Daily Productivity',
          description: `Fast, hassle-free ${toolName.toLowerCase()} execution for everyday tasks without software installation.`,
        },
        {
          title: 'Professional Workflows',
          description: `Dependable, high-accuracy processing suitable for workplace and personal projects.`,
        },
      ],
      faqs: custom.faqs || [
        {
          question: `Is ${toolName} completely free to use?`,
          answer: `Yes! Nova Tools is free to use with zero hidden fees, trial expirations, or forced signups.`,
        },
        {
          question: `Does ${toolName} save or upload my inputs?`,
          answer: `No. All operations run locally inside your browser memory using modern web APIs.`,
        },
      ],
      relatedToolIds: custom.relatedToolIds || [],
    };
  }

  // Fallback for tools not yet explicitly listed in dictionary:
  // Dynamically constructs clean, sensible, people-first copy (NO keyword stuffing)
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
  return {
    h1: `${toolName} - Free Online Tool`,
    metaTitle: `${toolName} - Free Online ${categoryLabel} Tool | Nova Tools`,
    metaDescription: `${toolDescription} 100% private, instant in-browser utility. No registration or file upload required.`,
    introduction: `${toolName} is a fast, free, and privacy-first online utility designed to help you with ${toolDescription.toLowerCase()} Everything runs locally inside your browser with zero server uploads.`,
    howToUse: [
      `Configure the settings and options in the ${toolName} interface.`,
      'Enter your content or select your source file.',
      'Check the real-time interactive preview to verify your desired output.',
      'Click to process, copy, or download your result directly to your device.',
    ],
    features: [
      'Instant local browser processing with zero upload wait times.',
      'Completely private: files and inputs never leave your computer or phone.',
      'Optimized for both mobile touchscreens and desktop workstations.',
      'Zero watermarks, no registration, and no daily usage limits.',
    ],
    supportedFormats: 'Standard modern formats compatible with web and mobile platforms.',
    privacyExplanation: 'We prioritize your digital privacy. All operations are performed strictly within your browser memory. We never transmit, store, or analyze your personal content.',
    useCases: [
      {
        title: 'Personal & Office Productivity',
        description: `Complete tasks quickly without downloading or configuring heavy desktop software.`,
      },
      {
        title: 'Privacy-Sensitive Data Handling',
        description: `Process documents and assets without trusting sensitive information to remote cloud servers.`,
      },
    ],
    faqs: [
      {
        question: `Is ${toolName} safe and private?`,
        answer: 'Yes. Nova Tools executes all logic client-side on your local device. No files or private inputs are uploaded to our servers.',
      },
      {
        question: 'Can I use this tool on my mobile phone?',
        answer: 'Yes, all our tools are fully responsive and optimized for mobile browsers, tablets, and desktops.',
      },
      {
        question: 'Are there any hidden costs or restrictions?',
        answer: 'No. Nova Tools is 100% free with unlimited usage and no watermarks.',
      },
    ],
    relatedToolIds: [],
  };
}
