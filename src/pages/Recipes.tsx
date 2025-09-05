import { Link } from "react-router-dom";
import { useCreateRecipeMutation, useGetRecipesQuery, useDeleteRecipeMutation, getAccess } from "../utils/api";
import { useState, useMemo } from "react";

function Recipes() {
  const [createRecipe, { isLoading: isCreating }] = useCreateRecipeMutation();
  const [deleteRecipe, { isLoading: isDeleting }] = useDeleteRecipeMutation();
  const { data } = useGetRecipesQuery();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [servings, setServings] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async (id: number) => {
    setDeleteError("");
    try {
      await deleteRecipe(id).unwrap();
    } catch (err: any) {
      if (err && err.data && err.data.detail) {
        setDeleteError(`Failed to delete recipe: ${err.data.detail}`);
      } else if (err && err.message) {
        setDeleteError(`Failed to delete recipe: ${err.message}`);
      } else {
        setDeleteError("Failed to delete recipe. Are you logged in?");
      }
    }
  };

  const isLoggedIn = !!getAccess();

  // Normalize API shape (paginated or array)
  const toArray = (data: any): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.results)) return data.results;
    return [];
  };

  const recipes = useMemo(() => toArray(data), [data]);
  const filtered = useMemo(() => recipes.filter(r => r.title.toLowerCase().includes(search.toLowerCase())), [recipes, search]);

  const handleAdd = async () => {
    setError("");
    if (!title.trim()) return;
    const payload: any = { title, recipe_ingredients: [] };
    if (description.trim()) payload.description = description;
    if (instructions.trim()) payload.instructions = instructions;
    if (servings.trim()) payload.servings = Number(servings);
    if (imageUrl.trim()) payload.image_url = imageUrl;
    try {
      await createRecipe(payload).unwrap();
      setTitle("");
      setDescription("");
      setInstructions("");
      setServings("");
      setImageUrl("");
    } catch (err: any) {
      if (err && err.data && err.data.detail) {
        setError(`Failed to add recipe: ${err.data.detail}`);
      } else if (err && err.message) {
        setError(`Failed to add recipe: ${err.message}`);
      } else {
        setError("Failed to add recipe. Are you logged in?");
      }
    }
  };

  return (
    <div style={{
      padding: 32,
      maxWidth: 600,
      margin: "0 auto",
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 2px 16px #0001"
    }}>
      <h1 style={{ fontSize: 40, color: "#222", marginBottom: 24, textAlign: "center" }}>Recipes</h1>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginBottom: 24,
        background: "#f7f7fa",
        borderRadius: 12,
        padding: 24,
        boxShadow: "0 1px 6px #646cff11"
      }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 18 }} />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 18 }} />
        <input value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Instructions" style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 18 }} />
        <input value={servings} onChange={(e) => setServings(e.target.value)} placeholder="Servings" type="number" min="1" style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 18 }} />
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 18 }} />
        <button onClick={handleAdd} disabled={!isLoggedIn || isCreating} style={{ padding: "12px 0", borderRadius: 8, background: isCreating ? "#aaa" : "#646cff", color: "#fff", fontWeight: "bold", fontSize: 20, border: "none", marginTop: 8, cursor: isCreating ? "not-allowed" : "pointer" }}>{isCreating ? "Adding..." : "Add Recipe"}</button>
      </div>
      {error && <p style={{ color: "crimson", textAlign: "center", marginBottom: 16 }}>{error}</p>}
      {deleteError && <p style={{ color: "crimson", textAlign: "center", marginBottom: 16 }}>{deleteError}</p>}
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ marginBottom: 18, padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 18, width: "100%" }} />
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {filtered.map(r => (
          <li key={r.id} style={{ background: "#f7f7fa", borderRadius: 10, marginBottom: 12, padding: "14px 18px", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 4px #646cff11" }}>
            {editId === r.id ? (
              <>
                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ fontSize: 18, padding: 8, borderRadius: 8, border: "1px solid #ccc" }} />
                <button onClick={() => {
                  setEditId(null);
                }} style={{ marginLeft: 8, padding: "8px 16px", borderRadius: 8, background: "#646cff", color: "#fff", border: "none", fontWeight: "bold" }}>Save</button>
                <button onClick={() => setEditId(null)} style={{ marginLeft: 4, padding: "8px 16px", borderRadius: 8, background: "#eee", color: "#222", border: "none" }}>Cancel</button>
              </>
            ) : (
              <>
                <Link to={`/recipes/${r.id}`} style={{ color: "#646cff", textDecoration: "none", fontWeight: 500 }}>{r.title}</Link>
                <span>
                  <button onClick={() => { setEditId(r.id); setEditTitle(r.title); }} style={{ marginLeft: 8, padding: "8px 16px", borderRadius: 8, background: "#eee", color: "#222", border: "none" }}>Edit</button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    disabled={isDeleting}
                    style={{
                      marginLeft: 4,
                      padding: "8px 16px",
                      borderRadius: 8,
                      background: isDeleting ? "#aaa" : "#fff0f0",
                      color: "crimson",
                      border: "none",
                      fontWeight: "bold",
                      cursor: isDeleting ? "not-allowed" : "pointer"
                    }}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
      {!isLoggedIn && (
        <p style={{ color: "#666", marginTop: 16, textAlign: "center" }}>
          You must be logged in to add recipes.
        </p>
      )}
    </div>
  );
}

export default Recipes;
