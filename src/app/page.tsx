"use client";
import { useEffect, useState } from "react";

type QuizCard = { term: string; definition: string; options?: string[] };
const defaultCards: QuizCard[] = [
  { term: "Mitochondrion", definition: "Produces usable energy for the cell", options: ["Produces usable energy for the cell", "Controls what enters the cell", "Stores genetic material", "Builds proteins"] },
  { term: "Nucleus", definition: "Stores the cell's genetic material", options: ["Stores the cell's genetic material", "Digests waste", "Produces energy", "Makes cell walls"] },
  { term: "Ribosome", definition: "Builds proteins from instructions", options: ["Builds proteins from instructions", "Moves the cell", "Carries oxygen", "Stores water"] },
  { term: "Cell membrane", definition: "Controls what enters and leaves the cell", options: ["Controls what enters and leaves the cell", "Captures sunlight", "Builds proteins", "Stores genetic material"] },
  { term: "Vacuole", definition: "Stores water and other materials", options: ["Stores water and other materials", "Releases energy", "Directs cell activities", "Makes proteins"] },
];
type View = "learn" | "sets" | "folders" | "settings";
type DialogKind = "help" | "notifications" | "options" | "session" | "profile" | "end" | null;
const normalize = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

export default function Home() {
  const [index, setIndex] = useState(0), [selected, setSelected] = useState<string | null>(null), [completed, setCompleted] = useState(7);
  const [typed, setTyped] = useState(false), [typedAnswer, setTypedAnswer] = useState(""), [view, setView] = useState<View>("learn");
  const [dialog, setDialog] = useState<DialogKind>(null), [menuOpen, setMenuOpen] = useState(false), [sessionEnded, setSessionEnded] = useState(false);
  const [activeSet, setActiveSet] = useState({ title: "Cell Biology", description: "Learn the building blocks of life", cards: defaultCards });
  const cards = activeSet.cards;
  const card = cards[index];
  const useTyped = typed || !card.options || card.options.length < 2;
  const correct = selected !== null && (useTyped ? normalize(selected) === normalize(card.term) : selected === card.definition);
  const choose = (answer: string) => { if (!selected) setSelected(answer); };
  const checkTyped = () => { if (typedAnswer.trim()) choose(typedAnswer); };
  const restart = () => { setIndex(0); setSelected(null); setTypedAnswer(""); setSessionEnded(false); };
  const next = () => {
    if (!selected) return;
    if (correct) setCompleted((value) => Math.min(24, value + 1));
    if (index === cards.length - 1) setSessionEnded(true);
    else { setIndex((value) => value + 1); setSelected(null); setTypedAnswer(""); }
  };
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (view !== "learn" || sessionEnded || dialog) return;
      if (event.key === "Enter" && selected) {
        event.preventDefault();
        if (correct) setCompleted((value) => Math.min(24, value + 1));
        if (index === cards.length - 1) setSessionEnded(true);
        else { setIndex((value) => value + 1); setSelected(null); setTypedAnswer(""); }
      } else if (!useTyped && !selected && /^[1-4]$/.test(event.key)) {
        setSelected((card.options || [])[Number(event.key) - 1]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [card.options, cards.length, correct, dialog, index, selected, sessionEnded, useTyped, view]);
  const switchView = (nextView: View) => { setView(nextView); setMenuOpen(false); };
  const studySet = (set: StudySet) => {
    const savedCards = set.cards.filter((item) => item.term.trim() && item.definition.trim());
    setActiveSet(set.id === starterSet.id && savedCards.length === 0 ? { title: "Cell Biology", description: "Learn the building blocks of life", cards: defaultCards } : { title: set.title || "Untitled set", description: set.description || "Study this set", cards: savedCards });
    setIndex(0); setSelected(null); setTypedAnswer(""); setSessionEnded(false); setTyped(set.id !== starterSet.id); switchView("learn");
  };
  const nav = (target: View, icon: string, label: string) => <button className={"nav-item " + (view === target ? "active" : "")} onClick={() => switchView(target)}><span>{icon}</span>{label}</button>;

  return <main className="app-shell">
    <aside className={"sidebar " + (menuOpen ? "open" : "")}><button className="brand" onClick={() => switchView("learn")}><span className="brand-mark">m</span><span>memoir</span></button><nav aria-label="Primary navigation">{nav("learn", "◈", "Learn")}{nav("sets", "▤", "My sets")}{nav("folders", "□", "Folders")}</nav><div className="sidebar-bottom">{nav("settings", "⚙", "Settings")}<button className="profile" onClick={() => setDialog("profile")}><span className="avatar">KA</span><span><strong>Kaden</strong><small>Free plan</small></span><span className="dots">•••</span></button></div></aside>
    {menuOpen && <button className="menu-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
    <section className="content"><header className="topbar"><button className="mobile-menu" aria-label="Open menu" onClick={() => setMenuOpen(true)}>☰</button><div className="crumb"><button onClick={() => switchView("sets")}>My sets</button><b>/</b><strong>{view === "learn" ? activeSet.title : view === "sets" ? "My sets" : view === "folders" ? "Folders" : "Settings"}</strong></div><div className="top-actions"><button className="icon-button notification-button" aria-label="Notifications" onClick={() => setDialog("notifications")}>🔔</button><button className="icon-button" aria-label="Help" onClick={() => setDialog("help")}>?</button></div></header>
      {view !== "learn" ? <EmptyView view={view} onLearn={() => switchView("learn")} onStudy={studySet} /> : <div className="study-page"><div className="set-heading"><div><p className="eyebrow">STUDY SET · {cards.length} CARDS</p><h1>{activeSet.title}</h1><p className="subtle">{activeSet.description}</p></div><button className="more-button" aria-label="More set options" onClick={() => setDialog("options")}>•••</button></div><div className="progress-row"><div className="progress-copy"><strong>{completed}</strong> of 24 mastered</div><div className="progress-track"><span style={{ width: String((completed / 24) * 100) + "%" }} /></div><div className="streak">✦ 3 day streak</div></div>
      <div className="study-grid"><section className="quiz-panel" aria-live="polite">{sessionEnded ? <div className="session-complete"><span>✦</span><h2>Session complete!</h2><p>You reviewed all {cards.length} cards. Keep up the momentum.</p><button onClick={restart}>Study again</button></div> : <><div className="quiz-meta"><span className="pill">Learning</span><span>Card {index + 1} of {cards.length}</span></div><h2>{useTyped ? "Type the matching term" : "What does this cell part do?"}</h2><div className="prompt-card">{useTyped ? card.definition : card.term}</div>{useTyped ? <div className="typing"><input autoFocus aria-label="Your answer" value={typedAnswer} onChange={(event) => setTypedAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") checkTyped(); }} placeholder="Type your answer…" disabled={Boolean(selected)} /><button onClick={checkTyped} disabled={!typedAnswer.trim() || Boolean(selected)}>Check answer</button></div> : <div className="answers">{(card.options || []).map((answer, answerIndex) => { const state = selected ? (answer === card.definition ? "correct" : answer === selected ? "incorrect" : "") : ""; return <button className={"answer " + state} onClick={() => choose(answer)} disabled={Boolean(selected)} key={answer}><span>{String.fromCharCode(65 + answerIndex)}</span>{answer}</button>; })}</div>}{selected && <div className={"feedback " + (correct ? "positive" : "negative")}><span>{correct ? "✓" : "↗"}</span><div><strong>{correct ? "Nice work!" : "Almost — keep going."}</strong><p>{correct ? "That card is one step closer to mastery." : "The answer is: " + (useTyped ? card.term : card.definition)}</p></div><button onClick={next}>Continue →</button></div>}<p className="keyboard-hint">Use <kbd>1</kbd>–<kbd>4</kbd> to answer · <kbd>↵</kbd> to continue</p></>}</section>
      <aside className="session-panel"><h3>This session</h3><div className="session-stat"><span className="stat-icon orange">↗</span><div><strong>{sessionEnded ? 0 : cards.length - index}</strong><small>Cards remaining</small></div></div><div className="session-stat"><span className="stat-icon green">✓</span><div><strong>{completed}</strong><small>Mastered total</small></div></div><hr /><button className="setting-row" onClick={() => { setTyped((value) => !value); setSelected(null); setTypedAnswer(""); }}><span><strong>Typed answers</strong><small>Challenge yourself with recall</small></span><span className={"toggle " + (typed ? "on" : "")}><i /></span></button><button className="text-button" onClick={() => setDialog("session")}>Session settings <span>›</span></button><button className="end-session" onClick={() => setDialog("end")}>End session</button></aside></div></div>}
    </section>{dialog && <Dialog kind={dialog} close={() => setDialog(null)} endSession={() => { setDialog(null); setSessionEnded(true); }} />}</main>;
}
function EmptyView({ view, onLearn, onStudy }: { view: Exclude<View, "learn">; onLearn: () => void; onStudy: (set: StudySet) => void }) {
  if (view === "sets") return <SetLibrary onStudy={onStudy} />;
  const copy = view === "folders" ? ["Folders", "Organize your study sets into folders as you grow your library."] : ["Settings", "Study preferences are available from each session."];
  return <div className="empty-page"><p className="eyebrow">MEMOIR</p><h1>{copy[0]}</h1><p>{copy[1]}</p><button onClick={onLearn}>Go to learning</button></div>;
}

type StudyCard = { term: string; definition: string };
type StudySet = { id: number; title: string; description: string; cards: StudyCard[]; cardCount?: number };
const setStorageKey = "memoir-study-sets";
const starterSet: StudySet = { id: 1, title: "Cell Biology", description: "Learn the building blocks of life", cards: [], cardCount: 24 };

function SetLibrary({ onStudy }: { onStudy: (set: StudySet) => void }) {
  const [sets, setSets] = useState<StudySet[]>([starterSet]);
  const [ready, setReady] = useState(false), [editingId, setEditingId] = useState<number | null>(null);
  const [bulkTerms, setBulkTerms] = useState(""), [bulkDefinitions, setBulkDefinitions] = useState("");
  useEffect(() => {
    const saved = window.localStorage.getItem(setStorageKey);
    if (saved) {
      try {
        // The saved browser snapshot must be loaded once after client hydration.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSets(JSON.parse(saved));
      } catch { window.localStorage.removeItem(setStorageKey); }
    }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) window.localStorage.setItem(setStorageKey, JSON.stringify(sets)); }, [ready, sets]);
  const updateSet = (id: number, change: Partial<StudySet>) => setSets((current) => current.map((set) => set.id === id ? { ...set, ...change } : set));
  const createSet = () => {
    const id = Date.now();
    setSets((current) => [...current, { id, title: "Untitled set", description: "", cards: [{ term: "", definition: "" }] }]);
    setEditingId(id);
  };
  const deleteSet = (set: StudySet) => {
    if (window.confirm('Delete "' + set.title + '"? This cannot be undone.')) {
      setSets((current) => current.filter((item) => item.id !== set.id));
      if (editingId === set.id) setEditingId(null);
    }
  };
  const selected = sets.find((set) => set.id === editingId);
  const updateCard = (cardIndex: number, change: Partial<StudyCard>) => {
    if (!selected) return;
    updateSet(selected.id, { cards: selected.cards.map((card, index) => index === cardIndex ? { ...card, ...change } : card) });
  };
  const pasteColumns = () => {
    if (!selected) return;
    const terms = bulkTerms.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
    const definitions = bulkDefinitions.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
    if (!terms.length || terms.length !== definitions.length) {
      window.alert("Paste the same number of terms and definitions. Each line will become one flashcard.");
      return;
    }
    updateSet(selected.id, { cards: [...selected.cards.filter((card) => card.term || card.definition), ...terms.map((term, index) => ({ term, definition: definitions[index] }))] });
    setBulkTerms(""); setBulkDefinitions("");
  };
  const importCards = async (file: File) => {
    if (!selected) return;
    try {
      let rows: string[][] = [];
      if (file.name.toLowerCase().endsWith(".xlsx")) {
        const XLSX = await import("xlsx");
        const workbook = XLSX.read(await file.arrayBuffer());
        rows = XLSX.utils.sheet_to_json<string[]>(workbook.Sheets[workbook.SheetNames[0]], { header: 1, blankrows: false }).map((row) => row.map((cell) => String(cell || "")));
      } else if (file.name.toLowerCase().endsWith(".docx")) {
        const html = (await (await import("mammoth")).convertToHtml({ arrayBuffer: await file.arrayBuffer() })).value;
        const document = new DOMParser().parseFromString(html, "text/html");
        rows = Array.from(document.querySelectorAll("tr")).map((row) => {
          const cells = Array.from(row.querySelectorAll("th, td")).map((cell) => cell.textContent?.trim() || "");
          return cells.length >= 3 ? [cells[1], cells[2]] : cells.slice(0, 2);
        });
      } else {
        rows = (await file.text()).split(/\r?\n/).map((line) => line.split(/\t|,/));
      }
      const imported = rows.map((row) => ({ term: (row[0] || "").trim(), definition: row.slice(1).join(" ").trim() })).filter((card) => card.term && card.definition && !(/^term$/i.test(card.term) && /^definition$/i.test(card.definition)));
      if (!imported.length) throw new Error("No term/definition pairs found");
      updateSet(selected.id, { cards: [...selected.cards.filter((card) => card.term || card.definition), ...imported] });
      window.alert(imported.length + " cards imported.");
    } catch {
      window.alert("Could not import that file. Use a .docx, .xlsx, .csv, or tab-separated file with terms in the first column and definitions in the second.");
    }
  };
  return <div className="sets-page"><div className="sets-heading"><div><p className="eyebrow">YOUR LIBRARY</p><h1>My sets</h1><p>Build a collection of subjects to study.</p></div><button className="add-set" onClick={createSet}>+ Add set</button></div>
    {selected && <section className="set-editor"><div className="editor-heading"><div><p className="eyebrow">EDITING SET</p><h2>{selected.title || "Untitled set"}</h2><small>Saved automatically on this device</small></div><button className="secondary" onClick={() => setEditingId(null)}>Done</button></div><label>Set name<input value={selected.title} onChange={(event) => updateSet(selected.id, { title: event.target.value })} placeholder="e.g. Spanish vocabulary" /></label><label>Description <span>(optional)</span><input value={selected.description} onChange={(event) => updateSet(selected.id, { description: event.target.value })} placeholder="What will you study?" /></label><div className="term-heading"><h3>Terms and definitions</h3><div><label className="import-cards">Import file<input type="file" accept=".docx,.xlsx,.csv,.tsv,.txt" onChange={(event) => { const file = event.target.files?.[0]; if (file) importCards(file); event.currentTarget.value = ""; }} /></label><button onClick={() => updateSet(selected.id, { cards: [...selected.cards, { term: "", definition: "" }] })}>+ Add card</button></div></div><p className="import-hint">Import a Word table or spreadsheet, or paste two copied columns below.</p><div className="paste-columns"><label>Paste terms<textarea value={bulkTerms} onChange={(event) => setBulkTerms(event.target.value)} placeholder={"One term per line\nWestern Front\nBattle of the Marne"} /></label><label>Paste definitions<textarea value={bulkDefinitions} onChange={(event) => setBulkDefinitions(event.target.value)} placeholder={"One definition per line\nThe WWI front in France and Belgium\nA 1914 battle that halted Germany"} /></label><div className="paste-actions"><span>{bulkTerms.split(/\r?\n/).filter(Boolean).length} terms · {bulkDefinitions.split(/\r?\n/).filter(Boolean).length} definitions</span><button className="primary" onClick={pasteColumns}>Match and add cards</button></div></div><div className="card-editor-list">{selected.cards.map((card, index) => <div className="card-editor" key={index}><label>Term<input value={card.term} onChange={(event) => updateCard(index, { term: event.target.value })} placeholder="e.g. Mitochondrion" /></label><label>Definition<input value={card.definition} onChange={(event) => updateCard(index, { definition: event.target.value })} placeholder="e.g. Produces energy for the cell" /></label><button className="delete-set" onClick={() => updateSet(selected.id, { cards: selected.cards.filter((_, cardIndex) => cardIndex !== index) })}>Remove</button></div>)}</div></section>}
    {sets.length ? <div className="set-list">{sets.map((set) => { const cardTotal = set.cards.length ? set.cards.filter((card) => card.term.trim() && card.definition.trim()).length : set.cardCount || 0; return <article className="set-card" key={set.id}><div className="set-card-icon">▤</div><div className="set-card-copy"><h2>{set.title || "Untitled set"}</h2><p>{set.description || "No description yet"}</p><small>{cardTotal} cards</small></div><div className="set-card-actions"><button className="study-set" onClick={() => onStudy(set)} disabled={cardTotal === 0}>{cardTotal ? "Study" : "Add cards first"}</button><button className="secondary" onClick={() => setEditingId(set.id)}>Edit</button><button className="delete-set" onClick={() => deleteSet(set)} aria-label={"Delete " + set.title}>Delete</button></div></article>; })}</div> : <div className="no-sets"><span>▤</span><h2>No sets yet</h2><p>Create your first study set to get started.</p><button className="primary" onClick={createSet}>+ Add set</button></div>}
  </div>;
}
function Dialog({ kind, close, endSession }: { kind: Exclude<DialogKind, null>; close: () => void; endSession: () => void }) {
  const content = { help: ["How can we help?", "Choose an answer with the mouse or keys 1–4. Switch on Typed answers for recall practice, then press Enter to check or continue."], notifications: ["You’re all caught up", "There are no new study reminders right now."], options: ["Cell Biology options", "This self-contained set has 24 cards. Progress is tracked during your current session."], session: ["Session settings", "Answer mode and session progress are controlled from the study panel. Your keyboard shortcuts are active while studying."], profile: ["Kaden", "You’re on the Free plan. Your current study session is available on this device."], end: ["End this session?", "Your completed cards will stay counted, and you can restart the session whenever you’re ready."] } as const;
  const [title, body] = content[kind];
  return <div className="dialog-backdrop" role="presentation" onMouseDown={close}><div className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" onMouseDown={(event) => event.stopPropagation()}><button className="dialog-close" aria-label="Close" onClick={close}>×</button><h2 id="dialog-title">{title}</h2><p>{body}</p>{kind === "end" ? <div className="dialog-actions"><button className="secondary" onClick={close}>Keep studying</button><button className="primary" onClick={endSession}>End session</button></div> : <button className="primary" onClick={close}>Got it</button>}</div></div>;
}
