import { useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { TopBar } from "../components/TopBar";

const calendarIconSrc =
  "https://www.figma.com/api/mcp/asset/e7e1e668-1500-489f-a4bb-c923e5950fbb";
const dropdownIconSrc =
  "https://www.figma.com/api/mcp/asset/18caa4fd-0107-4711-8661-24fcabbe1635";
const checkIconSrc =
  "https://www.figma.com/api/mcp/asset/93c7b27c-688a-4374-9051-d1dcf31fc9b5";
const emailIconSrc =
  "https://www.figma.com/api/mcp/asset/2ad1a1e7-9b9f-4306-9bd8-f40942e10f41";
const phoneIconSrc =
  "https://www.figma.com/api/mcp/asset/50935b94-733e-413a-9c68-f02ce07f44c1";
const locationIconSrc =
  "https://www.figma.com/api/mcp/asset/e7127bbc-e7bc-44ff-aa60-c9de60f991ed";
const timelineHeaderIconSrc =
  "https://www.figma.com/api/mcp/asset/6b90bfca-714d-4eff-ab9c-62caebbf521c";
const timelineDotIconSrc =
  "https://www.figma.com/api/mcp/asset/ed9cdd41-fff5-451f-92de-f485ddd726a3";
const timelineCalendarIconSrc =
  "https://www.figma.com/api/mcp/asset/fcce9b8b-74c3-4123-919d-ec73555bf475";
const playIconSrc =
  "https://www.figma.com/api/mcp/asset/69bf4c75-2dc4-41d8-aa57-4e60b7d098e5";
const editIconSrc =
  "https://www.figma.com/api/mcp/asset/77ad23c1-668a-48e5-bdfc-4883689816da";
const deleteIconSrc =
  "https://www.figma.com/api/mcp/asset/7c07f736-0dc3-4244-9842-6f522dd6bddb";
const callSummaryOrcaGlyphSrc =
  "https://www.figma.com/api/mcp/asset/2ce223c2-94e0-4472-95eb-6ea539a8e2b8";
const insightsIconSrc =
  "https://www.figma.com/api/mcp/asset/8c9bf382-50ff-45e8-8671-bab0ef5b1c26";
const timelineMessageIconSrc =
  "https://www.figma.com/api/mcp/asset/d6732b82-1a93-4dde-93d3-b1229dae7e79";
const timelinePhoneIconSrc =
  "https://www.figma.com/api/mcp/asset/ea2b994c-8abf-41a9-a0bd-8f5b2d73c74b";
const transcriptChevronIconSrc =
  "https://www.figma.com/api/mcp/asset/dbe86ac4-9f9b-43b2-8c8c-7ac50b498738";
const plusIconSrc =
  "https://www.figma.com/api/mcp/asset/cb03bed1-569b-433b-b9f6-81b2545498b3";

type LeadRouteState = {
  lead?: {
    id: string;
    customerName: string;
    source: string;
    amount: string;
    status: string;
    type: string;
  };
};

type NoteCategory = "general" | "action" | "completed";

type LeadNote = {
  author: string;
  time: string;
  message: string;
  tag: string;
  category: NoteCategory;
};

export function LeadDetailsPage() {
  const { leadId } = useParams();
  const location = useLocation();
  const state = location.state as LeadRouteState | null;
  const lead = state?.lead;
  const [noteFilter, setNoteFilter] = useState<"all" | NoteCategory>("all");

  const customerName = lead?.customerName ?? "Michael Sterling";
  const displayLeadId = lead?.id ?? leadId ?? "LN-2026-0847";
  const amount = lead?.amount ?? "$640,000";
  const notes: LeadNote[] = useMemo(
    () => [
      {
        author: "Edward Leon",
        time: "Today, 3:30 PM",
        message:
          "Meeting went exceptionally well. Michael is ready to proceed with the $125k down payment. Moving him to 'Meeting Held' status and starting document collection.",
        tag: "General Information",
        category: "general",
      },
      {
        author: "Edward Leon",
        time: "Today, 3:30 PM",
        message:
          "Meeting went exceptionally well. Michael is ready to proceed with the $125k down payment. Moving him to 'Meeting Held' status and starting document collection.",
        tag: "Completed",
        category: "completed",
      },
      {
        author: "Edward Leon",
        time: "Today, 3:30 PM",
        message:
          "Meeting went exceptionally well. Michael is ready to proceed with the $125k down payment. Moving him to 'Meeting Held' status and starting document collection.",
        tag: "Action Required",
        category: "action",
      },
    ],
    [],
  );

  const noteCounts = useMemo(() => {
    const counts = { general: 0, action: 0, completed: 0 };
    notes.forEach((note) => {
      counts[note.category] += 1;
    });
    return counts;
  }, [notes]);

  const visibleNotes = useMemo(() => {
    if (noteFilter === "all") return notes;
    return notes.filter((note) => note.category === noteFilter);
  }, [notes, noteFilter]);

  const waveformHeights = [
    8, 16, 12, 24, 32, 20, 8, 12, 28, 16, 8, 20, 32, 24, 16, 12, 20, 8, 12, 16,
    24, 12, 8, 20, 32, 16, 8, 24, 28, 12, 20, 8, 16,
  ];

  return (
    <main className="content lead-details-page">
      <TopBar statusLabel="Orca AI Agent Active" pageLabel="" />

      <div className="ldp-inner">
        <header className="ldp-head">
          <div>
            <p className="ldp-breadcrumb">
              <Link to="/leads">All Leads</Link> <span>/</span> <strong>{customerName}</strong>
            </p>
            <h1>{customerName}</h1>
            <p className="ldp-meta">
              Lead ID: <code>#{displayLeadId}</code> • Created on Feb 20, 2026
            </p>
          </div>
          <div className="ldp-actions">
            <button type="button" className="ldp-btn-outline">
              <img src={calendarIconSrc} alt="" />
              New Meeting
            </button>
            <button type="button" className="ldp-btn-solid">
              Update Lead Status
              <img src={dropdownIconSrc} alt="" />
            </button>
          </div>
        </header>

        <section className="ldp-progress">
          <div className="ldp-track" />
          <div className="ldp-track-active" />
          <div className="ldp-steps">
            {[
              { label: "Lead Ingested", complete: true },
              { label: "Qualified", complete: true },
              { label: "Meeting Booked", complete: true },
              { label: "Meeting Held", complete: true, note: "Completed Feb 24" },
              { label: "Onboarded", complete: false },
            ].map((step) => (
              <div className="ldp-step" key={step.label}>
                <span className={`ldp-step-dot ${step.complete ? "complete" : ""}`}>
                  {step.complete ? <img src={checkIconSrc} alt="" /> : null}
                </span>
                <strong>{step.label}</strong>
                {step.note ? <em>{step.note}</em> : null}
              </div>
            ))}
          </div>
        </section>

        <section className="ldp-grid">
          <div className="ldp-left">
            <section className="ldp-card ldp-qualification">
              <header>
                <h3>Lead Qualifications</h3>
                <span>Hot Lead • 98/100</span>
              </header>
              <div className="ldp-qualification-grid">
                <article><label>Property Value</label><strong>{amount}</strong></article>
                <article><label>Closing Date</label><strong>Mar 12, 2026</strong></article>
                <article><label>Credit Score</label><strong className="good">720</strong></article>
                <article><label>Down Payment</label><strong>$125,000</strong></article>
                <article><label>DTI Ratio</label><strong>28%</strong></article>
                <article><label>Location</label><strong>Toronto, ON</strong></article>
              </div>
            </section>

            <section className="ldp-card ldp-activity">
              <header className="ldp-activity-head">
                <span className="ldp-call-logo" aria-hidden="true">
                  <span className="ldp-call-logo-bg" />
                  <img src={callSummaryOrcaGlyphSrc} alt="" />
                </span>
                <div>
                  <h3>Orca Call Summary</h3>
                  <p>Auto-generated from initial contact call</p>
                </div>
              </header>

              <article className="ldp-sentiment">
                <h4>Orca AI Sentiment Analysis</h4>
                <p>
                  The client exhibited high urgency and confidence. Sentiment shifted from neutral to very positive when discussing
                  5-year fixed rate options. Recommend moving to formal application immediately.
                </p>
              </article>

              <div className="ldp-timeline-head">
                <img src={timelineHeaderIconSrc} alt="" />
                <h4>Agent Activity Timeline</h4>
              </div>

              <div className="ldp-timeline">
                {[
                  {
                    title: "Meeting reminder sent (6 hours before)",
                    detail: "Automated system notification via email",
                    date: "Feb 21, 8:00 AM",
                    icon: timelineMessageIconSrc,
                  },
                  {
                    title: "Confirmation email sent",
                    detail: "Sent to marcus.sterling@gmail.com",
                    date: "Feb 20, 10:41 AM",
                    icon: timelineMessageIconSrc,
                  },
                  {
                    title: `Meeting scheduled with ${customerName}`,
                    detail: "Scheduled for Feb 21 at 2:00 PM via Google Meet",
                    date: "Feb 20, 10:40 AM",
                    icon: timelineCalendarIconSrc,
                    highlighted: true,
                  },
                  {
                    title: "Initial contact call by Orca",
                    detail: "Duration: 4m 32s. Lead qualified successfully.",
                    date: "Feb 20, 10:35 AM",
                    icon: timelinePhoneIconSrc,
                    call: true,
                  },
                ].map((item) => (
                  <article
                    className={`ldp-timeline-item ${item.highlighted ? "highlighted" : ""} ${item.call ? "call" : ""}`}
                    key={item.title}
                  >
                    <span className="ldp-timeline-dot">
                      <img src={item.icon ?? timelineDotIconSrc} alt="" />
                    </span>
                    <div className="ldp-timeline-content">
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.detail}</p>
                      </div>
                      <time>{item.date}</time>
                    </div>
                  </article>
                ))}
              </div>

              <div className="ldp-audio-wrap">
                <button type="button" className="ldp-audio-play" aria-label="Play call">
                  <img src={playIconSrc} alt="" />
                </button>
                <div className="ldp-audio">
                <div className="ldp-audio-top">
                  <span>INITIAL INTAKE CALL • 4M 32S</span>
                  <span>0:42 / 4:32</span>
                </div>
                <div className="ldp-waveform" aria-hidden="true">
                  {waveformHeights.map((height, idx) => (
                    <span
                      key={`${height}-${idx}`}
                      className={`ldp-wave-bar ${idx >= 3 && idx <= 5 ? "active" : ""}`}
                      style={{ height: `${height}px` }}
                    />
                  ))}
                </div>
                </div>
              </div>

              <section className="ldp-transcript">
                <header>
                  <h5>Transcript Preview</h5>
                  <img src={transcriptChevronIconSrc} alt="" />
                </header>
                <div className="ldp-transcript-body">
                  <p><strong className="orca">Orca:</strong> Hello, this is Shaun from Seagul Mortgage Services. May I speak with Michael Sterling?</p>
                  <p><strong className="michael">Michael:</strong> Yes, this is Michael speaking.</p>
                  <p><strong className="orca">Orca:</strong> Hi Michael! I&apos;m reaching out regarding your recent inquiry about mortgage services. Do you have a few minutes to discuss your mortgage needs?</p>
                  <p><strong className="michael">Michael:</strong> Sure. I&apos;m actually looking to buy my first home and I&apos;m a bit overwhelmed with the process.</p>
                </div>
              </section>
            </section>
          </div>

          <aside className="ldp-right">
            <section className="ldp-card ldp-profile">
              <header><h3>Lead Profile</h3></header>
              <div className="ldp-profile-section">
                <h4>Contact Information</h4>
                <p><span><img src={emailIconSrc} alt="" /></span> marcus.sterling@gmail.com</p>
                <p><span><img src={phoneIconSrc} alt="" /></span> +1 (416) 555-0123</p>
                <p><span><img src={locationIconSrc} alt="" /></span> Toronto, ON</p>
              </div>
              <div className="ldp-profile-section">
                <h4 className="insights"><img src={insightsIconSrc} alt="" /> Orca Insights</h4>
                <div className="ldp-insights-grid">
                  <article><label>Property Type</label><strong>{lead?.type ?? "Multi-Unit Residential"}</strong></article>
                  <article><label>Transaction Type</label><strong>First Mortgage</strong></article>
                  <article><label>Employment</label><strong>Self-Employed (5yr+)</strong></article>
                  <article><label>Annual Income</label><strong>$250,000+</strong></article>
                  <article><label>Lead Source</label><strong>{lead?.source ?? "Zillow Premier"}</strong></article>
                </div>
              </div>
            </section>

            <section className="ldp-card ldp-notes">
              <header>
                <h3>Advisor Notes</h3>
                <button type="button" aria-label="Add note"><img src={plusIconSrc} alt="" /></button>
              </header>
              <nav className="ldp-note-tabs">
                <button
                  type="button"
                  className={noteFilter === "all" ? "active" : ""}
                  onClick={() => setNoteFilter("all")}
                >
                  All
                </button>
                <button
                  type="button"
                  className={noteFilter === "general" ? "active" : ""}
                  onClick={() => setNoteFilter("general")}
                >
                  General[{noteCounts.general}]
                </button>
                <button
                  type="button"
                  className={noteFilter === "action" ? "active" : ""}
                  onClick={() => setNoteFilter("action")}
                >
                  Action[{noteCounts.action}]
                </button>
                <button
                  type="button"
                  className={noteFilter === "completed" ? "active" : ""}
                  onClick={() => setNoteFilter("completed")}
                >
                  Completed[{noteCounts.completed}]
                </button>
              </nav>
              <div className="ldp-note-list">
                {visibleNotes.map((note) => (
                  <article key={`${note.category}-${note.time}`}>
                    <div className="ldp-note-head">
                      <div className="ldp-note-author">
                        <span>EL</span>
                        <strong>{note.author}</strong>
                      </div>
                      <time>{note.time}</time>
                    </div>
                    <p>{note.message}</p>
                    <footer>
                      <span className={`tag tag-${note.category}`}>{note.tag}</span>
                      <button type="button"><img src={editIconSrc} alt="" /> Edit</button>
                      <button type="button"><img src={deleteIconSrc} alt="" /> Delete</button>
                    </footer>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
