export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  brokerage_id: number;
};

export type ReportingFilterVars = {
  filter?: {
    datePreset?: string;
    startDate?: string;
    endDate?: string;
    sources?: string[];
    advisorIds?: number[];
  };
};

export type DashboardKpisQuery = {
  reportingDashboardKpis: {
    totalLeadsProcessed: number;
    totalLeadsProcessedPctChange: number;
    totalMeetingsSet: number;
    onboardedLeads: number;
    onboardedLeadValue: number;
  };
};

export type QualificationAnalyticsQuery = {
  reportingQualificationAnalytics: {
    overallQualificationRate: number;
    sourceBreakdown: { source: string; qualificationRate: number }[];
  };
};

export type OrcaAnalyticsQuery = {
  reportingOrcaAnalytics: {
    header: {
      totalLeadsProcessed: number;
      totalLeadsProcessedPctChange: number;
      qualificationRate: number;
      meetingsBooked: number;
      pipelineValueEstimated: number;
    };
    funnelConversion: { stage: string; count: number }[];
    operationalStats: {
      avgTimeToFirstContactSeconds: number;
      avgQualificationCallDurationSeconds: number;
      avgNurturingAttemptsBeforeContact: number;
      callsMadeToday: number;
    };
  };
};

export type OrcaLiveFeedItem = {
  eventType: string;
  lifecycleStage: string | null;
  leadInputId: number;
  createdAt: string;
  payload: unknown;
};

export type OrcaLiveFeedQuery = {
  reportingOrcaLiveFeed: OrcaLiveFeedItem[];
};

export type GoogleCalendarQuery = {
  googleCalendarEvents: {
    id: string;
    summary: string | null;
    description: string | null;
    location: string | null;
    startDateTime: string | null;
    endDateTime: string | null;
    htmlLink: string | null;
    meetJoinUrl: string | null;
  }[];
};

export type OutlookCalendarQuery = {
  outlookCalendarEvents: {
    id: string;
    subject: string | null;
    startDateTime: string | null;
    endDateTime: string | null;
    webLink: string | null;
    teamsJoinUrl: string | null;
  }[];
};

export type LeadsTableQuery = {
  leadsTable: {
    lead_input_id: number;
    customer: string;
    contact: string;
    source: string;
    advisor: string | null;
    type: string | null;
    amount: number | null;
    status: string;
    lead_ingested: string;
  }[];
};

export type LeadsTableVars = {
  statuses?: string[];
  limit?: number;
  offset?: number;
};

export type CalendarVars = {
  brokerageId: number;
  startDateTime: string;
  endDateTime: string;
  timezone?: string;
};

export type MeQuery = { me: AuthUser };

export type LoginMutation = {
  login: { token: string; user: AuthUser };
};

export type LoginVars = { email: string; password: string };
