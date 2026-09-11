import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { generateSitemapXml, generateRobotsTxt } from './src/lib/sitemapGenerator';

dotenv.config();

const app = express();
const PORT = 3000;

const SITE_ORIGIN = (
  process.env.SITE_ORIGIN || 'https://nova-tools-hr.vercel.app'
).replace(/\/+$/, '');

const MAX_REQUEST_BODY = '15mb';
const MAX_BACKGROUND_BYTES = 8 * 1024 * 1024;

app.disable('x-powered-by');

app.use(
  express.json({
    limit: MAX_REQUEST_BODY,
  })
);

app.use(
  express.urlencoded({
    limit: MAX_REQUEST_BODY,
    extended: true,
  })
);

// -----------------------------------------------------------------------------
// Simple in-memory rate limiter.
// This is intentionally lightweight and dependency-free.
// On serverless platforms, limits are per warm instance, so this is a
// protection layer, not a replacement for an external rate-limit service.
// -----------------------------------------------------------------------------

interface RateLimitBucket {
  timestamps: number[];
}

const rateLimitBuckets = new Map<string, RateLimitBucket>();

function getClientIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];

  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }

  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0];
  }

  return req.socket.remoteAddress || 'unknown';
}

function isRateLimited(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();

  const bucket = rateLimitBuckets.get(key) || {
    timestamps: [],
  };

  bucket.timestamps = bucket.timestamps.filter(
    (timestamp) => now - timestamp < windowMs
  );

  if (bucket.timestamps.length >= limit) {
    rateLimitBuckets.set(key, bucket);
    return true;
  }

  bucket.timestamps.push(now);
  rateLimitBuckets.set(key, bucket);

  return false;
}

// Periodically remove stale limiter entries.
setInterval(() => {
  const now = Date.now();
  const maxAge = 30 * 60 * 1000;

  for (const [key, bucket] of rateLimitBuckets.entries()) {
    const active = bucket.timestamps.filter(
      (timestamp) => now - timestamp < maxAge
    );

    if (active.length === 0) {
      rateLimitBuckets.delete(key);
    } else {
      bucket.timestamps = active;
    }
  }
}, 10 * 60 * 1000).unref();

// -----------------------------------------------------------------------------
// Gemini
// -----------------------------------------------------------------------------

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
    });
  }

  return aiClient;
}

// -----------------------------------------------------------------------------
// Health
// -----------------------------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGemini: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// -----------------------------------------------------------------------------
// Default background
// -----------------------------------------------------------------------------

app.get('/api/default-background', (req, res) => {
  const bgPath = path.join(
    process.cwd(),
    'public',
    'assets',
    'background.jpg'
  );

  const exists = fs.existsSync(bgPath);

  let updatedAt = 0;

  if (exists) {
    try {
      const stat = fs.statSync(bgPath);
      updatedAt = stat.mtimeMs;
    } catch {
      updatedAt = 0;
    }
  }

  res.json({
    hasDefaultBg: exists,
    url: exists
      ? `/assets/background.jpg?v=${Math.floor(updatedAt)}`
      : null,
    updatedAt,
  });
});

