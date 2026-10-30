
import { useState } from "react";
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

export default function TeacherReview() {
  const { id } = useParams();

  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("Pending");
  const [message, setMessage] = useState("");

  // Temporary sample data. Backend integration will come later.
  const idea = {
    title: "Smart Campus Navigation System",
    category: "Web Development",
    description:
      "A web-based platform that helps students, staff, and visitors navigate the college campus easily.",
    problemStatement:
      "New students and visitors often struggle to find classrooms, laboratories, offices, and other facilities across the campus.",
    proposedSolution:
      "Develop an interactive campus map with searchable locations, directions, and important campus information.",
    studentName: "Student name",
    studentEmail: "student@example.com",
    submittedOn: "Not available",
  };

  function handleReview(decision) {
    if (decision === "Rejected" && !feedback.trim()) {
      setMessage("Please provide feedback before rejecting this idea.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to ${decision.toLowerCase()} this idea?`
    );

    if (!confirmed) return;

    setStatus(decision);
    setMessage(`Idea ${decision.toLowerCase()} successfully in this demonstration.`);
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

        <div className="teacher-review-layout">
          <div className="teacher-review-main">
            <section className="teacher-review-card">
              <div className="teacher-review-title">
                <div>
                  <span className="review-category">{idea.category}</span>
                  <h2>{idea.title}</h2>
                </div>

                <span className={`idea-status idea-status-${status.toLowerCase()}`}>
                  {status === "Approved" ? (
                    <CheckCircle2 size={16} />
                  ) : status === "Rejected" ? (
                    <XCircle size={16} />
                  ) : (
                    <Clock3 size={16} />
                  )}
                  {status}
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
                disabled={status !== "Pending"}
              />

              {message && (
                <p className="review-message" role="status">
                  {message}
                </p>
              )}

              {status === "Pending" ? (
                <div className="teacher-review-actions">
                  <button
                    type="button"
                    className="review-reject-button"
                    onClick={() => handleReview("Rejected")}
                  >
                    <XCircle size={17} />
                    Reject idea
                  </button>

                  <button
                    type="button"
                    className="review-approve-button"
                    onClick={() => handleReview("Approved")}
                  >
                    <CheckCircle2 size={17} />
                    Approve idea
                  </button>
                </div>
              ) : (
                <p className="review-completed-message">
                  This idea has been {status.toLowerCase()} in this demonstration.
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
                  <strong>{idea.studentName}</strong>
                </div>
              </div>

              <div className="idea-info-item">
                <GraduationCap size={19} />
                <div>
                  <span>Email address</span>
                  <strong>{idea.studentEmail}</strong>
                </div>
              </div>

              <div className="idea-info-item">
                <CalendarDays size={18} />
                <div>
                  <span>Submission date</span>
                  <strong>{idea.submittedOn}</strong>
                </div>
              </div>

              <div className="idea-info-item">
                <FileText size={18} />
                <div>
                  <span>Idea reference</span>
                  <strong>{id}</strong>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </>
  );
}
