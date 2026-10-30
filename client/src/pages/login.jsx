
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitLogin(event) {
    event.preventDefault();
    setErrorMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await login({
        email: normalizedEmail,
        password,
        role,
      });

      const requestedPath = location.state?.from;

      const defaultPaths = {
        student: "/dashboard",
        teacher: "/teacher/dashboard",
        admin: "/admin/dashboard",
      };

      navigate(requestedPath || defaultPaths[user.role], {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to log in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <Link to="/" className="auth-back-link">
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="auth-brand-mark">
          <GraduationCap size={27} />
        </div>

        <p className="auth-eyebrow">
          APPROVEIT · STUDENT, FACULTY & ADMIN PORTAL
        </p>

        <h1>Welcome back</h1>

        <p className="auth-description">
          Sign in to access your ApproveIT account.
        </p>

        <form className="auth-form" onSubmit={submitLogin}>
          <label>Login as</label>

          <div className="login-role-options">
            {["student", "teacher", "admin"].map((item) => (
              <button
                key={item}
                type="button"
                className={`login-role-option ${
                  role === item ? "active" : ""
                }`}
                onClick={() => {
                  setRole(item);
                  setErrorMessage("");
                }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          <label htmlFor="login-email">Email address</label>

          <div className="auth-input-wrap">
            <Mail size={18} aria-hidden="true" />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <label htmlFor="login-password">Password</label>

          <div className="auth-input-wrap">
            <LockKeyhole size={18} aria-hidden="true" />
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {errorMessage && (
            <p className="auth-error" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            className="auth-submit-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
            {!isSubmitting && <ArrowRight size={17} />}
          </button>
        </form>

        {role === "student" && (
          <p className="auth-switch">
            New to ApproveIT?{" "}
            <Link to="/register">Create an account</Link>
          </p>
        )}

        {role === "teacher" && (
          <p className="auth-switch">
            Not registered as a teacher?{" "}
            <Link to="/teacher-register">Register as a teacher</Link>
          </p>
        )}

        <p className="auth-security-note">
          Your account access is verified by the ApproveIT server.
        </p>
      </section>
    </main>
  );
}
