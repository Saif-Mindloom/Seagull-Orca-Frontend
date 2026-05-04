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
