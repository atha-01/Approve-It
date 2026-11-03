
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  FileSearch,
  ArrowRight,
  Inbox,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import { getIdeasForReview } from "../services/IdeaService";

export default function TeacherDashboard() {
  const { token } = useAuth();

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchIdeas() {
      try {
        setLoading(true);
        setError("");

        const result = await getIdeasForReview(token);

        if (active) {
          setIdeas(result);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load submissions.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (token) {
      fetchIdeas();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      setError("Please log in again to view submissions.");
    }

    return () => {
      active = false;
    };
  }, [token]);

  const pendingCount = ideas.filter(
    (idea) => idea.status === "pending" ||
              idea.status === "under_review"
  ).length;

  const reviewedCount = ideas.filter(
    (idea) => idea.status === "approved" ||
              idea.status === "rejected"
  ).length;

  function formatDate(date) {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <>
      <Navbar />

      <main className="teacher-dashboard page-container">
        <section className="dashboard-heading">
          <p className="section-kicker">TEACHER WORKSPACE</p>
          <h1>Review Dashboard</h1>
          <p>
            Manage student project submissions and track their approval status.
          </p>
        </section>

        <section className="dashboard-stats" aria-label="Review statistics">
          <article className="dashboard-stat">
            <ClipboardList size={21} />
            <h2>{ideas.length}</h2>
            <p>Received ideas</p>
          </article>

          <article className="dashboard-stat">
            <Clock3 size={21} />
            <h2>{pendingCount}</h2>
            <p>Pending review</p>
          </article>

          <article className="dashboard-stat">
            <CheckCircle2 size={21} />
            <h2>{reviewedCount}</h2>
            <p>Reviewed ideas</p>
          </article>
        </section>

        <section className="teacher-submissions">
          <div className="dashboard-section-heading">
            <div>
              <h2>Student submissions</h2>
              <p>
                Review submitted ideas and make approval decisions.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="dashboard-empty-state">
              <p>Loading student submissions...</p>
            </div>
          ) : error ? (
            <div className="dashboard-empty-state">
              <p role="alert">{error}</p>
            </div>
          ) : ideas.length === 0 ? (
            <div className="dashboard-empty-state">
              <Inbox size={36} strokeWidth={1.5} />
              <h3>No submissions yet</h3>
              <p>
                Student project submissions will appear here once uploaded.
              </p>
            </div>
          ) : (
            <div className="teacher-submission-list">
              {ideas.map((idea) => (
                <article className="teacher-submission-card" key={idea.id}>
                  <div>
                    <span className="review-category">
                      {idea.category}
                    </span>

                    <h3>{idea.title}</h3>

                    <p>
                      Student: {idea.submittedBy?.name || "Unknown"}
                    </p>

                    <p>
                      Submitted: {formatDate(idea.createdAt)}
                    </p>
                  </div>

                  <div>
                    <span className={`idea-status idea-status-${idea.status}`}>
                      {idea.status.replace("_", " ")}
                    </span>

                    <Link to={`/teacher/review/${idea.id}`}>
                      Review idea <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <Link to="/database" className="dashboard-database-link">
          <span className="dashboard-database-icon">
            <FileSearch size={20} />
          </span>

          <span>
            <strong>Explore the idea database</strong>
            <small>
              Browse previously submitted college projects.
            </small>
          </span>

          <ArrowRight size={19} />
        </Link>
      </main>
    </>
  );
}
