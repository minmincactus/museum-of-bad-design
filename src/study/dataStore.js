const KEY = "museum-study-v2";

export function loadStudy() {
  try { return JSON.parse(localStorage.getItem(KEY)) || null; }
  catch { return null; }
}

export function saveStudy(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function newSession(meta = {}) {
  const session = {
    meta: { participant: meta.participant || "" },
    pre: {},          // keyed answers
    tasks: [],        // {taskId, targetId, chosenId, correct, ms}
    post: {},         // keyed answers
    createdAt: Date.now()
  };
  saveStudy(session);
  return session;
}

export function setParticipant(name) {
  const s = loadStudy() || newSession();
  s.meta.participant = name || "";
  saveStudy(s);
}

export function recordPreAnswers(obj) {
  const s = loadStudy() || newSession();
  s.pre = { ...s.pre, ...obj };
  saveStudy(s);
}

export function recordTaskResult({ taskId, targetId, chosenId, ms }) {
  const s = loadStudy() || newSession();
  s.tasks.push({
    taskId, targetId, chosenId,
    correct: String(chosenId) === String(targetId),
    ms
  });
  saveStudy(s);
}

export function recordPostAnswers(obj) {
  const s = loadStudy() || newSession();
  s.post = { ...s.post, ...obj };
  saveStudy(s);
}

export function clearSession() {
  localStorage.removeItem(KEY);
}

// CSV: one row per task, includes all pre/post fields on each row for easy analysis
export function exportCSV() {
  const s = loadStudy();
  if (!s) return "";
  const pre = s.pre || {};
  const post = s.post || {};
  const cols = [
    "createdAt","participant",
    // pre keys
    "pre_confidence","pre_familiarity","pre_importance","pre_ease","pre_empathy",
    // task
    "taskId","targetId","chosenId","correct","ms",
    // post keys
    "post_confidence","post_importance","post_empathy","post_motivation","post_difficulty"
  ];
  const header = cols.join(",");
  const rows = [header];

  const base = {
    createdAt: new Date(s.createdAt).toISOString(),
    participant: (s.meta?.participant || "").replaceAll(",", " "),
    pre_confidence: pre.pre_confidence ?? "",
    pre_familiarity: pre.pre_familiarity ?? "",
    pre_importance: pre.pre_importance ?? "",
    pre_ease: pre.pre_ease ?? "",
    pre_empathy: pre.pre_empathy ?? "",
    post_confidence: post.post_confidence ?? "",
    post_importance: post.post_importance ?? "",
    post_empathy: post.post_empathy ?? "",
    post_motivation: post.post_motivation ?? "",
    post_difficulty: post.post_difficulty ?? ""
  };

  for (const t of s.tasks) {
    const row = {
      ...base,
      taskId: t.taskId,
      targetId: t.targetId,
      chosenId: t.chosenId ?? "",
      correct: t.correct ? 1 : 0,
      ms: t.ms ?? ""
    };
    rows.push(cols.map(k => row[k]).join(","));
  }
  return rows.join("\n");
}
