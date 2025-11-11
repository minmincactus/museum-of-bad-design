// src/study/dataStore.js

export const KEY = "museum-study-v2";

/* ---------------- core session helpers ---------------- */
export function loadStudy() {
  try { return JSON.parse(localStorage.getItem(KEY)) || null; }
  catch { return null; }
}

export function saveStudy(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function newSession(meta = {}) {
  const session = {
    meta: {
      participant: meta.participant || "",
      orders: {},         // per-condition task index orders
      exhibitOrders: {}   // per-condition exhibit id orders
    },
    pre: {},              // keyed answers
    tasks: [],            // {taskId, targetId, chosenId, correct, ms, cond}
    post: {},             // keyed answers
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

export function recordTaskResult({ taskId, targetId, chosenId, ms, condition }) {
  const s = loadStudy() || newSession();
  s.tasks.push({
    taskId,
    targetId,
    chosenId,
    correct: String(chosenId) === String(targetId),
    ms,
    cond: condition || s.meta?.condition || ""
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

/* ---------------- randomization helpers ---------------- */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Stable randomized TASK index order per condition ("bad"|"good") */
export function getOrCreateOrder(condition, taskCount) {
  const s = loadStudy() || newSession();
  if (!condition) return [...Array(taskCount).keys()];
  if (!s.meta.orders) s.meta.orders = {};
  const existing = s.meta.orders[condition];

  if (!Array.isArray(existing) || existing.length !== taskCount) {
    const order = shuffle([...Array(taskCount).keys()]);
    s.meta.orders[condition] = order;
    saveStudy(s);
    return order;
  }
  return existing;
}

/** Stable randomized EXHIBIT-ID order per condition ("bad"|"good") */
export function getOrCreateExhibitOrder(condition, exhibitIds) {
  const s = loadStudy() || newSession();
  if (!condition) return [...exhibitIds];

  if (!s.meta.exhibitOrders) s.meta.exhibitOrders = {};
  const existing = s.meta.exhibitOrders[condition];

  const sameSet =
    Array.isArray(existing) &&
    existing.length === exhibitIds.length &&
    existing.every(id => exhibitIds.includes(id));

  if (!sameSet) {
    const order = shuffle([...exhibitIds]);
    s.meta.exhibitOrders[condition] = order;
    saveStudy(s);
    return order;
  }
  return existing;
}

/* ---------------- CSV export ---------------- */
export function exportCSV() {
  const s = loadStudy();
  if (!s) return "";
  const pre = s.pre || {};
  const post = s.post || {};
  const cols = [
    "createdAt","participant",
    "pre_confidence","pre_familiarity","pre_importance","pre_ease","pre_empathy",
    "condition","taskId","targetId","chosenId","correct","ms",
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
      condition: t.cond || "",
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
