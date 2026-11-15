import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  KeyRound,
  Lock,
  Monitor,
  ShieldCheck,
  Unlock,
  Users,
  Vote,
  X,
} from 'lucide-react';
import { useElection } from '../services/electionContext';
import { Candidate } from '../types/election';
import { shortProgramLabel } from '../utils/imageUtils';
import { CardPatternBg } from './CardPatternBg';

export const LabBoothKioskView: React.FC = () => {
  const {
    dbState,
    approvedCandidates,
    labBoothSession,
    submitLabBoothBallot,
    unlockLabBoothWithPin,
  } = useElection();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ballotError, setBallotError] = useState<string | null>(null);

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [showAbortPinModal, setShowAbortPinModal] = useState(false);
  const [abortPinInput, setAbortPinInput] = useState('');
  const [abortPinError, setAbortPinError] = useState<string | null>(null);

  const maxChoices = dbState.config.maxVotesPerBallot;
  const activeCheckIn = labBoothSession.activeCheckIn;

  const selectedCandidates = useMemo(
    () =>
      selectedIds
        .map((id) => approvedCandidates.find((c) => c.id === id))
        .filter((c): c is Candidate => Boolean(c)),
    [approvedCandidates, selectedIds]
  );

  const toggleCandidate = (candidateId: string) => {
    setBallotError(null);
    setSelectedIds((prev) => {
      if (prev.includes(candidateId)) {
        return prev.filter((id) => id !== candidateId);
      }
      if (prev.length >= maxChoices) {
        setBallotError(`Maximum ${maxChoices} candidates may be selected per ballot.`);
        return prev;
      }
      return [...prev, candidateId];
    });
  };

  const handleConfirmSubmit = async () => {
    setSubmitting(true);
    setBallotError(null);
    try {
      const res = await submitLabBoothBallot(selectedIds);
      if (res.ok) {
        setConfirmModalOpen(false);
        setSelectedIds([]);
        setPinInput('');
        setPinError(null);
      } else {
        setBallotError(res.message);
        setConfirmModalOpen(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handlePinUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    const res = unlockLabBoothWithPin(pinInput);
    if (!res.ok) {
      setPinError(res.message);
    } else {
      setPinInput('');
    }
  };

  const handleAbortWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    setAbortPinError(null);
    const res = unlockLabBoothWithPin(abortPinInput);
    if (!res.ok) {
      setAbortPinError(res.message);
    } else {
      setAbortPinInput('');
      setShowAbortPinModal(false);
    }
  };

  if (labBoothSession.awaitingPinUnlock || !activeCheckIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <div className="relative p-6 sm:p-8 border-b border-zinc-200 bg-zinc-50 overflow-hidden">
            <CardPatternBg variant="iso-waves" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  Lab Booth Ballot Recorded
                </p>
                <h1 className="mt-1 text-xl font-extrabold text-zinc-950 tracking-tight">
                  Thank You for Voting
                </h1>
                <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
                  {labBoothSession.lastVoterName ? (
                    <>
                      Checked-in ballot for{' '}
                      <span className="font-semibold text-zinc-900">
                        {labBoothSession.lastVoterName}
                      </span>{' '}
                      has been recorded anonymously.
                    </>
                  ) : (
                    'Your in-person ballot has been recorded anonymously.'
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {labBoothSession.lastReceiptCode && (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    Receipt Code
                  </p>
                  <p className="font-mono text-sm font-bold text-zinc-950 mt-0.5">
                    {labBoothSession.lastReceiptCode}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Secret Ballot
                </span>
              </div>
            )}

            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 flex items-start gap-3">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <span className="font-bold">Kiosk Locked.</span> Hand this station back to an
                authorized SCI Election Officer. Enter the 4-digit Admin PIN below to unlock Admin
                Controls and check in the next student.
              </div>
            </div>

            <form onSubmit={handlePinUnlock} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Admin Kiosk Unlock PIN
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    pattern="\d{4}"
                    required
                    value={pinInput}
                    onChange={(e) => {
                      setPinError(null);
                      setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                    }}
                    placeholder="Enter 4-digit PIN"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white font-mono text-base tracking-[0.35em] text-zinc-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {pinError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 flex items-center gap-2 text-xs text-red-700 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={pinInput.length !== 4}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-bold transition-colors"
              >
                <Unlock className="w-4 h-4" />
                Unlock Kiosk &amp; Return to Admin
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Locked Kiosk Header (No Public Nav or Admin Tabs) */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Monitor className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Physical Lab Booth
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  <Lock className="w-2.5 h-2.5" />
                  Admin Locked
                </span>
              </div>
              <p className="text-sm font-extrabold text-zinc-950 truncate">
                SCI Top Committee Official Ballot
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setAbortPinInput('');
              setAbortPinError(null);
              setShowAbortPinModal(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-colors shrink-0"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Officer Unlock</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-28">
        {/* Checked-In Student Identity Banner */}
        <section className="relative rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 overflow-hidden">
          <CardPatternBg variant="grid-nodes" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Verified Check-In Session
              </p>
              <h1 className="text-lg sm:text-xl font-extrabold text-zinc-950 tracking-tight">
                {activeCheckIn.fullName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600">
                <span className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono font-semibold text-zinc-800">
                  {activeCheckIn.cohort}
                </span>
                <span>{shortProgramLabel(activeCheckIn.program)}</span>
                <span className="text-zinc-300">/</span>
                <span>{activeCheckIn.country}</span>
                {activeCheckIn.studentId && (
                  <>
                    <span className="text-zinc-300">/</span>
                    <span className="font-mono text-zinc-800">{activeCheckIn.studentId}</span>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-2.5 flex items-center gap-2.5 shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-emerald-950">Secret In-Person Ballot</p>
                <p className="text-emerald-800">Select 1 to {maxChoices} approved candidates.</p>
              </div>
            </div>
          </div>
        </section>

        {ballotError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-center gap-2.5 text-xs font-semibold text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{ballotError}</span>
          </div>
        )}

        {/* Candidate Selection Grid */}
        {approvedCandidates.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center space-y-2">
            <Users className="w-7 h-7 text-zinc-400 mx-auto" />
            <p className="text-sm font-bold text-zinc-900">No Approved Candidates Available</p>
            <p className="text-xs text-zinc-500">
              Approve candidates in the Admin Console before opening lab voting.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {approvedCandidates.map((candidate) => {
              const isSelected = selectedIds.includes(candidate.id);
              const selectionIndex = selectedIds.indexOf(candidate.id) + 1;
              return (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => toggleCandidate(candidate.id)}
                  className={`relative text-left rounded-2xl border p-4 transition-all overflow-hidden ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <CardPatternBg variant="grid-nodes" />
                  <div className="relative z-10 flex items-start gap-3.5">
                    <img
                      src={candidate.photoUrl}
                      alt={candidate.fullName}
                      className="w-16 h-16 rounded-xl object-cover border border-zinc-200 bg-zinc-50 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-[11px] font-bold text-zinc-400">
                          #{String(candidate.candidateNumber).padStart(2, '0')}
                        </span>
                        <span
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-zinc-200 bg-white text-transparent'
                          }`}
                        >
                          {isSelected ? selectionIndex : <Check className="w-3.5 h-3.5" />}
                        </span>
                      </div>
                      <h3 className="mt-1 text-sm font-extrabold text-zinc-950 leading-snug">
                        {candidate.fullName}
                      </h3>
                      <p className="mt-0.5 text-[11px] font-semibold text-emerald-700">
                        {candidate.cohort} / {shortProgramLabel(candidate.program)}
                      </p>
                      <p className="text-[11px] text-zinc-500">{candidate.country}</p>
                    </div>
                  </div>
                  <p className="relative z-10 mt-3 text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                    {candidate.manifesto}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* Sticky Bottom Ballot Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-zinc-200 bg-white/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="text-xs">
            <span className="font-mono font-bold text-zinc-950">
              {selectedIds.length} / {maxChoices}
            </span>{' '}
            <span className="text-zinc-500">candidates selected</span>
          </div>
          <div className="flex items-center gap-2.5">
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-3.5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={() => setConfirmModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-45 text-white text-xs font-bold transition-colors"
            >
              <Vote className="w-4 h-4" />
              Review &amp; Cast Ballot
            </button>
          </div>
        </div>
      </div>

      {/* Ballot Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Final Confirmation
                </p>
                <h2 className="text-base font-extrabold text-zinc-950">Submit Lab Booth Ballot</h2>
              </div>
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-zinc-600 leading-relaxed">
                Submitting for{' '}
                <span className="font-semibold text-zinc-950">{activeCheckIn.fullName}</span>.
                Once cast, your ballot is permanent and cannot be altered.
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedCandidates.map((cand, idx) => (
                  <div
                    key={cand.id}
                    className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-2.5"
                  >
                    <span className="font-mono text-xs font-bold text-emerald-700 w-5 text-center">
                      {idx + 1}
                    </span>
                    <img
                      src={cand.photoUrl}
                      alt={cand.fullName}
                      className="w-9 h-9 rounded-lg object-cover border border-zinc-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-zinc-950 truncate">{cand.fullName}</p>
                      <p className="text-[11px] text-zinc-500">
                        {cand.cohort} / {shortProgramLabel(cand.program)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmSubmit}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Confirm & Cast'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Officer PIN Override / Abort Modal */}
      {showAbortPinModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-zinc-950">Officer PIN Unlock</h2>
              <button
                type="button"
                onClick={() => setShowAbortPinModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAbortWithPin} className="p-5 space-y-4">
              <p className="text-xs text-zinc-600 leading-relaxed">
                Enter the 4-digit Admin PIN to cancel this kiosk check-in and return to the Admin
                Console without casting a ballot.
              </p>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                pattern="\d{4}"
                required
                value={abortPinInput}
                onChange={(e) => {
                  setAbortPinError(null);
                  setAbortPinInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                }}
                placeholder="4-digit PIN"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 font-mono text-base tracking-[0.35em] text-zinc-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {abortPinError && (
                <p className="text-xs font-medium text-red-600">{abortPinError}</p>
              )}
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAbortPinModal(false)}
                  className="px-3.5 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={abortPinInput.length !== 4}
                  className="px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-bold"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
