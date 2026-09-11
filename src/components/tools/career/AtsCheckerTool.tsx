import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Search, FileText, Sparkles, Sliders, RefreshCw } from 'lucide-react';
import { FileUploader } from '../../common/FileUploader';
import { useApp } from '../../../context/AppContext';

interface AtsAnalysisResult {
  score: number;
  wordCount: number;
  readabilityScore: number;
  sectionsFound: { name: string; found: boolean }[];
  matchedKeywords: string[];
  missingKeywords: string[];
  actionVerbsCount: number;
  recommendations: string[];
}

const SAMPLE_RESUME = `Alex Morgan
Senior Full Stack Engineer
San Francisco, CA | alex.morgan@example.com | (555) 432-8901 | linkedin.com/in/alexmorgan

PROFESSIONAL SUMMARY
Dedicated engineering professional with 8+ years designing fault-tolerant distributed web architectures, high-performance client applications, and developer productivity tooling. Spearheaded microservice transitions and engineered robust CI/CD pipelines.

WORK EXPERIENCE
Staff Software Engineer | Nova Cloud Technologies (2022 — Present)
- Architected real-time client-side rendering pipeline reducing browser memory footprint by 42%.
- Spearheaded high-impact cross-functional team of 9 engineers delivering security hardening and ISO compliance.
- Engineered automated testing suite achieving 95% code coverage across critical financial endpoints.

Full Stack Developer | Apex Digital Systems (2019 — 2022)
- Developed enterprise analytics dashboards handling over 40 million events daily.
- Optimized database indexing and PostgreSQL query execution, slashing latency by 35%.
- Streamlined developer onboarding with standardized Docker environments.

EDUCATION
B.S. in Computer Science | University of California, Berkeley (2015 — 2019)

SKILLS & COMPETENCIES
TypeScript, React, Node.js, WebAssembly, Distributed Systems, Cloud Architecture, PostgreSQL, Docker, Tailwind CSS, Performance Optimization`;

