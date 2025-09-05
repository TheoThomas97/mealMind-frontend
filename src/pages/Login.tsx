import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, setTokens } from "../utils/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login({ username, password }).unwrap();
      setTokens(res.access, res.refresh);
      navigate("/");
    } catch (err: any) {
      if (err && err.data && err.data.detail) {
        setError(err.data.detail);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div style={{ padding: 32, maxWidth: 400, margin: "40px auto", border: "1px solid #eee", borderRadius: 12, background: "#fff" }}>
      <h1 style={{ textAlign: "center" }}>Welcome to MealMind</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
        <button onClick={() => navigate("/login")} style={{ padding: "8px 24px", borderRadius: 8, background: "#222", color: "#fff", border: "none" }}>Log In</button>
        <button onClick={() => navigate("/signup")} style={{ padding: "8px 24px", borderRadius: 8, background: "#eee", color: "#222", border: "none" }}>Sign Up</button>
      </div>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
  <button type="submit" style={{ padding: "10px 0", borderRadius: 8, background: "#2b2b2b", color: "#fff", border: "none", fontWeight: "bold" }} disabled={isLoading}>Log In</button>
      </form>
      {error && <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>}
    </div>
  );
}
