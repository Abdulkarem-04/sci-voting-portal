import { findRosterStudent } from '../data/cohortRoster';
import { verifyEmailMatchesRosterStudent } from '../data/cohortRoster';
import { createInitialSeedState, PRIMARY_ADMIN_EMAIL } from '../data/seedData';
import {
  ActionResult,
  AuditLogEntry,
  AuthRosterInput,
  AuthRosterResponse,
  Candidate,
  CandidateApplicationInput,
  CandidateStatus,
  ElectionConfig,
  ElectionDatabaseState,
  ElectionPhase,
  LabBoothCheckInInput,
  TopCommitteeRole,
  UserProfile,
} from '../types/election';
import {
  generateSvgAvatarDataUrl,
  isValidAdminInviteEmail,
  isValidAiuEmail,
  normalizeAiuStudentId,
  shortProgramLabel,
} from '../utils/imageUtils';

export const STORAGE_KEY = 'sci_voting_portal_2026_2027_db_v2';
const SESSION_KEY = 'sci_voting_portal_2026_2027_session_uid_v2';
const CHANNEL_NAME = 'sci-voting-2026-2027-sync-v2';

const VALID_PHASES: ElectionPhase[] = ['NOMINATIONS', 'CAMPAIGN', 'VOTING_LIVE', 'ENDED'];

function cloneState<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function sanitizeText(raw: string, maxLength = 800): string {
  const withoutTags = raw
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
  return withoutTags.slice(0, maxLength);
}

export function normalizeFullNameKey(fullName: string, cohort: string): string {
  const cleanName = fullName.trim().toLowerCase().replace(/\s+/g, ' ');
  return `${cleanName}|${cohort.trim().toUpperCase()}`;
}

export function isProfileEditLockedPhase(phase: ElectionPhase): boolean {
  return phase === 'VOTING_LIVE' || phase === 'ENDED';
}

export function loadLocalDatabase(): ElectionDatabaseState {
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ElectionDatabaseState;
        if (
          parsed &&
          parsed.config &&
          VALID_PHASES.includes(parsed.config.currentPhase) &&
          Array.isArray(parsed.candidates) &&
          parsed.users &&
          Array.isArray(parsed.c4Visits)
        ) {
          return parsed;
        }
      }
    } catch {
      // Corrupted cache resets to clean seed state
    }
  }
  const fresh = createInitialSeedState();
  saveLocalDatabase(fresh);
  return fresh;
}

export function saveLocalDatabase(state: ElectionDatabaseState): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota issues cleanly
  }
}

export function getSavedSessionUid(): string | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function setSavedSessionUid(uid: string | null): void {
  if (typeof localStorage === 'undefined') return;
  try {
    if (uid) {
      localStorage.setItem(SESSION_KEY, uid);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

export function createBroadcastChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === 'undefined') return null;
  try {
    return new BroadcastChannel(CHANNEL_NAME);
  } catch {
    return null;
  }
}

export function appendAuditLog(
  state: ElectionDatabaseState,
  actor: Pick<UserProfile, 'fullName' | 'email'>,
  action: string,
  details: string
): AuditLogEntry[] {
  const entry: AuditLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    actorName: sanitizeText(actor.fullName, 120),
    actorEmail: sanitizeText(actor.email, 120),
    action,
    details: sanitizeText(details, 300),
  };
  return [entry, ...state.auditLogs].slice(0, 100);
}

export function generateReceiptCode(studentId: string): string {
  const suffix = Math.random()
    .toString(36)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 4)
    .padEnd(4, 'X');
  const cleanId = studentId.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  const tag = (cleanId || 'LAB0').slice(-4).padStart(4, '0');
  return `SCI-2627-${tag}-${suffix}`;
}

export function validateBallotSelection(
  candidateIds: string[],
  candidates: Candidate[],
  maxVotesPerBallot: number
): ActionResult {
  if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
    return { ok: false, message: 'Select at least 1 candidate before submitting your ballot.' };
  }
  const uniqueIds = Array.from(new Set(candidateIds));
  if (uniqueIds.length !== candidateIds.length) {
    return { ok: false, message: 'Duplicate candidate selections are not allowed on a ballot.' };
  }
  if (uniqueIds.length > maxVotesPerBallot) {
    return {
      ok: false,
      message: `You may select at most ${maxVotesPerBallot} candidates per ballot.`,
    };
  }
  const approvedSet = new Set(
    candidates.filter((c) => c.status === 'approved').map((c) => c.id)
  );
  for (const id of uniqueIds) {
    if (!approvedSet.has(id)) {
      return {
        ok: false,
        message: 'One or more selected entries are not approved contestants.',
      };
    }
  }
  return { ok: true, message: 'Valid ballot selection.' };
}

