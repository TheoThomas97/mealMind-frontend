import { Link } from "react-router-dom";
import { useCreateRecipeMutation, useGetRecipesQuery } from "../utils/api";
import { useState } from "react";

export default function Recipes() {
  const { data, isLoading } = useGetRecipesQuery();
  const [createRecipe] = useCreateRecipeMutation();
  const [title, setTitle] = useState("");

  if (isLoading) return <p style={{ padding: 16 }}>Loading…</p>;

  const list = (data?.results ?? data) || [];

  return (
    <div style={{ padding: 16 }}>
      <h1>Recipes</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New recipe title" />
        <button
          onClick={() => {
            if (!title.trim()) return;
            createRecipe({ title }).unwrap().then(() => setTitle(""));
          }}
        >
          Add
        </button>
      </div>
      <ul>
        {list.map((r: any) => (
          <li key={r.id}>
            <Link to={`/recipes/${r.id}`}>{r.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
