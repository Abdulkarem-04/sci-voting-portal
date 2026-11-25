import React, { useMemo } from 'react';
import { Award, Crown, Lock } from 'lucide-react';
import { PHASE_META } from '../data/seedData';
import { useElection } from '../services/electionContext';
import { shortProgramLabel } from '../utils/imageUtils';
import { CardPatternBg } from './CardPatternBg';

export const ResultsView: React.FC = () => {
  const { dbState, rankedCandidates, isAdmin } = useElection();
  const { config } = dbState;

  const turnoutPct =
    config.totalRegisteredVoters > 0
      ? ((config.totalBallotsCast / config.totalRegisteredVoters) * 100).toFixed(1)
      : '0.0';

  const appointedLeaders = useMemo(
    () => rankedCandidates.filter((c) => Boolean(c.appointedRole)),
    [rankedCandidates]
  );

  const isRestricted = !config.liveResultsPublic && !isAdmin;

  if (isRestricted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="relative overflow-hidden bg-white rounded-2xl p-10 border border-zinc-200 shadow-card text-center space-y-4">
          <CardPatternBg variant="grid-nodes" />
          <div className="relative z-10 w-12 h-12 mx-auto rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-500">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="relative z-10 text-xl font-extrabold text-zinc-950">
            Live Results Temporarily Withheld
          </h1>
          <p className="relative z-10 text-sm text-zinc-500 max-w-md mx-auto">
            The Election Committee has temporarily restricted public results visibility while tallies
            are verified.
          </p>
        </div>
      </div>
    );
  }

  const phaseMeta = PHASE_META[config.currentPhase];
  const isVotingLive = config.currentPhase === 'VOTING_LIVE';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-24 sm:pb-12 space-y-6">
      {!config.liveResultsPublic && isAdmin && (
        <div className="rounded-xl bg-zinc-950 text-zinc-200 px-4 py-3 text-xs font-semibold flex items-center gap-2 no-print">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Admin Preview: Public Live Results visibility is currently turned OFF for visitors.
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-zinc-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <span className={`status-dot ${isVotingLive ? 'live' : 'off'}`} />
            <span>{phaseMeta.label}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
            Live Election Standings
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-zinc-700 font-semibold">
            Ballots: {config.totalBallotsCast} ({turnoutPct}%)
          </span>
          <span className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-zinc-700 font-semibold">
            Contestants: {rankedCandidates.length}
          </span>
        </div>
      </div>

      {/* Post-Interview Appointed Top Committee (when assigned in Admin) */}
      {appointedLeaders.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-white p-6 shadow-card">
          <CardPatternBg variant="honor-crest" />
          <div className="relative z-10">
            <h2 className="text-sm font-extrabold text-zinc-950 flex items-center gap-2 mb-4">
              <Crown className="w-4 h-4 text-emerald-600" />
              <span>Appointed 2026/2027 SCI Top Committee</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {appointedLeaders.map((leader) => (
                <div
                  key={leader.id}
                  className="bg-zinc-50 rounded-xl p-3.5 border border-zinc-200 flex items-center gap-3"
                >
                  <img
                    src={leader.photoUrl}
                    alt={leader.fullName}
                    className="w-12 h-12 rounded-xl object-cover border border-zinc-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase">
                      {leader.appointedRole}
                    </span>
                    <div className="text-xs font-bold text-zinc-950 mt-1 truncate">
                      {leader.fullName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Candidate Standings List (No bottom progress bar, larger photo, in-card SVG design, dynamic Dean cutoff) */}
      <div className="space-y-3">
        {rankedCandidates.map((cand, idx) => {
          const rank = idx + 1;
          const hasCutoff = Boolean(config.topAdvancingCount && config.topAdvancingCount > 0);
          const isShortlist = !hasCutoff || rank <= (config.topAdvancingCount ?? 0);

          return (
            <div
              key={cand.id}
              className={`relative overflow-hidden rounded-2xl px-4 sm:px-5 py-4 border transition-all flex items-center justify-between gap-4 ${
                isShortlist
                  ? 'bg-white border-zinc-200 shadow-card'
                  : 'bg-zinc-50/80 border-zinc-200/80 opacity-45'
              }`}
            >
              <CardPatternBg variant="iso-waves" />

              <div className="relative z-10 flex items-center gap-3.5 sm:gap-4 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 font-mono text-sm font-bold ${
                    isShortlist
                      ? 'border-zinc-200 bg-zinc-50 text-zinc-950'
                      : 'border-zinc-200 bg-zinc-100 text-zinc-500'
                  }`}
                >
                  #{rank}
                </div>

                <img
                  src={cand.photoUrl}
                  alt={cand.fullName}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-zinc-200 shrink-0 shadow-sm"
                />

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-950 truncate">
                      {cand.fullName}
                    </h3>
                    {cand.appointedRole && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase">
                        <Award className="w-3 h-3" />
                        {cand.appointedRole}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5 truncate">
                    {shortProgramLabel(cand.program)} - {cand.country}
                  </div>
                </div>
              </div>

              <div className="relative z-10 text-right shrink-0">
                <div className="font-mono text-xl sm:text-2xl font-extrabold text-zinc-950 leading-none">
                  {cand.votes}
                </div>
                <div className="text-[11px] font-medium text-zinc-500 mt-1">votes</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
