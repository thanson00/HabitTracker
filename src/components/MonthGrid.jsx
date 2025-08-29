// src/components/MonthGrid.jsx
import { getMonthDays, toYMD, isWeekday, isWeekend } from "../lib/date";

export default function MonthGrid({
  year,
  monthIndex, // 0-11
  habits,
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

  const habitApplies = (habit, date) => {
    if (habit.schedule === "daily") return true;
    if (habit.schedule === "weekday") return isWeekday(date);
    if (habit.schedule === "weekend") return isWeekend(date);
    return true;
  };

  // Calculate column template for consistent grid alignment
  const DATE_W = 120, NOTES_W = 140, GOAL_W = 96;
  const goals = [...habits.build, ...habits.break, ...habits.track];
  const colTemplate = `${DATE_W}px ${NOTES_W}px repeat(${goals.length}, ${GOAL_W}px)`;

  return (
    <div className="month-grid">
      {/* Category Headers Row */}
      <div className="header" style={{ gridTemplateColumns: colTemplate }}>
        <div className="cell date-col head">Date</div>
        <div className="cell notes-col head">Notes</div>
        {habits.build.map((h) => (
          <div key={h.id} className="cell goal-head" title={h.title}>
            <div className="goal-chip" style={{ background: h.categoryColor }} />
            <div className="goal-title">{h.title}</div>
          </div>
        ))}
        {habits.break.map((h) => (
          <div key={h.id} className="cell goal-head" title={h.title}>
            <div className="goal-chip" style={{ background: h.categoryColor }} />
            <div className="goal-title">{h.title}</div>
          </div>
        ))}
        {habits.track.map((h) => (
          <div key={h.id} className="cell goal-head" title={h.title}>
            <div className="goal-chip" style={{ background: h.categoryColor }} />
            <div className="goal-title">{h.title}</div>
          </div>
        ))}
      </div>

      {/* Data Rows */}
      {orderedDays.map((date) => {
        const ymd = toYMD(date);
        return (
          <div className="row" key={ymd} style={{ gridTemplateColumns: colTemplate }}>
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

            {/* Notes Column */}
            <div className="cell notes-col">
              {notes[ymd] && (
                <div className="note-preview" title={notes[ymd]}>
                  {notes[ymd].length > 20 ? `${notes[ymd].substring(0, 20)}...` : notes[ymd]}
                </div>
              )}
            </div>

            {/* Build Habits */}
            {habits.build.map((h) => {
              const applies = habitApplies(h, date);
              const key = `${ymd}:${h.id}`;
              const checked = !!checks[key];

              return (
                <button
                  key={h.id + ymd}
                  className={`cell tick build ${applies ? "" : "disabled"} ${checked ? "on" : ""}`}
                  style={{ '--cell-accent': h.categoryColor }}
                  onClick={() => applies && onToggle(ymd, h.id, !checked)}
                  aria-pressed={checked}
                >
                  {applies ? (checked ? "✓" : "") : "—"}
                </button>
              );
            })}

            {/* Break Habits */}
            {habits.break.map((h) => {
              const applies = habitApplies(h, date);
              const key = `${ymd}:${h.id}`;
              const checked = !!checks[key];

              return (
                <button
                  key={h.id + ymd}
                  className={`cell tick break ${applies ? "" : "disabled"} ${checked ? "on" : ""}`}
                  style={{ '--cell-accent': h.categoryColor }}
                  onClick={() => applies && onToggle(ymd, h.id, !checked)}
                  aria-pressed={checked}
                >
                  {applies ? (checked ? "✓" : "") : "—"}
                </button>
              );
            })}

            {/* Track Metrics */}
            {habits.track.map((h) => {
              const applies = habitApplies(h, date);
              const key = `${ymd}:${h.id}`;
              const value = checks[key] || "";

              return (
                <div
                  key={h.id + ymd}
                  className={`cell track-cell ${applies ? "" : "disabled"}`}
                  style={{ '--cell-accent': h.categoryColor }}
                >
                  {applies ? (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => onToggle(ymd, h.id, e.target.value)}
                      placeholder="..."
                      className="track-input"
                    />
                  ) : (
                    <span className="disabled-text">—</span>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}