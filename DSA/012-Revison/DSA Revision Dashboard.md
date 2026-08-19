<style>
.task-list-item.is-checked,
.task-list-item.is-checked .task-list-item-text,
.task-list-item.is-checked a,
.task-list-item:has(input[type="checkbox"]:checked),
.task-list-item:has(input[type="checkbox"]:checked) .task-list-item-text,
.task-list-item:has(input[type="checkbox"]:checked) a,
li[data-task-status="x"],
li[data-task-status="x"] .task-list-item-text,
li[data-task-status="x"] a,
.tasks-list-container li[data-task-status="x"],
.tasks-list-container li[data-task-status="x"] .task-list-item-text,
.tasks-list-container li[data-task-status="x"] a,
.tasks-list-container li.is-checked .task-list-item-text,
.tasks-list-container li.is-checked a {
    text-decoration: line-through !important;
    -webkit-text-decoration-line: line-through !important;
    opacity: 0.65;
}
</style>

<div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(236, 72, 153, 0.15) 100%); border-radius: 12px; padding: 20px 24px; margin-bottom: 20px; border: 1px solid rgba(168, 85, 247, 0.3);">
  <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
    <div>
      <h1 style="margin: 0; font-size: 1.8em; border: none; background: linear-gradient(90deg, #818cf8, #c084fc, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🧠 DSA Revision</h1>
      <p style="margin: 6px 0 0 0; font-size: 1.05em; font-style: italic; color: var(--text-normal); opacity: 0.95;">🔥 <em>"You do not need to be great to start, but you must start to be great!"</em></p>
    </div>
  </div>
</div>

---

> [!danger]+ 🔴 Due / Completed Today
> ```tasks
> #dsa-revision
> (due today) OR (done today)
> hide toolbar
> hide postpone button
> hide edit button
> hide backlinks
> hide done date
> ```

> [!warning]+ ⚠️ Overdue Tasks
> ```tasks
> #dsa-revision
> due before today
> sort by due asc
> hide toolbar
> hide postpone button
> hide edit button
> hide backlinks
> hide done date
> ```

> [!info]+ 🟡 Upcoming Revision (Next 7 Days)
> ```tasks
> #dsa-revision
> due after today
> due before in 8 days
> sort by due asc
> hide toolbar
> hide postpone button
> hide edit button
> hide backlinks
> hide done date
> ```

> [!example]+ 📅 Complete Revision Timeline
> ```tasks
> #dsa-revision
> due after today
> sort by due asc
> group by due
> hide toolbar
> hide postpone button
> hide edit button
> hide backlinks
> hide done date
> ```

---

<div style="background: var(--background-secondary); border-radius: 10px; padding: 16px 20px; border-left: 4px solid var(--interactive-accent); margin-top: 20px;">
  <h4 style="margin: 0 0 10px 0; color: var(--text-normal);">🎯 Spaced Repetition Protocol</h4>
  <div style="display: flex; gap: 10px; flex-wrap: wrap; text-align: center;">
    <div style="flex: 1; min-width: 100px; background: var(--background-primary); padding: 10px; border-radius: 8px; border: 1px solid var(--background-modifier-border);">
      <strong style="color: #ef4444;">Day 1</strong><br><span style="font-size: 0.8em; opacity: 0.8;">24h Recall</span>
    </div>
    <div style="flex: 1; min-width: 100px; background: var(--background-primary); padding: 10px; border-radius: 8px; border: 1px solid var(--background-modifier-border);">
      <strong style="color: #f97316;">Day 4</strong><br><span style="font-size: 0.8em; opacity: 0.8;">Short-term</span>
    </div>
    <div style="flex: 1; min-width: 100px; background: var(--background-primary); padding: 10px; border-radius: 8px; border: 1px solid var(--background-modifier-border);">
      <strong style="color: #eab308;">Day 7</strong><br><span style="font-size: 0.8em; opacity: 0.8;">Weekly Sync</span>
    </div>
    <div style="flex: 1; min-width: 100px; background: var(--background-primary); padding: 10px; border-radius: 8px; border: 1px solid var(--background-modifier-border);">
      <strong style="color: #3b82f6;">Day 14</strong><br><span style="font-size: 0.8em; opacity: 0.8;">Mid-term</span>
    </div>
    <div style="flex: 1; min-width: 100px; background: var(--background-primary); padding: 10px; border-radius: 8px; border: 1px solid var(--background-modifier-border);">
      <strong style="color: #22c55e;">Day 30</strong><br><span style="font-size: 0.8em; opacity: 0.8;">Mastery</span>
    </div>
  </div>
</div>
