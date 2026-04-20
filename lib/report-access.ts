export const REPORT_ACCESS_COOKIE = 'domainops_report_access';

interface ReportAccessInput {
  secret: string | undefined;
  pathname: string;
  cookieToken: string | null;
  queryToken: string | null;
}

interface ReportAccessDecision {
  authorized: boolean;
  shouldSetCookie: boolean;
  redirectPath: string | null;
}

function normalize(value: string | null | undefined): string {
  return value?.trim() ?? '';
}

export function resolveReportAccess({
  secret,
  pathname,
  cookieToken,
  queryToken,
}: ReportAccessInput): ReportAccessDecision {
  const normalizedSecret = normalize(secret);
  if (!normalizedSecret) {
    return { authorized: false, shouldSetCookie: false, redirectPath: null };
  }

  if (normalize(cookieToken) === normalizedSecret) {
    return { authorized: true, shouldSetCookie: false, redirectPath: null };
  }

  if (normalize(queryToken) === normalizedSecret) {
    return { authorized: true, shouldSetCookie: true, redirectPath: pathname };
  }

  return { authorized: false, shouldSetCookie: false, redirectPath: null };
}
