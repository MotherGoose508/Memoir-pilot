"use client";

import { useState } from "react";

const cards = [
  { term: "Mitochondrion", definition: "Produces usable energy for the cell", options: ["Produces usable energy for the cell", "Controls what enters the cell", "Stores genetic material", "Builds proteins"] },
  { term: "Nucleus", definition: "Stores the cell's genetic material", options: ["Stores the cell's genetic material", "Digests waste", "Produces energy", "Makes cell walls"] },
  { term: "Ribosome", definition: "Builds proteins from instructions", options: ["Builds proteins from instructions", "Moves the cell", "Carries oxygen", "Stores water"] },
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [completed, setCompleted] = useState(7);
  const [typed, setTyped] = useState(false);
  const card = cards[index];
  const correct = selected === card.definition;
  function choose(answer: string) { if (!selected) setSelected(answer); }
  function next() { if (selected) { setCompleted((value) => value + (correct ? 1 : 0)); setIndex((value) => (value + 1) % cards.length); setSelected(null); } }
  return <main className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#top"><span className="brand-mark">m</span><span>memoir</span></a>
      <nav aria-label="Primary navigation"><a className="nav-item active" href="#learn"><span>◈</span> Learn</a><a className="nav-item" href="#sets"><span>▤</span> My sets</a><a className="nav-item" href="#folders"><span>□</span> Folders</a></nav>
      <div className="sidebar-bottom"><a className="nav-item" href="#settings"><span>⚙</span> Settings</a><button className="profile"><span className="avatar">KA</span><span><strong>Kaden</strong><small>Free plan</small></span><span className="dots">•••</span></button></div>
    </aside>
    <section className="content" id="top">
      <header className="topbar"><button className="mobile-menu" aria-label="Open menu">☰</button><div className="crumb"><span>My sets</span><b>/</b><strong>Cell Biology</strong></div><div className="top-actions"><button className="icon-button" aria-label="Notifications">♧</button><button className="icon-button" aria-label="Help">?</button></div></header>
      <div className="study-page" id="learn">
        <div className="set-heading"><div><p className="eyebrow">CELL BIOLOGY · 24 CARDS</p><h1>Cell Biology</h1><p className="subtle">Learn the building blocks of life</p></div><button className="more-button" aria-label="More set options">•••</button></div>
        <div className="progress-row"><div className="progress-copy"><strong>{completed}</strong> of 24 mastered</div><div className="progress-track"><span style={{ width: `${(completed / 24) * 100}%` }} /></div><div className="streak">✦ 3 day streak</div></div>
        <div className="study-grid">
          <section className="quiz-panel" aria-live="polite"><div className="quiz-meta"><span className="pill">Learning</span><span>Card {index + 1} of 5</span></div><h2>{typed ? "Type the matching term" : "What does this cell part do?"}</h2><div className="prompt-card">{typed ? card.definition : card.term}</div>
            {typed ? <div className="typing"><input autoFocus aria-label="Your answer" placeholder="Type your answer…" /><button onClick={() => choose(card.definition)}>Check answer</button></div> : <div className="answers">{card.options.map((answer, answerIndex) => { const state = selected ? (answer === card.definition ? "correct" : answer === selected ? "incorrect" : "") : ""; return <button className={`answer ${state}`} onClick={() => choose(answer)} key={answer}><span>{String.fromCharCode(65 + answerIndex)}</span>{answer}</button>; })}</div>}
            {selected && <div className={`feedback ${correct ? "positive" : "negative"}`}><span>{correct ? "✓" : "↗"}</span><div><strong>{correct ? "Nice work!" : "Almost — keep going."}</strong><p>{correct ? "That card is one step closer to mastery." : `The answer is: ${card.definition}`}</p></div><button onClick={next}>Continue →</button></div>}<p className="keyboard-hint">Use <kbd>1</kbd>–<kbd>4</kbd> to answer · <kbd>↵</kbd> to continue</p>
          </section>
          <aside className="session-panel"><h3>This session</h3><div className="session-stat"><span className="stat-icon orange">↗</span><div><strong>{5 - index}</strong><small>Cards remaining</small></div></div><div className="session-stat"><span className="stat-icon green">✓</span><div><strong>{completed}</strong><small>Mastered total</small></div></div><hr /><button className="setting-row" onClick={() => setTyped(!typed)}><span><strong>Typed answers</strong><small>Challenge yourself with recall</small></span><span className={`toggle ${typed ? "on" : ""}`}><i /></span></button><button className="text-button">Session settings <span>›</span></button><button className="end-session">End session</button></aside>
        </div>
      </div>
    </section>
  </main>;
}
