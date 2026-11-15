import assert from 'node:assert/strict';
import {
  COHORT_ROSTER,
  findRosterStudent,
  verifyEmailMatchesRosterStudent,
} from '../src/data/cohortRoster';
import { createInitialSeedState, PRIMARY_ADMIN_EMAIL } from '../src/data/seedData';
import {
  localAssignTopCommitteeRole,
  localAuthenticateWithRoster,
  localCastBallot,
  localCastLabBoothBallot,
  localDeleteCandidate,
  localManageAdminEmails,
  localSetCandidateStatus,
  localSubmitCandidateApplication,
  localUpdateCandidateDetails,
  localUpdateConfig,
  localUpdatePhase,
  normalizeFullNameKey,
  sanitizeText,
  validateLabBoothCheckIn,
} from '../src/services/electionStore';
import { ElectionDatabaseState, UserProfile, VotingCohortCode } from '../src/types/election';

let passed = 0;

function runTest(id: number, name: string, fn: () => void): void {
  fn();
  passed += 1;
  console.log(`[PASS] Test ${String(id).padStart(2, '0')}: ${name}`);
}

function getFreshState(): ElectionDatabaseState {
  return createInitialSeedState();
}

// Test 1: Domain Enforcement
runTest(1, 'Domain Enforcement (@student.aiu.edu.my only)', () => {
  const state = getFreshState();
  const rejectedDomains = [
    'abeddin.mosawi@gmail.com',
    'ajogal.abubakar@yahoo.com',
    'dean.staff@aiu.edu.my',
    'fake@student.aiu.edu.my.evil.com',
  ];

  for (const email of rejectedDomains) {
    const { result } = localAuthenticateWithRoster(state, {
      email,
      googleDisplayName: 'Abeddin Mosawi',
      studentIdInput: 'AIU25102048',
      country: 'Afghanistan',
    });
    assert.equal(result.ok, false, `Expected ${email} to be rejected`);
  }
});

// Test 2: Roster Lookup
runTest(2, 'Roster Lookup rejects unlisted and malformed Student IDs', () => {
  const state = getFreshState();
  const badIds = ['AIU99999999', 'BADID', '123', ''];

  for (const badId of badIds) {
    const { result } = localAuthenticateWithRoster(state, {
      email: 'abeddin.mosawi@student.aiu.edu.my',
      googleDisplayName: 'Abeddin Mosawi',
      studentIdInput: badId,
      country: 'Afghanistan',
    });
    assert.equal(result.ok, false, `Expected Student ID "${badId}" to fail`);
  }
});

// Test 3: Anti-Spoofing Ownership Verification + Audit Logging
runTest(3, 'Anti-Spoofing blocks hijacking another Student ID and logs incident', () => {
  const state = getFreshState();
  const initialLogs = state.auditLogs.length;

  const { nextState, result } = localAuthenticateWithRoster(state, {
    email: 'attacker.hacker@student.aiu.edu.my',
    googleDisplayName: 'Attacker Hacker',
    studentIdInput: 'AIU24102323',
    country: 'Malaysia',
  });

  assert.equal(result.ok, false);
  assert.equal(nextState.auditLogs.length, initialLogs + 1);
  assert.equal(nextState.auditLogs[0].action, 'SECURITY_ID_SPOOF_BLOCKED');
  assert.match(nextState.auditLogs[0].details, /AIU24102323/);
});

// Test 4: Order-Independent Name Tokens & Direct ID Prefixes + Excel Typo Normalization
runTest(4, 'Order-independent name tokens, direct ID prefix, and AIIU typo normalization', () => {
  const adminStudent = findRosterStudent('AIU24102323');
  assert.ok(adminStudent, 'AIU24102323 must exist in roster');
  assert.equal(adminStudent.fullName, 'Abdulkarem Ajogal Abubakar');

  assert.equal(
    verifyEmailMatchesRosterStudent('ajogal.abubakar@student.aiu.edu.my', '', adminStudent).ok,
    true
  );
  assert.equal(
    verifyEmailMatchesRosterStudent('abubakar.abdulkarem@student.aiu.edu.my', '', adminStudent).ok,
    true
  );

  // Normalized AIIU25102530 -> AIU25102530
  const typoStudent = findRosterStudent('AIIU25102530');
  const directStudent = findRosterStudent('AIU25102530');
  assert.ok(typoStudent && directStudent);
  assert.equal(typoStudent.studentId, 'AIU25102530');
  assert.equal(
    verifyEmailMatchesRosterStudent('aiu25102530@student.aiu.edu.my', '', directStudent).ok,
    true
  );
  assert.equal(
    verifyEmailMatchesRosterStudent('25102530@student.aiu.edu.my', '', directStudent).ok,
    true
  );
});

