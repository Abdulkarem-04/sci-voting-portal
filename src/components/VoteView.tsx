import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Lock,
  Printer,
  ShieldCheck,
  Users,
  Vote,
  X,
} from 'lucide-react';
import { PHASE_META } from '../data/seedData';
import { useElection } from '../services/electionContext';
import { Candidate } from '../types/election';
import { shortProgramLabel } from '../utils/imageUtils';
import { CardPatternBg } from './CardPatternBg';

export const VoteView: React.FC = () => {
  const { dbState, currentUser, approvedCandidates, submitBallot, setActiveTab, openAuthModal } =
    useElection();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const selectedCandidates = useMemo(
    () =>
      selectedIds
        .map((id) => approvedCandidates.find((c) => c.id === id))
        .filter((c): c is Candidate => Boolean(c)),
    [approvedCandidates, selectedIds]
  );

  if (!currentUser) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-2xl border border-zinc-200 bg-white flex items-center justify-center text-emerald-600">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-zinc-950">Student Sign-In Required to Vote</h2>
        <p className="text-sm text-zinc-500">
          Verify your <span className="font-mono">@student.aiu.edu.my</span> Google account to open
          your official single-use ballot.
        </p>
        <button
          type="button"
          onClick={() => openAuthModal('vote')}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  const { config } = dbState;
  const maxChoices = config.maxVotesPerBallot;
  const isVotingLive = config.currentPhase === 'VOTING_LIVE';

  const toggleCandidate = (candidateId: string) => {
    setErrorMsg(null);
    if (!isVotingLive || currentUser.hasVoted) return;

    setSelectedIds((prev) => {
      if (prev.includes(candidateId)) {
        return prev.filter((id) => id !== candidateId);
      }
      if (prev.length >= maxChoices) {
        setErrorMsg(`You may select up to ${maxChoices} candidates per ballot.`);
        return prev;
      }
      return [...prev, candidateId];
    });
  };

  const handleConfirmVote = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await submitBallot(selectedIds);
      if (res.ok) {
        setSuccessMsg(res.message);
        setConfirmModalOpen(false);
        setSelectedIds([]);
      } else {
        setErrorMsg(res.message);
        setConfirmModalOpen(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadReceipt = () => {
    const receiptText = [
      '======================================================',
      'ALBUKHARY INTERNATIONAL UNIVERSITY',
      'SCHOOL OF COMPUTING AND INFORMATICS (SCI)',
      `${config.title} - OFFICIAL SECRET BALLOT RECEIPT`,
      '======================================================',
      `Voter Name   : ${currentUser.fullName}`,
      `Student ID   : ${currentUser.studentId}`,
      `Cohort       : ${currentUser.cohort}`,
      `Channel      : ${currentUser.votingChannel === 'lab_booth' ? 'Physical Lab Booth' : 'Online Portal'}`,
      `Receipt Code : ${currentUser.receiptCode || 'N/A'}`,
      `Submitted At : ${currentUser.votedAt ? new Date(currentUser.votedAt).toLocaleString() : 'N/A'}`,
      '',
      'Ballot Confidentiality: Candidate selections are anonymous and',
      'never stored alongside your student identity.',
      '======================================================',
    ].join('\n');

    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentUser.receiptCode || 'SCI-Voter-Receipt'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Already Voted -> Verified Secret Ballot Receipt View
  if (currentUser.hasVoted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 sm:pb-12">
        <div className="relative overflow-hidden bg-white rounded-2xl border border-emerald-200 shadow-card">
          <CardPatternBg variant="honor-crest" />
          <div className="relative z-10 px-6 py-6 border-b border-zinc-200 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                  Official Voter Receipt
                </span>
                <h1 className="text-xl font-extrabold text-zinc-950">Ballot Cast &amp; Locked</h1>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-zinc-950 text-white font-mono text-xs font-bold">
              {currentUser.receiptCode}
            </span>
          </div>

          <div className="relative z-10 p-6 space-y-5">
            {successMsg && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-zinc-50 rounded-xl p-4 border border-zinc-200">
              <div>
                <div className="text-zinc-400">Voter Name</div>
                <div className="font-bold text-zinc-950 mt-0.5">{currentUser.fullName}</div>
              </div>
              <div>
                <div className="text-zinc-400">Student ID &amp; Cohort</div>
                <div className="font-mono font-bold text-zinc-950 mt-0.5">
                  {currentUser.studentId} ({currentUser.cohort})
                </div>
              </div>
              <div>
                <div className="text-zinc-400">Program</div>
                <div className="font-semibold text-zinc-800 mt-0.5">
                  {shortProgramLabel(currentUser.program)}
                </div>
              </div>
              <div>
                <div className="text-zinc-400">Recorded Timestamp</div>
                <div className="font-semibold text-zinc-800 mt-0.5">
                  {currentUser.votedAt ? new Date(currentUser.votedAt).toLocaleString() : 'Recorded'}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-xs text-zinc-600 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>True Secret Ballot Guarantee:</strong> Your vote tallies were added
                anonymously to your chosen candidates without storing any link between your Student
                ID and the candidates you selected.
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-100 no-print">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('results')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                <Award className="w-4 h-4" />
                <span>View Live Results</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-44 md:pb-32 space-y-6">
      {/* Ballot Header */}
      <div className="relative overflow-hidden bg-white rounded-2xl p-6 border border-zinc-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <CardPatternBg variant="grid-nodes" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <span className={`status-dot ${isVotingLive ? 'live' : 'off'}`} />
            <span>Official Digital Ballot - {config.academicSession}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 mt-1 tracking-tight">
            Select 1 to {maxChoices} Candidates
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            {config.topAdvancingCount
              ? `Votes are final once confirmed. The Top ${config.topAdvancingCount} contestants advance to Dean & Management Panel interviews.`
              : 'Votes are final once confirmed. Shortlisted top candidates advance to Dean & Management Panel interviews.'}
          </p>
        </div>

        <div className="relative z-10 px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-center shrink-0">
          <div className="text-[11px] text-zinc-500 font-semibold">Selected</div>
          <div className="text-xl font-extrabold text-emerald-600 font-mono">
            {selectedIds.length} / {maxChoices}
          </div>
        </div>
      </div>

      {!isVotingLive && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 flex items-start gap-3 text-xs sm:text-sm text-zinc-700">
          <Clock className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
          <div>
            <strong>Ballot Preview Mode ({PHASE_META[config.currentPhase].label}):</strong> Online
            voting opens on <strong>{config.votingDateDisplay}</strong> ({config.votingWindowDisplay}
            ). Switch phase to <em>3. Voting Live</em> in Admin Console to submit ballots.
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Selectable Candidate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {approvedCandidates.map((cand) => {
          const isSelected = selectedIds.includes(cand.id);
          const disabled = !isVotingLive;
          return (
            <button
              key={cand.id}
              type="button"
              disabled={disabled}
              onClick={() => toggleCandidate(cand.id)}
              className={`relative overflow-hidden text-left rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500 shadow-card-hover'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 shadow-card'
              } ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <CardPatternBg variant="grid-nodes" />
              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={cand.photoUrl}
                    alt={cand.fullName}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-zinc-200"
                  />
                  <div className="min-w-0">
                    <span className="text-[11px] font-mono font-bold text-zinc-400">
                      #{String(cand.candidateNumber).padStart(2, '0')}
                    </span>
                    <h3 className="text-sm font-extrabold text-zinc-950 leading-snug">
                      {cand.fullName}
                    </h3>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                      {shortProgramLabel(cand.program)} | {cand.country}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                    isSelected
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-zinc-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>

              <p className="relative z-10 mt-3 pt-3 border-t border-zinc-100 text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                {cand.manifesto}
              </p>
            </button>
          );
        })}
      </div>

      {/* Floating Ballot Tray positioned cleanly above Mobile Bottom Nav */}
      <div className="fixed bottom-20 md:bottom-5 left-3 right-3 z-30 no-print">
        <div className="max-w-4xl mx-auto bg-zinc-950/95 backdrop-blur-md text-white rounded-2xl px-4 sm:px-5 py-3 shadow-2xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold">
                Ballot Selection: {selectedIds.length} of {maxChoices} chosen
              </div>
              <div className="text-[11px] text-zinc-400 truncate">
                {selectedCandidates.length > 0
                  ? selectedCandidates.map((c) => c.fullName).join(', ')
                  : 'Tap 1 to 4 candidate cards above to build your ballot.'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 justify-end">
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              disabled={!isVotingLive || selectedIds.length === 0}
              onClick={() => setConfirmModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-extrabold text-xs transition-colors"
            >
              <Vote className="w-3.5 h-3.5" />
              <span>Review &amp; Submit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-zinc-200 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-zinc-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Confirm Official Ballot
              </h3>
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-zinc-600 leading-relaxed">
                Votes are final and anonymous once submitted. Please confirm your{' '}
                <strong>{selectedCandidates.length}</strong> selected contestant
                {selectedCandidates.length > 1 ? 's' : ''}:
              </p>

              <div className="space-y-2">
                {selectedCandidates.map((cand, idx) => (
                  <div
                    key={cand.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200"
                  >
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <img
                      src={cand.photoUrl}
                      alt={cand.fullName}
                      className="w-9 h-9 rounded-lg object-cover border border-zinc-200"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-950 truncate">
                        {cand.fullName}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate">
                        {shortProgramLabel(cand.program)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700"
              >
                Go Back
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmVote}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submitting ? 'Submitting...' : 'Submit Official Vote'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
