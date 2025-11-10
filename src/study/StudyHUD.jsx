import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { TASKS } from "./tasks";
import {
  newSession, loadStudy, setParticipant,
  recordPreAnswers, recordTaskResult,
  recordPostAnswers, exportCSV, clearSession
} from "./dataStore";

const PRE_QUESTIONS = [
  { key: "pre_confidence",  label: "How confident do you feel about designing accessible digital interfaces?" },
  { key: "pre_familiarity", label: "How familiar are you with using assistive technologies such as screen readers?" },
  { key: "pre_importance",  label: "How important do you think accessibility is in your own design or coding work?" },
  { key: "pre_ease",        label: "How easy do you think it is to make an app fully accessible?" },
  { key: "pre_empathy",     label: "How much empathy do you currently feel for users who rely on accessibility tools?" },
];

const POST_QUESTIONS = [
  { key: "post_confidence",  label: "How confident do you now feel about designing accessible interfaces?" },
  { key: "post_importance",  label: "How important does accessibility feel after using the inaccessible version?" },
  { key: "post_empathy",     label: "How much empathy do you now feel for users with visual impairments?" },
  { key: "post_motivation",  label: "How motivated are you to include accessibility testing in future projects?" },
  { key: "post_difficulty",  label: "How would you rate the difficulty of completing the tasks using assistive tools?" },
];

export default function StudyHUD({ autoStart = false }) {
    const location = useLocation();
    const [phase, setPhase] = useState("idle");
    const [idx, setIdx] = useState(0);
    const [timerStart, setTimerStart] = useState(null);
    const [name, setName] = useState(loadStudy()?.meta?.participant || "");
    const [lastMs, setLastMs] = useState(null);
  
    const currentTask = TASKS[idx];
  
    // 🔑 1) Start if came from tutorial (state/query/LS)
    useEffect(() => {
      if (autoStart && phase === "idle") {
        newSession({ participant: name });
        setPhase("pre");
      }
    }, [autoStart, phase, name]);
  
    // 🔑 2) Start automatically on /bad if there is no active session (works even on refresh)
    useEffect(() => {
      const onBad = location.pathname === "/bad";
      const hasSession = !!loadStudy();
      if (onBad && !hasSession && phase === "idle" && !autoStart) {
        newSession({ participant: name });
        setPhase("pre");
      }
    }, [location.pathname, phase, name, autoStart]);


  // Global hook for card clicks; stop timer and go to PAUSE (await Next)
  useEffect(() => {
    window.__selectExhibitForStudy = (exhibitId) => {
      if (phase !== "task") return;
      const ms = Date.now() - (timerStart ?? Date.now());
      setLastMs(ms);
      recordTaskResult({
        taskId: currentTask.id,
        targetId: currentTask.targetId,
        chosenId: exhibitId,
        ms
      });
      setPhase("pause"); // wait for Next
    };
    return () => { delete window.__selectExhibitForStudy; };
  }, [phase, currentTask, timerStart]);

  function submitPre(answers) {
    recordPreAnswers(answers);
    setIdx(0);
    setTimerStart(Date.now());
    setPhase("task");
  }

  function nextTask() {
    if (idx < TASKS.length - 1) {
      setIdx(idx + 1);
      setLastMs(null);
      setTimerStart(Date.now());
      setPhase("task");
    } else {
      setPhase("post");
    }
  }

  function submitPost(answers) {
    recordPostAnswers(answers);
    setPhase("summary");
  }

  function handleDownload() {
    const csv = exportCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "museum-study.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    clearSession();
    setPhase("idle");
    setIdx(0);
    setTimerStart(null);
    setLastMs(null);
    setName("");
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999]">
      {phase === "idle" && (
        <Card title="Ready to Begin?" width="w-[26rem]">
          <p className="text-sm text-neutral-600">Start from the Tutorial to begin the study flow.</p>
        </Card>
      )}

      {phase === "pre" && (
        <NameAndPre
          name={name}
          setName={(v) => { setName(v); setParticipant(v); }}
          questions={PRE_QUESTIONS}
          onSubmit={submitPre}
        />
      )}

      {phase === "task" && currentTask && (
        <Card title={`Task ${idx + 1} / ${TASKS.length}`} width="w-[34rem]">
          <p className="text-sm text-neutral-800">{currentTask.prompt}</p>
          <p className="mt-2 text-xs text-neutral-600">Click the exhibit card that matches. Timer is running…</p>
        </Card>
      )}

      {phase === "pause" && (
        <Card title="Recorded" width="w-[28rem]">
          <p className="text-sm text-neutral-700">
            {lastMs != null ? `Time: ${(lastMs/1000).toFixed(2)}s` : "Answer recorded."}
          </p>
          <button onClick={nextTask} className="mt-3 px-3 py-2 rounded-lg bg-neutral-900 text-white">
            Next Task
          </button>
        </Card>
      )}

      {phase === "post" && (
        <SurveyCard title="Post-survey" questions={POST_QUESTIONS} onSubmit={submitPost} />
      )}

      {phase === "summary" && (
        <Card title="Session Complete" width="w-[28rem]">
          <p className="text-sm text-neutral-700">Export results as CSV or start a new session.</p>
          <div className="mt-3 flex gap-2">
            <button onClick={handleDownload} className="px-3 py-2 rounded-lg border bg-white">Export CSV</button>
            <button onClick={handleReset} className="px-3 py-2 rounded-lg bg-neutral-900 text-white">New Session</button>
          </div>
        </Card>
      )}
    </div>
  );
}

