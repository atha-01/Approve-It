
import { Link } from "react-router-dom";
import { ArrowUpRight, GraduationCap, CircleUserRound } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();

  // Send teachers and students to their own dashboards.
  const dashboardPath =
    user?.role === "teacher" ? "/teacher/dashboard" : "/dashboard";

  return (
    <header className="site-header">
      <nav className="navbar page-container" aria-label="Main navigation">
        <Link to="/" className="brand" aria-label="ApproveIT home">
          <span className="brand-mark">
            <GraduationCap size={23} strokeWidth={2.1} />
          </span>

          <span className="brand-name">
            Approve<span>IT</span>
          </span>
        </Link>

        <div className="nav-actions">
          <ThemeToggle />

          {isAuthenticated ? (
            <Link
              to={dashboardPath}
              className="profile-link"
              aria-label={`Open dashboard for ${user?.name || "your account"}`}
              title={user?.name || "Your dashboard"}
            >
              <CircleUserRound size={25} aria-hidden="true" />
            </Link>
          ) : (
            <Link to="/login" className="nav-login">
              Log in
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
