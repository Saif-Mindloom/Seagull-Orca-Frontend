import { NavLink } from "react-router-dom";

const logoSrc =
  "https://www.figma.com/api/mcp/asset/c33acbda-d5e0-477e-80b2-a96c1359e33c";
const dashboardIconSrc =
  "https://www.figma.com/api/mcp/asset/4a5ce3e9-dd31-4d55-b876-96eab50b3637";
const leadsIconSrc =
  "https://www.figma.com/api/mcp/asset/c63d7526-5b70-4b62-a58a-743fdaeb76b9";
const meetingsIconSrc =
  "https://www.figma.com/api/mcp/asset/77b148eb-0aef-42ee-8a80-d0877f9fd802";
const activityIconSrc =
  "https://www.figma.com/api/mcp/asset/ba2cdd60-0c03-4bd4-a227-d795b1e2dc11";
const settingsIconSrc =
  "https://www.figma.com/api/mcp/asset/14b9c857-66cb-48d0-8f76-d184b07c93aa";
const supportIconSrc =
  "https://www.figma.com/api/mcp/asset/0e05d0bb-bd3d-45a8-9a02-cfdf648c8d6d";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/" className="sidebar-logo-link" aria-label="Seagul home">
        <img className="logo" src={logoSrc} alt="Seagul" />
      </NavLink>
      <nav>
        <NavLink
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
          to="/"
          end
        >
          <span className="nav-icon-wrap">
            <img className="nav-icon" src={dashboardIconSrc} alt="" />
          </span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
          to="/leads"
        >
          <span className="nav-icon-wrap">
            <img className="nav-icon" src={leadsIconSrc} alt="" />
          </span>
          <span>Leads Pipeline</span>
        </NavLink>
        <a className="nav-item" href="#">
          <span className="nav-icon-wrap">
            <img className="nav-icon" src={meetingsIconSrc} alt="" />
          </span>
          <span>Scheduled Meetings</span>
        </a>
        <a className="nav-item" href="#">
          <span className="nav-icon-wrap">
            <img className="nav-icon" src={activityIconSrc} alt="" />
          </span>
          <span>Orca Activity</span>
        </a>
      </nav>
      <div className="sidebar-footer">
        <a className="nav-item" href="#">
          <span className="nav-icon-wrap">
            <img className="nav-icon" src={settingsIconSrc} alt="" />
          </span>
          <span>Settings</span>
        </a>
        <a className="nav-item" href="#">
          <span className="nav-icon-wrap">
            <img className="nav-icon" src={supportIconSrc} alt="" />
          </span>
          <span>Help &amp; Support</span>
        </a>
      </div>
    </aside>
  );
}
