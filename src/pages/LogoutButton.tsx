import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function LogoutButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("access"));

  // Update login state on mount, on navigation, and on storage changes
  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("access"));
  }, [location]);

  useEffect(() => {
    const onStorage = () => setLoggedIn(!!localStorage.getItem("access"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleClick = () => {
    if (loggedIn) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setLoggedIn(false);
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "8px 16px",
        background: "#111",
        color: "#fff",
        borderRadius: 10,
      }}
    >
      {loggedIn ? "Log Out" : "Log In"}
    </button>
  );
}