// Test 5: 1-to-1 Permanent Binding
runTest(5, '1-to-1 Permanent Binding blocks email/ID rebinding in either direction', () => {
  const base = getFreshState();

  // Bind Milad Sahebi (AIU25102043) to milad.sahebi@student.aiu.edu.my
  const step1 = localAuthenticateWithRoster(base, {
    uid: 'uid-milad',
    email: 'milad.sahebi@student.aiu.edu.my',
    googleDisplayName: 'Milad Sahebi',
    studentIdInput: 'AIU25102043',
    country: 'Afghanistan',
  });
  assert.equal(step1.result.ok, true);

  // Direction A: Different AIU email tries to claim already-bound AIU25102043
  const dirA = localAuthenticateWithRoster(step1.nextState, {
    uid: 'uid-milad-alt',
    email: 'sahebi.milad@student.aiu.edu.my',
    googleDisplayName: 'Milad Sahebi',
    studentIdInput: 'AIU25102043',
    country: 'Afghanistan',
  });
  assert.equal(dirA.result.ok, false);
  assert.equal(dirA.nextState.auditLogs[0].action, 'SECURITY_DUPLICATE_BINDING_BLOCKED');

  // Direction B: Already-bound email tries to claim a second ID (AIU25102022 Nadia)
  const dirB = localAuthenticateWithRoster(step1.nextState, {
    uid: 'uid-milad',
    email: 'milad.sahebi@student.aiu.edu.my',
    googleDisplayName: 'Nadia Aldaghma',
    studentIdInput: 'AIU25102022',
    country: 'Palestine',
  });
  assert.equal(dirB.result.ok, false);
  assert.equal(dirB.nextState.auditLogs[0].action, 'SECURITY_ID_SPOOF_BLOCKED');

  // Also test email claiming second ID even if prefix could satisfy both: bind Alazab (AIU23102046)
  // then switch same email against admin's ID? Better: direct test against existing binding check
  // with an email whose display name matches another student whose prefix matches.
  // E.g. bind hamda.muhamed@student.aiu.edu.my -> AIU25102530, then try switching against a C5 student
  // sharing a token by finding a pair or testing same email claiming second ID with matching display tokens:
  const sA = findRosterStudent('AIU22102006'); // Firoz Hasan (C4) won't bind user, so pick two C5/C6/C7 with shared tokens
  assert.ok(sA);
  const candidatesWithAhmed = Object.values(COHORT_ROSTER).filter(
    (s) =>
      (s.cohort === 'C5' || s.cohort === 'C6' || s.cohort === 'C7') &&
      s.fullName.toLowerCase().includes('ahmed') &&
      s.fullName.toLowerCase().includes('mohamed')
  );
  if (candidatesWithAhmed.length >= 2) {
    const [first, second] = candidatesWithAhmed;
    const b1 = localAuthenticateWithRoster(base, {
      email: 'ahmed.mohamed@student.aiu.edu.my',
      googleDisplayName: first.fullName,
      studentIdInput: first.studentId,
      country: 'Sudan',
    });
    if (b1.result.ok) {
      const b2 = localAuthenticateWithRoster(b1.nextState, {
        email: 'ahmed.mohamed@student.aiu.edu.my',
        googleDisplayName: second.fullName,
        studentIdInput: second.studentId,
        country: 'Sudan',
      });
      assert.equal(b2.result.ok, false);
      assert.equal(b2.nextState.auditLogs[0].action, 'SECURITY_DUPLICATE_BINDING_BLOCKED');
    }
  }
});

