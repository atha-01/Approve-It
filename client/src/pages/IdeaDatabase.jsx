
import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Database,
  ArrowLeft,
  FileSearch,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";

export default function IdeaDatabase() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [status, setStatus] = useState("all");

  function handleSearch(event) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }

    if (status !== "all") {
      params.set("status", status);
    }

    setSearchParams(params);
  }

  return (
    <>
      <Navbar />

      <main className="idea-database page-container">
        <Link to="/" className="database-back-link">
          <ArrowLeft size={16} />
          Back to homepage
        </Link>

        <section className="database-heading">
          <p className="section-kicker">EXPLORE PROJECTS</p>
          <h1>Idea Database</h1>
          <p>
            Discover previously submitted college projects.
            Search before you start building something new.
          </p>
        </section>

        <section className="database-search-section">
          <form className="database-search" onSubmit={handleSearch}>
            <Search size={21} aria-hidden="true" />

            <label className="visually-hidden" htmlFor="database-search-input">
              Search project ideas
            </label>

            <input
              id="database-search-input"
              type="search"
              placeholder="Search by project title, topic, or keyword..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />

            <button type="submit">
              Search
            </button>
          </form>

          <div className="database-filters">
            <span>
              <SlidersHorizontal size={16} />
              Filter by status
            </span>

            <select
              aria-label="Filter ideas by status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="all">All ideas</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>

            <button
              type="button"
              className="database-apply-filter"
              onClick={handleSearch}
            >
              Apply filters
            </button>
          </div>
        </section>

        <section className="database-results">
          <div className="database-results-heading">
            <div>
              <h2>Project ideas</h2>
              <p>Explore ideas submitted to your college.</p>
            </div>
          </div>

          <div className="database-empty-state">
            <div className="database-empty-icon">
              <FileSearch size={30} />
            </div>

            <h3>Idea database is ready to explore</h3>

            <p>
              Project records will appear here once the database
              is connected to the backend.
            </p>

            <span className="database-coming-soon">
              <Database size={14} />
              Database integration pending
            </span>
          </div>
        </section>
      </main>
    </>
  );
}