export function localAuthenticateWithRoster(
  state: ElectionDatabaseState,
  params: AuthRosterInput
): { nextState: ElectionDatabaseState; result: ActionResult<AuthRosterResponse> } {
  const email = params.email.trim().toLowerCase();
  const googleDisplayName = sanitizeText(params.googleDisplayName || '', 120);
  const studentId = normalizeAiuStudentId(params.studentIdInput);
  const country = sanitizeText(params.country || 'Malaysia', 64) || 'Malaysia';

  if (!isValidAiuEmail(email)) {
    return {
      nextState: state,
      result: {
        ok: false,
        message: 'Only official @student.aiu.edu.my Google accounts may access this portal.',
      },
    };
  }

  if (!/^AIU\d{7,10}$/.test(studentId)) {
    return {
      nextState: state,
      result: {
        ok: false,
        message: 'Enter a valid AIU Student ID (for example: AIU24102323).',
      },
    };
  }

  const rosterStudent = findRosterStudent(studentId);
  if (!rosterStudent) {
    return {
      nextState: state,
      result: {
        ok: false,
        message: `Student ID ${studentId} was not found in the official SCI Cohort 4-7 roster.`,
      },
    };
  }

  const matchCheck = verifyEmailMatchesRosterStudent(email, googleDisplayName, rosterStudent);
  if (!matchCheck.ok) {
    const blockedState = cloneState(state);
    blockedState.auditLogs = appendAuditLog(
      blockedState,
      { fullName: googleDisplayName || email, email },
      'SECURITY_ID_SPOOF_BLOCKED',
      `Blocked mismatched login attempt for ${rosterStudent.studentId} (${rosterStudent.fullName}) from ${email}.`
    );
    saveLocalDatabase(blockedState);
    return {
      nextState: blockedState,
      result: {
        ok: false,
        message:
          matchCheck.reason ||
          'Verification failed: your @student.aiu.edu.my account does not match this Student ID.',
      },
    };
  }

  // Cohort 4 Graduating Senior Tribute & Reach Tracking
  if (rosterStudent.cohort === 'C4') {
    const next = cloneState(state);
    const nowIso = new Date().toISOString();
    const existingIdx = next.c4Visits.findIndex((v) => v.studentId === rosterStudent.studentId);
    const visitRecord = {
      id: existingIdx >= 0 ? next.c4Visits[existingIdx].id : `c4v-${Date.now()}`,
      studentId: rosterStudent.studentId,
      fullName: rosterStudent.fullName,
      email,
      program: rosterStudent.program,
      timestamp: nowIso,
    };
    if (existingIdx >= 0) {
      next.c4Visits.splice(existingIdx, 1);
    }
    next.c4Visits = [visitRecord, ...next.c4Visits];
    next.auditLogs = appendAuditLog(
      next,
      { fullName: rosterStudent.fullName, email },
      'C4_TRIBUTE_VIEWED',
      `Cohort 4 graduating senior ${rosterStudent.fullName} (${rosterStudent.studentId}) visited the portal.`
    );
    saveLocalDatabase(next);
    return {
      nextState: next,
      result: {
        ok: true,
        message: `Congratulations on graduating, ${rosterStudent.fullName}. SCI Cohort 4 seniors are honored but not eligible to vote.`,
        data: { c4Senior: rosterStudent },
      },
    };
  }

  // 1-to-1 permanent binding checks (prevents claiming another student's ID or swapping IDs on same email)
  const existingUsers = Object.values(state.users);
  const idClaimedByOtherEmail = existingUsers.find(
    (u) => u.studentId === rosterStudent.studentId && u.email.toLowerCase() !== email
  );
  if (idClaimedByOtherEmail) {
    const blockedState = cloneState(state);
    blockedState.auditLogs = appendAuditLog(
      blockedState,
      { fullName: googleDisplayName || email, email },
      'SECURITY_DUPLICATE_BINDING_BLOCKED',
      `Blocked ${email} from claiming ${rosterStudent.studentId}, already bound to ${idClaimedByOtherEmail.email}.`
    );
    saveLocalDatabase(blockedState);
    return {
      nextState: blockedState,
      result: {
        ok: false,
        message: 'This Student ID is already linked to another verified Google account.',
      },
    };
  }

  const emailClaimedOtherId = existingUsers.find(
    (u) => u.email.toLowerCase() === email && u.studentId !== rosterStudent.studentId
  );
  if (emailClaimedOtherId) {
    const blockedState = cloneState(state);
    blockedState.auditLogs = appendAuditLog(
      blockedState,
      { fullName: googleDisplayName || email, email },
      'SECURITY_DUPLICATE_BINDING_BLOCKED',
      `Blocked ${email} (bound to ${emailClaimedOtherId.studentId}) from switching to ${rosterStudent.studentId}.`
    );
    saveLocalDatabase(blockedState);
    return {
      nextState: blockedState,
      result: {
        ok: false,
        message: 'This Google account is already permanently linked to another Student ID.',
      },
    };
  }

  const next = cloneState(state);
  const nowIso = new Date().toISOString();
  const isConfiguredAdmin = next.config.adminEmails
    .map((e) => e.toLowerCase())
    .includes(email);
  const nameKey = normalizeFullNameKey(rosterStudent.fullName, rosterStudent.cohort);
  const alreadyVotedInConfig =
    next.config.votedStudentIds.includes(rosterStudent.studentId) ||
    next.config.votedFullNames.includes(nameKey);

  const existingSameStudent = Object.values(next.users).find(
    (u) => u.studentId === rosterStudent.studentId && u.email.toLowerCase() === email
  );

  let profile: UserProfile;
  if (existingSameStudent) {
    profile = {
      ...existingSameStudent,
      fullName: rosterStudent.fullName,
      cohort: rosterStudent.cohort,
      yearOfStudy: rosterStudent.yearOfStudy,
      program: rosterStudent.program,
      country: params.country ? country : existingSameStudent.country,
      role: isConfiguredAdmin ? 'admin' : 'voter',
      hasVoted: existingSameStudent.hasVoted || alreadyVotedInConfig,
    };
    next.users[profile.uid] = profile;
  } else {
    const uid =
      params.uid && !next.users[params.uid]
        ? params.uid
        : `user-${rosterStudent.studentId.toLowerCase()}-${Date.now().toString(36)}`;
    profile = {
      uid,
      fullName: rosterStudent.fullName,
      studentId: rosterStudent.studentId,
      email,
      cohort: rosterStudent.cohort,
      yearOfStudy: rosterStudent.yearOfStudy,
      program: rosterStudent.program,
      country,
      role: isConfiguredAdmin ? 'admin' : 'voter',
      hasVoted: alreadyVotedInConfig,
      votedAt: alreadyVotedInConfig ? nowIso : null,
      votingChannel: alreadyVotedInConfig ? 'lab_booth' : null,
      receiptCode: alreadyVotedInConfig ? generateReceiptCode(rosterStudent.studentId) : null,
      createdAt: nowIso,
    };
    next.users[uid] = profile;
    next.auditLogs = appendAuditLog(
      next,
      profile,
      'VOTER_VERIFIED_OAUTH',
      `Verified ${profile.fullName} (${profile.studentId}, ${profile.cohort}) via Google OAuth.`
    );
  }

  saveLocalDatabase(next);
  setSavedSessionUid(profile.uid);

  return {
    nextState: next,
    result: {
      ok: true,
      message: `Signed in as ${profile.fullName} (${profile.cohort}).`,
      data: { user: profile },
    },
  };
}