// Test 6: Cohort 4 Graduating Senior Tribute, Visit Logging & Voting/Candidacy Block
runTest(6, 'Cohort 4 senior logs tribute visit and is blocked from voting and candidacy', () => {
  const base = getFreshState();
  const c4CountBefore = base.c4Visits.length;

  const { nextState, result } = localAuthenticateWithRoster(base, {
    email: 'firoz.hasan@student.aiu.edu.my',
    googleDisplayName: 'Firoz Hasan',
    studentIdInput: 'AIU22102006',
    country: 'Bangladesh',
  });

  assert.equal(result.ok, true);
  assert.ok(result.data?.c4Senior);
  assert.equal(result.data.c4Senior.studentId, 'AIU22102006');
  assert.equal(result.data.user, undefined);
  assert.equal(nextState.c4Visits.length, c4CountBefore + 1);
  assert.equal(nextState.auditLogs[0].action, 'C4_TRIBUTE_VIEWED');

  // Blocked at Lab Booth
  const admin = nextState.users['user-admin-abdulkarem'];
  const boothRes = validateLabBoothCheckIn(nextState, admin, {
    fullName: 'Firoz Hasan',
    cohort: 'C5',
    program: 'Bachelor in Computer Science (Honours)',
    country: 'Bangladesh',
    studentId: 'AIU22102006',
  });
  assert.equal(boothRes.ok, false);

  // Blocked from Candidacy (both via Admin add and via forged C4 actor)
  const candState = { ...nextState, config: { ...nextState.config, currentPhase: 'NOMINATIONS' as const } };
  const adminAddC4 = localSubmitCandidateApplication(
    candState,
    admin,
    { targetStudentId: 'AIU22102006', country: 'Bangladesh', manifesto: 'Test' },
    'approved'
  );
  assert.equal(adminAddC4.result.ok, false);

  const forgedC4Actor: UserProfile = {
    ...admin,
    uid: 'forged-c4',
    role: 'voter',
    studentId: 'AIU22102006',
    cohort: 'C4' as unknown as VotingCohortCode,
  };
  const selfApplyC4 = localSubmitCandidateApplication(candState, forgedC4Actor, {
    manifesto: 'Test',
  });
  assert.equal(selfApplyC4.result.ok, false);
});

// Test 7: Single-Use Online Ballot Enforcement
runTest(7, 'Single-use online ballot tallies once and blocks duplicate online vote', () => {
  const base = getFreshState();
  const initialTotal = base.config.totalBallotsCast;
  const c1VotesBefore = base.candidates.find((c) => c.id === 'cand-01')!.votes;

  const first = localCastBallot(base, 'user-voter-fresh', ['cand-01', 'cand-02']);
  assert.equal(first.result.ok, true);
  assert.equal(first.nextState.config.totalBallotsCast, initialTotal + 1);
  assert.equal(
    first.nextState.candidates.find((c) => c.id === 'cand-01')!.votes,
    c1VotesBefore + 1
  );
  assert.equal(first.nextState.users['user-voter-fresh'].hasVoted, true);
  assert.equal(first.nextState.users['user-voter-fresh'].votingChannel, 'online');

  const second = localCastBallot(first.nextState, 'user-voter-fresh', ['cand-03']);
  assert.equal(second.result.ok, false);
  assert.equal(second.nextState.config.totalBallotsCast, initialTotal + 1);
});

