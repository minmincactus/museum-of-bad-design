// src/study/StudyHUD.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TASKS } from "./tasks";
import {
  newSession,
  loadStudy,
  recordTaskResult,
  exportCSV,
  clearSession,
  getOrCreateOrder
} from "./dataStore";

export default function StudyHUD({ autoStart = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  // derive experimental condition from route
  const condition =
    location.pathname === "/good" ? "good" :
    location.pathname === "/bad"  ? "bad"  : null;

  const stored = loadStudy() || {};
  const meta = stored.meta || {};

  // phases: idle → task → pause → transition (after bad) → summary
  const [phase, setPhase] = useState("idle");
  const [idx, setIdx] = useState(0);
  const [timerStart, setTimerStart] = useState(null);
  const [lastMs, setLastMs] = useState(null);

  const name = meta.participant || "";
  const computingId = meta.computingId || "";

  const isLastTask = idx === TASKS.length - 1;

  // stable per-condition randomized order, persisted in session
  const order = useMemo(
    () => getOrCreateOrder(condition, TASKS.length),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [condition]
  );

  // pick the current task via the randomized index
  const currentTask = TASKS[order[idx]];

  function startTasks() {
    // if somehow no session exists (user skipped tutorial), create one
    if (!loadStudy()) {
      newSession({});
    }
    setIdx(0);
    setLastMs(null);
    setTimerStart(Date.now());
    setPhase("task");
  }

  // Start if Tutorial sent autoStart (not strictly needed but fine)
  useEffect(() => {
    if (autoStart && phase === "idle") startTasks();
  }, [autoStart, phase]); // eslint-disable-line

  // Auto-start whenever you land on /bad and HUD is idle
  useEffect(() => {
    const onBad = location.pathname === "/bad";
    if (onBad && phase === "idle") {
      startTasks();
    }
  }, [location.pathname, phase]); // eslint-disable-line

  // Card clicks record result, stop timer, and pause until Next Task
  useEffect(() => {
    window.__selectExhibitForStudy = (exhibitId) => {
      if (phase !== "task") return;
      const ms = Date.now() - (timerStart ?? Date.now());
      setLastMs(ms);
      recordTaskResult({
        taskId: currentTask.id,
        targetId: currentTask.targetId,
        chosenId: exhibitId,
        ms,
        condition // record which museum page this task occurred on
      });
      setPhase("pause");
    };
    return () => {
      delete window.__selectExhibitForStudy;
    };
  }, [phase, currentTask, timerStart, condition]);

  // 🔸 When the study finishes in the GOOD museum, deblur the images via data-attribute
  useEffect(() => {
    if (condition === "good") {
      if (phase === "summary") {
        document.body.dataset.museumDeblur = "1";
      } else {
        delete document.body.dataset.museumDeblur;
      }
    }

    // cleanup on unmount / route change
    return () => {
      delete document.body.dataset.museumDeblur;
    };
  }, [condition, phase]);

  function nextTask() {
    if (idx < TASKS.length - 1) {
      setIdx(idx + 1);
      setLastMs(null);
      setTimerStart(Date.now());
      setPhase("task");
    } else {
      // Finished all tasks for this route's condition
      if (condition === "bad") {
        setPhase("transition");
      } else {
        setPhase("summary");
      }
    }
  }

  function handleDownload() {
    const csv = exportCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    const safeName = (name || "participant").trim().replace(/\s+/g, "_");
    const safeId = (computingId || "id").trim().replace(/\s+/g, "_");

    a.href = url;
    a.download = `${safeName}_${safeId}_museum-study.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    clearSession();
    setPhase("idle");
    setIdx(0);
    setTimerStart(null);
    setLastMs(null);
    navigate("/tutorial");
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999]">
      {phase === "idle" && (
        <Card title="Ready to Begin?" width="w-[26rem]">
          <button
            onClick={startTasks}
            className="px-3 py-2 rounded-lg bg-neutral-900 text-white"
          >
            Start Study
          </button>
        </Card>
      )}

      {phase === "task" && currentTask && (
        <Card title={`Task ${idx + 1} / ${TASKS.length}`} width="w-[34rem]">
          <p className="text-sm text-neutral-800">{currentTask.prompt}</p>
          <p className="mt-2 text-xs text-neutral-600">
            Click the exhibit card that matches. Timer is running…
          </p>
        </Card>
      )}

      {phase === "pause" && (
        <Card title="Recorded" width="w-[28rem]">
          <p className="text-sm text-neutral-700">
            {lastMs != null
              ? `Time: ${(lastMs / 1000).toFixed(2)}s`
              : "Answer recorded."}
          </p>

          <button
            onClick={() => {
              if (isLastTask && condition === "bad") {
                // after last BAD task: show transition instead of jumping
                setPhase("transition");
              } else {
                nextTask();
              }
            }}
            className="mt-3 px-3 py-2 rounded-lg bg-neutral-900 text-white"
          >
            Next Task
          </button>
        </Card>
      )}

      {/* Transition screen AFTER finishing BAD museum */}
      {phase === "transition" && condition === "bad" && (
        <Card title="Nice job! Now continue in the Good Museum" width="w-[32rem]">
          <p className="text-sm text-neutral-700">
            You’ve completed the tasks in the inaccessible (bad) version.
            Continue to the accessible version to finish the study.
          </p>

          <button
            onClick={() => {
              setIdx(0);
              setLastMs(null);
              setTimerStart(Date.now());
              navigate("/good");
              setPhase("task");
            }}
            className="mt-3 px-3 py-2 rounded-lg bg-neutral-900 text-white"
          >
            Go to Good Museum
          </button>
        </Card>
      )}

      {phase === "summary" && (
        <Card title="Session Complete" width="w-[28rem]">
          <p className="text-sm text-neutral-700">
            Export results as CSV or start a new session.  
            The Good Museum images below are now shown clearly for reference.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-2 rounded-lg border bg-white"
            >
              Export CSV
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-lg bg-neutral-900 text-white"
            >
              New Session
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}

/* UI helpers */
function Card({ title, children, width = "w-80" }) {
  return (
    <div className={`rounded-xl bg-white shadow-lg border p-4 ${width}`}>
      <div className="font-semibold mb-2 text-center">{title}</div>
      {children}
    </div>
  );
}
