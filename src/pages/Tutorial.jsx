import { useNavigate } from "react-router-dom";

export default function Tutorial() {
  const nav = useNavigate();

  function start() {
    setTutorialDone();
    // Navigate to /bad and pass a state flag so HUD can auto-start
    nav("/bad", { replace: true, state: { autoStart: true } });
    localStorage.setItem("museum-start-now", "1");
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(/museum.png)` }}
      role="img"
      aria-label="Museum hallway background"
    >
      <section className="bg-white/90 backdrop-blur-md border shadow-xl rounded-2xl max-w-2xl w-full p-6 m-4">
        <h1 className="text-3xl font-semibold">Tutorial: What You’ll Do</h1>

        <ol className="mt-4 list-decimal pl-6 space-y-3 text-neutral-800">
          <li>Turn on a screen reader if possible (macOS: <span className="font-mono">⌘ + F5</span>).</li>
          <li>Complete short tasks like “find the cat painting” by clicking the matching exhibit.</li>
          <li>Each task is timed automatically; accuracy is recorded when you click.</li>
          <li>Before and after, answer a few 1–5 questions about confidence and empathy.</li>
        </ol>

        <div className="mt-6 rounded-xl border bg-white p-4">
          <h2 className="font-semibold">Tip</h2>
          <p className="mt-2 text-sm text-neutral-700">
            Start with the <strong>Bad Museum</strong> to feel the accessibility barriers first.
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={() => nav("/bad")}
            className="px-5 py-2 rounded-lg bg-black text-white"
          >
            Start
          </button>
        </div>
      </section>
    </div>
  );
}
