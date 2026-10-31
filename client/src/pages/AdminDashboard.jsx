/* eslint-disable no-unused-vars */

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  UserX,
  Clock3,
  Search,
  Bell,
  Menu,
  X,
  GraduationCap,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  CalendarDays,
  Mail,
  ShieldCheck,
  LogOut,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";

const sampleApplications = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    department: "Computer Science",
    submittedAt: "30 Oct 2026",
    status: "pending",
  },
  {
    id: 2,
    name: "Priya Verma",
    email: "priya@example.com",
    department: "Information Technology",
    submittedAt: "29 Oct 2026",
    status: "pending",
  },
  {
    id: 3,
    name: "Aman Gupta",
    email: "aman@example.com",
    department: "Electronics",
    submittedAt: "28 Oct 2026",
    status: "approved",
  },
  {
    id: 4,
    name: "Neha Singh",
    email: "neha@example.com",
    department: "Mechanical Engineering",
    submittedAt: "27 Oct 2026",
    status: "rejected",
  },
];

const navigationItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "pending", label: "Pending Applications", icon: Clock3 },
  { id: "approved", label: "Approved Teachers", icon: UserCheck },
  { id: "rejected", label: "Rejected Applications", icon: UserX },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [confirmationAction, setConfirmationAction] = useState(null);

  const applications = sampleApplications;

  const stats = {
    total: applications.length,
    pending: applications.filter((item) => item.status === "pending").length,
    approved: applications.filter((item) => item.status === "approved").length,
    rejected: applications.filter((item) => item.status === "rejected").length,
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const matchesSearch =
        application.name.toLowerCase().includes(search.toLowerCase()) ||
        application.email.toLowerCase().includes(search.toLowerCase()) ||
        application.department.toLowerCase().includes(search.toLowerCase());

      const matchesTab =
        activeTab === "overview" || application.status === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [applications, search, activeTab]);

  function handleAction(action) {
    setConfirmationAction(action);
  }

  function confirmAction() {
    if (!confirmationAction) return;

    setNotice(
      `${confirmationAction === "approve" ? "Approval" : "Rejection"} confirmed. Backend integration is still pending.`,
    );

    setConfirmationAction(null);
    setSelectedApplication(null);
  }

  function handleLogout() {
    logout();
  }

  return (
    <>
      <Navbar />

      <main className="admin-page">
        <button
          className="admin-mobile-menu"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open admin menu"
        >
          <Menu size={21} />
        </button>

        {sidebarOpen && (
          <button
            className="admin-sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          />
        )}

        <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="admin-sidebar-heading">
            <div>
              <span className="admin-sidebar-label">WORKSPACE</span>
              <h2>Administration</h2>
            </div>

            <button
              className="admin-sidebar-close"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={19} />
            </button>
          </div>

          <div className="admin-sidebar-section">
            <span className="admin-sidebar-label">MENU</span>

            <nav className="admin-sidebar-nav">
              {navigationItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    className={`admin-nav-item ${
                      activeTab === item.id ? "active" : ""
                    }`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>

                    {item.id === "pending" && stats.pending > 0 && (
                      <span className="admin-nav-count">{stats.pending}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="admin-sidebar-bottom">
            <div className="admin-sidebar-user">
              <div className="admin-avatar">
                <ShieldCheck size={20} />
              </div>

              <div>
                <strong>{user?.name || "Administrator"}</strong>
                <span>Administrator</span>
              </div>
            </div>

            <button className="admin-logout-button" onClick={handleLogout}>
              <LogOut size={17} />
              Log out
            </button>
          </div>
        </aside>

        <section className="admin-main">
          <header className="admin-page-header">
            <div>
              <span className="admin-eyebrow">APPROVEIT ADMINISTRATION</span>
              <h1>
                {activeTab === "overview"
                  ? "Dashboard Overview"
                  : navigationItems.find((item) => item.id === activeTab)
                      ?.label}
              </h1>
              <p>
                Manage teacher registrations and monitor application activity.
              </p>
            </div>

            <div className="admin-header-actions">
              <div className="admin-date">
                <CalendarDays size={17} />
                <span>Academic administration</span>
              </div>

              <div className="admin-header-avatar">
                <GraduationCap size={21} />
              </div>
            </div>
          </header>

          {notice && (
            <div className="admin-notice" role="status">
              <span>{notice}</span>
              <button onClick={() => setNotice("")} aria-label="Dismiss notice">
                <X size={17} />
              </button>
            </div>
          )}

          <section className="admin-stats-grid">
            <StatCard
              label="Total Applications"
              value={stats.total}
              icon={Users}
              description="All teacher applications"
            />
            <StatCard
              label="Pending Review"
              value={stats.pending}
              icon={Clock3}
              description="Awaiting your decision"
              accent="warning"
            />
            <StatCard
              label="Approved Teachers"
              value={stats.approved}
              icon={UserCheck}
              description="Successfully approved"
              accent="success"
            />
            <StatCard
              label="Rejected Applications"
              value={stats.rejected}
              icon={UserX}
              description="Applications declined"
              accent="danger"
            />
          </section>

          <section className="admin-applications-section">
            <div className="admin-section-heading">
              <div>
                <span className="admin-eyebrow">APPLICATION MANAGEMENT</span>
                <h2>Teacher Applications</h2>
                <p>Review and manage teacher registration requests.</p>
              </div>
            </div>

            <div className="admin-table-toolbar">
              <div className="admin-search">
                <Search size={18} />
                <input
                  type="search"
                  placeholder="Search by name, email or department..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <span className="admin-results-count">
                {filteredApplications.length} applications
              </span>
            </div>

            <div className="admin-application-list">
              {filteredApplications.length === 0 ? (
                <div className="admin-empty-state">
                  <Users size={30} />
                  <h3>No applications found</h3>
                  <p>Try changing your search or selecting another category.</p>
                </div>
              ) : (
                filteredApplications.map((application) => (
                  <article
                    className="admin-application-card"
                    key={application.id}
                  >
                    <div className="admin-application-avatar">
                      {application.name.charAt(0)}
                    </div>

                    <div className="admin-application-info">
                      <h3>{application.name}</h3>

                      <div className="admin-application-meta">
                        <span>
                          <Mail size={14} />
                          {application.email}
                        </span>
                        <span>
                          <GraduationCap size={14} />
                          {application.department}
                        </span>
                        <span>
                          <CalendarDays size={14} />
                          {application.submittedAt}
                        </span>
                      </div>
                    </div>

                    <div className="admin-application-actions">
                      <StatusBadge status={application.status} />

                      <button
                        className="admin-view-button"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </section>

        {selectedApplication && (
          <div
            className="admin-modal-backdrop"
            onClick={() => setSelectedApplication(null)}
          >
            <section
              className="admin-detail-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="admin-detail-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="admin-modal-header">
                <div>
                  <span className="admin-eyebrow">APPLICATION DETAILS</span>
                  <h2 id="admin-detail-title">Teacher Application</h2>
                </div>

                <button
                  onClick={() => setSelectedApplication(null)}
                  aria-label="Close details"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="admin-detail-profile">
                <div className="admin-detail-avatar">
                  {selectedApplication.name.charAt(0)}
                </div>
                <div>
                  <h3>{selectedApplication.name}</h3>
                  <p>{selectedApplication.email}</p>
                  <StatusBadge status={selectedApplication.status} />
                </div>
              </div>

              <div className="admin-detail-fields">
                <div>
                  <span>Department</span>
                  <strong>{selectedApplication.department}</strong>
                </div>
                <div>
                  <span>Application date</span>
                  <strong>{selectedApplication.submittedAt}</strong>
                </div>
                <div>
                  <span>Application status</span>
                  <strong>{selectedApplication.status}</strong>
                </div>
              </div>

              {selectedApplication.status === "pending" && (
                <div className="admin-modal-actions">
                  <button
                    className="admin-reject-button"
                    onClick={() => handleAction("reject")}
                  >
                    <XCircle size={17} />
                    Reject
                  </button>

                  <button
                    className="admin-approve-button"
                    onClick={() => handleAction("approve")}
                  >
                    <CheckCircle size={17} />
                    Approve
                  </button>
                </div>
              )}

              <p className="admin-modal-footnote">
                Approval and rejection will become functional after backend
                integration.
              </p>
              {confirmationAction && (
                <div className="admin-confirm-backdrop">
                  <div
                    className="admin-confirm-dialog"
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="admin-confirm-title"
                  >
                    <div className="admin-confirm-icon">
                      {confirmationAction === "approve" ? (
                        <CheckCircle size={25} />
                      ) : (
                        <XCircle size={25} />
                      )}
                    </div>

                    <h3 id="admin-confirm-title">
                      {confirmationAction === "approve"
                        ? "Approve application?"
                        : "Reject application?"}
                    </h3>

                    <p>
                      Are you sure you want to{" "}
                      {confirmationAction === "approve" ? "approve" : "reject"}{" "}
                      {selectedApplication.name}'s teacher application?
                    </p>

                    {confirmationAction === "approve" && (
                      <p className="admin-confirm-note">
                        The teacher will be able to log in using their
                        registered email and password after approval.
                      </p>
                    )}

                    <div className="admin-confirm-actions">
                      <button
                        className="admin-confirm-cancel"
                        onClick={() => setConfirmationAction(null)}
                      >
                        Cancel
                      </button>

                      <button
                        className={
                          confirmationAction === "approve"
                            ? "admin-confirm-approve"
                            : "admin-confirm-reject"
                        }
                        onClick={confirmAction}
                      >
                        Confirm{" "}
                        {confirmationAction === "approve"
                          ? "Approval"
                          : "Rejection"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  description,
  accent = "default",
}) {
  return (
    <article className={`admin-stat-card ${accent}`}>
      <div className="admin-stat-top">
        <span>{label}</span>
        <div className="admin-stat-icon">
          <Icon size={19} />
        </div>
      </div>

      <strong className="admin-stat-value">{value}</strong>
      <span className="admin-stat-description">{description}</span>
    </article>
  );
}

function StatusBadge({ status }) {
  const labels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  };

  return (
    <span className={`admin-status-badge ${status}`}>
      {labels[status] || status}
    </span>
  );
}
