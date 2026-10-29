
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { registerStudent } from "../services/authService";
import Navbar from "../components/layout/Navbar";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerStudent({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/login", {
        replace: true,
        state: { message: "Your account was created. You can now log in." },
      });
    } catch (requestError) {
      setError(requestError.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="auth-page">
        <section className="auth-panel" aria-labelledby="register-title">
          <Link to="/" className="auth-back-link">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to home
          </Link>

          <div className="auth-brand-mark">
            <GraduationCap size={25} aria-hidden="true" />
          </div>

          <p className="auth-eyebrow">CREATE YOUR ACCOUNT</p>
          <h1 id="register-title">Start with an idea.</h1>
          <p className="auth-description">
            Create your student account to explore ideas and track your project
            through the approval process.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="register-name">Full name</label>
            <div className="auth-input-wrap">
              <UserRound size={18} aria-hidden="true" />
              <input
                id="register-name"
                name="name"
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                maxLength={100}
                required
              />
            </div>

            <label htmlFor="register-email">College email</label>
            <div className="auth-input-wrap">
              <Mail size={18} aria-hidden="true" />
              <input
                id="register-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <label htmlFor="register-password">Password</label>
            <div className="auth-input-wrap">
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />
              <button
                type="button"
                className="password-visibility-button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
              </button>
            </div>

            <label htmlFor="register-confirm-password">
              Confirm password
            </label>
            <div className="auth-input-wrap">
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                id="register-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Enter your password again"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-visibility-button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
              </button>
            </div>

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="auth-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
              {!isSubmitting && (
                <ArrowRight size={17} aria-hidden="true" />
              )}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>

          <p className="auth-security-note">
            <ShieldCheck size={14} aria-hidden="true" /> Student accounts are
            registered through ApproveIT.
          </p>
        </section>
      </main>
    </>
  );
}
