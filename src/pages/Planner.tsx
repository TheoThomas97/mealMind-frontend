import { useCreateMealPlanMutation, useGetMealPlansQuery } from "../utils/api";

export default function Planner() {
  const { data } = useGetMealPlansQuery();
  const [createPlan] = useCreateMealPlanMutation();

  return (
    <div style={{ padding: 16 }}>
      <h1>Meal Planner</h1>
      <button
        onClick={() =>
          createPlan({ title: "This Week", start_date: "2025-09-01", end_date: "2025-09-07" })
        }
      >
        Create Sample Plan
      </button>
      <ul>
        {(data?.results ?? data ?? []).map((p: any) => (
          <li key={p.id}>
            {p.title} ({p.start_date} → {p.end_date})
          </li>
        ))}
      </ul>
    </div>
  );
}
