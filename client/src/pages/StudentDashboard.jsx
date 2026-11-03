
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock3,
  CheckCircle2,
  FolderOpen,
  Search,
  ArrowRight,
  Plus,
  CalendarDays,
  Lightbulb,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import { getMyIdeas } from "../services/IdeaService";

export default function StudentDashboard() {
  const { token } = useAuth();

  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchIdeas() {
      if (!token) {
        setError("Please log in to view your submissions.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const result = await getMyIdeas(token);
        setIdeas(Array.isArray(result) ? result : []);
      } catch (error) {
        setError(error.message || "Unable to load your ideas.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchIdeas();
  }, [token]);

  const pendingCount = ideas.filter(
    (idea) => idea.status === "pending"
  ).length;

  const approvedCount = ideas.filter(
    (idea) => idea.status === "approved"
  ).length;

  function formatDate(date) {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatCategory(category) {
    if (!category) return "Uncategorized";

    return category
      .replaceAll("-", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function formatStatus(status) {
    const labels = {
      pending: "Pending",
      under_review: "Under Review",
      approved: "Approved",
      rejected: "Rejected",
    };

    return labels[status] || status;
  }

  return (
    <>
      <Navbar />

      <main className="student-dashboard page-container">
        <section className="dashboard-heading">
          <p className="section-kicker">STUDENT WORKSPACE</p>
          <h1>My Dashboard</h1>
          <p>
            Welcome back! Here's an overview of your project submissions.
          </p>

          <Link to="/submit-idea" className="dashboard-submit-link">
            <Plus size={18} />
            Submit a New Idea
          </Link>
        </section>

        {/* Statistics */}
        <section
          className="dashboard-stats"
          aria-label="Project statistics"
        >
          <article className="dashboard-stat">
            <div className="dashboard-stat-icon">
              <FileText size={21} />
            </div>
            <h2>{isLoading ? "—" : ideas.length}</h2>
            <p>Submitted ideas</p>
          </article>

          <article className="dashboard-stat">
            <div className="dashboard-stat-icon pending-icon">
              <Clock3 size={21} />
            </div>
            <h2>{isLoading ? "—" : pendingCount}</h2>
            <p>Pending review</p>
          </article>

          <article className="dashboard-stat">
            <div className="dashboard-stat-icon approved-icon">
              <CheckCircle2 size={21} />
            </div>
            <h2>{isLoading ? "—" : approvedCount}</h2>
            <p>Approved ideas</p>
          </article>
        </section>

        {/* Submitted ideas */}
        <section className="dashboard-ideas">
          <div className="dashboard-section-heading">
            <div>
              <p className="section-kicker">YOUR PROJECTS</p>
              <h2>My submitted ideas</h2>
              <p>
                Track your project submissions and their review status.
              </p>
            </div>

            {!isLoading && !error && ideas.length > 0 && (
              <span className="dashboard-total">
                {ideas.length} {ideas.length === 1 ? "project" : "projects"}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="dashboard-empty-state">
              <div className="dashboard-loading-spinner" />
              <h3>Loading your projects</h3>
              <p>Please wait while we fetch your submissions.</p>
            </div>
          ) : error ? (
            <div className="dashboard-empty-state" role="alert">
              <FolderOpen size={36} strokeWidth={1.5} />
              <h3>Couldn't load your projects</h3>
              <p>{error}</p>
            </div>
          ) : ideas.length === 0 ? (
            <div className="dashboard-empty-state">
              <FolderOpen size={36} strokeWidth={1.5} />
              <h3>No submissions yet</h3>
              <p>
                Your submitted project ideas will appear here along with
                their review status.
              </p>
              <Link
                to="/submit-idea"
                className="dashboard-empty-button"
              >
                <Plus size={17} />
                Submit your first idea
              </Link>
            </div>
          ) : (
            <div className="dashboard-idea-grid">
              {ideas.map((idea) => (
                <article className="dashboard-idea-card" key={idea.id}>
                  <div className="dashboard-idea-card-top">
                    <div className="dashboard-idea-icon">
                      <Lightbulb size={21} />
                    </div>

                    <span
                      className={`idea-status idea-status-${idea.status}`}
                    >
                      {formatStatus(idea.status)}
                    </span>
                  </div>

                  <div className="dashboard-idea-content">
                    <span className="dashboard-idea-category">
                      {formatCategory(idea.category)}
                    </span>

                    <h3>{idea.title}</h3>

                    <div className="dashboard-idea-date">
                      <CalendarDays size={15} />
                      <span>
                        Submitted {formatDate(idea.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="dashboard-idea-card-footer">
                    <span>Project submission</span>
                    <span className="dashboard-idea-status-text">
                      {formatStatus(idea.status)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Idea database link */}
        <Link to="/database" className="dashboard-database-link">
          <span className="dashboard-database-icon">
            <Search size={20} />
          </span>

          <span>
            <strong>Explore the idea database</strong>
            <small>
              Discover previously submitted college projects.
            </small>
          </span>

          <ArrowRight size={19} />
        </Link>
      </main>
    </>
  );
}
