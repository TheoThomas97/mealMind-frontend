import { useCreateShoppingListMutation, useGetShoppingListsQuery } from "../utils/api";

export default function Shopping() {
  const { data } = useGetShoppingListsQuery();
  const [createList] = useCreateShoppingListMutation();

  return (
    <div style={{ padding: 16 }}>
      <h1>Shopping Lists</h1>
      <button onClick={() => createList({ title: "Groceries" })}>New List</button>
      <ul>
        {(data?.results ?? data ?? []).map((l: any) => (
          <li key={l.id}>{l.title}</li>
        ))}
      </ul>
    </div>
  );
}
