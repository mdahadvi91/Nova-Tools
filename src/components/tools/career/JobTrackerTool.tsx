import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, CheckCircle2, Clock, XCircle, Briefcase, ExternalLink } from 'lucide-react';

interface JobApplication {
  id: string;
  company: string;
  role: string;
  appliedDate: string;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected';
  nextStep: string;
  notes: string;
}

const STORAGE_KEY = 'nova_job_tracker_apps';

export const JobTrackerTool: React.FC = () => {
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'applied' | 'interviewing' | 'offered' | 'rejected'>('applied');
  const [nextStep, setNextStep] = useState('');
  const [notes, setNotes] = useState('');

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setApps(JSON.parse(saved));
      } else {
        // Initial sample
        const samples: JobApplication[] = [
          {
            id: 'app-1',
            company: 'Stripe',
            role: 'Senior Solutions Engineer',
            appliedDate: '2026-03-01',
            status: 'interviewing',
            nextStep: 'Technical round with engineering manager on Thursday',
            notes: 'Reviewed billing architecture and webhook idempotency.',
          },
          {
            id: 'app-2',
            company: 'Figma',
            role: 'Product Infrastructure Lead',
            appliedDate: '2026-02-24',
            status: 'applied',
            nextStep: 'Awaiting initial recruiter screen',
            notes: 'Submitted via employee referral.',
          },
        ];
        setApps(samples);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(samples));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveApps = (newApps: JobApplication[]) => {
    setApps(newApps);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newApps));
  };

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      company,
      role,
      appliedDate,
      status,
      nextStep,
      notes,
    };

    saveApps([newApp, ...apps]);
    setShowModal(false);
    setCompany('');
    setRole('');
    setNextStep('');
    setNotes('');
  };

  const deleteApp = (id: string) => {
    saveApps(apps.filter((a) => a.id !== id));
  };

  const updateStatus = (id: string, newStatus: JobApplication['status']) => {
    saveApps(
      apps.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const statusColors = {
    applied: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
    interviewing: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    offered: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    rejected: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Tracked Applications ({apps.length})
          </h3>
          <p className="text-xs text-slate-500">
            Stored securely inside your local browser storage. Zero remote tracking.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Job Application</span>
        </button>
      </div>

      {/* Grid of Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apps.map((app) => (
          <div
            key={app.id}
            className="p-5 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 space-y-3 relative group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {app.role}
                </h4>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {app.company}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={app.status}
                  onChange={(e) => updateStatus(app.id, e.target.value as any)}
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border outline-none capitalize ${statusColors[app.status]}`}
                >
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Archived</option>
                </select>

                <button
                  type="button"
                  onClick={() => deleteApp(app.id)}
                  className="p-1 text-slate-400 hover:text-red-500"
                  title="Delete application"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
              {app.nextStep && (
                <p>
                  <span className="font-semibold text-slate-500">Next Step:</span> {app.nextStep}
                </p>
              )}
              {app.notes && (
                <p className="text-slate-500 text-[11px] line-clamp-2">
                  <span className="font-semibold">Notes:</span> {app.notes}
                </p>
              )}
            </div>

            <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex justify-between">
              <span>Applied on {app.appliedDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <form
            onSubmit={handleAddApplication}
            className="w-full max-w-md rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-scale-up"
          >
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Track New Job Opportunity
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Company</label>
                <input
                  required
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google or Shopify"
                  className="w-full px-3 py-2 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Target Role</label>
                <input
                  required
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-3 py-2 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Date Applied</label>
                  <input
                    type="date"
                    value={appliedDate}
                    onChange={(e) => setAppliedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Current Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-xs"
                  >
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offered">Offered</option>
                    <option value="rejected">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Next Step / Follow-up</label>
                <input
                  type="text"
                  value={nextStep}
                  onChange={(e) => setNextStep(e.target.value)}
                  placeholder="e.g. Technical interview scheduled"
                  className="w-full px-3 py-2 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Interview questions, salary expectations..."
                  className="w-full px-3 py-2 rounded-xl liquid-glass border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
              >
                Save Application
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