export function localCastBallot(
  state: ElectionDatabaseState,
  uid: string,
  candidateIds: string[]
): { nextState: ElectionDatabaseState; result: ActionResult<UserProfile> } {
  const user = state.users[uid];
  if (!user) {
    return { nextState: state, result: { ok: false, message: 'Please sign in first.' } };
  }
  if (user.cohort !== 'C5' && user.cohort !== 'C6' && user.cohort !== 'C7') {
    return {
      nextState: state,
      result: { ok: false, message: 'Only eligible Cohort 5, 6, and 7 SCI students may vote.' },
    };
  }
  if (state.config.currentPhase !== 'VOTING_LIVE') {
    return {
      nextState: state,
      result: {
        ok: false,
        message: 'Online voting is currently closed. Voting opens only during Phase 3 (Voting Live).',
      },
    };
  }

  const nameKey = normalizeFullNameKey(user.fullName, user.cohort);
  if (
    user.hasVoted ||
    state.config.votedStudentIds.includes(user.studentId) ||
    state.config.votedFullNames.includes(nameKey)
  ) {
    return {
      nextState: state,
      result: { ok: false, message: 'You have already submitted your official ballot.' },
    };
  }

  const validation = validateBallotSelection(
    candidateIds,
    state.candidates,
    state.config.maxVotesPerBallot
  );
  if (!validation.ok) {
    return { nextState: state, result: { ok: false, message: validation.message } };
  }

  const uniqueIds = Array.from(new Set(candidateIds));
  const next = cloneState(state);
  const nowIso = new Date().toISOString();
  const receiptCode = generateReceiptCode(user.studentId);

  next.candidates = next.candidates.map((cand) =>
    uniqueIds.includes(cand.id) ? { ...cand, votes: cand.votes + 1 } : cand
  );

  // Strictly keep ballots secret: never persist votedCandidateIds on UserProfile or AuditLog
  next.users[uid] = {
    ...next.users[uid],
    hasVoted: true,
    votedAt: nowIso,
    votingChannel: 'online',
    receiptCode,
  };

  if (!next.config.votedStudentIds.includes(user.studentId)) {
    next.config.votedStudentIds.push(user.studentId);
  }
  if (!next.config.votedFullNames.includes(nameKey)) {
    next.config.votedFullNames.push(nameKey);
  }

  next.config.totalBallotsCast += 1;
  next.config.lastUpdatedAt = nowIso;
  next.auditLogs = appendAuditLog(
    next,
    next.users[uid],
    'BALLOT_CAST_ONLINE',
    `Submitted secret ballot via online portal (${uniqueIds.length} selection${uniqueIds.length > 1 ? 's' : ''}) | Receipt ${receiptCode}.`
  );

  saveLocalDatabase(next);
  return {
    nextState: next,
    result: {
      ok: true,
      message: `Vote submitted successfully. Verification receipt: ${receiptCode}`,
      data: next.users[uid],
    },
  };
}

