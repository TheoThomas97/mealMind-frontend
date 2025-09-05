import React, { useState } from "react";
import {
  useGetShoppingListsQuery,
  useCreateShoppingListMutation,
  useUpdateShoppingListMutation,
  useDeleteShoppingListMutation,
  useGetShoppingItemsQuery,
  useCreateShoppingItemMutation,
  useDeleteShoppingItemMutation,
  useCreateIngredientMutation,
  useGetIngredientsQuery
} from "../utils/api";

function ShoppingListItem({ list, refetch, onSelect, selected }: { list: any; refetch: () => void; onSelect: (id: number) => void; selected: boolean }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);
  const [updateList, { isLoading: isUpdating }] = useUpdateShoppingListMutation();
  const [deleteList, { isLoading: isDeleting }] = useDeleteShoppingListMutation();
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpdate = async () => {
    setErrorMsg("");
    if (!editTitle.trim()) return;
    try {
      await updateList({ id: list.id, patch: { title: editTitle } }).unwrap();
      setEditing(false);
      refetch();
    } catch (err: any) {
      setErrorMsg(err?.data?.detail || "Failed to update list.");
    }
  };

  const handleDelete = async () => {
    setErrorMsg("");
    try {
      await deleteList(list.id).unwrap();
      refetch();
  onSelect(-1); // Reset selected list after deletion (use -1 for 'no selection')
    } catch (err: any) {
      setErrorMsg(err?.data?.detail || "Failed to delete list.");
    }
  };

  return (
    <li style={{
      marginBottom: 12,
      background: selected ? "#f7f7fa" : "#fff",
      border: selected ? "2px solid #646cff" : "1px solid #e0e0e0",
      borderRadius: 10,
      padding: "12px 16px",
      boxShadow: selected ? "0 2px 8px #646cff22" : "0 1px 4px #e0e0e022",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <span style={{ cursor: "pointer", fontWeight: selected ? "bold" : 500, fontSize: 18 }} onClick={() => onSelect(list.id)}>
        {editing ? (
          <>
            <input
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              disabled={isUpdating}
              style={{ marginRight: 8, padding: 6, borderRadius: 6, border: "1px solid #ccc", fontSize: 16 }}
            />
            <button onClick={handleUpdate} disabled={isUpdating || !editTitle.trim()} style={{ padding: "6px 16px", borderRadius: 6, background: "#646cff", color: "#fff", border: "none" }}>
              Save
            </button>
            <button onClick={() => setEditing(false)} style={{ marginLeft: 4, padding: "6px 16px", borderRadius: 6, background: "#eee", color: "#222", border: "none" }}>
              Cancel
            </button>
          </>
        ) : (
          <>{list.title}</>
        )}
      </span>
      {!editing && (
        <span>
          <button onClick={() => setEditing(true)} style={{ marginLeft: 8, padding: "6px 16px", borderRadius: 6, background: "#eee", color: "#222", border: "none" }}>Edit</button>
          <button onClick={handleDelete} disabled={isDeleting} style={{ marginLeft: 4, padding: "6px 16px", borderRadius: 6, background: "#fff0f0", color: "crimson", border: "none" }}>Delete</button>
        </span>
      )}
      {errorMsg && <span style={{ color: "crimson", marginLeft: 8, fontSize: 15 }}>{errorMsg}</span>}
    </li>
  );
}

function ShoppingListItems({ shoppingListId }: { shoppingListId: number }) {
  const [deleteItem, { isLoading: isDeleting }] = useDeleteShoppingItemMutation();
  const { data, isLoading, error, refetch } = useGetShoppingItemsQuery(shoppingListId ? { shopping_list: shoppingListId } : undefined);
  // Removed localItems and initialItems logic
  const [createItem, { isLoading: isCreating }] = useCreateShoppingItemMutation();
  const [createIngredient] = useCreateIngredientMutation();
  const { data: allIngredients } = useGetIngredientsQuery();
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Reset add item form when switching lists
  React.useEffect(() => {
    setItemName("");
    setQuantity("");
    setUnit("");
    setErrorMsg("");
  }, [shoppingListId]);

  if (!shoppingListId) return null;

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!itemName.trim()) return;
    let ingredientId: number | undefined;
    try {
      // Only send the required 'name' field
      const result = await createIngredient({ name: itemName.trim() }).unwrap();
      ingredientId = result.id;
    } catch (err: any) {
      setErrorMsg(err?.data?.name?.[0] || err?.data?.detail || "Failed to create ingredient. Are you logged in?");
      return;
    }
    if (typeof ingredientId !== "number") {
      setErrorMsg("Ingredient creation failed: no id returned.");
      return;
    }
    try {
      await createItem({ shopping_list: shoppingListId, ingredient: ingredientId, quantity: quantity ? Number(quantity) : undefined, unit: unit || undefined }).unwrap();
      setItemName("");
      setQuantity("");
      setUnit("");
      refetch();
    } catch (err: any) {
      setErrorMsg(err?.data?.detail || (err?.data?.ingredient?.[0] || "Failed to add item."));
    }
  };

  return (
    <div style={{ marginTop: 32, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #e0e0e044", padding: "24px 20px", maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
      <form onSubmit={handleAddItem} style={{ marginBottom: 18, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <input
          value={itemName}
          onChange={e => setItemName(e.target.value)}
          placeholder="Ingredient/Item"
          disabled={isCreating}
          style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc", fontSize: 16, minWidth: 120 }}
        />
        <input
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          placeholder="Quantity"
          disabled={isCreating}
          style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc", fontSize: 16, width: 80 }}
        />
        <input
          value={unit}
          onChange={e => setUnit(e.target.value)}
          placeholder="Unit (optional)"
          disabled={isCreating}
          style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc", fontSize: 16, width: 100 }}
        />
        <button type="submit" disabled={isCreating || !itemName.trim()} style={{ padding: "8px 20px", borderRadius: 8, background: "#646cff", color: "#fff", border: "none", fontWeight: "bold" }}>
          {isCreating ? "Adding..." : "Add Item"}
        </button>
      </form>
      {errorMsg && <p style={{ color: "crimson", marginBottom: 10, textAlign: "center" }}>{errorMsg}</p>}
      {isLoading ? (
        <p>Loading items…</p>
      ) : error ? (
        <p style={{ color: "crimson" }}>Error loading items.</p>
      ) : (
        <>
          <h2 style={{ fontSize: 24, marginBottom: 18, textAlign: "center" }}>Items</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {(Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [])
              .filter((item: any) => item.shopping_list === shoppingListId || !item.shopping_list)
              .map((item: any, idx: number) => {
                let ingredientName = "";
                if (item.ingredient_data && typeof item.ingredient_data === "object" && item.ingredient_data.name) {
                  ingredientName = item.ingredient_data.name;
                } else if (item.ingredient_data && typeof item.ingredient_data === "string") {
                  ingredientName = item.ingredient_data;
                } else if (item.ingredient?.name) {
                  ingredientName = item.ingredient.name;
                } else if (item.ingredient) {
                  let found;
                  if (Array.isArray(allIngredients?.results)) {
                    found = allIngredients.results.find((ing: any) => ing.id === item.ingredient);
                  } else if (Array.isArray(allIngredients)) {
                    found = allIngredients.find((ing: any) => ing.id === item.ingredient);
                  }
                  ingredientName = found?.name || "Unnamed Ingredient";
                } else {
                  ingredientName = "Unnamed Ingredient";
                }
                return (
                  <li key={item.id ?? idx} style={{ background: "#f7f7fa", borderRadius: 8, marginBottom: 8, padding: "10px 14px", fontSize: 17, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>{ingredientName || "Unnamed"} {item.quantity ? `(${item.quantity}${item.unit ? ` ${item.unit}` : ""})` : ""}</span>
                    <button
                      onClick={async () => {
                        if (isDeleting || !item.id) return;
                        // Ensure token is present before deleting
                        const token = localStorage.getItem("access");
                        if (!token) {
                          setErrorMsg("You must be logged in to delete items.");
                          return;
                        }
                        try {
                          await deleteItem(item.id).unwrap();
                          refetch();
                        } catch (err: any) {
                          setErrorMsg(err?.data?.detail || err?.error || "Failed to delete item.");
                        }
                      }}
                      style={{ marginLeft: 12, padding: "6px 16px", borderRadius: 8, background: "#646cff", color: "#fff", border: "none", fontWeight: "bold", cursor: isDeleting ? "not-allowed" : "pointer" }}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </li>
                );
              })}
          </ul>
        </>
      )}
    </div>
  );
}

export default function Shopping() {
  const { data, isLoading, error, refetch } = useGetShoppingListsQuery();
  const [createList, { isLoading: isCreating }] = useCreateShoppingListMutation();
  const [newTitle, setNewTitle] = useState("");
  const [newItems, setNewItems] = useState<{ ingredient_data: { name: string }; quantity?: string }[]>([]);
  // Removed unused newItemName and newItemQty state
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedList, setSelectedList] = useState<number>(-1);
  // Remove local state for newly created items; rely on API data

  // Removed unused handleAddNewItem

  const handleCreate = async () => {
    setErrorMsg("");
    if (!newTitle.trim()) return;
    try {
      const created = await createList({ title: newTitle, items: newItems }).unwrap();
      setNewTitle("");
      setNewItems([]);
      refetch();
      // Select the newly created list and let ShoppingListItems fetch its items
      if (created && created.id) {
        setSelectedList(created.id);
      } else if (created && created.results && created.results.length > 0) {
        setSelectedList(created.results[0].id);
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.detail || "Failed to create list.");
    }
  };

  return (
    <div style={{ padding: 32, maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", fontSize: 36, marginBottom: 24, color: "#646cff" }}>Shopping Lists</h1>
      <div style={{ marginBottom: 24, display: "flex", gap: 12, justifyContent: "center" }}>
        <input
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="List Title"
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 18, minWidth: 180, marginBottom: 8 }}
        />
        <button onClick={handleCreate} disabled={isCreating || !newTitle.trim()} style={{ padding: "10px 24px", borderRadius: 8, background: "#646cff", color: "#fff", border: "none", fontWeight: "bold" }}>
          {isCreating ? "Creating..." : "Add List"}
        </button>
      </div>
      {errorMsg && <p style={{ color: "crimson", textAlign: "center", marginBottom: 10 }}>{errorMsg}</p>}
      {isLoading ? (
        <p>Loading lists…</p>
      ) : error ? (
        <p style={{ color: "crimson" }}>Error loading lists.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, marginBottom: 0 }}>
          {(data?.results || data || []).map((list: any) => (
            <ShoppingListItem key={list.id} list={list} refetch={refetch} onSelect={setSelectedList} selected={selectedList === list.id} />
          ))}
        </ul>
      )}
      {/* Remount ShoppingListItems when switching lists to guarantee state isolation */}
      {selectedList !== -1 && (
        <ShoppingListItems key={selectedList} shoppingListId={selectedList} />
      )}
    </div>
  );
}