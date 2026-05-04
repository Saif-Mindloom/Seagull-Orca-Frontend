import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { TopBar } from "../components/TopBar";
import { useAuth } from "../context/AuthContext";
import {
  BROKERAGE_SETTINGS_QUERY,
  UPDATE_BROKERAGE_BUSINESS_HOURS_MUTATION,
  UPDATE_BROKERAGE_CALL_HANDLING_MUTATION,
} from "../graphql/operations";
import type {
  BrokerageSettingsQuery,
  BrokerageSettingsVars,
  UpdateBrokerageBusinessHoursMutation,
  UpdateBrokerageBusinessHoursVars,
  UpdateBrokerageCallHandlingMutation,
  UpdateBrokerageCallHandlingVars,
} from "../graphql/types";

const helpIconSrc =
  "https://www.figma.com/api/mcp/asset/90540ff0-fdfa-46be-b6ee-abe2b9ab5b28";
const selectChevronIconSrc =
  "https://www.figma.com/api/mcp/asset/ae6e651d-1c88-4427-bb98-ecea8aeb5ea3";
const checkIconSrc =
  "https://www.figma.com/api/mcp/asset/a0ce4fd7-72df-4a2b-9c19-daacc70922cc";
const volumeIconSrc =
  "https://www.figma.com/api/mcp/asset/a5c961bb-dc1f-4e0f-bb1c-45706e758bab";

type SettingsTab = "agent" | "messaging" | "qualification" | "teams";
type ScriptVariant = "primary" | "secondary";
const DAY_TO_API: Record<string, string> = {
  MON: "Mon",
  TUE: "Tue",
  WED: "Wed",
  THU: "Thu",
  FRI: "Fri",
  SAT: "Sat",
  SUN: "Sun",
};
const DAY_FROM_API: Record<string, string> = {
  Mon: "MON",
  Tue: "TUE",
  Wed: "WED",
  Thu: "THU",
  Fri: "FRI",
  Sat: "SAT",
  Sun: "SUN",
};

function normalizeTimeForSelect(time: string | null | undefined): string {
  if (!time) return "09:00 AM";
  const direct = time.trim().toUpperCase();
  if (direct.includes("AM") || direct.includes("PM")) return direct;
  const match = direct.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return "09:00 AM";
  const h = Number(match[1]);
  const m = match[2];
  const suffix = h >= 12 ? "PM" : "AM";
  const normalizedHour = h % 12 || 12;
  return `${String(normalizedHour).padStart(2, "0")}:${m} ${suffix}`;
}

