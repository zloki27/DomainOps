export class SubmissionLockedError extends Error {
  readonly status = 409;

  constructor(message = 'This response has already been submitted and is locked.') {
    super(message);
    this.name = 'SubmissionLockedError';
  }
}

export function isResponseLocked(status: string | null | undefined): boolean {
  return status === 'SUBMITTED';
}

export function assertResponseMutable(status: string | null | undefined): void {
  if (isResponseLocked(status)) {
    throw new SubmissionLockedError();
  }
}
