import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { TopBar } from "../components/TopBar";
import { useAuth } from "../context/AuthContext";
import {
  LEADS_TABLE_QUERY,
  REPORTING_DASHBOARD_KPIS,
} from "../graphql/operations";
import type {
  DashboardKpisQuery,
  LeadsTableQuery,
  LeadsTableVars,
  ReportingFilterVars,
} from "../graphql/types";
import {
  formatInt,
  formatTimestamp,
  formatUsdFull,
  splitContact,
} from "../utils/format";

const metricPeopleIcon =
  "https://www.figma.com/api/mcp/asset/42a4e5e1-2269-4a07-a095-1763cb1384ce";
const exportIconSrc =
  "https://www.figma.com/api/mcp/asset/6d245697-cd5b-4e86-b340-02d6a2fe2e7e";
const newLeadIconSrc =
  "https://www.figma.com/api/mcp/asset/bd08c7e3-d9db-4c82-9972-16f0c0817a1b";
const alertIconSrc =
  "https://www.figma.com/api/mcp/asset/954071e9-e7b0-4a7d-954b-8639283ad50a";
const phoneIconSrc =
  "https://www.figma.com/api/mcp/asset/b82eaa67-18b4-4865-a93c-e0b3bb480af6";
const emailIconSrc =
  "https://www.figma.com/api/mcp/asset/ed01f884-3fa1-424a-90b5-9b436b0f83b0";
const searchIconSrc =
  "https://www.figma.com/api/mcp/asset/fe522bdb-51e6-40a6-89b0-c56ec2303c20";
const chevronIconSrc =
  "https://www.figma.com/api/mcp/asset/7b3b6083-c04a-450c-a9c9-73fc0afbb53a";

type TabId = "all" | "qualified" | "exceptions";

type LeadRowView = {
  id: string;
  customerName: string;
  customerMeta: string;
  phone: string;
  email: string;
  source: string;
  status: string;
  type: string;
  advisor: string;
  amount: string;
  created: string;
};

const reportingFilter = { datePreset: "THIS_MONTH" };

function normStatus(s: string) {
  return s.trim().toUpperCase().replace(/\s+/g, "_");
}

function matchesTab(row: LeadRowView, tab: TabId) {
  const st = normStatus(row.status);
  if (tab === "all") return true;
  if (tab === "exceptions") return st === "DISQUALIFIED";
  return st !== "DISQUALIFIED";
}

const STATUS_BADGE_CLASS = new Set([
  "new",
  "contacting",
  "nurturing",
  "qualified",
  "disqualified",
  "meeting-booked",
  "onboarded",
]);

function LeadStatusBadge({ status }: { status: string }) {
  const key = normStatus(status).toLowerCase().replace(/_/g, "-");
  const badge = STATUS_BADGE_CLASS.has(key) ? key : "unknown";
  const label = normStatus(status)
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
  return (
    <span className={`lp-status lp-status-${badge}`}>{label}</span>
  );
}

