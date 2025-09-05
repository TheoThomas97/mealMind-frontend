
import { useParams } from "react-router-dom";
import { useGetRecipeQuery, useCreateRecipeIngredientMutation, useDeleteRecipeIngredientMutation, useGetIngredientsQuery } from "../utils/api";
import { useState } from "react";

function RecipeDetail() {
  const { data: allIngredientsData } = useGetIngredientsQuery();
  const allIngredients = Array.isArray(allIngredientsData)
    ? allIngredientsData
    : Array.isArray(allIngredientsData?.results)
    ? allIngredientsData.results
    : [];
  const { id } = useParams<{ id: string }>();
  const recipeId = id ? parseInt(id, 10) : undefined;
  const { data: recipe, isLoading, error, refetch } = useGetRecipeQuery(recipeId as number);
  const [addError, setAddError] = useState("");
  const [newIngredient, setNewIngredient] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  // removed unused createIngredient mutation
  const isCreatingIngredient = false;
  const [createRecipeIngredient] = useCreateRecipeIngredientMutation();
  // Store the last added ingredient name for optimistic UI
  const [lastAddedIngredientName, setLastAddedIngredientName] = useState<string | null>(null);
  const [deleteRecipeIngredient] = useDeleteRecipeIngredientMutation();
  const handleDeleteIngredient = async (recipeIngredientId: number) => {
    try {
      await deleteRecipeIngredient(recipeIngredientId).unwrap();
      refetch();
    } catch (err) {
      // Optionally handle error
    }
  };

  const recipeIngredients = recipe?.recipe_ingredients || recipe?.ingredients || [];

  const handleCreateAndAddIngredient = async () => {
    setAddError("");
    if (!newIngredient.trim() || !recipeId) {
      setAddError("Ingredient name is required.");
      return;
    }
    if (!quantity.trim() || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      setAddError("Quantity must be a positive number.");
      return;
    }
    try {
      await createRecipeIngredient({
        recipe: recipeId,
        ingredient_data: { name: newIngredient.trim() },
        quantity: Number(quantity),
        unit
      }).unwrap();
      setLastAddedIngredientName(newIngredient.trim());
      setQuantity("");
      setUnit("");
      setNewIngredient("");
      refetch();
    } catch (err: any) {
      if (err && err.data && err.data.name && Array.isArray(err.data.name) && err.data.name[0].includes('unique')) {
        setAddError("Ingredient name must be unique.");
      } else if (err && err.data && err.data.detail) {
        setAddError(`Failed to create or link ingredient: ${err.data.detail}`);
      } else {
        setAddError("Failed to create and add ingredient.");
      }
    }
  };

  if (isLoading) return <div style={{ padding: 16 }}>Loading…</div>;
  if (error || !recipe) {
    return (
      <div style={{ background: 'crimson', color: 'white', height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
        Recipe not found or an error occurred. Please reload the page or try again.<br />
        {addError && <div style={{ marginTop: 16 }}>{addError}</div>}
      </div>
    );
  }

  return (
  <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 40, marginBottom: 16 }}>{recipe.title || "Recipe Detail"}</h1>
      {recipe.description && <p style={{ fontSize: 20, marginBottom: 16 }}>{recipe.description}</p>}
      <h2 style={{ fontSize: 28, marginBottom: 10 }}>Ingredients</h2>
      <ul style={{ fontSize: 20, marginBottom: 24 }}>
        {recipeIngredients.map((ing: any, idx: number) => {
          let name = '';
          if (typeof ing === 'object' && ing !== null) {
            if (ing.name || ing.ingredient_name) {
              name = ing.name || ing.ingredient_name;
            } else if (ing.ingredient && typeof ing.ingredient === 'object' && ing.ingredient.name) {
              name = ing.ingredient.name;
            } else if (ing.ingredient) {
              // Look up ingredient name from allIngredients
              const found = allIngredients.find((i: any) => i.id === ing.ingredient);
              if (found && found.name) name = found.name;
            }
            // Optimistically use lastAddedIngredientName if this is the most recent ingredient and name is missing
            if (!name && idx === recipeIngredients.length - 1 && lastAddedIngredientName) {
              name = lastAddedIngredientName;
            }
            if (!name) name = 'Unnamed ingredient';
            const quantity = ing.quantity || ing.amount || '';
            const unit = ing.unit || '';
            return (
              <li key={ing.id || idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>
                  {name}
                  {quantity ? ` — ${quantity}` : ''}
                  {unit ? ` ${unit}` : ''}
                </span>
                {ing.id && (
                  <button
                    onClick={() => handleDeleteIngredient(ing.id)}
                    style={{ marginLeft: 8, background: 'crimson', color: 'white', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}
                    title="Delete ingredient"
                  >
                    ✕
                  </button>
                )}
              </li>
            );
          }
          return <li key={idx}>{ing}</li>;
        })}
      </ul>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
        <input
          value={newIngredient}
          onChange={e => setNewIngredient(e.target.value)}
          placeholder="Add new ingredient"
          style={{ padding: 8, borderRadius: 6, fontSize: 16, flex: 2 }}
        />
        <input
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          placeholder="Quantity (e.g. 2)"
          type="number"
          style={{ padding: 8, borderRadius: 6, fontSize: 16, flex: 1 }}
        />
        <input
          value={unit}
          onChange={e => setUnit(e.target.value)}
          placeholder="Unit (e.g. pieces)"
          style={{ padding: 8, borderRadius: 6, fontSize: 16, flex: 1 }}
        />
        <button
          onClick={handleCreateAndAddIngredient}
          disabled={!newIngredient.trim() || isCreatingIngredient}
          style={{ padding: "8px 18px", borderRadius: 8, background: isCreatingIngredient ? "#aaa" : "#646cff", color: "#fff", fontWeight: "bold", fontSize: 16, border: "none", cursor: isCreatingIngredient ? "not-allowed" : "pointer" }}
        >
          {isCreatingIngredient ? "Adding..." : "Add Ingredient"}
        </button>
      </div>
  {addError && <p style={{ color: "crimson" }}>{addError}</p>}
      {recipe.instructions && (
        <>
          <h2 style={{ fontSize: 28, marginBottom: 10 }}>Instructions</h2>
          <p style={{ fontSize: 20 }}>{recipe.instructions}</p>
        </>
      )}
      {recipe.servings && (
        <p style={{ fontSize: 18, marginTop: 16 }}>Servings: {recipe.servings}</p>
      )}
    </div>
  );
}

export default RecipeDetail;
