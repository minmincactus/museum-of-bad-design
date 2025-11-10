import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Consent() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [agree, setAgree] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!agree) return;
    const record = {
      participant: name || "",
      consent: true,
      ts: Date.now(),
      version: "v1",
    };
    localStorage.setItem("museum-consent", JSON.stringify(record));
    nav("/tutorial", { replace: true });
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(/museum.png)` }}
      role="img"
      aria-label="Splash image of a museum hallway"
    >
      <div className="bg-white/90 backdrop-blur-md border shadow-xl rounded-2xl max-w-xl w-full p-6 m-4">
        <h1 className="text-2xl font-semibold">Consent to Participate</h1>
        <p className="mt-3 text-sm text-neutral-700">
          You are invited to take part in a short study about accessibility and user experience.
          You will interact with two versions of a website and complete simple tasks. We will record
          task time, accuracy, and brief survey responses. Your data is anonymous and used only for
          class purposes. Participation is voluntary and you may stop at any time.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>
              I have read the description above and consent to participate in this class project.
            </span>
          </label>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!agree}
              className="px-4 py-2 rounded-lg bg-neutral-900 text-white disabled:opacity-50"
            >
              I Agree
            </button>
            <button
              type="button"
              onClick={() => window.location.assign("about:blank")}
              className="px-4 py-2 rounded-lg border"
            >
              I Do Not Agree
            </button>
          </div>

          <p className="text-xs text-neutral-500">
            Timestamp will be recorded upon consent for audit (stored locally in your browser).
          </p>
        </form>
      </div>
    </div>
  );
}
