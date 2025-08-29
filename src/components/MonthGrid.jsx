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

  // Calculate column counts for grid template
  const notesCols = 1;
  const buildCols = habits.build.length;
  const breakCols = habits.break.length;
  const trackCols = habits.track.length;
  const totalCols = 1 + notesCols + buildCols + breakCols + trackCols;

  return (
    <div className="month-grid">
      {/* Category Headers Row */}
      <div className="category-headers">
        <div className="cell date-col head">Date</div>
        <div className="cell notes-col head">Notes</div>
        <div className="cell category-header build" style={{ gridColumn: `span ${buildCols}` }}>
          Build
        </div>
        <div className="cell spacer"></div>
        <div className="cell category-header break" style={{ gridColumn: `span ${breakCols}` }}>
          Break
        </div>
        <div className="cell spacer"></div>
        <div className="cell category-header track" style={{ gridColumn: `span ${trackCols}` }}>
          Track
        </div>
      </div>

      {/* Habit Headers Row */}
      <div className="habit-headers">
        <div className="cell date-col head"></div>
        <div className="cell notes-col head"></div>
        {habits.build.map((h) => (
          <div key={h.id} className="cell habit-head build" title={h.title}>
            <div className="habit-chip" style={{ background: h.categoryColor }} />
            <div className="habit-title">{h.title}</div>
            {h.value && <div className="habit-sub">{h.value}{h.unit ? ` ${h.unit}` : ""}</div>}
          </div>
        ))}
        <div className="cell spacer"></div>
        {habits.break.map((h) => (
          <div key={h.id} className="cell habit-head break" title={h.title}>
            <div className="habit-chip" style={{ background: h.categoryColor }} />
            <div className="habit-title">{h.title}</div>
            {h.value && <div className="habit-sub">{h.value}{h.unit ? ` ${h.unit}` : ""}</div>}
          </div>
        ))}
        <div className="cell spacer"></div>
        {habits.track.map((h) => (
          <div key={h.id} className="cell habit-head track" title={h.title}>
            <div className="habit-chip" style={{ background: h.categoryColor }} />
            <div className="habit-title">{h.title}</div>
            {h.unit && <div className="habit-sub">{h.unit}</div>}
          </div>
        ))}
      </div>

      {/* Data Rows */}
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

            <div className="cell spacer"></div>

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

            <div className="cell spacer"></div>

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