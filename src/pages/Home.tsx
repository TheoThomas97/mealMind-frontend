// src/pages/Home.tsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useGetRecipesQuery } from "../utils/api";

// normalize API shape (paginated or array)
function toArray(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  return [];
}

export default function Home() {
  const { data, isLoading } = useGetRecipesQuery();
  const [q, setQ] = useState("");

  const recipes = useMemo(() => {
    const arr = toArray(data);
    if (!q.trim()) return arr;
    const term = q.toLowerCase();
    return arr.filter(
      (r: any) =>
        r.title?.toLowerCase().includes(term) ||
        r.description?.toLowerCase().includes(term)
    );
  }, [data, q]);

  return (
    <main style={{ padding: "24px 20px", maxWidth: 1100, margin: "0 auto" }}>
      <h1>Welcome to MealMind!</h1>
      <p style={{ fontSize: 18, marginBottom: 24 }}>
        Plan your meals, discover recipes, and manage your shopping lists.
      </p>
      <div style={{ marginBottom: 20 }}>
        <input
          aria-label="Search"
          placeholder="Search..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            width: "100%", height: 48, padding: "0 16px",
            border: "2px solid #cfcfcf", borderRadius: 10,
            background: "#fafafa", fontSize: 16, outline: "none"
          }}
        />
      </div>
      <h2 style={{ fontSize: 34, margin: "12px 0 16px" }}>All Meals</h2>
      {isLoading ? (
        <p>Loading…</p>
      ) : recipes.length ? (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 24,
          }}
        >
          {recipes.map((r: any) => (
            <MealCard key={r.id} recipe={r} />
          ))}
        </section>
      ) : (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <p style={{ color: "#666" }}>No meals yet. Add one on the Recipes page.</p>
          <div style={{ marginTop: 24 }}>
            <a href="/login" style={{ marginRight: 16 }}>Log In</a>
            <a href="/signup">Sign Up</a>
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 760px){
          main section { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}

function MealCard({ recipe }: { recipe: any }) {
  const img = recipe.image_url as string | undefined;

  return (
    <article style={{ display: "flex", flexDirection: "column" }}>
      {/* Image placeholder (wireframe style) */}
      <Link to={`/recipes/${recipe.id}`} aria-label={`Open ${recipe.title}`}>
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "66%",
            border: "3px solid #2b2b2b",
            borderRadius: 6,
            background: "#f3f3f3",
            overflow: "hidden",
          }}
        >
          {img ? (
            <img
              src={img}
              alt={recipe.title}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <CrossLines />
          )}
        </div>
      </Link>

      {/* Title + description + button */}
      <h3 style={{ fontSize: 28, margin: "16px 0 4px" }}>{recipe.title || "Meal Title"}</h3>
      <p style={{ margin: 0, color: "#444", fontSize: 18 }}>
        {recipe.description || "Description of the meal"}
      </p>
      <div>
        <button
          style={{
            marginTop: 14,
            padding: "8px 14px",
            border: "2px solid #2b2b2b",
            borderRadius: 8,
            background: "transparent",
            fontSize: 16,
            cursor: "pointer",
          }}
          // Use servings or a placeholder; change to cook_time if you add that field later
          title="Cook Time"
        >
          Cook Time
        </button>
      </div>
    </article>
  );
}

function CrossLines() {
  // draw the X like a wireframe placeholder
  return (
    <svg viewBox="0 0 100 66" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
      <rect x="0" y="0" width="100" height="66" fill="none" />
      <line x1="0" y1="0" x2="100" y2="66" stroke="#2b2b2b" strokeWidth="2" />
      <line x1="100" y1="0" x2="0" y2="66" stroke="#2b2b2b" strokeWidth="2" />
    </svg>
  );
}

