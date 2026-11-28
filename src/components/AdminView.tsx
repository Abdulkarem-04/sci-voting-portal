import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Award,
  Check,
  CheckCircle2,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  KeyRound,
  Lock,
  Monitor,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Unlock,
  UserPlus,
  Users,
  Vote,
  X,
} from 'lucide-react';
import { C4_SENIOR_COUNT, findRosterStudent } from '../data/cohortRoster';
import {
  AIU_COUNTRIES,
  PHASE_META,
  PHASE_ORDER,
  PRIMARY_ADMIN_EMAIL,
  SCI_PROGRAMS,
} from '../data/seedData';
import { useElection } from '../services/electionContext';
import {
  Candidate,
  ElectionPhase,
  ProgramOfStudy,
  TopCommitteeRole,
  UserProfile,
  UserRole,
  VotingCohortCode,
} from '../types/election';
import { shortProgramLabel } from '../utils/imageUtils';
import { CandidateApplicationModal } from './CandidateApplicationModal';
import { CardPatternBg } from './CardPatternBg';

const TOP_COMMITTEE_ROLES: TopCommitteeRole[] = [
  'President',
  'Vice President',
  'Secretary',
  'Treasurer',
];

function formatAuditTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-MY', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export const AdminView: React.FC = () => {
  const {
    mode,
    dbState,
    currentUser,
    isAdmin,
    isProfileLocked,
    approvedCandidates,
    pendingCandidates,
    rankedCandidates,
    openAuthModal,
    setActiveTab,
    setCandidateStatus,
    assignTopCommitteeRole,
    deleteCandidate,
    updateElectionPhase,
    updateElectionConfig,
    manageAdminEmails,
    adminUpdateUser,
    startLabBoothSession,
    simulateC4Visit,
    resetDemoDatabase,
  } = useElection();

  const [banner, setBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Registered voters, Lab Booth PIN & Interview Shortlist Cutoff form states
  const [votersDraft, setVotersDraft] = useState<string>(
    String(dbState.config.totalRegisteredVoters)
  );
  const [pinDraft, setPinDraft] = useState<string>(dbState.config.labBoothPin);
  const [cutoffDraft, setCutoffDraft] = useState<string>(
    dbState.config.topAdvancingCount ? String(dbState.config.topAdvancingCount) : ''
  );
  const [dateDraft, setDateDraft] = useState<string>(dbState.config.votingDateDisplay);
  const [windowDraft, setWindowDraft] = useState<string>(dbState.config.votingWindowDisplay);

  // Physical Lab Voting Booth Check-In state
  const [labStudentId, setLabStudentId] = useState('');
  const [labFullName, setLabFullName] = useState('');
  const [labCohort, setLabCohort] = useState<VotingCohortCode>('C7');
  const [labProgram, setLabProgram] = useState<ProgramOfStudy>(SCI_PROGRAMS[0]);
  const [labCountry, setLabCountry] = useState<string>('');
  const [labEmail, setLabEmail] = useState('');
  const [labLookupNote, setLabLookupNote] = useState<{
    type: 'info' | 'warning';
    text: string;
  } | null>(null);

  // Candidate modals
  const [addCandidateOpen, setAddCandidateOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);

  // Registered Users Directory & Edit User Modal
  const [userSearch, setUserSearch] = useState('');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserId, setEditUserId] = useState('');
  const [editUserCohort, setEditUserCohort] = useState<VotingCohortCode>('C7');
  const [editUserYear, setEditUserYear] = useState<1 | 2 | 3>(1);
  const [editUserProgram, setEditUserProgram] = useState<ProgramOfStudy>(SCI_PROGRAMS[0]);
  const [editUserCountry, setEditUserCountry] = useState('');
  const [editUserRole, setEditUserRole] = useState<UserRole>('voter');
  const [savingUser, setSavingUser] = useState(false);

  // Rejected candidates drawer toggle
  const [showRejected, setShowRejected] = useState(false);

  // Admin Team email input
  const [newAdminEmail, setNewAdminEmail] = useState('');

  // Audit filter
  const [auditFilter, setAuditFilter] = useState<'all' | 'security' | 'booth'>('all');

  const registeredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    return Object.values(dbState.users)
      .filter((u) => {
        if (!q) return true;
        return (
          u.fullName.toLowerCase().includes(q) ||
          u.studentId.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.country.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  }, [dbState.users, userSearch]);

  const rejectedCandidates = useMemo(
    () => dbState.candidates.filter((c) => c.status === 'rejected'),
    [dbState.candidates]
  );

  const filteredLogs = useMemo(() => {
    if (auditFilter === 'security') {
      return dbState.auditLogs.filter((l) => l.action.startsWith('SECURITY_'));
    }
    if (auditFilter === 'booth') {
      return dbState.auditLogs.filter((l) => l.action.includes('LAB_BOOTH'));
    }
    return dbState.auditLogs;
  }, [auditFilter, dbState.auditLogs]);

  const showFeedback = (ok: boolean, message: string) => {
    setBanner({ type: ok ? 'success' : 'error', text: message });
  };

  if (!currentUser) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-2xl border border-zinc-200 bg-white flex items-center justify-center text-emerald-600">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-zinc-950">Admin Sign-In Required</h2>
        <p className="text-sm text-zinc-500">
          Sign in with an authorized SCI Election Committee{' '}
          <span className="font-mono">@student.aiu.edu.my</span> account to access Officer controls.
        </p>
        <button
          type="button"
          onClick={() => openAuthModal('admin')}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-2xl border border-red-200 bg-red-50 flex items-center justify-center text-red-600">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-zinc-950">Officer Access Restricted</h2>
        <p className="text-sm text-zinc-500">
          Your account (<span className="font-mono">{currentUser.email}</span>) does not hold SCI
          Election Admin privileges.
        </p>
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="px-5 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-bold"
        >
          Return to Portal Home
        </button>
      </div>
    );
  }

  const { config } = dbState;
  const turnoutPct =
    config.totalRegisteredVoters > 0
      ? Math.min(100, Math.round((config.totalBallotsCast / config.totalRegisteredVoters) * 100))
      : 0;

  const handlePhaseChange = async (phase: ElectionPhase) => {
    const res = await updateElectionPhase(phase);
    showFeedback(res.ok, res.message);
  };

  const handleToggleResults = async () => {
    const res = await updateElectionConfig({ liveResultsPublic: !config.liveResultsPublic });
    showFeedback(res.ok, res.message);
  };

  const handleSaveVoters = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(votersDraft);
    if (!Number.isFinite(num) || num < 1) {
      showFeedback(false, 'Enter a valid positive integer for registered voters.');
      return;
    }
    const res = await updateElectionConfig({ totalRegisteredVoters: Math.round(num) });
    showFeedback(res.ok, res.message);
  };

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = pinDraft.replace(/\D/g, '').slice(0, 4);
    const res = await updateElectionConfig({ labBoothPin: cleaned });
    if (res.ok) setPinDraft(cleaned);
    showFeedback(res.ok, res.message);
  };

  const handleLabStudentIdChange = (val: string) => {
    setLabStudentId(val);
    const match = findRosterStudent(val);
    if (!val.trim()) {
      setLabLookupNote(null);
      return;
    }
    if (match) {
      if (match.cohort === 'C4') {
        setLabLookupNote({
          type: 'warning',
          text: `${match.fullName} is Cohort 4 (graduating senior) and is ineligible to vote.`,
        });
      } else {
        setLabFullName(match.fullName);
        setLabCohort(match.cohort);
        setLabProgram(match.program);
        setLabLookupNote({
          type: 'info',
          text: `Roster match: ${match.fullName} (${match.cohort} / ${shortProgramLabel(match.program)}). Auto-filled.`,
        });
      }
    } else {
      setLabLookupNote({
        type: 'info',
        text: 'ID not in seed Excel roster (valid for new C7 walk-in with manual verification).',
      });
    }
  };

  const handleStartLabBooth = (e: React.FormEvent) => {
    e.preventDefault();
    const res = startLabBoothSession({
      fullName: labFullName,
      cohort: labCohort,
      program: labProgram,
      country: labCountry,
      studentId: labStudentId.trim() || undefined,
      email: labEmail.trim() || undefined,
    });
    if (!res.ok) {
      showFeedback(false, res.message);
    } else {
      setLabStudentId('');
      setLabFullName('');
      setLabCountry('');
      setLabEmail('');
      setLabLookupNote(null);
    }
  };

  const handleSetCutoff = async (cutoff: number | null) => {
    const res = await updateElectionConfig({ topAdvancingCount: cutoff });
    if (res.ok) {
      setCutoffDraft(cutoff ? String(cutoff) : '');
    }
    showFeedback(res.ok, res.message);
  };

  const handleSaveCustomCutoff = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = cutoffDraft.trim();
    if (!trimmed) {
      await handleSetCutoff(null);
      return;
    }
    const parsed = Number(trimmed);
    if (!Number.isInteger(parsed) || parsed < 1) {
      showFeedback(false, 'Enter a positive whole number for the interview cutoff.');
      return;
    }
    await handleSetCutoff(parsed);
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateElectionConfig({
      votingDateDisplay: dateDraft,
      votingWindowDisplay: windowDraft,
    });
    showFeedback(res.ok, res.message);
  };

  const handleQuickSyncSundayDate = async () => {
    const targetDate = 'Sunday, November 29, 2026';
    const res = await updateElectionConfig({ votingDateDisplay: targetDate });
    if (res.ok) {
      setDateDraft(targetDate);
    }
    showFeedback(res.ok, res.ok ? `Voting date updated to ${targetDate}.` : res.message);
  };

  const openUserEditor = (u: UserProfile) => {
    setEditingUser(u);
    setEditUserName(u.fullName);
    setEditUserId(u.studentId);
    setEditUserCohort(u.cohort);
    setEditUserYear(u.yearOfStudy);
    setEditUserProgram(u.program);
    setEditUserCountry(u.country);
    setEditUserRole(u.role);
  };

  const handleSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSavingUser(true);
    try {
      const res = await adminUpdateUser(editingUser.uid, {
        fullName: editUserName,
        studentId: editUserId,
        cohort: editUserCohort,
        yearOfStudy: editUserYear,
        program: editUserProgram,
        country: editUserCountry,
        role: editUserRole,
      });
      showFeedback(res.ok, res.message);
      if (res.ok) {
        setEditingUser(null);
      }
    } finally {
      setSavingUser(false);
    }
  };

  const handleApproveReject = async (id: string, status: 'approved' | 'rejected') => {
    const res = await setCandidateStatus(id, status);
    showFeedback(res.ok, res.message);
  };

  const handleAssignRole = async (candidateId: string, roleValue: string) => {
    const role = (roleValue || null) as TopCommitteeRole | null;
    const res = await assignTopCommitteeRole(candidateId, role);
    showFeedback(res.ok, res.message);
  };

  const handleDeleteCandidate = async (candidate: Candidate) => {
    if (isProfileLocked) {
      showFeedback(false, 'Profiles are locked during Voting Live and Ended phases.');
      return;
    }
    const res = await deleteCandidate(candidate.id);
    showFeedback(res.ok, res.message);
  };

  const handleAddAdminEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    const res = await manageAdminEmails('add', newAdminEmail);
    showFeedback(res.ok, res.message);
    if (res.ok) setNewAdminEmail('');
  };

  const handleRemoveAdminEmail = async (email: string) => {
    const res = await manageAdminEmails('remove', email);
    showFeedback(res.ok, res.message);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <section className="relative rounded-2xl border border-zinc-200 bg-white p-6 overflow-hidden">
        <CardPatternBg variant="grid-nodes" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                Election Officer Console
              </span>
              <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-zinc-600">
                {mode === 'firebase' ? 'Firebase Live Sync' : 'Local Demo Store'}
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              SCI Election Administration &amp; Lab Kiosk
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-500">
              Signed in as <span className="font-semibold text-zinc-800">{currentUser.fullName}</span>{' '}
              (<span className="font-mono">{currentUser.email}</span>).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {mode === 'demo' && (
              <button
                type="button"
                onClick={() => {
                  resetDemoDatabase();
                  showFeedback(true, 'Demo database reset to clean initial seed state.');
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 px-3.5 py-2 text-xs font-semibold text-zinc-700"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Demo Data
              </button>
            )}
            <button
              type="button"
              onClick={() => setAddCandidateOpen(true)}
              disabled={isProfileLocked}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 px-4 py-2 text-xs font-bold text-white"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Approved Candidate
            </button>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="relative z-10 mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Ballots Cast
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-extrabold text-zinc-950">
                {config.totalBallotsCast}
              </span>
              <span className="font-mono text-xs text-zinc-500">
                / {config.totalRegisteredVoters} ({turnoutPct}%)
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Approved Slate
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-extrabold text-zinc-950">
                {approvedCandidates.length}
              </span>
              <span className="font-mono text-xs text-zinc-500">approved candidates</span>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Pending Queue
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-extrabold text-zinc-950">
                {pendingCandidates.length}
              </span>
              <span className="text-xs text-zinc-500">awaiting review</span>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              C4 Seniors Reached
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-extrabold text-emerald-700">
                {dbState.c4Visits.length}
              </span>
              <span className="font-mono text-xs text-zinc-500">/ {C4_SENIOR_COUNT} graduating</span>
            </div>
          </div>
        </div>
      </section>

      {banner && (
        <div
          className={`rounded-xl border px-4 py-3 flex items-center justify-between gap-3 text-xs font-semibold ${
            banner.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {banner.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{banner.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setBanner(null)}
            className="text-zinc-500 hover:text-zinc-900 font-mono text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Phase Lifecycle & Visibility Controls */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-zinc-950">
              1. 4-Phase Election Control &amp; Results Visibility
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Candidate profile editing is allowed in Phases 1 and 2, and permanently locked in
              Phases 3 and 4.
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold shrink-0 ${
              isProfileLocked
                ? 'border-amber-200 bg-amber-50 text-amber-800'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {isProfileLocked ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                Candidate Profiles Locked (Admin + Self)
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5" />
                Candidate Profiles Unlocked
              </>
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PHASE_ORDER.map((phase) => {
            const meta = PHASE_META[phase];
            const active = config.currentPhase === phase;
            return (
              <button
                key={phase}
                type="button"
                onClick={() => handlePhaseChange(phase)}
                className={`text-left rounded-xl border p-4 transition-all ${
                  active
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/15'
                    : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold text-zinc-500">
                    PHASE {meta.stepNum}
                  </span>
                  {active && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-700">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          phase === 'VOTING_LIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-600'
                        }`}
                      />
                      Active
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm font-extrabold text-zinc-950">{meta.label}</p>
                <p className="mt-1 text-[11px] text-zinc-500 leading-relaxed">{meta.shortLabel}</p>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-zinc-100">
          {/* Live Results Public Toggle */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-zinc-900">Public Live Results</p>
              <p className="text-[11px] text-zinc-500">
                {config.liveResultsPublic
                  ? 'Visible to all students on Results tab.'
                  : 'Embargoed (Admin preview only).'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleResults}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold border transition-colors shrink-0 ${
                config.liveResultsPublic
                  ? 'border-emerald-200 bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              {config.liveResultsPublic ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  Public
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  Hidden
                </>
              )}
            </button>
          </div>

          {/* Registered Voters Override */}
          <form
            onSubmit={handleSaveVoters}
            className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 flex items-center justify-between gap-2.5"
          >
            <div className="min-w-0 flex-1">
              <label className="block text-xs font-bold text-zinc-900">
                Eligible Voter Denom.
              </label>
              <p className="text-[11px] text-zinc-500">C5 + C6 + C7 total</p>
            </div>
            <input
              type="number"
              min={1}
              max={5000}
              value={votersDraft}
              onChange={(e) => setVotersDraft(e.target.value)}
              className="w-20 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-zinc-950"
            />
            <button
              type="submit"
              className="rounded-lg bg-zinc-950 hover:bg-zinc-800 px-3 py-1.5 text-xs font-bold text-white"
            >
              Save
            </button>
          </form>

          {/* Lab Booth 4-Digit PIN Setter */}
          <form
            onSubmit={handleSavePin}
            className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 flex items-center justify-between gap-2.5"
          >
            <div className="min-w-0 flex-1">
              <label className="block text-xs font-bold text-zinc-900">Lab Booth 4-Digit PIN</label>
              <p className="text-[11px] text-zinc-500">Required to unlock kiosk</p>
            </div>
            <div className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                pattern="\d{4}"
                value={pinDraft}
                onChange={(e) => setPinDraft(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-16 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-zinc-950 text-center"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-zinc-950 hover:bg-zinc-800 px-3 py-1.5 text-xs font-bold text-white"
            >
              Update
            </button>
          </form>

          {/* Interview Shortlist Cutoff (Undecided / Top 8 / Top 13 / Custom) */}
          <form
            onSubmit={handleSaveCustomCutoff}
            className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <label className="block text-xs font-bold text-zinc-900">
                Interview Shortlist Cutoff
              </label>
              <span className="font-mono text-[10px] font-bold text-emerald-700">
                {config.topAdvancingCount ? `Top ${config.topAdvancingCount}` : 'Undecided'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleSetCutoff(null)}
                className={`rounded-lg px-2 py-1 text-[10px] font-bold border transition-colors ${
                  !config.topAdvancingCount
                    ? 'border-emerald-300 bg-emerald-600 text-white'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                Show All
              </button>
              <button
                type="button"
                onClick={() => handleSetCutoff(8)}
                className={`rounded-lg px-2 py-1 text-[10px] font-bold border transition-colors ${
                  config.topAdvancingCount === 8
                    ? 'border-emerald-300 bg-emerald-600 text-white'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                Top 8
              </button>
              <button
                type="button"
                onClick={() => handleSetCutoff(13)}
                className={`rounded-lg px-2 py-1 text-[10px] font-bold border transition-colors ${
                  config.topAdvancingCount === 13
                    ? 'border-emerald-300 bg-emerald-600 text-white'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                Top 13
              </button>
              <input
                type="number"
                min={1}
                max={100}
                placeholder="Custom"
                value={cutoffDraft}
                onChange={(e) => setCutoffDraft(e.target.value)}
                className="w-14 rounded-lg border border-zinc-200 bg-white px-2 py-1 font-mono text-[11px] font-bold text-zinc-950 text-center"
              />
              <button
                type="submit"
                className="rounded-lg bg-zinc-950 hover:bg-zinc-800 px-2.5 py-1 text-[10px] font-bold text-white"
              >
                Set
              </button>
            </div>
          </form>
        </div>

        {/* Voting Date & Polling Window Schedule */}
        <form
          onSubmit={handleSaveSchedule}
          className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 flex flex-col lg:flex-row lg:items-end justify-between gap-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
            <div>
              <label className="block text-xs font-bold text-zinc-900 mb-1">
                Voting Date Display
              </label>
              <input
                type="text"
                required
                value={dateDraft}
                onChange={(e) => setDateDraft(e.target.value)}
                placeholder="Sunday, November 29, 2026"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-950"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-900 mb-1">
                Polling Hours Window
              </label>
              <input
                type="text"
                required
                value={windowDraft}
                onChange={(e) => setWindowDraft(e.target.value)}
                placeholder="09:30 AM - 05:30 PM"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-950"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {config.votingDateDisplay !== 'Sunday, November 29, 2026' && (
              <button
                type="button"
                onClick={handleQuickSyncSundayDate}
                className="rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-900"
              >
                Sync to Sunday, Nov 29
              </button>
            )}
            <button
              type="submit"
              className="rounded-lg bg-zinc-950 hover:bg-zinc-800 px-3.5 py-1.5 text-xs font-bold text-white"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </section>

      {/* 2. Physical Lab Voting Booth Check-In Station */}
      <section className="relative rounded-2xl border border-zinc-200 bg-white p-6 overflow-hidden space-y-5">
        <CardPatternBg variant="iso-waves" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              <Monitor className="w-3.5 h-3.5" />
              Physical Lab Booth Check-In
            </div>
            <h2 className="mt-1.5 text-base font-extrabold text-zinc-950">
              2. Check In Student for Locked In-Person Ballot
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Verifies walk-in SCI students (C5/C6/C7), blocks cross-channel double votes, and locks
              the station until unlocked by the 4-digit Admin PIN.
            </p>
          </div>
          {config.currentPhase !== 'VOTING_LIVE' && (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 shrink-0">
              Switch to Voting Live phase to launch
            </span>
          )}
        </div>

        <form onSubmit={handleStartLabBooth} className="relative z-10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Student ID (Optional for New C7)
              </label>
              <input
                type="text"
                value={labStudentId}
                onChange={(e) => handleLabStudentIdChange(e.target.value)}
                placeholder="e.g. AIU24102323"
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-mono text-zinc-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={labFullName}
                onChange={(e) => setLabFullName(e.target.value)}
                placeholder="Full name as on AIU record"
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Cohort (Voting Eligible Only) <span className="text-red-500">*</span>
              </label>
              <select
                value={labCohort}
                onChange={(e) => setLabCohort(e.target.value as VotingCohortCode)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="C7">Cohort 7 (Year 1 / Freshmen)</option>
                <option value="C6">Cohort 6 (Year 2)</option>
                <option value="C5">Cohort 5 (Year 3)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Program of Study <span className="text-red-500">*</span>
              </label>
              <select
                value={labProgram}
                onChange={(e) => setLabProgram(e.target.value as ProgramOfStudy)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {SCI_PROGRAMS.map((prog) => (
                  <option key={prog} value={prog}>
                    {prog}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Nationality <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={labCountry}
                onChange={(e) => setLabCountry(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                AIU Email (Optional)
              </label>
              <input
                type="email"
                value={labEmail}
                onChange={(e) => setLabEmail(e.target.value)}
                placeholder="name@student.aiu.edu.my"
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {labLookupNote && (
            <div
              className={`rounded-xl border px-3.5 py-2 text-xs font-medium ${
                labLookupNote.type === 'warning'
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-800'
              }`}
            >
              {labLookupNote.text}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-[11px] text-zinc-500">
              Ballot choices remain strictly secret; only voter check-in and officer authorization
              are logged.
            </p>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white transition-colors"
            >
              <Vote className="w-4 h-4" />
              Start Student Ballot
            </button>
          </div>
        </form>
      </section>

      {/* 3. Pending Nominations Queue */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-zinc-950">
              3. Pending Nomination Verification Queue ({pendingCandidates.length})
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Approving adds verified nominees to the official election ballot.
            </p>
          </div>
        </div>

        {pendingCandidates.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-6 text-center text-xs text-zinc-500">
            No pending self-nominations awaiting approval.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingCandidates.map((cand) => (
              <div
                key={cand.id}
                className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 flex flex-col justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={cand.photoUrl}
                    alt={cand.fullName}
                    className="w-14 h-14 rounded-xl object-cover border border-zinc-200 bg-white shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-extrabold text-zinc-950">{cand.fullName}</h3>
                      <span className="font-mono text-[10px] font-bold rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-zinc-600">
                        {cand.studentId}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                      {cand.cohort} / {shortProgramLabel(cand.program)} / {cand.country}
                    </p>
                    <p className="text-[11px] font-mono text-zinc-500 truncate">{cand.email}</p>
                    <p className="mt-2 text-xs text-zinc-600 line-clamp-3 leading-relaxed">
                      {cand.manifesto}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200">
                  <button
                    type="button"
                    disabled={isProfileLocked}
                    onClick={() => handleApproveReject(cand.id, 'rejected')}
                    className="rounded-lg border border-red-200 bg-white hover:bg-red-50 disabled:opacity-45 px-3 py-1.5 text-xs font-bold text-red-600"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    disabled={isProfileLocked}
                    onClick={() => handleApproveReject(cand.id, 'approved')}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-45 px-3.5 py-1.5 text-xs font-bold text-white"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve Candidate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Approved Contestants, Vote Tally & Top 4 Role Appointments */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-zinc-950">
              4. Approved Slate, Vote Tally &amp; Top 4 Appointments
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {config.topAdvancingCount
                ? `Top ${config.topAdvancingCount} advance to interviews; committee appoints the final Top 4 roles after Election Ended.`
                : 'Shortlist cutoff is Undecided (Dean decides Top 8 or Top 13 after voting); committee appoints Top 4 roles after interviews.'}
            </p>
          </div>
          {rejectedCandidates.length > 0 && (
            <button
              type="button"
              onClick={() => setShowRejected((v) => !v)}
              className="rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700 shrink-0"
            >
              {showRejected ? 'Hide' : 'Show'} Rejected ({rejectedCandidates.length})
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <th className="py-2.5 pr-3">Rank</th>
                <th className="py-2.5 px-3">Contestant</th>
                <th className="py-2.5 px-3">Cohort / Program</th>
                <th className="py-2.5 px-3 text-right">Votes</th>
                <th className="py-2.5 px-3">
                  {config.topAdvancingCount
                    ? `Top 4 Role (Top ${config.topAdvancingCount})`
                    : 'Top 4 Role'}
                </th>
                <th className="py-2.5 pl-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {rankedCandidates.map((cand, index) => {
                const rank = index + 1;
                const hasCutoff = Boolean(config.topAdvancingCount && config.topAdvancingCount > 0);
                const isAdvancing = !hasCutoff || rank <= (config.topAdvancingCount ?? 0);
                return (
                  <tr
                    key={cand.id}
                    className={isAdvancing ? 'bg-white' : 'bg-zinc-50/40 text-zinc-500'}
                  >
                    <td className="py-3 pr-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[11px] font-bold ${
                          isAdvancing
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                            : 'bg-zinc-100 border border-zinc-200 text-zinc-500'
                        }`}
                      >
                        #{rank}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3 min-w-[210px]">
                        <img
                          src={cand.photoUrl}
                          alt={cand.fullName}
                          className="w-10 h-10 rounded-lg object-cover border border-zinc-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-zinc-950 truncate">{cand.fullName}</p>
                          <p className="text-[11px] text-zinc-500 truncate">
                            #{String(cand.candidateNumber).padStart(2, '0')} / {cand.country}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <p className="font-semibold text-zinc-800">{cand.cohort}</p>
                      <p className="text-[11px] text-zinc-500">{shortProgramLabel(cand.program)}</p>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-extrabold text-zinc-950 whitespace-nowrap">
                      {cand.votes}
                    </td>
                    <td className="py-3 px-3">
                      {isAdvancing ? (
                        <div className="flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <select
                            aria-label={`Assign role for ${cand.fullName}`}
                            value={cand.appointedRole ?? ''}
                            onChange={(e) => handleAssignRole(cand.id, e.target.value)}
                            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="">
                              {hasCutoff
                                ? `Top ${config.topAdvancingCount} Advancing`
                                : 'Shortlist Eligible'}
                            </option>
                            {TOP_COMMITTEE_ROLES.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-400">
                          Outside Top {config.topAdvancingCount}
                        </span>
                      )}
                    </td>
                    <td className="py-3 pl-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={isProfileLocked}
                          title={
                            isProfileLocked
                              ? 'Profile editing locked in Phases 3-4'
                              : 'Edit candidate details'
                          }
                          onClick={() => setEditingCandidate(cand)}
                          className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-40 px-2.5 py-1 text-[11px] font-semibold text-zinc-700"
                        >
                          {isProfileLocked ? (
                            <Lock className="w-3 h-3" />
                          ) : (
                            <Edit3 className="w-3 h-3" />
                          )}
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={isProfileLocked}
                          title={
                            isProfileLocked
                              ? 'Candidate removal locked in Phases 3-4'
                              : 'Remove candidate'
                          }
                          onClick={() => handleDeleteCandidate(cand)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white hover:bg-red-50 disabled:opacity-40 px-2 py-1 text-[11px] font-semibold text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {showRejected && rejectedCandidates.length > 0 && (
          <div className="pt-4 border-t border-zinc-100 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Rejected Applications
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rejectedCandidates.map((cand) => (
                <div
                  key={cand.id}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-zinc-900 truncate">{cand.fullName}</p>
                    <p className="text-[11px] text-zinc-500 font-mono">{cand.studentId}</p>
                  </div>
                  <button
                    type="button"
                    disabled={isProfileLocked}
                    onClick={() => handleApproveReject(cand.id, 'approved')}
                    className="rounded-lg border border-emerald-200 bg-white hover:bg-emerald-50 disabled:opacity-45 px-2.5 py-1 text-[11px] font-bold text-emerald-700"
                  >
                    Restore &amp; Approve
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 5. Cohort 4 Visits Tracker + Admin Team Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cohort 4 Senior Visits Tracker */}
        <section className="relative rounded-2xl border border-zinc-200 bg-white p-6 overflow-hidden space-y-4">
          <CardPatternBg variant="honor-crest" />
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-zinc-950">
                5. Cohort 4 Graduating Seniors Visited
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Tracks Cohort 4 seniors who signed in to view the Honor Tribute ({dbState.c4Visits.length}{' '}
                of {C4_SENIOR_COUNT}).
              </p>
            </div>
            {mode === 'demo' && (
              <button
                type="button"
                onClick={() => {
                  simulateC4Visit();
                  showFeedback(true, 'Simulated Cohort 4 senior sign-in recorded.');
                }}
                className="rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 text-[11px] font-bold text-emerald-800 shrink-0"
              >
                Simulate C4 Visit
              </button>
            )}
          </div>

          <div className="relative z-10 max-h-64 overflow-y-auto divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white/90">
            {dbState.c4Visits.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500">
                No Cohort 4 senior sign-ins recorded yet.
              </div>
            ) : (
              dbState.c4Visits.map((visit) => (
                <div key={visit.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-zinc-950 truncate">{visit.fullName}</p>
                    <p className="text-[11px] text-zinc-500 font-mono truncate">
                      {visit.studentId} / {shortProgramLabel(visit.program)}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400 shrink-0">
                    {formatAuditTime(visit.timestamp)}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Admin Team Emails Manager */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-zinc-950">
                6. Authorized Election Admin Team
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Any officer email listed here automatically receives Admin access upon Google
                sign-in.
              </p>
            </div>
            <Users className="w-4 h-4 text-zinc-400 shrink-0 mt-1" />
          </div>

          <form onSubmit={handleAddAdminEmail} className="flex items-center gap-2">
            <input
              type="email"
              required
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="committee.member@student.aiu.edu.my"
              className="flex-1 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 px-3.5 py-2 text-xs font-bold text-white shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add Officer
            </button>
          </form>

          <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200">
            {config.adminEmails.map((email) => {
              const isPrimary = email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase();
              return (
                <div key={email} className="px-4 py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-zinc-900 truncate">
                      {email}
                    </span>
                    {isPrimary && (
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        Primary Admin
                      </span>
                    )}
                  </div>
                  {!isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAdminEmail(email)}
                      className="text-xs font-semibold text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 7. Registered Users Directory & Profile Editor */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-zinc-950">
              7. Registered Users Directory &amp; Editor ({registeredUsers.length})
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Fix student profile details (such as Nationality or Student ID) or promote Admins
              instantly. Voting status is permanently read-only.
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search name, ID, nationality..."
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-8 pr-3 py-1.5 text-xs text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto max-h-80 overflow-y-auto rounded-xl border border-zinc-200">
          {registeredUsers.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-500">
              No matching verified user profiles found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Cohort / Program</th>
                  <th className="py-2.5 px-3">Nationality</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Ballot Status (Locked)</th>
                  <th className="py-2.5 px-3 text-right">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {registeredUsers.map((u) => (
                  <tr key={u.uid} className="hover:bg-zinc-50/60">
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-zinc-950">{u.fullName}</p>
                      <p className="text-[11px] font-mono text-zinc-500">
                        {u.studentId} / {u.email}
                      </p>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-zinc-800">{u.cohort}</span>{' '}
                      <span className="text-zinc-500">/ {shortProgramLabel(u.program)}</span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap font-medium text-zinc-800">
                      {u.country}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                          u.role === 'admin'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-zinc-200 bg-white text-zinc-600'
                        }`}
                      >
                        {u.role === 'admin' ? 'Admin' : 'Voter'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {u.hasVoted ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-700">
                          <Lock className="w-3 h-3" />
                          Voted ({u.votingChannel || 'recorded'})
                        </span>
                      ) : (
                        <span className="text-[11px] text-zinc-400">Not Voted</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openUserEditor(u)}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-700"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* 8. Immutable Security & Election Audit Log */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-500" />
            <div>
              <h2 className="text-base font-extrabold text-zinc-950">
                8. Security &amp; Operations Audit Log ({filteredLogs.length})
              </h2>
              <p className="text-xs text-zinc-500">
                Logs identity spoof blocks, Lab Booth authorizations, and phase changes. Zero ballot
                choices are ever recorded.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 p-1">
            {(['all', 'security', 'booth'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setAuditFilter(tab)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold capitalize transition-colors ${
                  auditFilter === tab
                    ? 'bg-white text-zinc-950 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto divide-y divide-zinc-100 rounded-xl border border-zinc-200">
          {filteredLogs.map((log) => {
            const isSecurityAlert = log.action.startsWith('SECURITY_');
            return (
              <div
                key={log.id}
                className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`font-mono text-[10px] font-bold rounded px-1.5 py-0.5 border ${
                        isSecurityAlert
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-700'
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="font-semibold text-zinc-900">{log.actorName}</span>
                    <span className="font-mono text-[11px] text-zinc-400 truncate">
                      {log.actorEmail}
                    </span>
                  </div>
                  <p className="text-zinc-600 leading-relaxed">{log.details}</p>
                </div>
                <span className="font-mono text-[10px] text-zinc-400 shrink-0">
                  {formatAuditTime(log.timestamp)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modals */}
      <CandidateApplicationModal
        open={addCandidateOpen}
        onClose={() => setAddCandidateOpen(false)}
        defaultStatus="approved"
        adminAddMode
      />
      <CandidateApplicationModal
        open={Boolean(editingCandidate)}
        onClose={() => setEditingCandidate(null)}
        editCandidate={editingCandidate}
      />

      {/* Admin Registered User Editor Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-zinc-950/45 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden my-8">
            <div className="px-5 py-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Admin User Profile Editor
                </p>
                <h3 className="text-sm font-extrabold text-zinc-950 truncate">
                  {editingUser.email}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                aria-label="Close user edit modal"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="p-5 space-y-4 text-xs">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 flex items-center gap-2.5 text-zinc-600">
                <Lock className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>
                  Ballot status (
                  <strong className="text-zinc-900">
                    {editingUser.hasVoted ? 'Voted' : 'Not Voted'}
                  </strong>
                  ) is permanently read-only and cannot be modified by Admins.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editUserName}
                    onChange={(e) => setEditUserName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Student ID {editingUser.hasVoted && '(Locked After Vote)'}
                  </label>
                  <input
                    type="text"
                    required
                    disabled={editingUser.hasVoted}
                    value={editUserId}
                    onChange={(e) => setEditUserId(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-mono uppercase text-zinc-950 disabled:bg-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Cohort
                  </label>
                  <select
                    value={editUserCohort}
                    onChange={(e) => setEditUserCohort(e.target.value as VotingCohortCode)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-950"
                  >
                    <option value="C7">Cohort 7 (Year 1)</option>
                    <option value="C6">Cohort 6 (Year 2)</option>
                    <option value="C5">Cohort 5 (Year 3)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Year of Study
                  </label>
                  <select
                    value={editUserYear}
                    onChange={(e) => setEditUserYear(Number(e.target.value) as 1 | 2 | 3)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-950"
                  >
                    <option value={1}>Year 1</option>
                    <option value={2}>Year 2</option>
                    <option value={3}>Year 3</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Program of Study
                  </label>
                  <select
                    value={editUserProgram}
                    onChange={(e) => setEditUserProgram(e.target.value as ProgramOfStudy)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-950"
                  >
                    {SCI_PROGRAMS.map((prog) => (
                      <option key={prog} value={prog}>
                        {prog}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Nationality
                  </label>
                  <select
                    required
                    value={editUserCountry}
                    onChange={(e) => setEditUserCountry(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-950"
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

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Account Role
                  </label>
                  <select
                    disabled={editingUser.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()}
                    value={editUserRole}
                    onChange={(e) => setEditUserRole(e.target.value as UserRole)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-950 disabled:bg-zinc-100"
                  >
                    <option value="voter">Verified Voter</option>
                    <option value="admin">Election Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {savingUser ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