export function validateLabBoothCheckIn(
  state: ElectionDatabaseState,
  adminActor: UserProfile,
  input: LabBoothCheckInInput
): ActionResult<{ resolvedCheckIn: LabBoothCheckInInput }> {
  if (adminActor.role !== 'admin') {
    return { ok: false, message: 'Admin permission required to operate the Lab Voting Booth.' };
  }
  if (state.config.currentPhase !== 'VOTING_LIVE') {
    return {
      ok: false,
      message: 'Lab Voting Booth is only active during Phase 3 (3. Voting Live).',
    };
  }

  const cleanName = sanitizeText(input.fullName, 120);
  const cleanCountry = sanitizeText(input.country, 64);
  const cleanId = input.studentId ? normalizeAiuStudentId(input.studentId) : '';
  const cleanEmail = input.email ? input.email.trim().toLowerCase() : '';

  if (cleanName.length < 2) {
    return { ok: false, message: 'Student full name is mandatory for Lab Booth check-in.' };
  }
  if (input.cohort !== 'C5' && input.cohort !== 'C6' && input.cohort !== 'C7') {
    return { ok: false, message: 'Cohort must be C5, C6, or C7.' };
  }
  if (!cleanCountry) {
    return { ok: false, message: 'Student country is mandatory for Lab Booth check-in.' };
  }
  if (cleanEmail && !isValidAiuEmail(cleanEmail)) {
    return { ok: false, message: 'Optional student email must end with @student.aiu.edu.my.' };
  }

  let resolvedName = cleanName;
  let resolvedCohort = input.cohort;
  let resolvedProgram = input.program;

  if (cleanId) {
    if (!/^AIU\d{7,10}$/.test(cleanId)) {
      return { ok: false, message: 'Invalid AIU Student ID format.' };
    }
    const rosterMatch = findRosterStudent(cleanId);
    if (rosterMatch) {
      if (rosterMatch.cohort === 'C4') {
        return {
          ok: false,
          message: `Cohort 4 graduating senior ${rosterMatch.fullName} (${cleanId}) is not eligible to vote.`,
        };
      }
      resolvedName = rosterMatch.fullName;
      resolvedCohort = rosterMatch.cohort;
      resolvedProgram = rosterMatch.program;
    }

    if (state.config.votedStudentIds.includes(cleanId)) {
      return { ok: false, message: `Student ID ${cleanId} has already cast a ballot.` };
    }
    const existingVotedUserById = Object.values(state.users).find(
      (u) => u.studentId === cleanId && u.hasVoted
    );
    if (existingVotedUserById) {
      return { ok: false, message: `Student ID ${cleanId} has already cast a ballot online.` };
    }
  }

  const nameKey = normalizeFullNameKey(resolvedName, resolvedCohort);
  if (state.config.votedFullNames.includes(nameKey)) {
    return {
      ok: false,
      message: `${resolvedName} (${resolvedCohort}) has already cast a ballot.`,
    };
  }
  const existingVotedUserByName = Object.values(state.users).find(
    (u) => normalizeFullNameKey(u.fullName, u.cohort) === nameKey && u.hasVoted
  );
  if (existingVotedUserByName) {
    return {
      ok: false,
      message: `${resolvedName} (${resolvedCohort}) has already voted online.`,
    };
  }

  return {
    ok: true,
    message: 'Student checked in for Lab Voting Booth.',
    data: {
      resolvedCheckIn: {
        fullName: resolvedName,
        cohort: resolvedCohort,
        program: resolvedProgram,
        country: cleanCountry,
        studentId: cleanId || undefined,
        email: cleanEmail || undefined,
      },
    },
  };
}

