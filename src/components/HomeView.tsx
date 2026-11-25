import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Lock,
  Trophy,
  UserCog,
  UserPlus,
  Users,
  Vote,
} from 'lucide-react';
import {
  isOfficialShortlistedNominee,
  OFFICIAL_SHORTLISTED_NOMINEE_IDS,
  PHASE_META,
  PHASE_ORDER,
} from '../data/seedData';
import { useElection } from '../services/electionContext';
import { CardPatternBg } from './CardPatternBg';

export const HomeView: React.FC = () => {
  const {
    dbState,
    currentUser,
    myCandidateProfile,
    approvedCandidates,
    isAdmin,
    isProfileLocked,
    navigateProtected,
    openApplicationModal,
    openProfileEditModal,
    updateElectionPhase,
  } = useElection();

  const [phaseMsg, setPhaseMsg] = useState<string | null>(null);

  const { config } = dbState;
  const phaseMeta = PHASE_META[config.currentPhase];
  const approvedCount = approvedCandidates.length;
  const totalShortlisted = OFFICIAL_SHORTLISTED_NOMINEE_IDS.length;
  const isUserShortlisted = currentUser
    ? isOfficialShortlistedNominee(currentUser.studentId)
    : true;
  const turnoutPct =
    config.totalRegisteredVoters > 0
      ? ((config.totalBallotsCast / config.totalRegisteredVoters) * 100).toFixed(1)
      : '0.0';

  const isVotingLive = config.currentPhase === 'VOTING_LIVE';
  const canApply = !isProfileLocked && isUserShortlisted;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-24 sm:pb-12 space-y-10">
      {/* Minimal Hero with Glowing Status Dot */}
      <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white px-6 py-9 sm:py-11 text-center shadow-card">
        <CardPatternBg variant="grid-nodes" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700">
            <span className={`status-dot ${isVotingLive ? 'live' : 'off'}`} />
            <span>
              {phaseMeta.label} - {config.votingDateDisplay}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950 leading-[1.1]">
            {config.title}
          </h1>

          <p className="text-sm sm:text-base text-zinc-500 max-w-xl mx-auto leading-relaxed">
            {config.subtitle}
          </p>

          {currentUser && (
            <div className="inline-flex items-center gap-2 pt-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Signed in as {currentUser.fullName} ({currentUser.studentId} | {currentUser.cohort})
              </span>
            </div>
          )}
        </div>
      </section>

      {/* 3 Quick Action Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Quick Actions
          </h2>
          <span className="text-xs text-zinc-400">
            School of Computing and Informatics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Vote Now */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 hover:border-emerald-300 hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-5 shadow-card">
            <CardPatternBg variant="grid-nodes" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-center text-emerald-600">
                  <Vote className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-[11px] font-bold text-zinc-700">
                  <span className={`status-dot ${isVotingLive ? 'live' : 'off'}`} />
                  {currentUser?.hasVoted ? 'Submitted' : isVotingLive ? 'Live' : 'Closed'}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-950">Vote Now</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  {currentUser?.hasVoted
                    ? `Your secret ballot is recorded (Receipt ${currentUser.receiptCode}).`
                    : isVotingLive
                      ? `Select 1 to ${config.maxVotesPerBallot} approved contestants on your verified student ballot.`
                      : `Voting runs ${config.votingDateDisplay} (${config.votingWindowDisplay}).`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigateProtected('vote')}
              className="relative z-10 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              <span>
                {!currentUser
                  ? 'Sign In to Vote'
                  : currentUser.hasVoted
                    ? 'View Voter Receipt'
                    : 'Open Ballot'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Become a Candidate / My Candidate Profile */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 hover:border-emerald-300 hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-5 shadow-card">
            <CardPatternBg variant="grid-nodes" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-center text-emerald-600">
                  {myCandidateProfile ? (
                    <UserCog className="w-5 h-5" />
                  ) : (
                    <UserPlus className="w-5 h-5" />
                  )}
                </div>
                <span className="font-mono text-[11px] font-semibold px-2.5 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-zinc-600">
                  {approvedCount} / {Math.max(totalShortlisted, approvedCount)}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-950">
                  {myCandidateProfile ? 'Candidate Profile' : 'Become a Candidate'}
                </h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  {myCandidateProfile?.status === 'approved'
                    ? isProfileLocked
                      ? 'Your candidate profile is verified and locked during Voting Live.'
                      : 'Your application is approved. Update your photo or manifesto before voting starts.'
                    : myCandidateProfile?.status === 'pending'
                      ? 'Your application is pending Admin verification against the official shortlist.'
                      : isProfileLocked
                        ? 'Nominations and profile edits are locked once Voting Live begins.'
                        : currentUser && !isUserShortlisted
                          ? 'Restricted to the 26 officially announced SCI Committee nominees.'
                          : `Open for the ${totalShortlisted} officially shortlisted SCI nominees to submit their profile.`}
                </p>
              </div>
            </div>
            {myCandidateProfile?.status === 'approved' ? (
              <button
                type="button"
                onClick={() =>
                  isProfileLocked ? navigateProtected('profile') : openProfileEditModal()
                }
                className="relative z-10 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                {isProfileLocked && <Lock className="w-3.5 h-3.5" />}
                <span>{isProfileLocked ? 'View Locked Profile' : 'Edit My Profile'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={Boolean(currentUser && !canApply && !myCandidateProfile)}
                onClick={() => openApplicationModal()}
                className="relative z-10 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 disabled:text-zinc-400"
              >
                <span>
                  {!currentUser
                    ? 'Sign In to Apply'
                    : myCandidateProfile
                      ? 'Application Pending Review'
                      : isProfileLocked
                        ? 'Applications Locked'
                        : !isUserShortlisted
                          ? 'Shortlisted Nominees Only'
                          : 'Apply as Candidate'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Card 3: Live Results */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 hover:border-emerald-300 hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-5 shadow-card">
            <CardPatternBg variant="grid-nodes" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-center text-emerald-600">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-[11px] font-bold text-zinc-700">
                  {config.liveResultsPublic ? 'Public' : 'Restricted'}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-950">Live Results</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  {config.topAdvancingCount
                    ? `Real-time public vote standings for all approved contestants. Top ${config.topAdvancingCount} advance to panel interviews.`
                    : 'Real-time public vote standings for all approved contestants. Shortlisted top candidates advance to Dean & Management Panel interviews.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigateProtected('results')}
              className="relative z-10 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              <span>View Rankings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3 Minimal Live Election Data Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Live Election Data
          </h2>
          <span className="text-xs text-zinc-400">
            Auto-synced from Cohort 5-7 rosters
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 flex items-center justify-between shadow-card">
            <CardPatternBg variant="iso-waves" />
            <div className="relative z-10">
              <div className="font-mono text-3xl font-bold tracking-tight text-zinc-950">
                {config.totalRegisteredVoters}
              </div>
              <div className="text-xs font-bold text-zinc-700 mt-1">Registered Voters</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Eligible SCI students (C5-C7)</div>
            </div>
            <div className="relative z-10 w-10 h-10 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-center text-emerald-600 shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 flex items-center justify-between shadow-card">
            <CardPatternBg variant="iso-waves" />
            <div className="relative z-10">
              <div className="font-mono text-3xl font-bold tracking-tight text-zinc-950">
                {approvedCount}
              </div>
              <div className="text-xs font-bold text-zinc-700 mt-1">Active Candidates</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Approved for 26/27 ballot</div>
            </div>
            <div className="relative z-10 w-10 h-10 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-center text-emerald-600 shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 flex items-center justify-between shadow-card">
            <CardPatternBg variant="iso-waves" />
            <div className="relative z-10">
              <div className="font-mono text-3xl font-bold tracking-tight text-zinc-950">
                {turnoutPct}%
              </div>
              <div className="text-xs font-bold text-zinc-700 mt-1">Voter Turnout</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                {config.totalBallotsCast} ballots cast
              </div>
            </div>
            <div className="relative z-10 w-10 h-10 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-center text-emerald-600 shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Minimal 4-Step Phase Bar */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Election Phase
          </h2>
          <span className="text-xs text-zinc-400">
            {isAdmin ? 'Admin: click a step to switch active phase' : 'Read-only live phase'}
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 grid grid-cols-2 md:grid-cols-4 gap-3 shadow-card">
          {PHASE_ORDER.map((phaseKey) => {
            const meta = PHASE_META[phaseKey];
            const active = config.currentPhase === phaseKey;
            const clickable = isAdmin;

            return (
              <button
                key={phaseKey}
                type="button"
                disabled={!clickable}
                onClick={async () => {
                  if (!clickable) return;
                  const res = await updateElectionPhase(phaseKey);
                  setPhaseMsg(res.message);
                  setTimeout(() => setPhaseMsg(null), 3000);
                }}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  active
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-zinc-50/70 border-zinc-200'
                } ${clickable ? 'hover:border-emerald-300 cursor-pointer' : 'cursor-default'}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-[11px] font-bold ${
                      active ? 'text-emerald-700' : 'text-zinc-400'
                    }`}
                  >
                    {meta.stepNum}
                  </span>
                  {active && (
                    <span
                      className={`status-dot ${phaseKey === 'VOTING_LIVE' ? 'live' : 'off'}`}
                    />
                  )}
                </div>
                <div className="text-xs sm:text-sm font-bold text-zinc-950 mt-1">
                  {meta.label}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">{meta.note}</div>
              </button>
            );
          })}
        </div>

        {phaseMsg && (
          <div className="text-xs font-semibold text-emerald-700 text-right">{phaseMsg}</div>
        )}
      </section>
    </div>
  );
};
