import React, { useState, useRef } from 'react';
import { Download, Printer, Plus, Trash2, Sparkles, FileUser, Eye, Camera, Image, Wand2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

interface ResumeData {
  fullName: string;
  profession: string;
  jobTitle: string;
  photoUrl: string | null;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  experiences: {
    id: string;
    role: string;
    company: string;
    duration: string;
    bullets: string;
  }[];
  education: {
    id: string;
    degree: string;
    school: string;
    year: string;
  }[];
  skills: string;
}

const PROFESSION_BIOS: Record<string, { title: string; bio: string; skills: string }> = {
  software_engineer: {
    title: 'Senior Software Engineer',
    bio: 'Results-driven Software Engineer with proven expertise in architecting scalable web systems, microservices, and modern user interfaces. Passionate about clean code, high performance, and continuous integration.',
    skills: 'TypeScript, React, Node.js, Python, Docker, PostgreSQL, AWS, Git, REST & GraphQL APIs, System Design',
  },
  web_developer: {
    title: 'Full Stack Web Developer',
    bio: 'Detail-oriented Web Developer specialized in building responsive, accessible, and fast web applications. Experienced in transforming Figma wireframes into seamless interactive web experiences.',
    skills: 'HTML5, CSS3, Tailwind CSS, JavaScript, React, Next.js, REST APIs, UI/UX Prototyping, Git',
  },
  graphic_designer: {
    title: 'Creative Graphic & Brand Designer',
    bio: 'Innovative Graphic Designer with an eye for visual storytelling, typography, and brand identity. Track record of creating compelling digital and print media that elevate brand presence and engagement.',
    skills: 'Adobe Photoshop, Illustrator, InDesign, Figma, Brand Identity, Typography, Color Theory, Motion Graphics',
  },
  digital_marketer: {
    title: 'Digital Marketing & Growth Specialist',
    bio: 'Data-informed Digital Marketer with proven success managing multi-channel campaigns across Google Ads, Meta Ads, and organic SEO. Dedicated to optimizing conversion funnels and ROAS.',
    skills: 'SEO, SEM, Google Analytics 4, Meta Ads, Content Strategy, Email Marketing, Funnel Optimization, A/B Testing',
  },
  project_manager: {
    title: 'Agile Project Manager',
    bio: 'PMP-certified Agile Project Manager experienced in directing cross-functional teams to deliver complex technical projects on schedule and within budget. Adept at sprint planning and stakeholder communication.',
    skills: 'Agile & Scrum, JIRA, Asana, Risk Management, Budgeting, Sprint Planning, Stakeholder Communication, KPI Tracking',
  },
  data_analyst: {
    title: 'Data & Business Intelligence Analyst',
    bio: 'Analytical problem solver skilled in mining large datasets, creating interactive BI dashboards, and uncovering actionable commercial insights that drive strategic business decisions.',
    skills: 'SQL, Python, Power BI, Tableau, Excel Modeling, Statistical Analysis, Data Visualization, ETL Pipelines',
  },
  accountant: {
    title: 'Financial Accountant & Auditor',
    bio: 'Certified Accountant with comprehensive experience in financial reporting, corporate tax compliance, budget forecasting, and general ledger reconciliation. Committed to audit readiness and precision.',
    skills: 'Financial Reporting, GAAP / IFRS, QuickBooks, General Ledger, Tax Planning, Internal Auditing, Variance Analysis',
  },
  healthcare: {
    title: 'Healthcare & Clinical Professional',
    bio: 'Compassionate healthcare professional committed to delivering patient-centered clinical care, upholding stringent safety protocols, and collaborating across multidisciplinary medical teams.',
    skills: 'Patient Assessment, Electronic Health Records (EHR), Clinical Documentation, CPR / BLS, Infection Control',
  },
  fresher: {
    title: 'Entry-Level Professional / Graduate',
    bio: 'Motivated and ambitious graduate with strong foundational knowledge, excellent problem-solving skills, and a fast-learning mindset. Eager to contribute energy and fresh perspectives to a dynamic team.',
    skills: 'Critical Thinking, Communication, Microsoft Office, Research & Analysis, Team Collaboration, Adaptability',
  },
};

const initialResume: ResumeData = {
  fullName: 'Alex Morgan',
  profession: 'software_engineer',
  jobTitle: 'Senior Software Engineer & Architect',
  photoUrl: null,
  email: 'alex.morgan@example.com',
  phone: '+1 (555) 432-8901',
  location: 'San Francisco, CA',
  website: 'https://alexmorgan.dev',
  summary:
    'Dedicated engineering professional with 8+ years designing fault-tolerant distributed web architectures, high-performance client applications, and developer productivity tooling.',
  experiences: [
    {
      id: 'exp-1',
      role: 'Staff Engineer',
      company: 'Nova Cloud Technologies',
      duration: '2022 — Present',
      bullets:
        'Architected real-time client-side rendering pipeline reducing browser memory footprint by 42%.\nLed high-impact cross-functional team of 9 engineers delivering security hardening and ISO compliance.',
    },
    {
      id: 'exp-2',
      role: 'Full Stack Engineer',
      company: 'Apex Digital Systems',
      duration: '2019 — 2022',
      bullets:
        'Built enterprise analytics dashboards handling over 40 million events daily.\nMentored junior developers and established CI/CD automated validation best practices.',
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science',
      school: 'University of California, Berkeley',
      year: '2015 — 2019',
    },
  ],
  skills:
    'TypeScript, React, Node.js, WebAssembly, Distributed Systems, Cloud Architecture, PostgreSQL, Docker, Tailwind CSS, Performance Optimization',
};

export const ResumeMakerTool: React.FC = () => {
  const { t } = useApp();
  const [data, setData] = useState<ResumeData>(initialResume);
  const [template, setTemplate] = useState<'modern' | 'minimal' | 'compact'>('modern');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setData((prev) => ({ ...prev, photoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setData((prev) => ({ ...prev, photoUrl: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleProfessionChange = (profKey: string) => {
    setData((prev) => {
      const preset = PROFESSION_BIOS[profKey];
      if (preset) {
        return {
          ...prev,
          profession: profKey,
          jobTitle: preset.title,
          summary: preset.bio,
          skills: preset.skills,
        };
      }
      return { ...prev, profession: profKey };
    });
  };

  const handleRegenerateBio = () => {
    const preset = PROFESSION_BIOS[data.profession];
    if (preset) {
      setData((prev) => ({
        ...prev,
        summary: preset.bio,
        skills: preset.skills,
      }));
    }
  };

  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: `exp-${Date.now()}`,
          role: 'Job Role',
          company: 'Company Name',
          duration: 'Year — Year',
          bullets: 'Key contribution or achievement.',
        },
      ],
    }));
  };

  const removeExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Template selector & Action toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Design Template:
          </span>
          {(['modern', 'minimal', 'compact'] as const).map((tmpl) => (
            <button
              key={tmpl}
              type="button"
              onClick={() => setTemplate(tmpl)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                template === tmpl
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              {tmpl}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg active:scale-95 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs (Left Column) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Profile Photo Upload Section */}
          <div className="p-5 rounded-2xl liquid-glass border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Candidate Profile Photo</span>
            </h3>

            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                {data.photoUrl ? (
                  <img
                    src={data.photoUrl}
                    alt="Resume Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileUser className="w-8 h-8 text-slate-400" />
                )}
              </div>

              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="resume-photo-input"
                />
                <label
                  htmlFor="resume-photo-input"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer transition-colors shadow-sm"
                >
                  <Image className="w-3.5 h-3.5" />
                  <span>{data.photoUrl ? 'Change Photo' : 'Upload Profile Photo'}</span>
                </label>

                {data.photoUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="block text-[11px] text-red-400 hover:underline font-medium"
                  >
                    Remove Photo
                  </button>
                )}
                <p className="text-[11px] text-slate-400">
                  Headshots appear cleanly in the resume header beside your contact details.
                </p>
              </div>
            </div>
          </div>

          {/* Profession Selection & AI Bio Assistant */}
          <div className="p-5 rounded-2xl liquid-glass border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-emerald-400" />
                <span>Profession & Bio Generator</span>
              </h3>
              <button
                type="button"
                onClick={handleRegenerateBio}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                title="Generate bio and skills tailored to this profession"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Generate Bio</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Your Profession / Career Field
              </label>
              <select
                value={data.profession}
                onChange={(e) => handleProfessionChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="software_engineer" className="bg-slate-900">Software Engineer / Architect</option>
                <option value="web_developer" className="bg-slate-900">Full Stack Web Developer</option>
                <option value="graphic_designer" className="bg-slate-900">Graphic & Brand Designer</option>
                <option value="digital_marketer" className="bg-slate-900">Digital Marketing & SEO Specialist</option>
                <option value="project_manager" className="bg-slate-900">Agile Project Manager / Scrum Master</option>
                <option value="data_analyst" className="bg-slate-900">Data & BI Analyst</option>
                <option value="accountant" className="bg-slate-900">Financial Accountant / Auditor</option>
                <option value="healthcare" className="bg-slate-900">Healthcare / Clinical Professional</option>
                <option value="fresher" className="bg-slate-900">Entry-Level / Fresh Graduate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Professional Summary / Bio
              </label>
              <textarea
                rows={3}
                value={data.summary}
                onChange={(e) => setData({ ...data, summary: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-5 rounded-2xl liquid-glass border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileUser className="w-4 h-4 text-emerald-400" />
              <span>Contact Information</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={data.fullName}
                  onChange={(e) => setData({ ...data, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Target Job Title</label>
                <input
                  type="text"
                  value={data.jobTitle}
                  onChange={(e) => setData({ ...data, jobTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Phone</label>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={data.location}
                  onChange={(e) => setData({ ...data, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Website / Portfolio</label>
                <input
                  type="text"
                  value={data.website}
                  onChange={(e) => setData({ ...data, website: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div className="p-5 rounded-2xl liquid-glass border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Work Experience</h3>
              <button
                type="button"
                onClick={addExperience}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Role</span>
              </button>
            </div>

            <div className="space-y-4">
              {data.experiences.map((exp, idx) => (
                <div key={exp.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">Position #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeExperience(exp.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Role (e.g. Lead Engineer)"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...data.experiences];
                        updated[idx].role = e.target.value;
                        setData({ ...data, experiences: updated });
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...data.experiences];
                        updated[idx].company = e.target.value;
                        setData({ ...data, experiences: updated });
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Duration (e.g. 2021 — Present)"
                    value={exp.duration}
                    onChange={(e) => {
                      const updated = [...data.experiences];
                      updated[idx].duration = e.target.value;
                      setData({ ...data, experiences: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                  />

                  <textarea
                    rows={2}
                    placeholder="Achievements / Contributions (one per line)"
                    value={exp.bullets}
                    onChange={(e) => {
                      const updated = [...data.experiences];
                      updated[idx].bullets = e.target.value;
                      setData({ ...data, experiences: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="p-5 rounded-2xl liquid-glass border border-white/10 space-y-2">
            <h3 className="text-sm font-bold text-white">Skills & Competencies</h3>
            <textarea
              rows={3}
              value={data.skills}
              onChange={(e) => setData({ ...data, skills: e.target.value })}
              placeholder="Comma separated skills..."
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
            />
          </div>
        </div>

        {/* Live Resume Sheet Preview (Right Column) - ALWAYS VISIBLE */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Printable Document Preview
            </span>
            <span className="text-[11px] text-slate-400">Letter / A4 Proportion</span>
          </div>

          <div
            ref={printRef}
            className={`w-full bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-10 border border-slate-200 min-h-[700px] text-xs leading-relaxed print:m-0 print:p-0 print:shadow-none print:border-none ${
              template === 'compact' ? 'space-y-3' : 'space-y-5'
            }`}
          >
            {/* Resume Header with Optional Photo */}
            <div className={`border-b pb-4 flex items-center justify-between gap-4 ${template === 'modern' ? 'border-emerald-600' : 'border-slate-300'}`}>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                  {data.fullName}
                </h1>
                <p className="text-sm font-bold text-emerald-700 mt-0.5">
                  {data.jobTitle}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-2">
                  {data.email && <span>{data.email}</span>}
                  {data.phone && <span>{data.phone}</span>}
                  {data.location && <span>{data.location}</span>}
                  {data.website && <span>{data.website}</span>}
                </div>
              </div>

              {data.photoUrl && (
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-600 shadow-sm flex-shrink-0">
                  <img
                    src={data.photoUrl}
                    alt={data.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Summary */}
            {data.summary && (
              <div className="space-y-1">
                <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                  Professional Summary
                </h2>
                <p className="text-slate-700 text-justify">{data.summary}</p>
              </div>
            )}

            {/* Experience */}
            {data.experiences.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                  Experience
                </h2>
                <div className="space-y-3">
                  {data.experiences.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline font-bold text-slate-900">
                        <span>{exp.role} — <span className="font-semibold text-slate-700">{exp.company}</span></span>
                        <span className="text-[10px] text-slate-500 font-normal">{exp.duration}</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                        {exp.bullets.split('\n').filter(Boolean).map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                  Education
                </h2>
                {data.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline text-slate-800">
                    <span className="font-bold">{edu.degree} — <span className="font-normal text-slate-600">{edu.school}</span></span>
                    <span className="text-[10px] text-slate-500">{edu.year}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {data.skills && (
              <div className="space-y-1">
                <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                  Core Skills & Technologies
                </h2>
                <p className="text-slate-700 text-[11px]">{data.skills}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
