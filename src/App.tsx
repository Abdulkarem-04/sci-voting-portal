import React from 'react';
import { ExternalLink, Mail, MessageCircle, Phone } from 'lucide-react';
import { AdminView } from './components/AdminView';
import { AuthView } from './components/AuthView';
import { CandidateApplicationModal } from './components/CandidateApplicationModal';
import { CandidateProfileView } from './components/CandidateProfileView';
import { CandidatesView } from './components/CandidatesView';
import { HomeView } from './components/HomeView';
import { LabBoothKioskView } from './components/LabBoothKioskView';
import { Navbar } from './components/Navbar';
import { ResultsView } from './components/ResultsView';
import { VoteView } from './components/VoteView';
import { ElectionProvider, useElection } from './services/electionContext';

const PortalShell: React.FC = () => {
  const {
    loading,
    activeTab,
    isAdmin,
    authModalOpen,
    pendingGoogleAccount,
    c4TributeStudent,
    applicationModalOpen,
    closeApplicationModal,
    profileEditModalOpen,
    closeProfileEditModal,
    myCandidateProfile,
    labBoothSession,
  } = useElection();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-zinc-200 border-t-emerald-600 animate-spin" />
          <p className="font-mono text-xs font-semibold text-zinc-500">
            Loading SCI Election Portal...
          </p>
        </div>
      </div>
    );
  }

  if (labBoothSession.kioskLocked && isAdmin) {
    return <LabBoothKioskView />;
  }

  const showAuthModal =
    authModalOpen || Boolean(pendingGoogleAccount) || Boolean(c4TributeStudent);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'candidates' && <CandidatesView />}
        {activeTab === 'vote' && <VoteView />}
        {activeTab === 'results' && <ResultsView />}
        {activeTab === 'profile' && <CandidateProfileView />}
        {activeTab === 'admin' && <AdminView />}
      </main>

      <footer className="border-t border-zinc-200 bg-white/85 py-6 pb-24 md:pb-8 text-xs text-zinc-500 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'admin' ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="font-medium text-zinc-600">
                SCI Top Committee Election Portal | School of Computing and Informatics, AIU
              </p>
              <p className="font-mono text-[11px] text-zinc-400">
                Academic Session 2026 / 2027 &bull; Election Officer Console
              </p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-2.5">
                <div>
                  <p className="font-bold text-zinc-900">
                    SCI Top Committee Election Portal | School of Computing and Informatics, AIU
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-zinc-400">
                    Academic Session 2026 / 2027 &bull; Secret &amp; Verified Ballot System
                  </p>
                </div>
                <div>
                  <a
                    href="https://abdulkarem-04.github.io/sci-committee-webpage-25-26/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white hover:border-emerald-300 hover:text-emerald-700 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors"
                  >
                    <span>Current SCI Committee (2025/2026) Webpage</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="space-y-2 md:text-right">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Technical &amp; Voter Support
                </p>
                <div className="flex flex-wrap md:justify-end items-center gap-2">
                  <a
                    href="https://wa.me/2348135959589"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-800 px-2.5 py-1.5 text-[11px] font-medium text-zinc-700 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp: +234 813 595 9589</span>
                  </a>
                  <a
                    href="https://wa.me/601151485524"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-800 px-2.5 py-1.5 text-[11px] font-medium text-zinc-700 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Malaysia Call / WhatsApp: +60 11-5148 5524</span>
                  </a>
                  <a
                    href="mailto:ajogal.abubakar@student.aiu.edu.my"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-800 px-2.5 py-1.5 text-[11px] font-medium text-zinc-700 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-mono">ajogal.abubakar@student.aiu.edu.my</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </footer>

      {showAuthModal && <AuthView />}

      <CandidateApplicationModal
        open={applicationModalOpen}
        onClose={closeApplicationModal}
      />

      <CandidateApplicationModal
        open={profileEditModalOpen}
        onClose={closeProfileEditModal}
        editCandidate={myCandidateProfile}
      />
    </div>
  );
};

export function App() {
  return (
    <ElectionProvider>
      <PortalShell />
    </ElectionProvider>
  );
}

export default App;