// Set uploaded photo as permanent site default background.
//
// Security:
// This endpoint requires BACKGROUND_ADMIN_TOKEN.
// The token must be supplied through the x-background-admin-token header.
//
// This prevents an unauthenticated visitor from writing arbitrary files
// into the server filesystem.
app.post('/api/set-default-background', (req, res) => {
  try {
    const configuredToken = process.env.BACKGROUND_ADMIN_TOKEN;

    if (!configuredToken) {
      return res.status(503).json({
        error:
          'Background administration is not enabled on this deployment.',
      });
    }

    const providedToken = req.get('x-background-admin-token');

    if (
      !providedToken ||
      providedToken.length !== configuredToken.length ||
      providedToken !== configuredToken
    ) {
      return res.status(403).json({
        error: 'Not authorized.',
      });
    }

    const clientIp = getClientIp(req);

    if (
      isRateLimited(
        `background:${clientIp}`,
        3,
        15 * 60 * 1000
      )
    ) {
      return res.status(429).json({
        error:
          'Too many background update attempts. Please try again later.',
      });
    }

    const { image } = req.body;

    if (!image || typeof image !== 'string') {
      return res.status(400).json({
        error: 'Image data is required.',
      });
    }

    const matches = image.match(
      /^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/
    );

    let base64Payload = image;

    if (matches && matches[2]) {
      base64Payload = matches[2];
    }

    if (!base64Payload || base64Payload.length > 12 * 1024 * 1024) {
      return res.status(400).json({
        error: 'Image is missing or too large.',
      });
    }

    const buffer = Buffer.from(base64Payload, 'base64');

    if (
      buffer.length === 0 ||
      buffer.length > MAX_BACKGROUND_BYTES
    ) {
      return res.status(400).json({
        error: 'Invalid or oversized image.',
      });
    }

    const publicAssetsDir = path.join(
      process.cwd(),
      'public',
      'assets'
    );

    if (!fs.existsSync(publicAssetsDir)) {
      fs.mkdirSync(publicAssetsDir, {
        recursive: true,
      });
    }

    const targetFile = path.join(
      publicAssetsDir,
      'background.jpg'
    );

    fs.writeFileSync(targetFile, buffer);

    const distAssetsDir = path.join(
      process.cwd(),
      'dist',
      'assets'
    );

    if (fs.existsSync(distAssetsDir)) {
      try {
        fs.writeFileSync(
          path.join(distAssetsDir, 'background.jpg'),
          buffer
        );
      } catch (err) {
        console.warn(
          'Could not write to dist/assets:',
          err
        );
      }
    }

    console.log(
      `[BACKGROUND SET] Saved default background: ${buffer.length} bytes`
    );

    return res.json({
      success: true,
      message:
        'Background successfully set as the site default.',
      url: `/assets/background.jpg?v=${Date.now()}`,
      bytes: buffer.length,
    });
  } catch (err) {
    console.error(
      'Error in /api/set-default-background:',
      err
    );

    return res.status(500).json({
      error: 'Failed to save background image.',
    });
  }
});

// -----------------------------------------------------------------------------
// ads.txt
// -----------------------------------------------------------------------------

app.get('/ads.txt', (req, res) => {
  res
    .type('text/plain')
    .send(
      'google.com, pub-5216241068377334, DIRECT, f08c47fec0942fa0\n'
    );
});

// -----------------------------------------------------------------------------
// robots.txt
// -----------------------------------------------------------------------------

app.get('/robots.txt', (req, res) => {
  res.setHeader(
    'Cache-Control',
    'public, max-age=86400'
  );

  res
    .type('text/plain; charset=utf-8')
    .send(generateRobotsTxt(SITE_ORIGIN));
});

// -----------------------------------------------------------------------------
// sitemap.xml
// -----------------------------------------------------------------------------

app.get('/sitemap.xml', (req, res) => {
  res.setHeader(
    'Cache-Control',
    'public, max-age=3600'
  );

  res
    .type('application/xml; charset=utf-8')
    .send(generateSitemapXml(SITE_ORIGIN));
});

// -----------------------------------------------------------------------------
// Google Search Console HTML verification
// -----------------------------------------------------------------------------

app.get('/google:code.html', (req, res) => {
  const code = req.params.code;

  if (
    !code ||
    typeof code !== 'string' ||
    !/^[a-zA-Z0-9_-]+$/.test(code)
  ) {
    return res.status(404).send('Not Found');
  }

  res
    .type('text/html')
    .send(`google-site-verification: google${code}.html`);
});

// -----------------------------------------------------------------------------
// Contact form
// -----------------------------------------------------------------------------

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

