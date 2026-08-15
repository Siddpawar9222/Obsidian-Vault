<%*
// 1. Get current note title & prompt for Problem Name
const currentNoteTitle = tp.file.title;
const problemName = await tp.system.prompt("Problem name:");
if (!problemName || !problemName.trim()) {
    new Notice("Revision template cancelled: No problem name entered.");
    return;
}
const cleanName = problemName.trim();

// 2. Calculate 1-4-7-14-30 Day Spaced Repetition Offsets
const day1 = tp.date.now("YYYY-MM-DD", 1);
const day4 = tp.date.now("YYYY-MM-DD", 4);
const day7 = tp.date.now("YYYY-MM-DD", 7);
const day14 = tp.date.now("YYYY-MM-DD", 14);
const day30 = tp.date.now("YYYY-MM-DD", 30);

// 3. Format tasks with link to original problem note
const taskBlock = `
### [[${currentNoteTitle}]] — ${cleanName}

- [ ] Day 1 — Revise [[${currentNoteTitle}|${cleanName}]] #dsa-revision 📅 ${day1}
- [ ] Day 4 — Revise [[${currentNoteTitle}|${cleanName}]] #dsa-revision 📅 ${day4}
- [ ] Day 7 — Revise [[${currentNoteTitle}|${cleanName}]] #dsa-revision 📅 ${day7}
- [ ] Day 14 — Revise [[${currentNoteTitle}|${cleanName}]] #dsa-revision 📅 ${day14}
- [ ] Day 30 — Revise [[${currentNoteTitle}|${cleanName}]] #dsa-revision 📅 ${day30}
`;

// 4. Append directly to Revision/DSA Revision Log.md
const logFilePath = "Revision/DSA Revision Log.md";
let logFile = app.vault.getAbstractFileByPath(logFilePath);

if (!logFile) {
    await app.vault.create(logFilePath, "# 📝 DSA Revision Log\n\nCentral log for all DSA spaced repetition tasks.\n");
    logFile = app.vault.getAbstractFileByPath(logFilePath);
}

const existingLogContent = await app.vault.read(logFile);
if (existingLogContent.includes(`[[${currentNoteTitle}|${cleanName}]]`) || existingLogContent.includes(`${cleanName} #dsa-revision`)) {
    new Notice(`Revision schedule already exists for "${cleanName}".`);
} else {
    await app.vault.modify(logFile, existingLogContent + taskBlock);
    new Notice(`Added revision schedule for "${cleanName}" linked to [[${currentNoteTitle}]].`);
}
_%>
