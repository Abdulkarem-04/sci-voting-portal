import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Lock,
  ShieldCheck,
  UserCog,
  UserPlus,
  X,
} from 'lucide-react';
import { findRosterStudent } from '../data/cohortRoster';
import {
  AIU_COUNTRIES,
  isOfficialShortlistedNominee,
  MAX_MANIFESTO_LENGTH,
} from '../data/seedData';
import { useElection } from '../services/electionContext';
import { Candidate, CandidateStatus } from '../types/election';
import {
  compressPortraitFile,
  generateSvgAvatarDataUrl,
  shortProgramLabel,
} from '../utils/imageUtils';

interface Props {
  open: boolean;
  onClose: () => void;
  defaultStatus?: CandidateStatus;
  adminAddMode?: boolean;
  editCandidate?: Candidate | null;
}

export const CandidateApplicationModal: React.FC<Props> = ({
  open,
  onClose,
  defaultStatus = 'pending',
  adminAddMode = false,
  editCandidate = null,
}) => {
  const {
    currentUser,
    isProfileLocked,
    submitCandidateApplication,
    updateCandidateDetails,
  } = useElection();

  const [fullName, setFullName] = useState('');
  const [targetStudentId, setTargetStudentId] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [country, setCountry] = useState('');
  const [manifesto, setManifesto] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(
    null
  );

  const isEditMode = Boolean(editCandidate);

  useEffect(() => {
    if (!open) return;
    setFeedback(null);

    if (editCandidate) {
      setFullName(editCandidate.fullName);
      setTargetStudentId(editCandidate.studentId);
      setTargetEmail(editCandidate.email);
      setCountry(editCandidate.country);
      setManifesto(editCandidate.manifesto);
      setPhotoUrl(editCandidate.photoUrl);
      return;
    }

    if (adminAddMode) {
      setFullName('');
      setTargetStudentId('');
      setTargetEmail('');
      setCountry('');
      setManifesto('');
      setPhotoUrl('');
      return;
    }

    if (currentUser) {
      setFullName(currentUser.fullName);
      setTargetStudentId(currentUser.studentId);
      setTargetEmail(currentUser.email);
      setCountry(currentUser.country || '');
      setManifesto('');
      setPhotoUrl('');
    }
  }, [adminAddMode, currentUser, editCandidate, open]);

  if (!open) return null;

  const rosterLookup =
    adminAddMode && targetStudentId ? findRosterStudent(targetStudentId) : null;

  const notShortlisted =
    !isEditMode &&
    !adminAddMode &&
    Boolean(currentUser && !isOfficialShortlistedNominee(currentUser.studentId));
  const ineligibleCohort =
    !isEditMode && !adminAddMode && currentUser && currentUser.cohort === 'C7';
  const lockedForSubmit = isProfileLocked;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressPortraitFile(file, 320);
      setPhotoUrl(compressed);
      setFeedback(null);
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Unable to process image.',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);

    try {
      if (editCandidate) {
        const res = await updateCandidateDetails(editCandidate.id, {
          fullName,
          country,
          manifesto,
          photoUrl:
            photoUrl ||
            generateSvgAvatarDataUrl(
              fullName || editCandidate.fullName,
              `${shortProgramLabel(editCandidate.program).slice(0, 3).toUpperCase()} Y${editCandidate.yearOfStudy}`
            ),
        });
        setFeedback({ type: res.ok ? 'success' : 'error', text: res.message });
        if (res.ok) {
          setTimeout(() => onClose(), 750);
        }
        return;
      }

      const res = await submitCandidateApplication(
        {
          fullName,
          country,
          manifesto,
          photoUrl,
          targetStudentId: adminAddMode ? targetStudentId : undefined,
          targetEmail: adminAddMode ? targetEmail : undefined,
        },
        adminAddMode ? defaultStatus : 'pending'
      );
      setFeedback({ type: res.ok ? 'success' : 'error', text: res.message });
      if (res.ok) {
        setTimeout(() => onClose(), 850);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const displayProgram = editCandidate
    ? editCandidate.program
    : rosterLookup
      ? rosterLookup.program
      : currentUser?.program || '';
  const displayCohort = editCandidate
    ? `${editCandidate.cohort} (Year ${editCandidate.yearOfStudy})`
    : rosterLookup
      ? `${rosterLookup.cohort} (Year ${rosterLookup.yearOfStudy})`
      : currentUser
        ? `${currentUser.cohort} (Year ${currentUser.yearOfStudy})`
        : '';

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/55 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-zinc-200 shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/70 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-zinc-950 flex items-center gap-2">
              {isEditMode ? (
                <UserCog className="w-4 h-4 text-emerald-600" />
              ) : (
                <UserPlus className="w-4 h-4 text-emerald-600" />
              )}
              <span>
                {isEditMode
                  ? 'Edit Candidate Profile'
                  : adminAddMode
                    ? 'Add Verified Candidate (Admin)'
                    : 'Become a Candidate'}
              </span>
            </h2>
            <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
              {isEditMode
                ? `${editCandidate?.studentId} | Edits lock in Voting Live`
                : adminAddMode
                  ? 'Admin Direct Roster Verification (C5/C6)'
                  : 'Restricted to the 26 officially shortlisted SCI nominees'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto scrollbar-thin">
          {(lockedForSubmit || notShortlisted || ineligibleCohort) && (
            <div className="rounded-xl bg-zinc-100 border border-zinc-200 p-3.5 text-xs text-zinc-700 flex items-start gap-2.5">
              <Lock className="w-4 h-4 shrink-0 mt-0.5 text-zinc-500" />
              <div>
                {lockedForSubmit
                  ? 'Candidate applications and profile edits are permanently locked once Phase 3 (Voting Live) begins.'
                  : ineligibleCohort
                    ? 'Candidate eligibility requires Cohort 5 or Cohort 6 (Year 2 or Year 3 in SCI).'
                    : 'Only the 26 officially announced SCI nominees are eligible to submit a candidate application.'}
              </div>
            </div>
          )}

          {feedback && (
            <div
              className={`rounded-xl px-3.5 py-2.5 text-xs font-semibold flex items-center gap-2 border ${
                feedback.type === 'error'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {feedback.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Admin Student Lookup */}
          {adminAddMode && !isEditMode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5">
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                  Target Student ID (C5/C6)
                </label>
                <input
                  type="text"
                  required
                  value={targetStudentId}
                  onChange={(e) => {
                    const v = e.target.value;
                    setTargetStudentId(v);
                    const match = findRosterStudent(v);
                    if (match) {
                      setFullName(match.fullName);
                      const slug = match.fullName
                        .toLowerCase()
                        .replace(/[^a-z\s]/g, ' ')
                        .trim()
                        .split(/\s+/)
                        .slice(0, 2)
                        .join('.');
                      setTargetEmail(`${slug}@student.aiu.edu.my`);
                    }
                  }}
                  placeholder="AIU24102323"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs font-mono uppercase text-zinc-950"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                  Student Email (@student.aiu.edu.my)
                </label>
                <input
                  type="email"
                  required
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  placeholder="student@student.aiu.edu.my"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-950"
                />
              </div>
            </div>
          )}

          {/* Verified Account Metadata Read-Only Chip */}
          {(currentUser || editCandidate || rosterLookup) && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-3.5 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{displayProgram}</span>
              </div>
              <span className="font-mono text-[11px] font-bold text-emerald-700">
                {displayCohort}
              </span>
            </div>
          )}

          {/* Editable Confirmed Full Name + Nationality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Confirm Display Full Name
              </label>
              <input
                type="text"
                required
                disabled={lockedForSubmit}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-950 disabled:bg-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Nationality
              </label>
              <select
                required
                disabled={lockedForSubmit}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-950 disabled:bg-zinc-100"
              >
                <option value="" disabled>
                  -- Select nationality --
                </option>
                {AIU_COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Photo Upload (Auto-compressed 320x320) */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Candidate Portrait {!isEditMode && <span className="text-zinc-400 font-normal">(Optional)</span>}
            </label>
            <label
              className={`flex items-center gap-3.5 p-3.5 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/70 transition-colors ${
                lockedForSubmit ? 'opacity-60 cursor-not-allowed' : 'hover:border-emerald-400 cursor-pointer'
              }`}
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Candidate portrait"
                  className="w-12 h-12 rounded-xl object-cover border border-zinc-200 shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl border border-zinc-200 bg-white flex items-center justify-center text-emerald-600 shrink-0">
                  <ImagePlus className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0">
                <div className="text-xs font-bold text-zinc-900">
                  {photoUrl ? 'Portrait Ready (Auto-Compressed 320x320)' : 'Upload Candidate Photo'}
                </div>
                <div className="text-[11px] text-zinc-500 truncate">
                  Automatically resized for fast loading across mobile &amp; campus Wi-Fi
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                disabled={lockedForSubmit}
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Manifesto */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <label className="block text-xs font-semibold text-zinc-700">
                Manifesto{' '}
                {!isEditMode && (
                  <span className="text-zinc-400 font-normal">
                    (Optional - editable until Voting Live)
                  </span>
                )}
              </label>
              <span
                className={`font-mono text-[11px] ${
                  manifesto.length >= MAX_MANIFESTO_LENGTH
                    ? 'text-amber-600 font-bold'
                    : 'text-zinc-400'
                }`}
              >
                {manifesto.length} / {MAX_MANIFESTO_LENGTH}
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={MAX_MANIFESTO_LENGTH}
              disabled={lockedForSubmit}
              value={manifesto}
              onChange={(e) => setManifesto(e.target.value.slice(0, MAX_MANIFESTO_LENGTH))}
              placeholder="Share your leadership priorities and commitment to SCI students..."
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-950 disabled:bg-zinc-100"
            />
          </div>

          <div className="pt-2 border-t border-zinc-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || lockedForSubmit || notShortlisted || Boolean(ineligibleCohort)}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-45 text-white text-xs font-bold transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {submitting
                  ? 'Saving...'
                  : isEditMode
                    ? 'Save Profile Updates'
                    : adminAddMode
                      ? 'Add Candidate'
                      : 'Submit Application'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
