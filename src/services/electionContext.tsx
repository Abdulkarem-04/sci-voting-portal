import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  COHORT_ROSTER,
  findRosterStudent,
  verifyEmailMatchesRosterStudent,
} from '../data/cohortRoster';
import {
  createInitialSeedState,
  isOfficialShortlistedNominee,
  MAX_MANIFESTO_LENGTH,
  PRIMARY_ADMIN_EMAIL,
} from '../data/seedData';
import {
  firebaseAuth,
  firebaseDb,
  firebaseGoogleProvider,
  isFirebaseConfigured,
} from '../lib/firebase';
import {
  ActionResult,
  ActiveTab,
  AdminUpdateUserInput,
  AuditLogEntry,
  AuthRosterResponse,
  C4VisitEntry,
  Candidate,
  CandidateApplicationInput,
  CandidateStatus,
  ElectionConfig,
  ElectionDatabaseState,
  ElectionPhase,
  LabBoothCheckInInput,
  LabBoothSession,
  RosterStudent,
  TopCommitteeRole,
  UserProfile,
  UserRole,
} from '../types/election';
import {
  generateSvgAvatarDataUrl,
  isValidAiuEmail,
  normalizeAiuStudentId,
  shortProgramLabel,
} from '../utils/imageUtils';
import {
  STORAGE_KEY,
  createBroadcastChannel,
  generateReceiptCode,
  getSavedSessionUid,
  isProfileEditLockedPhase,
  loadLocalDatabase,
  localAdminUpdateUser,
  localAssignTopCommitteeRole,
  localAuthenticateWithRoster,
  localCastBallot,
  localCastLabBoothBallot,
  localDeleteCandidate,
  localManageAdminEmails,
  localResetDemoState,
  localSetCandidateStatus,
  localSubmitCandidateApplication,
  localUpdateCandidateDetails,
  localUpdateConfig,
  localUpdatePhase,
  normalizeFullNameKey,
  sanitizeText,
  saveLocalDatabase,
  setSavedSessionUid,
  validateBallotSelection,
  validateLabBoothCheckIn,
} from './electionStore';

export type PersonaPreset =
  | 'guest-public'
  | 'admin-abdulkarem'
  | 'candidate-jumairah'
  | 'voter-fresh'
  | 'senior-c4';

export interface PendingGoogleAccount {
  uid: string;
  email: string;
  displayName: string;
}

interface ElectionContextValue {
  mode: 'firebase' | 'demo';
  loading: boolean;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  navigateProtected: (tab: ActiveTab) => void;
  authModalOpen: boolean;
  openAuthModal: (returnToTab?: ActiveTab) => void;
  closeAuthModal: () => void;
  applicationModalOpen: boolean;
  openApplicationModal: () => void;
  closeApplicationModal: () => void;
  profileEditModalOpen: boolean;
  openProfileEditModal: () => void;
  closeProfileEditModal: () => void;
  dbState: ElectionDatabaseState;
  currentUser: UserProfile | null;
  myCandidateProfile: Candidate | null;
  approvedCandidates: Candidate[];
  pendingCandidates: Candidate[];
  rankedCandidates: Candidate[];
  isAdmin: boolean;
  isProfileLocked: boolean;
  pendingGoogleAccount: PendingGoogleAccount | null;
  cancelPendingGoogleAuth: () => Promise<void>;
  c4TributeStudent: RosterStudent | null;
  clearC4Tribute: () => void;
  beginGoogleOAuth: (demoAccount?: {
    email: string;
    displayName?: string;
  }) => Promise<ActionResult<{ autoSignedIn: boolean }>>;
  completeStudentIdLink: (
    studentIdInput: string,
    country: string
  ) => Promise<ActionResult<AuthRosterResponse>>;
  signOut: () => Promise<void>;
  switchDemoPersona: (preset: PersonaPreset) => void;
  simulateC4Visit: (studentId?: string) => void;
  submitBallot: (candidateIds: string[]) => Promise<ActionResult<UserProfile>>;
  submitCandidateApplication: (
    input: CandidateApplicationInput,
    initialStatus?: CandidateStatus
  ) => Promise<ActionResult<Candidate>>;
  setCandidateStatus: (id: string, status: CandidateStatus) => Promise<ActionResult>;
  updateCandidateDetails: (
    id: string,
    updates: { fullName?: string; country?: string; manifesto?: string; photoUrl?: string }
  ) => Promise<ActionResult>;
  assignTopCommitteeRole: (id: string, role: TopCommitteeRole | null) => Promise<ActionResult>;
  deleteCandidate: (id: string) => Promise<ActionResult>;
  updateElectionPhase: (phase: ElectionPhase) => Promise<ActionResult>;
  updateElectionConfig: (
    partial: Partial<
      Pick<
        ElectionConfig,
        'currentPhase' | 'liveResultsPublic' | 'totalRegisteredVoters' | 'labBoothPin' | 'topAdvancingCount'
      >
    >
  ) => Promise<ActionResult>;
  manageAdminEmails: (action: 'add' | 'remove', email: string) => Promise<ActionResult<string[]>>;
  adminUpdateUser: (targetUid: string, updates: AdminUpdateUserInput) => Promise<ActionResult<UserProfile>>;
  labBoothSession: LabBoothSession;
  startLabBoothSession: (checkIn: LabBoothCheckInInput) => ActionResult;
  submitLabBoothBallot: (candidateIds: string[]) => Promise<ActionResult<{ receiptCode: string }>>;
  unlockLabBoothWithPin: (pinInput: string) => ActionResult;
  resetDemoDatabase: () => void;
}

const INITIAL_LAB_SESSION: LabBoothSession = {
  activeCheckIn: null,
  kioskLocked: false,
  awaitingPinUnlock: false,
  lastReceiptCode: null,
  lastVoterName: null,
};

function createInitialLiveFirebaseState(): ElectionDatabaseState {
  const baseSeed = createInitialSeedState();
  return {
    config: {
      ...baseSeed.config,
      currentPhase: 'NOMINATIONS',
      totalBallotsCast: 0,
      votedStudentIds: [],
      votedFullNames: [],
      lastUpdatedAt: new Date().toISOString(),
    },
    candidates: [],
    users: {},
    c4Visits: [],
    auditLogs: [],
  };
}

const ElectionContext = createContext<ElectionContextValue | undefined>(undefined);

