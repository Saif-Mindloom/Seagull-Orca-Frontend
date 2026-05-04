import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { TopBar } from "../components/TopBar";
import { useAuth } from "../context/AuthContext";
import {
  GOOGLE_CALENDAR_EVENTS_QUERY,
  OUTLOOK_CALENDAR_EVENTS_QUERY,
  REPORTING_DASHBOARD_KPIS,
  REPORTING_ORCA_ANALYTICS,
  REPORTING_ORCA_LIVE_FEED,
  REPORTING_QUALIFICATION_ANALYTICS,
} from "../graphql/operations";
import type {
  CalendarVars,
  DashboardKpisQuery,
  GoogleCalendarQuery,
  OrcaAnalyticsQuery,
  OrcaLiveFeedItem,
  OrcaLiveFeedQuery,
  OutlookCalendarQuery,
  QualificationAnalyticsQuery,
  ReportingFilterVars,
} from "../graphql/types";
import {
  calendarRangeIso,
  formatInt,
  formatPctChange,
  formatRate,
  formatTimestamp,
  formatUsdCompact,
} from "../utils/format";

const pipelineIconSrc =
  "https://www.figma.com/api/mcp/asset/8063cc38-106c-4f70-bbc0-f4eba05c310c";
const totalIconSrc =
  "https://www.figma.com/api/mcp/asset/d721f24d-6451-4991-bb54-a3f43b0d5d6c";
const scheduledIconSrc =
  "https://www.figma.com/api/mcp/asset/467d1437-84ba-41e5-804f-bded58b88650";
const attentionIconSrc =
  "https://www.figma.com/api/mcp/asset/6f9c05dd-5855-48d2-9156-ff1170a6598e";

const deltaPipelineIconSrc =
  "https://www.figma.com/api/mcp/asset/694020a4-1871-41a9-8fde-e0250c40281b";
const deltaTotalIconSrc =
  "https://www.figma.com/api/mcp/asset/1da4c679-ffc4-4d4f-a539-1220528368bb";
const deltaScheduledIconSrc =
  "https://www.figma.com/api/mcp/asset/069739c1-be67-4a8f-8a21-b5099824e0bb";
const deltaAttentionIconSrc =
  "https://www.figma.com/api/mcp/asset/6323b0d2-f3b4-452b-8acd-453e9f9fe0b6";

const onboardedIconSrc =
  "https://www.figma.com/api/mcp/asset/fcdf7ad4-3a02-478d-84b5-849d0a657ee1";
const qualifiedIconSrc =
  "https://www.figma.com/api/mcp/asset/fcdf7ad4-3a02-478d-84b5-849d0a657ee1";
const autobookedIconSrc =
  "https://www.figma.com/api/mcp/asset/cba8a824-276d-42f2-8205-790b01cee1e3";
const manualAssistIconSrc =
  "https://www.figma.com/api/mcp/asset/7bdc0248-b9f6-495b-a794-9f943d2cdd19";
const missingDocsIconSrc =
  "https://www.figma.com/api/mcp/asset/ee5d61e9-e369-4ef7-b1f8-e5e2b438c042";
const complexQueryIconSrc =
  "https://www.figma.com/api/mcp/asset/8b7dbbbb-9175-45cf-a331-129d0e7ec043";

const productOrcaSrc =
  "https://www.figma.com/api/mcp/asset/9d412959-9adb-4dad-872d-c480c477d947";
const productMantaSrc =
  "https://www.figma.com/api/mcp/asset/00e89a7a-7832-40d2-8f61-c88d231aa61e";
const productCoralSrc =
  "https://www.figma.com/api/mcp/asset/ed8da393-4545-4d1b-a8a0-3fae7aeabb7d";
const productReefSrc =
  "https://www.figma.com/api/mcp/asset/3060e305-86ed-4f15-9967-fcfd14bfa849";
const productTideSrc =
  "https://www.figma.com/api/mcp/asset/486e256a-8560-45de-854a-341cfbd634c3";

const timelineIconSrc =
  "https://www.figma.com/api/mcp/asset/8999b1d1-64de-4ab1-ad4a-9d9553d51e3b";
const timelineHeaderIconSrc =
  "https://www.figma.com/api/mcp/asset/6533b7e1-fb6b-42f8-83f9-5016253a23bc";
const calendarIconSrc =
  "https://www.figma.com/api/mcp/asset/6d7db56c-11c1-4cde-be74-c4b0ec67334b";