app.post('/api/contact', async (req, res) => {
  try {
    const clientIp = getClientIp(req);
    const now = Date.now();

    const windowMs = 15 * 60 * 1000;

    const timestamps = (
      contactRateLimits.get(clientIp) || []
    ).filter((timestamp) => now - timestamp < windowMs);

    if (timestamps.length >= 5) {
      return res.status(429).json({
        error:
          'Too many submissions. Please wait 15 minutes before sending another message.',
      });
    }

    timestamps.push(now);
    contactRateLimits.set(clientIp, timestamps);

    const {
      name,
      email,
      category,
      subject,
      message,
      hp_website,
      formStartTime,
    } = req.body;

    if (
      hp_website &&
      typeof hp_website === 'string' &&
      hp_website.trim().length > 0
    ) {
      console.warn(
        `[SPAM BLOCKED] Honeypot triggered from IP: ${clientIp}`
      );

      return res.status(400).json({
        error: 'Automated submission detected.',
      });
    }

    if (
      typeof formStartTime === 'number' &&
      Number.isFinite(formStartTime)
    ) {
      const duration = now - formStartTime;

      if (duration < 1500) {
        console.warn(
          `[SPAM BLOCKED] Fast contact submission from IP: ${clientIp}`
        );

        return res.status(400).json({
          error:
            'Submission was too fast. Please take your time.',
        });
      }
    }

    if (
      !name ||
      typeof name !== 'string' ||
      name.trim().length < 2 ||
      name.trim().length > 100
    ) {
      return res.status(400).json({
        error:
          'Please provide a valid name (2 to 100 characters).',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !email ||
      typeof email !== 'string' ||
      email.trim().length > 150 ||
      !emailRegex.test(email.trim())
    ) {
      return res.status(400).json({
        error:
          'Please provide a valid, deliverable email address.',
      });
    }

    if (
      !message ||
      typeof message !== 'string' ||
      message.trim().length < 10 ||
      message.trim().length > 3000
    ) {
      return res.status(400).json({
        error:
          'Message must be between 10 and 3,000 characters.',
      });
    }

    const safeCategory =
      typeof category === 'string' &&
      category.trim().length > 0
        ? category.trim().slice(0, 50)
        : 'General Inquiry';

    const safeSubject =
      typeof subject === 'string' &&
      subject.trim().length > 0
        ? subject.trim().slice(0, 150)
        : `${safeCategory} from ${name.trim()}`;

    const randomHex = Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase();

    const timeCode = Date.now()
      .toString(36)
      .slice(-4)
      .toUpperCase();

    const ticketId = `NT-${randomHex}-${timeCode}`;

    const ipParts = clientIp.split('.');

    const ipMasked =
      ipParts.length === 4
        ? `${ipParts[0]}.${ipParts[1]}.xxx.xxx`
        : 'masked-ipv6';

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

    console.log(
      `[CONTACT RECEIVED] Ticket: ${ticketId} | Category: ${safeCategory}`
    );

    return res.status(200).json({
      success: true,
      status: 'delivered',
      ticketId,
      receivedAt: recordedMessage.timestamp,
      message: `Thank you, ${name.trim()}! Your message has been received under Ticket ${ticketId}. Our engineering team typically responds within 24-48 business hours.`,
    });
  } catch (err) {
    console.error(
      'Error in /api/contact:',
      err
    );

    return res.status(500).json({
      error:
        'An internal error occurred while processing your message. Please try again later.',
    });
  }
});

// -----------------------------------------------------------------------------
// AI helpers
// -----------------------------------------------------------------------------

function cleanText(
  value: unknown,
  maxLength: number
): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, maxLength);
}

function aiRateLimited(req: express.Request): boolean {
  const clientIp = getClientIp(req);

  return isRateLimited(
    `ai:${clientIp}`,
    20,
    15 * 60 * 1000
  );
}

// -----------------------------------------------------------------------------
// AI Career: Bullet Point Improver
// -----------------------------------------------------------------------------

