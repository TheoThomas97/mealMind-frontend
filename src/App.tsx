import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Planner from "./pages/Planner";
import Shopping from "./pages/Shopping";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RequireAuth from "./components/RequireAuth";
import LogoutButton from "./components/LogoutButton";

export default function App() {
  return (
    <div>
      {/* NAV BAR */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 24px",
          borderBottom: "1px solid #e5e7eb",
          background: "#fafafa",
        }}
      >
        <h2 style={{ margin: 0 }}>
          <Link to="/" style={{ textDecoration: "none", color: "#111" }}>
            MealMind
          </Link>
        </h2>

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#111" }}>Home</Link>
          <Link to="/recipes" style={{ textDecoration: "none", color: "#111" }}>Recipes</Link>
          <Link to="/planner" style={{ textDecoration: "none", color: "#111" }}>Planner</Link>
          <Link to="/shopping" style={{ textDecoration: "none", color: "#111" }}>Shopping</Link>
          <LogoutButton />
        </div>
      </nav>

      {/* ROUTES */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/recipes"
          element={
            <RequireAuth>
              <Recipes />
            </RequireAuth>
          }
        />
        <Route
          path="/recipes/:id"
          element={
            <RequireAuth>
              <RecipeDetail />
            </RequireAuth>
          }
        />
        <Route
          path="/planner"
          element={
            <RequireAuth>
              <Planner />
            </RequireAuth>
          }
        />
        <Route
          path="/shopping"
          element={
            <RequireAuth>
              <Shopping />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}