const meetingVideoIconSrc =
  "https://www.figma.com/api/mcp/asset/677055b7-560e-4943-8782-9779ce6a0ef3";
const meetingPhoneIconSrc =
  "https://www.figma.com/api/mcp/asset/e3bd8592-7aac-482d-a8c0-74b5f2d6764f";

const orcaGlyphSrc =
  "https://www.figma.com/api/mcp/asset/bc8bd9cb-9973-4dbc-8ed1-e261b5e2c175";

type StatCard = {
  title: string;
  value: string;
  topIcon: string;
  deltaText: string;
  deltaIcon: string;
  rows: { label: string; value: string; icon: string }[];
  attention?: boolean;
};

type Product = {
  name: string;
  description: string;
  icon: string;
  active: boolean;
};

type TimelineEvent = {
  title: string;
  detail: string;
  date: string;
  calendar?: boolean;
};

type Meeting = {
  day: string;
  time: string;
  meridiem: string;
  name: string;
  description: string;
  tag: string;
  icon: string;
  scheduledByOrca?: boolean;
};

const products: Product[] = [
  {
    name: "Orca",
    description: "Lead Qualification Agent",
    icon: productOrcaSrc,
    active: true,
  },
  {
    name: "Manta",
    description: "Documents & Applications Agent",
    icon: productMantaSrc,
    active: false,
  },
  {
    name: "Coral",
    description: "Lender Updates Agent",
    icon: productCoralSrc,
    active: false,
  },
  {
    name: "Reef",
    description: "Commission Claims Agent",
    icon: productReefSrc,
    active: false,
  },
  {
    name: "Tide",
    description: "Retention agent",
    icon: productTideSrc,
    active: false,
  },
];

function attentionFromFunnel(
  stages: { stage: string; count: number }[] | undefined,
): number {
  if (!stages?.length) return 0;
  return stages
    .filter((s) => /disqualif|unqual|exception|risk|attention/i.test(s.stage))
    .reduce((acc, s) => acc + s.count, 0);
}

function parseMeetingFromCalendar(params: {
  startIso: string | null | undefined;
  title: string | null | undefined;
  description: string | null | undefined;
  location: string | null | undefined;
  videoUrl: string | null | undefined;
}): Meeting {
  const d = params.startIso ? new Date(params.startIso) : new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDay = new Date(d);
  eventDay.setHours(0, 0, 0, 0);
  const diffDays = Math.round(
    (eventDay.getTime() - today.getTime()) / (24 * 3600 * 1000),
  );
  let day: string;
  if (diffDays === 0) day = "Today";
  else if (diffDays === 1) day = "Tmrw";
  else
    day = new Intl.DateTimeFormat("en-CA", {
      month: "short",
      day: "numeric",
    }).format(d);

  let hours = d.getHours();
  const meridiem = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const time = `${hours}:${String(d.getMinutes()).padStart(2, "0")}`;

  const title = params.title?.trim() || "Meeting";
  const tag = params.videoUrl ? "Video Call" : "Calendar";
  const icon = params.videoUrl ? meetingVideoIconSrc : meetingPhoneIconSrc;

  return {
    day,
    time,
    meridiem,
    name: title,
    description:
      params.description?.trim() ||
      params.location?.trim() ||
      "Scheduled event",
    tag,
    icon,
    scheduledByOrca: Boolean(params.videoUrl),
  };
}

const reportingFilter = { datePreset: "THIS_MONTH" };