function toBackendTime(time: string): string {
  const match = time.trim().toUpperCase().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (!match) return time;
  let hour = Number(match[1]);
  const minute = match[2];
  const suffix = match[3];
  if (suffix === "AM") {
    hour = hour === 12 ? 0 : hour;
  } else {
    hour = hour === 12 ? 12 : hour + 12;
  }
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

export function SettingsPage() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("agent");
  const [scriptVariant, setScriptVariant] = useState<ScriptVariant>("primary");
  const [primaryScript, setPrimaryScript] = useState("");
  const [secondaryScript, setSecondaryScript] = useState("");
  const [aboutBusiness, setAboutBusiness] = useState("");
  const [openTime, setOpenTime] = useState("09:00 AM");
  const [closeTime, setCloseTime] = useState("05:00 PM");
  const [country, setCountry] = useState("United States");
  const [province, setProvince] = useState("California");
  const [city, setCity] = useState("Los Angeles");
  const [workingDays, setWorkingDays] = useState<string[]>([
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
  ]);
  const [mortgageTypes, setMortgageTypes] = useState<Record<string, boolean>>({
    "First Mortgage": true,
    "Second Mortgage": true,
    Renewals: true,
    Transfers: true,
  });

  const brokerageId = user?.brokerage_id;
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const settingsQuery = useQuery<BrokerageSettingsQuery, BrokerageSettingsVars>(
    BROKERAGE_SETTINGS_QUERY,
    {
      variables: { id: String(brokerageId ?? 0) },
      skip: !token || !brokerageId,
      errorPolicy: "all",
    },
  );

  const [updateCallHandling, updateCallHandlingState] = useMutation<
    UpdateBrokerageCallHandlingMutation,
    UpdateBrokerageCallHandlingVars
  >(UPDATE_BROKERAGE_CALL_HANDLING_MUTATION);

  const [updateBusinessHours, updateBusinessHoursState] = useMutation<
    UpdateBrokerageBusinessHoursMutation,
    UpdateBrokerageBusinessHoursVars
  >(UPDATE_BROKERAGE_BUSINESS_HOURS_MUTATION);
  const tabs: { id: SettingsTab; label: string }[] = [
    { id: "agent", label: "Agent Behaviour" },
    { id: "messaging", label: "SMS & Email Configuration" },
    { id: "qualification", label: "Lead Qualification" },
    { id: "teams", label: "Teams & Roles" },
  ];

  useEffect(() => {
    const brokerage = settingsQuery.data?.brokerage;
    if (!brokerage) return;
    setPrimaryScript(brokerage.initial_outreach_script_primary ?? "");
    setSecondaryScript(brokerage.initial_outreach_script_secondary ?? "");
    setAboutBusiness(brokerage.mortgage_about ?? "");
    setCountry(brokerage.mortgage_country ?? "United States");
    setProvince(brokerage.mortgage_state ?? "California");
    setCity(brokerage.mortgage_city ?? "Los Angeles");
    setOpenTime(normalizeTimeForSelect(brokerage.business_hours_start));
    setCloseTime(normalizeTimeForSelect(brokerage.business_hours_end));
    setWorkingDays(
      brokerage.working_days?.length
        ? brokerage.working_days.map((d) => DAY_FROM_API[d] ?? d.toUpperCase())
        : ["MON", "TUE", "WED", "THU", "FRI"],
    );
    const services = new Set(brokerage.mortgage_services ?? []);
    setMortgageTypes({
      "First Mortgage": services.has("First Mortgage"),
      "Second Mortgage": services.has("Second Mortgage"),
      Renewals: services.has("Renewals"),
      Transfers: services.has("Transfers"),
    });
  }, [settingsQuery.data]);

  const isSaving =
    updateCallHandlingState.loading || updateBusinessHoursState.loading;
  const availableTimes = useMemo(
    () => ["08:00 AM", "09:00 AM", "10:00 AM", "05:00 PM", "06:00 PM"],
    [],
  );

  const callHandlingDefaults = settingsQuery.data?.brokerage;

  function toggleWorkingDay(day: string) {
    setWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }

  function toggleMortgageType(name: string) {
    setMortgageTypes((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  async function handleSave() {
    if (!brokerageId || !callHandlingDefaults) return;
    setSaveError(null);
    setSavedMessage(null);
    try {
      await updateBusinessHours({
        variables: {
          brokerageId,
          businessHoursStart: toBackendTime(openTime),
          businessHoursEnd: toBackendTime(closeTime),
          workingDays: [...workingDays]
            .map((d) => DAY_TO_API[d] ?? d)
            .sort(),
          timezone: callHandlingDefaults.timezone || "America/Toronto",
        },
      });

      await updateCallHandling({
        variables: {
          brokerageId,
          initialOutreachScriptPrimary: primaryScript,
          initialOutreachScriptSecondary: secondaryScript,
          mortgageCountry: country,
          mortgageState: province,
          mortgageCity: city,
          mortgageAbout: aboutBusiness,
          mortgageServices: Object.entries(mortgageTypes)
            .filter(([, checked]) => checked)
            .map(([name]) => name),
          inboundContextLookupEnabled:
            callHandlingDefaults.inbound_context_lookup_enabled,
          firstCallAttemptDelayMinutes:
            callHandlingDefaults.first_call_attempt_delay_minutes,
          callRetryAttemptsMax: callHandlingDefaults.call_retry_attempts_max,
          callRetryIntervalMinutes:
            callHandlingDefaults.call_retry_interval_minutes,
          maxCallDurationSeconds: callHandlingDefaults.max_call_duration_seconds,
          leadResponseTimeoutSeconds:
            callHandlingDefaults.lead_response_timeout_seconds,
          callMissedSmsBoolean: callHandlingDefaults.call_missed_sms_boolean,
          smsDelayAfterMissedCall:
            callHandlingDefaults.sms_delay_after_missed_call,
          sendEmailIfCallNotAnswered:
            callHandlingDefaults.send_email_if_call_not_answered,
          delayBeforeFirstEmail:
            callHandlingDefaults.delay_before_first_email,
          voicemailDropEnabled: callHandlingDefaults.voicemail_drop_enabled,
        },
      });

      setSavedMessage("Configuration saved.");
      void settingsQuery.refetch();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    }
  }

  function resetFromServer() {
    const brokerage = settingsQuery.data?.brokerage;
    if (!brokerage) return;
    setPrimaryScript(brokerage.initial_outreach_script_primary ?? "");
    setSecondaryScript(brokerage.initial_outreach_script_secondary ?? "");
    setAboutBusiness(brokerage.mortgage_about ?? "");
    setCountry(brokerage.mortgage_country ?? "United States");
    setProvince(brokerage.mortgage_state ?? "California");
    setCity(brokerage.mortgage_city ?? "Los Angeles");
    setOpenTime(normalizeTimeForSelect(brokerage.business_hours_start));
    setCloseTime(normalizeTimeForSelect(brokerage.business_hours_end));
    setWorkingDays(
      brokerage.working_days?.length
        ? brokerage.working_days.map((d) => DAY_FROM_API[d] ?? d.toUpperCase())
        : ["MON", "TUE", "WED", "THU", "FRI"],
    );
    const services = new Set(brokerage.mortgage_services ?? []);
    setMortgageTypes({
      "First Mortgage": services.has("First Mortgage"),
      "Second Mortgage": services.has("Second Mortgage"),
      Renewals: services.has("Renewals"),
      Transfers: services.has("Transfers"),
    });
  }

  return (
    <main className="content settings-page">
      <TopBar statusLabel="Orca AI Agent Active" pageLabel="" />

      <div className="settings-inner">
        <section className="settings-title-wrap">
          <h1>Settings</h1>
          <p>Configure how Orca manages your leads and integrations.</p>
        </section>

        <section className="settings-layout">
          <aside className="settings-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={activeTab === tab.id ? "active" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </aside>

          <div className="settings-content">
            {settingsQuery.error && (
              <div className="graphql-banner graphql-banner-error">
                <span>{settingsQuery.error.message}</span>
              </div>
            )}
            {!token && (
              <div className="graphql-banner graphql-banner-warn">
                <span>Sign in to load and edit settings.</span>
              </div>
            )}
            {savedMessage && (
              <div className="graphql-banner">
                <span>{savedMessage}</span>
              </div>
            )}
            {saveError && (
              <div className="graphql-banner graphql-banner-error">
                <span>{saveError}</span>
              </div>
            )}
            <section className="settings-card">
              <header>
                <h2>Orca Configuration</h2>
                <p>Manage how Orca interacts with leads and handles qualifications</p>
              </header>

              <div className="settings-row">
                <div className="settings-row-copy">
                  <h3>Orca Tone & Personality</h3>
                  <p>Set the conversational style for AI text and voice outreach</p>
                </div>
                <label className="settings-select">
                  <select
                    value={scriptVariant}
                    onChange={(e) =>
                      setScriptVariant(e.target.value as ScriptVariant)
                    }
                  >
                    <option value="primary">Primary Script</option>
                    <option value="secondary">Secondary Script</option>
                  </select>
                  <img src={selectChevronIconSrc} alt="" />
                </label>
              </div>

              <div className="settings-row settings-script">
                <div className="settings-row-copy">
                  <div className="settings-row-label">
                    <h3>
                      {scriptVariant === "primary"
                        ? "Initial Outreach Script (Primary)"
                        : "Initial Outreach Script (Secondary)"}
                    </h3>
                    <img src={helpIconSrc} alt="" />
                  </div>
                  <p>The first call introduction by Orca when a new lead is captured</p>
                  <div className="settings-help-tip">
                    This prompt defines the AI&apos;s persona when first contact a lead. Focus on professional
                    warmth and expertise.
                  </div>
                </div>
                <div className="settings-script-box">
                  <textarea
                    value={
                      scriptVariant === "primary" ? primaryScript : secondaryScript
                    }
                    onChange={(e) =>
                      scriptVariant === "primary"
                        ? setPrimaryScript(e.target.value)
                        : setSecondaryScript(e.target.value)
                    }
                    rows={6}
                  />
                  <button type="button" aria-label="Play voice preview">
                    <img src={volumeIconSrc} alt="" />
                  </button>
                </div>
              </div>
            </section>

            <section className="settings-card">
              <header>
                <h2>Brokerage Rules</h2>
                <p>Core business details for your AI agent&apos;s operations</p>
              </header>

              <div className="settings-block">
                <h3>About Your Mortgage Business</h3>
                <textarea
                  rows={4}
                  value={aboutBusiness}
                  onChange={(e) => setAboutBusiness(e.target.value)}
                />
              </div>

              <div className="settings-block">
                <h3>Brokerage Working Hours</h3>
                <p>Define when Orca can reach out to leads</p>
                <div className="settings-days">
                  {["MON", "TUE", "WED", "THU", "FRI"].map((d) => (
                    <button
                      type="button"
                      key={d}
                      className={workingDays.includes(d) ? "on" : ""}
                      onClick={() => toggleWorkingDay(d)}
                    >
                      {d}
                    </button>
                  ))}
                  {["SAT", "SUN"].map((d) => (
                    <button
                      type="button"
                      key={d}
                      className={workingDays.includes(d) ? "on" : ""}
                      onClick={() => toggleWorkingDay(d)}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <div className="settings-grid-2">
                  <label>
                    <span>Daily Open</span>
                    <select value={openTime} onChange={(e) => setOpenTime(e.target.value)}>
                      {availableTimes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Daily Close</span>
                    <select value={closeTime} onChange={(e) => setCloseTime(e.target.value)}>
                      {availableTimes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="settings-block">
                <h3>Operating Location</h3>
                <div className="settings-grid-3">
                  <label>
                    <span>Country</span>
                    <select value={country} onChange={(e) => setCountry(e.target.value)}>
                      <option>United States</option>
                    </select>
                  </label>
                  <label>
                    <span>Province / State</span>
                    <select value={province} onChange={(e) => setProvince(e.target.value)}>
                      <option>California</option>
                    </select>
                  </label>
                  <label>
                    <span>City</span>
                    <select value={city} onChange={(e) => setCity(e.target.value)}>
                      <option>Los Angeles</option>
                    </select>
                  </label>
                </div>
                <button type="button" className="settings-add-location">
                  + Add New
                </button>
              </div>

              <div className="settings-block">
                <h3>Mortgage Types</h3>
                <p>Choose the types of mortgages under residential and commercial</p>
                <div className="settings-type-grid">
                  <div className="settings-type-card">
                    <h4>Residential</h4>
                    {[
                      { label: "First Mortgage", checked: true },
                      { label: "Second Mortgage", checked: true },
                      { label: "Renewals", checked: false },
                      { label: "Transfers", checked: false },
                    ].map((opt) => (
                      <label key={opt.label} className="settings-check">
                        <span
                          className={mortgageTypes[opt.label] ? "checked" : ""}
                          onClick={() => toggleMortgageType(opt.label)}
                        >
                          {mortgageTypes[opt.label] ? <img src={checkIconSrc} alt="" /> : null}
                        </span>
                        {opt.label}
                      </label>
                    ))}
                  </div>
                  <div className="settings-type-card">
                    <h4>Commercial</h4>
                    {[
                      { label: "First Mortgage", checked: false },
                      { label: "Second Mortgage", checked: false },
                      { label: "Renewals", checked: true },
                      { label: "Transfers", checked: true },
                    ].map((opt) => (
                      <label key={opt.label} className="settings-check">
                        <span
                          className={mortgageTypes[opt.label] ? "checked" : ""}
                          onClick={() => toggleMortgageType(opt.label)}
                        >
                          {mortgageTypes[opt.label] ? <img src={checkIconSrc} alt="" /> : null}
                        </span>
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <div className="settings-actions">
              <button type="button" className="discard" onClick={resetFromServer}>
                Discard Changes
              </button>
              <button type="button" className="save" onClick={handleSave} disabled={isSaving || !brokerageId}>
                {isSaving ? "Saving..." : "Save Configuration"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