// Test 8: Cross-Channel Double-Vote Prevention (Online <-> Lab Booth)
runTest(8, 'Cross-channel double-vote prevention works Online -> Booth and Booth -> Online', () => {
  const base = getFreshState();
  const admin = base.users['user-admin-abdulkarem'];

  // Direction 1: Online -> Lab Booth blocked (by ID and by name+cohort)
  const votedOnline = localCastBallot(base, 'user-voter-fresh', ['cand-01']).nextState;
  const boothAttemptById = localCastLabBoothBallot(
    votedOnline,
    admin,
    {
      fullName: 'Abeddin Mosawi',
      cohort: 'C7',
      program: 'Bachelor in Computer Science (Honours)',
      country: 'Afghanistan',
      studentId: 'AIU25102048',
    },
    ['cand-02']
  );
  assert.equal(boothAttemptById.result.ok, false);

  const boothAttemptByNameNoId = localCastLabBoothBallot(
    votedOnline,
    admin,
    {
      fullName: '  abeddin   mosawi ',
      cohort: 'C7',
      program: 'Bachelor in Computer Science (Honours)',
      country: 'Afghanistan',
    },
    ['cand-02']
  );
  assert.equal(boothAttemptByNameNoId.result.ok, false);

  // Direction 2: Lab Booth -> Online blocked (synchronizes UserProfile + votedStudentIds)
  const boothVote = localCastLabBoothBallot(
    base,
    admin,
    {
      fullName: 'Nur Jumairah Binti Shaffri',
      cohort: 'C6',
      program: 'Bachelor in Data Science (Honours)',
      country: 'Malaysia',
      studentId: 'AIU25102157',
    },
    ['cand-01', 'cand-03']
  );
  assert.equal(boothVote.result.ok, true);
  assert.equal(boothVote.nextState.users['user-cand-jumairah'].hasVoted, true);
  assert.equal(boothVote.nextState.users['user-cand-jumairah'].votingChannel, 'lab_booth');

  const onlineAttemptAfterBooth = localCastBallot(
    boothVote.nextState,
    'user-cand-jumairah',
    ['cand-04']
  );
  assert.equal(onlineAttemptAfterBooth.result.ok, false);
});

// Test 9: ID-less Cohort 7 Lab Booth Double-Vote Block
runTest(9, 'ID-less C7 Lab Booth check-in blocks second vote via normalized Full Name + Cohort', () => {
  const base = getFreshState();
  const admin = base.users['user-admin-abdulkarem'];

  const first = localCastLabBoothBallot(
    base,
    admin,
    {
      fullName: 'New Intake Student',
      cohort: 'C7',
      program: 'Bachelor in Data Science (Honours)',
      country: 'Malaysia',
    },
    ['cand-01']
  );
  assert.equal(first.result.ok, true);
  assert.ok(
    first.nextState.config.votedFullNames.includes(
      normalizeFullNameKey('New Intake Student', 'C7')
    )
  );

  const second = localCastLabBoothBallot(
    first.nextState,
    admin,
    {
      fullName: 'new   intake   student',
      cohort: 'C7',
      program: 'Bachelor in Data Science (Honours)',
      country: 'Malaysia',
    },
    ['cand-02']
  );
  assert.equal(second.result.ok, false);
});

// Test 10: Secret Ballot Anonymity
runTest(10, 'Secret Ballot stores zero votedCandidateIds on UserProfile or AuditLog', () => {
  const base = getFreshState();
  const admin = base.users['user-admin-abdulkarem'];

  const online = localCastBallot(base, 'user-voter-fresh', ['cand-01', 'cand-05']).nextState;
  const userObj = online.users['user-voter-fresh'] as unknown as Record<string, unknown>;
  assert.equal('votedCandidateIds' in userObj, false);
  const onlineLog = online.auditLogs[0];
  assert.equal(onlineLog.action, 'BALLOT_CAST_ONLINE');
  assert.doesNotMatch(onlineLog.details, /cand-01|cand-05|Hasnat|Sankumba/i);

  const booth = localCastLabBoothBallot(
    online,
    admin,
    {
      fullName: 'Alazab Mohammed Khaled Hamood',
      cohort: 'C5',
      program: 'Bachelor in Computer Science (Honours)',
      country: 'Yemen',
      studentId: 'AIU23102046',
    },
    ['cand-02', 'cand-04']
  ).nextState;
  const boothLog = booth.auditLogs[0];
  assert.equal(boothLog.action, 'LAB_BALLOT_AUTHORIZED');
  assert.doesNotMatch(boothLog.details, /cand-02|cand-04|Jumairah|Mohamadou/i);
});

