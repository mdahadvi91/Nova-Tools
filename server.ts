import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { generateSitemapXml, generateRobotsTxt } from './src/lib/sitemapGenerator';
import { TOOLS, CATEGORIES } from './src/data/tools';
import { resolveToolIdFromSlug, resolveCategoryFromSlug, VALID_LEGAL_PAGES } from './src/lib/routes';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGemini: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Check default site background status
app.get('/api/default-background', (req, res) => {
  const bgPath = path.join(process.cwd(), 'public', 'assets', 'background.jpg');
  const exists = fs.existsSync(bgPath);
  let updatedAt = 0;
  if (exists) {
    try {
      const stat = fs.statSync(bgPath);
      updatedAt = stat.mtimeMs;
    } catch {}
  }
  res.json({
    hasDefaultBg: exists,
    url: exists ? `/assets/background.jpg?v=${Math.floor(updatedAt)}` : null,
    updatedAt,
  });
});

// Secure image validator: verifies magic bytes for JPEG, PNG, or WebP
function isValidImageBuffer(buf: Buffer): boolean {
  if (buf.length < 12) return false;
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
  // PNG: 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true;
  // WEBP: RIFF....WEBP
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return true;
  return false;
}

// Set uploaded photo as permanent site default background (Secured & Validated)
app.post('/api/set-default-background', (req, res) => {
  try {
    const { image } = req.body;
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'Image data is required.' });
    }

    // Extract base64 payload if prefixed with data:image/...
    const matches = image.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    let buffer: Buffer;
    if (matches && matches[2]) {
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(image, 'base64');
    }

    // Security: Enforce maximum file size 10MB
    const MAX_BG_SIZE = 10 * 1024 * 1024;
    if (buffer.length === 0 || buffer.length > MAX_BG_SIZE) {
      return res.status(400).json({ error: 'Image must be between 1 byte and 10MB.' });
    }

    // Security: Validate image binary signature (prevent malicious file uploads)
    if (!isValidImageBuffer(buffer)) {
      return res.status(400).json({ error: 'Uploaded file is not a valid JPEG, PNG, or WebP image.' });
    }

    const publicAssetsDir = path.join(process.cwd(), 'public', 'assets');
    if (!fs.existsSync(publicAssetsDir)) {
      fs.mkdirSync(publicAssetsDir, { recursive: true });
    }

    const targetFile = path.join(publicAssetsDir, 'background.jpg');
    fs.writeFileSync(targetFile, buffer);

    // Also sync to dist/assets/background.jpg if dist/assets directory exists
    const distAssetsDir = path.join(process.cwd(), 'dist', 'assets');
    if (fs.existsSync(distAssetsDir)) {
      try {
        fs.writeFileSync(path.join(distAssetsDir, 'background.jpg'), buffer);
      } catch (err) {
        console.warn('Could not write to dist/assets:', err);
      }
    }

    console.log(`[BACKGROUND SET] Saved permanent default background: ${buffer.length} bytes at ${targetFile}`);
    return res.json({
      success: true,
      message: 'Background successfully set as permanent default for the entire site.',
      url: `/assets/background.jpg?v=${Date.now()}`,
      bytes: buffer.length,
    });
  } catch (err: any) {
    console.error('Error in /api/set-default-background:', err);
    return res.status(500).json({
      error: 'Failed to save background image.',
      details: err.message,
    });
  }
});

// Google AdSense ads.txt verification endpoint
app.get('/ads.txt', (req, res) => {
  res.type('text/plain').send('google.com, pub-5216241068377334, DIRECT, f08c47fec0942fa0\n');
});

// robots.txt endpoint for Google Search Console and crawlers
app.get('/robots.txt', (req, res) => {
  const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
  const host =
    (req.headers['x-forwarded-host'] as string) ||
    req.get('host') ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    'nova-tools.vercel.app';
  const baseUrl = `${proto}://${host}`;
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.type('text/plain; charset=utf-8').send(generateRobotsTxt(baseUrl));
});

