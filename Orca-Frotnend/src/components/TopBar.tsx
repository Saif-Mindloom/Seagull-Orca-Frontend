const avatarSrc =
  "https://www.figma.com/api/mcp/asset/4de875de-d9d7-4bdf-a559-1d140605d98e";
const refreshIconSrc =
  "https://www.figma.com/api/mcp/asset/9aa01e00-95f2-4dde-8468-0bf217956dd7";
const notificationsIconSrc =
  "https://www.figma.com/api/mcp/asset/6e4ac40c-9dea-49b7-9b70-752b4a90d6a2";

export type TopBarProps = {
  statusLabel: string;
  pageLabel: string;
};

export function TopBar({ statusLabel, pageLabel }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="crumbs">
        <span className="dot" />
        <span className="muted">{statusLabel}</span>
        <span className="slash">/</span>
        <span>{pageLabel}</span>
      </div>
      <div className="profile">
        <span className="muted">Last updated 2m ago</span>
        <button type="button" className="round-btn icon-btn" aria-label="Refresh">
          <img src={refreshIconSrc} alt="" />
        </button>
        <button
          type="button"
          className="round-btn icon-btn"
          aria-label="Notifications"
        >
          <img src={notificationsIconSrc} alt="" />
        </button>
        <img src={avatarSrc} alt="Edward Leon" />
        <div>
          <strong>Edward Leon</strong>
          <span>Senior Advisor</span>
        </div>
      </div>
    </header>
  );
}
