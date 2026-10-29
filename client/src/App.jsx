import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Database, Code2 } from "lucide-react";
import { ThemeProvider } from "./context/ThemeContext";
import Register from "./pages/Register.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import Navbar from "./components/layout/Navbar";
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
      <Route path="/" element={<Home />} />

      <Route
        path="/database"
        element={
          <FeaturePlaceholder
            title="Explore the Idea Database"
            description="The database page will connect to your authenticated backend and display real college ideas. Login and API integration are the next implementation steps."
            icon={Database}
          />
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={<StudentDashboard />}
      />

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