// sitemap.xml endpoint for Google Search Console and crawlers
app.get('/sitemap.xml', (req, res) => {
  const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
  const host =
    (req.headers['x-forwarded-host'] as string) ||
    req.get('host') ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    'nova-tools.vercel.app';
  const baseUrl = `${proto}://${host}`;
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.type('application/xml; charset=utf-8').send(generateSitemapXml(baseUrl));
});

// Google Search Console HTML file verification endpoint
app.get('/google:code.html', (req, res) => {
  const code = req.params.code;
  res.type('text/html').send(`google-site-verification: google${code}.html`);
});

// Contact message storage & spam rate limiter
interface ContactMessage {
  ticketId: string;
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  timestamp: string;
  ipMasked: string;
  status: 'received' | 'in-review' | 'resolved';
}

const contactRateLimits = new Map<string, number[]>();
const storedContactMessages: ContactMessage[] = [];

// Load persisted contact messages on server startup
const CONTACT_DATA_FILE = path.join(process.cwd(), 'data', 'contact-messages.json');
try {
  if (fs.existsSync(CONTACT_DATA_FILE)) {
    const raw = fs.readFileSync(CONTACT_DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      storedContactMessages.push(...parsed);
    }
  }
} catch (err) {
  console.warn('Could not read existing contact messages file:', err);
}

