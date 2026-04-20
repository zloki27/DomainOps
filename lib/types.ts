export interface PersonRow {
  name: string;
  title: string;
  department: string;
  primaryAssignment: string;
  domainTasks: string;
  estimatedPercent: string;
}

export interface OwnershipAnswer {
  responsible: string;
  comments: string;
}

export interface SupplierRow {
  registryName: string;
  type: string;
  primaryContact: string;
}

export interface GovernanceAnswer {
  responsible: string;
  comments: string;
}

export interface QuestionnairePayload {
  domainPersonnel: PersonRow[];
  technicalResources: PersonRow[];
  operationalOwnership: OwnershipAnswer[];
  registriesAndSuppliers: SupplierRow[];
  communicationAndGovernance: GovernanceAnswer[];
  additionalInformation: string;
}

export type BrandStatus = 'Not started' | 'In progress' | 'Submitted';

export interface ReportBrandRow {
  slug: string;
  displayName: string;
  logoPath: string | null;
  status: BrandStatus;
  completedBy: string | null;
  updatedAt: Date | null;
  submittedAt: Date | null;
  payload: QuestionnairePayload | null;
}
