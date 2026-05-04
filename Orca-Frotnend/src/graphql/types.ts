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

export type BrokerageSettingsQuery = {
  brokerage: {
    id: string;
    timezone: string;
    business_hours_start: string;
    business_hours_end: string;
    working_days: string[];
    initial_outreach_script_primary: string | null;
    initial_outreach_script_secondary: string | null;
    mortgage_country: string | null;
    mortgage_state: string | null;
    mortgage_city: string | null;
    mortgage_about: string | null;
    mortgage_services: string[];
    inbound_context_lookup_enabled: boolean;
    first_call_attempt_delay_minutes: number;
    call_retry_attempts_max: number;
    call_retry_interval_minutes: number;
    max_call_duration_seconds: number;
    lead_response_timeout_seconds: number;
    call_missed_sms_boolean: boolean;
    sms_delay_after_missed_call: number;
    send_email_if_call_not_answered: boolean;
    delay_before_first_email: number;
    voicemail_drop_enabled: boolean;
    sms_enabled: boolean;
    sms_can_be_contacted: boolean;
    sms_attempts_max: number;
    sms_templates: string[];
    send_recap_sms_after_call: boolean;
    send_reminder_sms_before_meeting: boolean;
    meeting_sms_reminder_offset: number;
    email_enabled: boolean;
    email_can_be_contacted: boolean;
    email_templates: string[];
    send_recap_email_after_call: boolean;
    send_reminder_email_before_meeting: boolean;
    meeting_email_reminder_offset: number;
    automation_flow_steps: string[];
  } | null;
};

export type BrokerageSettingsVars = { id: string };

export type UpdateBrokerageCallHandlingVars = {
  brokerageId: number;
  initialOutreachScriptPrimary?: string;
  initialOutreachScriptSecondary?: string;
  mortgageCountry?: string;
  mortgageState?: string;
  mortgageCity?: string;
  mortgageAbout?: string;
  mortgageServices?: string[];
  inboundContextLookupEnabled: boolean;
  firstCallAttemptDelayMinutes: number;
  callRetryAttemptsMax: number;
  callRetryIntervalMinutes: number;
  maxCallDurationSeconds: number;
  leadResponseTimeoutSeconds: number;
  callMissedSmsBoolean: boolean;
  smsDelayAfterMissedCall: number;
  sendEmailIfCallNotAnswered: boolean;
  delayBeforeFirstEmail: number;
  voicemailDropEnabled: boolean;
};

export type UpdateBrokerageCallHandlingMutation = {
  updateBrokerageCallHandling: {
    id: string;
    initial_outreach_script_primary: string | null;
    initial_outreach_script_secondary: string | null;
    mortgage_country: string | null;
    mortgage_state: string | null;
    mortgage_city: string | null;
    mortgage_about: string | null;
    mortgage_services: string[];
  };
};

export type UpdateBrokerageBusinessHoursVars = {
  brokerageId: number;
  businessHoursStart: string;
  businessHoursEnd: string;
  workingDays: string[];
  timezone: string;
};

export type UpdateBrokerageBusinessHoursMutation = {
  updateBrokerageBusinessHours: {
    id: string;
    business_hours_start: string;
    business_hours_end: string;
    working_days: string[];
    timezone: string;
  };
};

export type MeQuery = { me: AuthUser };

export type LoginMutation = {
  login: { token: string; user: AuthUser };
};

export type LoginVars = { email: string; password: string };
