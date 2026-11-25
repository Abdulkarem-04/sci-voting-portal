export type ElectionPhase =
  | 'NOMINATIONS'
  | 'CAMPAIGN'
  | 'VOTING_LIVE'
  | 'ENDED';

export type CohortCode = 'C4' | 'C5' | 'C6' | 'C7';

export type VotingCohortCode = 'C5' | 'C6' | 'C7';

export type ProgramOfStudy =
  | 'Bachelor in Computer Science (Honours)'
  | 'Bachelor in Data Science (Honours)'
  | 'Bachelor in Information Technology (Cybersecurity) (Honours)';

export interface RosterStudent {
  studentId: string;
  fullName: string;
  cohort: CohortCode;
  yearOfStudy: 1 | 2 | 3;
  program: ProgramOfStudy;
}

export type UserRole = 'voter' | 'admin';

export type CandidateStatus = 'approved' | 'pending' | 'rejected';

export type TopCommitteeRole =
  | 'President'
  | 'Vice President'
  | 'Secretary'
  | 'Treasurer';

export interface UserProfile {
  uid: string;
  fullName: string;
  studentId: string;
  email: string;
  cohort: VotingCohortCode;
  yearOfStudy: 1 | 2 | 3;
  program: ProgramOfStudy;
  country: string;
  role: UserRole;
  hasVoted: boolean;
  votedAt: string | null;
  votingChannel: 'online' | 'lab_booth' | null;
  receiptCode: string | null;
  createdAt: string;
}

export interface Candidate {
  id: string;
  candidateNumber: number;
  fullName: string;
  studentId: string;
  email: string;
  cohort: 'C5' | 'C6';
  yearOfStudy: 2 | 3;
  program: ProgramOfStudy;
  country: string;
  manifesto: string;
  photoUrl: string;
  status: CandidateStatus;
  votes: number;
  createdAt: string;
  updatedAt: string;
  appointedRole?: TopCommitteeRole | null;
}

export interface C4VisitEntry {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  program: ProgramOfStudy;
  timestamp: string;
}

export interface LabBoothCheckInInput {
  fullName: string;
  cohort: VotingCohortCode;
  program: ProgramOfStudy;
  country: string;
  studentId?: string;
  email?: string;
}

export interface LabBoothSession {
  activeCheckIn: LabBoothCheckInInput | null;
  kioskLocked: boolean;
  awaitingPinUnlock: boolean;
  lastReceiptCode: string | null;
  lastVoterName: string | null;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail: string;
  action: string;
  details: string;
}

export interface ElectionConfig {
  id: string;
  title: string;
  subtitle: string;
  academicSession: string;
  currentPhase: ElectionPhase;
  maxVotesPerBallot: number; // 4 selections max per voter
  topAdvancingCount: number | null; // null = Undecided / Show All; number = Dean cutoff (e.g. 8 or 13)
  liveResultsPublic: boolean;
  votingDateDisplay: string;
  votingWindowDisplay: string;
  totalRegisteredVoters: number;
  totalBallotsCast: number;
  adminEmails: string[];
  labBoothPin: string;
  votedStudentIds: string[];
  votedFullNames: string[];
  lastUpdatedAt: string;
}

export interface ElectionDatabaseState {
  config: ElectionConfig;
  candidates: Candidate[];
  users: Record<string, UserProfile>;
  c4Visits: C4VisitEntry[];
  auditLogs: AuditLogEntry[];
}

export type ActiveTab = 'home' | 'candidates' | 'vote' | 'results' | 'admin' | 'profile';

export interface CandidateApplicationInput {
  fullName?: string;
  country?: string;
  manifesto?: string;
  photoUrl?: string;
  targetStudentId?: string;
  targetEmail?: string;
}

export interface AuthRosterInput {
  uid?: string;
  email: string;
  googleDisplayName?: string;
  studentIdInput: string;
  country: string;
}

export interface AuthRosterResponse {
  user?: UserProfile;
  c4Senior?: RosterStudent;
}

export interface AdminUpdateUserInput {
  fullName: string;
  studentId: string;
  cohort: VotingCohortCode;
  yearOfStudy: 1 | 2 | 3;
  program: ProgramOfStudy;
  country: string;
  role: UserRole;
}

export interface ActionResult<T = void> {
  ok: boolean;
  message: string;
  data?: T;
}
