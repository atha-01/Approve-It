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

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  function submitIdeaSearch(event) {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    // The database page will consume this query once its search UI is implemented.
    navigate(`/database?q=${encodeURIComponent(query)}`);
  }

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
                Check Idea Database
                <ArrowRight size={17} aria-hidden="true" />
              </Link>

              <Link to="/repositories" className="button button-secondary">

                <Code2 size={22} aria-hidden="true" />
                Search Repositories
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
                One place to explore previous work and navigate the approval
                process.
              </p>
            </div>

            <div className="discovery-grid">
              <article className="discovery-card">
                <div className="discovery-icon discovery-icon-blue">
                  <FileSearch size={22} aria-hidden="true" />
                </div>
                <h3>Explore existing ideas</h3>
                <p>
                  Browse project titles, descriptions, and their review
                  status in the college database.
                </p>
                <Link to="/database" className="card-link">
                  Open idea database <ArrowRight size={16} />
                </Link>
              </article>

              <article className="discovery-card">
                <div className="discovery-icon discovery-icon-purple">
                  <BookOpen size={22} aria-hidden="true" />
                </div>
                <h3>Understand the review process</h3>
                <p>
                  Follow your idea through teacher review and approval using
                  the platform's available workflow.
                </p>
                <Link to="/login" className="card-link">
                  Log in to continue <ArrowRight size={16} />
                </Link>
              </article>

              <article className="discovery-card">
                <div className="discovery-icon discovery-icon-green">
                        
                  <Code2 size={22} aria-hidden="true" />
                </div>
                <h3>Explore repositories</h3>
                <p>
                  GitHub repository discovery is planned, but the external
                  search integration is not connected yet.
                </p>
                <Link to="/repositories" className="card-link">
                  View feature status <ArrowRight size={16} />
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
          <span>College Idea Checker</span>
        </div>
      </footer>
    </>
  );
}