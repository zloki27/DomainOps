import { ZodError, z } from 'zod';
import {
  emptyGovernanceAnswer,
  emptyOwnershipAnswer,
  emptyPayload,
} from './payload';
import { GOVERNANCE_QUESTIONS, OWNERSHIP_QUESTIONS } from './questions';
import type {
  GovernanceAnswer,
  OwnershipAnswer,
  QuestionnairePayload,
} from './types';

const MAX_SHORT_TEXT = 200;
const MAX_LONG_TEXT = 4000;
const MAX_PERCENT_TEXT = 50;
const MAX_REPEATABLE_ROWS = 100;

const trimmedString = (max: number) =>
  z
    .string()
    .max(max)
    .transform((value) => value.trim());

const permissiveString = (max: number) =>
  z.preprocess(
    (value) => (typeof value === 'string' ? value : ''),
    trimmedString(max)
  );

const personRowSchema = z
  .object({
    name: permissiveString(MAX_SHORT_TEXT),
    title: permissiveString(MAX_SHORT_TEXT),
    department: permissiveString(MAX_SHORT_TEXT),
    primaryAssignment: permissiveString(MAX_SHORT_TEXT),
    domainTasks: permissiveString(MAX_LONG_TEXT),
    estimatedPercent: permissiveString(MAX_PERCENT_TEXT),
  })
  .strict();

const ownershipAnswerSchema = z
  .object({
    responsible: permissiveString(MAX_SHORT_TEXT),
    comments: permissiveString(MAX_LONG_TEXT),
  })
  .strict();

const supplierRowSchema = z
  .object({
    registryName: permissiveString(MAX_SHORT_TEXT),
    type: permissiveString(MAX_SHORT_TEXT),
    primaryContact: permissiveString(MAX_SHORT_TEXT),
  })
  .strict();

const governanceAnswerSchema = z
  .object({
    responsible: permissiveString(MAX_SHORT_TEXT),
    comments: permissiveString(MAX_LONG_TEXT),
  })
  .strict();

const payloadSchema = z
  .object({
    domainPersonnel: z.array(personRowSchema).max(MAX_REPEATABLE_ROWS).default([]),
    technicalResources: z.array(personRowSchema).max(MAX_REPEATABLE_ROWS).default([]),
    operationalOwnership: z
      .array(ownershipAnswerSchema)
      .max(OWNERSHIP_QUESTIONS.length)
      .default([]),
    registriesAndSuppliers: z
      .array(supplierRowSchema)
      .max(MAX_REPEATABLE_ROWS)
      .default([]),
    communicationAndGovernance: z
      .array(governanceAnswerSchema)
      .max(GOVERNANCE_QUESTIONS.length)
      .default([]),
    additionalInformation: permissiveString(MAX_LONG_TEXT).default(''),
  })
  .strict();

const submissionSchema = z
  .object({
    completedBy: permissiveString(MAX_SHORT_TEXT).default(''),
    questionnaireDate: permissiveString(10).default(''),
    payload: payloadSchema.default(emptyPayload()),
  })
  .strict();

export interface ParsedSubmission {
  completedBy: string;
  questionnaireDate: Date;
  payload: QuestionnairePayload;
}

export class SubmissionValidationError extends Error {
  readonly status = 400;
  readonly issues: string[];

  constructor(message: string, issues: string[] = [message]) {
    super(message);
    this.name = 'SubmissionValidationError';
    this.issues = issues;
  }
}

function formatIssues(error: ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length > 0 ? `${issue.path.join('.')}: ` : '';
    return `${path}${issue.message}`;
  });
}

function parseQuestionnaireDate(rawValue: string): Date {
  const normalizedValue = rawValue.trim();
  const value = normalizedValue || new Date().toISOString().slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new SubmissionValidationError(
      'Questionnaire date must use YYYY-MM-DD format.'
    );
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new SubmissionValidationError('Questionnaire date is invalid.');
  }

  return date;
}

function padAnswers<T extends OwnershipAnswer | GovernanceAnswer>(
  answers: T[],
  expectedLength: number,
  emptyValue: () => T
): T[] {
  const next = answers.slice(0, expectedLength);
  while (next.length < expectedLength) {
    next.push(emptyValue());
  }
  return next;
}

function normalizePayload(payload: QuestionnairePayload): QuestionnairePayload {
  return {
    domainPersonnel: payload.domainPersonnel,
    technicalResources: payload.technicalResources,
    operationalOwnership: padAnswers(
      payload.operationalOwnership,
      OWNERSHIP_QUESTIONS.length,
      emptyOwnershipAnswer
    ),
    registriesAndSuppliers: payload.registriesAndSuppliers,
    communicationAndGovernance: padAnswers(
      payload.communicationAndGovernance,
      GOVERNANCE_QUESTIONS.length,
      emptyGovernanceAnswer
    ),
    additionalInformation: payload.additionalInformation,
  };
}

function parseSubmission(
  body: unknown,
  requireCompletedBy: boolean
): ParsedSubmission {
  try {
    const parsed = submissionSchema.parse(body);

    if (requireCompletedBy && !parsed.completedBy) {
      throw new SubmissionValidationError(
        'Completed by is required when submitting the questionnaire.'
      );
    }

    return {
      completedBy: parsed.completedBy,
      questionnaireDate: parseQuestionnaireDate(parsed.questionnaireDate),
      payload: normalizePayload(parsed.payload),
    };
  } catch (error) {
    if (error instanceof SubmissionValidationError) {
      throw error;
    }

    if (error instanceof ZodError) {
      const issues = formatIssues(error);
      throw new SubmissionValidationError('Request payload is invalid.', issues);
    }

    throw error;
  }
}

export function parseDraftSubmission(body: unknown): ParsedSubmission {
  return parseSubmission(body, false);
}

export function parseSubmittedSubmission(body: unknown): ParsedSubmission {
  return parseSubmission(body, true);
}

export function parseStoredPayload(value: unknown): QuestionnairePayload {
  const parsed = payloadSchema.safeParse(value);
  if (!parsed.success) {
    return normalizePayload(emptyPayload());
  }

  return normalizePayload(parsed.data);
}
