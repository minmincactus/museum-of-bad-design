// src/study/dataStore.js

export const KEY = "museum-study-v2";

/* ---------------- core session helpers ---------------- */
export function loadStudy() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

export function saveStudy(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function newSession(meta = {}) {
  const session = {
    meta: {
      participant: meta.participant || "",
      computingId: meta.computingId || "",
      orders: {},        // per-condition task index orders
      exhibitOrders: {}  // per-condition exhibit id orders
    },
    pre: {},             // legacy (unused now)
    tasks: [],           // {taskId, targetId, chosenId, correct, ms, cond}
    post: {},            // legacy (unused now)
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

/* optional helper if you ever want to update computingId separately */
export function setComputingId(id) {
  const s = loadStudy() || newSession();
  s.meta.computingId = id || "";
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
    existing.every((id) => exhibitIds.includes(id));

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
  if (!s || !s.tasks || s.tasks.length === 0) return "";

  // final columns in the CSV
  const cols = [
    "createdAt",
    "participant",
    "computingId",
    "condition",
    "taskId",
    "targetId",
    "chosenId",
    "correct",
    "ms"
  ];

  const header = cols.join(",");
  const rows = [header];

  const base = {
    createdAt: new Date(s.createdAt).toISOString(),
    participant: (s.meta?.participant || "").replaceAll(",", " "),
    computingId: (s.meta?.computingId || "").replaceAll(",", " ")
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
    rows.push(cols.map((k) => row[k]).join(","));
  }

  return rows.join("\n");
}
