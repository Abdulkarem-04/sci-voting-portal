import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Globe,
  GraduationCap,
  Home,
  LogIn,
  LogOut,
  Mail,
  RotateCcw,
  ShieldCheck,
  Sliders,
  User,
  UserCog,
  Users,
  Vote,
  X,
} from 'lucide-react';
import { PHASE_META, PHASE_ORDER } from '../data/seedData';
import { PersonaPreset, useElection } from '../services/electionContext';
import { ActiveTab } from '../types/election';
import { CardPatternBg } from './CardPatternBg';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'SC';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export const Navbar: React.FC = () => {
  const {
    mode,
    activeTab,
    navigateProtected,
    openAuthModal,
    dbState,
    currentUser,
    myCandidateProfile,
    isAdmin,
    signOut,
    updateElectionPhase,
    switchDemoPersona,
    resetDemoDatabase,
    pendingCandidates,
  } = useElection();

  const [simBarOpen, setSimBarOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  const currentPhase = dbState.config.currentPhase;
  const phaseMeta = PHASE_META[currentPhase];
  const isVotingLive = currentPhase === 'VOTING_LIVE';

  const desktopNavItems: {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
  }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'candidates', label: 'Candidates', icon: <Users className="w-4 h-4" /> },
    {
      id: 'vote',
      label: 'Vote Now',
      icon: <Vote className="w-4 h-4" />,
      badge: currentUser?.hasVoted
        ? 'Voted'
        : isVotingLive
          ? 'Live'
          : undefined,
    },
    { id: 'results', label: 'Live Results', icon: <Award className="w-4 h-4" /> },
  ];

  if (myCandidateProfile?.status === 'approved') {
    desktopNavItems.push({
      id: 'profile',
      label: 'My Profile',
      icon: <UserCog className="w-4 h-4" />,
    });
  }

  if (isAdmin) {
    desktopNavItems.push({
      id: 'admin',
      label: 'Admin',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: pendingCandidates.length > 0 ? pendingCandidates.length : undefined,
    });
  }

  const mobileNavItems: {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
  }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'candidates', label: 'Candidates', icon: <Users className="w-4 h-4" /> },
    { id: 'vote', label: 'Vote', icon: <Vote className="w-4 h-4" /> },
    { id: 'results', label: 'Results', icon: <Award className="w-4 h-4" /> },
    isAdmin
      ? { id: 'admin', label: 'Admin', icon: <ShieldCheck className="w-4 h-4" /> }
      : myCandidateProfile?.status === 'approved'
        ? { id: 'profile', label: 'Profile', icon: <UserCog className="w-4 h-4" /> }
        : currentUser
          ? {
              id: 'vote',
              label: 'Receipt',
              icon: <Vote className="w-4 h-4" />,
            }
          : {
              id: 'home',
              label: 'Sign In',
              icon: <LogIn className="w-4 h-4" />,
              onClick: () => openAuthModal('home'),
            },
  ];

  const activePersona: PersonaPreset | 'custom' = !currentUser
    ? 'guest-public'
    : currentUser.uid === 'user-admin-abdulkarem'
      ? 'admin-abdulkarem'
      : currentUser.uid === 'user-cand-jumairah'
        ? 'candidate-jumairah'
        : currentUser.uid === 'user-voter-fresh'
          ? 'voter-fresh'
          : 'custom';

  return (
    <>
      <header className="sticky top-0 z-40 no-print">
        {/* Demo Sandbox Control Strip */}
        {mode === 'demo' && (
          <div className="bg-zinc-950 text-zinc-200 border-b border-zinc-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-1.5 text-xs gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30 shrink-0">
                    <Sliders className="w-3 h-3" />
                    Demo Sandbox
                  </span>
                  <span className="hidden sm:inline text-zinc-400 truncate">
                    Phase: <strong className="text-white">{phaseMeta.label}</strong> | Account:{' '}
                    <strong className="text-white">
                      {currentUser ? `${currentUser.fullName} (${currentUser.cohort})` : 'Public Guest'}
                    </strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSimBarOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium transition-colors shrink-0"
                >
                  <span>{simBarOpen ? 'Hide Controls' : 'Simulator Controls'}</span>
                  {simBarOpen ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {simBarOpen && (
                <div className="pb-3 pt-2 border-t border-zinc-800 grid grid-cols-1 lg:grid-cols-12 gap-3 text-xs">
                  <div className="lg:col-span-5">
                    <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
                      Switch Active Phase
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {PHASE_ORDER.map((p) => {
                        const active = currentPhase === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => updateElectionPhase(p)}
                            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                              active
                                ? 'bg-emerald-600 text-white'
                                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                            }`}
                          >
                            {PHASE_META[p].label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="lg:col-span-7 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
                        Test Persona
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => switchDemoPersona('guest-public')}
                          className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                            activePersona === 'guest-public'
                              ? 'bg-emerald-500 text-zinc-950 font-semibold'
                              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                          }`}
                        >
                          Guest Visitor
                        </button>
                        <button
                          type="button"
                          onClick={() => switchDemoPersona('admin-abdulkarem')}
                          className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                            activePersona === 'admin-abdulkarem'
                              ? 'bg-emerald-500 text-zinc-950 font-semibold'
                              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                          }`}
                        >
                          Admin: Abdulkarem (C5)
                        </button>
                        <button
                          type="button"
                          onClick={() => switchDemoPersona('candidate-jumairah')}
                          className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                            activePersona === 'candidate-jumairah'
                              ? 'bg-emerald-500 text-zinc-950 font-semibold'
                              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                          }`}
                        >
                          Candidate (C6)
                        </button>
                        <button
                          type="button"
                          onClick={() => switchDemoPersona('voter-fresh')}
                          className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                            activePersona === 'voter-fresh'
                              ? 'bg-emerald-500 text-zinc-950 font-semibold'
                              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                          }`}
                        >
                          Voter (C7)
                        </button>
                        <button
                          type="button"
                          onClick={() => switchDemoPersona('senior-c4')}
                          className="px-2.5 py-1 rounded-md font-medium bg-zinc-800 text-emerald-300 border border-emerald-500/30 hover:bg-zinc-700 transition-colors"
                        >
                          C4 Senior Tribute
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={resetDemoDatabase}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-800/70 font-medium self-start sm:self-auto shrink-0"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset Demo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Primary Minimal Top Navbar (Unboxed Logos with Divider, Centered Tabs, Single Account Trigger) */}
        <nav className="bg-white/95 backdrop-blur-md border-b border-zinc-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 gap-4">
              {/* Brand */}
              <button
                type="button"
                onClick={() => navigateProtected('home')}
                className="flex items-center gap-3 text-left shrink-0 focus:outline-none group"
              >
                <div className="flex items-center gap-2.5 shrink-0">
                  <img
                    src="/logos/aiu-logo.png"
                    alt="AIU Official Logo"
                    className="h-7 w-auto object-contain"
                  />
                  <span className="h-5 w-px bg-zinc-200 shrink-0" aria-hidden="true" />
                  <img
                    src="/logos/sci-logo.png"
                    alt="SCI Logo"
                    className="h-7 w-auto object-contain"
                  />
                </div>
                <div className="leading-tight whitespace-nowrap">
                  <div className="text-[10px] font-bold tracking-wider uppercase text-emerald-600">
                    SCI Elections 26/27
                  </div>
                  <div className="text-sm font-bold text-zinc-950 group-hover:text-emerald-600 transition-colors">
                    Student Portal
                  </div>
                </div>
              </button>

              {/* Desktop Tabs */}
              <div className="hidden md:flex items-center gap-1 shrink-0">
                {desktopNavItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigateProtected(item.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 lg:px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.badge !== undefined && (
                        <span
                          className={`ml-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full leading-none ${
                            item.badge === 'Live'
                              ? 'bg-emerald-600 text-white'
                              : item.badge === 'Voted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-zinc-900 text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Phase Status + Icon-Only Profile Button */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden lg:inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-[11px] font-semibold text-zinc-600 whitespace-nowrap">
                  <span className={`status-dot ${isVotingLive ? 'live' : 'off'}`} />
                  <span>{phaseMeta.shortLabel}</span>
                </div>

                {currentUser ? (
                  <button
                    type="button"
                    onClick={() => setAccountModalOpen(true)}
                    aria-label="Open Student Account Profile"
                    title={`${currentUser.fullName} (${currentUser.studentId})`}
                    className="relative w-9 h-9 rounded-full border border-zinc-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 flex items-center justify-center transition-colors shrink-0"
                  >
                    <User className="w-4 h-4" />
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
                      aria-hidden="true"
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => openAuthModal('home')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Floating Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-3 left-3 right-3 z-40 no-print"
      >
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-md border border-zinc-200 rounded-full px-2 py-1.5 shadow-[0_12px_28px_-10px_rgba(9,9,11,0.2)] grid grid-cols-5 gap-1">
          {mobileNavItems.map((item) => {
            const isActive =
              item.label === 'Sign In' ? false : activeTab === item.id;
            return (
              <button
                key={`${item.id}-${item.label}`}
                type="button"
                onClick={item.onClick ? item.onClick : () => navigateProtected(item.id)}
                className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-full text-[10px] font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {item.icon}
                <span className="truncate max-w-full">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Student Account & Profile Quick Modal */}
      {accountModalOpen && currentUser && (
        <div
          className="fixed inset-0 z-50 bg-zinc-950/45 backdrop-blur-sm flex items-center justify-center p-4 no-print"
          onClick={() => setAccountModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative px-6 py-5 border-b border-zinc-200 bg-zinc-50/80 overflow-hidden">
              <CardPatternBg variant="grid-nodes" />
              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white text-sm font-extrabold flex items-center justify-center shrink-0">
                    {getInitials(currentUser.fullName)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                          isAdmin
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : myCandidateProfile?.status === 'approved'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : 'border-zinc-200 bg-white text-zinc-600'
                        }`}
                      >
                        {isAdmin
                          ? 'Election Admin'
                          : myCandidateProfile?.status === 'approved'
                            ? 'Approved Candidate'
                            : 'Verified Voter'}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-zinc-700">
                        {currentUser.cohort} / Year {currentUser.yearOfStudy}
                      </span>
                    </div>
                    <h2 className="mt-1.5 text-base font-extrabold text-zinc-950 leading-snug">
                      {currentUser.fullName}
                    </h2>
                    <p className="font-mono text-xs text-zinc-500">{currentUser.studentId}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAccountModalOpen(false)}
                  aria-label="Close account modal"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-white transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-3.5 text-xs">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 divide-y divide-zinc-200/80">
                <div className="px-3.5 py-2.5 flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      AIU Student Email
                    </p>
                    <p className="font-mono text-zinc-800 truncate">{currentUser.email}</p>
                  </div>
                </div>
                <div className="px-3.5 py-2.5 flex items-center gap-2.5">
                  <GraduationCap className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Program of Study
                    </p>
                    <p className="font-semibold text-zinc-800">{currentUser.program}</p>
                  </div>
                </div>
                <div className="px-3.5 py-2.5 flex items-center gap-2.5">
                  <Globe className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Nationality
                    </p>
                    <p className="font-semibold text-zinc-800">{currentUser.country}</p>
                  </div>
                </div>
                <div className="px-3.5 py-2.5 flex items-center gap-2.5">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 shrink-0 ${
                      currentUser.hasVoted ? 'text-emerald-600' : 'text-zinc-400'
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Ballot Status
                    </p>
                    <p className="font-semibold text-zinc-800">
                      {currentUser.hasVoted
                        ? `Voted (${currentUser.votingChannel === 'lab_booth' ? 'Lab Booth' : 'Online'})${currentUser.receiptCode ? ` • ${currentUser.receiptCode}` : ''}`
                        : 'Eligible — Ballot Not Cast Yet'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setAccountModalOpen(false);
                        navigateProtected('admin');
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-800 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Admin Console
                    </button>
                  )}
                  {myCandidateProfile?.status === 'approved' && (
                    <button
                      type="button"
                      onClick={() => {
                        setAccountModalOpen(false);
                        navigateProtected('profile');
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-700 transition-colors"
                    >
                      <UserCog className="w-3.5 h-3.5" />
                      My Profile
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAccountModalOpen(false);
                    void signOut();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 px-3.5 py-2 text-xs font-bold text-red-700 transition-colors ml-auto"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
