
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  FileText,
  Download,
  ArrowUpRight,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";

const sampleIdeas = [
  {
    id: "101",
    title: "Smart Campus Navigation System",
    category: "Web Development",
    student: "Student One",
    academicYear: "2025-2026",
  },
  {
    id: "102",
    title: "AI-Based Attendance Management",
    category: "Artificial Intelligence",
    student: "Student Two",
    academicYear: "2025-2026",
  },
  {
    id: "103",
    title: "Smart Waste Management System",
    category: "Internet of Things",
    student: "Student Three",
    academicYear: "2024-2025",
  },
];

export default function ApprovedIdeas() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [academicYear, setAcademicYear] = useState("all");

  const filteredIdeas = useMemo(() => {
    return sampleIdeas.filter((idea) => {
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

      <main className="approved-ideas page-container">
        <section className="approved-heading">
          <p className="section-kicker">PROJECT LIBRARY</p>
          <h1>Approved Ideas</h1>
          <p>
            Explore project ideas reviewed and approved by your college
            teachers. Discover inspiration for your next project.
          </p>

          <div className="approved-summary">
            <CheckCircle2 size={19} />
            <span>Approved project collection</span>
          </div>
        </section>

        <section className="approved-search-section">
          <form
            className="approved-search"
            onSubmit={(event) => event.preventDefault()}
          >
            <Search size={20} />
            <input
              type="search"
              placeholder="Search project titles, topics, or students..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search approved ideas"
            />
          </form>

          <div className="approved-filters">
            <span>
              <SlidersHorizontal size={17} />
              Filters
            </span>

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
            </select>

            <select
              value={academicYear}
              onChange={(event) => setAcademicYear(event.target.value)}
              aria-label="Filter by academic year"
            >
              <option value="all">All academic years</option>
              <option value="2025-2026">2025-2026</option>
              <option value="2024-2025">2024-2025</option>
            </select>
          </div>
        </section>

        <section className="approved-results">
          <div className="approved-results-heading">
            <div>
              <h2>Approved projects</h2>
              <p>
                {filteredIdeas.length} project
                {filteredIdeas.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {filteredIdeas.length > 0 ? (
            <div className="approved-grid">
              {filteredIdeas.map((idea) => (
                <article className="approved-card" key={idea.id}>
                  <div className="approved-card-top">
                    <span className="approved-card-icon">
                      <FileText size={22} />
                    </span>

                    <span className="approved-card-status">
                      <CheckCircle2 size={14} />
                      Approved
                    </span>
                  </div>

                  <span className="approved-category">
                    {idea.category}
                  </span>

                  <h3>{idea.title}</h3>

                  <div className="approved-card-details">
                    <p>Submitted by: {idea.student}</p>
                    <p>Academic year: {idea.academicYear}</p>
                  </div>

                  <div className="approved-card-actions">
                    <Link to={`/ideas/${idea.id}`}>
                      View details
                      <ArrowUpRight size={16} />
                    </Link>

                    <button type="button" disabled title="PDF integration is pending">
                      <Download size={16} />
                      PDF
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="approved-empty-state">
              <FileText size={36} strokeWidth={1.5} />
              <h3>No matching projects</h3>
              <p>Try changing your search or filters.</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
