import type { QuestionnairePayload, PersonRow, OwnershipAnswer, SupplierRow, GovernanceAnswer } from './types';
import { OWNERSHIP_QUESTIONS, GOVERNANCE_QUESTIONS } from './questions';

export function emptyPersonRow(): PersonRow {
  return { name: '', title: '', department: '', primaryAssignment: '', domainTasks: '', estimatedPercent: '' };
}

export function emptyOwnershipAnswer(): OwnershipAnswer {
  return { responsible: '', comments: '' };
}

export function emptySupplierRow(): SupplierRow {
  return { registryName: '', type: '', primaryContact: '' };
}

export function emptyGovernanceAnswer(): GovernanceAnswer {
  return { responsible: '', comments: '' };
}

export function emptyPayload(): QuestionnairePayload {
  return {
    domainPersonnel: [],
    technicalResources: [],
    operationalOwnership: OWNERSHIP_QUESTIONS.map(() => emptyOwnershipAnswer()),
    registriesAndSuppliers: [],
    communicationAndGovernance: GOVERNANCE_QUESTIONS.map(() => emptyGovernanceAnswer()),
    additionalInformation: '',
  };
}
