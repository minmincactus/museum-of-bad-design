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
      <section className="bg-white/50 backdrop-blur-md border shadow-xl rounded-2xl max-w-2xl w-full p-6 m-4">
        <h1 className="text-3xl font-semibold">Tutorial: What You’ll Do</h1>

        <ol className="mt-4 list-decimal pl-6 space-y-3 text-neutral-800">
  <li>
            <strong>Get ready:</strong> If you can, turn on a screen reader 
            (macOS: <span className="font-mono">⌘ + F5</span>, Windows: <span className="font-mono">Ctrl + Alt + Enter</span>).
            You can also try keyboard-only navigation using <span className="font-mono">Tab</span> and <span className="font-mono">Enter</span>.
        </li>

        <li>
            <strong>Follow the prompts:</strong> You’ll see short tasks appear at the top, like 
            <em>“Find the cat painting.”</em>  
            Click (or navigate to) the exhibit that best matches the description.
        </li>

        <li>
            <strong>Automatic timing:</strong> The timer starts as soon as the task appears.  
            Once you make your selection, your time and accuracy will be recorded.  
            You’ll then see a <em>“Next Task”</em> button to take a short break before continuing.
        </li>

        <li>
            <strong>Before and after the tasks:</strong> You’ll answer a few quick 1–5 questions about your confidence, empathy, and experience with accessibility.
        </li>
        </ol>

        <div className="mt-6 rounded-xl border bg-white p-4">
        <h2 className="font-semibold">Tip</h2>
        <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
            You’ll start in the <strong>Bad Museum</strong>, where some exhibits break accessibility rules on purpose.
            Don’t worry if it feels frustrating — that’s part of the experience.  
            Afterward, you’ll explore the <strong>Good Museum</strong> and see how thoughtful design can transform usability and empathy.
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
