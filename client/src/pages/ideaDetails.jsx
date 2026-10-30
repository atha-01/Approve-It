
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

export default function IdeaDetails() {
  const { id } = useParams();

  // Temporary sample data. We will replace this with backend data later.
  const idea = {
    title: "Smart Campus Navigation System",
    category: "Web Development",
    status: "Pending",
    description:
      "A web-based platform that helps students, staff, and visitors navigate the college campus easily.",
    problemStatement:
      "New students and visitors often struggle to find classrooms, laboratories, offices, and other facilities across the campus.",
    proposedSolution:
      "Develop an interactive campus map with searchable locations, directions, and important campus information.",
    submittedBy: "Student name",
    assignedTeacher: "Not assigned yet",
    submittedOn: "Not available",
    feedback: "No teacher feedback has been provided yet.",
  };

  const statusIcon =
    idea.status === "Approved"
      ? CheckCircle2
      : idea.status === "Rejected"
        ? FileText
        : Clock3;

  const StatusIcon = statusIcon;

  return (
    <>
      <Navbar />

      <main className="idea-details page-container">
        <Link to="/dashboard" className="database-back-link">
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <section className="idea-details-heading">
          <p className="section-kicker">PROJECT INFORMATION</p>
          <div className="idea-details-title-row">
            <div>
              <h1>{idea.title}</h1>
              <p>{idea.category}</p>
            </div>

            <span className={`idea-status idea-status-${idea.status.toLowerCase()}`}>
              <StatusIcon size={16} />
              {idea.status}
            </span>
          </div>
        </section>

        <div className="idea-details-layout">
          <div className="idea-details-main">
            <section className="idea-details-card">
              <h2>Project overview</h2>
              <p>{idea.description}</p>
            </section>

            <section className="idea-details-card">
              <h2>Problem statement</h2>
              <p>{idea.problemStatement}</p>
            </section>

            <section className="idea-details-card">
              <h2>Proposed solution</h2>
              <p>{idea.proposedSolution}</p>
            </section>

            <section className="idea-details-card">
              <div className="idea-feedback-heading">
                <MessageSquare size={19} />
                <h2>Teacher feedback</h2>
              </div>
              <p>{idea.feedback}</p>
            </section>
          </div>

          <aside className="idea-details-sidebar">
            <section className="idea-details-card">
              <h2>Submission information</h2>

              <div className="idea-info-item">
                <UserRound size={18} />
                <div>
                  <span>Submitted by</span>
                  <strong>{idea.submittedBy}</strong>
                </div>
              </div>

              <div className="idea-info-item">
                <GraduationCap size={19} />
                <div>
                  <span>Assigned teacher</span>
                  <strong>{idea.assignedTeacher}</strong>
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

            <section className="idea-details-card idea-document-card">
              <FileText size={23} />
              <h2>Project document</h2>
              <p>
                An approved project PDF will be available here when it is
                uploaded.
              </p>
              <button type="button" disabled>
                <Download size={16} />
                PDF not available
              </button>
            </section>
          </aside>
        </div>
      </main>
    </>
  );
}