// Test 11: Ballot Selection Bounds, Candidate Status Validation & Voting Phase Lock
runTest(11, 'Ballot rejects empty, >4, duplicate, missing, pending selections, and non-live phases', () => {
  const base = getFreshState();

  assert.equal(localCastBallot(base, 'user-voter-fresh', []).result.ok, false);
  assert.equal(
    localCastBallot(base, 'user-voter-fresh', [
      'cand-01',
      'cand-02',
      'cand-03',
      'cand-04',
      'cand-05',
    ]).result.ok,
    false
  );
  assert.equal(localCastBallot(base, 'user-voter-fresh', ['cand-01', 'cand-01']).result.ok, false);
  assert.equal(localCastBallot(base, 'user-voter-fresh', ['cand-missing']).result.ok, false);
  assert.equal(localCastBallot(base, 'user-voter-fresh', ['cand-11']).result.ok, false); // pending

  for (const closedPhase of ['NOMINATIONS', 'CAMPAIGN', 'ENDED'] as const) {
    const nonLiveState: ElectionDatabaseState = {
      ...base,
      config: { ...base.config, currentPhase: closedPhase },
    };
    assert.equal(
      localCastBallot(nonLiveState, 'user-voter-fresh', ['cand-01']).result.ok,
      false,
      `Phase ${closedPhase} must block online voting`
    );
  }
});

// Test 12: Candidacy Rules (C5/C6 Only, 15-Candidate Cap, Phase Lock)
runTest(12, 'Candidacy enforces C5/C6 eligibility, 15-candidate cap, and Phase 3-4 lock', () => {
  const base = getFreshState();
  const admin = base.users['user-admin-abdulkarem'];
  const c7Voter = base.users['user-voter-fresh'];

  const nomState: ElectionDatabaseState = {
    ...base,
    config: { ...base.config, currentPhase: 'NOMINATIONS' },
  };

  // C7 cannot apply
  const c7Apply = localSubmitCandidateApplication(nomState, c7Voter, { manifesto: 'C7 test' });
  assert.equal(c7Apply.result.ok, false);

  // Fill approved slate to 15 (starts with 10 approved, 2 pending)
  let work = nomState;
  work = localSetCandidateStatus(work, admin, 'cand-11', 'approved').nextState;
  work = localSetCandidateStatus(work, admin, 'cand-12', 'approved').nextState;

  const existingIds = new Set(work.candidates.map((c) => c.studentId));
  const extraC5 = Object.values(COHORT_ROSTER).filter(
    (s) => s.cohort === 'C5' && !existingIds.has(s.studentId)
  );
  assert.ok(extraC5.length >= 4, 'Roster must have enough extra C5 students to test 15-cap');

  for (let i = 0; i < 3; i += 1) {
    const res = localSubmitCandidateApplication(
      work,
      admin,
      { targetStudentId: extraC5[i].studentId, country: 'Malaysia', manifesto: 'Manifesto' },
      'approved'
    );
    assert.equal(res.result.ok, true, `Adding candidate #${13 + i} should succeed`);
    work = res.nextState;
  }

  assert.equal(work.candidates.filter((c) => c.status === 'approved').length, 15);

  // 16th candidate rejected
  const overCapSubmit = localSubmitCandidateApplication(
    work,
    admin,
    { targetStudentId: extraC5[3].studentId, country: 'Malaysia', manifesto: '16th' },
    'approved'
  );
  assert.equal(overCapSubmit.result.ok, false);

  // Also test localSetCandidateStatus blocking a 16th approval when a pending cand exists
  const pendingState = localSetCandidateStatus(work, admin, 'cand-12', 'pending').nextState;
  const reAdded = localSubmitCandidateApplication(
    pendingState,
    admin,
    { targetStudentId: extraC5[3].studentId, country: 'Malaysia', manifesto: 'Now 15th' },
    'approved'
  ).nextState;
  assert.equal(reAdded.candidates.filter((c) => c.status === 'approved').length, 15);
  const approve16th = localSetCandidateStatus(reAdded, admin, 'cand-12', 'approved');
  assert.equal(approve16th.result.ok, false);

  // Phases 3-4 block new candidate applications
  for (const lockedPhase of ['VOTING_LIVE', 'ENDED'] as const) {
    const lockedState: ElectionDatabaseState = {
      ...nomState,
      config: { ...nomState.config, currentPhase: lockedPhase },
    };
    const res = localSubmitCandidateApplication(
      lockedState,
      admin,
      { targetStudentId: extraC5[3].studentId, country: 'Malaysia', manifesto: 'Too late' },
      'approved'
    );
    assert.equal(res.result.ok, false, `Phase ${lockedPhase} must lock nominations`);
  }
});

