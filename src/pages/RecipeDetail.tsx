import { useParams } from "react-router-dom";
import { useGetRecipeQuery } from "../utils/api";

export default function RecipeDetail() {
  const { id } = useParams();
  const { data, isLoading } = useGetRecipeQuery(Number(id));
  if (isLoading) return <p style={{ padding: 16 }}>Loading…</p>;
  if (!data) return <p style={{ padding: 16 }}>Not found</p>;

  return (
    <div style={{ padding: 16 }}>
      <h1>{data.title}</h1>
      <p>{data.description || "No description yet."}</p>
      <h3>Ingredients</h3>
      <ul>
        {(data.recipe_ingredients ?? []).map((ri: any) => (
          <li key={ri.id}>
            {ri.ingredient?.name} {ri.quantity ?? ""} {ri.unit ?? ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
