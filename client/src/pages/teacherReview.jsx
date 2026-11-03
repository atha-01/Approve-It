
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  CalendarDays,
  GraduationCap,
  CheckCircle2,
  XCircle,
  MessageSquare,
  FileText,
  Clock3,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  getIdeaById,
  updateIdeaReview,
} from "../services/IdeaService";

export default function TeacherReview() {
  const { id } = useParams();
  const { token } = useAuth();

  const [idea, setIdea] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchIdea() {
      try {
        setLoading(true);
        setError("");

        const result = await getIdeaById(id, token);

        if (active) {
          setIdea(result);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load idea details.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (id && token) {
      fetchIdea();
    }

    return () => {
      active = false;
    };
  }, [id, token]);

  const statusLabels = {
    pending: "Pending",
    under_review: "Under review",
    approved: "Approved",
    rejected: "Rejected",
  };

  const currentStatus = idea?.status || "pending";
  const canReview =
    currentStatus === "pending" || currentStatus === "under_review";

  async function handleReview(decision) {
    const confirmed = window.confirm(
      `Are you sure you want to ${decision} this idea?`
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const updatedIdea = await updateIdeaReview(id, decision, token);

      setIdea((previousIdea) => ({
        ...previousIdea,
        status: updatedIdea.status,
        reviewedById: updatedIdea.reviewedById,
        reviewedAt: updatedIdea.reviewedAt,
      }));

      setMessage(
        `Idea ${statusLabels[updatedIdea.status]?.toLowerCase() || "updated"} successfully.`
      );
    } catch (err) {
      setError(err.message || "Unable to update idea status.");
    } finally {
      setSaving(false);
    }
  }

  function formatDate(date) {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <>
      <Navbar />

      <main className="teacher-review page-container">
        <Link to="/teacher/dashboard" className="database-back-link">
          <ArrowLeft size={17} />
          Back to teacher dashboard
        </Link>

        <section className="teacher-review-heading">
          <p className="section-kicker">TEACHER WORKSPACE</p>
          <h1>Review project idea</h1>
          <p>Examine the student's proposal and provide your decision.</p>
        </section>

        {loading ? (
          <section className="teacher-review-card">
            <p>Loading idea details...</p>
          </section>
        ) : error && !idea ? (
          <section className="teacher-review-card">
            <p className="review-message">{error}</p>
          </section>
        ) : idea ? (
          <div className="teacher-review-layout">
            <div className="teacher-review-main">
              <section className="teacher-review-card">
                <div className="teacher-review-title">
                  <div>
                    <span className="review-category">
                      {idea.category}
                    </span>
                    <h2>{idea.title}</h2>
                  </div>

                  <span
                    className={`idea-status idea-status-${currentStatus}`}
                  >
                    {currentStatus === "approved" ? (
                      <CheckCircle2 size={16} />
                    ) : currentStatus === "rejected" ? (
                      <XCircle size={16} />
                    ) : (
                      <Clock3 size={16} />
                    )}
                    {statusLabels[currentStatus] || currentStatus}
                  </span>
                </div>
              </section>

              <section className="teacher-review-card">
                <h2>Project overview</h2>
                <p>{idea.description}</p>
              </section>

              <section className="teacher-review-card">
                <h2>Problem statement</h2>
                <p>{idea.problemStatement}</p>
              </section>

              <section className="teacher-review-card">
                <h2>Proposed solution</h2>
                <p>{idea.proposedSolution}</p>
              </section>

              <section className="teacher-review-card">
                <div className="teacher-feedback-heading">
                  <MessageSquare size={19} />
                  <h2>Teacher feedback</h2>
                </div>

                <p className="review-helper-text">
                  Share suggestions, corrections, or reasons for your decision.
                </p>

                <textarea
                  value={feedback}
                  onChange={(event) => {
                    setFeedback(event.target.value);
                    setMessage("");
                  }}
                  placeholder="Write your feedback for the student..."
                  rows={5}
                  disabled={!canReview || saving}
                />

                {message && (
                  <p className="review-message" role="status">
                    {message}
                  </p>
                )}

                {error && (
                  <p className="review-message" role="alert">
                    {error}
                  </p>
                )}

                {canReview ? (
                  <div className="teacher-review-actions">
                    <button
                      type="button"
                      className="review-reject-button"
                      onClick={() => handleReview("rejected")}
                      disabled={saving}
                    >
                      <XCircle size={17} />
                      {saving ? "Saving..." : "Reject idea"}
                    </button>

                    <button
                      type="button"
                      className="review-approve-button"
                      onClick={() => handleReview("approved")}
                      disabled={saving}
                    >
                      <CheckCircle2 size={17} />
                      {saving ? "Saving..." : "Approve idea"}
                    </button>
                  </div>
                ) : (
                  <p className="review-completed-message">
                    This idea has been {statusLabels[currentStatus]?.toLowerCase()}.
                  </p>
                )}
              </section>
            </div>

            <aside className="teacher-review-sidebar">
              <section className="teacher-review-card">
                <h2>Student information</h2>

                <div className="idea-info-item">
                  <UserRound size={18} />
                  <div>
                    <span>Student name</span>
                    <strong>{idea.submittedBy?.name || "Not available"}</strong>
                  </div>
                </div>

                <div className="idea-info-item">
                  <GraduationCap size={19} />
                  <div>
                    <span>Email address</span>
                    <strong>{idea.submittedBy?.email || "Not available"}</strong>
                  </div>
                </div>

                <div className="idea-info-item">
                  <CalendarDays size={18} />
                  <div>
                    <span>Submission date</span>
                    <strong>{formatDate(idea.createdAt)}</strong>
                  </div>
                </div>

                <div className="idea-info-item">
                  <GraduationCap size={19} />
                  <div>
                    <span>Academic year</span>
                    <strong>{idea.academicYear || "Not available"}</strong>
                  </div>
                </div>

                <div className="idea-info-item">
                  <FileText size={18} />
                  <div>
                    <span>Idea reference</span>
                    <strong>{idea.id}</strong>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        ) : null}
      </main>
    </>
  );
}
