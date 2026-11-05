/* eslint-disable react-hooks/static-components */
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Code2,
  BookOpen,
  FileText,
  Globe,
  ExternalLink,
  Star,
  Calendar,
  LoaderCircle,
  FileSearch,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import { searchResources } from "../services/searchService";


const filters = [
  { label: "All", value: "all", icon: Search },
  { label: "Repositories", value: "repository", icon: Code2 },
  { label: "Research Papers", value: "research", icon: BookOpen },
  { label: "Related Ideas", value: "idea", icon: FileSearch },
  { label: "Articles & Web", value: "web", icon: Globe },
  { label: "Documentation", value: "documentation", icon: FileText },
];

function getResultType(result) {
  return (result.type || "web").toLowerCase();
}

function getFilteredResults(results, activeFilter) {
  if (activeFilter === "all") {
    return results;
  }

  if (activeFilter === "documentation") {
    return results.filter((result) => {
      const type = getResultType(result);

      return (
        type === "documentation" ||
        type === "docs"
      );
    });
  }

  return results.filter(
    (result) => getResultType(result) === activeFilter
  );
}

function getResultIcon(type) {
  switch (type) {
    case "repository":
      return Code2;
    case "research":
      return BookOpen;
    case "idea":
      return FileSearch;
    case "documentation":
    case "docs":
      return FileText;
    default:
      return Globe;
  }
}

function getTypeLabel(type) {
  switch (type) {
    case "repository":
      return "Repository";
    case "research":
      return "Research Paper";
    case "idea":
      return "College Idea";
    case "documentation":
    case "docs":
      return "Documentation";
    default:
      return "Article / Website";
  }
}

function SearchResultCard({ result }) {
  const type = getResultType(result);
  const Icon = getResultIcon(type);

  const isCollegeIdea = type === "idea";

  const internalUrl =
    result.url ||
    (result.id ? `/ideas/${result.id}` : "/database");

  return (
    <article className="research-result-card">
      <div className="research-result-top">
        <div className="research-result-source">
          <span className="research-result-icon">
            // eslint-disable-next-line react-hooks/static-components
            <Icon size={19} />
          </span>

          <span>{result.source || "External Source"}</span>
        </div>

        <span className="research-result-type">
          {getTypeLabel(type)}
        </span>
      </div>

      <h2 className="research-result-title">
        {isCollegeIdea ? (
          <Link to={internalUrl}>
            {result.title || "Untitled result"}
          </Link>
        ) : (
          result.title || "Untitled result"
        )}
      </h2>

      <p className="research-result-description">
        {result.description ||
          result.abstract ||
          "No description is available for this result."}
      </p>

      <div className="research-result-meta">
        {result.language && (
          <span>
            <Code2 size={14} />
            {result.language}
          </span>
        )}

        {typeof result.stars === "number" && (
          <span>
            <Star size={14} />
            {result.stars.toLocaleString()} stars
          </span>
        )}

        {result.publicationYear && (
          <span>
            <Calendar size={14} />
            {result.publicationYear}
          </span>
        )}

        {typeof result.citations === "number" && (
          <span>
            {result.citations.toLocaleString()} citations
          </span>
        )}

        {result.authors?.length > 0 && (
          <span>
            {result.authors.slice(0, 3).join(", ")}
          </span>
        )}
      </div>

      <div className="research-result-footer">
        {isCollegeIdea ? (
          <Link
            to={internalUrl}
            className="research-result-link"
          >
            View college idea
            <ExternalLink size={15} />
          </Link>
        ) : result.url ? (
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="research-result-link"
          >
            Visit original source
            <ExternalLink size={15} />
          </a>
        ) : (
          <span className="research-no-link">
            Source link unavailable
          </span>
        )}
      </div>
    </article>
  );
}

export default function Repositories() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { token } = useAuth();

  const [query, setQuery] = useState(
    searchParams.get("q") || ""
  );

  const [activeFilter, setActiveFilter] = useState("all");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      setSearched(false);
      setError("");
      return;
    }

    let cancelled = false;

    async function fetchResults() {
      try {
        setLoading(true);
        setError("");
        setSearched(true);

        const data = await searchResources(searchQuery, token);

        if (!cancelled) {
          setResults(data);
        }
      } catch (error) {
        if (!cancelled) {
          setError(error.message);
          setResults([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchResults();

    return () => {
      cancelled = true;
    };
  }, [searchQuery, token]);

  function handleSearch(event) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    setActiveFilter("all");

    setSearchParams({
      q: trimmedQuery,
    });
  }

  const filteredResults = getFilteredResults(
    results,
    activeFilter
  );

  return (
    <>
      <Navbar />

      <main className="research-page page-container">
        <section className="research-heading">
          <p className="section-kicker">
            EXPLORE THE WORLD OF RESEARCH
          </p>

          <h1>
            Research <span>Explorer</span>
          </h1>

          <p>
            Discover repositories, research papers, technical
            articles, documentation and project ideas in one place.
          </p>
        </section>

        <section className="research-search-section">
          <form
            className="research-search-form"
            onSubmit={handleSearch}
          >
            <Search size={22} />

            <label
              htmlFor="research-search-input"
              className="visually-hidden"
            >
              Search research resources
            </label>

            <input
              id="research-search-input"
              type="search"
              placeholder="Search a topic, technology or project idea..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              maxLength={200}
            />

            <button
              type="submit"
              disabled={!query.trim() || loading}
            >
              Search
            </button>
          </form>

          <p className="research-search-hint">
            Search across multiple sources using one query.
          </p>
        </section>

        <section className="research-results-section">
          <div className="research-filter-list">
            {filters.map((filter) => {
              const Icon = filter.icon;

              return (
                <button
                  key={filter.value}
                  type="button"
                  className={
                    activeFilter === filter.value
                      ? "research-filter active"
                      : "research-filter"
                  }
                  onClick={() => setActiveFilter(filter.value)}
                >
                  <Icon size={16} />
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="research-results-heading">
            <div>
              <h2>
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : "Discover useful resources"}
              </h2>

              <p>
                {searchQuery
                  ? `${filteredResults.length} results in this category`
                  : "Enter a search query to explore resources."}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="research-state">
              <LoaderCircle
                size={32}
                className="research-spinner"
              />

              <h3>Searching resources...</h3>

              <p>
                Gathering results from available sources.
              </p>
            </div>
          ) : error ? (
            <div className="research-state">
              <div className="research-state-icon error">
                <Globe size={27} />
              </div>

              <h3>Search failed</h3>

              <p>{error}</p>
            </div>
          ) : !searched ? (
            <div className="research-state">
              <div className="research-state-icon">
                <Search size={28} />
              </div>

              <h3>What do you want to explore?</h3>

              <p>
                Enter a topic above to discover repositories,
                papers, articles and other resources.
              </p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="research-state">
              <div className="research-state-icon">
                <FileSearch size={28} />
              </div>

              <h3>No results found</h3>

              <p>
                No results are available in this category.
                Try another category or search term.
              </p>
            </div>
          ) : (
            <div className="research-results-list">
              {filteredResults.map((result, index) => (
                <SearchResultCard
                  key={
                    result.id ||
                    result.url ||
                    `${result.title}-${index}`
                  }
                  result={result}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}