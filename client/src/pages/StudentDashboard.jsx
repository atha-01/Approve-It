
import { Link } from "react-router-dom";
import { ClipboardList, Search } from "lucide-react";
import Navbar from "../components/layout/Navbar";

export default function StudentDashboard() {
  return (
    <>
      <Navbar />

      <main className="placeholder-page">
        <section className="placeholder-content page-container">
          <div className="placeholder-icon">
            <ClipboardList size={27} aria-hidden="true" />
          </div>

          <p className="section-kicker">STUDENT WORKSPACE</p>
          <h1>Your project dashboard</h1>
          <p>
            Track your submitted ideas and check their review status here.
          </p>

          <div className="hero-actions">
            <Link to="/database" className="button button-primary">
              <Search size={17} />
              Explore ideas
            </Link>

            <Link to="/" className="button button-secondary">
              Back to homepage
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
