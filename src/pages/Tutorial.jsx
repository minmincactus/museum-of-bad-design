// src/pages/Tutorial.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { newSession } from "../study/dataStore";

export default function Tutorial() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [computingId, setComputingId] = useState("");
  const disabled = !name.trim() || !computingId.trim();

  function handleStart() {
    // create a fresh study session with participant info
    newSession({ participant: name.trim(), computingId: computingId.trim() });
    // go straight to Bad Museum; StudyHUD will auto-start tasks
    nav("/bad");
  }

  return (
    <div className="min-h-screen w-full bg-cover bg-center flex items-center justify-center">
      <section className="bg-white/50 backdrop-blur-md border shadow-xl rounded-2xl max-w-2xl w-full p-6 m-4">
        <h1 className="text-3xl font-semibold">Before You Start</h1>

        <div className="mt-4 grid gap-4">
          <div>
            <label className="block text-sm text-neutral-700 mb-1">
              Participant name
            </label>
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-700 mb-1">
              Computing ID
            </label>
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={computingId}
              onChange={(e) => setComputingId(e.target.value)}
              placeholder="e.g. mz3xy"
            />
          </div>
        </div>

        <h2 className="mt-6 text-xl font-semibold">What You’ll Do</h2>
        <ol className="mt-2 list-decimal pl-6 space-y-3 text-neutral-800">
          <li>
            <strong>Navigate the exhibits:</strong> Click and navigate with your mouse.
          </li>
          <li>
            <strong>Follow the task prompts:</strong> At the top of the page
            you’ll see tasks like <em>“Find the cat painting.”</em> Choose the
            exhibit card that best matches.
          </li>
          <li>
            <strong>Automatic timing:</strong> As soon as a task appears, the
            timer starts. When you select an exhibit, your time and accuracy are
            recorded and you’ll see a short pause before the next task.
          </li>
          <li>
            <strong>Two versions of the museum:</strong> You’ll start in the{" "}
            <strong>Bad Museum</strong>, where some things are intentionally
            frustrating. Then you’ll repeat the tasks in the{" "}
            <strong>Good Museum</strong> with accessible design.
          </li>
        </ol>

        <div className="mt-6 rounded-xl border bg-white p-4">
          <h2 className="font-semibold">Tip</h2>
          <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
            If the Bad Museum feels confusing or annoying, that’s on purpose.
            The difference between the two museums is what we’re studying.
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={handleStart}
            disabled={disabled}
            className="px-5 py-2 rounded-lg bg-black text-white disabled:opacity-50"
          >
            Start Study
          </button>
        </div>
      </section>
    </div>
  );
}
