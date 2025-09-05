import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) {
        let msg = "Signup failed. Please try again.";
        try {
          const data = await response.json();
          if (data.detail) msg = data.detail;
          else if (typeof data === "string") msg = data;
          else if (data.username) msg = `Username: ${data.username}`;
          else if (data.password) msg = `Password: ${data.password}`;
        } catch (e) {
          msg = "Signup failed. Is the registration endpoint implemented on the backend?";
        }
        setError(msg);
      } else {
        navigate("/login");
      }
    } catch (err: any) {
      setError("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: 32, maxWidth: 400, margin: "40px auto", border: "1px solid #eee", borderRadius: 12, background: "#fff" }}>
      <h1 style={{ textAlign: "center" }}>Sign Up for MealMind</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
        <button onClick={() => navigate("/login")} style={{ padding: "8px 24px", borderRadius: 8, background: "#eee", color: "#222", border: "none" }}>Log In</button>
        <button onClick={() => navigate("/signup")} style={{ padding: "8px 24px", borderRadius: 8, background: "#222", color: "#fff", border: "none" }}>Sign Up</button>
      </div>
      <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
  <button type="submit" style={{ padding: "10px 0", borderRadius: 8, background: "#2b2b2b", color: "#fff", border: "none", fontWeight: "bold" }} disabled={isLoading}>Sign Up</button>
      </form>
      {error && <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>}
    </div>
  );
}