export function localCastLabBoothBallot(
  state: ElectionDatabaseState,
  adminActor: UserProfile,
  input: LabBoothCheckInInput,
  candidateIds: string[]
): { nextState: ElectionDatabaseState; result: ActionResult<{ receiptCode: string }> } {
  const check = validateLabBoothCheckIn(state, adminActor, input);
  if (!check.ok || !check.data) {
    return { nextState: state, result: { ok: false, message: check.message } };
  }

  const ballotValid = validateBallotSelection(
    candidateIds,
    state.candidates,
    state.config.maxVotesPerBallot
  );
  if (!ballotValid.ok) {
    return { nextState: state, result: { ok: false, message: ballotValid.message } };
  }

  const resolved = check.data.resolvedCheckIn;
  const uniqueIds = Array.from(new Set(candidateIds));
  const next = cloneState(state);
  const nowIso = new Date().toISOString();
  const receiptCode = generateReceiptCode(resolved.studentId || resolved.fullName.slice(0, 4));
  const nameKey = normalizeFullNameKey(resolved.fullName, resolved.cohort);

  next.candidates = next.candidates.map((cand) =>
    uniqueIds.includes(cand.id) ? { ...cand, votes: cand.votes + 1 } : cand
  );

  if (resolved.studentId && !next.config.votedStudentIds.includes(resolved.studentId)) {
    next.config.votedStudentIds.push(resolved.studentId);
  }
  if (!next.config.votedFullNames.includes(nameKey)) {
    next.config.votedFullNames.push(nameKey);
  }

  // Synchronize lock onto any matching online profile so they cannot later vote online
  Object.keys(next.users).forEach((uid) => {
    const u = next.users[uid];
    const sameId = resolved.studentId && u.studentId === resolved.studentId;
    const sameNameCohort = normalizeFullNameKey(u.fullName, u.cohort) === nameKey;
    if (sameId || sameNameCohort) {
      next.users[uid] = {
        ...u,
        hasVoted: true,
        votedAt: nowIso,
        votingChannel: 'lab_booth',
        receiptCode,
      };
    }
  });

  next.config.totalBallotsCast += 1;
  next.config.lastUpdatedAt = nowIso;
  next.auditLogs = appendAuditLog(
    next,
    adminActor,
    'LAB_BALLOT_AUTHORIZED',
    `Authorized Lab Booth ballot for ${resolved.fullName} (${resolved.cohort}${resolved.studentId ? `, ${resolved.studentId}` : ''}) | Receipt ${receiptCode}.`
  );

  saveLocalDatabase(next);
  return {
    nextState: next,
    result: {
      ok: true,
      message: `Lab Booth vote recorded (${receiptCode}). Kiosk locked for Admin PIN unlock.`,
      data: { receiptCode },
    },
  };
}