// Test 13: Hard Candidate Profile Edit Lock in Phases 3 & 4
runTest(13, 'Candidate edits allowed in Phases 1-2 and hard-locked for BOTH candidate and Admin in Phases 3-4', () => {
  const base = getFreshState();
  const admin = base.users['user-admin-abdulkarem'];
  const candOwner = base.users['user-cand-jumairah']; // owns cand-02

  for (const openPhase of ['NOMINATIONS', 'CAMPAIGN'] as const) {
    const openState: ElectionDatabaseState = {
      ...base,
      config: { ...base.config, currentPhase: openPhase },
    };
    const ownerRes = localUpdateCandidateDetails(openState, candOwner, 'cand-02', {
      manifesto: `Updated in ${openPhase}`,
    });
    assert.equal(ownerRes.result.ok, true, `Owner must be able to edit in ${openPhase}`);

    const adminRes = localUpdateCandidateDetails(ownerRes.nextState, admin, 'cand-01', {
      country: 'Pakistan',
    });
    assert.equal(adminRes.result.ok, true, `Admin must be able to edit in ${openPhase}`);
  }

  for (const lockedPhase of ['VOTING_LIVE', 'ENDED'] as const) {
    const lockedState: ElectionDatabaseState = {
      ...base,
      config: { ...base.config, currentPhase: lockedPhase },
    };
    const ownerLocked = localUpdateCandidateDetails(lockedState, candOwner, 'cand-02', {
      manifesto: 'Sneaky campaign change',
    });
    assert.equal(ownerLocked.result.ok, false, `Candidate locked in ${lockedPhase}`);

    const adminLocked = localUpdateCandidateDetails(lockedState, admin, 'cand-02', {
      manifesto: 'Admin bypass attempt',
    });
    assert.equal(adminLocked.result.ok, false, `Admin also locked in ${lockedPhase}`);
  }
});

// Test 14: Privilege Escalation Block, Primary Admin Protection & XSS Sanitization
runTest(14, 'Blocks non-admin privilege escalation, protects Primary Admin, and strips XSS tags', () => {
  const base = getFreshState();
  const admin = base.users['user-admin-abdulkarem'];
  const voter = base.users['user-voter-fresh'];

  assert.equal(localUpdatePhase(base, voter, 'ENDED').result.ok, false);
  assert.equal(localUpdateConfig(base, voter, { liveResultsPublic: false }).result.ok, false);
  assert.equal(localSetCandidateStatus(base, voter, 'cand-11', 'approved').result.ok, false);
  assert.equal(localDeleteCandidate(base, voter, 'cand-01').result.ok, false);
  assert.equal(localAssignTopCommitteeRole(base, voter, 'cand-01', 'President').result.ok, false);
  assert.equal(
    localManageAdminEmails(base, voter, 'add', voter.email).result.ok,
    false
  );
  assert.equal(
    localCastLabBoothBallot(
      base,
      voter,
      {
        fullName: 'Spoof Booth',
        cohort: 'C7',
        program: 'Bachelor in Computer Science (Honours)',
        country: 'Malaysia',
      },
      ['cand-01']
    ).result.ok,
    false
  );

  // Even Primary Admin cannot remove Primary Admin email
  const removePrimary = localManageAdminEmails(base, admin, 'remove', PRIMARY_ADMIN_EMAIL);
  assert.equal(removePrimary.result.ok, false);
  assert.ok(removePrimary.nextState.config.adminEmails.includes(PRIMARY_ADMIN_EMAIL));

  // XSS sanitization strips < and > from names and manifestos
  const xssPayload = '<script>alert("xss")</script>Vote cleanly';
  assert.equal(/[<>]/.test(sanitizeText(xssPayload)), false);

  const nomState: ElectionDatabaseState = {
    ...base,
    config: { ...base.config, currentPhase: 'CAMPAIGN' },
  };
  const updated = localUpdateCandidateDetails(nomState, admin, 'cand-01', {
    fullName: '<b>Hasnat</b>',
    manifesto: xssPayload,
  });
  assert.equal(updated.result.ok, true);
  assert.equal(/[<>]/.test(updated.result.data!.fullName), false);
  assert.equal(/[<>]/.test(updated.result.data!.manifesto), false);
});

console.log(`\nAll ${passed} / 14 security tests passed.`);