app.post('/api/ai/bullet-improve', async (req, res) => {
  try {
    if (aiRateLimited(req)) {
      return res.status(429).json({
        error:
          'Too many AI requests. Please try again later.',
      });
    }

    const bullet = cleanText(req.body?.bullet, 3000);
    const role = cleanText(req.body?.role, 150);
    const targetIndustry = cleanText(
      req.body?.targetIndustry,
      150
    );

    if (!bullet) {
      return res.status(400).json({
        error: 'Bullet text is required.',
      });
    }

    const ai = getGeminiClient();

    if (!ai) {
      const actionVerbs = [
        'Spearheaded',
        'Orchestrated',
        'Architected',
        'Streamlined',
        'Accelerated',
        'Delivered',
      ];

      const verb =
        actionVerbs[
          Math.floor(
            Math.random() * actionVerbs.length
          )
        ];

      const cleaned = bullet
        .replace(
          /^(I |We |Responsible for |Helped with )/i,
          ''
        )
        .trim();

      const lowerCleaned =
        cleaned.charAt(0).toLowerCase() +
        cleaned.slice(1);

      const enhanced = `${verb} ${lowerCleaned}, improving workflow efficiency and operational output.`;

      return res.json({
        enhancedBullets: [
          enhanced,
          `Implemented key strategies to ${lowerCleaned}, driving measurable team impact.`,
          `Led initiative to ${lowerCleaned}, ensuring high-standard delivery.`,
        ],
        source: 'local-engine',
      });
    }

    const prompt = `You are an elite career strategist and ATS optimization expert. Improve the following resume bullet point for a ${role || 'professional'} in ${targetIndustry || 'their industry'}. Provide 3 stronger, quantified, action-verb-led versions that sound natural and high-impact. Do NOT invent crazy metrics, keep them realistic and adaptable.

Input bullet: "${bullet}"

Respond in JSON format:
{"enhancedBullets":["bullet 1","bullet 2","bullet 3"]}`;

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
      enhancedBullets:
        Array.isArray(parsed.enhancedBullets) &&
        parsed.enhancedBullets.length > 0
          ? parsed.enhancedBullets
          : [bullet],
      source: 'gemini-ai',
    });
  } catch (err) {
    console.error(
      'Error in /api/ai/bullet-improve:',
      err
    );

    return res.status(500).json({
      error:
        'Failed to enhance bullet point. Please try again.',
    });
  }
});

// -----------------------------------------------------------------------------
// AI Career: Cover Letter Generator
// -----------------------------------------------------------------------------

