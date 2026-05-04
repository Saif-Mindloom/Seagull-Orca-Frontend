import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      role
      brokerage_id
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        role
        brokerage_id
      }
    }
  }
`;

export const REPORTING_DASHBOARD_KPIS = gql`
  query ReportingDashboardKpis($filter: ReportingFilterInput) {
    reportingDashboardKpis(filter: $filter) {
      totalLeadsProcessed
      totalLeadsProcessedPctChange
      totalMeetingsSet
      onboardedLeads
      onboardedLeadValue
    }
  }
`;

export const REPORTING_QUALIFICATION_ANALYTICS = gql`
  query ReportingQualificationAnalytics($filter: ReportingFilterInput) {
    reportingQualificationAnalytics(filter: $filter) {
      overallQualificationRate
      sourceBreakdown {
        source
        qualificationRate
      }
    }
  }
`;

export const REPORTING_ORCA_ANALYTICS = gql`
  query ReportingOrcaAnalytics($filter: ReportingFilterInput) {
    reportingOrcaAnalytics(filter: $filter) {
      header {
        totalLeadsProcessed
        totalLeadsProcessedPctChange
        qualificationRate
        meetingsBooked
        pipelineValueEstimated
      }
      funnelConversion {
        stage
        count
      }
      operationalStats {
        avgTimeToFirstContactSeconds
        avgQualificationCallDurationSeconds
        avgNurturingAttemptsBeforeContact
        callsMadeToday
      }
    }
  }
`;

export const REPORTING_ORCA_LIVE_FEED = gql`
  query ReportingOrcaLiveFeed($limit: Int) {
    reportingOrcaLiveFeed(limit: $limit) {
      eventType
      lifecycleStage
      leadInputId
      createdAt
      payload
    }
  }
`;

export const LEADS_TABLE_QUERY = gql`
  query LeadsTable(
    $statuses: [LeadsTableStatus!]
    $limit: Int
    $offset: Int
  ) {
    leadsTable(statuses: $statuses, limit: $limit, offset: $offset) {
      lead_input_id
      customer
      contact
      source
      advisor
      type
      amount
      status
      lead_ingested
    }
  }
`;

export const GOOGLE_CALENDAR_EVENTS_QUERY = gql`
  query GoogleCalendarEvents(
    $brokerageId: Int!
    $startDateTime: String!
    $endDateTime: String!
    $timezone: String
  ) {
    googleCalendarEvents(
      brokerageId: $brokerageId
      startDateTime: $startDateTime
      endDateTime: $endDateTime
      timezone: $timezone
    ) {
      id
      summary
      description
      location
      startDateTime
      endDateTime
      htmlLink
      meetJoinUrl
    }
  }
`;

export const OUTLOOK_CALENDAR_EVENTS_QUERY = gql`
  query OutlookCalendarEvents(
    $brokerageId: Int!
    $startDateTime: String!
    $endDateTime: String!
    $timezone: String
  ) {
    outlookCalendarEvents(
      brokerageId: $brokerageId
      startDateTime: $startDateTime
      endDateTime: $endDateTime
      timezone: $timezone
    ) {
      id
      subject
      startDateTime
      endDateTime
      webLink
      teamsJoinUrl
    }
  }
`;

export const BROKERAGE_SETTINGS_QUERY = gql`
  query BrokerageSettings($id: ID!) {
    brokerage(id: $id) {
      id
      timezone
      business_hours_start
      business_hours_end
      working_days
      initial_outreach_script_primary
      initial_outreach_script_secondary
      mortgage_country
      mortgage_state
      mortgage_city
      mortgage_about
      mortgage_services
      inbound_context_lookup_enabled
      first_call_attempt_delay_minutes
      call_retry_attempts_max
      call_retry_interval_minutes
      max_call_duration_seconds
      lead_response_timeout_seconds
      call_missed_sms_boolean
      sms_delay_after_missed_call
      send_email_if_call_not_answered
      delay_before_first_email
      voicemail_drop_enabled
      sms_enabled
      sms_can_be_contacted
      sms_attempts_max
      sms_templates
      send_recap_sms_after_call
      send_reminder_sms_before_meeting
      meeting_sms_reminder_offset
      email_enabled
      email_can_be_contacted
      email_templates
      send_recap_email_after_call
      send_reminder_email_before_meeting
      meeting_email_reminder_offset
      automation_flow_steps
    }
  }
`;

export const UPDATE_BROKERAGE_CALL_HANDLING_MUTATION = gql`
  mutation UpdateBrokerageCallHandling(
    $brokerageId: Int!
    $initialOutreachScriptPrimary: String
    $initialOutreachScriptSecondary: String
    $mortgageCountry: String
    $mortgageState: String
    $mortgageCity: String
    $mortgageAbout: String
    $mortgageServices: [String!]
    $inboundContextLookupEnabled: Boolean!
    $firstCallAttemptDelayMinutes: Int!
    $callRetryAttemptsMax: Int!
    $callRetryIntervalMinutes: Int!
    $maxCallDurationSeconds: Int!
    $leadResponseTimeoutSeconds: Int!
    $callMissedSmsBoolean: Boolean!
    $smsDelayAfterMissedCall: Int!
    $sendEmailIfCallNotAnswered: Boolean!
    $delayBeforeFirstEmail: Int!
    $voicemailDropEnabled: Boolean!
  ) {
    updateBrokerageCallHandling(
      brokerage_id: $brokerageId
      initial_outreach_script_primary: $initialOutreachScriptPrimary
      initial_outreach_script_secondary: $initialOutreachScriptSecondary
      mortgage_country: $mortgageCountry
      mortgage_state: $mortgageState
      mortgage_city: $mortgageCity
      mortgage_about: $mortgageAbout
      mortgage_services: $mortgageServices
      inbound_context_lookup_enabled: $inboundContextLookupEnabled
      first_call_attempt_delay_minutes: $firstCallAttemptDelayMinutes
      call_retry_attempts_max: $callRetryAttemptsMax
      call_retry_interval_minutes: $callRetryIntervalMinutes
      max_call_duration_seconds: $maxCallDurationSeconds
      lead_response_timeout_seconds: $leadResponseTimeoutSeconds
      call_missed_sms_boolean: $callMissedSmsBoolean
      sms_delay_after_missed_call: $smsDelayAfterMissedCall
      send_email_if_call_not_answered: $sendEmailIfCallNotAnswered
      delay_before_first_email: $delayBeforeFirstEmail
      voicemail_drop_enabled: $voicemailDropEnabled
    ) {
      id
      initial_outreach_script_primary
      initial_outreach_script_secondary
      mortgage_country
      mortgage_state
      mortgage_city
      mortgage_about
      mortgage_services
    }
  }
`;

export const UPDATE_BROKERAGE_BUSINESS_HOURS_MUTATION = gql`
  mutation UpdateBrokerageBusinessHours(
    $brokerageId: Int!
    $businessHoursStart: String!
    $businessHoursEnd: String!
    $workingDays: [String!]!
    $timezone: String!
  ) {
    updateBrokerageBusinessHours(
      brokerage_id: $brokerageId
      business_hours_start: $businessHoursStart
      business_hours_end: $businessHoursEnd
      working_days: $workingDays
      timezone: $timezone
    ) {
      id
      business_hours_start
      business_hours_end
      working_days
      timezone
    }
  }
`;
