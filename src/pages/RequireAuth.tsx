import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("access");
  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => navigate("/login"), 1200);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);
  if (!isAuthenticated) {
    return (
      <div style={{ background: 'crimson', color: 'white', height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
        You must be logged in to view this page. Redirecting to login...
      </div>
    );
  }
  return <>{children}</>;
}
