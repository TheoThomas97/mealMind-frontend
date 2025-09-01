import { clearTokens } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const nav = useNavigate();
  return (
    <button
      onClick={() => {
        clearTokens();
        nav("/login");
      }}
    >
      Logout
    </button>
  );
}
