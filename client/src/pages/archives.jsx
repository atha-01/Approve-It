
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  FileText,
  Download,
  ArrowUpRight,
  Archive,
  CalendarDays,
  SlidersHorizontal,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";

const archivedIdeas = [
  {
    id: "201",
    title: "Online College Management System",
    category: "Web Development",
    student: "Student One",
    academicYear: "2024-2025",
  },
  {
    id: "202",
    title: "AI-Based Disease Prediction",
    category: "Artificial Intelligence",
    student: "Student Two",
    academicYear: "2023-2024",
  },
  {
    id: "203",
    title: "IoT-Based Smart Agriculture",
    category: "Internet of Things",
    student: "Student Three",
    academicYear: "2024-2025",
  },
  {
    id: "204",
    title: "Secure File Sharing Platform",
    category: "Cybersecurity",
    student: "Student Four",
    academicYear: "2022-2023",
  },
];

export default function Archives() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [academicYear, setAcademicYear] = useState("all");

  const availableYears = [
    ...new Set(archivedIdeas.map((idea) => idea.academicYear)),
  ].sort((a, b) => b.localeCompare(a));

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
 const filteredIdeas = useMemo(() => {
  return archivedIdeas.filter((idea) => {
    const searchMatch =
      `${idea.title} ${idea.category} ${idea.student}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const categoryMatch =
      category === "all" || idea.category === category;

    const yearMatch =
      academicYear === "all" ||
      idea.academicYear === academicYear;

    return searchMatch && categoryMatch && yearMatch;
  });
}, [search, category, academicYear]);

  return (
    <>
      <Navbar />

      <main className="archives-page page-container">
        <section className="archives-heading">
          <p className="section-kicker">PROJECT HISTORY</p>
          <h1>Project Archives</h1>
          <p>
            Explore approved projects from previous academic years.
            Discover past work, learn from earlier ideas, and find inspiration
            for your next project.
          </p>

          <div className="archives-summary">
            <Archive size={19} />
            <span>Previous academic-year collections</span>
          </div>
        </section>

        <section className="archives-search-section">
          <form
            className="archives-search"
            onSubmit={(event) => event.preventDefault()}
          >
            <Search size={20} />
            <input
              type="search"
              placeholder="Search archived projects, topics, or students..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search archived projects"
            />
          </form>

          <div className="archives-filters">
            <span>
              <SlidersHorizontal size={17} />
              Filters
            </span>

            <select
              value={academicYear}
              onChange={(event) => setAcademicYear(event.target.value)}
              aria-label="Filter by academic year"
            >
              <option value="all">All academic years</option>
              {availableYears.map((year) => (
                <option value={year} key={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter by category"
            >
              <option value="all">All categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Artificial Intelligence">
                Artificial Intelligence
              </option>
              <option value="Internet of Things">
                Internet of Things
              </option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </div>
        </section>

        <section className="archives-results">
          <div className="archives-results-heading">
            <div>
              <h2>Archived projects</h2>
              <p>
                {filteredIdeas.length} project
                {filteredIdeas.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {filteredIdeas.length > 0 ? (
            <div className="archives-grid">
              {filteredIdeas.map((idea) => (
                <article className="archives-card" key={idea.id}>
                  <div className="archives-card-top">
                    <span className="archives-card-icon">
                      <FileText size={22} />
                    </span>

                    <span className="archives-year">
                      <CalendarDays size={14} />
                      {idea.academicYear}
                    </span>
                  </div>

                  <span className="archives-category">
                    {idea.category}
                  </span>

                  <h3>{idea.title}</h3>

                  <div className="archives-card-details">
                    <p>Submitted by: {idea.student}</p>
                    <p>Academic year: {idea.academicYear}</p>
                  </div>

                  <div className="archives-card-actions">
                    <Link to={`/ideas/${idea.id}`}>
                      View details
                      <ArrowUpRight size={16} />
                    </Link>

                    <button
                      type="button"
                      disabled
                      title="PDF integration is pending"
                    >
                      <Download size={16} />
                      PDF
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="archives-empty-state">
              <Archive size={36} strokeWidth={1.5} />
              <h3>No archived projects found</h3>
              <p>Try changing your search or filters.</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