export const ElectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dbState, setDbState] = useState<ElectionDatabaseState>(() =>
    isFirebaseConfigured ? createInitialLiveFirebaseState() : loadLocalDatabase()
  );
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(() => getSavedSessionUid());
  const [firebaseUser, setFirebaseUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(isFirebaseConfigured);
  const [activeTab, setActiveTabState] = useState<ActiveTab>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingReturnTab, setPendingReturnTab] = useState<ActiveTab | null>(null);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [profileEditModalOpen, setProfileEditModalOpen] = useState(false);
  const [pendingGoogleAccount, setPendingGoogleAccount] =
    useState<PendingGoogleAccount | null>(null);
  const [c4TributeStudent, setC4TributeStudent] = useState<RosterStudent | null>(null);
  const [labBoothSession, setLabBoothSession] = useState<LabBoothSession>(INITIAL_LAB_SESSION);

  // Sync Demo DB across browser tabs
  useEffect(() => {
    if (isFirebaseConfigured) return;

    const channel = createBroadcastChannel();
    const onMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'DB_UPDATED') {
        setDbState(loadLocalDatabase());
      }
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setDbState(loadLocalDatabase());
      }
    };

    channel?.addEventListener('message', onMessage);
    window.addEventListener('storage', onStorage);
    return () => {
      channel?.removeEventListener('message', onMessage);
      channel?.close();
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const notifyLocalSync = useCallback((next: ElectionDatabaseState) => {
    setDbState(next);
    const channel = createBroadcastChannel();
    channel?.postMessage({ type: 'DB_UPDATED' });
    channel?.close();
  }, []);

  // Firestore real-time subscriptions when configured
  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseAuth || !firebaseDb) {
      setLoading(false);
      return;
    }

    const db = firebaseDb;
    const auth = firebaseAuth;

    const ensureInitialConfigDoc = async () => {
      try {
        const cfgRef = doc(db, 'electionConfig', 'current');
        const cfgSnap = await getDoc(cfgRef);
        if (!cfgSnap.exists() && auth.currentUser) {
          await setDoc(cfgRef, createInitialLiveFirebaseState().config);
        }
      } catch {
        // Ignore if rules block before Admin/student setup completes
      }
    };

    const unsubConfig = onSnapshot(
      doc(db, 'electionConfig', 'current'),
      (snap) => {
        if (snap.exists()) {
          setDbState((prev) => ({
            ...prev,
            config: snap.data() as ElectionConfig,
          }));
        } else if (auth.currentUser) {
          setDoc(
            doc(db, 'electionConfig', 'current'),
            createInitialLiveFirebaseState().config
          ).catch(() => {});
        }
      },
      () => {
        setLoading(false);
      }
    );

    const unsubCandidates = onSnapshot(
      collection(db, 'candidates'),
      (snap) => {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Candidate, 'id'>) }))
          .sort((a, b) => a.candidateNumber - b.candidateNumber);
        setDbState((prev) => ({ ...prev, candidates: list }));
      },
      () => {
        setLoading(false);
      }
    );

    let unsubUserDoc: (() => void) | undefined;
    const unsubAuth = onAuthStateChanged(
      auth,
      (fbUser) => {
        if (unsubUserDoc) {
          unsubUserDoc();
          unsubUserDoc = undefined;
        }
        if (!fbUser) {
          setFirebaseUser(null);
          setLoading(false);
          return;
        }
        void ensureInitialConfigDoc();
        unsubUserDoc = onSnapshot(
          doc(db, 'users', fbUser.uid),
          (userSnap) => {
            if (userSnap.exists()) {
              setFirebaseUser(userSnap.data() as UserProfile);
              setPendingGoogleAccount(null);
            } else {
              setFirebaseUser(null);
              if (fbUser.email && isValidAiuEmail(fbUser.email)) {
                setPendingGoogleAccount({
                  uid: fbUser.uid,
                  email: fbUser.email.toLowerCase(),
                  displayName: fbUser.displayName || '',
                });
              }
            }
            setLoading(false);
          },
          () => {
            setFirebaseUser(null);
            setLoading(false);
          }
        );
      },
      () => {
        setLoading(false);
      }
    );

    return () => {
      unsubConfig();
      unsubCandidates();
      unsubAuth();
      if (unsubUserDoc) unsubUserDoc();
    };
  }, []);

  const currentUser = useMemo<UserProfile | null>(() => {
    const baseUser = isFirebaseConfigured
      ? firebaseUser
      : currentUserUid
        ? dbState.users[currentUserUid] ?? null
        : null;
    if (!baseUser) return null;

    const emailLower = baseUser.email.toLowerCase();
    const listedAdmin =
      emailLower === PRIMARY_ADMIN_EMAIL.toLowerCase() ||
      dbState.config.adminEmails.map((e) => e.toLowerCase()).includes(emailLower);
    const effectiveRole: UserRole = listedAdmin ? 'admin' : 'voter';
    const votedInConfig =
      dbState.config.votedStudentIds.includes(baseUser.studentId) ||
      dbState.config.votedFullNames.includes(
        normalizeFullNameKey(baseUser.fullName, baseUser.cohort)
      );
    const effectiveHasVoted = baseUser.hasVoted || votedInConfig;
    const effectiveChannel =
      baseUser.votingChannel ?? (votedInConfig ? 'lab_booth' : null);

    if (
      baseUser.role === effectiveRole &&
      baseUser.hasVoted === effectiveHasVoted &&
      baseUser.votingChannel === effectiveChannel
    ) {
      return baseUser;
    }
    return {
      ...baseUser,
      role: effectiveRole,
      hasVoted: effectiveHasVoted,
      votingChannel: effectiveChannel,
    };
  }, [
    currentUserUid,
    dbState.config.adminEmails,
    dbState.config.votedFullNames,
    dbState.config.votedStudentIds,
    dbState.users,
    firebaseUser,
  ]);

  const approvedCandidates = useMemo(
    () =>
      dbState.candidates
        .filter((c) => c.status === 'approved')
        .sort((a, b) => a.candidateNumber - b.candidateNumber),
    [dbState.candidates]
  );

  const pendingCandidates = useMemo(
    () =>
      dbState.candidates
        .filter((c) => c.status === 'pending')
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [dbState.candidates]
  );

  const rankedCandidates = useMemo(
    () =>
      [...approvedCandidates].sort((a, b) => {
        if (b.votes !== a.votes) return b.votes - a.votes;
        return a.candidateNumber - b.candidateNumber;
      }),
    [approvedCandidates]
  );

  const myCandidateProfile = useMemo<Candidate | null>(() => {
    if (!currentUser) return null;
    return (
      dbState.candidates.find(
        (c) => c.studentId.toUpperCase() === currentUser.studentId.toUpperCase()
      ) ?? null
    );
  }, [currentUser, dbState.candidates]);

  const isAdmin = Boolean(currentUser && currentUser.role === 'admin');

  // Auto-sync promoted user role document cleanly in Firestore when listed in adminEmails
  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseDb || !firebaseUser || !currentUser) return;
    if (firebaseUser.role !== currentUser.role && currentUser.role === 'admin') {
      updateDoc(doc(firebaseDb, 'users', currentUser.uid), {
        role: 'admin',
      }).catch(() => {});
    }
  }, [currentUser, firebaseUser]);

  // Admin-only live subscriptions for C4 visits, registered users, and audit logs in Firebase mode
  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseDb || !isAdmin) return;
    const db = firebaseDb;
    const unsubVisits = onSnapshot(
      collection(db, 'c4Visits'),
      (snap) => {
        const visits = snap.docs
          .map((d) => d.data() as C4VisitEntry)
          .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        setDbState((prev) => ({ ...prev, c4Visits: visits }));
      },
      () => {
        // Ignore if admin privileges or rules are still loading
      }
    );
    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      (snap) => {
        const userMap: Record<string, UserProfile> = {};
        snap.docs.forEach((d) => {
          const u = d.data() as UserProfile;
          userMap[d.id] = { ...u, uid: u.uid || d.id };
        });
        setDbState((prev) => ({ ...prev, users: userMap }));
      },
      () => {
        // Ignore if admin privileges or rules are still loading
      }
    );
    const unsubLogs = onSnapshot(
      collection(db, 'auditLogs'),
      (snap) => {
        const logs = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<AuditLogEntry, 'id'>) }))
          .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        setDbState((prev) => ({ ...prev, auditLogs: logs }));
      },
      () => {
        // Ignore if admin privileges or rules are still loading
      }
    );
    return () => {
      unsubVisits();
      unsubUsers();
      unsubLogs();
    };
  }, [isAdmin]);
  const isProfileLocked = isProfileEditLockedPhase(dbState.config.currentPhase);

  const setActiveTab = useCallback((tab: ActiveTab) => {
    setActiveTabState(tab);
  }, []);

  const openAuthModal = useCallback((returnToTab?: ActiveTab) => {
    setPendingReturnTab(returnToTab ?? null);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setPendingReturnTab(null);
  }, []);

  const navigateProtected = useCallback(
    (tab: ActiveTab) => {
      if (tab === 'home' || tab === 'candidates' || tab === 'results') {
        setActiveTabState(tab);
        setAuthModalOpen(false);
        return;
      }
      if (!currentUser) {
        openAuthModal(tab);
        return;
      }
      setActiveTabState(tab);
      setAuthModalOpen(false);
    },
    [currentUser, openAuthModal]
  );

  const openApplicationModal = useCallback(() => {
    if (!currentUser) {
      openAuthModal('home');
      return;
    }
    setApplicationModalOpen(true);
  }, [currentUser, openAuthModal]);

  const closeApplicationModal = useCallback(() => {
    setApplicationModalOpen(false);
  }, []);

  const openProfileEditModal = useCallback(() => {
    if (!currentUser) {
      openAuthModal('candidates');
      return;
    }
    setProfileEditModalOpen(true);
  }, [currentUser, openAuthModal]);

  const closeProfileEditModal = useCallback(() => {
    setProfileEditModalOpen(false);
  }, []);

  const clearC4Tribute = useCallback(() => {
    setC4TributeStudent(null);
  }, []);

  const cancelPendingGoogleAuth = useCallback(async () => {
    setPendingGoogleAccount(null);
    if (isFirebaseConfigured && firebaseAuth) {
      await firebaseSignOut(firebaseAuth).catch(() => {});
    }
  }, []);

  const beginGoogleOAuth = useCallback(
    async (demoAccount?: {
      email: string;
      displayName?: string;
    }): Promise<ActionResult<{ autoSignedIn: boolean }>> => {
      if (isFirebaseConfigured && firebaseAuth && firebaseDb && firebaseGoogleProvider) {
        try {
          const cred = await signInWithPopup(firebaseAuth, firebaseGoogleProvider);
          const email = (cred.user.email || '').trim().toLowerCase();
          if (!isValidAiuEmail(email) || !cred.user.emailVerified) {
            await firebaseSignOut(firebaseAuth);
            return {
              ok: false,
              message: 'Please sign in with your verified @student.aiu.edu.my Google Workspace email.',
            };
          }

          const userDocSnap = await getDoc(doc(firebaseDb, 'users', cred.user.uid));
          if (userDocSnap.exists()) {
            const loaded = userDocSnap.data() as UserProfile;
            setFirebaseUser(loaded);
            setPendingGoogleAccount(null);
            setAuthModalOpen(false);
            if (pendingReturnTab) {
              setActiveTabState(pendingReturnTab);
              setPendingReturnTab(null);
            }
            return {
              ok: true,
              message: `Signed in as ${loaded.fullName}.`,
              data: { autoSignedIn: true },
            };
          }

          setPendingGoogleAccount({
            uid: cred.user.uid,
            email,
            displayName: cred.user.displayName || '',
          });
          setC4TributeStudent(null);
          return {
            ok: true,
            message: 'Google account verified. Enter your AIU Student ID to complete your 1-time link.',
            data: { autoSignedIn: false },
          };
        } catch (err) {
          return {
            ok: false,
            message: err instanceof Error ? err.message : 'Google Sign-In failed.',
          };
        }
      }

      // Demo mode OAuth simulation
      const rawEmail = (demoAccount?.email || '').trim().toLowerCase();
      if (!isValidAiuEmail(rawEmail)) {
        return {
          ok: false,
          message: 'Please use a @student.aiu.edu.my email address.',
        };
      }

      const existingReturning = Object.values(dbState.users).find(
        (u) => u.email.toLowerCase() === rawEmail
      );
      if (existingReturning) {
        setSavedSessionUid(existingReturning.uid);
        setCurrentUserUid(existingReturning.uid);
        setPendingGoogleAccount(null);
        setC4TributeStudent(null);
        setAuthModalOpen(false);
        if (pendingReturnTab) {
          setActiveTabState(pendingReturnTab);
          setPendingReturnTab(null);
        }
        return {
          ok: true,
          message: `Welcome back, ${existingReturning.fullName}.`,
          data: { autoSignedIn: true },
        };
      }

      setPendingGoogleAccount({
        uid: `demo-${Date.now().toString(36)}`,
        email: rawEmail,
        displayName: demoAccount?.displayName || '',
      });
      setC4TributeStudent(null);
      return {
        ok: true,
        message: 'Google account verified. Enter your Student ID to confirm your cohort.',
        data: { autoSignedIn: false },
      };
    },
    [dbState.users, pendingReturnTab]
  );

  const completeStudentIdLink = useCallback(
    async (
      studentIdInput: string,
      country: string
    ): Promise<ActionResult<AuthRosterResponse>> => {
      if (!pendingGoogleAccount) {
        return { ok: false, message: 'Complete Google Sign-In first.' };
      }

      if (isFirebaseConfigured && firebaseAuth && firebaseDb) {
        const studentId = normalizeAiuStudentId(studentIdInput);
        const rosterStudent = findRosterStudent(studentId);
        if (!rosterStudent) {
          return {
            ok: false,
            message: `Student ID ${studentId} was not found in the SCI Cohort 4-7 roster.`,
          };
        }

        const matchCheck = verifyEmailMatchesRosterStudent(
          pendingGoogleAccount.email,
          pendingGoogleAccount.displayName,
          rosterStudent
        );
        if (!matchCheck.ok) {
          return {
            ok: false,
            message: matchCheck.reason || 'Google email does not match Student ID.',
          };
        }

        if (rosterStudent.cohort === 'C4') {
          const visitEntry: C4VisitEntry = {
            id: `c4v-${Date.now()}`,
            studentId: rosterStudent.studentId,
            fullName: rosterStudent.fullName,
            email: pendingGoogleAccount.email,
            program: rosterStudent.program,
            timestamp: new Date().toISOString(),
          };
          await setDoc(doc(firebaseDb, 'c4Visits', rosterStudent.studentId), visitEntry).catch(
            () => {}
          );
          await firebaseSignOut(firebaseAuth).catch(() => {});
          setPendingGoogleAccount(null);
          setC4TributeStudent(rosterStudent);
          return {
            ok: true,
            message: `Congratulations on graduating, ${rosterStudent.fullName}!`,
            data: { c4Senior: rosterStudent },
          };
        }

        const cleanCountry = sanitizeText(country || '', 64);
        if (!cleanCountry) {
          return { ok: false, message: 'Please select your nationality.' };
        }

        try {
          const emailLower = pendingGoogleAccount.email.toLowerCase();
          const isConfiguredAdmin =
            emailLower === PRIMARY_ADMIN_EMAIL.toLowerCase() ||
            dbState.config.adminEmails.map((e) => e.toLowerCase()).includes(emailLower);
          const nowIso = new Date().toISOString();
          const newProfile: UserProfile = {
            uid: pendingGoogleAccount.uid,
            fullName: rosterStudent.fullName,
            studentId: rosterStudent.studentId,
            email: emailLower,
            cohort: rosterStudent.cohort,
            yearOfStudy: rosterStudent.yearOfStudy,
            program: rosterStudent.program,
            country: cleanCountry,
            role: isConfiguredAdmin ? 'admin' : 'voter',
            hasVoted: false,
            votedAt: null,
            votingChannel: null,
            receiptCode: null,
            createdAt: nowIso,
          };

          await runTransaction(firebaseDb, async (tx) => {
            const lockRef = doc(firebaseDb!, 'studentLocks', rosterStudent.studentId);
            const lockSnap = await tx.get(lockRef);
            if (lockSnap.exists()) {
              const lockData = lockSnap.data() as { uid: string; email: string };
              if (lockData.uid !== pendingGoogleAccount.uid) {
                throw new Error('This Student ID is already linked to another Google account.');
              }
            } else {
              tx.set(lockRef, {
                studentId: rosterStudent.studentId,
                uid: pendingGoogleAccount.uid,
                email: pendingGoogleAccount.email,
                hasVoted: false,
              });
            }
            tx.set(doc(firebaseDb!, 'users', pendingGoogleAccount.uid), newProfile);
          });

          setFirebaseUser(newProfile);
          setPendingGoogleAccount(null);
          setAuthModalOpen(false);
          if (pendingReturnTab) {
            setActiveTabState(pendingReturnTab);
            setPendingReturnTab(null);
          }
          return {
            ok: true,
            message: `Verified as ${newProfile.fullName} (${newProfile.cohort}).`,
            data: { user: newProfile },
          };
        } catch (err) {
          return {
            ok: false,
            message: err instanceof Error ? err.message : 'Unable to link Student ID.',
          };
        }
      }

      const { nextState, result } = localAuthenticateWithRoster(dbState, {
        uid: pendingGoogleAccount.uid,
        email: pendingGoogleAccount.email,
        googleDisplayName: pendingGoogleAccount.displayName,
        studentIdInput,
        country,
      });
      notifyLocalSync(nextState);

      if (result.ok && result.data?.c4Senior) {
        setPendingGoogleAccount(null);
        setC4TributeStudent(result.data.c4Senior);
      } else if (result.ok && result.data?.user) {
        setCurrentUserUid(result.data.user.uid);
        setPendingGoogleAccount(null);
        setC4TributeStudent(null);
        setAuthModalOpen(false);
        if (pendingReturnTab) {
          setActiveTabState(pendingReturnTab);
          setPendingReturnTab(null);
        }
      }

      return result;
    },
    [dbState, notifyLocalSync, pendingGoogleAccount, pendingReturnTab]
  );

  const simulateC4Visit = useCallback(
    (studentId = 'AIU22102225') => {
      if (isFirebaseConfigured) return;
      const senior = COHORT_ROSTER[studentId] || findRosterStudent('AIU22102225');
      if (!senior || senior.cohort !== 'C4') return;
      const email = `${senior.studentId.toLowerCase()}@student.aiu.edu.my`;
      const { nextState, result } = localAuthenticateWithRoster(dbState, {
        email,
        googleDisplayName: senior.fullName,
        studentIdInput: senior.studentId,
        country: 'Somalia',
      });
      notifyLocalSync(nextState);
      if (result.ok && result.data?.c4Senior) {
        setSavedSessionUid(null);
        setCurrentUserUid(null);
        setPendingGoogleAccount(null);
        setC4TributeStudent(result.data.c4Senior);
        setAuthModalOpen(true);
      }
    },
    [dbState, notifyLocalSync]
  );

  const signOut = useCallback(async () => {
    setPendingGoogleAccount(null);
    setC4TributeStudent(null);
    if (isFirebaseConfigured && firebaseAuth) {
      await firebaseSignOut(firebaseAuth).catch(() => {});
      setFirebaseUser(null);
      setActiveTabState('home');
      return;
    }
    setSavedSessionUid(null);
    setCurrentUserUid(null);
    if (activeTab === 'admin' || activeTab === 'vote' || activeTab === 'profile') {
      setActiveTabState('home');
    }
  }, [activeTab]);

  const switchDemoPersona = useCallback(
    (preset: PersonaPreset) => {
      if (isFirebaseConfigured) return;
      if (preset === 'guest-public') {
        setSavedSessionUid(null);
        setCurrentUserUid(null);
        setPendingGoogleAccount(null);
        setC4TributeStudent(null);
        setAuthModalOpen(false);
        if (activeTab === 'admin' || activeTab === 'vote' || activeTab === 'profile') {
          setActiveTabState('home');
        }
        return;
      }

      if (preset === 'senior-c4') {
        simulateC4Visit('AIU22102225');
        return;
      }

      const presetUidMap: Record<
        Exclude<PersonaPreset, 'guest-public' | 'senior-c4'>,
        string
      > = {
        'admin-abdulkarem': 'user-admin-abdulkarem',
        'candidate-jumairah': 'user-cand-jumairah',
        'voter-fresh': 'user-voter-fresh',
      };
      const targetUid = presetUidMap[preset];
      let nextDb = dbState;
      if (!nextDb.users[targetUid]) {
        const seed = createInitialSeedState();
        nextDb = {
          ...nextDb,
          users: { ...nextDb.users, [targetUid]: seed.users[targetUid] },
        };
        saveLocalDatabase(nextDb);
        notifyLocalSync(nextDb);
      }
      setSavedSessionUid(targetUid);
      setCurrentUserUid(targetUid);
      setPendingGoogleAccount(null);
      setC4TributeStudent(null);
      setAuthModalOpen(false);
      if (preset !== 'admin-abdulkarem' && activeTab === 'admin') {
        setActiveTabState('home');
      }
    },
    [activeTab, dbState, notifyLocalSync, simulateC4Visit]
  );

  const submitBallot = useCallback(
    async (candidateIds: string[]): Promise<ActionResult<UserProfile>> => {
      if (!currentUser) {
        return { ok: false, message: 'Sign in with Google first to submit your ballot.' };
      }

      if (isFirebaseConfigured && firebaseDb) {
        const validation = validateBallotSelection(
          candidateIds,
          dbState.candidates,
          dbState.config.maxVotesPerBallot
        );
        if (!validation.ok) return { ok: false, message: validation.message };
        const uniqueIds = Array.from(new Set(candidateIds));
        const receiptCode = generateReceiptCode(currentUser.studentId);
        const nowIso = new Date().toISOString();

        try {
          await runTransaction(firebaseDb, async (tx) => {
            const userRef = doc(firebaseDb!, 'users', currentUser.uid);
            const lockRef = doc(firebaseDb!, 'studentLocks', currentUser.studentId);
            const cfgRef = doc(firebaseDb!, 'electionConfig', 'current');
            const [userSnap, lockSnap, cfgSnap] = await Promise.all([
              tx.get(userRef),
              tx.get(lockRef),
              tx.get(cfgRef),
            ]);

            if (!userSnap.exists()) throw new Error('Student profile missing.');
            const uData = userSnap.data() as UserProfile;
            if (uData.hasVoted) throw new Error('You have already submitted your ballot.');
            if (lockSnap.exists() && (lockSnap.data() as { hasVoted: boolean }).hasVoted) {
              throw new Error('This Student ID has already cast a ballot.');
            }

            const cData = cfgSnap.exists() ? (cfgSnap.data() as ElectionConfig) : dbState.config;
            if (cData.currentPhase !== 'VOTING_LIVE') {
              throw new Error('Voting is currently closed.');
            }
            const voterNameKey = normalizeFullNameKey(uData.fullName, uData.cohort);
            if (
              cData.votedStudentIds?.includes(uData.studentId) ||
              cData.votedFullNames?.includes(voterNameKey)
            ) {
              throw new Error('This student has already cast a ballot via Lab Booth.');
            }

            const candSnaps = await Promise.all(
              uniqueIds.map((id) => tx.get(doc(firebaseDb!, 'candidates', id)))
            );
            for (const snap of candSnaps) {
              if (!snap.exists()) throw new Error('Selected candidate does not exist.');
              const cand = snap.data() as Candidate;
              if (cand.status !== 'approved') throw new Error('Candidate is not approved.');
              tx.update(snap.ref, { votes: (cand.votes || 0) + 1 });
            }

            tx.update(userRef, {
              hasVoted: true,
              votedAt: nowIso,
              votingChannel: 'online',
              receiptCode,
            });
            if (lockSnap.exists()) {
              tx.update(lockRef, { hasVoted: true });
            }
            tx.update(cfgRef, {
              totalBallotsCast: (cData.totalBallotsCast || 0) + 1,
              lastUpdatedAt: nowIso,
            });
          });

          return {
            ok: true,
            message: `Vote submitted successfully. Receipt: ${receiptCode}`,
            data: {
              ...currentUser,
              hasVoted: true,
              votedAt: nowIso,
              votingChannel: 'online',
              receiptCode,
            },
          };
        } catch (err) {
          return {
            ok: false,
            message: err instanceof Error ? err.message : 'Failed to cast ballot.',
          };
        }
      }

      const { nextState, result } = localCastBallot(dbState, currentUser.uid, candidateIds);
      if (result.ok) notifyLocalSync(nextState);
      return result;
    },
    [currentUser, dbState, notifyLocalSync]
  );

  const submitCandidateApplication = useCallback(
    async (
      input: CandidateApplicationInput,
      initialStatus: CandidateStatus = 'pending'
    ): Promise<ActionResult<Candidate>> => {
      if (!currentUser) {
        return { ok: false, message: 'Sign in required before applying as a candidate.' };
      }
      if (isFirebaseConfigured && firebaseDb) {
        if (isProfileEditLockedPhase(dbState.config.currentPhase)) {
          return {
            ok: false,
            message: 'Candidate applications are permanently locked once Voting Live begins.',
          };
        }

        const isAdminDirectAdd =
          isAdmin && initialStatus === 'approved' && Boolean(input.targetStudentId);

        let targetStudentId = currentUser.studentId;
        let targetEmail = currentUser.email;
        let targetCohort = currentUser.cohort;
        let targetYear = currentUser.yearOfStudy;
        let targetProgram = currentUser.program;
        let targetName =
          sanitizeText(input.fullName || currentUser.fullName, 120) || currentUser.fullName;

        if (isAdminDirectAdd && input.targetStudentId) {
          const normalizedTarget = normalizeAiuStudentId(input.targetStudentId);
          const rosterStudent = findRosterStudent(normalizedTarget);
          if (!rosterStudent) {
            return {
              ok: false,
              message: `Student ID ${normalizedTarget} not found in SCI Cohort 4-7 roster.`,
            };
          }
          if (rosterStudent.cohort !== 'C5' && rosterStudent.cohort !== 'C6') {
            return {
              ok: false,
              message: 'Candidate eligibility requires Cohort 5 or Cohort 6.',
            };
          }
          targetStudentId = rosterStudent.studentId;
          targetCohort = rosterStudent.cohort;
          targetYear = rosterStudent.yearOfStudy;
          targetProgram = rosterStudent.program;
          targetName =
            sanitizeText(input.fullName || rosterStudent.fullName, 120) || rosterStudent.fullName;
          if (input.targetEmail) {
            if (!isValidAiuEmail(input.targetEmail)) {
              return {
                ok: false,
                message: 'Candidate email must end with @student.aiu.edu.my.',
              };
            }
            targetEmail = input.targetEmail.trim().toLowerCase();
          } else {
            const slug = targetName
              .toLowerCase()
              .replace(/[^a-z\s]/g, ' ')
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .join('.');
            targetEmail = `${slug}@student.aiu.edu.my`;
          }
        }

        if (targetCohort !== 'C5' && targetCohort !== 'C6') {
          return {
            ok: false,
            message:
              'Candidate eligibility requires Cohort 5 or Cohort 6 (at least one completed year in SCI).',
          };
        }
        if (!isAdminDirectAdd && !isOfficialShortlistedNominee(targetStudentId)) {
          return {
            ok: false,
            message:
              'Only the 26 officially announced SCI nominees are eligible to submit a candidate application.',
          };
        }

        const cleanCountry = sanitizeText(
          input.country || (!isAdminDirectAdd ? currentUser.country : '') || '',
          64
        );
        if (!cleanCountry) {
          return { ok: false, message: 'Please select candidate nationality.' };
        }

        const duplicate = dbState.candidates.find(
          (c) =>
            c.studentId.toUpperCase() === targetStudentId.toUpperCase() ||
            c.email.toLowerCase() === targetEmail.toLowerCase()
        );
        if (duplicate) {
          return {
            ok: false,
            message: `A candidate application already exists for ${duplicate.fullName} (${duplicate.studentId}).`,
          };
        }

        const id = `cand-${Date.now()}`;
        const maxNum = dbState.candidates.reduce((m, c) => Math.max(m, c.candidateNumber || 0), 0);
        const nowIso = new Date().toISOString();
        const newCand: Candidate = {
          id,
          candidateNumber: maxNum + 1,
          fullName: targetName,
          studentId: targetStudentId,
          email: targetEmail.toLowerCase(),
          cohort: targetCohort,
          yearOfStudy: targetYear === 3 ? 3 : 2,
          program: targetProgram,
          country: cleanCountry,
          manifesto:
            sanitizeText(input.manifesto || '', MAX_MANIFESTO_LENGTH) ||
            'Manifesto forthcoming ahead of Manifesto Day.',
          photoUrl:
            input.photoUrl?.trim() ||
            generateSvgAvatarDataUrl(
              targetName,
              `${shortProgramLabel(targetProgram).slice(0, 3).toUpperCase()} Y${targetYear}`
            ),
          status: initialStatus,
          votes: 0,
          createdAt: nowIso,
          updatedAt: nowIso,
          appointedRole: null,
        };
        await setDoc(doc(firebaseDb, 'candidates', id), newCand);
        return {
          ok: true,
          message:
            initialStatus === 'approved'
              ? `${newCand.fullName} added to approved contestants.`
              : 'Application submitted for Admin verification against the official shortlist.',
          data: newCand,
        };
      }

      const { nextState, result } = localSubmitCandidateApplication(
        dbState,
        currentUser,
        input,
        initialStatus
      );
      if (result.ok) notifyLocalSync(nextState);
      return result;
    },
    [currentUser, dbState, isAdmin, notifyLocalSync]
  );

  const setCandidateStatus = useCallback(
    async (id: string, status: CandidateStatus): Promise<ActionResult> => {
      if (!currentUser || !isAdmin) {
        return { ok: false, message: 'Admin permission required.' };
      }
      if (isFirebaseConfigured && firebaseDb) {
        await updateDoc(doc(firebaseDb, 'candidates', id), {
          status,
          updatedAt: new Date().toISOString(),
        });
        return { ok: true, message: `Candidate updated to ${status}.` };
      }

      const { nextState, result } = localSetCandidateStatus(dbState, currentUser, id, status);
      if (result.ok) notifyLocalSync(nextState);
      return result;
    },
    [currentUser, dbState, isAdmin, notifyLocalSync]
  );

  const updateCandidateDetails = useCallback(
    async (
      id: string,
      updates: { fullName?: string; country?: string; manifesto?: string; photoUrl?: string }
    ): Promise<ActionResult> => {
      if (!currentUser) return { ok: false, message: 'Sign in required.' };
      if (isProfileEditLockedPhase(dbState.config.currentPhase)) {
        return {
          ok: false,
          message: 'Candidate profiles are permanently locked once Voting Live begins.',
        };
      }

      if (isFirebaseConfigured && firebaseDb) {
        const cleanUpdates: Record<string, string> = {
          updatedAt: new Date().toISOString(),
        };
        if (updates.fullName !== undefined) cleanUpdates.fullName = sanitizeText(updates.fullName, 120);
        if (updates.country !== undefined) cleanUpdates.country = sanitizeText(updates.country, 64);
        if (updates.manifesto !== undefined) {
          cleanUpdates.manifesto = sanitizeText(updates.manifesto, MAX_MANIFESTO_LENGTH);
        }
        if (updates.photoUrl !== undefined) cleanUpdates.photoUrl = updates.photoUrl.trim();
        await updateDoc(doc(firebaseDb, 'candidates', id), cleanUpdates);
        return { ok: true, message: 'Candidate profile updated.' };
      }

      const { nextState, result } = localUpdateCandidateDetails(dbState, currentUser, id, updates);
      if (result.ok) notifyLocalSync(nextState);
      return { ok: result.ok, message: result.message };
    },
    [currentUser, dbState, notifyLocalSync]
  );

  const assignTopCommitteeRole = useCallback(
    async (id: string, role: TopCommitteeRole | null): Promise<ActionResult> => {
      if (!currentUser || !isAdmin) {
        return { ok: false, message: 'Admin permission required.' };
      }
      if (isFirebaseConfigured && firebaseDb) {
        await updateDoc(doc(firebaseDb, 'candidates', id), {
          appointedRole: role,
          updatedAt: new Date().toISOString(),
        });
        return { ok: true, message: 'Top Committee appointment updated.' };
      }
      const { nextState, result } = localAssignTopCommitteeRole(dbState, currentUser, id, role);
      if (result.ok) notifyLocalSync(nextState);
      return result;
    },
    [currentUser, dbState, isAdmin, notifyLocalSync]
  );

  const deleteCandidate = useCallback(
    async (id: string): Promise<ActionResult> => {
      if (!currentUser || !isAdmin) {
        return { ok: false, message: 'Admin permission required.' };
      }
      if (isProfileEditLockedPhase(dbState.config.currentPhase)) {
        return {
          ok: false,
          message: 'Candidate removal is locked once Voting Live begins.',
        };
      }
      if (isFirebaseConfigured && firebaseDb) {
        await deleteDoc(doc(firebaseDb, 'candidates', id));
        return { ok: true, message: 'Candidate entry removed.' };
      }
      const { nextState, result } = localDeleteCandidate(dbState, currentUser, id);
      if (result.ok) notifyLocalSync(nextState);
      return result;
    },
    [currentUser, dbState, isAdmin, notifyLocalSync]
  );

  const updateElectionPhase = useCallback(
    async (phase: ElectionPhase): Promise<ActionResult> => {
      if (!currentUser || !isAdmin) return { ok: false, message: 'Admin permission required.' };
      if (isFirebaseConfigured && firebaseDb) {
        await updateDoc(doc(firebaseDb, 'electionConfig', 'current'), {
          currentPhase: phase,
          lastUpdatedAt: new Date().toISOString(),
        });
        return { ok: true, message: `Election phase switched to ${phase}.` };
      }
      const { nextState, result } = localUpdatePhase(dbState, currentUser, phase);
      if (result.ok) notifyLocalSync(nextState);
      return result;
    },
    [currentUser, dbState, isAdmin, notifyLocalSync]
  );

  const updateElectionConfig = useCallback(
    async (
      partial: Partial<
        Pick<
          ElectionConfig,
          'currentPhase' | 'liveResultsPublic' | 'totalRegisteredVoters' | 'labBoothPin' | 'topAdvancingCount'
        >
      >
    ): Promise<ActionResult> => {
      if (!currentUser || !isAdmin) {
        return { ok: false, message: 'Admin permission required.' };
      }
      if (partial.labBoothPin !== undefined && !/^\d{4}$/.test(partial.labBoothPin)) {
        return {
          ok: false,
          message: 'Lab Booth Admin PIN must be exactly 4 digits.',
        };
      }
      if (
        partial.topAdvancingCount !== undefined &&
        partial.topAdvancingCount !== null &&
        (!Number.isInteger(partial.topAdvancingCount) || partial.topAdvancingCount < 1)
      ) {
        return {
          ok: false,
          message: 'Interview shortlist cutoff must be a positive whole number or set to Undecided.',
        };
      }
      if (isFirebaseConfigured && firebaseDb) {
        await updateDoc(doc(firebaseDb, 'electionConfig', 'current'), {
          ...partial,
          lastUpdatedAt: new Date().toISOString(),
        });
        return { ok: true, message: 'Election settings updated.' };
      }
      const { nextState, result } = localUpdateConfig(dbState, currentUser, partial);
      if (result.ok) notifyLocalSync(nextState);
      return result;
    },
    [currentUser, dbState, isAdmin, notifyLocalSync]
  );

  const manageAdminEmails = useCallback(
    async (action: 'add' | 'remove', email: string): Promise<ActionResult<string[]>> => {
      if (!currentUser || !isAdmin) {
        return { ok: false, message: 'Admin permission required.' };
      }
      const { nextState, result } = localManageAdminEmails(dbState, currentUser, action, email);
      if (result.ok) {
        if (isFirebaseConfigured && firebaseDb) {
          const cleanEmail = email.trim().toLowerCase();
          await updateDoc(doc(firebaseDb, 'electionConfig', 'current'), {
            adminEmails: nextState.config.adminEmails,
            lastUpdatedAt: new Date().toISOString(),
          });
          const matchingUser = Object.values(dbState.users).find(
            (u) => u.email.toLowerCase() === cleanEmail
          );
          if (matchingUser) {
            await updateDoc(doc(firebaseDb, 'users', matchingUser.uid), {
              role: action === 'add' ? 'admin' : 'voter',
            }).catch(() => {});
          }
        } else {
          notifyLocalSync(nextState);
        }
      }
      return result;
    },
    [currentUser, dbState, isAdmin, notifyLocalSync]
  );

  const adminUpdateUser = useCallback(
    async (targetUid: string, updates: AdminUpdateUserInput): Promise<ActionResult<UserProfile>> => {
      if (!currentUser || !isAdmin) {
        return { ok: false, message: 'Admin permission required.' };
      }

      if (isFirebaseConfigured && firebaseDb) {
        const cleanName = sanitizeText(updates.fullName, 120);
        const cleanStudentId = normalizeAiuStudentId(updates.studentId);
        const cleanCountry = sanitizeText(updates.country, 64);

        if (cleanName.length < 2) {
          return { ok: false, message: 'Full name must be at least 2 characters.' };
        }
        if (!/^AIU\d{7,10}$/.test(cleanStudentId)) {
          return { ok: false, message: 'Enter a valid AIU Student ID (e.g. AIU24102323).' };
        }
        if (!cleanCountry) {
          return { ok: false, message: 'Nationality is required.' };
        }

        try {
          let updatedProfile: UserProfile | undefined;
          await runTransaction(firebaseDb, async (tx) => {
            const userRef = doc(firebaseDb!, 'users', targetUid);
            const cfgRef = doc(firebaseDb!, 'electionConfig', 'current');
            const [userSnap, cfgSnap] = await Promise.all([tx.get(userRef), tx.get(cfgRef)]);
            if (!userSnap.exists()) {
              throw new Error('Registered user not found.');
            }
            const existing = userSnap.data() as UserProfile;
            if (
              existing.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase() &&
              updates.role !== 'admin'
            ) {
              throw new Error('Primary Tech Lead admin cannot be demoted to voter.');
            }
            if (cleanStudentId !== existing.studentId && existing.hasVoted) {
              throw new Error('Cannot change Student ID after a user has already cast a ballot.');
            }

            const claimedByOther = Object.values(dbState.users).find(
              (u) => u.uid !== targetUid && u.studentId.toUpperCase() === cleanStudentId.toUpperCase()
            );
            if (claimedByOther) {
              throw new Error(`Student ID ${cleanStudentId} is already bound to ${claimedByOther.fullName}.`);
            }

            const studentIdChanged = cleanStudentId !== existing.studentId;
            const oldLockRef = doc(firebaseDb!, 'studentLocks', existing.studentId);
            const newLockRef = doc(firebaseDb!, 'studentLocks', cleanStudentId);
            const [oldLockSnap, newLockSnap] = studentIdChanged
              ? await Promise.all([tx.get(oldLockRef), tx.get(newLockRef)])
              : [null, null];

            if (
              studentIdChanged &&
              newLockSnap?.exists() &&
              (newLockSnap.data() as { uid: string }).uid !== targetUid
            ) {
              throw new Error(`Student ID ${cleanStudentId} is already locked to another Google account.`);
            }

            const nextProfile: UserProfile = {
              ...existing,
              fullName: cleanName,
              studentId: cleanStudentId,
              cohort: updates.cohort,
              yearOfStudy: updates.yearOfStudy,
              program: updates.program,
              country: cleanCountry,
              role: updates.role,
              hasVoted: existing.hasVoted,
              votedAt: existing.votedAt,
              votingChannel: existing.votingChannel,
              receiptCode: existing.receiptCode,
            };
            updatedProfile = nextProfile;

            tx.update(userRef, {
              fullName: cleanName,
              studentId: cleanStudentId,
              cohort: updates.cohort,
              yearOfStudy: updates.yearOfStudy,
              program: updates.program,
              country: cleanCountry,
              role: updates.role,
            });

            if (studentIdChanged) {
              if (oldLockSnap?.exists()) {
                tx.delete(oldLockRef);
              }
              tx.set(newLockRef, {
                studentId: cleanStudentId,
                uid: targetUid,
                email: existing.email.toLowerCase(),
                hasVoted: existing.hasVoted,
              });
            }

            if (cfgSnap.exists()) {
              const cfg = cfgSnap.data() as ElectionConfig;
              const adminSet = new Set((cfg.adminEmails || []).map((e) => e.toLowerCase()));
              const emailLower = existing.email.toLowerCase();
              if (updates.role === 'admin') {
                adminSet.add(emailLower);
              } else if (emailLower !== PRIMARY_ADMIN_EMAIL.toLowerCase()) {
                adminSet.delete(emailLower);
              }
              tx.update(cfgRef, {
                adminEmails: Array.from(adminSet),
                lastUpdatedAt: new Date().toISOString(),
              });
            }

            const logId = `log-${Date.now()}`;
            tx.set(doc(firebaseDb!, 'auditLogs', logId), {
              id: logId,
              timestamp: new Date().toISOString(),
              actorName: currentUser.fullName,
              actorEmail: currentUser.email,
              action: 'ADMIN_USER_UPDATED',
              details: `Updated user ${nextProfile.fullName} (${nextProfile.studentId}, ${nextProfile.country}, role: ${nextProfile.role}). Ballot status untouched.`,
            });
          });

          return {
            ok: true,
            message: `Updated profile for ${updatedProfile?.fullName || updates.fullName}.`,
            data: updatedProfile,
          };
        } catch (err) {
          return {
            ok: false,
            message: err instanceof Error ? err.message : 'Unable to update user profile.',
          };
        }
      }

      const { nextState, result } = localAdminUpdateUser(dbState, currentUser, targetUid, updates);
      if (result.ok) notifyLocalSync(nextState);
      return result;
    },
    [currentUser, dbState, isAdmin, notifyLocalSync]
  );

  const startLabBoothSession = useCallback(
    (checkIn: LabBoothCheckInInput): ActionResult => {
      if (!currentUser || !isAdmin) {
        return { ok: false, message: 'Admin permission required to launch Lab Booth.' };
      }
      const check = validateLabBoothCheckIn(dbState, currentUser, checkIn);
      if (!check.ok || !check.data) {
        return { ok: false, message: check.message };
      }
      setLabBoothSession({
        activeCheckIn: check.data.resolvedCheckIn,
        kioskLocked: true,
        awaitingPinUnlock: false,
        lastReceiptCode: null,
        lastVoterName: null,
      });
      return { ok: true, message: check.message };
    },
    [currentUser, dbState, isAdmin]
  );

  const submitLabBoothBallot = useCallback(
    async (candidateIds: string[]): Promise<ActionResult<{ receiptCode: string }>> => {
      if (!currentUser || !isAdmin || !labBoothSession.activeCheckIn) {
        return { ok: false, message: 'No active Lab Booth student session.' };
      }

      if (isFirebaseConfigured && firebaseDb) {
        const check = validateLabBoothCheckIn(dbState, currentUser, labBoothSession.activeCheckIn);
        if (!check.ok || !check.data) {
          return { ok: false, message: check.message };
        }
        const ballotValid = validateBallotSelection(
          candidateIds,
          dbState.candidates,
          dbState.config.maxVotesPerBallot
        );
        if (!ballotValid.ok) return { ok: false, message: ballotValid.message };
        const resolved = check.data.resolvedCheckIn;
        const uniqueIds = Array.from(new Set(candidateIds));
        const receiptCode = generateReceiptCode(resolved.studentId || resolved.fullName.slice(0, 4));
        const nowIso = new Date().toISOString();
        const nameKey = normalizeFullNameKey(resolved.fullName, resolved.cohort);

        try {
          await runTransaction(firebaseDb, async (tx) => {
            const cfgRef = doc(firebaseDb!, 'electionConfig', 'current');
            const cfgSnap = await tx.get(cfgRef);
            const cData = cfgSnap.exists() ? (cfgSnap.data() as ElectionConfig) : dbState.config;
            if (cData.currentPhase !== 'VOTING_LIVE') {
              throw new Error('Voting is closed.');
            }
            const candSnaps = await Promise.all(
              uniqueIds.map((id) => tx.get(doc(firebaseDb!, 'candidates', id)))
            );
            for (const snap of candSnaps) {
              if (!snap.exists()) throw new Error('Candidate missing.');
              tx.update(snap.ref, { votes: ((snap.data() as Candidate).votes || 0) + 1 });
            }
            const nextIds = resolved.studentId
              ? Array.from(new Set([...(cData.votedStudentIds || []), resolved.studentId]))
              : cData.votedStudentIds || [];
            const nextNames = Array.from(new Set([...(cData.votedFullNames || []), nameKey]));
            tx.update(cfgRef, {
              totalBallotsCast: (cData.totalBallotsCast || 0) + 1,
              votedStudentIds: nextIds,
              votedFullNames: nextNames,
              lastUpdatedAt: nowIso,
            });
          });

          setLabBoothSession({
            activeCheckIn: null,
            kioskLocked: true,
            awaitingPinUnlock: true,
            lastReceiptCode: receiptCode,
            lastVoterName: resolved.fullName,
          });
          return {
            ok: true,
            message: `Lab Booth vote recorded (${receiptCode}).`,
            data: { receiptCode },
          };
        } catch (err) {
          return {
            ok: false,
            message: err instanceof Error ? err.message : 'Lab Booth ballot submission failed.',
          };
        }
      }

      const voterName = labBoothSession.activeCheckIn.fullName;
      const { nextState, result } = localCastLabBoothBallot(
        dbState,
        currentUser,
        labBoothSession.activeCheckIn,
        candidateIds
      );
      if (result.ok && result.data) {
        notifyLocalSync(nextState);
        setLabBoothSession({
          activeCheckIn: null,
          kioskLocked: true,
          awaitingPinUnlock: true,
          lastReceiptCode: result.data.receiptCode,
          lastVoterName: voterName,
        });
      }
      return result;
    },
    [currentUser, dbState, isAdmin, labBoothSession.activeCheckIn, notifyLocalSync]
  );

  const unlockLabBoothWithPin = useCallback(
    (pinInput: string): ActionResult => {
      if (pinInput.trim() !== dbState.config.labBoothPin) {
        return { ok: false, message: 'Incorrect 4-digit Admin PIN.' };
      }
      setLabBoothSession(INITIAL_LAB_SESSION);
      return { ok: true, message: 'Lab Booth reset and ready for the next student.' };
    },
    [dbState.config.labBoothPin]
  );

  const resetDemoDatabase = useCallback(() => {
    if (isFirebaseConfigured) return;
    const fresh = localResetDemoState();
    setSavedSessionUid('user-admin-abdulkarem');
    setCurrentUserUid('user-admin-abdulkarem');
    setPendingGoogleAccount(null);
    setC4TributeStudent(null);
    setLabBoothSession(INITIAL_LAB_SESSION);
    notifyLocalSync(fresh);
  }, [notifyLocalSync]);

  const value = useMemo<ElectionContextValue>(
    () => ({
      mode: isFirebaseConfigured ? 'firebase' : 'demo',
      loading,
      activeTab,
      setActiveTab,
      navigateProtected,
      authModalOpen,
      openAuthModal,
      closeAuthModal,
      applicationModalOpen,
      openApplicationModal,
      closeApplicationModal,
      profileEditModalOpen,
      openProfileEditModal,
      closeProfileEditModal,
      dbState,
      currentUser,
      myCandidateProfile,
      approvedCandidates,
      pendingCandidates,
      rankedCandidates,
      isAdmin,
      isProfileLocked,
      pendingGoogleAccount,
      cancelPendingGoogleAuth,
      c4TributeStudent,
      clearC4Tribute,
      beginGoogleOAuth,
      completeStudentIdLink,
      signOut,
      switchDemoPersona,
      simulateC4Visit,
      submitBallot,
      submitCandidateApplication,
      setCandidateStatus,
      updateCandidateDetails,
      assignTopCommitteeRole,
      deleteCandidate,
      updateElectionPhase,
      updateElectionConfig,
      manageAdminEmails,
      adminUpdateUser,
      labBoothSession,
      startLabBoothSession,
      submitLabBoothBallot,
      unlockLabBoothWithPin,
      resetDemoDatabase,
    }),
    [
      activeTab,
      adminUpdateUser,
      applicationModalOpen,
      approvedCandidates,
      assignTopCommitteeRole,
      authModalOpen,
      beginGoogleOAuth,
      c4TributeStudent,
      cancelPendingGoogleAuth,
      clearC4Tribute,
      closeApplicationModal,
      closeAuthModal,
      closeProfileEditModal,
      completeStudentIdLink,
      currentUser,
      dbState,
      deleteCandidate,
      isAdmin,
      isProfileLocked,
      labBoothSession,
      loading,
      manageAdminEmails,
      myCandidateProfile,
      navigateProtected,
      openApplicationModal,
      openAuthModal,
      openProfileEditModal,
      pendingCandidates,
      pendingGoogleAccount,
      profileEditModalOpen,
      rankedCandidates,
      resetDemoDatabase,
      setActiveTab,
      setCandidateStatus,
      signOut,
      simulateC4Visit,
      startLabBoothSession,
      submitBallot,
      submitCandidateApplication,
      submitLabBoothBallot,
      switchDemoPersona,
      unlockLabBoothWithPin,
      updateCandidateDetails,
      updateElectionConfig,
      updateElectionPhase,
    ]
  );

  return <ElectionContext.Provider value={value}>{children}</ElectionContext.Provider>;
};

export function useElection(): ElectionContextValue {
  const ctx = useContext(ElectionContext);
  if (!ctx) {
    throw new Error('useElection must be used inside an ElectionProvider.');
  }
  return ctx;
}
