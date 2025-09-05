import { useState } from "react";

const slots = ["Breakfast", "Lunch", "Dinner"];
const demoRecipes = ["Cornmeal Porridge", "Ackee and Saltfish", "Brown Stew Chicken", "Pasta Pomodoro"];

export default function Planner() {
  const [plan, setPlan] = useState<{ date: string; slot: string; recipe: string }[]>([]);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState(slots[0]);
  const [recipe, setRecipe] = useState(demoRecipes[0]);

  return (
    <div style={{ padding: 16 }}>
      <h1>Meal Planner</h1>
      <div style={{ marginBottom: 16 }}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <select value={slot} onChange={e => setSlot(e.target.value)}>
          {slots.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={recipe} onChange={e => setRecipe(e.target.value)}>
          {demoRecipes.map(r => <option key={r}>{r}</option>)}
        </select>
        <button onClick={() => {
          if (date && slot && recipe) {
            setPlan([...plan, { date, slot, recipe }]);
          }
        }}>Add to Plan</button>
      </div>
      <ul>
        {plan.map((p, idx) => (
          <li key={idx}>{p.date} - {p.slot}: {p.recipe}</li>
        ))}
      </ul>
    </div>
  );
}
