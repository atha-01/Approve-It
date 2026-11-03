
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Lightbulb } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import { submitIdea } from "../services/IdeaService";

export default function SubmitIdea() {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    problemStatement: "",
    proposedSolution: "",
    academicYear: "",
  });

  const [pdf, setPdf] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  // Prevents rapid repeated clicks before React updates the UI.
  const submissionLock = useRef(false);

  // Remembers the last successfully submitted form.
  const lastSubmittedKey = useRef(null);

  function createSubmissionKey(data, file) {
    return JSON.stringify({
      ...data,
      pdfName: file?.name,
      pdfSize: file?.size,
      pdfLastModified: file?.lastModified,
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setAlert(null);
  }

  function handlePdfChange(event) {
    const file = event.target.files[0];

    setPdf(null);
    setAlert(null);

    if (!file) return;

    if (file.type !== "application/pdf") {
      setAlert({
        type: "error",
        title: "Invalid PDF",
        message: "Please select a valid PDF file.",
      });

      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setAlert({
        type: "error",
        title: "File too large",
        message:
          "Your synopsis PDF must not exceed 10 MB. Please choose a smaller file.",
      });

      event.target.value = "";
      return;
    }

    setPdf(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Stop rapid repeated submissions.
    if (submissionLock.current || isSubmitting) return;

    setAlert(null);

    if (!pdf) {
      setAlert({
        type: "error",
        title: "PDF required",
        message:
          "Please upload your synopsis PDF before submitting your idea.",
      });
      return;
    }

    if (!token) {
      setAlert({
        type: "error",
        title: "Session expired",
        message: "Please log in again before submitting your idea.",
      });
      return;
    }

    const submissionKey = createSubmissionKey(formData, pdf);

    // Stop submission if this exact form was already submitted.
    if (submissionKey === lastSubmittedKey.current) {
      setAlert({
        type: "success",
        title: "Idea already submitted",
        message:
          "This idea has already been submitted. Change the details if you want to submit a new idea.",
      });
      return;
    }

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    data.append("pdf", pdf);

    submissionLock.current = true;
    setIsSubmitting(true);

    try {
      await submitIdea({
        formData: data,
        token,
      });

      // Remember the successful submission.
      lastSubmittedKey.current = submissionKey;

      setAlert({
        type: "success",
        title: "Idea submitted successfully!",
        message:
          "Your project idea has been submitted and is waiting for teacher review.",
      });
    } catch (error) {
      setAlert({
        type: "error",
        title: "Submission failed",
        message:
          error.message || "Something went wrong. Please try again.",
      });
    } finally {
      submissionLock.current = false;
      setIsSubmitting(false);
    }
  }

  const currentSubmissionKey = pdf
    ? createSubmissionKey(formData, pdf)
    : null;

  const alreadySubmitted =
    // eslint-disable-next-line react-hooks/refs
    currentSubmissionKey !== null &&
    // eslint-disable-next-line react-hooks/refs
    currentSubmissionKey === lastSubmittedKey.current;

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
              <option value="artificial-intelligence">
                Artificial Intelligence
              </option>
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

          <div className="idea-form-field">
            <label htmlFor="academicYear">Academic year</label>
            <input
              id="academicYear"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              placeholder="e.g. 2026-2027"
              required
            />
          </div>

          <div className="idea-form-field">
            <label htmlFor="pdf">Synopsis PDF (Maximum 10 MB)</label>
            <input
              id="pdf"
              type="file"
              accept="application/pdf,.pdf"
              onChange={handlePdfChange}
              required
            />
            {pdf && <p>Selected file: {pdf.name}</p>}
          </div>

          <div className="idea-form-footer">
            <p>You can review your idea before submitting it.</p>

            <button
              type="submit"
              // eslint-disable-next-line react-hooks/refs
              disabled={isSubmitting || alreadySubmitted}
            >
              <Send size={16} />
              {isSubmitting
                ? "Submitting..."
                // eslint-disable-next-line react-hooks/refs
                : alreadySubmitted
                  ? "Already submitted"
                  : "Submit for review"}
            </button>
          </div>
        </form>
      </main>

      {alert && (
        <div className="idea-alert-overlay">
          <div
            className="idea-alert-popup"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="idea-alert-title"
            aria-describedby="idea-alert-message"
          >
            <div className={`idea-alert-icon ${alert.type}`}>
              {alert.type === "success" ? "✓" : "!"}
            </div>

            <h2 id="idea-alert-title">{alert.title}</h2>
            <p id="idea-alert-message">{alert.message}</p>

            <button type="button" onClick={() => setAlert(null)}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