export function LeadsPipelinePage() {
  const { token } = useAuth();
  const [tab, setTab] = useState<TabId>("all");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const kpiQuery = useQuery<DashboardKpisQuery, ReportingFilterVars>(
    REPORTING_DASHBOARD_KPIS,
    {
      variables: { filter: reportingFilter },
      skip: !token,
      errorPolicy: "all",
    },
  );

  const leadsQuery = useQuery<LeadsTableQuery, LeadsTableVars>(
    LEADS_TABLE_QUERY,
    {
      variables: { limit: 1000, offset: 0 },
      skip: !token,
      errorPolicy: "all",
    },
  );

  const rows: LeadRowView[] = useMemo(() => {
    const raw = leadsQuery.data?.leadsTable ?? [];
    return raw.map((r) => {
      const { phone, email } = splitContact(r.contact ?? "");
      return {
        id: String(r.lead_input_id),
        customerName: r.customer ?? "—",
        customerMeta: `ID: ${r.lead_input_id}`,
        phone,
        email,
        source: r.source ?? "—",
        status: r.status ?? "",
        type: r.type?.trim() ? r.type : "—",
        advisor: r.advisor?.trim() ? r.advisor : "—",
        amount:
          r.amount != null && Number.isFinite(r.amount)
            ? formatUsdFull(r.amount)
            : "—",
        created: formatTimestamp(r.lead_ingested),
      };
    });
  }, [leadsQuery.data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((lead) => {
      if (!matchesTab(lead, tab)) return false;
      if (statusFilter !== "all") {
        const sf = normStatus(statusFilter);
        if (normStatus(lead.status) !== sf) return false;
      }
      if (!q) return true;
      const hay =
        `${lead.customerName} ${lead.email} ${lead.phone} ${lead.customerMeta} ${lead.id}`.toLowerCase();
      return hay.includes(q);
    });
  }, [rows, tab, query, statusFilter]);

  const allCount = rows.length;
  const qualifiedCount = rows.filter((l) => matchesTab(l, "qualified")).length;
  const exceptionsCount = rows.filter((l) =>
    matchesTab(l, "exceptions"),
  ).length;

  const kpis = kpiQuery.data?.reportingDashboardKpis;
  const statsLoading = !token || (kpiQuery.loading && !kpiQuery.data);
  const dash = (v: string) => (statsLoading ? "…" : v);

  return (
    <main className="content leads-page">
      <TopBar statusLabel="Orca AI Agent Active" pageLabel="Leads Pipeline" />

      {!token && (
        <div className="graphql-banner graphql-banner-warn lp-banner">
          <span>
            Sign in to load the leads table and KPIs.{" "}
            <Link to="/login">Go to login</Link>
          </span>
        </div>
      )}

      {token && leadsQuery.error && (
        <div className="graphql-banner graphql-banner-error lp-banner">
          <span>{leadsQuery.error.message}</span>
        </div>
      )}

      <div className="lp-inner">
        <header className="lp-page-head">
          <div>
            <h1 className="lp-title">Orca Performance Analytics</h1>
            <p className="lp-subtitle">
              System-wide processing health and accuracy metrics.
            </p>
          </div>
          <div className="lp-actions">
            <button type="button" className="lp-btn-outline">
              <img src={exportIconSrc} alt="" width={12} height={12} />
              Export
            </button>
            <button type="button" className="lp-btn-solid">
              <img src={newLeadIconSrc} alt="" width={12} height={12} />
              New Leads
            </button>
          </div>
        </header>

        <section className="lp-metrics" aria-label="Pipeline metrics">
          <article className="lp-metric-card">
            <div className="lp-metric-head">
              <span className="lp-metric-label">Total leads processed</span>
              <img src={metricPeopleIcon} alt="" width={16} height={16} />
            </div>
            <p className="lp-metric-value">
              {dash(formatInt(kpis?.totalLeadsProcessed ?? 0))}
            </p>
          </article>
          <article className="lp-metric-card">
            <div className="lp-metric-head">
              <span className="lp-metric-label">Meetings scheduled</span>
              <img src={metricPeopleIcon} alt="" width={16} height={16} />
            </div>
            <p className="lp-metric-value">
              {dash(formatInt(kpis?.totalMeetingsSet ?? 0))}
            </p>
          </article>
          <article className="lp-metric-card">
            <div className="lp-metric-head">
              <span className="lp-metric-label">Onboarded leads</span>
              <img src={metricPeopleIcon} alt="" width={16} height={16} />
            </div>
            <p className="lp-metric-value">
              {dash(formatInt(kpis?.onboardedLeads ?? 0))}
            </p>
          </article>
          <article className="lp-metric-card">
            <div className="lp-metric-head">
              <span className="lp-metric-label">Onboarded lead value</span>
              <img src={metricPeopleIcon} alt="" width={16} height={16} />
            </div>
            <p className="lp-metric-value">
              {dash(formatUsdFull(kpis?.onboardedLeadValue ?? 0))}
            </p>
          </article>
        </section>

        <hr className="lp-metrics-divider" aria-hidden />

        <aside className="lp-alert" role="status">
          <img src={alertIconSrc} alt="" width={15} height={13} />
          <div className="lp-alert-copy">
            <strong>
              {exceptionsCount} Exception
              {exceptionsCount === 1 ? "" : "s"} Requiring Attention
            </strong>
            <p>
              Some leads are marked as unreachable or disqualified. Review these
              cases for follow-up actions.
            </p>
          </div>
          <button type="button" className="lp-alert-review">
            Review
          </button>
        </aside>

        <section className="lp-leads-section">
          <div className="lp-section-intro">
            <h2 className="lp-section-title">{allCount} Total Leads</h2>
            <p className="lp-section-sub">
              Manage and track all leads processed by Orca
            </p>
          </div>

          <div className="lp-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "all"}
              className={`lp-tab ${tab === "all" ? "active" : ""}`}
              onClick={() => setTab("all")}
            >
              All Leads ({allCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "qualified"}
              className={`lp-tab ${tab === "qualified" ? "active" : ""}`}
              onClick={() => setTab("qualified")}
            >
              Qualified Leads ({qualifiedCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "exceptions"}
              className={`lp-tab lp-tab-warn ${tab === "exceptions" ? "active" : ""}`}
              onClick={() => setTab("exceptions")}
            >
              Exceptions ({exceptionsCount})
              <span className="lp-tab-dot" aria-hidden />
            </button>
          </div>

          <div className="lp-toolbar">
            <div className="lp-filters">
              <span className="lp-select-wrap">
                <select
                  className="lp-select"
                  aria-label="Filter by status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="NEW">New</option>
                  <option value="CONTACTING">Contacting</option>
                  <option value="NURTURING">Nurturing</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="DISQUALIFIED">Disqualified</option>
                  <option value="MEETING_BOOKED">Meeting booked</option>
                  <option value="ONBOARDED">Onboarded</option>
                </select>
                <img
                  className="lp-select-chevron"
                  src={chevronIconSrc}
                  alt=""
                  width={16}
                  height={16}
                />
              </span>
              <span className="lp-select-wrap">
                <select className="lp-select" aria-label="Filter by channel">
                  <option>All Statuses</option>
                  <option>Referral</option>
                  <option>Google Ads</option>
                  <option>Direct Mail</option>
                </select>
                <img
                  className="lp-select-chevron"
                  src={chevronIconSrc}
                  alt=""
                  width={16}
                  height={16}
                />
              </span>
              <span className="lp-select-wrap">
                <select className="lp-select" aria-label="Sort leads">
                  <option>Sort: Date Created</option>
                  <option>Sort: Amount</option>
                  <option>Sort: Customer</option>
                </select>
                <img
                  className="lp-select-chevron"
                  src={chevronIconSrc}
                  alt=""
                  width={16}
                  height={16}
                />
              </span>
            </div>
            <label className="lp-search">
              <img src={searchIconSrc} alt="" width={16} height={16} />
              <input
                type="search"
                placeholder="Search leads by name, email, or ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>

          <div className="lp-table-wrap">
            {token && leadsQuery.loading && (
              <p className="lp-table-note">Loading leads…</p>
            )}
            <table className="lp-table">
              <thead>
                <tr>
                  <th className="lp-th-check">
                    <span className="lp-checkbox" aria-hidden />
                  </th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Advisor</th>
                  <th>Amount</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <span className="lp-checkbox" aria-hidden />
                    </td>
                    <td>
                      <div className="lp-customer">
                        <strong>
                          <Link
                            className="lp-lead-link"
                            to={`/leads/${lead.id}`}
                            state={{ lead }}
                          >
                            {lead.customerName}
                          </Link>
                        </strong>
                        <span>{lead.customerMeta}</span>
                      </div>
                    </td>
                    <td>
                      <div className="lp-contact">
                        <span>
                          <img
                            src={phoneIconSrc}
                            alt=""
                            width={12}
                            height={12}
                          />
                          {lead.phone}
                        </span>
                        {lead.email ? (
                          <span>
                            <img
                              src={emailIconSrc}
                              alt=""
                              width={12}
                              height={12}
                            />
                            {lead.email}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td>{lead.source}</td>
                    <td>
                      <LeadStatusBadge status={lead.status} />
                    </td>
                    <td>{lead.type}</td>
                    <td>{lead.advisor}</td>
                    <td className="lp-amount">{lead.amount}</td>
                    <td className="lp-created">{lead.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
