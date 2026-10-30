
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Lightbulb } from "lucide-react";
import Navbar from "../components/layout/Navbar";

export default function SubmitIdea() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    problemStatement: "",
    proposedSolution: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    // Backend submission will be connected after the form is ready.
    console.log("Idea details:", formData);
  }

  return (
    <>
      <Navbar />

      <main className="submit-idea page-container">
        <Link to="/dashboard" className="database-back-link">
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <section className="submit-idea-heading">
          <p className="section-kicker">SHARE YOUR THINKING</p>
          <h1>Submit an idea</h1>
          <p>
            Have an interesting project idea? Tell us about it. Your idea will
            be sent for teacher review.
          </p>
        </section>

        <form className="idea-form" onSubmit={handleSubmit}>
          <div className="idea-form-intro">
            <div className="idea-form-icon">
              <Lightbulb size={22} />
            </div>
            <div>
              <h2>Idea details</h2>
              <p>Give your project idea a clear identity.</p>
            </div>
          </div>

          <div className="idea-form-field">
            <label htmlFor="title">Project title</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Smart Campus Navigation System"
              required
            />
          </div>

          <div className="idea-form-field">
            <label htmlFor="category">Project category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="web-development">Web Development</option>
              <option value="app-development">App Development</option>
              <option value="artificial-intelligence">Artificial Intelligence</option>
              <option value="machine-learning">Machine Learning</option>
              <option value="iot">Internet of Things</option>
              <option value="cybersecurity">Cybersecurity</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="idea-form-field">
            <label htmlFor="description">Project overview</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Briefly explain what your project is about..."
              rows={4}
              required
            />
          </div>

          <div className="idea-form-field">
            <label htmlFor="problemStatement">Problem statement</label>
            <textarea
              id="problemStatement"
              name="problemStatement"
              value={formData.problemStatement}
              onChange={handleChange}
              placeholder="What problem are you trying to solve?"
              rows={4}
              required
            />
          </div>

          <div className="idea-form-field">
            <label htmlFor="proposedSolution">Proposed solution</label>
            <textarea
              id="proposedSolution"
              name="proposedSolution"
              value={formData.proposedSolution}
              onChange={handleChange}
              placeholder="How will your project solve this problem?"
              rows={4}
              required
            />
          </div>

          <div className="idea-form-footer">
            <p>You can review your idea before submitting it.</p>
            <button type="submit">
              <Send size={16} />
              Submit for review
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