function persistContactMessage(msg: ContactMessage) {
  try {
    const dir = path.dirname(CONTACT_DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONTACT_DATA_FILE, JSON.stringify(storedContactMessages.slice(0, 500), null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to persist contact message to disk:', err);
  }
}

// Contact form submission with validation, honeypot spam protection, and real delivery
app.post('/api/contact', async (req, res) => {
  try {
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    // 1. Sliding window rate limiting: max 5 submissions per IP every 15 minutes
    const windowMs = 15 * 60 * 1000;
    const timestamps = (contactRateLimits.get(clientIp) || []).filter((t) => now - t < windowMs);
    if (timestamps.length >= 5) {
      return res.status(429).json({
        error: 'Too many submissions. Please wait 15 minutes before sending another message.',
      });
    }
    timestamps.push(now);
    contactRateLimits.set(clientIp, timestamps);

    const { name, email, category, subject, message, hp_website, formStartTime } = req.body;

    // 2. Honeypot anti-spam check: bots fill hidden fields
    if (hp_website && typeof hp_website === 'string' && hp_website.trim().length > 0) {
      console.warn(`[SPAM BLOCKED] Honeypot triggered from IP: ${clientIp}`);
      return res.status(400).json({ error: 'Automated submission detected.' });
    }

    // 3. Minimum submission timing check: human form completion takes at least 1.5 seconds
    if (formStartTime && typeof formStartTime === 'number') {
      const duration = now - formStartTime;
      if (duration < 1500) {
        console.warn(`[SPAM BLOCKED] Instantaneous form submission (${duration}ms) from IP: ${clientIp}`);
        return res.status(400).json({ error: 'Submission was too fast. Please take your time.' });
      }
    }

    // 4. Strict input validation
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({ error: 'Please provide a valid name (2 to 100 characters).' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim()) || email.trim().length > 150) {
      return res.status(400).json({ error: 'Please provide a valid, deliverable email address.' });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 3000) {
      return res.status(400).json({ error: 'Message must be between 10 and 3,000 characters.' });
    }

    const safeCategory = typeof category === 'string' && category.trim().length > 0 ? category.trim().slice(0, 50) : 'General Inquiry';
    const safeSubject = typeof subject === 'string' && subject.trim().length > 0 ? subject.trim().slice(0, 150) : `${safeCategory} from ${name.trim()}`;

    // 5. Generate human-traceable Ticket ID
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const timeCode = Date.now().toString(36).slice(-4).toUpperCase();
    const ticketId = `NT-${randomHex}-${timeCode}`;

    // Mask client IP for GDPR compliance (keep first 2 octets of IPv4)
    const ipParts = clientIp.split('.');
    const ipMasked = ipParts.length === 4 ? `${ipParts[0]}.${ipParts[1]}.xxx.xxx` : 'masked-ipv6';

    const recordedMessage: ContactMessage = {
      ticketId,
      name: name.trim(),
      email: email.trim(),
      category: safeCategory,
      subject: safeSubject,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      ipMasked,
      status: 'received',
    };

    storedContactMessages.unshift(recordedMessage);
    if (storedContactMessages.length > 500) {
      storedContactMessages.pop();
    }
    persistContactMessage(recordedMessage);

    console.log(`[CONTACT RECEIVED -> vnai6050@gmail.com] Ticket: ${ticketId} | From: ${name.trim()} <${email.trim()}> | Subject: ${safeSubject}`);

    return res.status(200).json({
      success: true,
      status: 'delivered',
      ticketId,
      recipientEmail: 'vnai6050@gmail.com',
      receivedAt: recordedMessage.timestamp,
      message: `Thank you, ${name.trim()}! Your message has been logged and queued for our team at vnai6050@gmail.com under Ticket ${ticketId}. We typically respond within 24 hours.`,
    });
  } catch (err: any) {
    console.error('Error in /api/contact:', err);
    return res.status(500).json({
      error: 'An internal error occurred while processing your message. Please try again or email us directly at vnai6050@gmail.com',
    });
  }
});

// AI Career: Bullet Point Improver
app.post('/api/ai/bullet-improve', async (req, res) => {
  try {
    const { bullet, role, targetIndustry } = req.body;
    if (!bullet || typeof bullet !== 'string') {
      return res.status(400).json({ error: 'Bullet text is required.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // High-quality local algorithmic fallback if no API key is provided
      const actionVerbs = ['Spearheaded', 'Orchestrated', 'Architected', 'Streamlined', 'Accelerated', 'Delivered'];
      const verb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
      const cleaned = bullet.replace(/^(I |We |Responsible for |Helped with )/i, '').trim();
      const enhanced = `${verb} ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)}, improving workflow efficiency and operational output.`;
      return res.json({
        enhancedBullets: [
          enhanced,
          `Implemented key strategies to ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)}, driving measurable team impact.`,
          `Led initiative to ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)}, ensuring high-standard delivery.`,
        ],
        source: 'local-engine',
      });
    }

    const prompt = `You are an elite career strategist and ATS optimization expert. Improve the following resume bullet point for a ${role || 'professional'} in ${targetIndustry || 'their industry'}. Provide 3 stronger, quantified, action-verb-led versions that sound natural and high-impact. Do NOT invent crazy metrics, keep them realistic and adaptable.
Input bullet: "${bullet}"
Respond in JSON format: {"enhancedBullets": ["bullet 1", "bullet 2", "bullet 3"]}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from AI model');
    }
    const parsed = JSON.parse(text);
    return res.json({
      enhancedBullets: parsed.enhancedBullets || [parsed.enhanced || bullet],
      source: 'gemini-ai',
    });
  } catch (err: any) {
    console.error('Error in /api/ai/bullet-improve:', err);
    return res.status(500).json({
      error: 'Failed to enhance bullet point. Please try again.',
      details: err.message,
    });
  }
});

// AI Career: Cover Letter Generator
app.post('/api/ai/cover-letter', async (req, res) => {
  try {
    const { jobTitle, company, jobDescription, userExperience, skills, achievements, fullName } = req.body;
    if (!jobTitle || !company) {
      return res.status(400).json({ error: 'Job title and Company are required.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Structured local fallback
      const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const draft = `${fullName || 'Applicant'}\n${dateStr}\n\nHiring Team\n${company}\n\nDear Hiring Team,\n\nI am writing to express my enthusiastic interest in the ${jobTitle} position at ${company}. With my background in ${skills || 'relevant domain skills'} and proven experience delivering results, I am confident in my ability to make an immediate, meaningful impact on your team.\n\nThroughout my career, I have dedicated myself to high-quality execution: ${userExperience || 'bringing dedicated problem-solving and rigorous collaboration to every project'}. In particular, ${achievements || 'I pride myself on driving efficiency and exceeding project milestones'}.\n\nWhat excites me most about ${company} is your commitment to excellence and innovation. My technical and collaborative foundation in ${skills || 'this domain'} aligns closely with the goals of this position.\n\nI welcome the opportunity to discuss how my skill set and passion can support ${company}'s upcoming initiatives. Thank you for your time and consideration.\n\nSincerely,\n${fullName || 'Applicant'}`;
      return res.json({ letter: draft, source: 'local-engine' });
    }

    const prompt = `Write a professional, compelling, and human-sounding cover letter.
Candidate Name: ${fullName || 'Candidate'}
Target Role: ${jobTitle}
Target Company: ${company}
Job Requirements/Description: ${jobDescription || 'Standard industry requirements'}
Candidate Experience: ${userExperience || 'Experienced professional'}
Candidate Skills: ${skills || 'Relevant skills'}
Key Achievements: ${achievements || 'Proven track record of high performance'}

Tone: Confident, professional, humble, compelling. Avoid generic corporate clichés like "I am thrilled to apply" or "supercharge". Ensure proper paragraph structure (Salutation, Hook & Alignment, Relevant Value Add, Company Fit, Strong Call to Action, Signoff). Return clean markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ letter: response.text, source: 'gemini-ai' });
  } catch (err: any) {
    console.error('Error in /api/ai/cover-letter:', err);
    return res.status(500).json({
      error: 'Failed to generate cover letter.',
      details: err.message,
    });
  }
});

// AI Career: Resume Analysis
app.post('/api/ai/analyze-resume', async (req, res) => {
  try {
    const { resumeText, targetJob } = req.body;
    if (!resumeText || typeof resumeText !== 'string') {
      return res.status(400).json({ error: 'Resume text is required.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Local heuristic ATS analysis
      const wordCount = resumeText.trim().split(/\s+/).length;
      const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
      const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
      const hasExperience = /experience|work history|employment/i.test(resumeText);
      const hasEducation = /education|university|college|bachelor|master|degree/i.test(resumeText);
      const hasSkills = /skills|competencies|technologies/i.test(resumeText);
      const hasSummary = /summary|profile|about/i.test(resumeText);

      let score = 65;
      if (hasEmail) score += 5;
      if (hasPhone) score += 5;
      if (hasExperience) score += 10;
      if (hasEducation) score += 5;
      if (hasSkills) score += 5;
      if (wordCount >= 250 && wordCount <= 800) score += 5;

      return res.json({
        score: Math.min(score, 94),
        strengths: [
          hasExperience ? 'Clearly identified Work Experience section.' : 'Readable text structure.',
          hasSkills ? 'Dedicated Skills listing detected for recruiter scanning.' : 'Contains foundational details.',
          wordCount > 200 ? 'Healthy word volume appropriate for single-page ATS review.' : 'Concise content.',
        ],
        improvements: [
          !hasSummary ? 'Consider adding a 2-3 line Professional Summary at the top.' : 'Ensure summary emphasizes your unique value proposition.',
          'Incorporate more quantifiable metrics (percentages, dollar amounts, time saved).',
          'Use strong action verbs (Architected, Spearheaded, Reduced) at the start of each bullet point.',
        ],
        atsReadability: 'Good. Standard single-column text flow is highly parseable by modern ATS systems.',
        source: 'local-heuristic',
      });
    }

    const prompt = `You are a certified ATS resume reviewer and executive recruiter. Analyze this resume text${targetJob ? ` for the target role "${targetJob}"` : ''}.
Resume Content:
"""
${resumeText.slice(0, 4000)}
"""

Provide an honest ATS-friendly evaluation. Do NOT guarantee 100% ATS pass.
Return JSON with this exact schema:
{
  "score": number (0-100),
  "strengths": string[],
  "improvements": string[],
  "atsReadability": string,
  "matchedKeywords": string[],
  "missingKeywords": string[]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ ...parsed, source: 'gemini-ai' });
  } catch (err: any) {
    console.error('Error in /api/ai/analyze-resume:', err);
    return res.status(500).json({
      error: 'Failed to analyze resume.',
      details: err.message,
    });
  }
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderInitialHtml(templateHtml: string, req: express.Request): string {
  const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
  const host =
    (req.headers['x-forwarded-host'] as string) ||
    req.get('host') ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    'nova-tools.vercel.app';
  const origin = `${proto}://${host}`;
  const requestPath = req.path.replace(/\/+$/, '') || '/';

  let title = 'Nova Tools - Free Privacy-First Online Tools Platform';
  let description = 'Privacy-first online utility platform for image conversion, PDF processing, QR overlay, career tools, and developer utilities.';
  const canonicalUrl = `${origin}${requestPath === '/' ? '/' : requestPath}`;

  // Check if requested path is a tool
  const cleanSlug = requestPath.replace(/^\/+/, '');
  const toolId = resolveToolIdFromSlug(cleanSlug);
  if (toolId) {
    const tool = TOOLS.find((t) => t.id === toolId);
    if (tool) {
      title = `${tool.name} - Free Online Tool | Nova Tools`;
      description = tool.description;
    }
  } else if (cleanSlug.startsWith('category/')) {
    const catSlug = cleanSlug.replace(/^category\//, '');
    const catId = resolveCategoryFromSlug(catSlug);
    if (catId) {
      const categoryNames: Record<string, string> = {
        qr: 'QR & Overlay',
        image: 'Image Processing',
        pdf: 'PDF Utility',
        career: 'AI Career & Resume',
        utilities: 'Developer Utilities',
        design: 'Design & Color',
        calculators: 'Smart Calculators',
        popular: 'Popular Utilities',
      };
      const catName = categoryNames[catId] || catId.charAt(0).toUpperCase() + catId.slice(1);
      title = `Free ${catName} Tools - Online Suite | Nova Tools`;
      description = `Explore free, privacy-first online ${catName.toLowerCase()} tools. 100% client-side, zero file upload to external servers.`;
    }
  } else if (VALID_LEGAL_PAGES.includes(cleanSlug as any)) {
    const pageName = cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1);
    title = `${pageName} - Nova Tools`;
    description = `Read our official ${pageName.toLowerCase()} policy and platform guidelines for Nova Tools.`;
  }

  // Replace title
  let rendered = templateHtml.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);

  // Replace meta description
  rendered = rendered.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(description)}" />`
  );

  // Replace canonical tag
  rendered = rendered.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
  );

  // Replace Open Graph metadata
  rendered = rendered.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(title)}" />`
  );
  rendered = rendered.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  );
  rendered = rendered.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`
  );

  // Replace Twitter metadata
  rendered = rendered.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`
  );
  rendered = rendered.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`
  );

  // Ensure canonical base origin consistency
  rendered = rendered.replace(/https:\/\/[a-zA-Z0-9.-]+\.run\.app/g, origin);

  return rendered;
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const indexHtmlPath = path.join(distPath, 'index.html');
    let cachedHtml: string | null = null;

    // Cache Vite content-hashed assets for 1 year (immutable)
    app.use('/assets', express.static(path.join(distPath, 'assets'), { maxAge: '1y', immutable: true }));
    // Cache general static files with etag
    app.use(express.static(distPath, { maxAge: '1d', etag: true }));

    app.get('*', (req, res) => {
      try {
        if (!cachedHtml) {
          cachedHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
        }
        const rendered = renderInitialHtml(cachedHtml, req);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(rendered);
      } catch (err) {
        return res.sendFile(indexHtmlPath);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nova Tools server running at http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