export function DashboardPage() {
  const { token, user, meLoading, logout } = useAuth();
  const displayName = user?.name?.trim() || "there";
  const envBrokerage = Number(import.meta.env.VITE_DEFAULT_BROKERAGE_ID || 0);
  const brokerageId =
    user?.brokerage_id != null && user.brokerage_id > 0
      ? user.brokerage_id
      : Number.isFinite(envBrokerage) && envBrokerage > 0
        ? envBrokerage
        : undefined;

  const { startIso, endIso, timezone } = useMemo(
    () => calendarRangeIso(14),
    [],
  );

  const kpiQuery = useQuery<DashboardKpisQuery, ReportingFilterVars>(
    REPORTING_DASHBOARD_KPIS,
    {
      variables: { filter: reportingFilter },
      skip: !token,
      errorPolicy: "all",
    },
  );

  const qualQuery = useQuery<QualificationAnalyticsQuery, ReportingFilterVars>(
    REPORTING_QUALIFICATION_ANALYTICS,
    {
      variables: { filter: reportingFilter },
      skip: !token,
      errorPolicy: "all",
    },
  );

  const orcaQuery = useQuery<OrcaAnalyticsQuery, ReportingFilterVars>(
    REPORTING_ORCA_ANALYTICS,
    {
      variables: { filter: reportingFilter },
      skip: !token,
      errorPolicy: "all",
    },
  );

  const liveFeedQuery = useQuery<OrcaLiveFeedQuery, { limit?: number }>(
    REPORTING_ORCA_LIVE_FEED,
    {
      variables: { limit: 12 },
      skip: !token,
      errorPolicy: "all",
    },
  );

  const skipCal = !token || !brokerageId;
  const calVars: CalendarVars = {
    brokerageId: brokerageId ?? 0,
    startDateTime: startIso,
    endDateTime: endIso,
    timezone,
  };

  const googleCalQuery = useQuery<GoogleCalendarQuery, CalendarVars>(
    GOOGLE_CALENDAR_EVENTS_QUERY,
    {
      variables: calVars,
      skip: skipCal,
      errorPolicy: "ignore",
    },
  );

  const outlookCalQuery = useQuery<OutlookCalendarQuery, CalendarVars>(
    OUTLOOK_CALENDAR_EVENTS_QUERY,
    {
      variables: calVars,
      skip: skipCal,
      errorPolicy: "ignore",
    },
  );

  const statCards: StatCard[] = useMemo(() => {
    const kpis = kpiQuery.data?.reportingDashboardKpis;
    const orca = orcaQuery.data?.reportingOrcaAnalytics;
    const qual = qualQuery.data?.reportingQualificationAnalytics;
    const header = orca?.header;
    const op = orca?.operationalStats;
    const funnel = orca?.funnelConversion;
    const sources = qual?.sourceBreakdown ?? [];

    const statsLoading =
      !token ||
      (kpiQuery.loading && !kpiQuery.data) ||
      (orcaQuery.loading && !orcaQuery.data) ||
      (qualQuery.loading && !qualQuery.data);

    const dash = (v: string) => (statsLoading ? "…" : v);

    const attentionVal = attentionFromFunnel(funnel);
    const attentionDisplay =
      attentionVal > 0
        ? formatInt(attentionVal)
        : formatInt(op?.callsMadeToday ?? 0);

    const rowFromSources = () => {
      if (sources.length >= 2) {
        return [
          {
            label: sources[0].source,
            value: formatRate(sources[0].qualificationRate),
            icon: qualifiedIconSrc,
          },
          {
            label: sources[1].source,
            value: formatRate(sources[1].qualificationRate),
            icon: qualifiedIconSrc,
          },
        ];
      }
      return [
        {
          label: "Onboarded leads",
          value: dash(formatInt(kpis?.onboardedLeads ?? 0)),
          icon: onboardedIconSrc,
        },
        {
          label: "Overall qualification",
          value: dash(formatRate(qual?.overallQualificationRate ?? 0)),
          icon: qualifiedIconSrc,
        },
      ];
    };

    return [
      {
        title: "Pipeline Value (Est)",
        value: dash(formatUsdCompact(header?.pipelineValueEstimated ?? 0)),
        topIcon: pipelineIconSrc,
        deltaText: dash(
          formatPctChange(header?.totalLeadsProcessedPctChange ?? 0),
        ),
        deltaIcon: deltaPipelineIconSrc,
        rows: [
          {
            label: "Qualification rate",
            value: dash(formatRate(header?.qualificationRate ?? 0)),
            icon: qualifiedIconSrc,
          },
          {
            label: "Meetings booked",
            value: dash(formatInt(header?.meetingsBooked ?? 0)),
            icon: autobookedIconSrc,
          },
        ],
      },
      {
        title: "TOTAL LEADS PROCESSED",
        value: dash(formatInt(kpis?.totalLeadsProcessed ?? 0)),
        topIcon: totalIconSrc,
        deltaText: dash(
          formatPctChange(kpis?.totalLeadsProcessedPctChange ?? 0),
        ),
        deltaIcon: deltaTotalIconSrc,
        rows: rowFromSources(),
      },
      {
        title: "Meetings Scheduled",
        value: dash(formatInt(kpis?.totalMeetingsSet ?? 0)),
        topIcon: scheduledIconSrc,
        deltaText: `Orca-booked: ${dash(formatInt(header?.meetingsBooked ?? 0))}`,
        deltaIcon: deltaScheduledIconSrc,
        rows: [
          {
            label: "Calls made today",
            value: dash(formatInt(op?.callsMadeToday ?? 0)),
            icon: autobookedIconSrc,
          },
          {
            label: "Avg. nurture attempts",
            value: dash(
              (op?.avgNurturingAttemptsBeforeContact ?? 0).toFixed(1),
            ),
            icon: manualAssistIconSrc,
          },
        ],
      },
      {
        title: "Needs Attention",
        value: dash(attentionDisplay),
        topIcon: attentionIconSrc,
        deltaText: `Avg. first contact: ${dash(
          formatInt(op?.avgTimeToFirstContactSeconds ?? 0),
        )}s`,
        deltaIcon: deltaAttentionIconSrc,
        rows: [
          {
            label: "Qual. call duration (avg s)",
            value: dash(
              formatInt(op?.avgQualificationCallDurationSeconds ?? 0),
            ),
            icon: missingDocsIconSrc,
          },
          {
            label: "Pipeline funnel stages",
            value: dash(formatInt(funnel?.length ?? 0)),
            icon: complexQueryIconSrc,
          },
        ],
        attention: false,
      },
    ];
  }, [
    token,
    kpiQuery.loading,
    kpiQuery.data,
    kpiQuery.error,
    orcaQuery.loading,
    orcaQuery.data,
    qualQuery.loading,
    qualQuery.data,
  ]);

  const timelineEvents: TimelineEvent[] = useMemo(() => {
    const items = liveFeedQuery.data?.reportingOrcaLiveFeed ?? [];
    if (!items.length) {
      return [
        {
          title: "No live feed items yet",
          detail:
            "Orca activity will appear here as leads move through stages.",
          date: "—",
        },
      ];
    }
    return items.map((item: OrcaLiveFeedItem) => ({
      title: item.eventType.replace(/_/g, " "),
      detail:
        [
          item.lifecycleStage && `Stage: ${item.lifecycleStage}`,
          item.payload != null && typeof item.payload === "object"
            ? JSON.stringify(item.payload).slice(0, 120)
            : "",
        ]
          .filter(Boolean)
          .join(" · ") || `Lead #${item.leadInputId}`,
      date: formatTimestamp(item.createdAt),
      calendar: /meeting|calendar|booked/i.test(item.eventType),
    }));
  }, [liveFeedQuery.data]);

  const meetings: Meeting[] = useMemo(() => {
    const g = googleCalQuery.data?.googleCalendarEvents ?? [];
    const o = outlookCalQuery.data?.outlookCalendarEvents ?? [];
    const merged: { sortKey: string; meeting: Meeting }[] = [];
    for (const ev of g) {
      merged.push({
        sortKey: ev.startDateTime ?? "",
        meeting: parseMeetingFromCalendar({
          startIso: ev.startDateTime,
          title: ev.summary,
          description: ev.description,
          location: ev.location,
          videoUrl: ev.meetJoinUrl,
        }),
      });
    }
    for (const ev of o) {
      merged.push({
        sortKey: ev.startDateTime ?? "",
        meeting: parseMeetingFromCalendar({
          startIso: ev.startDateTime,
          title: ev.subject,
          description: null,
          location: null,
          videoUrl: ev.teamsJoinUrl,
        }),
      });
    }
    merged.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    return merged.slice(0, 8).map((row) => row.meeting);
  }, [googleCalQuery.data, outlookCalQuery.data]);

  const apiError =
    [kpiQuery.error, orcaQuery.error, qualQuery.error, liveFeedQuery.error]
      .filter(Boolean)
      .map((e) => e?.message)
      .join(" ") || null;

  return (
    <main className="content">
      <TopBar statusLabel="Orca AI Active" pageLabel="Dashboard" />

      {!token && (
        <div className="graphql-banner graphql-banner-warn">
          <span>
            Sign in to load live KPIs and meetings.{" "}
            <Link to="/login">Go to login</Link>
          </span>
        </div>
      )}

      {token && apiError && (
        <div className="graphql-banner graphql-banner-error">
          <span>{apiError}</span>
        </div>
      )}

      {token && meLoading && (
        <div className="graphql-banner">Loading profile…</div>
      )}

      <section className="headline">
        <div>
          <h1>Good Morning, {displayName}</h1>
          <p>Here&apos;s what&apos;s happening today</p>
        </div>
        <div className="headline-actions">
          <button type="button" className="dashboard-logout-btn" onClick={logout}>
            Logout
          </button>
          <button type="button" className="export-btn">
            Export Data
          </button>
        </div>
      </section>

      <section className="stats">
        {statCards.map((card) => (
          <article
            className={`stat-card ${card.attention ? "attention" : ""}`}
            key={card.title}
          >
            <div className="stat-head">
              <small>{card.title}</small>
              <img className="stat-top-icon" src={card.topIcon} alt="" />
            </div>
            <h2>{card.value}</h2>
            <p className="delta">
              <img src={card.deltaIcon} alt="" />
              {card.deltaText}
            </p>
            <div className="line-items">
              {card.rows.map((row) => (
                <div className="line-item" key={row.label}>
                  <span>
                    <img src={row.icon} alt="" />
                    {row.label}
                  </span>
                  <strong>{row.value}</strong>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="suite-wrap">
        <h3>Seagul Product Suite</h3>
        <p className="suite-state">
          <strong>1 / 5</strong> Modules Active
        </p>
        <div className="suite-row">
          {products.map((product) => (
            <article
              className={`suite-card ${product.active ? "active" : ""}`}
              key={product.name}
            >
              <div className="suite-main">
                <span
                  className={`suite-icon ${product.active ? "active" : ""}`}
                >
                  <img src={product.icon} alt="" />
                </span>
                <div>
                  <strong>{product.name}</strong>
                  <p>{product.description}</p>
                </div>
              </div>
              <span className={`suite-pill ${product.active ? "active" : ""}`}>
                {product.active ? "Active Now" : "Inactive"}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="main-grid">
        <section className="activity-panel">
          <header>
            <div className="activity-title">
              <span className="activity-logo">
                <span className="activity-logo-inner">
                  <img src={orcaGlyphSrc} alt="" />
                </span>
              </span>
              <div>
                <h3>Orca Agent Activity</h3>
                <p>Overall agent activity for today</p>
              </div>
            </div>
          </header>
          <article className="sentiment-card">
            <h4>Orca AI Sentiment Analysis</h4>
            <p>
              The client exhibited <strong>high urgency</strong> and confidence.
              Sentiment shifted from neutral to very positive when discussing
              5-year fixed rate options. Recommend moving to formal application
              immediately.
            </p>
          </article>
          <div className="timeline-head">
            <img src={timelineHeaderIconSrc} alt="" />
            <h4>Agent Activity Timeline</h4>
          </div>
          <div className="timeline">
            {timelineEvents.map((event, idx) => (
              <div className="timeline-item" key={`${event.title}-${idx}`}>
                <span className="timeline-dot">
                  <img
                    src={event.calendar ? calendarIconSrc : timelineIconSrc}
                    alt=""
                  />
                </span>
                <div className="timeline-content">
                  <div>
                    <strong>{event.title}</strong>
                    <p>{event.detail}</p>
                  </div>
                  <time>{event.date}</time>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="meeting-panel">
          <header className="meeting-header">
            <h3>Scheduled Meetings</h3>
            <a href="#">View All</a>
          </header>
          <div className="meeting-list">
            {!brokerageId && token && (
              <p className="meeting-empty">
                Set <code>VITE_DEFAULT_BROKERAGE_ID</code> or sign in so{" "}
                <code>me.brokerage_id</code> can load calendar events.
              </p>
            )}
            {brokerageId &&
              meetings.length === 0 &&
              !googleCalQuery.loading &&
              !outlookCalQuery.loading && (
                <p className="meeting-empty">
                  No calendar events in this window (Google / Outlook).
                </p>
              )}
            {meetings.map((meeting, mi) => (
              <article
                className="meeting-card"
                key={`${meeting.day}-${meeting.time}-${meeting.name}-${mi}`}
              >
                <div className="meeting-date">
                  <span>{meeting.day}</span>
                  <strong>{meeting.time}</strong>
                  <span>{meeting.meridiem}</span>
                </div>
                <div className="meeting-copy">
                  <strong>{meeting.name}</strong>
                  <p>{meeting.description}</p>
                  <div className="meeting-tags">
                    <em>
                      <img src={meeting.icon} alt="" />
                      {meeting.tag}
                    </em>
                    {meeting.scheduledByOrca && (
                      <em className="orca-tag">
                        <img src={orcaGlyphSrc} alt="" />
                        Orca Scheduled
                      </em>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
