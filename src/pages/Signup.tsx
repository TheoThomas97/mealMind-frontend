import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setTokens } from "../utils/api";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // Replace with your actual signup API call
      // Example: const { access, refresh } = await signup({ username, password });
      // For now, just simulate success and set dummy tokens
      setTokens("dummy-access-token", "dummy-refresh-token");
      nav("/recipes", { replace: true });
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 420, margin: "32px auto", display: "grid", gap: 12 }}>
      <h1>Sign Up</h1>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Sign Up</button>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </form>
  );
}
