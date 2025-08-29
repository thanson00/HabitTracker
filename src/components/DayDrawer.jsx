import { useEffect } from "react";

export default function DayDrawer({
  open,
  dateYMD,
  habits,
  applies,
  checked,
  onToggle,
  note,
  onChangeNote,
  onClose,
}) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, onClose]);

  if (!open || !dateYMD) return null;

  const date = new Date(dateYMD);
  const weekday = date.toLocaleDateString(undefined, { weekday: "long" });
  const formattedDate = date.toLocaleDateString(undefined, { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });

  return (
    <div className="dd-overlay" onClick={onClose}>
      <div className="dd-panel" onClick={(e) => e.stopPropagation()}>
        <div className="dd-header">
          {formattedDate} • {weekday}
        </div>

        <div className="dd-section">
          <h3>Build Habits</h3>
          {habits.build.map((habit) => {
            const habitApplies = applies(habit.id);
            const isChecked = checked(habit.id);

            return (
              <div key={habit.id} className="dd-goal">
                <input
                  type="checkbox"
                  id={`habit-${habit.id}`}
                  checked={isChecked}
                  disabled={!habitApplies}
                  onChange={(e) => onToggle(habit.id, e.target.checked)}
                />
                <label 
                  htmlFor={`habit-${habit.id}`}
                  style={{ 
                    color: habitApplies ? "inherit" : "#9ca3af",
                    cursor: habitApplies ? "pointer" : "default"
                  }}
                >
                  <span 
                    className="habit-chip" 
                    style={{ background: habit.categoryColor }}
                  />
                  {habit.title}
                  {habit.value && (
                    <span className="habit-sub">
                      {" "}({habit.value}{habit.unit ? ` ${habit.unit}` : ""})
                    </span>
                  )}
                  {!habitApplies && " — Not applicable"}
                </label>
              </div>
            );
          })}
        </div>

        <div className="dd-section">
          <h3>Break Habits</h3>
          {habits.break.map((habit) => {
            const habitApplies = applies(habit.id);
            const isChecked = checked(habit.id);

            return (
              <div key={habit.id} className="dd-goal">
                <input
                  type="checkbox"
                  id={`habit-${habit.id}`}
                  checked={isChecked}
                  disabled={!habitApplies}
                  onChange={(e) => onToggle(habit.id, e.target.checked)}
                />
                <label 
                  htmlFor={`habit-${habit.id}`}
                  style={{ 
                    color: habitApplies ? "inherit" : "#9ca3af",
                    cursor: habitApplies ? "pointer" : "default"
                  }}
                >
                  <span 
                    className="habit-chip" 
                    style={{ background: habit.categoryColor }}
                  />
                  {habit.title}
                  {habit.value && (
                    <span className="habit-sub">
                      {" "}({habit.value}{habit.unit ? ` ${habit.unit}` : ""})
                    </span>
                  )}
                  {!habitApplies && " — Not applicable"}
                </label>
              </div>
            );
          })}
        </div>

        <div className="dd-section">
          <h3>Track Metrics</h3>
          {habits.track.map((habit) => {
            const habitApplies = applies(habit.id);
            const value = checked(habit.id) || "";

            return (
              <div key={habit.id} className="dd-goal">
                <label 
                  style={{ 
                    color: habitApplies ? "inherit" : "#9ca3af",
                    cursor: habitApplies ? "pointer" : "default"
                  }}
                >
                  <span 
                    className="habit-chip" 
                    style={{ background: habit.categoryColor }}
                  />
                  {habit.title}
                  {habit.unit && (
                    <span className="habit-sub">
                      {" "}({habit.unit})
                    </span>
                  )}
                  {habitApplies && (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => onToggle(habit.id, e.target.value)}
                      placeholder="Enter value..."
                      style={{
                        marginLeft: "8px",
                        padding: "4px 8px",
                        border: "1px solid var(--border)",
                        borderRadius: "0px",
                        background: "transparent",
                        color: "var(--text)",
                        fontFamily: "var(--font-family)",
                        fontSize: "0.9rem"
                      }}
                    />
                  )}
                  {!habitApplies && " — Not applicable"}
                </label>
              </div>
            );
          })}
        </div>

        <div className="dd-section">
          <h3>Daily Note</h3>
          <textarea
            value={note}
            onChange={(e) => onChangeNote(e.target.value)}
            placeholder="ADD A NOTE FOR THIS DAY..."
            rows={4}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid var(--border)",
              borderRadius: "0px",
              resize: "vertical",
              fontFamily: "var(--font-family)",
              background: "transparent",
              color: "var(--text)"
            }}
          />
        </div>

        <div className="dd-actions">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
