import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Lock,
  Save,
  ShieldCheck,
  UserCog,
} from 'lucide-react';
import { AIU_COUNTRIES } from '../data/seedData';
import { useElection } from '../services/electionContext';
import { compressPortraitFile, shortProgramLabel } from '../utils/imageUtils';
import { CardPatternBg } from './CardPatternBg';

export const CandidateProfileView: React.FC = () => {
  const {
    currentUser,
    myCandidateProfile,
    isProfileLocked,
    updateCandidateDetails,
    setActiveTab,
  } = useElection();

  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('Malaysia');
  const [manifesto, setManifesto] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    if (!myCandidateProfile) return;
    setFullName(myCandidateProfile.fullName);
    setCountry(myCandidateProfile.country);
    setManifesto(myCandidateProfile.manifesto);
    setPhotoUrl(myCandidateProfile.photoUrl);
  }, [myCandidateProfile]);

  if (!currentUser || !myCandidateProfile || myCandidateProfile.status !== 'approved') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-3">
        <UserCog className="w-10 h-10 mx-auto text-zinc-400" />
        <h2 className="text-lg font-bold text-zinc-950">Approved Candidate Profile</h2>
        <p className="text-sm text-zinc-500">
          This workspace unlocks automatically once your nomination is approved by the Admin Team.
        </p>
        <button
          type="button"
          onClick={() => setActiveTab('candidates')}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
        >
          View Candidates
        </button>
      </div>
    );
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressPortraitFile(file, 320);
      setPhotoUrl(compressed);
      setFeedback(null);
    } catch (err) {
      setFeedback({
        ok: false,
        msg: err instanceof Error ? err.message : 'Unable to process image.',
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await updateCandidateDetails(myCandidateProfile.id, {
        fullName,
        country,
        manifesto,
        photoUrl,
      });
      setFeedback({ ok: res.ok, msg: res.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-24 sm:pb-12 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <UserCog className="w-4 h-4" />
            <span>Approved Contestant Workspace</span>
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-950 mt-1">My Candidate Profile</h1>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${
            isProfileLocked
              ? 'border-zinc-200 bg-zinc-100 text-zinc-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {isProfileLocked ? <Lock className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
          <span>{isProfileLocked ? 'Locked for Voting Live' : 'Editable in Nominations & Campaign'}</span>
        </span>
      </div>

      {isProfileLocked && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-xs text-zinc-600 flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-zinc-500 shrink-0" />
          <span>
            Candidate profiles locked automatically when Phase 3 (3. Voting Live) started so every
            voter sees consistent candidate information.
          </span>
        </div>
      )}

      {feedback && (
        <div
          className={`rounded-xl px-4 py-3 text-xs font-semibold flex items-center gap-2 border ${
            feedback.ok
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          {feedback.ok ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Live Card Preview */}
        <div className="lg:col-span-5 relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-card space-y-4">
          <CardPatternBg variant="grid-nodes" />
          <div className="relative z-10 text-center space-y-3">
            <span className="inline-block font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-zinc-200 bg-zinc-50 text-zinc-700">
              #{String(myCandidateProfile.candidateNumber).padStart(2, '0')} Live Card Preview
            </span>
            <img
              src={photoUrl}
              alt={fullName}
              className="w-24 h-24 mx-auto rounded-2xl object-cover border border-zinc-200 shadow-sm"
            />
            <div>
              <h2 className="text-base font-extrabold text-zinc-950">{fullName}</h2>
              <div className="text-xs text-zinc-500 mt-0.5">{myCandidateProfile.email}</div>
              <div className="text-xs font-semibold text-zinc-700 mt-1">
                {shortProgramLabel(myCandidateProfile.program)} | {country}
              </div>
            </div>
            <div className="pt-3 border-t border-zinc-100 text-left">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Manifesto
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line">
                {manifesto}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form
          onSubmit={handleSave}
          className="lg:col-span-7 rounded-2xl border border-zinc-200 bg-white p-6 shadow-card space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Display Full Name
              </label>
              <input
                type="text"
                required
                disabled={isProfileLocked}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-950 disabled:bg-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Country
              </label>
              <select
                disabled={isProfileLocked}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-950 disabled:bg-zinc-100"
              >
                {AIU_COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Update Portrait Photo
            </label>
            <label
              className={`flex items-center gap-3 p-3.5 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 ${
                isProfileLocked ? 'opacity-60 cursor-not-allowed' : 'hover:border-emerald-400 cursor-pointer'
              }`}
            >
              <ImagePlus className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs text-zinc-700">
                <strong className="block">Choose new JPG/PNG photo</strong>
                <span className="text-[11px] text-zinc-500">Auto-cropped &amp; compressed</span>
              </div>
              <input
                type="file"
                accept="image/*"
                disabled={isProfileLocked}
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Official Manifesto
            </label>
            <textarea
              rows={5}
              required
              disabled={isProfileLocked}
              value={manifesto}
              onChange={(e) => setManifesto(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-950 disabled:bg-zinc-100"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving || isProfileLocked}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-45 text-white text-xs font-bold"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Candidate Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
