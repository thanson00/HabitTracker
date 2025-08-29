import { useMemo, useState } from "react";
import MonthGrid from "./components/MonthGrid";
import DayDrawer from "./components/DayDrawer";
import { toYMD, isWeekday, isWeekend } from "./lib/date";

const CATS = {
  fitness: "#22C55E",
  health: "#06B6D4",
  nutrition: "#F59E0B",
  mindset: "#A78BFA",
  sleep: "#EF4444",
};

const seedGoals = [
  { id: "g1", title: "Exercise", value: 30, unit: "min", schedule: "daily",   categoryColor: CATS.fitness },
  { id: "g2", title: "Steps",    value: 8000, unit: "steps", schedule: "daily",  categoryColor: CATS.health },
  { id: "g3", title: "Read",     value: 15, unit: "min", schedule: "weekday", categoryColor: CATS.mindset },
  { id: "g4", title: "Bed by 10:30", schedule: "daily", categoryColor: CATS.sleep },
];

export default function App() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [goals] = useState(seedGoals);

  // checks stored in-memory as { "YYYY-MM-DD:goalId": true }
  const [checks, setChecks] = useState(() => ({}));
  
  // DayDrawer state
  const [openDay, setOpenDay] = useState(null); // string | null (YYYY-MM-DD)
  const [notes, setNotes] = useState({});       // { [dateYMD]: string }

  const onToggle = (ymd, goalId, next) => {
    const key = `${ymd}:${goalId}`;
    setChecks((prev) => {
      const copy = { ...prev };
      if (next) copy[key] = true;
      else delete copy[key];
      return copy;
    });
  };

  // Helper functions for DayDrawer
  const getNote = (ymd) => notes[ymd] ?? '';
  const setNote = (ymd, text) => {
    setNotes(prev => ({ ...prev, [ymd]: text }));
  };

  const applies = (ymd, goal) => {
    const date = new Date(ymd);
    if (goal.schedule === "daily") return true;
    if (goal.schedule === "weekday") return isWeekday(date);
    if (goal.schedule === "weekend") return isWeekend(date);
    return true;
  };

  const checked = (ymd, goalId) => {
    return !!checks[`${ymd}:${goalId}`];
  };

  const monthLabel = useMemo(() => {
    return new Date(year, monthIndex, 1).toLocaleString(undefined, { month: "long", year: "numeric" });
  }, [year, monthIndex]);

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontFamily: "var(--font-family)", fontSize: "2rem", fontWeight: "600", margin: 0, textTransform: "uppercase" }}>Habit Tracker</h1>
        <button 
          onClick={() => { const d=new Date(); setYear(d.getFullYear()); setMonthIndex(d.getMonth()); }}
          style={{ fontSize: "0.9rem", padding: "6px 10px" }}
        >
          Today
        </button>
      </header>

      <div className="month-nav">
        <div className="month-nav-buttons">
          <button 
            onClick={() => setMonthIndex((m) => (m === 0 ? (setYear(y=>y-1), 11) : m-1))}
            style={{ fontSize: "1.2rem", padding: "8px 12px" }}
          >
            ◀
          </button>
          <button 
            onClick={() => setMonthIndex((m) => (m === 11 ? (setYear(y=>y+1), 0) : m+1))}
            style={{ fontSize: "1.2rem", padding: "8px 12px" }}
          >
            ▶
          </button>
        </div>
        
        <div className="month-title">
          <h2>{monthLabel}</h2>
        </div>
      </div>

      <MonthGrid
        year={year}
        monthIndex={monthIndex}
        goals={goals}
        checks={checks}
        onToggle={onToggle}
        onOpenDay={setOpenDay}
        notes={notes}
        weekStart="monday"
      />

      <DayDrawer
        open={!!openDay}
        dateYMD={openDay}
        goals={goals}
        applies={(goalId) => openDay ? applies(openDay, goals.find(g => g.id === goalId)) : false}
        checked={(goalId) => openDay ? checked(openDay, goalId) : false}
        onToggle={(goalId, next) => {
          if (openDay) {
            onToggle(openDay, goalId, next);
          }
        }}
        note={openDay ? getNote(openDay) : ''}
        onChangeNote={(text) => {
          if (openDay) setNote(openDay, text);
        }}
        onClose={() => setOpenDay(null)}
      />

      <footer style={{ marginTop: 20, color:"var(--text-muted)", fontFamily: "var(--font-family)", fontSize: "0.9rem", textAlign: "center", textTransform: "uppercase" }}>
        Personal habit tracking journal
      </footer>
    </div>
  );
}