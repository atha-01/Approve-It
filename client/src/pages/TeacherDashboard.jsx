
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

export default function TeacherDashboard() {
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

        <section
          className="dashboard-stats"
          aria-label="Review statistics"
        >
          <article className="dashboard-stat">
            <ClipboardList size={21} />
            <h2>—</h2>
            <p>Received ideas</p>
          </article>

          <article className="dashboard-stat">
            <Clock3 size={21} />
            <h2>—</h2>
            <p>Pending review</p>
          </article>

          <article className="dashboard-stat">
            <CheckCircle2 size={21} />
            <h2>—</h2>
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

          <div className="dashboard-empty-state">
            <Inbox size={36} strokeWidth={1.5} />
            <h3>No submissions to review</h3>
            <p>
              Student project submissions assigned to you will
              appear here.
            </p>
          </div>
        </section>

        <Link
          to="/database"
          className="dashboard-database-link"
        >
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
