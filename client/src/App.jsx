
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Code2, Database } from "lucide-react";

import { ThemeProvider } from "./context/ThemeContext";

import Navbar from "./components/layout/Navbar";

import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/Register.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import SubmitIdea from "./pages/SubmitIdea.jsx";
import IdeaDatabase from "./pages/IdeaDatabase.jsx";
import IdeaDetails from "./pages/ideaDetails.jsx";
import TeacherReview from "./pages/teacherReview.jsx";
import Archives from "./pages/archives.jsx";
import ApprovedIdeas from "./pages/ApprovedIdeas.jsx";
import Profile from "./pages/profile.jsx";

import "./App.css";

function FeaturePlaceholder({ title, description, icon: Icon }) {
  return (
    <>
      <Navbar />

      <main className="placeholder-page">
        <section className="placeholder-content page-container">
          <div className="placeholder-icon">
            <Icon size={27} aria-hidden="true" />
          </div>

          <h1>{title}</h1>
          <p>{description}</p>

          <Link to="/" className="button button-primary">
            Back to homepage
          </Link>
        </section>
      </main>
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/database" element={<IdeaDatabase />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/approved-ideas" element={<ApprovedIdeas />} />
      <Route path="/archives" element={<Archives />} />
      <Route path="/profile" element={<Profile />} />

      {/* Student pages */}
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/submit-idea" element={<SubmitIdea />} />
      <Route path="/ideas/:id" element={<IdeaDetails />} />

      {/* Teacher pages */}
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/teacher/review/:id" element={<TeacherReview />} />

      {/* Other features */}
      <Route
        path="/repositories"
        element={
          <FeaturePlaceholder
            title="Repository discovery"
            description="External GitHub search is planned but is not connected to the backend yet."
            icon={Code2}
          />
        }
      />

      {/* Fallback page */}
      <Route
        path="*"
        element={
          <FeaturePlaceholder
            title="Page not found"
            description="The page you requested doesn't exist."
            icon={Database}
          />
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
