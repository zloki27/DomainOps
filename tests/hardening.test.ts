import assert from 'node:assert/strict';
import test from 'node:test';

import nextConfig from '../next.config.mjs';
import { emptyPayload } from '../lib/payload';
import {
  parseDraftSubmission,
  parseSubmittedSubmission,
} from '../lib/questionnaire-validation';
import { resolveReportAccess } from '../lib/report-access';
import { assertResponseMutable } from '../lib/submission-policy';

test('submitted responses are immutable', () => {
  assert.throws(
    () => assertResponseMutable('SUBMITTED'),
    /locked/i
  );

  assert.doesNotThrow(() => assertResponseMutable('IN_PROGRESS'));
  assert.doesNotThrow(() => assertResponseMutable(undefined));
});

test('draft validation accepts blank completedBy and pads fixed sections', () => {
  const parsed = parseDraftSubmission({
    completedBy: '   ',
    questionnaireDate: '2026-04-20',
    payload: {
      ...emptyPayload(),
      operationalOwnership: [],
      communicationAndGovernance: [],
    },
  });

  assert.equal(parsed.completedBy, '');
  assert.equal(parsed.questionnaireDate.toISOString().slice(0, 10), '2026-04-20');
  assert.ok(parsed.payload.operationalOwnership.length > 0);
  assert.ok(parsed.payload.communicationAndGovernance.length > 0);
});

test('submit validation rejects blank completedBy', () => {
  assert.throws(
    () =>
      parseSubmittedSubmission({
        completedBy: '   ',
        questionnaireDate: '2026-04-20',
        payload: emptyPayload(),
      }),
    /completed by/i
  );
});

test('report access is granted by cookie or token and denied otherwise', () => {
  const denied = resolveReportAccess({
    secret: 'top-secret',
    pathname: '/report',
    cookieToken: null,
    queryToken: null,
  });
  assert.equal(denied.authorized, false);

  const cookieGranted = resolveReportAccess({
    secret: 'top-secret',
    pathname: '/report',
    cookieToken: 'top-secret',
    queryToken: null,
  });
  assert.equal(cookieGranted.authorized, true);
  assert.equal(cookieGranted.shouldSetCookie, false);

  const tokenGranted = resolveReportAccess({
    secret: 'top-secret',
    pathname: '/report',
    cookieToken: null,
    queryToken: 'top-secret',
  });
  assert.equal(tokenGranted.authorized, true);
  assert.equal(tokenGranted.shouldSetCookie, true);
  assert.equal(tokenGranted.redirectPath, '/report');
});

test('next build must not ignore TypeScript errors', () => {
  assert.notEqual(nextConfig.typescript?.ignoreBuildErrors, true);
});
