import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  GraduationCap,
  KeyRound,
  Lock,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import { AIU_COUNTRIES } from '../data/seedData';
import { useElection } from '../services/electionContext';
import { CardPatternBg } from './CardPatternBg';

export const AuthView: React.FC = () => {
  const {
    mode,
    pendingGoogleAccount,
    cancelPendingGoogleAuth,
    c4TributeStudent,
    clearC4Tribute,
    beginGoogleOAuth,
    completeStudentIdLink,
    closeAuthModal,
    setActiveTab,
    switchDemoPersona,
  } = useElection();

  const [demoEmail, setDemoEmail] = useState('abeddin.mosawi@student.aiu.edu.my');
  const [studentIdInput, setStudentIdInput] = useState('');
  const [country, setCountry] = useState('Malaysia');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(
    null
  );

  const handleGoogleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFeedback(null);
    setSubmitting(true);
    try {
      const res = await beginGoogleOAuth(
        mode === 'demo' ? { email: demoEmail } : undefined
      );
      if (!res.ok) {
        setFeedback({ type: 'error', text: res.message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyStudentId = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);
    try {
      const res = await completeStudentIdLink(studentIdInput, country);
      if (!res.ok) {
        setFeedback({ type: 'error', text: res.message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Cohort 4 Graduating Senior Tribute Screen (Honor Crest SVG Background)
  if (c4TributeStudent) {
    return (
      <div className="fixed inset-0 z-50 bg-zinc-950/55 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div className="relative w-full max-w-lg rounded-2xl border border-emerald-200 bg-white p-7 sm:p-8 shadow-2xl overflow-hidden my-6">
          <CardPatternBg variant="honor-crest" />

          <div className="relative z-10 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>Cohort 4 Graduating Class</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  clearC4Tribute();
                  closeAuthModal();
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                aria-label="Close tribute"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight leading-snug">
                  Congratulations, {c4TributeStudent.fullName}
                </h2>
                <div className="text-xs font-mono text-zinc-500 mt-0.5">
                  {c4TributeStudent.studentId} | Cohort 4 Senior
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50/90 p-4 space-y-1.5 text-xs">
              <div className="text-zinc-500">Matched SCI Graduation Record</div>
              <div className="font-bold text-zinc-900">{c4TributeStudent.program}</div>
              <p className="text-zinc-600 leading-relaxed pt-1">
                From everyone in the School of Computing and Informatics, thank you for shaping SCI
                across your years at AIU. Cohort 4 graduating seniors are honored guests and do not
                participate in the 2026/2027 student ballot. You will be missed but we wish you
                every success ahead!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  clearC4Tribute();
                  closeAuthModal();
                  setActiveTab('candidates');
                }}
                className="px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700"
              >
                Explore Candidates
              </button>
              <button
                type="button"
                onClick={() => {
                  clearC4Tribute();
                  closeAuthModal();
                  setActiveTab('results');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                <span>View Live Election Results</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/55 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-2xl overflow-hidden my-6">
        <CardPatternBg variant="grid-nodes" />

        <div className="relative z-10 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src="/logos/aiu-logo.png" alt="AIU" className="h-6 w-auto object-contain" />
              <span className="h-4 w-px bg-zinc-200" />
              <img src="/logos/sci-logo.png" alt="SCI" className="h-6 w-auto object-contain" />
            </div>
            <button
              type="button"
              onClick={() => {
                cancelPendingGoogleAuth();
                closeAuthModal();
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              aria-label="Close sign-in"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {feedback && (
            <div
              className={`rounded-xl px-3.5 py-2.5 text-xs font-semibold flex items-start gap-2 border ${
                feedback.type === 'error'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {feedback.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {!pendingGoogleAccount ? (
            <>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Google OAuth Verification</span>
                </div>
                <h2 className="text-xl font-extrabold text-zinc-950 tracking-tight">
                  Sign in with AIU Student Google
                </h2>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  No portal password needed. Sign in with your verified{' '}
                  <span className="font-mono text-zinc-700">@student.aiu.edu.my</span> Google
                  Workspace account.
                </p>
              </div>

              {mode === 'demo' && (
                <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50/80 p-3.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    Demo OAuth Email Simulator
                  </label>
                  <input
                    type="email"
                    value={demoEmail}
                    onChange={(e) => setDemoEmail(e.target.value)}
                    placeholder="name@student.aiu.edu.my"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setDemoEmail('milad.sahebi@student.aiu.edu.my')}
                      className="px-2 py-1 rounded-md bg-white border border-zinc-200 hover:border-emerald-300 text-[10px] font-semibold text-zinc-700"
                    >
                      C7 Student (Milad)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoEmail('aiu22102225@student.aiu.edu.my')}
                      className="px-2 py-1 rounded-md bg-white border border-zinc-200 hover:border-emerald-300 text-[10px] font-semibold text-zinc-700"
                    >
                      C4 Senior (ID Email)
                    </button>
                    <button
                      type="button"
                      onClick={() => switchDemoPersona('admin-abdulkarem')}
                      className="px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700"
                    >
                      Instant Admin
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={submitting}
                onClick={() => handleGoogleSignIn()}
                className="w-full py-3 px-4 rounded-xl border border-zinc-200 bg-white hover:border-emerald-400 hover:bg-zinc-50 disabled:opacity-60 text-zinc-950 font-bold text-sm flex items-center justify-center gap-3 shadow-sm transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.9 1.5l2.7-2.6C16.9 3.3 14.7 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z"
                  />
                  <path
                    fill="#34A853"
                    d="M3.5 7.4l3.2 2.3C7.6 7.8 9.6 6.4 12 6.4c1.9 0 3.1.8 3.9 1.5l2.7-2.6C16.9 3.3 14.7 2.4 12 2.4 8.2 2.4 4.9 4.5 3.5 7.4z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M12 21.6c2.6 0 4.8-.9 6.4-2.4l-3-2.5c-.8.6-1.9 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1l-3.2 2.5C4.7 19.2 8.1 21.6 12 21.6z"
                  />
                  <path
                    fill="#4285F4"
                    d="M21.2 12.2c0-.7-.1-1.3-.2-2H12v3.9h5.5c-.3 1.3-1 2.4-2.1 3.1l3 2.5c1.8-1.6 2.8-4.1 2.8-7.5z"
                  />
                </svg>
                <span>
                  {submitting
                    ? 'Verifying Google Session...'
                    : 'Continue with Google (@student.aiu.edu.my)'}
                </span>
              </button>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[11px] text-zinc-500">
                <span className="inline-flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  1-to-1 Roster &amp; Email Lock Active
                </span>
                <button
                  type="button"
                  onClick={closeAuthModal}
                  className="inline-flex items-center gap-1 font-semibold text-zinc-700 hover:text-zinc-950"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Public Portal
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleVerifyStudentId} className="space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Step 2 of 2: 1-Time Roster Verification</span>
                </div>
                <h2 className="text-xl font-extrabold text-zinc-950 tracking-tight">
                  Confirm Your AIU Student ID
                </h2>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Verified Google account:{' '}
                  <span className="font-mono font-semibold text-zinc-800">
                    {pendingGoogleAccount.email}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Official AIU Student ID
                </label>
                <input
                  type="text"
                  required
                  value={studentIdInput}
                  onChange={(e) => setStudentIdInput(e.target.value)}
                  placeholder="AIU25102048"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-mono uppercase text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-zinc-400 mt-1">
                  Matched directly against official SCI Cohort records. Your account cannot be linked
                  to another student&apos;s ID.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {AIU_COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setFeedback(null);
                    cancelPendingGoogleAuth();
                  }}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{submitting ? 'Verifying Roster...' : 'Verify ID & Enter Portal'}</span>
                </button>
              </div>

              {mode === 'demo' && (
                <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-2.5 text-[11px] text-zinc-500 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Test IDs: <code className="text-zinc-800">AIU25102043</code> (Milad, C7) or{' '}
                    <code className="text-zinc-800">AIU22102225</code> (C4 Senior Tribute).
                  </span>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
