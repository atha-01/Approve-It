import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ArrowLeft,
  FileSearch,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import { getIdeasForDatabase } from "../services/IdeaService";

export default function IdeaDatabase() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { token, isCheckingSession } = useAuth();

  const [query, setQuery] = useState(
    searchParams.get("query") || searchParams.get("q") || ""
  );

  const [academicYear, setAcademicYear] = useState(
    searchParams.get("academicYear") || ""
  );

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Apply search and academic year filter
  function handleSearch(event) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("query", query.trim());
    }

    if (academicYear.trim()) {
      params.set("academicYear", academicYear.trim());
    }

    setSearchParams(params);
  }

  // Fetch approved ideas whenever search filters change
  useEffect(() => {
    if (!token) {
      return;
    }

    async function fetchIdeas() {
      try {
        setLoading(true);
        setError("");

        const searchQuery =
          searchParams.get("query") || searchParams.get("q") || "";

        const searchYear =
          searchParams.get("academicYear") || "";

        setQuery(searchQuery);
        setAcademicYear(searchYear);

        const filters = {
          academicYear: searchYear,
          query: searchQuery,
        };

        const result = await getIdeasForDatabase(token, filters);

        setIdeas(result);
      } catch (error) {
        setError(error.message);
        setIdeas([]);
      } finally {
        setLoading(false);
      }
    }

    fetchIdeas();
  }, [token, searchParams]);

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

            <label
              className="visually-hidden"
              htmlFor="database-search-input"
            >
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
              Approved projects only
            </span>

            <input
              type="text"
              className="database-year-filter"
              placeholder="Academic year (e.g. 2026-27)"
              value={academicYear}
              onChange={(event) =>
                setAcademicYear(event.target.value)
              }
            />

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
              <h2>Approved project ideas</h2>
              <p>
                Explore projects approved by your college.
              </p>
            </div>
          </div>

          {isCheckingSession ? (
            <p>Checking your login...</p>
          ) : !token ? (
            <div className="database-empty-state">
              <div className="database-empty-icon">
                <FileSearch size={30} />
              </div>

              <h3>Login required</h3>

              <p>
                Please log in to access your college idea database.
              </p>

              <Link to="/login">Login</Link>
            </div>
          ) : loading ? (
            <div className="database-empty-state">
              <p>Loading approved project ideas...</p>
            </div>
          ) : error ? (
            <div className="database-empty-state">
              <h3>Unable to load ideas</h3>
              <p>{error}</p>
            </div>
          ) : ideas.length === 0 ? (
            <div className="database-empty-state">
              <div className="database-empty-icon">
                <FileSearch size={30} />
              </div>

              <h3>No approved projects found</h3>

              <p>
                No approved projects match your current search
                or academic year. Try changing your search criteria.
              </p>
            </div>
          ) : (
            <div className="database-ideas-list">
              {ideas.map((idea) => (
                <article
                  className="database-idea-card"
                  key={idea.id}
                >
                  <div className="database-idea-info">
                    <h3>{idea.title}</h3>

                    <p>{idea.description}</p>

                    <div className="database-idea-meta">
                      <span>
                        Category: {idea.category}
                      </span>

                      <span>
                        Academic Year: {idea.academicYear}
                      </span>

                      <span>
                        Submitted by: {
                          idea.submittedBy
                            ? idea.submittedBy.name
                            : "Unknown"
                        }
                      </span>

                      <span>
                        Submitted on: {
                          new Date(idea.createdAt).toLocaleDateString("en-IN")
                        }
                      </span>
                    </div>
                  </div>

                  <div className="database-idea-actions">
                    <span className="database-idea-status approved">
                      Approved
                    </span>

                    <Link to={`/ideas/${idea.id}`}>
                      View details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}