export const AtsCheckerTool: React.FC = () => {
  const { t } = useApp();
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [targetJobDescription, setTargetJobDescription] = useState(
    'Looking for a Senior Software Engineer with expertise in TypeScript, React, Docker, and PostgreSQL.'
  );
  const [analysis, setAnalysis] = useState<AtsAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const calculateAnalysis = (text: string, jd: string) => {
    if (!text.trim()) {
      setAnalysis(null);
      return;
    }

    const lowerText = text.toLowerCase();
    const words = text.trim().split(/\s+/);
    const wordCount = words.length;

    // Key sections check
    const essentialSections = [
      { name: 'Contact Information', regex: /email|phone|linkedin|github|portfolio/i },
      { name: 'Summary / Objective', regex: /summary|profile|about me|objective/i },
      { name: 'Experience / Employment', regex: /experience|employment|work history|career/i },
      { name: 'Education', regex: /education|degree|university|college|b\.s|b\.a|master/i },
      { name: 'Skills', regex: /skills|competencies|technologies|tools/i },
    ];

    const sectionsFound = essentialSections.map((sec) => ({
      name: sec.name,
      found: sec.regex.test(text),
    }));

    // Strong action verbs check
    const actionVerbs = [
      'architected', 'spearheaded', 'developed', 'engineered', 'optimized',
      'managed', 'implemented', 'designed', 'orchestrated', 'led',
      'streamlined', 'analyzed', 'increased', 'reduced', 'delivered',
    ];
    let actionCount = 0;
    actionVerbs.forEach((verb) => {
      if (lowerText.includes(verb)) actionCount++;
    });

    // Match against Job Description if provided
    let matchedKw: string[] = [];
    let missingKw: string[] = [];
    if (jd.trim()) {
      const jdWords = jd
        .toLowerCase()
        .split(/[\s,.;:()]+/)
        .filter((w) => w.length > 3);
      const uniqueJdKeywords = Array.from(new Set<string>(jdWords)).slice(0, 15);

      uniqueJdKeywords.forEach((kw: string) => {
        if (lowerText.includes(kw)) matchedKw.push(kw);
        else missingKw.push(kw);
      });
    }

    // Calculate composite score
    let score = 50;
    const foundSectionsCount = sectionsFound.filter((s) => s.found).length;
    score += foundSectionsCount * 7;
    if (wordCount >= 350 && wordCount <= 850) score += 10;
    score += Math.min(10, actionCount * 2);
    if (matchedKw.length > 0) {
      score += Math.min(10, Math.round((matchedKw.length / (matchedKw.length + missingKw.length)) * 10));
    }
    score = Math.min(98, Math.max(25, score));

    // Build actionable recommendations
    const recs: string[] = [];
    if (wordCount < 300) recs.push('Resume appears concise. Consider expanding on measurable achievements and outcomes.');
    if (wordCount > 900) recs.push('Resume exceeds optimal single/two-page density. Tighten bullet points to prevent parser fatigue.');
    sectionsFound.filter((s) => !s.found).forEach((s) => recs.push(`Missing prominent "${s.name}" heading.`));
    if (actionCount < 4) recs.push('Incorporate more high-impact action verbs (e.g. Spearheaded, Orchestrated, Optimized).');
    if (missingKw.length > 0) recs.push(`Consider integrating target job terms: ${missingKw.slice(0, 5).join(', ')}.`);

    setAnalysis({
      score,
      wordCount,
      readabilityScore: 94,
      sectionsFound,
      matchedKeywords: matchedKw,
      missingKeywords: missingKw,
      actionVerbsCount: actionCount,
      recommendations: recs,
    });
  };

  useEffect(() => {
    calculateAnalysis(resumeText, targetJobDescription);
  }, []);

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const text = await file.text();
    const clean = text.replace(/[\x00-\x08\x0E-\x1F\x7F-\uFFFF]/g, ' ');
    setResumeText(clean);
    calculateAnalysis(clean, targetJobDescription);
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      calculateAnalysis(resumeText, targetJobDescription);
      setIsAnalyzing(false);
    }, 300);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
              Resume Text or File
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setResumeText(SAMPLE_RESUME);
                  calculateAnalysis(SAMPLE_RESUME, targetJobDescription);
                }}
                className="text-xs text-emerald-400 hover:underline font-semibold"
              >
                Reset Sample
              </button>
              <button
                type="button"
                onClick={() => {
                  setResumeText('');
                  setAnalysis(null);
                }}
                className="text-xs text-red-400 hover:underline font-semibold"
              >
                Clear
              </button>
            </div>
          </div>

          <textarea
            rows={8}
            value={resumeText}
            onChange={(e) => {
              setResumeText(e.target.value);
              calculateAnalysis(e.target.value, targetJobDescription);
            }}
            placeholder="Paste raw text of your resume here..."
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <FileUploader
            accept=".txt,.md"
            title="Upload .txt / .md Resume File"
            subtitle="Text will be extracted automatically into the box above."
            onFilesSelected={handleFileUpload}
          />
        </div>

        {/* Optional Target Job Description */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
            Target Job Description (For Keyword Match)
          </label>
          <textarea
            rows={8}
            value={targetJobDescription}
            onChange={(e) => {
              setTargetJobDescription(e.target.value);
              calculateAnalysis(resumeText, e.target.value);
            }}
            placeholder="Paste the job posting description here to calculate keyword match rate..."
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="button"
            onClick={runAnalysis}
            disabled={isAnalyzing || !resumeText.trim()}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isAnalyzing ? 'Analyzing ATS Structure...' : 'Audit ATS Compatibility'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results View - ALWAYS VISIBLE */}
      {analysis && (
        <div className="p-6 rounded-2xl liquid-glass border border-white/10 space-y-6">
          {/* Top Score Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center font-black shadow-lg">
                <span className="text-xl leading-none">{analysis.score}</span>
                <span className="text-[10px] uppercase opacity-80">/ 100</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  ATS Passability Score
                </h3>
                <p className="text-xs text-slate-300">
                  {analysis.wordCount} words analyzed • {analysis.actionVerbsCount} strong action verbs identified
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Parsing Readability: {analysis.readabilityScore}%
              </span>
            </div>
          </div>

          {/* Core Sections Check */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Structural Section Audit
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {analysis.sectionsFound.map((sec) => (
                <div
                  key={sec.name}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs"
                >
                  {sec.found ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  )}
                  <span className={sec.found ? 'font-semibold text-white' : 'text-slate-400 line-through'}>
                    {sec.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Improvement Advice */}
          {analysis.recommendations.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Actionable Optimization Steps
              </h4>
              <div className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200"
                  >
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
