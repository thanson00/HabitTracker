// src/components/MonthGrid.jsx
import { getMonthDays, toYMD, isWeekday, isWeekend } from "../lib/date";

export default function MonthGrid({
  year,
  monthIndex, // 0-11
  goals,
  checks,
  onToggle,
  onOpenDay,
  notes = {},
  weekStart = "monday",
}) {
  const days = getMonthDays(year, monthIndex);

  const orderedDays = (() => {
    // purely affects header labels; grid stays chronological
    return days;
  })();

  const goalApplies = (goal, date) => {
    if (goal.schedule === "daily") return true;
    if (goal.schedule === "weekday") return isWeekday(date);
    if (goal.schedule === "weekend") return isWeekend(date);
    return true;
  };

  return (
    <div className="month-grid">
      <div className="header sticky">
        <div className="cell date-col head">Date</div>
        {goals.map((g) => (
          <div key={g.id} className="cell goal-head" title={g.title}>
            <div className="goal-chip" style={{ background: g.categoryColor }} />
            <div className="goal-title">{g.title}</div>
            {g.value && <div className="goal-sub">{g.value}{g.unit ? ` ${g.unit}` : ""}</div>}
          </div>
        ))}
        <div className="cell notes-col head">Notes</div>
      </div>

      {orderedDays.map((date) => {
        const ymd = toYMD(date);
        return (
          <div className="row" key={ymd}>
            <div 
              className="cell date-col" 
              onClick={() => onOpenDay?.(ymd)}
              style={{ cursor: onOpenDay ? "pointer" : "default" }}
            >
              <div className="date-info">
                <span className="date-num">{date.getDate()}</span>
                <span className="date-wd">
                  {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][date.getDay()]}
                </span>
              </div>
            </div>

            {goals.map((g) => {
              const applies = goalApplies(g, date);
              const key = `${ymd}:${g.id}`;
              const checked = !!checks[key];

              return (
                <button
                  key={g.id + ymd}
                  className={`cell tick ${applies ? "" : "disabled"} ${checked ? "on" : ""}`}
                  style={{ '--cell-accent': g.categoryColor }}
                  onClick={() => applies && onToggle(ymd, g.id, !checked)}
                  aria-pressed={checked}
                >
                  {applies ? (checked ? "✓" : "") : "—"}
                </button>
              );
            })}
            
            <div className="cell notes-col">
              {notes[ymd] && (
                <div className="note-preview" title={notes[ymd]}>
                  {notes[ymd].length > 20 ? `${notes[ymd].substring(0, 20)}...` : notes[ymd]}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}