export function localSubmitCandidateApplication(
  state: ElectionDatabaseState,
  actor: UserProfile,
  input: CandidateApplicationInput,
  initialStatus: CandidateStatus = 'pending'
): { nextState: ElectionDatabaseState; result: ActionResult<Candidate> } {
  if (isProfileEditLockedPhase(state.config.currentPhase)) {
    return {
      nextState: state,
      result: {
        ok: false,
        message: 'Candidate applications are permanently locked once Voting Live begins.',
      },
    };
  }

  let targetStudentId = actor.studentId;
  let targetEmail = actor.email;
  let targetCohort = actor.cohort;
  let targetYear = actor.yearOfStudy;
  let targetProgram = actor.program;
  let targetFullName = sanitizeText(input.fullName || actor.fullName, 120) || actor.fullName;

  if (actor.role === 'admin' && initialStatus === 'approved' && input.targetStudentId) {
    const normalizedTarget = normalizeAiuStudentId(input.targetStudentId);
    const rosterStudent = findRosterStudent(normalizedTarget);
    if (!rosterStudent) {
      return {
        nextState: state,
        result: {
          ok: false,
          message: `Student ID ${normalizedTarget} not found in SCI Cohort 4-7 roster.`,
        },
      };
    }
    if (rosterStudent.cohort !== 'C5' && rosterStudent.cohort !== 'C6') {
      return {
        nextState: state,
        result: {
          ok: false,
          message: 'Candidate eligibility requires Cohort 5 or Cohort 6.',
        },
      };
    }
    targetStudentId = rosterStudent.studentId;
    targetCohort = rosterStudent.cohort;
    targetYear = rosterStudent.yearOfStudy;
    targetProgram = rosterStudent.program;
    targetFullName = sanitizeText(input.fullName || rosterStudent.fullName, 120) || rosterStudent.fullName;
    if (input.targetEmail) {
      if (!isValidAiuEmail(input.targetEmail)) {
        return {
          nextState: state,
          result: { ok: false, message: 'Candidate email must end with @student.aiu.edu.my.' },
        };
      }
      targetEmail = input.targetEmail.trim().toLowerCase();
    } else {
      const slug = targetFullName
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
      nextState: state,
      result: {
        ok: false,
        message: 'Candidate eligibility requires Cohort 5 or Cohort 6 (at least one completed year in SCI).',
      },
    };
  }

  const approvedCount = state.candidates.filter((c) => c.status === 'approved').length;
  if (approvedCount >= state.config.maxApprovedCandidates) {
    return {
      nextState: state,
      result: {
        ok: false,
        message: `Maximum limit of ${state.config.maxApprovedCandidates} approved contestants reached.`,
      },
    };
  }

  const duplicate = state.candidates.find(
    (c) =>
      c.studentId.toUpperCase() === targetStudentId.toUpperCase() ||
      c.email.toLowerCase() === targetEmail.toLowerCase()
  );
  if (duplicate) {
    return {
      nextState: state,
      result: {
        ok: false,
        message: `A candidate application already exists for ${duplicate.fullName} (${duplicate.studentId}).`,
      },
    };
  }

  const next = cloneState(state);
  const maxNum = next.candidates.reduce((acc, c) => Math.max(acc, c.candidateNumber), 0);
  const nowIso = new Date().toISOString();
  const cleanCountry = sanitizeText(input.country || actor.country || 'Malaysia', 64) || 'Malaysia';
  const cleanManifesto = sanitizeText(input.manifesto || '', 1200);
  const avatarTag = `${shortProgramLabel(targetProgram).slice(0, 3).toUpperCase()} Y${targetYear}`;

  const newCandidate: Candidate = {
    id: `cand-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    candidateNumber: maxNum + 1,
    fullName: targetFullName,
    studentId: targetStudentId,
    email: targetEmail.toLowerCase(),
    cohort: targetCohort,
    yearOfStudy: targetYear === 3 ? 3 : 2,
    program: targetProgram,
    country: cleanCountry,
    manifesto: cleanManifesto || 'Manifesto forthcoming ahead of Manifesto Day.',
    photoUrl: input.photoUrl?.trim() || generateSvgAvatarDataUrl(targetFullName, avatarTag),
    status: initialStatus,
    votes: 0,
    createdAt: nowIso,
    updatedAt: nowIso,
    appointedRole: null,
  };

  next.candidates.push(newCandidate);
  next.config.lastUpdatedAt = nowIso;
  next.auditLogs = appendAuditLog(
    next,
    actor,
    initialStatus === 'approved' ? 'CANDIDATE_ADDED_APPROVED' : 'CANDIDATE_APPLIED',
    `${newCandidate.fullName} (${newCandidate.studentId}, ${newCandidate.cohort}) submitted as ${initialStatus}.`
  );

  saveLocalDatabase(next);
  return {
    nextState: next,
    result: {
      ok: true,
      message:
        initialStatus === 'approved'
          ? `${newCandidate.fullName} added to approved contestants.`
          : 'Application submitted for Admin verification against the Dean shortlist.',
      data: newCandidate,
    },
  };
}

export function localSetCandidateStatus(
  state: ElectionDatabaseState,
  actor: UserProfile,
  candidateId: string,
  status: CandidateStatus
): { nextState: ElectionDatabaseState; result: ActionResult } {
  if (actor.role !== 'admin') {
    return { nextState: state, result: { ok: false, message: 'Admin permission required.' } };
  }
  const idx = state.candidates.findIndex((c) => c.id === candidateId);
  if (idx === -1) {
    return { nextState: state, result: { ok: false, message: 'Candidate not found.' } };
  }

  const approvedCount = state.candidates.filter(
    (c) => c.status === 'approved' && c.id !== candidateId
  ).length;
  if (status === 'approved' && approvedCount >= state.config.maxApprovedCandidates) {
    return {
      nextState: state,
      result: {
        ok: false,
        message: `Cannot approve: maximum limit of ${state.config.maxApprovedCandidates} approved contestants reached.`,
      },
    };
  }

  const next = cloneState(state);
  const cand = next.candidates[idx];
  cand.status = status;
  cand.updatedAt = new Date().toISOString();
  if (status !== 'approved') {
    cand.appointedRole = null;
  }
  next.config.lastUpdatedAt = cand.updatedAt;
  next.auditLogs = appendAuditLog(
    next,
    actor,
    'CANDIDATE_STATUS_UPDATED',
    `Set ${cand.fullName} (${cand.studentId}) status to ${status.toUpperCase()}.`
  );

  saveLocalDatabase(next);
  return {
    nextState: next,
    result: { ok: true, message: `${cand.fullName} marked as ${status}.` },
  };
}

export function localUpdateCandidateDetails(
  state: ElectionDatabaseState,
  actor: UserProfile,
  candidateId: string,
  updates: { fullName?: string; country?: string; manifesto?: string; photoUrl?: string }
): { nextState: ElectionDatabaseState; result: ActionResult<Candidate> } {
  if (isProfileEditLockedPhase(state.config.currentPhase)) {
    return {
      nextState: state,
      result: {
        ok: false,
        message: 'Candidate profiles are permanently locked once Voting Live begins.',
      },
    };
  }

  const idx = state.candidates.findIndex((c) => c.id === candidateId);
  if (idx === -1) {
    return { nextState: state, result: { ok: false, message: 'Candidate not found.' } };
  }

  const target = state.candidates[idx];
  const isOwnerApproved =
    actor.studentId === target.studentId && target.status === 'approved';
  if (actor.role !== 'admin' && !isOwnerApproved) {
    return {
      nextState: state,
      result: {
        ok: false,
        message: 'Only approved candidates editing their own profile or Admins may edit candidate details.',
      },
    };
  }

  const next = cloneState(state);
  const nowIso = new Date().toISOString();
  const nextName =
    updates.fullName !== undefined
      ? sanitizeText(updates.fullName, 120)
      : target.fullName;
  if (!nextName) {
    return { nextState: state, result: { ok: false, message: 'Candidate name cannot be empty.' } };
  }

  const nextCountry =
    updates.country !== undefined
      ? sanitizeText(updates.country, 64) || target.country
      : target.country;
  const nextManifesto =
    updates.manifesto !== undefined
      ? sanitizeText(updates.manifesto, 1200)
      : target.manifesto;
  const nextPhotoUrl =
    updates.photoUrl !== undefined ? updates.photoUrl.trim() : target.photoUrl;

  next.candidates[idx] = {
    ...next.candidates[idx],
    fullName: nextName,
    country: nextCountry,
    manifesto: nextManifesto || 'Manifesto forthcoming ahead of Manifesto Day.',
    photoUrl: nextPhotoUrl || target.photoUrl,
    updatedAt: nowIso,
  };
  next.config.lastUpdatedAt = nowIso;
  next.auditLogs = appendAuditLog(
    next,
    actor,
    'CANDIDATE_PROFILE_UPDATED',
    `Updated candidate profile for ${next.candidates[idx].fullName}.`
  );

  saveLocalDatabase(next);
  return {
    nextState: next,
    result: {
      ok: true,
      message: 'Candidate profile updated successfully.',
      data: next.candidates[idx],
    },
  };
}

export function localAssignTopCommitteeRole(
  state: ElectionDatabaseState,
  actor: UserProfile,
  candidateId: string,
  role: TopCommitteeRole | null
): { nextState: ElectionDatabaseState; result: ActionResult } {
  if (actor.role !== 'admin') {
    return { nextState: state, result: { ok: false, message: 'Admin permission required.' } };
  }
  const next = cloneState(state);
  const target = next.candidates.find((c) => c.id === candidateId);
  if (!target) {
    return { nextState: state, result: { ok: false, message: 'Candidate not found.' } };
  }

  if (role) {
    next.candidates = next.candidates.map((c) =>
      c.appointedRole === role && c.id !== candidateId ? { ...c, appointedRole: null } : c
    );
  }

  target.appointedRole = role;
  next.config.lastUpdatedAt = new Date().toISOString();
  next.auditLogs = appendAuditLog(
    next,
    actor,
    'TOP_COMMITTEE_ASSIGNED',
    role
      ? `Appointed ${target.fullName} as ${role}.`
      : `Cleared Top Committee appointment for ${target.fullName}.`
  );

  saveLocalDatabase(next);
  return {
    nextState: next,
    result: {
      ok: true,
      message: role
        ? `Appointed ${target.fullName} as ${role}.`
        : `Cleared appointment for ${target.fullName}.`,
    },
  };
}

export function localDeleteCandidate(
  state: ElectionDatabaseState,
  actor: UserProfile,
  candidateId: string
): { nextState: ElectionDatabaseState; result: ActionResult } {
  if (actor.role !== 'admin') {
    return { nextState: state, result: { ok: false, message: 'Admin permission required.' } };
  }
  const target = state.candidates.find((c) => c.id === candidateId);
  if (!target) {
    return { nextState: state, result: { ok: false, message: 'Candidate not found.' } };
  }

  const next = cloneState(state);
  next.candidates = next.candidates.filter((c) => c.id !== candidateId);
  next.config.lastUpdatedAt = new Date().toISOString();
  next.auditLogs = appendAuditLog(
    next,
    actor,
    'CANDIDATE_REMOVED',
    `Removed candidate entry: ${target.fullName} (${target.studentId}).`
  );

  saveLocalDatabase(next);
  return { nextState: next, result: { ok: true, message: `Removed ${target.fullName}.` } };
}

export function localUpdateConfig(
  state: ElectionDatabaseState,
  actor: UserProfile,
  partial: Partial<Pick<ElectionConfig, 'currentPhase' | 'liveResultsPublic' | 'totalRegisteredVoters' | 'labBoothPin'>>
): { nextState: ElectionDatabaseState; result: ActionResult } {
  if (actor.role !== 'admin') {
    return { nextState: state, result: { ok: false, message: 'Admin permission required.' } };
  }
  if (partial.labBoothPin !== undefined && !/^\d{4}$/.test(partial.labBoothPin)) {
    return {
      nextState: state,
      result: { ok: false, message: 'Lab Booth Admin PIN must be exactly 4 digits.' },
    };
  }
  const next = cloneState(state);
  next.config = {
    ...next.config,
    ...partial,
    lastUpdatedAt: new Date().toISOString(),
  };
  next.auditLogs = appendAuditLog(
    next,
    actor,
    'ELECTION_CONFIG_UPDATED',
    `Updated election state (Phase: ${next.config.currentPhase}, Results: ${next.config.liveResultsPublic ? 'Public' : 'Hidden'}).`
  );

  saveLocalDatabase(next);
  return { nextState: next, result: { ok: true, message: 'Election settings updated.' } };
}

export function localUpdatePhase(
  state: ElectionDatabaseState,
  actor: UserProfile,
  phase: ElectionPhase
): { nextState: ElectionDatabaseState; result: ActionResult } {
  if (!VALID_PHASES.includes(phase)) {
    return { nextState: state, result: { ok: false, message: 'Invalid election phase.' } };
  }
  return localUpdateConfig(state, actor, { currentPhase: phase });
}

export function localManageAdminEmails(
  state: ElectionDatabaseState,
  actor: UserProfile,
  action: 'add' | 'remove',
  rawEmail: string
): { nextState: ElectionDatabaseState; result: ActionResult<string[]> } {
  if (actor.role !== 'admin') {
    return { nextState: state, result: { ok: false, message: 'Admin permission required.' } };
  }
  const email = rawEmail.trim().toLowerCase();
  if (!isValidAdminInviteEmail(email)) {
    return {
      nextState: state,
      result: { ok: false, message: 'Enter a valid @student.aiu.edu.my or @aiu.edu.my email address.' },
    };
  }

  const next = cloneState(state);
  const currentList = next.config.adminEmails.map((e) => e.toLowerCase());

  if (action === 'add') {
    if (currentList.includes(email)) {
      return {
        nextState: state,
        result: { ok: false, message: `${email} already has Admin privileges.` },
      };
    }
    next.config.adminEmails = [...currentList, email];
    Object.keys(next.users).forEach((uid) => {
      if (next.users[uid].email.toLowerCase() === email) {
        next.users[uid].role = 'admin';
      }
    });
    next.auditLogs = appendAuditLog(
      next,
      actor,
      'ADMIN_EMAIL_ADDED',
      `Granted Admin access to ${email}.`
    );
  } else {
    if (email === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
      return {
        nextState: state,
        result: {
          ok: false,
          message: 'Primary Tech Lead admin account cannot be removed.',
        },
      };
    }
    if (!currentList.includes(email)) {
      return {
        nextState: state,
        result: { ok: false, message: `${email} is not in the Admin list.` },
      };
    }
    next.config.adminEmails = currentList.filter((e) => e !== email);
    Object.keys(next.users).forEach((uid) => {
      if (next.users[uid].email.toLowerCase() === email) {
        next.users[uid].role = 'voter';
      }
    });
    next.auditLogs = appendAuditLog(
      next,
      actor,
      'ADMIN_EMAIL_REMOVED',
      `Revoked Admin access for ${email}.`
    );
  }

  next.config.lastUpdatedAt = new Date().toISOString();
  saveLocalDatabase(next);
  return {
    nextState: next,
    result: {
      ok: true,
      message:
        action === 'add'
          ? `Granted Admin access to ${email}.`
          : `Removed Admin access for ${email}.`,
      data: next.config.adminEmails,
    },
  };
}

export function localResetDemoState(): ElectionDatabaseState {
  const fresh = createInitialSeedState();
  saveLocalDatabase(fresh);
  return fresh;
}
