import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  ShieldCheck,
  GraduationCap,
  ArrowLeft,
  LogOut,
  Pencil,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role =
    user?.role === "teacher" ? "Teacher" : "Student";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
      <Navbar />

      <main className="profile-page page-container">
        <Link
          to={role === "Teacher" ? "/teacher/dashboard" : "/dashboard"}
          className="database-back-link"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <section className="profile-heading">
          <p className="section-kicker">ACCOUNT SETTINGS</p>
          <h1>My Profile</h1>
          <p>View your personal information and account details.</p>
        </section>

        <div className="profile-layout">
          <section className="profile-main-card">
            <div className="profile-avatar">
              <UserRound size={36} />
            </div>

            <h2>{user?.name || "User"}</h2>
            <p className="profile-role">
              <GraduationCap size={16} />
              {role}
            </p>

            <div className="profile-divider" />

            <div className="profile-information">
              <h3>Personal information</h3>

              <div className="profile-info-item">
                <span className="profile-info-icon">
                  <UserRound size={19} />
                </span>
                <div>
                  <span>Full name</span>
                  <strong>{user?.name || "Not available"}</strong>
                </div>
              </div>

              <div className="profile-info-item">
                <span className="profile-info-icon">
                  <Mail size={19} />
                </span>
                <div>
                  <span>Email address</span>
                  <strong>{user?.email || "Not available"}</strong>
                </div>
              </div>

              <div className="profile-info-item">
                <span className="profile-info-icon">
                  <ShieldCheck size={19} />
                </span>
                <div>
                  <span>Account role</span>
                  <strong>{role}</strong>
                </div>
              </div>
            </div>
          </section>

          <aside className="profile-sidebar">
            <section className="profile-side-card">
              <div className="profile-side-icon">
                <ShieldCheck size={22} />
              </div>

              <h3>Account security</h3>
              <p>
                Your account is protected by ApproveIT authentication.
              </p>
            </section>

            <section className="profile-side-card">
              <div className="profile-side-icon">
                <Pencil size={22} />
              </div>

              <h3>Profile editing</h3>
              <p>
                Profile editing will be available after we connect the
                account update functionality.
              </p>
              <button type="button" disabled>
                Edit profile (Coming soon)
              </button>
            </section>

            <section className="profile-logout-card">
              <div>
                <h3>Sign out</h3>
                <p>Sign out of your ApproveIT account.</p>
              </div>

              <button type="button" onClick={handleLogout}>
                <LogOut size={17} />
                Logout
              </button>
            </section>
          </aside>
        </div>
      </main>
    </>
  );
}