function Card({ title, children, width = "w-80" }) {
  return (
    <div className={`rounded-xl bg-white shadow-lg border p-4 ${width}`}>
      <div className="font-semibold mb-2 text-center">{title}</div>
      {children}
    </div>
  );
}

function NameAndPre({ name, setName, questions, onSubmit }) {
  const [answers, setAnswers] = useState({});
  function setVal(k, v) { setAnswers(a => ({ ...a, [k]: Number(v) })); }

  return (
    <Card title="Pre-survey" width="w-[34rem]">
      <div className="mb-3">
        <label className="block text-sm text-neutral-700 mb-1">Participant name (optional)</label>
        <input
          className="w-full rounded-lg border px-3 py-2"
          placeholder="e.g., Mindy Z."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {questions.map(q => (
          <div key={q.key}>
            <div className="text-sm text-neutral-800 mb-1">{q.label}</div>
            <Likert value={answers[q.key]} onChoose={(n) => setVal(q.key, n)} />
          </div>
        ))}
      </div>

      <button
        className="mt-4 px-3 py-2 rounded-lg bg-neutral-900 text-white disabled:opacity-50"
        onClick={() => onSubmit(answers)}
        disabled={questions.some(q => answers[q.key] == null)}
      >
        Begin Tasks
      </button>
    </Card>
  );
}

function SurveyCard({ title, questions, onSubmit }) {
    const [answers, setAnswers] = useState({});
    function setVal(k, v) { setAnswers(a => ({ ...a, [k]: Number(v) })); }
  
    return (
      <Card title={title} width="w-[34rem]">
        <div className="space-y-3">
          {questions.map(q => (
            <div key={q.key}>
              <div className="text-sm text-neutral-800 mb-1">{q.label}</div>
              <Likert value={answers[q.key]} onChoose={(n) => setVal(q.key, n)} />
            </div>
          ))}
        </div>
        <button
          className="mt-4 px-3 py-2 rounded-lg bg-neutral-900 text-white disabled:opacity-50"
          onClick={() => onSubmit(answers)}
          disabled={questions.some(q => answers[q.key] == null)}
        >
          Finish
        </button>
      </Card>
    );
  }
  

function Likert({ value, onChoose }) {
  return (
    <div className="flex gap-2 justify-center">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          onClick={() => onChoose(n)}
          className={`w-10 h-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-neutral-900 ${value === n ? "bg-neutral-900 text-white" : "hover:bg-neutral-100"}`}
          aria-label={`Choose ${n}`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
