import React, { useMemo, useState } from 'react';
import {
  FileText,
  Globe,
  GraduationCap,
  Mail,
  Search,
  UserCog,
  UserPlus,
  Users,
  Vote,
  X,
} from 'lucide-react';
import { isOfficialShortlistedNominee, SCI_PROGRAMS } from '../data/seedData';
import { useElection } from '../services/electionContext';
import { Candidate, ProgramOfStudy } from '../types/election';
import { shortProgramLabel } from '../utils/imageUtils';
import { CardPatternBg } from './CardPatternBg';

export const CandidatesView: React.FC = () => {
  const {
    dbState,
    approvedCandidates,
    currentUser,
    myCandidateProfile,
    isProfileLocked,
    navigateProtected,
    openApplicationModal,
    openProfileEditModal,
  } = useElection();

  const [query, setQuery] = useState('');
  const [programFilter, setProgramFilter] = useState<'ALL' | ProgramOfStudy>('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return approvedCandidates.filter((cand) => {
      const matchesProg = programFilter === 'ALL' || cand.program === programFilter;
      const matchesQuery =
        !q ||
        cand.fullName.toLowerCase().includes(q) ||
        cand.email.toLowerCase().includes(q) ||
        cand.country.toLowerCase().includes(q) ||
        cand.manifesto.toLowerCase().includes(q);
      return matchesProg && matchesQuery;
    });
  }, [approvedCandidates, programFilter, query]);

  const isVotingLive = dbState.config.currentPhase === 'VOTING_LIVE';
  const canSelfApply =
    !isProfileLocked &&
    (!currentUser || (isOfficialShortlistedNominee(currentUser.studentId) && !myCandidateProfile));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-24 sm:pb-12 space-y-7">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-white text-xs font-semibold text-zinc-600 font-mono">
          <Users className="w-3.5 h-3.5 text-emerald-600" />
          <span>{approvedCandidates.length} Official Contestants</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          All Candidates
        </h1>
        <p className="text-sm text-zinc-500">
          Verified students running for the 2026/2027 SCI Top Committee.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {canSelfApply && (
            <button
              type="button"
              onClick={openApplicationModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:border-emerald-300 text-xs font-bold text-zinc-900 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Become a Candidate</span>
            </button>
          )}

          {isVotingLive && (!currentUser || !currentUser.hasVoted) && (
            <button
              type="button"
              onClick={() => navigateProtected('vote')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              <Vote className="w-3.5 h-3.5" />
              <span>Proceed to Ballot</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-card flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, country, email, or manifesto..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setProgramFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              programFilter === 'ALL'
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
            }`}
          >
            All Programmes
          </button>
          {SCI_PROGRAMS.map((prog) => (
            <button
              key={prog}
              type="button"
              onClick={() => setProgramFilter(prog)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                programFilter === prog
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
              }`}
            >
              {shortProgramLabel(prog)}
            </button>
          ))}
        </div>
      </div>

      {/* Strictly 6 Candidate Fields Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-zinc-200 text-center">
          <Users className="w-10 h-10 mx-auto text-zinc-400 mb-3" />
          <h3 className="text-base font-bold text-zinc-950">No matching candidates found</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Try clearing the programme filter or searching another keyword.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cand) => {
            const isSelf =
              currentUser &&
              currentUser.studentId.toUpperCase() === cand.studentId.toUpperCase();
            return (
              <article
                key={cand.id}
                className={`relative overflow-hidden rounded-2xl p-6 border shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between bg-white ${
                  isSelf ? 'border-emerald-400 ring-1 ring-emerald-400/50' : 'border-zinc-200'
                }`}
              >
                <CardPatternBg variant="grid-nodes" />

                <div className="relative z-10">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-3">
                      <img
                        src={cand.photoUrl}
                        alt={cand.fullName}
                        className="w-24 h-24 rounded-2xl object-cover border border-zinc-200 shadow-sm"
                      />
                      <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-zinc-950 text-white text-[10px] font-mono font-bold">
                        #{String(cand.candidateNumber).padStart(2, '0')}
                      </span>
                    </div>

                    <h2 className="text-base font-extrabold text-zinc-950 leading-snug">
                      {cand.fullName}
                    </h2>

                    <div className="mt-2.5 space-y-1 text-xs text-zinc-600">
                      <div className="flex items-center justify-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[230px]">{cand.email}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate max-w-[240px]">
                          {shortProgramLabel(cand.program)} (Year {cand.yearOfStudy})
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>{cand.country}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-100 text-center">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Manifesto
                    </div>
                    <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed">
                      {cand.manifesto}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 mt-5 pt-2 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCandidate(cand)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-50 hover:bg-emerald-50 text-zinc-700 hover:text-emerald-700 text-xs font-bold border border-zinc-200 hover:border-emerald-200 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Read Manifesto</span>
                  </button>

                  {isSelf && !isProfileLocked && (
                    <button
                      type="button"
                      onClick={openProfileEditModal}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                    >
                      <UserCog className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Full Manifesto Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-lg w-full border border-zinc-200 shadow-2xl overflow-hidden">
            <CardPatternBg variant="grid-nodes" />
            <div className="relative z-10 px-6 py-5 border-b border-zinc-200 flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCandidate.photoUrl}
                  alt={selectedCandidate.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border border-zinc-200 shrink-0"
                />
                <div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                    Contestant #{String(selectedCandidate.candidateNumber).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-extrabold text-zinc-950 leading-tight">
                    {selectedCandidate.fullName}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {shortProgramLabel(selectedCandidate.program)} (Year{' '}
                    {selectedCandidate.yearOfStudy})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative z-10 p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs bg-zinc-50 rounded-xl p-3.5 border border-zinc-200">
                <div>
                  <div className="text-zinc-400">Nationality</div>
                  <div className="font-bold text-zinc-900 mt-0.5">
                    {selectedCandidate.country}
                  </div>
                </div>
                <div>
                  <div className="text-zinc-400">Student Email</div>
                  <div className="font-semibold text-zinc-900 mt-0.5 truncate">
                    {selectedCandidate.email}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Official Manifesto Statement
                </h4>
                <p className="text-sm text-zinc-700 mt-1.5 leading-relaxed whitespace-pre-line">
                  {selectedCandidate.manifesto}
                </p>
              </div>
            </div>

            <div className="relative z-10 px-6 py-4 border-t border-zinc-100 bg-zinc-50/70 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                Close
              </button>
              {isVotingLive && (!currentUser || !currentUser.hasVoted) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCandidate(null);
                    navigateProtected('vote');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  <Vote className="w-3.5 h-3.5" />
                  <span>Go to Ballot</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
