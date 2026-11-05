
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import academicPattern from "../assets/academic-pattern.svg";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Database,
  FileSearch,
  Search,
  ShieldCheck,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  function submitIdeaSearch(event) {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    navigate(`/database?q=${encodeURIComponent(query)}`);
  }

  const dashboardPath =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "teacher"
      ? "/teacher/dashboard"
      : "/dashboard";

  const dashboardTitle =
    user?.role === "admin"
      ? "Open admin dashboard"
      : user?.role === "teacher"
      ? "Open teacher dashboard"
      : "Open student dashboard";

  const dashboardDescription =
    user?.role === "admin"
      ? "Manage teacher registration applications and oversee the platform."
      : user?.role === "teacher"
      ? "Review student project submissions and manage the idea approval process."
      : "Track your submitted ideas, check their review status, and follow the approval process.";

  return (
    <>
      <Navbar />

      <main>
        <section
          className="hero-section"
          style={{ "--academic-pattern": `url(${academicPattern})` }}
        >
          <div className="page-container hero-content">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              A smarter way to start your project
            </div>

            <h1>
              Your next great idea
              <br />
              <span>starts with a search.</span>
            </h1>

            <p className="hero-description">
              Explore previously submitted college projects, discover ideas,
              and check what's already been done before you write your synopsis.
            </p>

            <form
              className="idea-search"
              onSubmit={submitIdeaSearch}
              role="search"
            >
              <Search
                className="search-icon"
                size={22}
                aria-hidden="true"
              />

              <label className="visually-hidden" htmlFor="idea-search-input">
                Describe your project idea
              </label>

              <input
                id="idea-search-input"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Describe your project idea..."
                autoComplete="off"
                maxLength={200}
              />

              <button type="submit" disabled={!searchQuery.trim()}>
                Search ideas
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </form>

            <p className="search-hint">
              <ShieldCheck size={15} aria-hidden="true" />
              Start with your college's existing idea database.
            </p>

            <div className="hero-actions">
              <Link to="/database" className="button button-primary">
                <Database size={18} aria-hidden="true" />
                Check College Database
                <ArrowRight size={17} aria-hidden="true" />
              </Link>

              <Link to="/repositories" className="button button-secondary">
                <Code2 size={22} aria-hidden="true" />
                Check Other Sources
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div className="hero-note">
              <span className="hero-note-icon">
                <CheckCircle2 size={17} aria-hidden="true" />
              </span>
              <span>
                Check existing ideas first. Build on what you learn.
              </span>
            </div>
          </div>
        </section>

        <section className="discovery-section">
          <div className="page-container">
            <div className="section-heading">
              <div>
                <p className="section-kicker">YOUR PROJECT JOURNEY</p>
                <h2>From first thought to approved idea.</h2>
              </div>

              <p className="section-description">
                Explore existing college projects, discover useful resources,
                and navigate the idea approval process.
              </p>
            </div>

            <div className="discovery-grid">
              <article className="discovery-card">
                <div className="discovery-icon discovery-icon-blue">
                  <FileSearch size={22} aria-hidden="true" />
                </div>

                <h3>Explore approved ideas</h3>

                <p>
                  Browse approved project titles, descriptions, and synopsis
                  PDFs from the college database.
                </p>

                <Link
                  to={isAuthenticated ? "/database" : "/login"}
                  className="card-link"
                >
                  {isAuthenticated
                    ? "Open idea database"
                    : "Log in to explore ideas"}
                  <ArrowRight size={16} />
                </Link>
              </article>

              <article className="discovery-card">
                <div className="discovery-icon discovery-icon-purple">
                  <BookOpen size={22} aria-hidden="true" />
                </div>

                <h3>
                  {isAuthenticated
                    ? user?.role === "teacher"
                      ? "Review student ideas"
                      : user?.role === "admin"
                      ? "Manage the platform"
                      : "Track your project journey"
                    : "Understand the review process"}
                </h3>

                <p>
                  {isAuthenticated
                    ? dashboardDescription
                    : "Submit your project idea, follow its progress, and understand how teachers review and approve submissions."}
                </p>

                <Link
                  to={isAuthenticated ? dashboardPath : "/login"}
                  className="card-link"
                >
                  {isAuthenticated
                    ? dashboardTitle
                    : "Log in to continue"}
                  <ArrowRight size={16} />
                </Link>
              </article>

              <article className="discovery-card">
                <div className="discovery-icon discovery-icon-green">
                  <Code2 size={22} aria-hidden="true" />
                </div>

                <h3>Explore external resources</h3>

                <p>
                  Discover code repositories, research papers, related ideas,
                  articles, and technical resources from multiple sources.
                </p>

                <Link to="/repositories" className="card-link">
                  Open Research Explorer
                  <ArrowRight size={16} />
                </Link>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-container footer-content">
          <Link to="/" className="footer-brand">
            ApproveIT
          </Link>
          <p>Discover thoughtfully. Build something meaningful.</p>
          <span>ApproveIT 2026 All Rights Reserved.</span>
        </div>
      </footer>
    </>
  );
}
