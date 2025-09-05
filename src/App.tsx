import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Planner from "./pages/Planner";
import Shopping from "./pages/Shopping";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RequireAuth from "./pages/RequireAuth";
import LogoutButton from "./pages/LogoutButton";

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', minHeight: '100vh', minWidth: '100vw', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ width: '100%', display: 'flex', gap: 16, alignItems: 'center', padding: '16px 32px', background: 'rgba(0,0,0,0.15)', justifyContent: 'flex-start' }}>
        <Link to="/">Home</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/planner">Planner</Link>
        <Link to="/shopping">Shopping</Link>
        <LogoutButton />
      </nav>
      <div style={{ flex: 1, width: '100%', height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<RequireAuth><Recipes /></RequireAuth>} />
          <Route path="/recipes/:id" element={<RequireAuth><RecipeDetail /></RequireAuth>} />
          <Route path="/planner" element={<RequireAuth><Planner /></RequireAuth>} />
          <Route path="/shopping" element={<RequireAuth><Shopping /></RequireAuth>} />
        </Routes>
      </div>
    </div>
  );
}