app.post('/api/ai/cover-letter', async (req, res) => {
  try {
    if (aiRateLimited(req)) {
      return res.status(429).json({
        error:
          'Too many AI requests. Please try again later.',
      });
    }

    const jobTitle = cleanText(
      req.body?.jobTitle,
      200
    );

    const company = cleanText(
      req.body?.company,
      200
    );

    const jobDescription = cleanText(
      req.body?.jobDescription,
      6000
    );

    const userExperience = cleanText(
      req.body?.userExperience,
      5000
    );

    const skills = cleanText(
      req.body?.skills,
      2500
    );

    const achievements = cleanText(
      req.body?.achievements,
      4000
    );

    const fullName = cleanText(
      req.body?.fullName,
      150
    );

    if (!jobTitle || !company) {
      return res.status(400).json({
        error:
          'Job title and Company are required.',
      });
    }

    const ai = getGeminiClient();

    if (!ai) {
      const dateStr =
        new Date().toLocaleDateString(
          'en-US',
          {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }
        );

      const draft = `${fullName || 'Applicant'}
${dateStr}

Hiring Team
${company}

Dear Hiring Team,

I am writing to express my enthusiastic interest in the ${jobTitle} position at ${company}. With my background in ${skills || 'relevant domain skills'} and proven experience delivering results, I am confident in my ability to make an immediate, meaningful impact on your team.

Throughout my career, I have dedicated myself to high-quality execution: ${userExperience || 'bringing dedicated problem-solving and rigorous collaboration to every project'}. In particular, ${achievements || 'I pride myself on driving efficiency and exceeding project milestones'}.

What excites me most about ${company} is your commitment to excellence and innovation. My technical and collaborative foundation in ${skills || 'this domain'} aligns closely with the goals of this position.

I welcome the opportunity to discuss how my skill set and passion can support ${company}'s upcoming initiatives. Thank you for your time and consideration.

Sincerely,
${fullName || 'Applicant'}`;

      return res.json({
        letter: draft,
        source: 'local-engine',
      });
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

    return res.json({
      letter: response.text,
      source: 'gemini-ai',
    });
  } catch (err) {
    console.error(
      'Error in /api/ai/cover-letter:',
      err
    );

    return res.status(500).json({
      error:
        'Failed to generate cover letter. Please try again.',
    });
  }
});

// -----------------------------------------------------------------------------
// AI Career: Resume Analysis
// -----------------------------------------------------------------------------

app.post('/api/ai/analyze-resume', async (req, res) => {
  try {
    if (aiRateLimited(req)) {
      return res.status(429).json({
        error:
          'Too many AI requests. Please try again later.',
      });
    }

    const resumeText = cleanText(
      req.body?.resumeText,
      20000
    );

    const targetJob = cleanText(
      req.body?.targetJob,
      200
    );

    if (!resumeText) {
      return res.status(400).json({
        error: 'Resume text is required.',
      });
    }

    const ai = getGeminiClient();

    if (!ai) {
      const wordCount = resumeText
        .trim()
        .split(/\s+/)
        .length;

      const hasEmail =
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(
          resumeText
        );

      const hasPhone =
        /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(
          resumeText
        );

      const hasExperience =
        /experience|work history|employment/i.test(
          resumeText
        );

      const hasEducation =
        /education|university|college|bachelor|master|degree/i.test(
          resumeText
        );

      const hasSkills =
        /skills|competencies|technologies/i.test(
          resumeText
        );

      const hasSummary =
        /summary|profile|about/i.test(
          resumeText
        );

      let score = 65;

      if (hasEmail) score += 5;
      if (hasPhone) score += 5;
      if (hasExperience) score += 10;
      if (hasEducation) score += 5;
      if (hasSkills) score += 5;

      if (
        wordCount >= 250 &&
        wordCount <= 800
      ) {
        score += 5;
      }

      return res.json({
        score: Math.min(score, 94),
        strengths: [
          hasExperience
            ? 'Clearly identified Work Experience section.'
            : 'Readable text structure.',
          hasSkills
            ? 'Dedicated Skills listing detected for recruiter scanning.'
            : 'Contains foundational details.',
          wordCount > 200
            ? 'Healthy word volume appropriate for single-page ATS review.'
            : 'Concise content.',
        ],
        improvements: [
          !hasSummary
            ? 'Consider adding a 2-3 line Professional Summary at the top.'
            : 'Ensure summary emphasizes your unique value proposition.',
          'Incorporate more quantifiable metrics (percentages, dollar amounts, time saved).',
          'Use strong action verbs (Architected, Spearheaded, Reduced) at the start of each bullet point.',
        ],
        atsReadability:
          'Good. Standard single-column text flow is highly parseable by modern ATS systems.',
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
  "score": number,
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

    const parsed = JSON.parse(
      response.text || '{}'
    );

    return res.json({
      ...parsed,
      source: 'gemini-ai',
    });
  } catch (err) {
    console.error(
      'Error in /api/ai/analyze-resume:',
      err
    );

    return res.status(500).json({
      error:
        'Failed to analyze resume. Please try again.',
    });
  }
});

// -----------------------------------------------------------------------------
// Server
// -----------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(
      process.cwd(),
      'dist'
    );

    app.use(
      '/assets',
      express.static(
        path.join(distPath, 'assets'),
        {
          maxAge: '1y',
          immutable: true,
        }
      )
    );

    app.use(
      express.static(distPath, {
        maxAge: '1d',
        etag: true,
      })
    );

    app.get('*', (req, res) => {
      res.sendFile(
        path.join(distPath, 'index.html')
      );
    });
  }

  app.listen(
    PORT,
    '0.0.0.0',
    () => {
      console.log(
        `Nova Tools server running at http://0.0.0.0:${PORT}`
      );
    }
  );
}

startServer();
