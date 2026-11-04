
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  UserRound,
  GraduationCap,
  FileText,
  Clock3,
  CheckCircle2,
  MessageSquare,
  Download,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  getIdeaById,
  getIdeaPdf,
} from "../services/IdeaService";

export default function IdeaDetails() {
  const { id } = useParams();
  const { token, isCheckingSession } = useAuth();

  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");

  // Fetch the actual idea using its ID
  useEffect(() => {
    if (isCheckingSession) return;

    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      setError("Please log in to view this project.");
      return;
    }

    async function fetchIdea() {
      try {
        setLoading(true);
        setError("");

        const result = await getIdeaById(id, token);
        setIdea(result);
      } catch (error) {
        setError(error.message || "Unable to load project details.");
        setIdea(null);
      } finally {
        setLoading(false);
      }
    }

    fetchIdea();
  }, [id, token, isCheckingSession]);

  // Download the actual project PDF
  async function handlePdfDownload() {
    try {
      setPdfLoading(true);
      setPdfError("");

      const pdfBlob = await getIdeaPdf(id, token);

      const pdfUrl = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = idea.pdfFileName || `${idea.title}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the temporary URL after the browser has started downloading
      window.setTimeout(() => {
        window.URL.revokeObjectURL(pdfUrl);
      }, 1000);

    } catch (error) {
      setPdfError(
        error.message || "Unable to download the PDF."
      );
    } finally {
      setPdfLoading(false);
    }
  }

  // Loading state
  if (isCheckingSession || loading) {
    return (
      <>
        <Navbar />
        <main className="idea-details page-container">
          <p>Loading project details...</p>
        </main>
      </>
    );
  }

  // Error state
  if (error || !idea) {
    return (
      <>
        <Navbar />
        <main className="idea-details page-container">
          <Link to="/idea-database" className="database-back-link">
            <ArrowLeft size={17} />
            Back to Idea Database
          </Link>

          <section className="idea-details-card">
            <h2>Unable to load project</h2>
            <p>{error || "The requested project could not be found."}</p>
          </section>
        </main>
      </>
    );
  }

  const status = idea.status || "pending";

  const statusIcon =
    status === "approved"
      ? CheckCircle2
      : status === "rejected"
        ? FileText
        : Clock3;

  const StatusIcon = statusIcon;

  const submittedOn = idea.createdAt
    ? new Date(idea.createdAt).toLocaleDateString("en-IN")
    : "Not available";

  const submittedBy = idea.submittedBy?.name || "Unknown";
  const assignedTeacher = idea.reviewedBy?.name || "Not assigned yet";

  const feedback =
    idea.feedback || "No teacher feedback has been provided yet.";

  return (
    <>
      <Navbar />

      <main className="idea-details page-container">
        <Link to="/idea-database" className="database-back-link">
          <ArrowLeft size={17} />
          Back to Idea Database
        </Link>

        <section className="idea-details-heading">
          <p className="section-kicker">PROJECT INFORMATION</p>

          <div className="idea-details-title-row">
            <div>
              <h1>{idea.title}</h1>
              <p>{idea.category}</p>
            </div>

            <span className={`idea-status idea-status-${status}`}>
              <StatusIcon size={16} />
              {status.replace("_", " ")}
            </span>
          </div>
        </section>

        <div className="idea-details-layout">
          <div className="idea-details-main">
            <section className="idea-details-card">
              <h2>Project overview</h2>
              <p>{idea.description || "No description provided."}</p>
            </section>

            <section className="idea-details-card">
              <h2>Problem statement</h2>
              <p>{idea.problemStatement || "Not provided."}</p>
            </section>

            <section className="idea-details-card">
              <h2>Proposed solution</h2>
              <p>{idea.proposedSolution || "Not provided."}</p>
            </section>

            <section className="idea-details-card">
              <div className="idea-feedback-heading">
                <MessageSquare size={19} />
                <h2>Teacher feedback</h2>
              </div>

              <p>{feedback}</p>
            </section>
          </div>

          <aside className="idea-details-sidebar">
            <section className="idea-details-card">
              <h2>Submission information</h2>

              <div className="idea-info-item">
                <UserRound size={18} />
                <div>
                  <span>Submitted by</span>
                  <strong>{submittedBy}</strong>
                </div>
              </div>

              <div className="idea-info-item">
                <GraduationCap size={19} />
                <div>
                  <span>Reviewed by</span>
                  <strong>{assignedTeacher}</strong>
                </div>
              </div>

              <div className="idea-info-item">
                <CalendarDays size={18} />
                <div>
                  <span>Submission date</span>
                  <strong>{submittedOn}</strong>
                </div>
              </div>

              <div className="idea-info-item">
                <FileText size={18} />
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

            <section className="idea-details-card idea-document-card">
              <FileText size={23} />
              <h2>Project document</h2>

              <p>
                {idea.pdfFileName || "Project synopsis PDF"}
              </p>

              <button
                type="button"
                onClick={handlePdfDownload}
                disabled={pdfLoading}
                className="download-pdf-button"
              >
                <Download size={16} />
                {pdfLoading ? "Downloading..." : "Download PDF"}
              </button>

              {pdfError && (
                <p>{pdfError}</p>
              )}
            </section>
          </aside>
        </div>
      </main>
    </>
  );
}
