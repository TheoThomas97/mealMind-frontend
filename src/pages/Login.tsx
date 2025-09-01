import type { FormEvent } from "react";
import { useState } from "react";
import { useLoginMutation, setTokens } from "../utils/api";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();
  const nav = useNavigate();
  const loc = useLocation() as any;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { access, refresh } = await login({ username, password }).unwrap();
      setTokens(access, refresh);
      const to = loc.state?.from?.pathname || "/recipes";
      nav(to, { replace: true });
    } catch {}
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 420, margin: "32px auto", display: "grid", gap: 12 }}>
      <h1>Log in</h1>
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button disabled={isLoading}>Log in</button>
      {error && <p style={{ color: "crimson" }}>Login failed — check username/password.</p>}
    </form>
  );
}
