import { useEffect } from "react";

export default function DayDrawer({
  open,
  dateYMD,
  goals,
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
          <h3>Goals</h3>
          {goals.map((goal) => {
            const goalApplies = applies(goal.id);
            const isChecked = checked(goal.id);

            return (
              <div key={goal.id} className="dd-goal">
                <input
                  type="checkbox"
                  id={`goal-${goal.id}`}
                  checked={isChecked}
                  disabled={!goalApplies}
                  onChange={(e) => onToggle(goal.id, e.target.checked)}
                />
                <label 
                  htmlFor={`goal-${goal.id}`}
                  style={{ 
                    color: goalApplies ? "inherit" : "#9ca3af",
                    cursor: goalApplies ? "pointer" : "default"
                  }}
                >
                  <span 
                    className="goal-chip" 
                    style={{ background: goal.categoryColor }}
                  />
                  {goal.title}
                  {goal.value && (
                    <span className="goal-sub">
                      {" "}({goal.value}{goal.unit ? ` ${goal.unit}` : ""})
                    </span>
                  )}
                  {!goalApplies && " — Not applicable"}
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
