
import { Link } from "react-router-dom";
import {
  FileText,
  Clock3,
  CheckCircle2,
  FolderOpen,
  Search,
  ArrowRight,
  Plus,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";

export default function StudentDashboard() {
  return (
    <>
      <Navbar />

      <main className="student-dashboard page-container">
        <section className="dashboard-heading">
          <p className="section-kicker">STUDENT WORKSPACE</p>
          <h1>My Dashboard</h1>
          <p>Welcome back! Here's your project overview.</p>

          <Link to="/submit-idea" className="dashboard-submit-link">
            <Plus size={18} />
            Submit a New Idea
          </Link>
        </section>

        <section className="dashboard-stats" aria-label="Project statistics">
          <article className="dashboard-stat">
            <FileText size={21} />
            <h2>—</h2>
            <p>Submitted ideas</p>
          </article>

          <article className="dashboard-stat">
            <Clock3 size={21} />
            <h2>—</h2>
            <p>Pending review</p>
          </article>

          <article className="dashboard-stat">
            <CheckCircle2 size={21} />
            <h2>—</h2>
            <p>Approved ideas</p>
          </article>
        </section>

        <section className="dashboard-ideas">
          <div className="dashboard-section-heading">
            <div>
              <h2>My submitted ideas</h2>
              <p>Track your project submissions and their review status.</p>
            </div>
          </div>

          <div className="dashboard-empty-state">
            <FolderOpen size={36} strokeWidth={1.5} />
            <h3>No submissions yet</h3>
            <p>
              Your submitted project ideas will appear here along with
              their assigned teacher and review status.
            </p>
          </div>
        </section>

        <Link to="/database" className="dashboard-database-link">
          <span className="dashboard-database-icon">
            <Search size={20} />
          </span>

          <span>
            <strong>Explore the idea database</strong>
            <small>Discover previously submitted college projects.</small>
          </span>

          <ArrowRight size={19} />
        </Link>
      </main>
    </>
  );
}
